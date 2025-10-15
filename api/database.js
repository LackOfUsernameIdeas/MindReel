const mysql = require("mysql2");
const dbOpts = require("./config.js").dbOpts;
const dbOptsLocal = require("./config.js").dbOptsLocal;
const hf = require("./helper_functions");
require("dotenv").config();

const db = mysql.createConnection(dbOptsLocal);
// const db = mysql.createConnection(dbOpts);

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

/**
 * Проверява дали даден имейл вече съществува в базата данни.
 * @param {string} email - Имейл адресът, който трябва да бъде проверен.
 * @param {function(Error, Object[]): void} callback - Функция за обратно извикване, която обработва резултатите.
 */
const checkEmailExists = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

/**
 * Създава нов потребител в базата данни.
 * @param {string} firstName - Първо име на потребителя.
 * @param {string} lastName - Фамилно име на потребителя.
 * @param {string} email - Имейл адрес на потребителя.
 * @param {string} hashedPassword - Хеширана парола на потребителя.
 * @param {function(Error, Object): void} callback - Функция за обратно извикване, която обработва резултата от заявката.
 */
const createUser = (firstName, lastName, email, hashedPassword, callback) => {
  const query =
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  db.query(query, [firstName, lastName, email, hashedPassword], callback);
};

/**
 * Намира потребител в базата данни по имейл.
 * @param {string} email - Имейл адресът, който трябва да бъде намерен.
 * @param {function(Error, Object[]): void} callback - Функция за обратно извикване, която обработва резултатите.
 */
const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

/**
 * Актуализира паролата на потребителя в базата данни.
 * @param {number} userId - Уникален идентификатор на потребителя.
 * @param {string} hashedPassword - Новата хеширана парола.
 * @param {function(Error, Object): void} callback - Функция за обратно извикване, която обработва резултата от заявката.
 */
const updateUserPassword = (userId, hashedPassword, callback) => {
  const query = "UPDATE users SET password = ? WHERE id = ?";
  db.query(query, [hashedPassword, userId], callback);
};

/**
 * Извлича информация за потребител по неговото ID.
 * @param {number} userId - Уникален идентификатор на потребителя.
 * @param {function(Error, Object[]): void} callback - Функция за обратно извикване, която обработва резултатите.
 */
const getUserById = (userId, callback) => {
  const query =
    "SELECT id, first_name, last_name, email FROM users WHERE id = ?";
  db.query(query, [userId], callback);
};

/**
 * Запазва препоръчан филм или сериал в базата данни.
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} data - Данни за препоръката.
 * @param {Function} callback - Функция за обратно извикване след завършване на заявката.
 */
const saveMovieSeriesRecommendation = (userId, data, callback) => {
  const query = `INSERT INTO movies_series_recommendations (
    user_id, imdbID, title_en, title_bg, genre_en, genre_bg, reason, youtubeTrailerUrl, description, year,
    rated, released, runtime, director, writer, actors, plot, language, 
    country, awards, poster, ratings, metascore, imdbRating, imdbVotes, 
    type, DVD, boxOffice, production, website, totalSeasons, date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
    userId,
    data.imdbID,
    data.title_en,
    data.title_bg,
    data.genre_en,
    data.genre_bg,
    data.reason,
    data.youtubeTrailerUrl,
    data.description,
    data.year,
    data.rated,
    data.released,
    data.runtime,
    data.director,
    data.writer,
    data.actors,
    data.plot,
    data.language,
    data.country,
    data.awards,
    data.poster,
    JSON.stringify(data.ratings),
    data.metascore,
    data.imdbRating,
    data.imdbVotes,
    data.type,
    data.DVD,
    data.boxOffice,
    data.production,
    data.website,
    data.totalSeasons,
    data.date
  ];

  db.query(query, values, callback);
};

/**
 * Запазва препоръчана книга в базата данни.
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} data - Данни за книгата.
 * @param {Function} callback - Функция за обратно извикване след завършване на заявката.
 */
const saveBookRecommendation = (userId, data, callback) => {
  const query = `INSERT INTO books_recommendations (
    user_id, google_books_id, goodreads_id, title_en, original_title, title_bg, real_edition_title, author, 
    genre_en, genre_bg, description, language, origin, date_of_first_issue, 
    date_of_issue, publisher, goodreads_rating, goodreads_ratings_count, goodreads_reviews_count, reason, adaptations, ISBN_10, ISBN_13, 
    page_count, book_format, imageLink, literary_awards, setting, characters, series, date, source
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  function conditionalStringify(data) {
    return typeof data === "string" ? data : JSON.stringify(data);
  }

  const values = [
    userId,
    data.google_books_id || null,
    data.goodreads_id || null,
    data.title_en || null,
    data.original_title || null,
    data.title_bg || null,
    data.real_edition_title || null,
    data.author || null,
    conditionalStringify(data.genre_en) || null,
    conditionalStringify(data.genre_bg) || null,
    data.description || null,
    data.language || null,
    data.origin || null,
    data.date_of_first_issue || null,
    data.date_of_issue || null,
    data.publisher || null,
    data.goodreads_rating || null,
    data.goodreads_ratings_count || null,
    data.goodreads_reviews_count || null,
    data.reason || null,
    data.adaptations || null,
    data.ISBN_10 || null,
    data.ISBN_13 || null,
    data.page_count || null,
    data.book_format || null,
    data.imageLink || null,
    data.literary_awards || null,
    data.setting || null,
    data.characters || null,
    data.series || null,
    data.date || null,
    data.source || null
  ];

  db.query(query, values, callback);
};

/**
 * Запазва препоръчана песен в базата данни.
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} data - Данни за препоръката.
 * @param {Function} callback - Функция за обратно извикване след завършване на заявката.
 */
const saveMusicRecommendation = (userId, data, callback) => {
  const query = `INSERT INTO music_recommendations (
    user_id,
    title,
    artists,
    description,
    reason,
    durationMs,
    albumTitle,
    albumType,
    albumCover,
    albumTotalTracks,
    albumReleaseDateInSpotify,
    spotifyID,
    spotifyUrl,
    spotifyPopularity,
    youtubeMusicVideoID,
    youtubeMusicVideoUrl,
    youtubeMusicVideoViews,
    youtubeMusicVideoLikes,
    youtubeMusicVideoComments,
    date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
    userId,
    data.title || null,
    data.artists || null,
    data.description || null,
    data.reason || null,
    data.durationMs || null,
    data.albumTitle || null,
    data.albumType || null,
    data.albumCover || null,
    data.albumTotalTracks || null,
    data.albumReleaseDateInSpotify || null,
    data.spotifyID || null,
    data.spotifyUrl || null,
    data.spotifyPopularity || null,
    data.youtubeMusicVideoID || null,
    data.youtubeMusicVideoUrl || null,
    data.youtubeMusicVideoViews || null,
    data.youtubeMusicVideoLikes || null,
    data.youtubeMusicVideoComments || null,
    data.date || null
  ];

  db.query(query, values, callback);
};

/**
 * Запазва филм или сериал в списъка за гледане на потребителя.
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} data - Данни за филма или сериала.
 * @param {Function} callback - Функция за обратно извикване след завършване на заявката.
 */
const saveToWatchlist = (userId, data, callback) => {
  const query = `INSERT INTO watchlist (
  user_id, imdbID, title_en, title_bg, genre_en, genre_bg, reason, youtubeTrailerUrl, description, year,
  rated, released, runtime, director, writer, actors, plot, language, 
  country, awards, poster, ratings, metascore, imdbRating, imdbVotes, 
  type, DVD, boxOffice, production, website, totalSeasons
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
    userId,
    data.imdbID,
    data.title_en,
    data.title_bg,
    data.genre_en,
    data.genre_bg,
    data.reason,
    data.youtubeTrailerUrl,
    data.description,
    data.year,
    data.rated,
    data.released,
    data.runtime,
    data.director,
    data.writer,
    data.actors,
    data.plot,
    data.language,
    data.country,
    data.awards,
    data.poster,
    JSON.stringify(data.ratings),
    data.metascore,
    data.imdbRating,
    data.imdbVotes,
    data.type,
    data.DVD,
    data.boxOffice,
    data.production,
    data.website,
    data.totalSeasons
  ];

  db.query(query, values, callback);
};

/**
 * Запазва книга в списъка за четене на потребителя.
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} data - Данни за книгата.
 * @param {Function} callback - Функция за обратно извикване след завършване на заявката.
 */
const saveToReadlist = (userId, data, callback) => {
  const query = `INSERT INTO readlist (
    user_id, google_books_id, goodreads_id, title_en, original_title, title_bg, real_edition_title, author, 
    genre_en, genre_bg, description, language, origin, date_of_first_issue, 
    date_of_issue, publisher, goodreads_rating, goodreads_ratings_count, goodreads_reviews_count, reason, adaptations, ISBN_10, ISBN_13, 
    page_count, book_format, imageLink, literary_awards, setting, characters, series, source
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  function conditionalStringify(data) {
    return typeof data === "string" ? data : JSON.stringify(data);
  }

  const values = [
    userId,
    data.google_books_id || null,
    data.goodreads_id || null,
    data.title_en || null,
    data.original_title || null,
    data.title_bg || null,
    data.real_edition_title || null,
    data.author || null,
    conditionalStringify(data.genre_en) || null,
    conditionalStringify(data.genre_bg) || null,
    data.description || null,
    data.language || null,
    data.origin || null,
    data.date_of_first_issue || null,
    data.date_of_issue || null,
    data.publisher || null,
    data.goodreads_rating || null,
    data.goodreads_ratings_count || null,
    data.goodreads_reviews_count || null,
    data.reason || null,
    data.adaptations || null,
    data.ISBN_10 || null,
    data.ISBN_13 || null,
    data.page_count || null,
    data.book_format || null,
    data.imageLink || null,
    data.literary_awards || null,
    data.setting || null,
    data.characters || null,
    data.series || null,
    data.source || null
  ];

  db.query(query, values, callback);
};

/**
 * Запазва песен в списъка за слушане на потребителя.
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} data - Данни за песента.
 * @param {Function} callback - Функция за обратно извикване след завършване на заявката.
 */
const saveToListenlist = (userId, data, callback) => {
  const query = `INSERT INTO listenlist (
    user_id,
    title,
    artists,
    description,
    reason,
    durationMs,
    albumTitle,
    albumType,
    albumCover,
    albumTotalTracks,
    albumReleaseDateInSpotify,
    spotifyID,
    spotifyUrl,
    spotifyPopularity,
    youtubeMusicVideoID,
    youtubeMusicVideoUrl,
    youtubeMusicVideoViews,
    youtubeMusicVideoLikes,
    youtubeMusicVideoComments
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
    userId,
    data.title || null,
    data.artists || null,
    data.description || null,
    data.reason || null,
    data.durationMs || null,
    data.albumTitle || null,
    data.albumType || null,
    data.albumCover || null,
    data.albumTotalTracks || null,
    data.albumReleaseDateInSpotify || null,
    data.spotifyID || null,
    data.spotifyUrl || null,
    data.spotifyPopularity || null,
    data.youtubeMusicVideoID || null,
    data.youtubeMusicVideoUrl || null,
    data.youtubeMusicVideoViews || null,
    data.youtubeMusicVideoLikes || null,
    data.youtubeMusicVideoComments || null
  ];

  db.query(query, values, callback);
};

/**
 * Премахва елемент от списъка за гледане на потребителя.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {string} imdbID - Идентификатор на IMDb на филма/сериала.
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const removeFromWatchlist = (userId, imdbID, callback) => {
  const query = `DELETE FROM watchlist WHERE user_id = ? AND imdbID = ?;`;
  const values = [userId, imdbID];

  db.query(query, values, callback);
};

/**
 * Премахва елемент от списъка за четене на потребителя.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {string} source - Източникът на информацията за книгата ("GoogleBooks" или "Goodreads").
 * @param {string} book_id - Идентификатор на книгата.
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const removeFromReadlist = (userId, source, book_id, callback) => {
  const query = `DELETE FROM readlist WHERE user_id = ? AND ${
    source === "GoogleBooks" ? "google_books_id = ?" : "	goodreads_id = ?"
  };`;
  const values = [userId, book_id];

  db.query(query, values, callback);
};

/**
 * Проверява дали препоръката съществува в списъка за гледане на потребителя.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {string} imdbID - Идентификатор на IMDb на филма/сериала.
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const checkRecommendationExistsInWatchlist = (userId, imdbID, callback) => {
  const query = "SELECT * FROM watchlist WHERE user_id = ? AND imdbID = ?";
  db.query(query, [userId, imdbID], callback);
};

/**
 * Проверява дали препоръката съществува в списъка за четене на потребителя.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {string} source - Източникът на информацията за книгата ("GoogleBooks" или "Goodreads").
 * @param {string} book_id - Идентификатор на книгата.
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const checkRecommendationExistsInReadlist = (
  userId,
  source,
  book_id,
  callback
) => {
  const query = `SELECT * FROM readlist WHERE user_id = ? AND ${
    source === "GoogleBooks" ? "google_books_id = ?" : "	goodreads_id = ?"
  }`;
  db.query(query, [userId, book_id], callback);
};

/**
 * Проверява дали препоръката съществува в списъка за слушане на потребителя.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {string} spotifyID - Идентификатор в Spotify на филма/сериала.
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const checkRecommendationExistsInListenlist = (userId, imdbID, callback) => {
  const query = "SELECT * FROM listenlist WHERE user_id = ? AND imdbID = ?";
  db.query(query, [userId, imdbID], callback);
};

/**
 * Записва предпочитанията на потребителя за филми и сериали.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} preferences - Обект с предпочитанията на потребителя.
 * @param {string[]} preferences.preferred_genres_en - Избрани жанрове на английски.
 * @param {string[]} preferences.preferred_genres_bg - Избрани жанрове на български.
 * @param {string} preferences.mood - Настроение на потребителя.
 * @param {string} preferences.timeAvailability - Наличност на времето на потребителя.
 * @param {string} preferences.preferred_age - Предпочитана възрастова група.
 * @param {string} preferences.preferred_type - Предпочитан тип съдържание.
 * @param {string[]} preferences.preferred_actors - Предпочитани актьори.
 * @param {string[]} preferences.preferred_directors - Предпочитани режисьори.
 * @param {string[]} preferences.preferred_countries - Предпочитани държави.
 * @param {string} preferences.preferred_pacing - Предпочитан ритъм.
 * @param {string} preferences.preferred_depth - Предпочитана дълбочина на съдържанието.
 * @param {string} preferences.preferred_target_group - Предпочитана целева група.
 * @param {string} preferences.interests - Интереси на потребителя.
 * @param {string} preferences.date - Дата на създаване на предпочитанията.
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const saveMoviesSeriesUserPreferences = (userId, preferences, callback) => {
  const sql = `INSERT INTO movies_series_user_preferences (user_id, preferred_genres_en, preferred_genres_bg, mood, timeAvailability, preferred_age, preferred_type, preferred_actors, preferred_directors, preferred_countries, preferred_pacing, preferred_depth, preferred_target_group, interests, date)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    userId,
    preferences.preferred_genres_en,
    preferences.preferred_genres_bg,
    preferences.mood,
    preferences.timeAvailability,
    preferences.preferred_age,
    preferences.preferred_type,
    preferences.preferred_actors,
    preferences.preferred_directors,
    preferences.preferred_countries,
    preferences.preferred_pacing,
    preferences.preferred_depth,
    preferences.preferred_target_group,
    preferences.interests,
    preferences.date
  ];

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
};

/**
 * Записва предпочитанията на потребителя за книги.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} preferences - Обект с предпочитанията на потребителя.
 * @param {string[]} preferences.preferred_genres_en - Избрани жанрове на английски.
 * @param {string[]} preferences.preferred_genres_bg - Избрани жанрове на български.
 * @param {string} preferences.mood - Настроение на потребителя.
 * @param {string[]} preferences.preferred_authors - Предпочитани автори.
 * @param {string} preferences.preferred_origin - Предпочитано място на произход на книгите.
 * @param {string} preferences.preferred_pacing - Предпочитан ритъм.
 * @param {string} preferences.preferred_depth - Предпочитана дълбочина на съдържанието.
 * @param {string} preferences.preferred_target_group - Предпочитана целева група.
 * @param {string} preferences.interests - Интереси на потребителя.
 * @param {string} preferences.date - Дата на създаване на предпочитанията.
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const saveBooksUserPreferences = (userId, preferences, callback) => {
  const sql = `INSERT INTO books_user_preferences (user_id, preferred_genres_en, preferred_genres_bg, mood, preferred_authors, preferred_origin, preferred_pacing, preferred_depth, preferred_target_group, interests, date)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    userId,
    preferences.preferred_genres_en,
    preferences.preferred_genres_bg,
    preferences.mood,
    preferences.preferred_authors,
    preferences.preferred_origin,
    preferences.preferred_pacing,
    preferences.preferred_depth,
    preferences.preferred_target_group,
    preferences.interests,
    preferences.date
  ];

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
};

/**
 * Записва предпочитанията на потребителя за филми и сериали.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} preferences - Обект с предпочитанията на потребителя.
 * @param {string[]} preferences.preferred_genres_en - Избрани жанрове на английски.
 * @param {string[]} preferences.preferred_genres_bg - Избрани жанрове на български.
 * @param {string} preferences.mood - Настроение на потребителя.
 * @param {string} preferences.preferred_age - Предпочитана възрастова група.
 * @param {string[]} preferences.preferred_artists - Предпочитани изпълнители.
 * @param {string[]} preferences.preferred_producers - Предпочитани музикални продуценти и/или композитори.
 * @param {string[]} preferences.preferred_countries - Предпочитани държави.
 * @param {string} preferences.preferred_pacing - Предпочитан ритъм.
 * @param {string} preferences.preferred_depth - Предпочитана дълбочина на съдържанието.
 * @param {string} preferences.preferred_target_group - Предпочитана целева група.
 * @param {string} preferences.interests - Интереси на потребителя.
 * @param {string} preferences.date - Дата на създаване на предпочитанията.
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const saveMusicUserPreferences = (userId, preferences, callback) => {
  const sql = `INSERT INTO music_user_preferences (user_id, preferred_genres_en, preferred_genres_bg, mood, preferred_age, preferred_artists, preferred_producers, preferred_countries, preferred_pacing, preferred_depth, preferred_target_group, interests, date)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    userId,
    preferences.preferred_genres_en,
    preferences.preferred_genres_bg,
    preferences.mood,
    preferences.preferred_age,
    preferences.preferred_artists,
    preferences.preferred_producers,
    preferences.preferred_countries,
    preferences.preferred_pacing,
    preferences.preferred_depth,
    preferences.preferred_target_group,
    preferences.interests,
    preferences.date
  ];

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
};

/**
 * Връща броя на потребителите в базата данни.
 *
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const getUsersCount = (callback) => {
  const query = `
    SELECT COUNT(*) AS user_count
    FROM users
  `;
  db.query(query, callback);
};

/**
 * Връща средната стойност на бокс офис приходите и оценките за филми и сериали.
 *
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const getAverageBoxOfficeAndScores = (callback) => {
  const query = `
    SELECT 
      CONCAT('$', FORMAT(AVG(boxOffice), 0)) AS average_box_office,
      ROUND(AVG(metascore), 2) AS average_metascore,
      ROUND(AVG(imdbRating), 2) AS average_imdb_rating,
      CONCAT(ROUND(AVG(rottenTomatoes), 2), '%') AS average_rotten_tomatoes
    FROM (
      SELECT DISTINCT imdbID, 
        CAST(REPLACE(REPLACE(boxOffice, '$', ''), ',', '') AS DECIMAL(15, 2)) AS boxOffice,
        CAST(metascore AS DECIMAL(15, 2)) AS metascore,
        CAST(imdbRating AS DECIMAL(15, 2)) AS imdbRating,
        CAST(
          REPLACE(JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')), '%', '') AS DECIMAL(5, 2)
        ) AS rottenTomatoes
      FROM movies_series_recommendations
      WHERE boxOffice IS NOT NULL AND boxOffice != 'N/A'
        AND metascore IS NOT NULL
        AND imdbRating IS NOT NULL
        AND JSON_EXTRACT(ratings, '$[1].Source') = 'Rotten Tomatoes'
    ) AS distinct_data;
  `;
  db.query(query, callback);
};

/**
 * Връща топ препоръките за платформи.
 *
 * @param {function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 */
const getTopRecommendationsPlatform = (callback) => {
  const query = `
    SELECT 
        r.id,
        r.imdbID,
        r.title_en,
        r.title_bg,
        r.type,
        r.awards,
        COUNT(*) AS recommendations,

        -- Extract Oscar wins as an integer (if available)
        COALESCE(
            CASE 
                WHEN r.awards REGEXP 'Won [0-9]+ Oscar' OR r.awards REGEXP 'Won [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Won ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_wins,

        -- Extract Oscar nominations as an integer (if available)
        COALESCE(
            CASE 
                WHEN r.awards REGEXP 'Nominated for [0-9]+ Oscar' OR r.awards REGEXP 'Nominated for [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Nominated for ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_nominations,

        -- Extract total wins as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) win(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_wins,

        -- Extract total nominations as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) nomination(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_nominations
    FROM 
        movies_series_recommendations r
    GROUP BY 
        r.title_en
    ORDER BY 
        recommendations DESC
    LIMIT 10;
  `;

  db.query(query, callback);
};

/**
 * Извлича най-препоръчваните държави по брой и превежда имената им.
 *
 * @param {number} limit - Максимален брой държави за извличане.
 * @param {function} callback - Функция за обратно повикване, която получава резултатите или грешка.
 * @returns {void}
 */
const getTopCountries = (limit, callback) => {
  const query = `
    SELECT country, COUNT(*) AS count
    FROM (
      SELECT 
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.country, ',', numbers.n), ',', -1)) AS country
      FROM movies_series_recommendations r
      INNER JOIN (
        SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
        SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
      ) AS numbers 
      ON CHAR_LENGTH(r.country) - CHAR_LENGTH(REPLACE(r.country, ',', '')) >= numbers.n - 1
    ) AS subquery
    GROUP BY country
    ORDER BY count DESC
    LIMIT ?
  `;
  db.query(query, [limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Translate each country and return the result
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedCountry = await hf.translate(row.country);
        return {
          country_en: row.country,
          country_bg: translatedCountry,
          count: row.count
        };
      })
    );

    // Pass the translated results to the callback
    callback(null, translatedResults);
  });
};

