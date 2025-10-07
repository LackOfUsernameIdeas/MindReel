import { moviesSeriesGenreOptions } from "./data_common";
import { MoviesSeriesUserPreferences } from "./recommendations/movies_series/moviesSeriesRecommendations-types";
import {
  ActorData,
  Analysis,
  BookRecommendation,
  BrainData,
  DirectorData,
  Genre,
  MovieSeriesRecommendation,
  MovieSeriesRecommendationBeforeSaving,
  NotificationState,
  NotificationType,
  Question,
  RecommendationsAnalysis,
  WriterData
} from "./types_common";
import { io } from "socket.io-client";

// ==============================
// Type Guards
// ==============================

/**
 * Проверява дали даден обект е от тип DirectorData.
 *
 * @param {any} item - Обектът за проверка.
 * @returns {boolean} - Вярно, ако обектът е DirectorData.
 */
export const isDirector = (item: any): item is DirectorData =>
  item && "director_bg" in item;

/**
 * Проверява дали даден обект е от тип ActorData.
 *
 * @param {any} item - Обектът за проверка.
 * @returns {boolean} - Вярно, ако обектът е ActorData.
 */
export const isActor = (item: any): item is ActorData =>
  item && "actor_bg" in item;

/**
 * Проверява дали даден обект е от тип WriterData.
 *
 * @param {any} item - Обектът за проверка.
 * @returns {boolean} - Вярно, ако обектът е WriterData.
 */
export const isWriter = (item: any): item is WriterData =>
  item && "writer_bg" in item;

// ==============================
// Функции за работа с данни
// ==============================

/**
 * Изпраща уведомление със съобщение и тип към състоянието на уведомления.
 * Използва се за показване на различни уведомления (например: успех, грешка и т.н.).
 *
 * @function showNotification
 * @param {React.Dispatch<React.SetStateAction<NotificationState | null>>} setNotification - Функция за задаване на състоянието на уведомлението.
 * @param {string} message - Съобщението, което ще бъде показано в уведомлението.
 * @param {NotificationType} type - Типът на уведомлението, например: 'успех', 'грешка', 'информация' и т.н.
 * @returns {void} - Функцията не връща стойност, а само актуализира състоянието на уведомлението.
 */
export const showNotification = (
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >,
  message: string,
  type: NotificationType
) => {
  // Актуализира състоянието на уведомлението със съобщение и тип
  setNotification({ message, type });
};

/**
 * Проверява валидността на потребителския токен и показва уведомление, ако токенът е невалиден.
 *
 * @async
 * @param setNotification - Функция за задаване на състоянието на уведомлението в React.
 * @returns {Promise<string | null>} - Промис, който се изпълнява, когато проверката на токена приключи.
 * @remarks
 * Ако токенът е невалиден, се показва уведомление на потребителя, че сесията му е изтекла и трябва да влезе отново.
 */
export const validateToken = async (
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >
): Promise<string | null> => {
  const redirectUrl = await checkTokenValidity();
  if (redirectUrl) {
    showNotification(
      setNotification,
      "Вашата сесия е изтекла. Моля, влезте в профила Ви отново.",
      "error"
    );
    return redirectUrl;
  }
  return null;
};

/**
 * Превежда текста от английски на български, като използва Google Translate API.
 * Ако заявката за превод е неуспешна, се връща оригиналният текст.
 *
 * @async
 * @function translate
 * @param {string} entry - Текстът, който трябва да бъде преведен.
 * @returns {Promise<string>} - Преведеният текст на български език.
 * @throws {Error} - Хвърля грешка, ако не успее да преведе текста.
 */
export async function translate(entry: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bg&dt=t&q=${entry}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const flattenedTranslation = data[0]
      .map((item: [string]) => item[0])
      .join(" ");

    // Check if the translated text contains URL-encoded sequences
    const encodedPattern = /%[0-9A-Fa-f]{2}/;
    if (encodedPattern.test(flattenedTranslation)) {
      console.error(
        `Invalid translation: Detected URL-encoded characters in response "${flattenedTranslation}"`
      );
      return entry;
    }

    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
}

