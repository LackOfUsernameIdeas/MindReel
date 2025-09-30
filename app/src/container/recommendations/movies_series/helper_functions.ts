import {
  Genre,
  MoviesSeriesUserPreferences,
  Recommendation,
  RecommendationsAnalysis
} from "./moviesSeriesRecommendations-types";
import {
  Question,
  BrainData,
  FilteredBrainData,
  NotificationState
} from "../../types_common";
import {
  moviesSeriesBrainAnalysisPrompt,
  moviesSeriesStandardPreferencesPrompt,
  openAIKey
} from "./moviesSeriesRecommendations-data";
import { moviesSeriesGenreOptions } from "../../data_common";
import {
  analyzeRecommendations,
  checkRecommendationExistsInWatchlist,
  removeFromWatchlist,
  saveBrainAnalysis,
  saveToWatchlist,
  showNotification,
  validateToken
} from "../../helper_functions_common";

/**
 * Записва предпочитанията на потребителя в базата данни чрез POST заявка.
 * Ако не успее да запише предпочитанията, се хвърля грешка.
 *
 * @async
 * @function saveMoviesSeriesUserPreferences
 * @param {string} date - Датата на записа на предпочитанията.
 * @param {Object} moviesSeriesUserPreferences - Обект с предпочитанията на потребителя.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но хвърля грешка при неуспех.
 * @throws {Error} - Хвърля грешка, ако заявката не е успешна.
 */
