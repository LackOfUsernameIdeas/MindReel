import { Genre, MusicUserPreferences } from "./musicRecommendations-types";
import {
  Question,
  BrainData,
  FilteredBrainData,
  NotificationState
} from "../../types_common";
import {
  musicBrainAnalysisPrompt,
  musicStandardPreferencesPrompt,
  openAIKey
} from "./musicRecommendations-data";
import { musicGenreOptions } from "../../data_common";
import { showNotification, validateToken } from "../../helper_functions_common";

/**
 * Записва предпочитанията на потребителя в базата данни чрез POST заявка.
 * Ако не успее да запише предпочитанията, се хвърля грешка.
 *
 * @async
 * @function saveMusicUserPreferences
 * @param {string} date - Датата на записа на предпочитанията.
 * @param {Object} musicUserPreferences - Обект с предпочитанията на потребителя.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но хвърля грешка при неуспех.
 * @throws {Error} - Хвърля грешка, ако заявката не е успешна.
 */
export const saveMusicUserPreferences = async (
  date: string,
  musicUserPreferences: MusicUserPreferences,
  token: string | null
): Promise<void> => {
  try {
    const {
      genres,
      moods,
      age,
      artists,
      producers,
      interests,
      countries,
      pacing,
      depth,
      targetGroup
    } = musicUserPreferences;

    const preferredGenresEn =
      genres.length > 0 ? genres.map((g) => g.en).join(", ") : null;
    const preferredGenresBg =
      genres.length > 0 ? genres.map((g) => g.bg).join(", ") : null;

    const formattedPreferences = {
      token: token,
      preferred_genres_en: preferredGenresEn,
      preferred_genres_bg: preferredGenresBg,
      mood: Array.isArray(moods) ? moods.join(", ") : null,
      preferred_age: age,
      preferred_artists: artists,
      preferred_producers: producers,
      preferred_countries: countries,
      preferred_pacing: pacing,
      preferred_depth: depth,
      preferred_target_group: targetGroup,
      interests: interests || null,
      date: date
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-preferences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          preferencesType: "music",
          preferences: formattedPreferences
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save recommendation");
    }

    const result = await response.json();
    console.log("Recommendation saved successfully:", result);
  } catch (error) {
    console.error("Error saving recommendation:", error);
  }
};

/**
 * Извлича access token от Spotify API чрез Client Credentials Flow.
 *
 * @async
 * @function getSpotifyAccessToken
 * @returns {Promise<string>} - Връща валиден access token.
 * @throws {Error} - Хвърля грешка, ако не може да получи токена.
 */
const getSpotifyAccessToken = async (): Promise<string> => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
    })
  });

  if (!response.ok) {
    throw new Error(
      `Неуспешно получаване на Spotify token: ${response.status}`
    );
  }

  const data = await response.json();
  return data.access_token;
};

/**
 * Извлича данни за песен от Spotify API.
 * Използва предоставения access token, ако има такъв.
 *
 * @async
 * @function fetchSpotifyTrackData
 * @param {string} songTitle - Името на песента.
 * @param {string} artistName - Името на артиста.
 * @param {string} spotifyAccessToken - токен за извличане на данни за песен от Spotify.
 * @returns {Promise<Object>} - Връща обект с информация за песента.
 * @throws {Error} - Хвърля грешка при неуспех.
 */
const fetchSpotifyTrackData = async (
  songTitle: string,
  artistName: string,
  spotifyAccessToken: string
): Promise<any> => {
  try {
    // Search for the track
    const query = `${songTitle} - ${artistName}`;
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Spotify search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (
      !searchData.tracks ||
      !searchData.tracks.items ||
      searchData.tracks.items.length === 0
    ) {
      throw new Error(
        `Няма резултати за песента "${songTitle}" от "${artistName}"`
      );
    }

    console.log(
      `🎵 Успешно намерена песен "${songTitle}" от "${artistName}" в Spotify.`
    );

    return searchData.tracks.items[0]; // Return the first matching track
  } catch (error) {
    console.error("Грешка при извличане на песен от Spotify:", error);
    throw error;
  }
};