/**
 * Превежда текст от чужд език на български, използвайки Google Translate API.
 * Детектира входния език.
 * Ако заявката за превод е неуспешна, се връща оригиналният текст.
 *
 * @async
 * @function translateWithDetection
 * @param {string} entry - Текстът, който трябва да бъде преведен.
 * @returns {Promise<string>} - Преведеният текст на български език, или оригиналният текст, ако не е на английски или при грешка.
 * @throws {Error} - Хвърля грешка, ако не успее да преведе текста.
 */
export async function translateWithDetection(entry: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=bg&dt=t&q=${encodeURIComponent(
    entry
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const flattenedTranslation = data[0]
      .map((item: [string]) => item[0])
      .join(" ");

    const mergedTranslation = flattenedTranslation.replace(/\s+/g, " ").trim();
    return mergedTranslation;
  } catch (error) {
    console.error(`Error translating entry: ${entry}`, error);
    return entry;
  }
}

/**
 * Проверява дали препоръката вече съществува в списъка за гледане на потребителя.
 *
 * @async
 * @function checkRecommendationExistsInWatchlist
 * @param {string} imdbID - IMDb ID на препоръката.
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<boolean>} - Връща true, ако препоръката вече съществува.
 * @throws {Error} - Хвърля грешка, ако проверката не може да бъде извършена.
 */
export const checkRecommendationExistsInWatchlist = async (
  imdbID: string,
  token: string | null
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/check-for-recommendation-in-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          imdbID,
          recommendationType: "movies_series"
        })
      }
    );

    if (response.status === 404) {
      throw new Error("Грешка при проверка на списъка за гледане.");
    }

    const result = await response.json();
    console.log("result: ", result.exists, imdbID);

    return result.exists || false;
  } catch (error) {
    console.error("Грешка при проверката:", error);
    return false;
  }
};

/**
 * Проверява дали препоръката вече съществува в списъка за четене на потребителя.
 *
 * @async
 * @function checkRecommendationExistsInReadlist
 * @param {string} book_id - google_books_id / goodreads_id на препоръката.
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @param {string | null} source  - GoogleBooks или Goodreads.
 * @returns {Promise<boolean>} - Връща true, ако препоръката вече съществува.
 * @throws {Error} - Хвърля грешка, ако проверката не може да бъде извършена.
 */
export const checkRecommendationExistsInReadlist = async (
  book_id: string,
  token: string | null,
  source: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/check-for-recommendation-in-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          source: source,
          book_id,
          recommendationType: "books"
        })
      }
    );

    if (response.status === 404) {
      throw new Error("Грешка при проверка на списъка за четене.");
    }

    const result = await response.json();
    console.log(
      "result: ",
      result.exists,
      book_id,
      "source: ",
      import.meta.env.VITE_BOOKS_SOURCE
    );

    return result.exists || false;
  } catch (error) {
    console.error("Грешка при проверката:", error);
    return false;
  }
};

/**
 * Записва препоръка за филм или сериал в списъка за гледане на потребителя.
 * Препоръката съдържа подробности като заглавие, жанр, рейтинг и други.
 * След успешното записване, данните се изпращат до сървъра чрез съответния API маршрут.
 *
 * @async
 * @function saveToWatchlist
 * @param {any} recommendation - Обект с данни за препоръката (филм или сериал).
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат записани.
 */