export const saveMoviesSeriesUserPreferences = async (
  date: string,
  moviesSeriesUserPreferences: MoviesSeriesUserPreferences,
  token: string | null
): Promise<void> => {
  try {
    const {
      recommendationType,
      genres,
      moods,
      timeAvailability,
      age,
      actors,
      directors,
      interests,
      countries,
      pacing,
      depth,
      targetGroup
    } = moviesSeriesUserPreferences;

    const preferredGenresEn =
      genres.length > 0 ? genres.map((g) => g.en).join(", ") : null;
    const preferredGenresBg =
      genres.length > 0 ? genres.map((g) => g.bg).join(", ") : null;

    const formattedPreferences = {
      token: token,
      preferred_genres_en: preferredGenresEn,
      preferred_genres_bg: preferredGenresBg,
      mood: Array.isArray(moods) ? moods.join(", ") : null,
      timeAvailability,
      preferred_age: age,
      preferred_type: recommendationType,
      preferred_actors: actors,
      preferred_directors: directors,
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
          preferencesType: "movies_series",
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
 * Извлича данни за филм от IMDb чрез няколко различни търсачки в случай на неуспех.
 * Ако не успее да извлече данни от всички търсачки, хвърля грешка.
 *
 * @async
 * @function fetchIMDbIDWithFailover
 * @param {string} movieName - Името на филма, за който се извличат данни.
 * @returns {Promise<Object>} - Връща обект с данни от IMDb за филма.
 * @throws {Error} - Хвърля грешка, ако не успее да извлече данни от всички търсачки.
 */
const fetchIMDbIDWithFailover = async (movieName: string) => {
  const engines = [
    { key: "AIzaSyAUOQzjNbBnGSBVvCZkWqHX7uebGZRY0lg", cx: "244222e4658f44b78" },
    { key: "AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA", cx: "27427e59e17b74763" },
    { key: "AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw", cx: "e59ceff412ebc4313" }
  ];

  for (let engine of engines) {
    try {
      const response = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?key=${
          engine.key
        }&cx=${engine.cx}&q=${encodeURIComponent(movieName)}`
      );

      // Detailed error logging
      if (!response.ok) {
        console.warn(
          `Engine ${engine.cx} returned non-OK status: ${response.status}`
        );
        continue;
      }

      const data = await response.json();

      // Comprehensive data validation
      if (data.error) {
        console.warn(`Engine ${engine.cx} returned an error:`, data.error);
        continue;
      }
      if (!data.items || data.items.length === 0) {
        console.warn(
          `No items found for movie/series: "${movieName}" with engine ${engine.cx}`
        );
        continue;
      }

      console.log(
        `Successfully fetched movie/series data for "${movieName}" using engine: ${engine.cx}`
      );
      return data;
    } catch (error) {
      console.error(`Detailed error with engine ${engine.cx}:`, error);
      // Log the full error for debugging
      if (error instanceof Error) {
        console.error(`Error message: ${error.message}`);
        console.error(`Error stack: ${error.stack}`);
      }
    }
  }
};

/**
 * Извлича YouTube URL за трейлър на даден филм.
 *
 * @async
 * @function fetchYouTubeEmbedTrailer
 * @param {string} recommendation - Заглавието на филма/сериала, за който се търси трейлър.
 * @returns {Promise<string|null>} - Връща пълния YouTube URL или null, ако няма резултат.
 */
const fetchYouTubeEmbedTrailer = async (
  recommendation: string
): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const query = `${recommendation} - official trailer`;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?&maxResults=1&q=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );

    if (!response.ok) {
      console.warn(
        `YouTube API failed for "${recommendation}": ${response.status}`
      );
      return null;
    }

    const data = await response.json();
    const videoId = data.items?.[0]?.id?.videoId;

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (error) {
    console.error(
      `Error fetching YouTube trailer for "${recommendation}":`,
      error
    );
    return null;
  }
};

/**
 * Генерира препоръки за филми или сериали, базирани на предпочитанията на потребителя,
 * като използва OpenAI API за създаване на списък с препоръки.
 * Връща списък с препоръки в JSON формат.
 *
 * @async
 * @function generateMoviesSeriesRecommendations
 * @param {string} date - Датата на генерирането на препоръките.
 * @param {MoviesSeriesUserPreferences} moviesSeriesUserPreferences - Предпочитанията на потребителя за филми/сериали.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setRecommendationList - Функция за задаване на препоръките в компонент.
 * @param {React.Dispatch<React.SetStateAction<{relevantCount: number; totalCount: number;}>>} setRecommendationsAnalysis - Функция за задаване на анализ на препоръките.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @param {boolean} renderBrainAnalysis - параметър за генериране на препоръки, спрямо анализ на мозъчните вълни.
 * @returns {Promise<void>} - Няма връщан резултат, но актуализира препоръките.
 * @throws {Error} - Хвърля грешка, ако заявката за препоръки е неуспешна.
 */
export const generateMoviesSeriesRecommendations = async (
  date: string,
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
  setRecommendationsAnalysis: React.Dispatch<
    React.SetStateAction<RecommendationsAnalysis>
  >,
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >,
  token: string | null,
  renderBrainAnalysis: boolean,
  moviesSeriesUserPreferences?: MoviesSeriesUserPreferences,
  brainData?: FilteredBrainData[]
) => {
  try {
    console.log("brainData", brainData);
    const requestBody =
      renderBrainAnalysis && brainData
        ? moviesSeriesBrainAnalysisPrompt(brainData)
        : moviesSeriesUserPreferences &&
          moviesSeriesStandardPreferencesPrompt(moviesSeriesUserPreferences);

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
      .trim();
    console.log("unescapedData: ", unescapedData);
    const recommendations = JSON.parse(unescapedData);
    console.log("recommendations: ", recommendations);

    const recommendationsToAnalyze = [];

    for (const movieTitle in recommendations) {
      let imdbData;
      try {
        imdbData = await fetchIMDbIDWithFailover(movieTitle);
      } catch (error) {
        console.error(
          `Failed to fetch movie or series data for ${movieTitle}:`,
          error
        );
        continue;
      }

      const imdbItem = imdbData.items.find((item: { link: string }) =>
        item.link.includes("imdb.com/title/")
      );

      console.log(`imdbItem: ${imdbItem}`);

      if (!imdbItem) {
        console.warn(`No valid movie or series item found for: ${imdbItem}`);
        continue; // Skip to the next movie or series
      }

      const imdbUrl = imdbItem.link;
      const imdbId = imdbUrl.match(/title\/(tt\d+)\//)?.[1];

      if (!imdbId) {
        console.warn(`No valid imdb ID found for: ${movieTitle}`);
        continue; // Skip to the next movie or series
      }

      const imdbRating = imdbItem.pagemap.metatags
        ? imdbItem.pagemap.metatags[0]["twitter:title"]?.match(
            /⭐ ([\d.]+)/
          )?.[1]
        : null;
      const runtime = imdbItem.pagemap.metatags
        ? imdbItem.pagemap.metatags[0]["og:description"]?.match(
            /(\d{1,2}h \d{1,2}m|\d{1,2}h|\d{1,3}m)/
          )?.[1]
        : null;

      const translatedRuntime = runtime
        ? runtime.replace(/h/g, "ч").replace(/m/g, "м").replace(/s/g, "с")
        : null;

      const omdbResponse = await fetch(
        `https://www.omdbapi.com/?apikey=89cbf31c&i=${imdbId}&plot=full`
      );

      if (!omdbResponse.ok) {
        console.error(
          `Failed to fetch OMDb data for ${movieTitle}. Status: ${omdbResponse.status}`
        );
        continue; // Skip to the next movie or series
      }

      const omdbData = await omdbResponse.json();

      console.log(
        `OMDb data for ${movieTitle}: ${JSON.stringify(omdbData, null, 2)}`
      );

      const youtubeTrailerUrl = await fetchYouTubeEmbedTrailer(movieTitle);

      const recommendationData = {
        title: omdbData.Title,
        bgName: recommendations[movieTitle].bgName,
        description: recommendations[movieTitle].description,
        reason: recommendations[movieTitle].reason,
        youtubeTrailerUrl: youtubeTrailerUrl,
        year: omdbData.Year,
        rated: omdbData.Rated,
        released: omdbData.Released,
        runtime: omdbData.Runtime,
        runtimeGoogle: translatedRuntime,
        genre: omdbData.Genre,
        director: omdbData.Director,
        writer: omdbData.Writer,
        actors: omdbData.Actors,
        plot: omdbData.Plot,
        language: omdbData.Language,
        country: omdbData.Country,
        awards: omdbData.Awards,
        poster: omdbData.Poster,
        ratings: omdbData.Ratings,
        metascore: omdbData.Metascore,
        imdbRating: omdbData.imdbRating,
        imdbRatingGoogle: imdbRating,
        imdbVotes: omdbData.imdbVotes,
        imdbID: omdbData.imdbID,
        type: omdbData.Type,
        DVD: omdbData.DVD,
        boxOffice: omdbData.BoxOffice,
        production: omdbData.Production,
        website: omdbData.Website,
        totalSeasons: omdbData.totalSeasons
      };

      // Първо, задаваме списъка с препоръки
      setRecommendationList((prevRecommendations) => [
        ...prevRecommendations,
        recommendationData
      ]);

      // След това изпълняваме проверката и записа паралелно, използвайки self-invoking функцията
      (async () => {
        // Проверяваме дали филмът съществува в таблицата за watchlist
        const existsInWatchlist = await checkRecommendationExistsInWatchlist(
          imdbId,
          token
        );

        // Ако филмът не съществува в watchlist, добавяме го към "bookmarkedMovies" с информация за ID и статус
        if (existsInWatchlist) {
          setBookmarkedMovies((prevMovies) => {
            return {
              ...prevMovies,
              [recommendationData.imdbID]: recommendationData
            };
          });
        }
        // Записваме препоръката в базата данни
        await saveMoviesSeriesRecommendation(recommendationData, date, token);
      })();

      recommendationsToAnalyze.push(recommendationData);
    }

    !renderBrainAnalysis &&
      (await analyzeRecommendations(
        moviesSeriesUserPreferences,
        recommendationsToAnalyze,
        setRecommendationsAnalysis,
        true,
        date,
        token
      )); // Извикване на функцията за анализ на предпочитанията и определяне на Precision
  } catch (error) {
    console.error("Error generating recommendations:", error);
  }
};

/**
 * Записва препоръка за филм или сериал в базата данни.
 * Препоръката съдържа подробности за филма/сериала като заглавие, жанр, рейтинг и други.
 * След успешното записване, препоръката се изпраща в сървъра.
 *
 * @async
 * @function saveMoviesSeriesRecommendation
 * @param {Recommendation} recommendation - Обект, съдържащ данни за препоръчания филм или сериал.
 * @param {string} date - Дата на генерирането на препоръката.
 * @param {string | null} token - Токенът на потребителя за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но извършва записване на препоръката.
 * @throws {Error} - Хвърля грешка, ако не може да се запази препоръката в базата данни.
 */
export const saveMoviesSeriesRecommendation = async (
  recommendation: any,
  date: string,
  token: string | null
) => {
  try {
    if (!recommendation || typeof recommendation !== "object") {
      console.warn("No valid recommendation data found.");
      return;
    }

    const genresEn = recommendation.genre
      ? recommendation.genre.split(", ")
      : null;

    const genresBg = genresEn.map((genre: string) => {
      const matchedGenre = moviesSeriesGenreOptions.find(
        (option) => option.en.trim() === genre.trim()
      );
      return matchedGenre ? matchedGenre.bg : null;
    });

    const runtime = recommendation.runtimeGoogle || recommendation.runtime;
    const imdbRating =
      recommendation.imdbRatingGoogle || recommendation.imdbRating;

    const formattedRecommendation = {
      token,
      imdbID: recommendation.imdbID || null,
      title_en: recommendation.title || null,
      title_bg: recommendation.bgName || null,
      genre_en: genresEn.join(", "),
      genre_bg: genresBg.join(", "),
      reason: recommendation.reason || null,
      youtubeTrailerUrl: recommendation.youtubeTrailerUrl || null,
      description: recommendation.description || null,
      year: recommendation.year || null,
      rated: recommendation.rated || null,
      released: recommendation.released || null,
      runtime: runtime || null,
      director: recommendation.director || null,
      writer: recommendation.writer || null,
      actors: recommendation.actors || null,
      plot: recommendation.plot || null,
      language: recommendation.language || null,
      country: recommendation.country || null,
      awards: recommendation.awards || null,
      poster: recommendation.poster || null,
      ratings: recommendation.ratings || [],
      metascore: recommendation.metascore || null,
      imdbRating: imdbRating || null,
      imdbVotes: recommendation.imdbVotes || null,
      type: recommendation.type || null,
      DVD: recommendation.DVD || null,
      boxOffice: recommendation.boxOffice || null,
      production: recommendation.production || null,
      website: recommendation.website || null,
      totalSeasons: recommendation.totalSeasons || null,
      date: date
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
          recommendationType: "movies_series",
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
 * @param {MoviesSeriesUserPreferences} moviesSeriesUserPreferences - Предпочитания на потребителя за филми/сериали.
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
  setRecommendationsAnalysis: React.Dispatch<
    React.SetStateAction<RecommendationsAnalysis>
  >,
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >,
  token: string | null,
  submitCount: number,
  renderBrainAnalysis: boolean = false,
  moviesSeriesUserPreferences?: MoviesSeriesUserPreferences,
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

  if (moviesSeriesUserPreferences) {
    const {
      moods,
      timeAvailability,
      actors,
      directors,
      countries,
      pacing,
      depth,
      targetGroup
    } = moviesSeriesUserPreferences;

    if (
      !renderBrainAnalysis &&
      (!moods ||
        !timeAvailability ||
        !actors ||
        !directors ||
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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/handle-submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: "movies_series"
          })
        }
      );

      const data = await response.json();

      const date = new Date().toISOString();

      if (response.status === 200) {
        setRecommendationList([]);
        if (
          moviesSeriesUserPreferences &&
          Object.keys(moviesSeriesUserPreferences).length > 0
        ) {
          await saveMoviesSeriesUserPreferences(
            date,
            moviesSeriesUserPreferences,
            token
          );
          await saveBrainAnalysis(date, brainData, analysisType, token);
          const filteredBrainData = brainData.map(
            ({ blink_strength, raw_data, data_type, ...rest }) => rest
          );

          await generateMoviesSeriesRecommendations(
            date,
            setRecommendationList,
            setRecommendationsAnalysis,
            setBookmarkedMovies,
            token,
            true,
            moviesSeriesUserPreferences,
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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/handle-submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            type: "movies_series"
          })
        }
      );

      const data = await response.json();

      const date = new Date().toISOString();

      if (response.status === 200) {
        setRecommendationList([]);
        if (
          moviesSeriesUserPreferences &&
          Object.keys(moviesSeriesUserPreferences).length > 0
        ) {
          await saveMoviesSeriesUserPreferences(
            date,
            moviesSeriesUserPreferences,
            token
          );
          await generateMoviesSeriesRecommendations(
            date,
            setRecommendationList,
            setRecommendationsAnalysis,
            setBookmarkedMovies,
            token,
            false,
            moviesSeriesUserPreferences
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
 * Добавя или премахва филм от списъка с любими на потребителя.
 * Прикрепя състоянията на компонентите като параметри, за да актуализира състоянието.
 *
 * @param {object} movie - Филмът, който ще бъде добавен или премахнат.
 * @param {Function} setBookmarkedMovies - Функция за актуализиране на състоянието на отметките.
 * @param {Function} setCurrentBookmarkStatus - Функция за актуализиране на текущия статус на отметката.
 * @param {Function} setAlertVisible - Функция за показване на алармата.
 * @returns {void} - Функцията не връща стойност.
 */
export const handleBookmarkClick = (
  movie: Recommendation,
  setBookmarkedMovies?: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >,
  setCurrentBookmarkStatus?: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertVisible?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setBookmarkedMovies &&
    setBookmarkedMovies((prev) => {
      const isBookmarked = !!prev[movie.imdbID];
      const updatedBookmarks = { ...prev };
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (isBookmarked) {
        // Remove the movie from bookmarks if it's already bookmarked
        delete updatedBookmarks[movie.imdbID];

        removeFromWatchlist(movie.imdbID, token).catch((error) => {
          console.error("Error removing from watchlist:", error);
        });
      } else {
        // Add the movie to bookmarks if it's not already bookmarked
        updatedBookmarks[movie.imdbID] = movie;

        saveToWatchlist(movie, token).catch((error) => {
          console.error("Error saving to watchlist:", error);
        });
      }

      setCurrentBookmarkStatus && setCurrentBookmarkStatus(!isBookmarked); // Update the current bookmark status
      setAlertVisible && setAlertVisible(true); // Show the alert

      return updatedBookmarks; // Return the updated bookmarks object
    });
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
      const selectedGenre = moviesSeriesGenreOptions.find(
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
 * @param {any[]} questions - Массив от въпроси за анкета.
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
 * @param {boolean} renderVrScene - Дали се използва VR сцена.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setRenderVrScene - Функцията за нулиране на VR сцената.
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на компонентите.
 */
export const handleRetakeQuiz = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setIsBrainAnalysisComplete?: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentIndex?: React.Dispatch<React.SetStateAction<number>>,
  renderBrainAnalysis?: boolean,
  renderVrScene?: boolean,
  setRenderVrScene?: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setLoading(true);
  setTimeout(() => {
    setSubmitted(false);
    setLoading(false);

    // Reset brain analysis state if in brain analysis mode
    if (renderBrainAnalysis && setIsBrainAnalysisComplete) {
      setIsBrainAnalysisComplete(false);
    }

    // Reset VR scene state if in VR mode
    if (renderVrScene && setRenderVrScene) {
      setRenderVrScene(false);
    }

    // Reset current index if provided
    if (setCurrentIndex) {
      setCurrentIndex(0);
    }
  }, 500);
};