/**
 * Извлича YouTube ID за видео на дадена песен с най-много гледания.
 *
 * @async
 * @function fetchMostPopularYouTubeVideoID
 * @param {string} query - query на песента, за която се търси видеоклип.
 * @param {number} maxResults - максимален брой резултати за проверка (по подразбиране 5).
 * @returns {Promise<{videoId: string, stats: Object}|null>} - Връща обект с videoId и статистики или null.
 */
const fetchMostPopularYouTubeVideoID = async (
  query: string,
  maxResults: number = 5
): Promise<{
  videoId: string;
  stats: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
} | null> => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  try {
    // Първо извличаме няколко резултата
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?type=video&maxResults=${maxResults}&q=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );

    if (!searchResponse.ok) {
      console.warn(
        `YouTube search failed for "${query}": ${searchResponse.status}`
      );
      return null;
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items
      ?.map((item: any) => item.id?.videoId)
      .filter(Boolean);

    if (!videoIds || videoIds.length === 0) {
      console.warn(`No videos found for query: "${query}"`);
      return null;
    }

    const videoStats = await fetchYouTubeVideoStats(videoIds.join(","));

    if (!videoStats || videoStats.length === 0) {
      console.warn(`No statistics found for any videos for query: "${query}"`);
      return null;
    }

    // Намираме видеото с най-много гледания
    let mostPopularVideo = null;
    let maxViews = 0;

    for (const video of videoStats) {
      const viewCount = parseInt(video.viewCount || "0");

      if (viewCount > maxViews) {
        maxViews = viewCount;
        mostPopularVideo = video;
      }
    }

    if (!mostPopularVideo) {
      console.warn(
        `No valid video with view count found for query: "${query}"`
      );
      return null;
    }

    return {
      videoId: mostPopularVideo.videoId,
      stats: {
        viewCount: mostPopularVideo.viewCount,
        likeCount: mostPopularVideo.likeCount,
        commentCount: mostPopularVideo.commentCount
      }
    };
  } catch (error) {
    console.error(
      `Error fetching most popular YouTube video for "${query}":`,
      error
    );
    return null;
  }
};

/**
 * Извлича статистически данни за YouTube видео.
 *
 * @async
 * @function fetchYouTubeVideoStats
 * @param {string} videoIds - ID на YouTube видеото или comma-separated IDs за няколко видеа.
 * @returns {Promise<Object[]|null>} - Връща масив от обекти със статистики или null при грешка.
 */
const fetchYouTubeVideoStats = async (
  videoIds: string
): Promise<
  | {
      videoId: string;
      viewCount: string;
      likeCount?: string;
      commentCount?: string;
    }[]
  | null
> => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`
    );

    if (!response.ok) {
      console.warn(
        `YouTube statistics fetch failed for "${videoIds}": ${response.status}`
      );
      return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      console.warn(`No statistics found for video ID(s): ${videoIds}`);
      return null;
    }

    return data.items.map((item: any) => ({
      videoId: item.id,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      commentCount: item.statistics.commentCount
    }));
  } catch (error) {
    console.error(
      `Error fetching YouTube statistics for "${videoIds}":`,
      error
    );
    return null;
  }
};

/**
 * Генерира препоръки за музика, базирани на предпочитанията на потребителя,
 * като използва OpenAI API за създаване на списък с препоръки.
 * Връща списък с препоръки в JSON формат.
 *
 * @async
 * @function generateMusicRecommendations
 * @param {string} date - Датата на генерирането на препоръките.
 * @param {MusicUserPreferences} musicUserPreferences - Предпочитанията на потребителя за песни.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setRecommendationList - Функция за задаване на препоръките в компонент.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @param {boolean} renderBrainAnalysis - параметър за генериране на препоръки, спрямо анализ на мозъчните вълни.
 * @returns {Promise<void>} - Няма връщан резултат, но актуализира препоръките.
 * @throws {Error} - Хвърля грешка, ако заявката за препоръки е неуспешна.
 */
export const generateMusicRecommendations = async (
  date: string,
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
  token: string | null,
  renderBrainAnalysis: boolean,
  musicUserPreferences?: MusicUserPreferences,
  brainData?: FilteredBrainData[]
) => {
  try {
    console.log("brainData", brainData);
    const requestBody =
      renderBrainAnalysis && brainData
        ? musicBrainAnalysisPrompt(brainData)
        : musicUserPreferences &&
          musicStandardPreferencesPrompt(musicUserPreferences);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log("prompt: ", requestBody);

    const responseData = await response.json();
    const responseJson = responseData.choices[0].message.content;
    const unescapedData = responseJson
      .replace(/^```json([\s\S]*?)```$/, "$1")
      .replace(/^```JSON([\s\S]*?)```$/, "$1")
      .replace(/^```([\s\S]*?)```$/, "$1")
      .replace(/^'|'$/g, "")
      .replace(/\\'/g, "'")
      .trim();

    console.log("unescapedData: ", unescapedData);
    const recommendations = JSON.parse(unescapedData);
    console.log("recommendations: ", recommendations);

    const spotifyAccessToken = await getSpotifyAccessToken();

    for (const songTitle in recommendations) {
      const recommendation = recommendations[songTitle];
      const artistName = recommendation.artist;

      let musicData;
      try {
        musicData = await fetchSpotifyTrackData(
          songTitle,
          artistName,
          spotifyAccessToken
        );
      } catch (error) {
        console.error(
          `Failed to fetch music data from Spotify for ${songTitle}:`,
          error
        );
        continue;
      }

      const youtubeMusicVideoData = await fetchMostPopularYouTubeVideoID(
        `${songTitle} - ${artistName}`
      );

      const youtubeMusicVideoID = youtubeMusicVideoData
        ? youtubeMusicVideoData.videoId
        : null;

      const youtubeMusicVideoUrl = youtubeMusicVideoData
        ? `https://www.youtube.com/embed/${youtubeMusicVideoID}`
        : null;

      const youtubeMusicVideoStats = youtubeMusicVideoData?.stats || null;

      const recommendationData = {
        title: musicData.name, // Official title from Spotify
        artists:
          musicData?.artists?.map((artist: any) => artist.name).join(", ") ||
          "", // Artists from Spotify
        description: recommendation.description,
        reason: recommendation.reason,
        durationMs: musicData?.duration_ms || null,
        albumTitle: musicData?.album?.name || null,
        albumType: musicData?.album?.album_type || null,
        albumCover: musicData?.album?.images?.[0]?.url || null,
        albumTotalTracks: musicData?.album?.total_tracks || null,
        albumReleaseDateInSpotify: musicData?.album?.release_date || null,
        spotifyID: musicData.id,
        spotifyUrl: musicData?.external_urls?.spotify || null,
        spotifyPopularity: musicData?.popularity || null,
        youtubeMusicVideoID: youtubeMusicVideoID,
        youtubeMusicVideoUrl: youtubeMusicVideoUrl,
        youtubeMusicVideoViews:
          typeof youtubeMusicVideoStats === "object" &&
          youtubeMusicVideoStats?.viewCount
            ? Number(youtubeMusicVideoStats.viewCount)
            : null,
        youtubeMusicVideoLikes:
          typeof youtubeMusicVideoStats === "object" &&
          youtubeMusicVideoStats?.likeCount
            ? Number(youtubeMusicVideoStats.likeCount)
            : null,
        youtubeMusicVideoComments:
          typeof youtubeMusicVideoStats === "object" &&
          youtubeMusicVideoStats?.commentCount
            ? Number(youtubeMusicVideoStats.commentCount)
            : null
      };

      // Първо, задаваме списъка с препоръки
      setRecommendationList((prevRecommendations) => [
        ...prevRecommendations,
        recommendationData
      ]);

      await saveMusicRecommendation(recommendationData, date, token);
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
  }
};

/**
 * Записва препоръка за песен в базата данни.
 * Препоръката съдържа подробности за песента като заглавие, жанр, рейтинг и други.
 * След успешното записване, препоръката се изпраща в сървъра.
 *
 * @async
 * @function saveMusicRecommendation
 * @param {Recommendation} recommendation - Обект, съдържащ данни за препоръчаната песен.
 * @param {string} date - Дата на генерирането на препоръката.
 * @param {string | null} token - Токенът на потребителя за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но извършва записване на препоръката.
 * @throws {Error} - Хвърля грешка, ако не може да се запази препоръката в базата данни.
 */