export const saveToWatchlist = async (
  recommendation: any,
  token: string | null
): Promise<void> => {
  try {
    if (!recommendation || typeof recommendation !== "object") {
      console.warn("Няма валидни данни за препоръката.");
      return;
    }

    // Проверка дали съществува в списъка за гледане
    const exists = await checkRecommendationExistsInWatchlist(
      recommendation.imdbID,
      token
    );

    if (exists) {
      console.log("Препоръката вече е добавена в списъка за гледане.");
      return;
    }

    const title_en = recommendation.title_en || recommendation.title || null;
    const title_bg = recommendation.title_bg || recommendation.bgName || null;
    const genresEn = recommendation.genre_en || recommendation.genre || null;

    const genresEnArray = recommendation.genre
      ? recommendation.genre.split(", ")
      : null;

    const genresBg =
      recommendation.genre_bg ||
      genresEnArray
        .map((genre: string) => {
          const matchedGenre = moviesSeriesGenreOptions.find(
            (option) => option.en.trim() === genre.trim()
          );
          return matchedGenre ? matchedGenre.bg : null;
        })
        .join(", ") ||
      null;

    const runtime = recommendation.runtimeGoogle || recommendation.runtime;
    const imdbRating =
      recommendation.imdbRatingGoogle || recommendation.imdbRating;

    const formattedRecommendation = {
      token,
      imdbID: recommendation.imdbID || null,
      title_en: title_en,
      title_bg: title_bg,
      genre_en: genresEn,
      genre_bg: genresBg,
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
      totalSeasons: recommendation.totalSeasons || null
    };

    console.log("formattedRecommendation: ", formattedRecommendation);
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-to-list`,
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
      throw new Error(
        "Неуспешно записване на препоръката в списъка за гледане."
      );
    }

    const result = await response.json();
    console.log("Препоръката е успешно добавена:", result);
  } catch (error) {
    console.error("Грешка при записването в списъка за гледане:", error);
  }
};

/**
 * Записва препоръка за книга в списъка за четене на потребителя.
 * Препоръката съдържа подробности като заглавие, жанр, рейтинг и други.
 * След успешното записване, данните се изпращат до сървъра чрез съответния API маршрут.
 *
 * @async
 * @function saveToReadlist
 * @param {any} recommendation - Обект с данни за препоръката (книга).
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат записани.
 */
export const saveToReadlist = async (
  recommendation: any,
  token: string | null
): Promise<void> => {
  try {
    if (!recommendation || typeof recommendation !== "object") {
      console.warn("Няма валидни данни за препоръката.");
      return;
    }

    // Проверка дали съществува в списъка за четене
    const exists = await checkRecommendationExistsInReadlist(
      recommendation.google_books_id || recommendation.goodreads_id,
      token,
      recommendation.source
    );

    if (exists) {
      console.log("Препоръката вече е добавена в списъка за четене.");
      return;
    }

    const formattedRecommendation = {
      token,
      google_books_id: recommendation.google_books_id || null,
      goodreads_id: recommendation.goodreads_id || null,
      title_en: recommendation.title_en || null,
      original_title: recommendation.original_title || null,
      title_bg: recommendation.title_bg || null,
      real_edition_title: recommendation.real_edition_title || null,
      author: recommendation.author || null,
      genre_en: recommendation.genre_en || null,
      genre_bg: recommendation.genre_bg || null,
      description: recommendation.description || null,
      language: recommendation.language || null,
      origin: recommendation.origin || null,
      date_of_first_issue: recommendation.date_of_first_issue || null,
      date_of_issue: recommendation.date_of_issue || null,
      publisher: recommendation.publisher || null,
      goodreads_rating: recommendation.goodreads_rating || null,
      goodreads_ratings_count: recommendation.goodreads_ratings_count || null,
      goodreads_reviews_count: recommendation.goodreads_reviews_count || null,
      reason: recommendation.reason || null,
      adaptations: recommendation.adaptations || null,
      ISBN_10: recommendation.ISBN_10 || null,
      ISBN_13: recommendation.ISBN_13 || null,
      page_count: recommendation.page_count || null,
      book_format: recommendation.book_format || null,
      imageLink: recommendation.imageLink || null,
      literary_awards: recommendation.literary_awards || null,
      setting: recommendation.setting || null,
      characters: recommendation.characters || null,
      series: recommendation.series || null,
      source: recommendation.source || null
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-to-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recommendationType: "books",
          recommendation: formattedRecommendation
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Неуспешно записване на препоръката в списъка за четене."
      );
    }

    const result = await response.json();
    console.log("Препоръката е успешно добавена:", result);
  } catch (error) {
    console.error("Грешка при записването в списъка за четене:", error);
  }
};

/**
 * Премахва филм или сериал от списъка за гледане на потребителя.
 *
 * @async
 * @function removeFromWatchlist
 * @param {string} imdbID - Уникален идентификатор на филма или сериала (IMDb ID).
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат премахнати.
 */
export const removeFromWatchlist = async (
  imdbID: string,
  token: string | null
): Promise<void> => {
  try {
    if (!imdbID) {
      console.warn("IMDb ID is required to remove a movie from the watchlist.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/remove-from-list`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          imdbID,
          recommendationType: "movies_series"
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to remove the movie or series from the watchlist."
      );
    }

    const result = await response.json();
    console.log("Successfully removed from watchlist:", result);
  } catch (error) {
    console.error("Error removing from watchlist:", error);
  }
};