/**
 * Извлича най-препоръчваните жанрове по брой.
 *
 * @param {number} limit - Максимален брой жанрове за извличане.
 * @param {function} callback - Функция за обратно повикване, която получава резултатите.
 * @returns {void}
 */
const getTopGenres = (limit, callback) => {
  const query = `
    SELECT genre_en, genre_bg, COUNT(*) AS count
      FROM (
        SELECT 
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.genre_en, ',', numbers.n), ',', -1)) AS genre_en,
          TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.genre_bg, ',', numbers.n), ',', -1)) AS genre_bg
        FROM movies_series_recommendations r
        INNER JOIN (
          SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
          SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
        ) AS numbers 
        ON CHAR_LENGTH(r.genre_en) - CHAR_LENGTH(REPLACE(r.genre_en, ',', '')) >= numbers.n - 1
        AND CHAR_LENGTH(r.genre_bg) - CHAR_LENGTH(REPLACE(r.genre_bg, ',', '')) >= numbers.n - 1
      ) AS subquery
    GROUP BY genre_en, genre_bg
    ORDER BY count DESC
    LIMIT ?
  `;
  db.query(query, [limit], callback);
};

/**
 * Извлича популярността на жанровете през времето, групирана по жанр и година.
 *
 * @param {function} callback - Функция за обратно повикване, която получава резултатите или грешка.
 * @returns {void}
 */