export const saveMusicRecommendation = async (
  recommendation: any,
  date: string,
  token: string | null
) => {
  try {
    if (!recommendation || typeof recommendation !== "object") {
      console.warn("No valid recommendation data found.");
      return;
    }

    const formattedRecommendation = {
      token,
      ...recommendation,
      date
    };

    console.log("Formatted Recommendation:", formattedRecommendation);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-recommendation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recommendationType: "music",
          recommendation: formattedRecommendation
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save recommendation");
    }

    const result = await response.json();
    console.log("Recommendation saved successfully:", result);
  } catch (error) {
    console.error("Error saving recommendation:", error);
  }
};

let isOnCooldown = false;

/**
 * Обработва изпращането на потребителски данни за генериране на препоръки.
 * Извършва валидация на полетата, изпраща заявка до сървъра и обновява списъка с препоръки.
 *
 * @async
 * @function handleSubmit
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функция за задаване на статус на зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функция за задаване на статус за подадена заявка.
 * @param {React.Dispatch<React.SetStateAction<number>>} setSubmitCount - Функция за актуализиране на броя на подадените заявки.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setRecommendationList - Функция за актуализиране на списъка с препоръки.
 * @param {MusicUserPreferences} musicUserPreferences - Предпочитания на потребителя за музика.
 * @param {string | null} token - Токенът за аутентификация на потребителя.
 * @param {number} submitCount - Броят на подадените заявки.
 * @param {boolean} [renderBrainAnalysis=false] - Опционален параметър за генериране на препоръки, спрямо анализ на мозъчните вълни.
 * @returns {Promise<void>} - Няма връщан резултат, но актуализира препоръките и записва данни.
 * @throws {Error} - Хвърля грешка, ако не може да се обработи заявката.
 */
export const handleSubmit = async (
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>,
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
  token: string | null,
  submitCount: number,
  renderBrainAnalysis: boolean = false,
  musicUserPreferences?: MusicUserPreferences,
  brainData?: BrainData[],
  analysisType?: "movies_series" | "books"
): Promise<void> => {
  if (isOnCooldown) return;
  isOnCooldown = true;
  const isInvalidToken = await validateToken(setNotification); // Стартиране на проверката на токена при първоначално зареждане
  if (isInvalidToken) {
    return;
  }

  if (submitCount >= 20) {
    showNotification(
      setNotification,
      "Достигнахте максималния брой предложения! Максималният брой опити е 20 за днес. Можете да опитате отново утре!",
      "error"
    );
    return;
  }

  if (musicUserPreferences) {
    const { moods, artists, producers, countries, pacing, depth, targetGroup } =
      musicUserPreferences;

    if (
      !renderBrainAnalysis &&
      (!moods ||
        !artists ||
        !producers ||
        !countries ||
        !pacing ||
        !depth ||
        !targetGroup)
    ) {
      showNotification(
        setNotification,
        "Моля, попълнете всички задължителни полета!",
        "warning"
      );
      return;
    }
  }

  setLoading(true);
  if (!renderBrainAnalysis) setSubmitted(true);

  try {
    if (renderBrainAnalysis && analysisType && brainData) {
      // Ако се съставя мозъчен анализ се изпълнява следния код
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/handle-submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: "music"
          })
        }
      );

      const data = await response.json();

      const date = new Date().toISOString();

      if (response.status === 200) {
        setRecommendationList([]);
        if (
          musicUserPreferences &&
          Object.keys(musicUserPreferences).length > 0
        ) {
          // await saveMusicUserPreferences(date, musicUserPreferences, token);
          // await saveBrainAnalysis(date, brainData, analysisType, token);
          const filteredBrainData = brainData.map(
            ({ blink_strength, raw_data, data_type, ...rest }) => rest
          );

          await generateMusicRecommendations(
            date,
            setRecommendationList,
            token,
            true,
            musicUserPreferences,
            filteredBrainData
          );
        }
        setSubmitCount((prevCount) => prevCount + 1);
      } else {
        showNotification(
          setNotification,
          data.error || "Възникна проблем.",
          "error"
        );
      }
    } else {
      // Ако НЕ се съставя мозъчен анализ се изпълнява следния код
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/handle-submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: "music"
          })
        }
      );

      const data = await response.json();

      const date = new Date().toISOString();

      if (response.status === 200) {
        setRecommendationList([]);
        if (
          musicUserPreferences &&
          Object.keys(musicUserPreferences).length > 0
        ) {
          await saveMusicUserPreferences(date, musicUserPreferences, token);
          await generateMusicRecommendations(
            date,
            setRecommendationList,
            token,
            false,
            musicUserPreferences
          );
        }
        setSubmitCount((prevCount) => prevCount + 1);
      } else {
        showNotification(
          setNotification,
          data.error || "Възникна проблем.",
          "error"
        );
      }
    }
  } catch (error) {
    console.error("Error submitting the request:", error);
    showNotification(
      setNotification,
      "Възникна проблем при изпращането на заявката.",
      "error"
    );
  } finally {
    setTimeout(() => {
      isOnCooldown = false;
    }, 500);
    setLoading(false);
    if (renderBrainAnalysis) setSubmitted(true);
  }
};