/**
 * Премахва книга от списъка за четене на потребителя.
 *
 * @async
 * @function removeFromReadlist
 * @param {string} book_id - Уникален идентификатор на книгата.
 * @param {string | null} token - Токен за автентикация на потребителя.
 * @param {string | null} source  - GoogleBooks или Goodreads.
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако данните не могат да бъдат премахнати.
 */
export const removeFromReadlist = async (
  book_id: string,
  token: string | null,
  source: string
): Promise<void> => {
  try {
    if (!book_id) {
      console.warn("book_id is required to remove a book from the readlist.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/remove-from-list`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          source: source,
          book_id,
          recommendationType: "books"
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove the book from the readlist.");
    }

    const result = await response.json();
    console.log("Successfully removed from readlist:", result);
  } catch (error) {
    console.error("Error removing from readlist:", error);
  }
};

/**
 * Проверява дали токенът, съхранен в localStorage или sessionStorage, е валиден,
 * и връща URL за пренасочване, ако токенът не е валиден.
 *
 * @async
 * @function checkTokenValidity
 * @returns {Promise<string | null>} - Връща URL за пренасочване или null, ако токенът е валиден.
 * @throws {Error} - Хвърля грешка, ако заявката за проверка на токена е неуспешна.
 */
export const checkTokenValidity = async (): Promise<string | null> => {
  // Извличане на токена от localStorage или sessionStorage
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  if (!token) {
    // Ако няма намерен токен, връща URL за пренасочване
    return "/signin";
  }

  try {
    // Изпращане на заявка за валидиране на токена
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/token-validation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token }) // Предаване на токена в тялото на заявката
      }
    );

    const data = await response.json(); // Извличане на отговора като JSON

    if (!data.valid) {
      // Ако "valid" в отговора е false, връща URL за пренасочване
      console.warn("Token is invalid, redirecting to /signin...");
      return "/signin";
    }

    return null; // Токенът е валиден, няма нужда от пренасочване
  } catch (error) {
    // Обработка на грешки при валидирането на токена
    console.error("Error validating token:", error);
    return "/signin"; // Пренасочване към страницата за вход
  }
};

/**
 * Функция за обработка на жанровете.
 * Ако жанровете са подадени като string, те се разделят на елементи и се добавят към state.
 * Ако жанровете не са в очаквания формат, се задава празен масив.
 *
 * @param {any} genres - Жанровете, които ще бъдат обработени. Може да бъде string.
 * @param {(value: React.SetStateAction<string[]>) => void} setGenres - Функция за сетване на жанровете в state.
 */
export const processGenres = (
  genres: any,
  setGenres: (value: React.SetStateAction<string[]>) => void
) => {
  if (typeof genres === "string") {
    const genreStrings = genres.split(",").map((genre: string) => genre.trim());
    setGenres(genreStrings);
  } else {
    console.warn("Неочакван формат за жанровете на Goodreads:", genres);
    setGenres([]); // Връща празен масив, ако жанровете не са в правилния формат
  }
};