const getGenrePopularityOverTime = (callback) => {
  const query = `
    SELECT 
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(genre_en, ',', numbers.n), ',', -1)) AS genre_en,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(genre_bg, ',', numbers.n), ',', -1)) AS genre_bg,
        CASE 
            WHEN LOCATE('–', year) > 0 THEN LEFT(year, LOCATE('–', year) - 1)
            ELSE year
        END AS "year",
        COUNT(*) AS genre_count
    FROM 
        movies_series_recommendations
        JOIN (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) numbers 
        ON CHAR_LENGTH(genre_en) - CHAR_LENGTH(REPLACE(genre_en, ',', '')) >= numbers.n - 1
    GROUP BY 
        genre_en, genre_bg, year
    ORDER BY 
        year, genre_en;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return callback(err);
    }

    // Transform results into the desired structure with cumulative sums for genre_count
    const formattedResults = results.reduce((acc, row) => {
      const { year, genre_en, genre_bg, genre_count } = row;

      // Initialize the year object if it doesn't exist
      if (!acc[year]) {
        acc[year] = {};
      }

      // If genre exists, add to the existing genre_count, otherwise set it
      if (acc[year][genre_en]) {
        acc[year][genre_en].genre_count += genre_count;
      } else {
        acc[year][genre_en] = {
          genre_en,
          genre_bg,
          genre_count
        };
      }

      return acc;
    }, {});

    callback(null, formattedResults);
  });
};

/**
 * Извлича най-препоръчваните актьори по брой и превежда имената им.
 *
 * @param {number} limit - Максимален брой актьори за извличане.
 * @param {function} callback - Функция за обратно повикване, която получава резултатите или грешка.
 * @returns {void}
 */
const getTopActors = (limit, callback) => {
  const query = `
  SELECT actor, COUNT(*) AS actor_count
  FROM (
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
    FROM movies_series_recommendations
    CROSS JOIN (
        SELECT a.N + b.N * 10 + 1 AS n
        FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
              UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
        , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
           UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
        ORDER BY n
    ) n
    WHERE n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))
      AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
  ) AS actor_list
  GROUP BY actor
  ORDER BY actor_count DESC
  LIMIT ?`;
  db.query(query, [limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Превеждане на името на всеки актьор
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedActor = await hf.translate(row.actor);
        return {
          actor_en: row.actor,
          actor_bg: translatedActor,
          actor_count: row.actor_count
        };
      })
    );

    callback(null, translatedResults);
  });
};

/**
 * Извлича най-препоръчваните режисьори по брой и превежда имената им.
 *
 * @param {number} limit - Максимален брой режисьори за извличане.
 * @param {function} callback - Функция за обратно повикване, която получава резултатите или грешка.
 * @returns {void}
 */
const getTopDirectors = (limit, callback) => {
  const query = `
  SELECT director, COUNT(*) AS director_count
  FROM (
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
    FROM movies_series_recommendations
    CROSS JOIN (
        SELECT a.N + b.N * 10 + 1 AS n
        FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
              UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
        , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
           UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
        ORDER BY n
    ) n
    WHERE n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))
      AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
  ) AS director_list
  GROUP BY director
  ORDER BY director_count DESC
  LIMIT ?`;
  db.query(query, [limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Превеждане на името на всеки режисьор
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedDirector = await hf.translate(row.director);
        return {
          director_en: row.director,
          director_bg: translatedDirector,
          director_count: row.director_count
        };
      })
    );

    callback(null, translatedResults);
  });
};

/**
 * Извлича най-препоръчваните сценаристи по брой и превежда имената им.
 *
 * @param {number} limit - Максимален брой сценаристи за извличане.
 * @param {function} callback - Функция за обратно повикване, която получава резултатите или грешка.
 * @returns {void}
 */
const getTopWriters = (limit, callback) => {
  const query = `
  SELECT writer, COUNT(*) AS writer_count
  FROM (
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
    FROM movies_series_recommendations
    CROSS JOIN (
        SELECT a.N + b.N * 10 + 1 AS n
        FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
              UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
        , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
           UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
        ORDER BY n
    ) n
    WHERE n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))
      AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
  ) AS writer_list
  GROUP BY writer
  ORDER BY writer_count DESC
  LIMIT ?`;
  db.query(query, [limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Превеждане на името на всеки сценарист
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedWriter = await hf.translate(row.writer);
        return {
          writer_en: row.writer,
          writer_bg: translatedWriter,
          writer_count: row.writer_count
        };
      })
    );

    callback(null, translatedResults);
  });
};

/**
 * Извлича данни за Оскарите, спечелени или номинирани от филми или сериали.
 *
 * @param {function} callback - Функция, която се извиква при завършване на заявката с резултатите.
 */
const getOscarsByMovie = (callback) => {
  const query = `
  SELECT 
        r.id,
        r.imdbID,           
        r.title_en,
        r.title_bg,
        r.type,
        r.awards,           

        -- Extract Oscar wins as an integer
        COALESCE(
            CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Won ', -1), ' Oscar', 1), '') AS UNSIGNED), 
            0
        ) AS oscar_wins,

        -- Extract Oscar nominations as an integer
        COALESCE(
            CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Nominated for ', -1), ' Oscar', 1), '') AS UNSIGNED), 
            0
        ) AS oscar_nominations

  FROM 
        movies_series_recommendations r
  WHERE 
        r.awards IS NOT NULL
        AND (
            r.awards REGEXP 'Won [0-9]+ Oscar' OR 
            r.awards REGEXP 'Won [0-9]+ Oscars' OR 
            r.awards REGEXP 'Nominated for [0-9]+ Oscar' OR 
            r.awards REGEXP 'Nominated for [0-9]+ Oscars'
        )
  GROUP BY 
        r.imdbID;
  `;
  db.query(query, callback);
};

/**
 * Извлича общия брой спечелени награди и номинации за всеки филм или сериал.
 *
 * @param {function} callback - Функция, която се извиква при завършване на заявката с резултатите.
 */
const getTotalAwardsByMovieOrSeries = (callback) => {
  const query = `
  SELECT  
        r.id,
        r.imdbID,          
        r.title_en,
        r.title_bg,
        r.type,
        r.awards,           

        -- Extract total wins as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) win(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_wins,

        -- Extract total nominations as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) nomination(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_nominations

  FROM 
        movies_series_recommendations r
  WHERE 
        r.awards IS NOT NULL
  GROUP BY 
        r.imdbID;
  `;
  db.query(query, callback);
};

/**
 * Изчислява общия брой награди и номинации от всички филми и сериали.
 *
 * @param {function} callback - Функция, която се извиква при завършване на заявката с резултатите.
 */
const getTotalAwardsCount = (callback) => {
  const query = `
  SELECT 
    -- Calculate total Oscar wins distinctly
    (
        SELECT 
            SUM(
                COALESCE(
                    CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r2.awards, 'Won ', -1), ' Oscar', 1), '') AS UNSIGNED), 
                    0
                )
            )
        FROM 
            (SELECT DISTINCT imdbID, awards FROM movies_series_recommendations WHERE awards IS NOT NULL 
              AND (awards REGEXP 'Won [0-9]+ Oscar' OR awards REGEXP 'Won [0-9]+ Oscars')) r2
    ) AS total_oscar_wins,

    -- Calculate total Oscar nominations distinctly
    (
        SELECT 
            SUM(
                COALESCE(
                    CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r2.awards, 'Nominated for ', -1), ' Oscar', 1), '') AS UNSIGNED), 
                    0
                )
            )
        FROM 
            (SELECT DISTINCT imdbID, awards FROM movies_series_recommendations WHERE awards IS NOT NULL 
              AND (awards REGEXP 'Nominated for [0-9]+ Oscar' OR awards REGEXP 'Nominated for [0-9]+ Oscars')) r2
    ) AS total_oscar_nominations,

    -- Calculate total wins from all awards distinctly
    (
        SELECT 
            SUM(
                COALESCE(
                    CAST(NULLIF(REGEXP_SUBSTR(r2.awards, '([0-9]+) wins'), '') AS UNSIGNED), 
                    0
                )
            )
        FROM 
            (SELECT DISTINCT imdbID, awards FROM movies_series_recommendations WHERE awards IS NOT NULL 
              AND (awards REGEXP '([0-9]+) wins' OR awards REGEXP '([0-9]+) win')) r2
    ) AS total_awards_wins,

    -- Calculate total nominations from all awards distinctly
    (
        SELECT 
            SUM(
                COALESCE(
                    CAST(NULLIF(REGEXP_SUBSTR(r2.awards, '([0-9]+) nominations'), '') AS UNSIGNED), 
                    0
                )
            )
        FROM 
            (SELECT DISTINCT imdbID, awards FROM movies_series_recommendations WHERE awards IS NOT NULL 
              AND (awards REGEXP '([0-9]+) nominations' OR awards REGEXP '([0-9]+) nomination')) r2
    ) AS total_awards_nominations;
  `;
  db.query(query, callback);
};

/**
 * Извлича режисьорите спрямо просперитетът им, изчислена на база различни показатели.
 *
 * @param {function} callback - Функция, която се извиква при завършване на заявката с резултатите.
 */
const getSortedDirectorsByProsperity = (callback) => {
  const query = `
  WITH RECURSIVE DirectorSplit AS (
    SELECT 
        id, 
        TRIM(SUBSTRING_INDEX(director, ',', 1)) AS director,
        SUBSTRING_INDEX(director, ',', -1) AS remaining_directors,
        imdbRating,
        metascore,
        boxOffice,
        runtime,
        awards,
        imdbID,
        ratings,
        type
    FROM movies_series_recommendations
    WHERE director IS NOT NULL 
      AND director != 'N/A'
    UNION ALL
    SELECT 
        id,
        TRIM(SUBSTRING_INDEX(remaining_directors, ',', 1)) AS director,
        SUBSTRING_INDEX(remaining_directors, ',', -1) AS remaining_directors,
        imdbRating,
        metascore,
        boxOffice,
        runtime,
        awards,
        imdbID,
        ratings,
        type
    FROM DirectorSplit
    WHERE remaining_directors LIKE '%,%'
  ),
  UniqueMovies AS (
      SELECT 
          DISTINCT imdbID,
          director,
          imdbRating,
          metascore,
          boxOffice,
          runtime,
          awards,
          CAST(
              REPLACE(
                JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')), '%', ''
              ) AS DECIMAL(5, 2)
          ) AS rottenTomatoes
      FROM 
          DirectorSplit
      WHERE director IS NOT NULL AND director != 'N/A'
  ),
  DirectorRecommendations AS (
    SELECT director, COUNT(*) AS total_recommendations  -- Count all recommendations for each director
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
      FROM movies_series_recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
          , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
            UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))  -- Split the director list by comma
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
    ) AS director_list
    GROUP BY director
    ORDER BY total_recommendations DESC
  )
  SELECT 
      um.director,
      ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
      AVG(um.metascore) AS avg_metascore,
      CONCAT('$', FORMAT(SUM(CASE 
              WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
              THEN 0 
              ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
          END), 0)) AS total_box_office,
      CONCAT(ROUND(AVG(um.rottenTomatoes), 0), '%') AS avg_rotten_tomatoes,
      COUNT(DISTINCT um.imdbID) AS movie_count,  -- Count distinct movies
      COALESCE(dr.total_recommendations, 0) AS total_recommendations,  -- Total recommendations from join
      AVG(CASE 
              WHEN um.runtime IS NULL OR um.runtime = 'N/A' OR um.runtime < 30 
              THEN NULL 
              ELSE um.runtime 
          END) AS avg_runtime,
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 win%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_wins,
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 nomination%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_nominations
  FROM 
      UniqueMovies um
  LEFT JOIN 
      DirectorRecommendations dr ON um.director = dr.director  -- Join to get total recommendations
  WHERE 
      um.boxOffice IS NOT NULL 
      AND um.boxOffice != 'N/A'
      AND um.metascore IS NOT NULL 
      AND um.metascore != 'N/A'
      AND um.rottenTomatoes IS NOT NULL
  GROUP BY 
      um.director
  ORDER BY 
      avg_imdb_rating DESC
  LIMIT 100`;
  db.query(query, async (err, results) => {
    if (err) return callback(err);

    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    const maxBoxOffice = Math.max(
      ...results.map((director) => {
        const totalBoxOffice =
          parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
        return totalBoxOffice;
      })
    );

    const directorsWithProsperity = results.map((director) => {
      const totalWins = director.total_wins || 0;
      const totalNominations = director.total_nominations || 0;
      const totalBoxOffice =
        parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;
      const avgMetascore = director.avg_metascore || 0;
      const avgIMDbRating = director.avg_imdb_rating || 0;
      const avgRottenTomatoes = director.avg_rotten_tomatoes
        ? parseFloat(director.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgMetascore * weights.avg_metascore +
        avgIMDbRating * weights.avg_imdb_rating +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      return {
        ...director,
        prosperityScore: Number(prosperityScore.toFixed(2))
      };
    });

    const translatedResults = await Promise.all(
      directorsWithProsperity.map(async (row) => {
        const translatedDirector = await hf.translate(row.director);
        return {
          director_bg: translatedDirector,
          ...row
        };
      })
    );

    translatedResults.sort((a, b) => b.prosperityScore - a.prosperityScore);

    callback(null, translatedResults);
  });
};

/**
 * Извлича актьорите спрямо просперитетът им, изчислена на база различни показатели.
 *
 * @param {function} callback - Функция, която се извиква при завършване на заявката с резултатите.
 */
const getSortedActorsByProsperity = (callback) => {
  const query = `
  WITH RECURSIVE ActorSplit AS (
  SELECT 
      id, 
      TRIM(SUBSTRING_INDEX(actors, ',', 1)) AS actor,
      SUBSTRING_INDEX(actors, ',', -1) AS remaining_actors,
      imdbRating,
      metascore,
      boxOffice,
      awards,
      imdbID,
      ratings,
      type
  FROM movies_series_recommendations
  WHERE actors IS NOT NULL 
    AND actors != 'N/A'
  UNION ALL
  SELECT 
      id,
      TRIM(SUBSTRING_INDEX(remaining_actors, ',', 1)) AS actor,
      SUBSTRING_INDEX(remaining_actors, ',', -1) AS remaining_actors,
      imdbRating,
      metascore,
      boxOffice,
      awards,
      imdbID,
      ratings,
      type
  FROM ActorSplit
  WHERE remaining_actors LIKE '%,%'
  ),
  UniqueMovies AS (
    SELECT 
        DISTINCT imdbID,
        actor,
        imdbRating,
        metascore,
        boxOffice,
        awards,
        ratings
    FROM 
        ActorSplit
    WHERE actor IS NOT NULL AND actor != 'N/A'
  ),
  ActorRecommendations AS (
    SELECT actor, COUNT(*) AS total_recommendations  -- Count all recommendations for each actor
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
      FROM movies_series_recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
          , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
            UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))  -- Split the actor list by comma
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
    ) AS actor_list
    GROUP BY actor
    ORDER BY total_recommendations DESC
  )
  SELECT 
    um.actor,
    ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
    AVG(um.metascore) AS avg_metascore,
    CONCAT('$', FORMAT(SUM(CASE 
            WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
            THEN 0 
            ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
        END), 0)) AS total_box_office,
    CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes, -- Average Rotten Tomatoes rating
    COUNT(DISTINCT um.imdbID) AS movie_count,  -- Count distinct movies
    COALESCE(ar.total_recommendations, 0) AS total_recommendations,  -- Total recommendations from join
    SUM(CASE 
            WHEN um.awards IS NOT NULL THEN 
                CASE 
                    WHEN um.awards LIKE '1 win%' THEN 1
                    ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                END
            ELSE 0 
        END) AS total_wins,  -- Total wins

    SUM(CASE 
            WHEN um.awards IS NOT NULL THEN 
                CASE 
                    WHEN um.awards LIKE '1 nomination%' THEN 1
                    ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                END
            ELSE 0 

        END) AS total_nominations  -- Total nominations
  FROM 
      UniqueMovies um
  LEFT JOIN 
      ActorRecommendations ar ON um.actor = ar.actor  -- Join to get total recommendations
  WHERE 
      um.boxOffice IS NOT NULL 
      AND um.boxOffice != 'N/A'
      AND um.metascore IS NOT NULL 
      AND um.metascore != 'N/A'
  GROUP BY 
      um.actor
  ORDER BY 
      avg_imdb_rating DESC
  LIMIT 100`;
  db.query(query, async (err, results) => {
    if (err) return callback(err);

    // Изчисляване на резултатите за просперитет
    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    // Намиране на максималната стойност на бокс офис, за да се нормализира
    const maxBoxOffice = Math.max(
      ...results.map((actor) => {
        const totalBoxOffice =
          parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;
        return totalBoxOffice;
      })
    );

    const actorsWithProsperity = results.map((actor) => {
      const totalWins = actor.total_wins || 0; // Уверете се, че няма null стойности
      const totalNominations = actor.total_nominations || 0;

      // Парсиране и нормализиране на стойността на бокс офис
      const totalBoxOffice =
        parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;

      // Нормализиране на стойността на бокс офис в мащаб 0-1
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;

      const avgIMDbRating = actor.avg_imdb_rating || 0;
      const avgMetascore = actor.avg_metascore || 0; // Добавяне на metascore
      const avgRottenTomatoes = actor.avg_rotten_tomatoes
        ? parseFloat(actor.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgMetascore * weights.avg_metascore +
        avgIMDbRating * weights.avg_imdb_rating +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      return {
        ...actor,
        prosperityScore: Number(prosperityScore.toFixed(2))
      };
    });

    // Превеждане на имената на всеки актьор
    const translatedResults = await Promise.all(
      actorsWithProsperity.map(async (row) => {
        const translatedActor = await hf.translate(row.actor);
        return {
          actor_bg: translatedActor,
          ...row
        };
      })
    );

    translatedResults.sort((a, b) => b.prosperityScore - a.prosperityScore);

    callback(null, translatedResults);
  });
};

/**
 * Извлича сценаристите спрямо просперитетът им, изчислена на база различни показатели.
 *
 * @param {function} callback - Функция, която се извиква при завършване на заявката с резултатите.
 */
const getSortedWritersByProsperity = (callback) => {
  const query = `  
  WITH RECURSIVE WriterSplit AS (
    SELECT 
        id, 
        TRIM(SUBSTRING_INDEX(writer, ',', 1)) AS writer,
        SUBSTRING_INDEX(writer, ',', -1) AS remaining_writers,
        imdbRating,
        metascore,
        boxOffice,
        awards,
        imdbID,
        ratings,
        type
    FROM movies_series_recommendations
    WHERE writer IS NOT NULL 
      AND writer != 'N/A'
    UNION ALL
    SELECT 
        id,
        TRIM(SUBSTRING_INDEX(remaining_writers, ',', 1)) AS writer,
        SUBSTRING_INDEX(remaining_writers, ',', -1) AS remaining_writers,
        imdbRating,
        metascore,
        boxOffice,
        awards,
        imdbID,
        ratings,
        type
    FROM WriterSplit
    WHERE remaining_writers LIKE '%,%'
  ),
  UniqueMovies AS (
      SELECT 
          DISTINCT imdbID,
          writer,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ratings
      FROM 
          WriterSplit
      WHERE writer IS NOT NULL AND writer != 'N/A'
  ),
  WriterRecommendations AS (
    SELECT writer, COUNT(*) AS total_recommendations  -- Count all recommendations for each writer
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
      FROM movies_series_recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
          , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
            UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))  -- Split the writer list by comma
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
    ) AS writer_list
    GROUP BY writer
    ORDER BY total_recommendations DESC
  )
  SELECT 
      um.writer,
      ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
      AVG(um.metascore) AS avg_metascore,
      CONCAT('$', FORMAT(SUM(CASE 
              WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
              THEN 0 
              ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
          END), 0)) AS total_box_office,
      CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes, -- Average Rotten Tomatoes rating
      COUNT(DISTINCT um.imdbID) AS movie_count,  -- Count distinct movies
      COALESCE(wr.total_recommendations, 0) AS total_recommendations,  -- Total recommendations from join
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 win%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_wins,  -- Total wins

      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 nomination%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 

          END) AS total_nominations  -- Total nominations
  FROM 
      UniqueMovies um
  LEFT JOIN 
      WriterRecommendations wr ON um.writer = wr.writer  -- Join to get total recommendations
  WHERE 
      um.boxOffice IS NOT NULL 
      AND um.boxOffice != 'N/A'
      AND um.metascore IS NOT NULL 
      AND um.metascore != 'N/A'
  GROUP BY 
      um.writer
  ORDER BY 
      avg_imdb_rating DESC
  LIMIT 100`;

  db.query(query, async (err, results) => {
    if (err) return callback(err);

    // Calculate prosperity scores
    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    // Find maximum box office value to normalize
    const maxBoxOffice = Math.max(
      ...results.map((writer) => {
        const totalBoxOffice =
          parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;
        return totalBoxOffice;
      })
    );

    const writersWithProsperity = results.map((writer) => {
      const totalWins = writer.total_wins || 0; // Ensure no null values
      const totalNominations = writer.total_nominations || 0;

      // Parse and normalize the box office value
      const totalBoxOffice =
        parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;

      // Normalize the box office value to a scale of 0-1
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;

      const avgIMDbRating = writer.avg_imdb_rating || 0;
      const avgMetascore = writer.avg_metascore || 0;
      const avgRottenTomatoes = writer.avg_rotten_tomatoes
        ? parseFloat(writer.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      // Calculate prosperity score using weighted values
      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgIMDbRating * weights.avg_imdb_rating +
        avgMetascore * weights.avg_metascore +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      return {
        ...writer,
        prosperityScore: Number(prosperityScore.toFixed(2)) // Round to two decimal places
      };
    });

    // Translate each writer's name
    const translatedResults = await Promise.all(
      writersWithProsperity.map(async (row) => {
        const translatedWriter = await hf.translate(row.writer);
        return {
          writer_bg: translatedWriter,
          ...row
        };
      })
    );

    translatedResults.sort((a, b) => b.prosperityScore - a.prosperityScore);

    callback(null, translatedResults);
  });
};

/**
 * Извлича филмите спрямо просперитетът им, изчислена на база различни показатели.
 *
 * @param {function} callback - Функция, която се извиква при завършване на заявката с резултатите.
 */
const getSortedMoviesByProsperity = (callback) => {
  const query = `
  WITH RECURSIVE MovieSplit AS (
      SELECT 
          id, 
          TRIM(SUBSTRING_INDEX(imdbID, ',', 1)) AS imdbID,
          SUBSTRING_INDEX(imdbID, ',', -1) AS remaining_ids,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ratings,
          title_en,
          title_bg,
          type,
          genre_en, 
          genre_bg   
      FROM movies_series_recommendations
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
      UNION ALL
      SELECT 
          id,
          TRIM(SUBSTRING_INDEX(remaining_ids, ',', 1)) AS imdbID,
          SUBSTRING_INDEX(remaining_ids, ',', -1) AS remaining_ids,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ratings,
          title_en,
          title_bg,
          type,
          genre_en, 
          genre_bg  
      FROM MovieSplit
      WHERE remaining_ids LIKE '%,%'
  ),
  UniqueMovies AS (
      SELECT 
          DISTINCT imdbID,
          MAX(title_en) AS title_en,
          MAX(title_bg) AS title_bg,
          MAX(type) AS type,
          MAX(imdbRating) AS imdbRating,
          MAX(metascore) AS metascore,
          MAX(boxOffice) AS boxOffice,
          MAX(awards) AS awards,
          MAX(ratings) AS ratings,
          MAX(genre_en) AS genre_en, 
          MAX(genre_bg) AS genre_bg  
      FROM 
          MovieSplit
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
      GROUP BY 
          imdbID
  ),
  MovieRecommendations AS (
      SELECT 
          imdbID,
          COUNT(*) AS total_recommendations
      FROM 
          movies_series_recommendations
      WHERE 
          imdbID IS NOT NULL 
          AND imdbID != 'N/A'
      GROUP BY 
          imdbID
  )
  SELECT 
      um.imdbID,
      um.title_en,
      um.title_bg,
      um.type,
      um.imdbRating,
      um.metascore,
      CONCAT('$', FORMAT(MAX(CASE 
              WHEN boxOffice IS NULL OR boxOffice = 'N/A' THEN 0 
              ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
          END), 0)) AS total_box_office,
      JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')) AS rotten_tomatoes,
      COALESCE(mr.total_recommendations, 0) AS total_recommendations,
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 win%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_wins,
      SUM(CASE 
              WHEN um.awards IS NOT NULL THEN 
                  CASE 
                      WHEN um.awards LIKE '1 nomination%' THEN 1
                      ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                  END
              ELSE 0 
          END) AS total_nominations,
      um.genre_en AS genre_en, 
      um.genre_bg AS genre_bg   
  FROM 
      UniqueMovies um
  LEFT JOIN 
      MovieRecommendations mr ON um.imdbID = mr.imdbID
  WHERE 
      um.boxOffice IS NOT NULL 
      AND um.boxOffice != 'N/A'
      AND um.metascore IS NOT NULL 
      AND um.metascore != 'N/A'
  GROUP BY 
      um.imdbID, um.title_en, um.title_bg, um.type, um.imdbRating, um.metascore, um.genre_en
  ORDER BY 
      um.imdbRating DESC
  LIMIT 100
  `;

  db.query(query, (err, results) => {
    if (err) return callback(err);

    // Изчисляване на просперитета на филмите
    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    // Намиране на максималната стойност на бокс офис, за да се нормализира
    const maxBoxOffice = Math.max(
      ...results.map((movie) => {
        const totalBoxOffice =
          parseFloat(movie.total_box_office.replace(/[$,]/g, "")) || 0;
        return totalBoxOffice;
      })
    );

    const moviesWithProsperity = results.map((movie) => {
      const totalWins = movie.total_wins || 0; // Осигуряване, че няма null стойности
      const totalNominations = movie.total_nominations || 0;

      // Парсиране и нормализиране на стойността на бокс офис
      const totalBoxOffice =
        parseFloat(movie.total_box_office.replace(/[$,]/g, "")) || 0;

      // Нормализиране на стойността на бокс офис в мащаб 0-1
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;

      const avgIMDbRating = movie.imdbRating || 0;
      const avgMetascore = movie.metascore || 0; // Добавяне на метаоценка
      const avgRottenTomatoes = movie.avg_rotten_tomatoes
        ? parseFloat(movie.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      // Изчисляване на просперитета чрез тежести на стойностите
      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgIMDbRating * weights.avg_imdb_rating +
        avgMetascore * weights.avg_metascore +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      return {
        ...movie,
        prosperityScore: Number(prosperityScore.toFixed(2)) // Округляване до два десетични знака
      };
    });

    // Сортиране по просперитет
    moviesWithProsperity.sort((a, b) => b.prosperityScore - a.prosperityScore);

    callback(null, moviesWithProsperity);
  });
};

/**
 * Извлича най-препоръчваните филми и сериали по метаскор.
 *
 * Тази функция изпълнява SQL заявка за извличане на филми и сериали с най-висок метаскор
 * от таблицата "movies_series_recommendations". Резултатите са подредени по метаскор
 * в низходящ ред, като резултатите се ограничават до зададения лимит.
 *
 * @param {number} limit - Броят на записите, които да бъдат върнати от заявката.
 * @param {function} callback - Функция за обратна връзка, която ще бъде извикана след изпълнението на заявката.
 */
const getTopMoviesAndSeriesByMetascore = (limit, callback) => {
  const query = `
  SELECT 
      imdbID,
      title_en,
      title_bg,
      type,
      imdbRating,
      metascore,
      boxOffice,
      awards
  FROM (
      SELECT 
          imdbID,
          title_en,
          title_bg,
          type,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ROW_NUMBER() OVER (PARTITION BY imdbID ORDER BY metascore DESC) AS row_num
      FROM movies_series_recommendations
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
        AND metascore IS NOT NULL
        AND metascore != 'N/A'
  ) AS ranked
  WHERE row_num = 1
  ORDER BY metascore DESC
  LIMIT ?;
  `;
  db.query(query, [limit], callback);
};

/**
 * Извлича най-препоръчваните филми и сериали по IMDb рейтинг.
 *
 * Тази функция изпълнява SQL заявка за извличане на филми и сериали с най-висок IMDb рейтинг
 * от таблицата "movies_series_recommendations". Резултатите са подредени по IMDb рейтинг
 * в низходящ ред, като резултатите се ограничават до зададения лимит.
 *
 * @param {number} limit - Броят на записите, които да бъдат върнати от заявката.
 * @param {function} callback - Функция за обратна връзка, която ще бъде извикана след изпълнението на заявката.
 */

const getTopMoviesAndSeriesByIMDbRating = (limit, callback) => {
  const query = `
  SELECT 
      imdbID,
      title_en,
      title_bg,
      type,
      imdbRating,
      metascore,
      boxOffice,
      awards
  FROM (
      SELECT 
          imdbID,
          title_en,
          title_bg,
          type,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ROW_NUMBER() OVER (PARTITION BY imdbID ORDER BY imdbRating DESC) AS row_num
      FROM movies_series_recommendations
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
        AND imdbRating IS NOT NULL
        AND imdbRating != 'N/A'
  ) AS ranked
  WHERE row_num = 1
  ORDER BY imdbRating DESC
  LIMIT ?;
  `;
  db.query(query, [limit], callback);
};

/**
 * Извлича най-препоръчваните филми и сериали по рейтинг на Rotten Tomatoes.
 *
 * Тази функция изпълнява SQL заявка за извличане на филми и сериали с най-висок рейтинг
 * от Rotten Tomatoes от таблицата "movies_series_recommendations". Резултатите са подредени
 * по рейтинг на Rotten Tomatoes в низходящ ред, като резултатите се ограничават до зададения лимит.
 *
 * @param {number} limit - Броят на записите, които да бъдат върнати от заявката.
 * @param {function} callback - Функция за обратна връзка, която ще бъде извикана след изпълнението на заявката.
 */
const getTopMoviesAndSeriesByRottenTomatoesRating = (limit, callback) => {
  const query = `
  SELECT 
      imdbID,
      title_en,
      title_bg,
      type,
      imdbRating,
      metascore,
      boxOffice,
      awards,
      ratings,
      rottenTomatoes
    FROM (
      SELECT 
          imdbID,
          title_en,
          title_bg,
          type,
          imdbRating,
          metascore,
          boxOffice,
          awards,
          ratings,
      
          -- Extract Rotten Tomatoes score as a decimal, if available
          CAST(
              REPLACE(
                  JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')), '%', ''
              ) AS DECIMAL(5, 2)
          ) AS rottenTomatoes,

          -- Assign row number based on Rotten Tomatoes score in descending order
          ROW_NUMBER() OVER (PARTITION BY imdbID ORDER BY 
              CAST(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')), '%', '') AS DECIMAL(5, 2)) DESC
          ) AS row_num

      FROM movies_series_recommendations
      WHERE imdbID IS NOT NULL 
        AND imdbID != 'N/A'
        AND JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')) IS NOT NULL
        AND JSON_UNQUOTE(JSON_EXTRACT(ratings, '$[1].Value')) != 'N/A'
  ) AS ranked
  WHERE row_num = 1
  ORDER BY rottenTomatoes DESC
  LIMIT ?;
  `;
  db.query(query, [limit], callback);
};

/**
 * Функция за извличане на най-добрите препоръки за потребител по неговото ID.
 *
 * @param {number} userId - ID на потребителя, за когото се извършва търсенето.
 * @param {function} callback - Функция за обработка на резултатите от заявката.
 *
 * @callback callback
 * @param {Error|null} err - Ако възникне грешка по време на заявката.
 * @param {Object|null} results - Резултатите от заявката или съобщение за грешка.
 * @returns {void}
 */
const getUsersTopRecommendations = (userId, callback) => {
  const query = `
    SELECT 
        r.*,
        COUNT(*) AS recommendations,

        -- Extract Oscar wins as an integer (if available)
        COALESCE(
            CASE 
                WHEN r.awards REGEXP 'Won [0-9]+ Oscar' OR r.awards REGEXP 'Won [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Won ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_wins,

        -- Extract Oscar nominations as an integer (if available)
        COALESCE(
            CASE 
                WHEN r.awards REGEXP 'Nominated for [0-9]+ Oscar' OR r.awards REGEXP 'Nominated for [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(r.awards, 'Nominated for ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_nominations,

        -- Extract total wins as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) win(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_wins,

        -- Extract total nominations as an integer
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(r.awards, '([0-9]+) nomination(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_nominations,

        -- Include additional fields
        COALESCE(CAST(r.imdbRating AS DECIMAL(3, 1)), 0) AS imdbRating,
        COALESCE(CAST(r.metascore AS UNSIGNED), 0) AS metascore,
        COALESCE(
            CAST(REPLACE(REPLACE(r.boxOffice, '$', ''), ',', '') AS UNSIGNED),
            0
        ) AS boxOffice
    FROM 
        movies_series_recommendations r
    WHERE 
        r.user_id = ${userId}
    GROUP BY 
        r.title_en
    ORDER BY 
        recommendations DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (!results.length) {
      callback(null, {
        message: "No top recommendations found for the user."
      });
      return;
    }

    const weights = {
      total_wins: 0.3,
      total_nominations: 0.25,
      total_box_office: 0.15,
      avg_metascore: 0.1,
      avg_imdb_rating: 0.1,
      avg_rotten_tomatoes: 0.1
    };

    // Намиране на максималната стойност на бокс офис, за да се нормализира
    const maxBoxOffice = Math.max(
      ...results.map((movie) => {
        const totalBoxOffice = movie.boxOffice
          ? parseFloat(movie.boxOffice.replace(/[$,]/g, "")) || 0
          : 0; // Handle undefined boxOffice
        return totalBoxOffice;
      })
    );

    const recommendationsWithProsperity = results.map((movie) => {
      const totalWins = movie.total_wins || 0; // Ensure no null values
      const totalNominations = movie.total_nominations || 0;

      // Parse and normalize the box office value
      const totalBoxOffice = movie.boxOffice
        ? parseFloat(movie.boxOffice.replace(/[$,]/g, "")) || 0
        : 0; // Handle undefined boxOffice

      // Normalize the box office value on a 0-1 scale
      const normalizedBoxOffice = maxBoxOffice
        ? totalBoxOffice / maxBoxOffice
        : 0;

      const avgIMDbRating = movie.imdbRating || 0;
      const avgMetascore = movie.metascore || 0; // Add Metascore
      const avgRottenTomatoes = movie.avg_rotten_tomatoes
        ? parseFloat(movie.avg_rotten_tomatoes.replace("%", "")) / 100
        : 0;

      // Calculate prosperity score using weighted values
      const prosperityScore =
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        avgIMDbRating * weights.avg_imdb_rating +
        avgMetascore * weights.avg_metascore +
        avgRottenTomatoes * weights.avg_rotten_tomatoes;

      // Format the box office value with dollar sign and commas
      const formattedBoxOffice = totalBoxOffice
        ? `$${totalBoxOffice.toLocaleString()}`
        : "$0";

      return {
        ...movie,
        prosperityScore: Number(prosperityScore.toFixed(2)), // Round to 2 decimal places
        boxOffice: formattedBoxOffice // Add formatted boxOffice
      };
    });

    // Count the number of series and movies
    const recommendationsCount = recommendationsWithProsperity.reduce(
      (acc, rec) => {
        if (rec.type === "movie") {
          acc.movies++;
        } else if (rec.type === "series") {
          acc.series++;
        }
        return acc;
      },
      { movies: 0, series: 0 }
    );

    // Include recommendationsCount and sorted recommendations in the response
    callback(null, {
      recommendationsCount,
      recommendations: recommendationsWithProsperity
    });
  });
};

/**
 * Функция за извличане на списъка за гледане на потребител по неговото ID.
 *
 * @param {number} userId - ID на потребителя, за когото се извършва търсенето.
 * @param {function} callback - Функция за обработка на резултатите от заявката.
 *
 * @callback callback
 * @param {Error|null} err - Ако възникне грешка по време на заявката.
 * @param {Object|null} results - Резултатите от заявката или съобщение за грешка.
 * @returns {void}
 */
const getUsersWatchlist = (userId, callback) => {
  const query = `
    SELECT 
        w.*,
        
        -- Извличане на броя на спечелените Оскари (ако са налични)
        COALESCE(
            CASE 
                WHEN w.awards REGEXP 'Won [0-9]+ Oscar' OR w.awards REGEXP 'Won [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(w.awards, 'Won ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_wins,

        -- Извличане на броя на номинациите за Оскари (ако са налични)
        COALESCE(
            CASE 
                WHEN w.awards REGEXP 'Nominated for [0-9]+ Oscar' OR w.awards REGEXP 'Nominated for [0-9]+ Oscars' 
                THEN CAST(NULLIF(SUBSTRING_INDEX(SUBSTRING_INDEX(w.awards, 'Nominated for ', -1), ' Oscar', 1), '') AS UNSIGNED)
                ELSE 0
            END, 
            0
        ) AS oscar_nominations,

        -- Извличане на общия брой спечелени награди
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(w.awards, '([0-9]+) win(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_wins,

        -- Извличане на общия брой номинации
        COALESCE(
            CAST(NULLIF(REGEXP_SUBSTR(w.awards, '([0-9]+) nomination(s)?'), '') AS UNSIGNED), 
            0
        ) AS total_nominations,

        -- Добавяне на допълнителни полета
        COALESCE(CAST(w.imdbRating AS DECIMAL(3, 1)), 0) AS imdbRating,
        COALESCE(CAST(w.metascore AS UNSIGNED), 0) AS metascore,
        COALESCE(
            CAST(REPLACE(REPLACE(w.boxOffice, '$', ''), ',', '') AS UNSIGNED),
            0
        ) AS boxOffice
    FROM 
        watchlist w
    WHERE 
        w.user_id = ${userId}
    ORDER BY 
        w.title_en ASC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Ако няма резултати, връщаме съобщение по подразбиране
    if (!results.length) {
      callback(null, {
        message: "Няма записи в списъка за гледане за този потребител."
      });
      return;
    }

    // Изчисляване на оценка за просперитет за всеки запис
    const weights = {
      total_wins: 0.3, // Тегло за спечелени награди
      total_nominations: 0.25, // Тегло за номинации
      total_box_office: 0.15, // Тегло за приходи от касата
      avg_metascore: 0.1, // Тегло за Metascore
      avg_imdb_rating: 0.1, // Тегло за IMDb рейтинг
      avg_rotten_tomatoes: 0.1 // Тегло за Rotten Tomatoes рейтинг
    };

    const maxBoxOffice = Math.max(
      ...results.map((item) => parseFloat(item.boxOffice) || 0)
    );

    const enrichedWatchlist = results.map((item) => {
      const totalWins = item.total_wins || 0;
      const totalNominations = item.total_nominations || 0;
      const normalizedBoxOffice = maxBoxOffice
        ? (item.boxOffice || 0) / maxBoxOffice
        : 0;
      const prosperityScore = (
        totalWins * weights.total_wins +
        totalNominations * weights.total_nominations +
        normalizedBoxOffice * weights.total_box_office +
        (item.imdbRating || 0) * weights.avg_imdb_rating +
        (item.metascore || 0) * weights.avg_metascore
      ).toFixed(2);

      // Parse and normalize the box office value
      const totalBoxOffice = item.boxOffice
        ? parseFloat(item.boxOffice.replace(/[$,]/g, "")) || 0
        : 0; // Handle undefined boxOffice

      // Format the box office value with dollar sign and commas
      const formattedBoxOffice = totalBoxOffice
        ? `$${totalBoxOffice.toLocaleString()}`
        : "$0";

      return {
        ...item,
        prosperityScore: parseFloat(prosperityScore),
        boxOffice: formattedBoxOffice // Add formatted boxOffice
      };
    });

    // Count the number of series and movies
    const savedCount = enrichedWatchlist.reduce(
      (acc, item) => {
        if (item.type === "movie") {
          acc.movies++;
        } else if (item.type === "series") {
          acc.series++;
        }
        return acc;
      },
      { movies: 0, series: 0 }
    );

    // Include savedCount and enriched watchlist in the response
    callback(null, {
      savedCount,
      watchlist: enrichedWatchlist
    });
  });
};

/**
 * Функция за извличане на списъка за четене на потребител по неговото ID.
 *
 * @param {number} userId - ID на потребителя, за когото се извършва търсенето.
 * @param {function} callback - Функция за обработка на резултатите от заявката.
 *
 * @callback callback
 * @param {Error|null} err - Ако възникне грешка по време на заявката.
 * @param {Array} results - Массив с резултатите от заявката.
 * @returns {void}
 */
const getUsersReadlist = (userId, callback) => {
  const query = `
    SELECT * FROM readlist
    WHERE user_id = ?
    ORDER BY title_en ASC;
  `;

  db.query(query, [userId], callback);
};

/**
 * Извлича топ жанровете на потребителя от препоръките му.
 *
 * @param {number} userId - Идентификатор на потребителя, за когото ще се извлекат топ жанровете.
 * @param {number} limit - Максимален брой жанрове, които да се върнат.
 * @param {function} callback - Функция за обратно извикване, която получава резултатите или грешка.
 */
const getUsersTopGenres = (userId, limit, callback) => {
  const query = `
    SELECT genre_en, genre_bg, COUNT(*) AS count
    FROM (
      SELECT 
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.genre_en, ',', numbers.n), ',', -1)) AS genre_en,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(r.genre_bg, ',', numbers.n), ',', -1)) AS genre_bg
      FROM movies_series_recommendations r
      INNER JOIN (
        SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
        SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
      ) AS numbers 
      ON CHAR_LENGTH(r.genre_en) - CHAR_LENGTH(REPLACE(r.genre_en, ',', '')) >= numbers.n - 1
      AND CHAR_LENGTH(r.genre_bg) - CHAR_LENGTH(REPLACE(r.genre_bg, ',', '')) >= numbers.n - 1
      WHERE r.user_id = ?
    ) AS subquery
    GROUP BY genre_en, genre_bg
    ORDER BY count DESC
    LIMIT ?
  `;
  db.query(query, [userId, limit], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (!results.length) {
      callback(null, {
        message: "No top genres found for the user."
      });
    } else {
      callback(null, results); // Pass the results to the callback
    }
  });
};

/**
 * Извлича топ жанровете на потребителя от неговия watchlist.
 *
 * @param {number} userId - Идентификатор на потребителя, за когото ще се извлекат топ жанровете.
 * @param {number} limit - Максимален брой жанрове, които да се върнат.
 * @param {function} callback - Функция за обратно извикване, която получава резултатите или грешка.
 */
const getUsersTopGenresFromWatchlist = (userId, limit, callback) => {
  const query = `
    SELECT genre_en, genre_bg, COUNT(*) AS count
    FROM (
      SELECT 
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(w.genre_en, ',', numbers.n), ',', -1)) AS genre_en,
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(w.genre_bg, ',', numbers.n), ',', -1)) AS genre_bg
      FROM watchlist w
      INNER JOIN (
        SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
        SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
      ) AS numbers 
      ON CHAR_LENGTH(w.genre_en) - CHAR_LENGTH(REPLACE(w.genre_en, ',', '')) >= numbers.n - 1
      AND CHAR_LENGTH(w.genre_bg) - CHAR_LENGTH(REPLACE(w.genre_bg, ',', '')) >= numbers.n - 1
      WHERE w.user_id = ?
    ) AS subquery
    GROUP BY genre_en, genre_bg
    ORDER BY count DESC
    LIMIT ?
  `;

  db.query(query, [userId, limit], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (!results.length) {
      callback(null, {
        message:
          "No top genres from watchlist found for the user in the watchlist."
      });
    } else {
      callback(null, results); // Pass the results to the callback
    }
  });
};

/**
 * Извлича топ актьорите на потребителя от препоръките му.
 *
 * @param {number} userId - Идентификатор на потребителя, за когото ще се извлекат топ актьорите.
 * @param {number} limit - Максимален брой жанрове, които да се върнат.
 * @param {function} callback - Функция за обратно извикване, която получава резултатите или грешка.
 */
const getUsersTopActors = (userId, limit, callback) => {
  const query = `
    SELECT actor, COUNT(*) AS recommendations_count
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
      FROM movies_series_recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE user_id = ? 
        AND n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
    ) AS actor_list
    GROUP BY actor
    ORDER BY recommendations_count DESC
    LIMIT ?;
  `;

  db.query(query, [userId, limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // If no results, return a default response
    if (!results.length) {
      callback(null, {
        message: "No top actors found for the user."
      });
      return;
    }

    // Translate actor names
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedActor = await hf.translate(row.actor);
        return {
          actor_en: row.actor,
          actor_bg: translatedActor,
          recommendations_count: row.recommendations_count
        };
      })
    );

    // Fetch prosperity data for the actors
    const actors = translatedResults
      .map((actor) => `'${actor.actor_en.replace(/'/g, "''")}'`)
      .join(",");

    const prosperityQuery = `
      WITH RECURSIVE ActorSplit AS (
        SELECT 
            id, 
            TRIM(SUBSTRING_INDEX(actors, ',', 1)) AS actor,
            SUBSTRING_INDEX(actors, ',', -1) AS remaining_actors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM movies_series_recommendations
        WHERE actors IS NOT NULL 
          AND actors != 'N/A'
        UNION ALL
        SELECT 
            id,
            TRIM(SUBSTRING_INDEX(remaining_actors, ',', 1)) AS actor,
            SUBSTRING_INDEX(remaining_actors, ',', -1) AS remaining_actors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM ActorSplit
        WHERE remaining_actors LIKE '%,%'
      ),
      UniqueMovies AS (
        SELECT 
            DISTINCT imdbID,
            actor,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            ratings
        FROM ActorSplit
        WHERE actor IS NOT NULL AND actor != 'N/A'
      ),
      ActorRecommendations AS (
        SELECT actor, COUNT(*) AS total_recommendations  -- Count all recommendations for each actor
        FROM (
          SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
          FROM movies_series_recommendations
          CROSS JOIN (
              SELECT a.N + b.N * 10 + 1 AS n
              FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              ORDER BY n
          ) n
          WHERE n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))  -- Split the actor list by comma
            AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
        ) AS actor_list
        GROUP BY actor
        ORDER BY total_recommendations DESC
      )
      SELECT 
        um.actor,
        ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
        AVG(um.metascore) AS avg_metascore,
        CONCAT('$', FORMAT(SUM(CASE 
                WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
                THEN 0 
                ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
            END), 0)) AS total_box_office,
        CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes,
        COUNT(DISTINCT um.imdbID) AS movie_series_count,
        COALESCE(ar.total_recommendations, 0) AS total_recommendations,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 win%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_wins,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 nomination%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_nominations
      FROM 
          UniqueMovies um
      LEFT JOIN 
          ActorRecommendations ar ON um.actor = ar.actor
      WHERE 
          um.actor IN (${actors})
      GROUP BY 
          um.actor
      ORDER BY 
          avg_imdb_rating DESC;
    `;

    db.query(prosperityQuery, async (err, prosperityResults) => {
      if (err) {
        console.log("err: ", err);
        callback(err, null);
        return;
      }

      // Calculate prosperity score for each actor
      const maxBoxOffice = Math.max(
        ...prosperityResults.map((actor) => {
          const totalBoxOffice =
            parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      const weights = {
        total_wins: 0.3,
        total_nominations: 0.25,
        total_box_office: 0.15,
        avg_metascore: 0.1,
        avg_imdb_rating: 0.1,
        avg_rotten_tomatoes: 0.1
      };

      const actorsWithProsperity = prosperityResults.map((actor) => {
        const totalWins = actor.total_wins || 0;
        const totalNominations = actor.total_nominations || 0;

        const totalBoxOffice =
          parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;
        const normalizedBoxOffice = maxBoxOffice
          ? totalBoxOffice / maxBoxOffice
          : 0;

        const avgIMDbRating = actor.avg_imdb_rating || 0;
        const avgMetascore = actor.avg_metascore || 0;
        const avgRottenTomatoes = actor.avg_rotten_tomatoes
          ? parseFloat(actor.avg_rotten_tomatoes.replace("%", "")) / 100
          : 0;

        const prosperityScore =
          totalWins * weights.total_wins +
          totalNominations * weights.total_nominations +
          normalizedBoxOffice * weights.total_box_office +
          avgMetascore * weights.avg_metascore +
          avgIMDbRating * weights.avg_imdb_rating +
          avgRottenTomatoes * weights.avg_rotten_tomatoes;

        return {
          ...actor,
          prosperityScore: Number(prosperityScore.toFixed(2))
        };
      });

      // Combine the top actors with their prosperity data
      const combinedResults = translatedResults.map((actor) => {
        const prosperity = actorsWithProsperity.find(
          (result) => result.actor === actor.actor_en
        ) || {
          prosperityScore: "N/A",
          total_box_office: "N/A",
          avg_imdb_rating: "N/A",
          avg_metascore: "N/A",
          avg_rotten_tomatoes: "N/A",
          movie_series_count: "N/A",
          total_recommendations: "N/A",
          total_wins: "N/A",
          total_nominations: "N/A"
        };
        return {
          ...actor,
          ...prosperity
        };
      });

      // Remove unnecessary fields
      const filteredResults = combinedResults.map((actorData) => {
        const { actor, ...rest } = actorData;
        return rest;
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b.total_recommendations - a.total_recommendations
      );

      callback(null, sortedResults);
    });
  });
};

/**
 * Извлича топ актьорите на потребителя от неговия watchlist.
 *
 * @param {number} userId - Идентификатор на потребителя, за когото ще се извлекат топ актьорите.
 * @param {number} limit - Максимален брой жанрове, които да се върнат.
 * @param {function} callback - Функция за обратно извикване, която получава резултатите или грешка.
 */
const getUsersTopActorsFromWatchlist = (userId, limit, callback) => {
  const query = `
    SELECT actor, COUNT(*) AS saved_count
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
      FROM watchlist
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE user_id = ? 
        AND n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
    ) AS actor_list
    GROUP BY actor
    ORDER BY saved_count DESC
    LIMIT ?;
  `;

  db.query(query, [userId, limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // If no results, return a default response
    if (!results.length) {
      callback(null, {
        message: "No top actors from watchlist found for the user."
      });
      return;
    }

    // Translate actor names
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedActor = await hf.translate(row.actor);
        return {
          actor_en: row.actor,
          actor_bg: translatedActor,
          saved_count: row.saved_count
        };
      })
    );

    // Fetch prosperity data for the actors
    const actors = translatedResults
      .map((actor) => `'${actor.actor_en.replace(/'/g, "''")}'`)
      .join(",");

    const prosperityQuery = `
      WITH RECURSIVE ActorSplit AS (
        SELECT 
            id, 
            TRIM(SUBSTRING_INDEX(actors, ',', 1)) AS actor,
            SUBSTRING_INDEX(actors, ',', -1) AS remaining_actors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM watchlist
        WHERE actors IS NOT NULL 
          AND actors != 'N/A'
        UNION ALL
        SELECT 
            id,
            TRIM(SUBSTRING_INDEX(remaining_actors, ',', 1)) AS actor,
            SUBSTRING_INDEX(remaining_actors, ',', -1) AS remaining_actors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM ActorSplit
        WHERE remaining_actors LIKE '%,%'
      ),
      UniqueMovies AS (
        SELECT 
            DISTINCT imdbID,
            actor,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            ratings
        FROM ActorSplit
        WHERE actor IS NOT NULL AND actor != 'N/A'
      ),
      ActorRecommendations AS (
        SELECT actor, COUNT(*) AS total_saved_count  -- Count all saved instances for each actor
        FROM (
          SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) AS actor
          FROM watchlist
          CROSS JOIN (
              SELECT a.N + b.N * 10 + 1 AS n
              FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              ORDER BY n
          ) n
          WHERE n.n <= 1 + (LENGTH(actors) - LENGTH(REPLACE(actors, ',', '')))  -- Split the actor list by comma
            AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(actors, ',', n.n), ',', -1)) != 'N/A'
        ) AS actor_list
        GROUP BY actor
        ORDER BY total_saved_count DESC
      )
      SELECT 
        um.actor,
        ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
        AVG(um.metascore) AS avg_metascore,
        CONCAT('$', FORMAT(SUM(CASE 
                WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
                THEN 0 
                ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
            END), 0)) AS total_box_office,
        CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes,
        COUNT(DISTINCT um.imdbID) AS movie_series_count,
        COALESCE(ar.total_saved_count, 0) AS total_saved_count,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 win%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_wins,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 nomination%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_nominations
      FROM 
          UniqueMovies um
      LEFT JOIN 
          ActorRecommendations ar ON um.actor = ar.actor
      WHERE 
          um.actor IN (${actors})
      GROUP BY 
          um.actor
      ORDER BY 
          avg_imdb_rating DESC;
    `;

    db.query(prosperityQuery, async (err, prosperityResults) => {
      if (err) {
        console.log("err: ", err);
        callback(err, null);
        return;
      }

      // Calculate prosperity score for each actor
      const maxBoxOffice = Math.max(
        ...prosperityResults.map((actor) => {
          const totalBoxOffice =
            parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      const weights = {
        total_wins: 0.3,
        total_nominations: 0.25,
        total_box_office: 0.15,
        avg_metascore: 0.1,
        avg_imdb_rating: 0.1,
        avg_rotten_tomatoes: 0.1
      };

      const actorsWithProsperity = prosperityResults.map((actor) => {
        const totalWins = actor.total_wins || 0;
        const totalNominations = actor.total_nominations || 0;

        const totalBoxOffice =
          parseFloat(actor.total_box_office.replace(/[$,]/g, "")) || 0;
        const normalizedBoxOffice = maxBoxOffice
          ? totalBoxOffice / maxBoxOffice
          : 0;

        const avgIMDbRating = actor.avg_imdb_rating || 0;
        const avgMetascore = actor.avg_metascore || 0;
        const avgRottenTomatoes = actor.avg_rotten_tomatoes
          ? parseFloat(actor.avg_rotten_tomatoes.replace("%", "")) / 100
          : 0;

        const prosperityScore =
          totalWins * weights.total_wins +
          totalNominations * weights.total_nominations +
          normalizedBoxOffice * weights.total_box_office +
          avgMetascore * weights.avg_metascore +
          avgIMDbRating * weights.avg_imdb_rating +
          avgRottenTomatoes * weights.avg_rotten_tomatoes;

        return {
          ...actor,
          prosperityScore: Number(prosperityScore.toFixed(2))
        };
      });

      // Combine the top actors with their prosperity data
      const combinedResults = translatedResults.map((actor) => {
        const prosperity = actorsWithProsperity.find(
          (result) => result.actor === actor.actor_en
        ) || {
          prosperityScore: "N/A",
          total_box_office: "N/A",
          avg_imdb_rating: "N/A",
          avg_metascore: "N/A",
          avg_rotten_tomatoes: "N/A",
          movie_series_count: "N/A",
          total_saved_count: "N/A",
          total_wins: "N/A",
          total_nominations: "N/A"
        };
        return {
          ...actor,
          ...prosperity
        };
      });

      // Remove unnecessary fields
      const filteredResults = combinedResults.map((actorData) => {
        const { actor, ...rest } = actorData;
        return rest;
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b.total_saved_count - a.total_saved_count
      );

      callback(null, sortedResults);
    });
  });
};

/**
 * Извлича топ режисьорите на потребителя от препоръките му.
 *
 * @param {number} userId - Идентификатор на потребителя, за когото ще се извлекат топ режисьорите.
 * @param {number} limit - Максимален брой жанрове, които да се върнат.
 * @param {function} callback - Функция за обратно извикване, която получава резултатите или грешка.
 */
const getUsersTopDirectors = (userId, limit, callback) => {
  const query = `
    SELECT director, COUNT(*) AS recommendations_count
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
      FROM movies_series_recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE user_id = ? 
        AND n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
    ) AS director_list
    GROUP BY director
    ORDER BY recommendations_count DESC
    LIMIT ?;
  `;

  db.query(query, [userId, limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // If no results, return a default response
    if (!results.length) {
      callback(null, {
        message: "No top directors found for the user."
      });
      return;
    }

    // Translate director names
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedDirector = await hf.translate(row.director);
        return {
          director_en: row.director,
          director_bg: translatedDirector,
          recommendations_count: row.recommendations_count
        };
      })
    );

    // Fetch prosperity data for the directors
    const directors = translatedResults
      .map((director) => `'${director.director_en.replace(/'/g, "''")}'`)
      .join(","); // Ensuring correct formatting for IN clause

    const prosperityQuery = `
      WITH RECURSIVE DirectorSplit AS (
        SELECT 
            id, 
            TRIM(SUBSTRING_INDEX(director, ',', 1)) AS director,
            SUBSTRING_INDEX(director, ',', -1) AS remaining_directors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM movies_series_recommendations
        WHERE director IS NOT NULL 
          AND director != 'N/A'
        UNION ALL
        SELECT 
            id,
            TRIM(SUBSTRING_INDEX(remaining_directors, ',', 1)) AS director,
            SUBSTRING_INDEX(remaining_directors, ',', -1) AS remaining_directors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM DirectorSplit
        WHERE remaining_directors LIKE '%,%'
      ),
      UniqueMovies AS (
        SELECT 
            DISTINCT imdbID,
            director,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            ratings
        FROM DirectorSplit
        WHERE director IS NOT NULL AND director != 'N/A'
      ),
      DirectorRecommendations AS (
        SELECT director, COUNT(*) AS total_recommendations  -- Count all recommendations for each director
        FROM (
          SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
          FROM movies_series_recommendations
          CROSS JOIN (
              SELECT a.N + b.N * 10 + 1 AS n
              FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              ORDER BY n
          ) n
          WHERE n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))  -- Split the director list by comma
            AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
        ) AS director_list
        GROUP BY director
        ORDER BY total_recommendations DESC
      )
      SELECT 
        um.director,
        ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
        AVG(um.metascore) AS avg_metascore,
        CONCAT('$', FORMAT(SUM(CASE 
                WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
                THEN 0 
                ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
            END), 0)) AS total_box_office,
        CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes,
        COUNT(DISTINCT um.imdbID) AS movie_series_count,
        COALESCE(dr.total_recommendations, 0) AS total_recommendations,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 win%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_wins,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 nomination%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_nominations
      FROM 
          UniqueMovies um
      LEFT JOIN 
          DirectorRecommendations dr ON um.director = dr.director
      WHERE 
          um.director IN (${directors})
      GROUP BY 
          um.director
      ORDER BY 
          avg_imdb_rating DESC;
    `;

    db.query(prosperityQuery, async (err, prosperityResults) => {
      if (err) {
        callback(err, null);
        return;
      }

      // Calculate prosperity score for each director
      const maxBoxOffice = Math.max(
        ...prosperityResults.map((director) => {
          const totalBoxOffice =
            parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      const weights = {
        total_wins: 0.3,
        total_nominations: 0.25,
        total_box_office: 0.15,
        avg_metascore: 0.1,
        avg_imdb_rating: 0.1,
        avg_rotten_tomatoes: 0.1
      };

      const directorsWithProsperity = prosperityResults.map((director) => {
        const totalWins = director.total_wins || 0;
        const totalNominations = director.total_nominations || 0;

        const totalBoxOffice =
          parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
        const normalizedBoxOffice = maxBoxOffice
          ? totalBoxOffice / maxBoxOffice
          : 0;

        const avgIMDbRating = director.avg_imdb_rating || 0;
        const avgMetascore = director.avg_metascore || 0;
        const avgRottenTomatoes = director.avg_rotten_tomatoes
          ? parseFloat(director.avg_rotten_tomatoes.replace("%", "")) / 100
          : 0;

        const prosperityScore =
          totalWins * weights.total_wins +
          totalNominations * weights.total_nominations +
          normalizedBoxOffice * weights.total_box_office +
          avgMetascore * weights.avg_metascore +
          avgIMDbRating * weights.avg_imdb_rating +
          avgRottenTomatoes * weights.avg_rotten_tomatoes;

        return {
          ...director,
          prosperityScore: Number(prosperityScore.toFixed(2))
        };
      });

      // Combine the top directors with their prosperity data
      const combinedResults = translatedResults.map((director) => {
        const prosperity = directorsWithProsperity.find(
          (result) => result.director === director.director_en
        ) || {
          prosperityScore: "N/A",
          total_box_office: "N/A",
          avg_imdb_rating: "N/A",
          avg_metascore: "N/A",
          avg_rotten_tomatoes: "N/A",
          movie_series_count: "N/A",
          total_recommendations: "N/A",
          total_wins: "N/A",
          total_nominations: "N/A"
        };
        return {
          ...director,
          ...prosperity
        };
      });

      // Remove unnecessary fields
      const filteredResults = combinedResults.map((directorData) => {
        const { director, ...rest } = directorData;
        return rest;
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b.recommendations_count - a.recommendations_count
      );

      callback(null, sortedResults);
    });
  });
};

/**
 * Извлича топ режисьорите на потребителя от неговия watchlist.
 *
 * @param {number} userId - Идентификатор на потребителя, за когото ще се извлекат топ режисьорите.
 * @param {number} limit - Максимален брой жанрове, които да се върнат.
 * @param {function} callback - Функция за обратно извикване, която получава резултатите или грешка.
 */
const getUsersTopDirectorsFromWatchlist = (userId, limit, callback) => {
  const query = `
    SELECT director, COUNT(*) AS saved_count
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
      FROM watchlist  -- Change to watchlist table
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE user_id = ? 
        AND n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
    ) AS director_list
    GROUP BY director
    ORDER BY saved_count DESC
    LIMIT ?;
  `;

  db.query(query, [userId, limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // If no results, return a default response
    if (!results.length) {
      callback(null, {
        message: "No top directors from watchlist found for the user."
      });
      return;
    }

    // Translate director names
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedDirector = await hf.translate(row.director);
        return {
          director_en: row.director,
          director_bg: translatedDirector,
          saved_count: row.saved_count
        };
      })
    );

    // Fetch prosperity data for the directors
    const directors = translatedResults
      .map((director) => `'${director.director_en.replace(/'/g, "''")}'`)
      .join(","); // Ensuring correct formatting for IN clause

    const prosperityQuery = `
      WITH RECURSIVE DirectorSplit AS (
        SELECT 
            id, 
            TRIM(SUBSTRING_INDEX(director, ',', 1)) AS director,
            SUBSTRING_INDEX(director, ',', -1) AS remaining_directors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM watchlist  -- Change to watchlist table
        WHERE director IS NOT NULL 
          AND director != 'N/A'
        UNION ALL
        SELECT 
            id,
            TRIM(SUBSTRING_INDEX(remaining_directors, ',', 1)) AS director,
            SUBSTRING_INDEX(remaining_directors, ',', -1) AS remaining_directors,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM DirectorSplit
        WHERE remaining_directors LIKE '%,%'
      ),
      UniqueMovies AS (
        SELECT 
            DISTINCT imdbID,
            director,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            ratings
        FROM DirectorSplit
        WHERE director IS NOT NULL AND director != 'N/A'
      ),
      DirectorRecommendations AS (
        SELECT director, COUNT(*) AS total_saved_count  -- Count all saved movies/series for each director
        FROM (
          SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) AS director
          FROM watchlist  -- Change to watchlist table
          CROSS JOIN (
              SELECT a.N + b.N * 10 + 1 AS n
              FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              ORDER BY n
          ) n
          WHERE n.n <= 1 + (LENGTH(director) - LENGTH(REPLACE(director, ',', '')))  -- Split the director list by comma
            AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(director, ',', n.n), ',', -1)) != 'N/A'
        ) AS director_list
        GROUP BY director
        ORDER BY total_saved_count DESC
      )
      SELECT 
        um.director,
        ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
        AVG(um.metascore) AS avg_metascore,
        CONCAT('$', FORMAT(SUM(CASE 
                WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
                THEN 0 
                ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
            END), 0)) AS total_box_office,
        CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes,
        COUNT(DISTINCT um.imdbID) AS movie_series_count,
        COALESCE(dr.total_saved_count, 0) AS total_saved_count,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 win%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_wins,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 nomination%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_nominations
      FROM 
          UniqueMovies um
      LEFT JOIN 
          DirectorRecommendations dr ON um.director = dr.director
      WHERE 
          um.director IN (${directors})
      GROUP BY 
          um.director
      ORDER BY 
          avg_imdb_rating DESC;
    `;

    db.query(prosperityQuery, async (err, prosperityResults) => {
      if (err) {
        callback(err, null);
        return;
      }

      // Calculate prosperity score for each director
      const maxBoxOffice = Math.max(
        ...prosperityResults.map((director) => {
          const totalBoxOffice =
            parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      const weights = {
        total_wins: 0.3,
        total_nominations: 0.25,
        total_box_office: 0.15,
        avg_metascore: 0.1,
        avg_imdb_rating: 0.1,
        avg_rotten_tomatoes: 0.1
      };

      const directorsWithProsperity = prosperityResults.map((director) => {
        const totalWins = director.total_wins || 0;
        const totalNominations = director.total_nominations || 0;

        const totalBoxOffice =
          parseFloat(director.total_box_office.replace(/[$,]/g, "")) || 0;
        const normalizedBoxOffice = maxBoxOffice
          ? totalBoxOffice / maxBoxOffice
          : 0;

        const avgIMDbRating = director.avg_imdb_rating || 0;
        const avgMetascore = director.avg_metascore || 0;
        const avgRottenTomatoes = director.avg_rotten_tomatoes
          ? parseFloat(director.avg_rotten_tomatoes.replace("%", "")) / 100
          : 0;

        const prosperityScore =
          totalWins * weights.total_wins +
          totalNominations * weights.total_nominations +
          normalizedBoxOffice * weights.total_box_office +
          avgMetascore * weights.avg_metascore +
          avgIMDbRating * weights.avg_imdb_rating +
          avgRottenTomatoes * weights.avg_rotten_tomatoes;

        return {
          ...director,
          prosperityScore: Number(prosperityScore.toFixed(2))
        };
      });

      // Combine the top directors with their prosperity data
      const combinedResults = translatedResults.map((director) => {
        const prosperity = directorsWithProsperity.find(
          (result) => result.director === director.director_en
        ) || {
          prosperityScore: "N/A",
          total_box_office: "N/A",
          avg_imdb_rating: "N/A",
          avg_metascore: "N/A",
          avg_rotten_tomatoes: "N/A",
          movie_series_count: "N/A",
          total_saved_count: "N/A",
          total_wins: "N/A",
          total_nominations: "N/A"
        };
        return {
          ...director,
          ...prosperity
        };
      });

      // Remove unnecessary fields
      const filteredResults = combinedResults.map((directorData) => {
        const { director, ...rest } = directorData;
        return rest;
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b.saved_count - a.saved_count
      );

      callback(null, sortedResults);
    });
  });
};

/**
 * Извлича топ сценаристите на потребителя от препоръките му.
 *
 * @param {number} userId - Идентификатор на потребителя, за когото ще се извлекат топ сценаристите.
 * @param {number} limit - Максимален брой жанрове, които да се върнат.
 * @param {function} callback - Функция за обратно извикване, която получава резултатите или грешка.
 */
const getUsersTopWriters = (userId, limit, callback) => {
  const query = `
    SELECT writer, COUNT(*) AS recommendations_count
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
      FROM movies_series_recommendations
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE user_id = ? 
        AND n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
    ) AS writer_list
    GROUP BY writer
    ORDER BY recommendations_count DESC
    LIMIT ?;
  `;

  db.query(query, [userId, limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // If no results, return a default response
    if (!results.length) {
      callback(null, {
        message: "No top writers found for the user."
      });
      return;
    }

    // Translate writer names
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedWriter = await hf.translate(row.writer);
        return {
          writer_en: row.writer,
          writer_bg: translatedWriter,
          recommendations_count: row.recommendations_count
        };
      })
    );

    // Fetch prosperity data for the writers
    const writers = translatedResults
      .map((writer) => `'${writer.writer_en.replace(/'/g, "''")}'`)
      .join(","); // Ensuring correct formatting for IN clause

    const prosperityQuery = `
      WITH RECURSIVE WriterSplit AS (
        SELECT 
            id, 
            TRIM(SUBSTRING_INDEX(writer, ',', 1)) AS writer,
            SUBSTRING_INDEX(writer, ',', -1) AS remaining_writers,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM movies_series_recommendations
        WHERE writer IS NOT NULL 
          AND writer != 'N/A'
        UNION ALL
        SELECT 
            id,
            TRIM(SUBSTRING_INDEX(remaining_writers, ',', 1)) AS writer,
            SUBSTRING_INDEX(remaining_writers, ',', -1) AS remaining_writers,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM WriterSplit
        WHERE remaining_writers LIKE '%,%'
      ),
      UniqueMovies AS (
        SELECT 
            DISTINCT imdbID,
            writer,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            ratings
        FROM WriterSplit
        WHERE writer IS NOT NULL AND writer != 'N/A'
      ),
      WriterRecommendations AS (
        SELECT writer, COUNT(*) AS total_recommendations  -- Count all recommendations for each writer
        FROM (
          SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
          FROM movies_series_recommendations
          CROSS JOIN (
              SELECT a.N + b.N * 10 + 1 AS n
              FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              ORDER BY n
          ) n
          WHERE n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))  -- Split the writer list by comma
            AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
        ) AS writer_list
        GROUP BY writer
        ORDER BY total_recommendations DESC
      )
      SELECT 
        um.writer,
        ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
        AVG(um.metascore) AS avg_metascore,
        CONCAT('$', FORMAT(SUM(CASE 
                WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
                THEN 0 
                ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
            END), 0)) AS total_box_office,
        CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes,
        COUNT(DISTINCT um.imdbID) AS movie_series_count,
        COALESCE(wr.total_recommendations, 0) AS total_recommendations,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 win%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_wins,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 nomination%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_nominations
      FROM 
          UniqueMovies um
      LEFT JOIN 
          WriterRecommendations wr ON um.writer = wr.writer
      WHERE 
          um.writer IN (${writers})
      GROUP BY 
          um.writer
      ORDER BY 
          avg_imdb_rating DESC;
    `;

    db.query(prosperityQuery, async (err, prosperityResults) => {
      if (err) {
        callback(err, null);
        return;
      }

      // Calculate prosperity scores (same logic as directors)
      const maxBoxOffice = Math.max(
        ...prosperityResults.map((writer) => {
          const totalBoxOffice =
            parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      const weights = {
        total_wins: 0.3,
        total_nominations: 0.25,
        total_box_office: 0.15,
        avg_metascore: 0.1,
        avg_imdb_rating: 0.1,
        avg_rotten_tomatoes: 0.1
      };

      const writersWithProsperity = prosperityResults.map((writer) => {
        const totalWins = writer.total_wins || 0;
        const totalNominations = writer.total_nominations || 0;

        const totalBoxOffice =
          parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;
        const normalizedBoxOffice = maxBoxOffice
          ? totalBoxOffice / maxBoxOffice
          : 0;

        const avgIMDbRating = writer.avg_imdb_rating || 0;
        const avgMetascore = writer.avg_metascore || 0;
        const avgRottenTomatoes = writer.avg_rotten_tomatoes
          ? parseFloat(writer.avg_rotten_tomatoes.replace("%", "")) / 100
          : 0;

        const prosperityScore =
          totalWins * weights.total_wins +
          totalNominations * weights.total_nominations +
          normalizedBoxOffice * weights.total_box_office +
          avgMetascore * weights.avg_metascore +
          avgIMDbRating * weights.avg_imdb_rating +
          avgRottenTomatoes * weights.avg_rotten_tomatoes;

        return {
          ...writer,
          prosperityScore: Number(prosperityScore.toFixed(2))
        };
      });

      // Combine top writers with their prosperity data
      const combinedResults = translatedResults.map((writer) => {
        const prosperity = writersWithProsperity.find(
          (result) => result.writer === writer.writer_en
        ) || {
          prosperityScore: "N/A",
          total_box_office: "N/A",
          avg_imdb_rating: "N/A",
          avg_metascore: "N/A",
          avg_rotten_tomatoes: "N/A",
          movie_series_count: "N/A",
          total_recommendations: "N/A",
          total_wins: "N/A",
          total_nominations: "N/A"
        };

        return {
          ...writer,
          ...prosperity
        };
      });

      // Remove unnecessary fields
      const filteredResults = combinedResults.map((writerData) => {
        const { writer, ...rest } = writerData;
        return rest;
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b.total_recommendations - a.total_recommendations
      );

      callback(null, sortedResults);
    });
  });
};

/**
 * Извлича топ сценаристите на потребителя от неговия watchlist.
 *
 * @param {number} userId - Идентификатор на потребителя, за когото ще се извлекат топ сценаристите.
 * @param {number} limit - Максимален брой жанрове, които да се върнат.
 * @param {function} callback - Функция за обратно извикване, която получава резултатите или грешка.
 */
const getUsersTopWritersFromWatchlist = (userId, limit, callback) => {
  const query = `
    SELECT writer, COUNT(*) AS saved_count
    FROM (
      SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
      FROM watchlist
      CROSS JOIN (
          SELECT a.N + b.N * 10 + 1 AS n
          FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a,
              (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
          ORDER BY n
      ) n
      WHERE user_id = ? 
        AND n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
    ) AS writer_list
    GROUP BY writer
    ORDER BY saved_count DESC
    LIMIT ?;
  `;

  db.query(query, [userId, limit], async (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // If no results, return a default response
    if (!results.length) {
      callback(null, {
        message: "No users watchlist top writers found."
      });
      return;
    }

    // Translate writer names
    const translatedResults = await Promise.all(
      results.map(async (row) => {
        const translatedWriter = await hf.translate(row.writer);
        return {
          writer_en: row.writer,
          writer_bg: translatedWriter,
          saved_count: row.saved_count
        };
      })
    );

    // Fetch prosperity data for the writers
    const writers = translatedResults
      .map((writer) => `'${writer.writer_en.replace(/'/g, "''")}'`)
      .join(","); // Ensuring correct formatting for IN clause

    const prosperityQuery = `
      WITH RECURSIVE WriterSplit AS (
        SELECT 
            id, 
            TRIM(SUBSTRING_INDEX(writer, ',', 1)) AS writer,
            SUBSTRING_INDEX(writer, ',', -1) AS remaining_writers,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM watchlist
        WHERE writer IS NOT NULL 
          AND writer != 'N/A'
        UNION ALL
        SELECT 
            id,
            TRIM(SUBSTRING_INDEX(remaining_writers, ',', 1)) AS writer,
            SUBSTRING_INDEX(remaining_writers, ',', -1) AS remaining_writers,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            imdbID,
            ratings,
            type
        FROM WriterSplit
        WHERE remaining_writers LIKE '%,%'
      ),
      UniqueMovies AS (
        SELECT 
            DISTINCT imdbID,
            writer,
            imdbRating,
            metascore,
            boxOffice,
            awards,
            ratings
        FROM WriterSplit
        WHERE writer IS NOT NULL AND writer != 'N/A'
      ),
      WriterRecommendations AS (
        SELECT writer, COUNT(*) AS total_saved  -- Count all saved items for each writer
        FROM (
          SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) AS writer
          FROM watchlist
          CROSS JOIN (
              SELECT a.N + b.N * 10 + 1 AS n
              FROM (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              , (SELECT 0 AS N UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              ORDER BY n
          ) n
          WHERE n.n <= 1 + (LENGTH(writer) - LENGTH(REPLACE(writer, ',', '')))  -- Split the writer list by comma
            AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(writer, ',', n.n), ',', -1)) != 'N/A'
        ) AS writer_list
        GROUP BY writer
        ORDER BY total_saved DESC
      )
      SELECT 
        um.writer,
        ROUND(AVG(um.imdbRating), 2) AS avg_imdb_rating,
        AVG(um.metascore) AS avg_metascore,
        CONCAT('$', FORMAT(SUM(CASE 
                WHEN um.boxOffice IS NULL OR um.boxOffice = 'N/A' 
                THEN 0 
                ELSE CAST(REPLACE(REPLACE(um.boxOffice, '$', ''), ',', '') AS UNSIGNED) 
            END), 0)) AS total_box_office,
        CONCAT(ROUND(AVG(CAST(REPLACE(REPLACE(JSON_UNQUOTE(JSON_EXTRACT(um.ratings, '$[1].Value')), '%', ''), ',', '') AS DECIMAL(5,2))), 0), '%') AS avg_rotten_tomatoes,
        COUNT(DISTINCT um.imdbID) AS movie_series_count,
        COALESCE(wr.total_saved, 0) AS total_saved,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 win%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ win(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_wins,
        SUM(CASE 
                WHEN um.awards IS NOT NULL THEN 
                    CASE 
                        WHEN um.awards LIKE '1 nomination%' THEN 1
                        ELSE COALESCE(CAST(REGEXP_SUBSTR(um.awards, '[0-9]+ nomination(s)') AS UNSIGNED), 0)
                    END
                ELSE 0 
            END) AS total_nominations
      FROM 
          UniqueMovies um
      LEFT JOIN 
          WriterRecommendations wr ON um.writer = wr.writer
      WHERE 
          um.writer IN (${writers})
      GROUP BY 
          um.writer
      ORDER BY 
          avg_imdb_rating DESC;
    `;

    db.query(prosperityQuery, async (err, prosperityResults) => {
      if (err) {
        callback(err, null);
        return;
      }

      // Calculate prosperity scores (same logic as directors)
      const maxBoxOffice = Math.max(
        ...prosperityResults.map((writer) => {
          const totalBoxOffice =
            parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;
          return totalBoxOffice;
        })
      );

      const weights = {
        total_wins: 0.3,
        total_nominations: 0.25,
        total_box_office: 0.15,
        avg_metascore: 0.1,
        avg_imdb_rating: 0.1,
        avg_rotten_tomatoes: 0.1
      };

      const writersWithProsperity = prosperityResults.map((writer) => {
        const totalWins = writer.total_wins || 0;
        const totalNominations = writer.total_nominations || 0;

        const totalBoxOffice =
          parseFloat(writer.total_box_office.replace(/[$,]/g, "")) || 0;
        const normalizedBoxOffice = maxBoxOffice
          ? totalBoxOffice / maxBoxOffice
          : 0;

        const avgIMDbRating = writer.avg_imdb_rating || 0;
        const avgMetascore = writer.avg_metascore || 0;
        const avgRottenTomatoes = writer.avg_rotten_tomatoes
          ? parseFloat(writer.avg_rotten_tomatoes.replace("%", "")) / 100
          : 0;

        const prosperityScore =
          totalWins * weights.total_wins +
          totalNominations * weights.total_nominations +
          normalizedBoxOffice * weights.total_box_office +
          avgMetascore * weights.avg_metascore +
          avgIMDbRating * weights.avg_imdb_rating +
          avgRottenTomatoes * weights.avg_rotten_tomatoes;

        return {
          ...writer,
          prosperityScore: Number(prosperityScore.toFixed(2))
        };
      });

      // Combine top writers with their prosperity data
      const combinedResults = translatedResults.map((writer) => {
        const prosperity = writersWithProsperity.find(
          (result) => result.writer === writer.writer_en
        ) || {
          prosperityScore: "N/A",
          total_box_office: "N/A",
          avg_imdb_rating: "N/A",
          avg_metascore: "N/A",
          avg_rotten_tomatoes: "N/A",
          movie_series_count: "N/A",
          total_saved: "N/A",
          total_wins: "N/A",
          total_nominations: "N/A"
        };

        return {
          ...writer,
          ...prosperity
        };
      });

      // Remove unnecessary fields
      const filteredResults = combinedResults.map((writerData) => {
        const { writer, ...rest } = writerData;
        return rest;
      });

      const sortedResults = filteredResults.sort(
        (a, b) => b.total_saved - a.total_saved
      );

      callback(null, sortedResults);
    });
  });
};

/**
 * Извлича всички уникални препоръки на потребителя по неговото ID.
 *
 * @param {number} userId - ID на потребителя, за когото се извършва заявката.
 * @param {Function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 *                            Получава два параметъра: грешка (или null) и резултати от заявката.
 *
 * @returns {void} Няма връщане на стойност, резултатите се подават през callback функцията.
 */
const getAllUsersDistinctRecommendations = (userId, callback) => {
  const query = `
    SELECT imdbID, genre_en, type, runtime, year, rated 
    FROM movies_series_recommendations 
    WHERE user_id = ? 
    GROUP BY imdbID;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      return callback(error, null);
    }

    const totalCount = results.length; // Извлича общия брой уникални препоръки
    callback(null, { total_count: totalCount, recommendations: results });
  });
};

/**
 * Извлича всички уникални препоръки за всички платформи.
 *
 * @param {Function} callback - Функция, която ще бъде извикана след изпълнението на заявката.
 *                            Получава два параметъра: грешка (или null) и резултати от заявката.
 *
 * @returns {void} Няма връщане на стойност, резултатите се подават през callback функцията.
 */
const getAllPlatformDistinctRecommendations = (callback) => {
  const query = `
    SELECT imdbID, genre_en, type, runtime, year, rated 
    FROM movies_series_recommendations 
    GROUP BY imdbID;
  `;

  db.query(query, (error, results) => {
    if (error) {
      return callback(error, null);
    }

    const totalCount = results.length; // Извлича общия брой препоръки
    callback(null, { total_count: totalCount, recommendations: results });
  });
};

/**
 * Извлича последните предпочитания на потребител по неговото потребителско ID.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {function} callback - Функция за обратно извикване, която приема два аргумента: грешка (err) и резултати (results).
 */
const getLastUserPreferences = (userId, callback) => {
  const query = `
    SELECT * 
    FROM movies_series_user_preferences 
    WHERE user_id = ? 
    AND (preferred_genres_en IS NOT NULL AND preferred_genres_en != '')
    ORDER BY date DESC LIMIT 1
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results.length ? results[0] : null);
  });
};

/**
 * Извлича последните препоръки за филми и сериали за даден потребител на базата на дата.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {string} date - Дата, на която са генерирани препоръките.
 * @param {function} callback - Функция за обратно извикване, която приема два аргумента: грешка (err) и резултати (results).
 */
const getLastGeneratedMoviesSeriesRecommendations = (
  userId,
  date,
  callback
) => {
  const query = `
    SELECT * 
    FROM movies_series_recommendations
    WHERE user_id = ? 
    AND date = ?;
  `;

  db.query(query, [userId, date], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

/**
 * Записва нови стойности за Precision за потребител, ако те са различни от последно запазените.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {string} statsType - Тип на статистиката.
 * @param {object} data - Обект, съдържащ новите стойности за Precision.
 * @param {function} callback - Функция за обратно извикване, която приема два аргумента: грешка (err) и резултати (results).
 */
const savePrecision = (userId, statsType, data, callback) => {
  // Запитване за последно запазените стойности на стойността на Precision за даден потребител и тип статистика
  const checkQuery = `
    SELECT precision_exact, precision_fixed, precision_percentage
    FROM movies_series_recommendations_metrics
    WHERE user_id = ? AND stats_type = ?
    ORDER BY date DESC LIMIT 1
  `;

  const checkValues = [userId, statsType];

  db.query(checkQuery, checkValues, (err, results) => {
    if (err) {
      console.error(
        "Грешка при проверка на последните запазени статистики:",
        err
      );
      return callback(err);
    }

    // Ако няма запис за този потребител или стойността на Precision е променена, записваме новите стойности
    if (
      results.length === 0 ||
      parseFloat(results[0].precision_exact) !== data.precision_exact
    ) {
      // Записване на нови стойности за Precision
      const saveQuery = `
        INSERT INTO movies_series_recommendations_metrics (
          user_id, stats_type,
          precision_exact, precision_fixed, precision_percentage,
          relevant_recommendations_count, total_recommendations_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userId,
        statsType,
        data.precision_exact || null,
        data.precision_fixed || null,
        data.precision_percentage || null,
        data.relevant_recommendations_count || null,
        data.total_recommendations_count || null
      ];

      db.query(saveQuery, values, callback);
    } else {
      callback(null, { message: "No new Precision data to save." });
    }
  });
};

/**
 * Записва нови стойности за Recall за потребител, ако те са различни от последно запазените.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {string} statsType - Тип на статистиката.
 * @param {object} data - Обект, съдържащ новите стойности за Recall.
 * @param {function} callback - Функция за обратно извикване, която приема два аргумента: грешка (err) и резултати (results).
 */
const saveRecall = (userId, statsType, data, callback) => {
  // Запитване за последно запазените стойности на стойността на Recall за даден потребител и тип статистика
  const checkQuery = `
    SELECT recall_exact, recall_fixed, recall_percentage, 
    relevant_platform_recommendations_count, 
    total_platform_recommendations_count
    FROM movies_series_recommendations_metrics
    WHERE user_id = ? AND stats_type = ?
    ORDER BY date DESC LIMIT 1
  `;

  const checkValues = [userId, statsType];

  db.query(checkQuery, checkValues, (err, results) => {
    if (err) {
      console.error("Error checking last saved stats:", err);
      return callback(err);
    }

    if (
      // Ако стойността на recall_exact се е променила или relevant_platform_recommendations_count или total_platform_recommendations_count са се увеличили от последния път, нови данни се запазват
      results.length === 0 ||
      parseFloat(results[0].recall_exact) !== data.recall_exact ||
      results[0].relevant_platform_recommendations_count !==
        data.relevant_platform_recommendations_count ||
      results[0].total_platform_recommendations_count !==
        data.total_platform_recommendations_count
    ) {
      // Записване на нови стойности за Recall
      const saveQuery = `
        INSERT INTO movies_series_recommendations_metrics (
          user_id, stats_type,
          recall_exact, recall_fixed, recall_percentage,
          relevant_user_recommendations_count, relevant_platform_recommendations_count,
          total_user_recommendations_count, total_platform_recommendations_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userId,
        statsType,
        data.recall_exact || null,
        data.recall_fixed || null,
        data.recall_percentage || null,
        data.relevant_user_recommendations_count || null,
        data.relevant_platform_recommendations_count || null,
        data.total_user_recommendations_count || null,
        data.total_platform_recommendations_count || null
      ];

      db.query(saveQuery, values, callback);
    } else {
      callback(null, { message: "No new recall data to save." });
    }
  });
};

/**
 * Записва нови стойности за F1 Score за потребител, ако те са различни от последно запазените.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {string} statsType - Тип на статистиката.
 * @param {object} data - Обект, съдържащ новите стойности за F1 Score.
 * @param {function} callback - Функция за обратно извикване, която приема два аргумента: грешка (err) и резултати (results).
 */
const saveF1Score = (userId, statsType, data, callback) => {
  // Запитване за последно запазените стойности на стойността на F1 Score за даден потребител и тип статистика
  const checkQuery = `
    SELECT f1_score_exact, f1_score_fixed, f1_score_percentage
    FROM movies_series_recommendations_metrics
    WHERE user_id = ? AND stats_type = ?
    ORDER BY date DESC LIMIT 1
  `;

  const checkValues = [userId, statsType];

  db.query(checkQuery, checkValues, (err, results) => {
    if (err) {
      console.error(
        "Грешка при проверка на последните запазени статистики:",
        err
      );
      return callback(err);
    }

    // Ако няма запис за този потребител или стойността на F1 Score е променена, записваме новите стойности
    if (
      results.length === 0 ||
      parseFloat(results[0].f1_score_exact) !== data.f1_score_exact
    ) {
      // Записване на нови стойности за F1 Score
      const saveQuery = `
        INSERT INTO movies_series_recommendations_metrics (
          user_id, stats_type,
          f1_score_exact, f1_score_fixed, f1_score_percentage
        ) VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        userId,
        statsType,
        data.f1_score_exact || null,
        data.f1_score_fixed || null,
        data.f1_score_percentage || null
      ];

      db.query(saveQuery, values, callback);
    } else {
      callback(null, { message: "No new F1 Score data to save." });
    }
  });
};

/**
 * Записва анализа на потребителската активност в базата данни.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} data - Данни за анализа на препоръките.
 * @param {number} data.relevantCount - Брой на релевантните препоръки.
 * @param {number} data.totalCount - Общо количество препоръки.
 * @param {number} data.precisionValue - Стойност на precision-а.
 * @param {number} data.precisionPercentage - Процент на precision-а.
 * @param {Array} data.relevantRecommendations - Списък с релевантни препоръки.
 * @param {string} data.date - Дата на анализа.
 * @param {function} callback - Функция за обратна връзка, която се извиква след успешното изпълнение на заявката.
 */
const saveAnalysis = (userId, data, callback) => {
  const query = `
    INSERT INTO movies_series_analysis (
      user_id, relevant_count, total_count, 
      precision_value, precision_percentage, relevant_recommendations, date
    ) VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  const values = [
    userId,
    data.relevantCount,
    data.totalCount,
    data.precisionValue,
    data.precisionPercentage,
    JSON.stringify(data.relevantRecommendations),
    data.date
  ];

  db.query(query, values, callback);
};

/**
 * Изчислява средни стойности за precision, recall и F1 score от метриките на препоръките.
 *
 * @param {function} callback - Функция за обратна връзка, която се извиква след изчисляването на метриките.
 * Връща обект с изчислените стойности и проценти.
 */
const calculateAverageMetrics = (callback) => {
  // Query to retrieve average precision, recall, and F1 score from movies_series_recommendations_metrics
  const queryMetrics = `
    SELECT 
      AVG(precision_exact) AS avg_precision, 
      AVG(recall_exact) AS avg_recall, 
      AVG(f1_score_exact) AS avg_f1_score
    FROM movies_series_recommendations_metrics
  `;

  // Query to retrieve average precision from movies_series_analysis (last recorded values)
  const queryAnalysis = `
    SELECT 
      AVG(precision_value) AS average_precision_last_round
    FROM movies_series_analysis
  `;

  db.query(queryMetrics, (err, metricsResults) => {
    if (err) {
      console.error("Error calculating average metrics:", err);
      return callback(err);
    }

    db.query(queryAnalysis, (err, analysisResults) => {
      if (err) {
        console.error(
          "Error calculating average precision from analysis:",
          err
        );
        return callback(err);
      }

      // Изчисляване на обикновените и процентните стойности (умножаване по 100)
      const avgPrecision = metricsResults[0]?.avg_precision || 0;
      const avgRecall = metricsResults[0]?.avg_recall || 0;
      const avgF1Score = metricsResults[0]?.avg_f1_score || 0;
      const avgPrecisionLastRound =
        analysisResults[0]?.average_precision_last_round || 0;

      callback(null, {
        average_precision: avgPrecision,
        average_precision_percentage: (avgPrecision * 100).toFixed(2),
        average_precision_last_round: avgPrecisionLastRound,
        average_precision_last_round_percentage: (
          avgPrecisionLastRound * 100
        ).toFixed(2),
        average_recall: avgRecall,
        average_recall_percentage: (avgRecall * 100).toFixed(2),
        average_f1_score: avgF1Score,
        average_f1_score_percentage: (avgF1Score * 100).toFixed(2)
      });
    });
  });
};

/**
 * Извлича историческите средни стойности за precision, recall и F1 score по дати.
 *
 * @param {function} callback - Функция за обратна връзка, която се извиква след успешното извличане на данни.
 * Връща масив с историческите стойности по дати.
 */
const getHistoricalAverageMetrics = (callback) => {
  // Заявка за получаване на кумулативни средни стойности за precision, recall и F1 score до всяка дата
  const queryMetrics = `
    SELECT 
      DATE_FORMAT(DATE(date), '%d-%m-%Y') AS record_date,  -- Формат на датата променен на "DD-MM-YYYY"
      (SELECT AVG(precision_exact) FROM movies_series_recommendations_metrics WHERE DATE(date) <= DATE(m.date)) AS avg_precision, 
      (SELECT AVG(recall_exact) FROM movies_series_recommendations_metrics WHERE DATE(date) <= DATE(m.date)) AS avg_recall, 
      (SELECT AVG(f1_score_exact) FROM movies_series_recommendations_metrics WHERE DATE(date) <= DATE(m.date)) AS avg_f1_score
    FROM movies_series_recommendations_metrics m
    GROUP BY record_date
    ORDER BY record_date ASC;
  `;

  // Заявка за получаване на кумулативни средни стойности за precision от movies_series_analysis до всяка дата
  const queryAnalysis = `
    SELECT 
      DATE_FORMAT(DATE(date), '%d-%m-%Y') AS record_date,  -- Формат на датата променен на "DD-MM-YYYY"
      (SELECT AVG(precision_value) FROM movies_series_analysis WHERE DATE(date) <= DATE(a.date)) AS avg_precision_last_round
    FROM movies_series_analysis a
    GROUP BY record_date
    ORDER BY record_date ASC;
  `;

  db.query(queryMetrics, (err, metricsResults) => {
    if (err) {
      console.error(
        "Грешка при извличането на историческите средни стойности:",
        err
      );
      return callback(err);
    }

    db.query(queryAnalysis, (err, analysisResults) => {
      if (err) {
        console.error(
          "Грешка при извличането на историческите стойности за precision от анализа:",
          err
        );
        return callback(err);
      }

      // Обединяваме резултатите от двете заявки според датата
      const historyMap = new Map();

      // Записваме резултатите за метриките в map (дата -> стойности)
      metricsResults.forEach(
        ({ record_date, avg_precision, avg_recall, avg_f1_score }) => {
          historyMap.set(record_date, {
            record_date,
            average_precision: avg_precision || 0,
            average_precision_percentage: ((avg_precision || 0) * 100).toFixed(
              2
            ),
            average_recall: avg_recall || 0,
            average_recall_percentage: ((avg_recall || 0) * 100).toFixed(2),
            average_f1_score: avg_f1_score || 0,
            average_f1_score_percentage: ((avg_f1_score || 0) * 100).toFixed(2),
            average_precision_last_round: 0,
            average_precision_last_round_percentage: "0.00"
          });
        }
      );

      // Записваме precision от movies_series_analysis в map
      analysisResults.forEach(({ record_date, avg_precision_last_round }) => {
        if (historyMap.has(record_date)) {
          historyMap.get(record_date).average_precision_last_round =
            avg_precision_last_round || 0;
          historyMap.get(record_date).average_precision_last_round_percentage =
            ((avg_precision_last_round || 0) * 100).toFixed(2);
        } else {
          historyMap.set(record_date, {
            record_date,
            average_precision: 0,
            average_precision_percentage: "0.00",
            average_recall: 0,
            average_recall_percentage: "0.00",
            average_f1_score: 0,
            average_f1_score_percentage: "0.00",
            average_precision_last_round: avg_precision_last_round || 0,
            average_precision_last_round_percentage: (
              (avg_precision_last_round || 0) * 100
            ).toFixed(2)
          });
        }
      });

      const sortedResults = Array.from(historyMap.values()).sort(
        (a, b) =>
          new Date(a.record_date.split("-").reverse().join("-")) -
          new Date(b.record_date.split("-").reverse().join("-"))
      );

      // Преобразуваме map в масив и го връщаме
      callback(null, sortedResults);
    });
  });
};

/**
 * Извлича историческите средни стойности за precision, recall и F1 score за конкретен потребител по дати.
 *
 * @param {number} userId - Идентификатор на потребителя.
 * @param {function} callback - Функция за обратна връзка, която се извиква след успешното извличане на данни.
 * Връща масив с историческите стойности по дати за конкретния потребител.
 */
const getHistoricalAverageMetricsForUser = (userId, callback) => {
  // Заявка за получаване на кумулативни средни стойности за precision, recall и F1 score за конкретен потребител до всяка дата
  const queryMetrics = `
    SELECT 
      DATE_FORMAT(DATE(date), '%d-%m-%Y') AS record_date,  -- Формат на датата променен на "DD-MM-YYYY"
      (SELECT AVG(precision_exact) FROM movies_series_recommendations_metrics WHERE DATE(date) <= DATE(m.date) AND user_id = ?) AS avg_precision, 
      (SELECT AVG(recall_exact) FROM movies_series_recommendations_metrics WHERE DATE(date) <= DATE(m.date) AND user_id = ?) AS avg_recall, 
      (SELECT AVG(f1_score_exact) FROM movies_series_recommendations_metrics WHERE DATE(date) <= DATE(m.date) AND user_id = ?) AS avg_f1_score
    FROM movies_series_recommendations_metrics m
    WHERE m.user_id = ?
    GROUP BY record_date
    ORDER BY record_date ASC;
  `;

  // Заявка за получаване на кумулативни средни стойности за precision от movies_series_analysis за конкретен потребител до всяка дата
  const queryAnalysis = `
    SELECT 
      DATE_FORMAT(DATE(date), '%d-%m-%Y') AS record_date,  -- Формат на датата променен на "DD-MM-YYYY"
      (SELECT AVG(precision_value) FROM movies_series_analysis WHERE DATE(date) <= DATE(a.date) AND user_id = ?) AS avg_precision_last_round
    FROM movies_series_analysis a
    WHERE a.user_id = ?
    GROUP BY record_date
    ORDER BY record_date ASC;
  `;

  db.query(
    queryMetrics,
    [userId, userId, userId, userId],
    (err, metricsResults) => {
      if (err) {
        console.error(
          "Грешка при извличането на историческите средни стойности:",
          err
        );
        return callback(err);
      }

      db.query(queryAnalysis, [userId, userId], (err, analysisResults) => {
        if (err) {
          console.error(
            "Грешка при извличането на историческите стойности за precision от анализа:",
            err
          );
          return callback(err);
        }

        // Обединяваме резултатите от двете заявки според датата
        const historyMap = new Map();

        // Записваме резултатите за метриките в map (дата -> стойности)
        metricsResults.forEach(
          ({ record_date, avg_precision, avg_recall, avg_f1_score }) => {
            historyMap.set(record_date, {
              record_date,
              average_precision: avg_precision || 0,
              average_precision_percentage: (
                (avg_precision || 0) * 100
              ).toFixed(2),
              average_recall: avg_recall || 0,
              average_recall_percentage: ((avg_recall || 0) * 100).toFixed(2),
              average_f1_score: avg_f1_score || 0,
              average_f1_score_percentage: ((avg_f1_score || 0) * 100).toFixed(
                2
              ),
              average_precision_last_round: 0,
              average_precision_last_round_percentage: "0.00"
            });
          }
        );

        // Записваме precision от movies_series_analysis в map
        analysisResults.forEach(({ record_date, avg_precision_last_round }) => {
          if (historyMap.has(record_date)) {
            historyMap.get(record_date).average_precision_last_round =
              avg_precision_last_round || 0;
            historyMap.get(
              record_date
            ).average_precision_last_round_percentage = (
              (avg_precision_last_round || 0) * 100
            ).toFixed(2);
          } else {
            historyMap.set(record_date, {
              record_date,
              average_precision: 0,
              average_precision_percentage: "0.00",
              average_recall: 0,
              average_recall_percentage: "0.00",
              average_f1_score: 0,
              average_f1_score_percentage: "0.00",
              average_precision_last_round: avg_precision_last_round || 0,
              average_precision_last_round_percentage: (
                (avg_precision_last_round || 0) * 100
              ).toFixed(2)
            });
          }
        });

        const sortedResults = Array.from(historyMap.values()).sort(
          (a, b) =>
            new Date(a.record_date.split("-").reverse().join("-")) -
            new Date(b.record_date.split("-").reverse().join("-"))
        );

        // Преобразуваме map в масив и го връщаме
        callback(null, sortedResults);
      });
    }
  );
};

/**
 * Изчислява броя на адаптациите на книги в препоръките за филми и сериали.
 *
 * @param {function} callback - Функция за обратна връзка, която връща броя на адаптациите.
 * Връща два броя: за филми и за сериали.
 */
const countBookAdaptations = (callback) => {
  const query = "SELECT adaptations FROM books_recommendations";

  db.query(query, (error, results) => {
    if (error) {
      return callback(error, null);
    }

    let movieCount = 0;
    let seriesCount = 0;

    results.forEach((row) => {
      if (row.adaptations) {
        if (/Филм|Movie|film/i.test(row.adaptations)) {
          movieCount++;
        }
        if (/Сериал|Series|TV|Телевизионен сериал/i.test(row.adaptations)) {
          seriesCount++;
        }
      }
    });

    callback(null, {
      movies: movieCount,
      series: seriesCount,
      all: movieCount + seriesCount
    });
  });
};

/**
 * Изчислява средната стойност на Spotify популярността за всички песни.
 *
 * @param {function} callback - Функция за обратна връзка, която връща средната стойност.
 */
const getAverageSpotifyPopularity = (callback) => {
  const query =
    "SELECT AVG(spotifyPopularity) AS avgPopularity FROM music_recommendations";

  db.query(query, (error, results) => {
    if (error) return callback(error, null);

    const avgPopularity = Number(results[0]?.avgPopularity).toFixed(2) || 0;

    callback(null, avgPopularity);
  });
};

/**
 * Изчислява средната стойност на харесванията в YouTube за всички песни.
 *
 * @param {function} callback - Функция за обратна връзка, която връща средната стойност.
 */
const getAverageYoutubeLikes = (callback) => {
  const query =
    "SELECT AVG(youtubeMusicVideoLikes) AS avgLikes FROM music_recommendations";

  db.query(query, (error, results) => {
    if (error) return callback(error, null);

    const avgLikes = Math.round(Number(results[0]?.avgLikes)) || 0;
    callback(null, avgLikes);
  });
};

/**
 * Изчислява средната стойност на гледанията в YouTube.
 */
const getAverageYoutubeViews = (callback) => {
  const query =
    "SELECT AVG(youtubeMusicVideoViews) AS avgViews FROM music_recommendations";

  db.query(query, (error, results) => {
    if (error) return callback(error, null);

    const avgViews = Math.round(Number(results[0]?.avgViews)) || 0;
    callback(null, avgViews);
  });
};

/**
 * Изчислява средната стойност на коментарите в YouTube.
 */
const getAverageYoutubeComments = (callback) => {
  const query =
    "SELECT AVG(youtubeMusicVideoComments) AS avgComments FROM music_recommendations";

  db.query(query, (error, results) => {
    if (error) return callback(error, null);

    const avgComments = Math.round(Number(results[0]?.avgComments)) || 0;
    callback(null, avgComments);
  });
};

/**
 * Запазва данни от устройството в базата данни.
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} data - Данни от устройството.
 * @param {string} date - Дата, на която са генерирани предпочитанията.
 * @param {Function} callback - Функция за обратно извикване след завършване на заявката.
 */
const saveMoviesSeriesBrainAnalysis = (userId, data, date, callback) => {
  const query = `INSERT INTO movies_series_brain_analysis (
    user_id, time, data_type, attention, meditation, delta, theta, 
    lowAlpha, highAlpha, lowBeta, highBeta, lowGamma, highGamma, raw_data, date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
    userId,
    data.time,
    data.data_type,
    data.attention,
    data.meditation,
    data.delta,
    data.theta,
    data.lowAlpha,
    data.highAlpha,
    data.lowBeta,
    data.highBeta,
    data.lowGamma,
    data.highGamma,
    JSON.stringify(data.raw_data),
    date
  ];

  db.query(query, values, callback);
};

/**
 * Запазва данни от устройството в базата данни.
 * @param {number} userId - Идентификатор на потребителя.
 * @param {Object} data - Данни от устройството.
 * @param {string} date - Дата, на която са генерирани предпочитанията.
 * @param {Function} callback - Функция за обратно извикване след завършване на заявката.
 */
const saveBooksBrainAnalysis = (userId, data, date, callback) => {
  const query = `INSERT INTO books_brain_analysis (
    user_id, time, data_type, attention, meditation, delta, theta, 
    lowAlpha, highAlpha, lowBeta, highBeta, lowGamma, highGamma, raw_data, date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
    userId,
    data.time,
    data.data_type,
    data.attention,
    data.meditation,
    data.delta,
    data.theta,
    data.lowAlpha,
    data.highAlpha,
    data.lowBeta,
    data.highBeta,
    data.lowGamma,
    data.highGamma,
    JSON.stringify(data.raw_data),
    date
  ];

  db.query(query, values, callback);
};

module.exports = {
  checkEmailExists,
  createUser,
  findUserByEmail,
  updateUserPassword,
  getUserById,
  saveMovieSeriesRecommendation,
  saveBookRecommendation,
  saveMusicRecommendation,
  saveToWatchlist,
  saveToReadlist,
  saveToListenlist,
  removeFromWatchlist,
  removeFromReadlist,
  checkRecommendationExistsInWatchlist,
  checkRecommendationExistsInReadlist,
  checkRecommendationExistsInListenlist,
  saveMoviesSeriesUserPreferences,
  saveBooksUserPreferences,
  saveMusicUserPreferences,
  getUsersCount,
  getAverageBoxOfficeAndScores,
  getTopRecommendationsPlatform,
  getTopCountries,
  getTopGenres,
  getGenrePopularityOverTime,
  getTopActors,
  getTopDirectors,
  getTopWriters,
  getOscarsByMovie,
  getTotalAwardsByMovieOrSeries,
  getTotalAwardsCount,
  getSortedDirectorsByProsperity,
  getSortedActorsByProsperity,
  getSortedWritersByProsperity,
  getSortedMoviesByProsperity,
  getTopMoviesAndSeriesByMetascore,
  getTopMoviesAndSeriesByIMDbRating,
  getTopMoviesAndSeriesByRottenTomatoesRating,
  getUsersTopRecommendations,
  getUsersWatchlist,
  getUsersReadlist,
  getUsersTopGenres,
  getUsersTopGenresFromWatchlist,
  getUsersTopActors,
  getUsersTopActorsFromWatchlist,
  getUsersTopDirectors,
  getUsersTopDirectorsFromWatchlist,
  getUsersTopWriters,
  getUsersTopWritersFromWatchlist,
  getAllUsersDistinctRecommendations,
  getAllPlatformDistinctRecommendations,
  getLastUserPreferences,
  getLastGeneratedMoviesSeriesRecommendations,
  savePrecision,
  saveRecall,
  saveF1Score,
  saveAnalysis,
  calculateAverageMetrics,
  getHistoricalAverageMetrics,
  getHistoricalAverageMetricsForUser,
  countBookAdaptations,
  getAverageSpotifyPopularity,
  getAverageYoutubeLikes,
  getAverageYoutubeViews,
  getAverageYoutubeComments,
  saveMoviesSeriesBrainAnalysis,
  saveBooksBrainAnalysis
};