/**
 * Превключва състоянието на жанр в списъка на избраните жанрове.
 * Ако жанрът е вече в списъка, го премахва; ако не е, го добавя.
 *
 * @function toggleGenre
 * @param {Genre} genre - Жанрът, който трябва да бъде добавен или премахнат.
 * @param {React.Dispatch<React.SetStateAction<Genre[]>>} setGenres - Функцията за актуализиране на списъка с избрани жанрове.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на жанровете.
 */
export const toggleGenre = (
  genre: Genre,
  setGenres: React.Dispatch<React.SetStateAction<Genre[]>>
): void => {
  setGenres((prevGenres) =>
    prevGenres.find((g) => g.en === genre.en)
      ? prevGenres.filter((g) => g.en !== genre.en)
      : [...prevGenres, genre]
  );
};

/**
 * Проверява дали дадена опция е жанр, базирайки се на наличието на определени свойства в обекта.
 * Връща `true`, ако обектът има свойства `en` и `bg` със стойности от тип "string".
 *
 * @function isGenreOption
 * @param {any} option - Опцията, която трябва да бъде проверена.
 * @returns {boolean} - Връща `true`, ако опцията е жанр, в противен случай `false`.
 */
export function isGenreOption(option: any): option is Genre {
  return (
    option && typeof option.en === "string" && typeof option.bg === "string"
  );
}

/**
 * Обработва избора на отговор от потребителя в зависимост от типа на въпроса (множество или един отговор).
 * Актуализира състоянието на отговорите и жанровете в компонента.
 *
 * @async
 * @function handleAnswerClick
 * @param {React.Dispatch<React.SetStateAction<any>>} setter - Функцията за актуализиране на отговорите в компонента.
 * @param {string} answer - Избраният отговор от потребителя.
 * @param {React.Dispatch<React.SetStateAction<Genre[]>>} setGenres - Функцията за актуализиране на избраните жанрове.
 * @param {Question} currentQuestion - Текущият въпрос, с неговите свойства.
 * @param {string[] | null} selectedAnswer - Съществуващият избран отговор.
 * @param {React.Dispatch<React.SetStateAction<string[] | null>>} setSelectedAnswer - Функцията за актуализиране на състоянието на избраните отговори.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието.
 */
export const handleAnswerClick = (
  setter: React.Dispatch<React.SetStateAction<any>>,
  answer: string,
  setGenres: React.Dispatch<React.SetStateAction<Genre[]>>,
  currentQuestion: Question,
  selectedAnswer: string[] | null,
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>
) => {
  if (currentQuestion.isMultipleChoice) {
    if (currentQuestion.setter === setGenres) {
      const selectedGenre = musicGenreOptions.find(
        (genre) => genre.bg === answer
      );

      if (selectedGenre) {
        toggleGenre(selectedGenre, setGenres);

        return selectedAnswer;
      }

      return selectedAnswer;
    } else {
      setSelectedAnswer((prev) => {
        const updatedAnswers = prev
          ? prev.includes(answer)
            ? prev.filter((item) => item !== answer)
            : [...prev, answer]
          : [answer];
        setter(updatedAnswers);
        return updatedAnswers;
      });
    }
  } else {
    setter(answer);
    setSelectedAnswer([answer]);
  }
};