/**
 * Добавя или премахва филм от списъка с любими на потребителя.
 * Прикрепя състоянията на компонентите като параметри, за да актуализира състоянието.
 *
 * @param {object} movie - Филмът, който ще бъде добавен или премахнат.
 * @param {string} movie.imdbID - Уникален идентификатор на филма (IMDb ID).
 * @param {Function} setBookmarkedMovies - Функция за актуализиране на състоянието на отметките.
 * @param {Function} setCurrentBookmarkStatus - Функция за актуализиране на текущия статус на отметката.
 * @param {Function} setAlertVisible - Функция за показване на алармата.
 * @returns {void} - Функцията не връща стойност.
 */
export const handleMovieSeriesBookmarkClick = (
  movie: MovieSeriesRecommendation,
  setBookmarkedMovies?: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >,
  setCurrentBookmarkStatus?: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertVisible?: React.Dispatch<React.SetStateAction<boolean>>
): void => {
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
 * Добавя или премахва книга от списъка с отметки на потребителя.
 * Актуализира състоянията на компонентите чрез подадените функции.
 *
 * @param {object} book - Книгата, която ще бъде добавена или премахната от отметките.
 * @param {string} book.google_books_id - Уникален идентификатор за Google Books.
 * @param {string} book.goodreads_id - Уникален идентификатор за Goodreads.
 * @param {Function} setBookmarkedBooks - Функция за актуализиране на състоянието на списъка с отметки.
 * @param {Function} setCurrentBookmarkStatus - Функция за актуализиране на текущия статус на отметката.
 * @param {Function} setAlertVisible - Функция за показване на известие.
 * @returns {void} - Функцията не връща стойност.
 */
export const handleBookBookmarkClick = (
  book: BookRecommendation,
  setBookmarkedBooks?: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >,
  setCurrentBookmarkStatus?: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertVisible?: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setBookmarkedBooks &&
    setBookmarkedBooks((prev) => {
      // Проверка дали книгата вече е добавена в списъка с отметки
      const isBookmarked = !!prev[book.google_books_id || book.goodreads_id];
      const updatedBookmarks = { ...prev };
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (isBookmarked) {
        // Премахване на книгата от списъка с отметки, ако вече е добавена
        delete updatedBookmarks[book.google_books_id || book.goodreads_id];

        removeFromReadlist(
          book.google_books_id || book.goodreads_id,
          token,
          book.source
        ).catch((error) => {
          console.error("Грешка при премахване от списъка за четене:", error);
        });
      } else {
        // Добавяне на книгата в списъка с отметки, ако все още не е добавена
        updatedBookmarks[book.google_books_id || book.goodreads_id] = book;

        saveToReadlist(book, token).catch((error) => {
          console.error("Грешка при запазване в списъка за четене:", error);
        });
      }

      // Актуализиране на текущия статус на отметката
      setCurrentBookmarkStatus && setCurrentBookmarkStatus(!isBookmarked);

      // Показване на известие
      setAlertVisible && setAlertVisible(true);

      // Връщане на актуализирания обект със списъка с отметки
      return updatedBookmarks;
    });
};

/**
 * Форматира предпочитанията за анализ в зависимост от флага `shouldFormat`.
 *
 * @param {any} moviesSeriesUserPreferences - Предпочитания на потребителя за филми/сериали.
 * @returns {any} Форматираните или неформатирани предпочитания в зависимост от флага.
 */
const formatPreferences = (
  moviesSeriesUserPreferences: MoviesSeriesUserPreferences
) => {
  const {
    recommendationType,
    genres,
    moods,
    timeAvailability,
    age,
    targetGroup
  } = moviesSeriesUserPreferences;

  // Форматираме предпочитаните жанрове (на английски)
  const preferredGenresEn =
    genres.length > 0 ? genres.map((g: Genre) => g.en).join(", ") : "";

  // Връщаме форматираните предпочитания
  return {
    preferred_genres_en: preferredGenresEn,
    mood: Array.isArray(moods) ? moods.join(", ") : "",
    timeAvailability,
    preferred_age: age,
    preferred_type: recommendationType,
    preferred_target_group: targetGroup
  };
};

/**
 * Форматира препоръките, като разделя жанровете и добавя допълнителни данни за всяка препоръка.
 *
 * @param {Array} recommendations - Масив от препоръки, които трябва да бъдат форматирани.
 * @returns {Array} Форматираните препоръки.
 */
const formatRecommendations = (
  recommendations: MovieSeriesRecommendationBeforeSaving[]
): any[] => {
  return recommendations.map((recommendation) => {
    // Разделяме жанровете на английски, ако има
    const genresEn = recommendation.genre
      ? recommendation.genre.split(", ")
      : null;

    // Преобразуваме жанровете на английски в жанрове на български
    const genresBg = genresEn?.map((genre: string) => {
      const matchedGenre = moviesSeriesGenreOptions.find(
        (option) => option.en.trim() === genre.trim()
      );
      return matchedGenre ? matchedGenre.bg : null;
    });

    // Вземаме времето на изпълнение от Google или от оригиналния запис
    const runtime = recommendation.runtimeGoogle || recommendation.runtime;

    // Вземаме IMDb рейтинга от Google или от оригиналния запис
    const imdbRating =
      recommendation.imdbRatingGoogle || recommendation.imdbRating;

    // Връщаме форматираните данни за всяка препоръка
    return {
      imdbID: recommendation.imdbID || null,
      title_en: recommendation.title || null,
      title_bg: recommendation.bgName || null,
      genre_en: genresEn?.join(", ") || null,
      genre_bg: genresBg?.join(", ") || null,
      reason: recommendation.reason || null,
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
      totalSeasons: recommendation.totalSeasons || null
    };
  });
};

/**
 * Анализира препоръките и определя броя на релевантните сред тях.
 *
 * @async
 * @function analyzeRecommendations
 * @param {any} moviesSeriesUserPreferences - Предпочитания на потребителя за филми/сериали.
 * @param {Array} recommendations - Масив от препоръки, които трябва да бъдат проверени.
 * @param {React.Dispatch<React.SetStateAction<RecommendationsAnalysis | null>>} setRecommendationsAnalysis - Функция за задаване на анализ на препоръките.
 * @param {string} date - Датата на генерирането на препоръките.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @param {boolean} [shouldFormat=false] - Параметър за указване дали да се ре-форматират предпочитанията и препоръките.
 * @returns {Promise<{relevantCount: number, totalCount: number}>} Обект с броя на релевантните препоръки и общия брой.
 */
export const analyzeRecommendations = async (
  moviesSeriesUserPreferences: any,
  recommendations: any,
  setRecommendationsAnalysis: React.Dispatch<
    React.SetStateAction<RecommendationsAnalysis>
  >,
  shouldFormat: boolean = true,
  date?: string,
  token?: string | null
) => {
  let totalCount = recommendations.length;

  const formattedPreferencesForAnalysis = shouldFormat
    ? formatPreferences(moviesSeriesUserPreferences)
    : moviesSeriesUserPreferences;

  const formattedRecommendations = shouldFormat
    ? formatRecommendations(recommendations)
    : recommendations;

  try {
    // Изпраща заявка с предпочитанията и целия списък от препоръки
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/check-relevance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userPreferences: formattedPreferencesForAnalysis,
          recommendations: formattedRecommendations
        })
      }
    );

    // Проверка за успешен отговор
    if (!response.ok) {
      console.error(`Error checking relevance: ${response.statusText}`);
      return { relevantCount: 0, totalCount };
    }

    // Извличане на резултатите
    const data: Analysis[] = await response.json();

    // Намиране на брой на релевантните препоръки
    let relevantCount = data.filter((rec) => rec.isRelevant).length;

    // Изчисляване на Precision за това генериране (current round)
    let precisionValue = totalCount > 0 ? relevantCount / totalCount : 0;
    let precisionPercentage = parseFloat((precisionValue * 100).toFixed(2));

    const result = {
      relevantCount,
      totalCount,
      precisionValue,
      precisionPercentage,
      relevantRecommendations: data
    };
    setRecommendationsAnalysis(result);

    console.log({
      relevantCount,
      totalCount,
      precisionValue,
      precisionPercentage,
      relevantRecommendations: data,
      date,
      token
    });
    // Записване на анализа в базата данни
    date &&
      token &&
      (await saveAnalysisToDatabase({
        relevantCount,
        totalCount,
        precisionValue,
        precisionPercentage,
        relevantRecommendations: data,
        date,
        token
      }));

    return result;
  } catch (error) {
    console.error("Error fetching relevance data:", error);
    return { relevantCount: 0, totalCount };
  }
};

/**
 * Функция за запис на анализа в базата данни
 * @async
 * @function saveAnalysisToDatabase
 * @param {Object} analysisData - Данни за анализа.
 * @param {number} analysisData.relevantCount - Брой на релевантните препоръки.
 * @param {number} analysisData.totalCount - Общо количество на препоръките.
 * @param {number} analysisData.precisionValue - Стойност на precision.
 * @param {number} analysisData.precisionPercentage - Процент на precision.
 * @param {number} analysisData.relevantRecommendations - Масив с препоръки след анализ.
 * @param {string} analysisData.date - Датата на генерирането на препоръките.
 * @param {string} analysisData.token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>}
 */
const saveAnalysisToDatabase = async (analysisData: {
  relevantCount: number;
  totalCount: number;
  precisionValue: number;
  precisionPercentage: number;
  relevantRecommendations: Analysis[];
  date: string;
  token: string;
}): Promise<void> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-analysis`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(analysisData)
      }
    );

    if (!response.ok) {
      throw new Error(`Error saving analysis: ${response.statusText}`);
    }
    console.log("Analysis saved successfully.");
  } catch (error) {
    console.error("Error saving analysis data to database:", error);
  }
};

/**
 * Извършва заявка за изчисляване на средните метрики за precision, recall и F1 score.
 *
 * @async
 * @function getAverageMetrics
 * @returns {Promise<void>} - Няма върнат резултат, но изпраща заявка към сървъра.
 * @throws {Error} - Хвърля грешка, ако не може да се получат метриките.
 */
export const getAverageMetrics = async (): Promise<any> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/stats/platform/ai/average-metrics`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve average metrics.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error retrieving average metrics:", error);
  }
};