/**
 * Обработва промяната на стойността в текстовото поле.
 * Актуализира състоянието на полето с новата стойност.
 *
 * @function handleInputChange
 * @param {React.Dispatch<React.SetStateAction<any>>} setter - Функцията за актуализиране на състоянието на стойността.
 * @param {string} value - Новата стойност, въведена в полето.
 * @returns {void} - Няма връщан резултат, но актуализира стойността в състоянието.
 */
export const handleInputChange = (
  setter: React.Dispatch<React.SetStateAction<any>>,
  value: string
): void => {
  setter(value);
};

/**
 * Обработва показването на препоръки, като скрива въпроса и показва индикатор за зареждане.
 * След време показва резултата от подадените отговори.
 *
 * @function handleViewRecommendations
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowQuestion - Функцията за скриване на въпроса.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функцията за показване на индикатора за зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функцията за показване на резултата.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на компонента.
 */
export const handleViewRecommendations = (
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setShowQuestion(false);
  setLoading(true);

  setTimeout(() => {
    setSubmitted(true);
    setLoading(false);
  }, 500);
};

/**
 * Обработва преминаването към следващия въпрос в анкета/въпросник.
 * Актуализира индекса на текущия въпрос и показва новия въпрос.
 *
 * @function handleNext
 * @param {React.Dispatch<React.SetStateAction<string[] | null>>} setSelectedAnswer - Функцията за изчистване на избраните отговори.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowQuestion - Функцията за показване на следващия въпрос.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentQuestionIndex - Функцията за актуализиране на индекса на текущия въпрос.
 * @param {any[]} questions - Масив от въпроси за анкета.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на въпросите.
 */
export const handleNext = (
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>,
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  questions: any[]
): void => {
  if (isOnCooldown) return;
  isOnCooldown = true;
  setSelectedAnswer(null);
  setShowQuestion(false);
  setTimeout(() => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setShowQuestion(true);
    setTimeout(() => {
      isOnCooldown = false;
    }, 500);
  }, 300);
};

/**
 * Обработва връщането към предишния въпрос в анкета/въпросник.
 * Актуализира индекса на текущия въпрос и показва предишния въпрос.
 *
 * @function handleBack
 * @param {React.Dispatch<React.SetStateAction<string[] | null>>} setSelectedAnswer - Функцията за изчистване на избраните отговори.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setShowQuestion - Функцията за показване на предишния въпрос.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentQuestionIndex - Функцията за актуализиране на индекса на текущия въпрос.
 * @param {any[]} questions - Массив от въпроси за анкета.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на въпросите.
 */
export const handleBack = (
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string[] | null>>,
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  questions: any[]
): void => {
  setSelectedAnswer(null);
  setShowQuestion(false);
  setTimeout(() => {
    setCurrentQuestionIndex(
      (prev) => (prev - 1 + questions.length) % questions.length
    );
    setShowQuestion(true);
  }, 300);
};

/**
 * Обработва започването на нова анкета, като нулира състоянието на отговорите и резултатите.
 *
 * @function handleRetakeQuiz
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функцията за показване на индикатора за зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функцията за нулиране на състоянието на резултата.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsBrainAnalysisComplete - Функцията за нулиране на състоянието на завършен мозъчен анализ.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentIndex - Функцията за нулиране на текущия индекс.
 * @param {boolean} renderBrainAnalysis - Дали се използва мозъчен анализ.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на компонентите.
 */
export const handleRetakeQuiz = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setIsBrainAnalysisComplete?: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentIndex?: React.Dispatch<React.SetStateAction<number>>,
  renderBrainAnalysis?: boolean
): void => {
  setLoading(true);
  setTimeout(() => {
    setSubmitted(false);
    setLoading(false);

    // Reset brain analysis state if in brain analysis mode
    if (renderBrainAnalysis && setIsBrainAnalysisComplete) {
      setIsBrainAnalysisComplete(false);
    }

    // Reset current index if provided
    if (setCurrentIndex) {
      setCurrentIndex(0);
    }
  }, 500);
};