/**
 * Свързва се със SocketIO сървър и слуша за данни от събития.
 *
 * @async
 * @function connectSocketIO
 * @param {React.Dispatch<React.SetStateAction<BrainData | null>>} setData - Функция за обновяване на състоянието с получените данни.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setTransmissionComplete - Функция за обновяване на флага за край на получаването на данни.
 * @returns {void}
 */
export const connectSocketIO = async (
  setChartData: React.Dispatch<React.SetStateAction<BrainData | null>>,
  setTransmissionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setConnectionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  let attempts = 2;
  const maxAttempts = 3;

  const connect = () => {
    console.log(
      `🔄 Attempting to connect... (Try ${attempts + 1}/${maxAttempts})`
    );
    const socket = io(import.meta.env.VITE_SOCKET_IO_URL, {
      reconnection: false
    });

    socket.on("connect", () => {
      console.log("✅ Successfully connected to SocketIO server");
      setConnectionError(false);
    });

    socket.on("hardwareDataResponse", (data: unknown) => {
      try {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        if (
          parsedData &&
          typeof parsedData === "object" &&
          "time" in parsedData &&
          "data_type" in parsedData &&
          parsedData.data_type === "headset_data"
        ) {
          setChartData(parsedData as BrainData);
        } else {
          console.error("❌ Invalid data format received:", parsedData);
        }
      } catch (error) {
        console.error("❌ Error parsing data:", error);
      }
    });

    socket.on("dataDoneTransmittingSignal", () => {
      console.log("✅ Data transmission complete");
      setTransmissionComplete(true);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Disconnected from SocketIO server");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(connect, 3000);
      } else {
        setConnectionError(true);
      }
    });
  };

  connect();
};

/**
 * Записва мозъчния анализ на потребителя в базата данни чрез POST заявка.
 * Ако не успее да запише анализа, се хвърля грешка.
 *
 * @async
 * @function saveBrainAnalysis
 * @param {string} date - Датата на анализа.
 * @param {Object} analysisData - Данните от мозъчния анализ.
 * @param {string} analysisType - Типът на анализа ("movies_series" или "books").
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но хвърля грешка при неуспех.
 * @throws {Error} - Хвърля грешка, ако заявката не е успешна.
 */
export const saveBrainAnalysis = async (
  date: string,
  analysisData: BrainData[],
  analysisType: "movies_series" | "books",
  token: string | null
): Promise<void> => {
  try {
    if (!token) {
      throw new Error("Токенът е задължителен.");
    }

    const requestBody = {
      token,
      analysisType,
      data: analysisData,
      date
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-brain-analysis`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Неуспешно записване на мозъчния анализ."
      );
    }

    const result = await response.json();
    console.log("Мозъчният анализ е записан успешно:", result);
  } catch (error) {
    console.error("Грешка при записването на мозъчния анализ:", error);
  }
};

export const MAX_DATA_POINTS = 30;

/**
 * Актуализира данните на серията, като добавя нова стойност и премахва най-старите, ако броят надхвърли ограничението.
 *
 * @param {Array<{ x: string; y: number }>} currentData - Текущите данни на серията.
 * @param {string} timestamp - Времеви маркер за новата стойност.
 * @param {number} value - Стойност, която ще бъде добавена към серията.
 * @returns {Array<{ x: string; y: number }>} Актуализиран масив с данни, ограничен до `MAX_DATA_POINTS`.
 */
export const updateSeriesData = (
  currentData: { x: string; y: number }[],
  timestamp: string,
  value: number
) => {
  const newData = [...currentData, { x: timestamp, y: value }];

  if (newData.length > MAX_DATA_POINTS) {
    return newData.slice(newData.length - MAX_DATA_POINTS);
  }

  return newData;
};

/**
 * Връща CSS клас, който задава марж в зависимост от броя на опциите за текущия въпрос.
 *
 * @function getMarginClass
 * @param {Question} question - Текущият въпрос, съдържащ информация за опциите.
 * @returns {string} - Строка с CSS клас, който определя маржа за въпроса.
 */
export const getMarginClass = (question: Question): string => {
  if (question.isInput) {
    return question.description ? "mt-[5rem]" : "mt-[9rem]";
  }

  const length = question.options?.length || 0;

  switch (true) {
    case length > 20:
      return "mt-[1rem]";
    case length > 15:
      return "mt-[2rem]";
    case length > 10:
      return "mt-[1rem]";
    case length >= 6:
      return "mt-0"; // Zero margin remains unchanged
    case length >= 4:
      return "mt-[1.5rem]";
    case length >= 3:
      return "mt-[3rem]";
    default:
      return "mt-[9rem]";
  }
};

/**
 * Връща CSS клас, който задава марж в зависимост от текущата стъпка.
 * Ако мозъчният анализ е завършен, след 300ms се прилага нулев марж.
 *
 * @function getBrainAnalysisMarginClass
 * @param {number} i - Индекс на текущата стъпка.
 * @param {boolean} isBrainAnalysisComplete - Флаг дали мозъчният анализ е завършен.
 * @returns {Promise<string>} - Promise, който връща CSS клас след закъснение.
 */
export const getBrainAnalysisMarginClass = async (
  i: number,
  isBrainAnalysisComplete: boolean
): Promise<string> => {
  console.log(
    "getBrainAnalysisMarginClass triggered with:",
    i,
    "isBrainAnalysisComplete:",
    isBrainAnalysisComplete
  );

  if (isBrainAnalysisComplete) {
    return new Promise((resolve) => {
      setTimeout(() => resolve("mt-0"), 500);
    });
  }

  switch (i) {
    case 6:
      return "mt-[4rem]";
    case 1:
    case 3:
      return "mt-[5rem]";
    case 5:
      return "mt-[6rem]";
    case 2:
      return "mt-[8rem]";
    default:
      return "mt-[7rem]";
  }
};
