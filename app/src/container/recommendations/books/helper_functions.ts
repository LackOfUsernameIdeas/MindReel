import {
  Genre,
  BooksUserPreferences,
  IndustryIdentifier,
  Recommendation
} from "./booksRecommendations-types";
import { Question, NotificationState } from "../../types_common";
import {
  goodreadsPrompt,
  googleBooksPrompt
} from "./booksRecommendations-data";
import {
  goodreadsGenreOptions,
  googleBooksGenreOptions
} from "../../data_common";
import {
  checkRecommendationExistsInReadlist,
  removeFromReadlist,
  saveToReadlist,
  showNotification,
  translate,
  translateWithDetection,
  validateToken
} from "../../helper_functions_common";
import ISO6391 from "iso-639-1";

/**
 * Записва предпочитанията на потребителя в базата данни чрез POST заявка.
 * Ако не успее да запише предпочитанията, се хвърля грешка.
 *
 * @async
 * @function saveBooksUserPreferences
 * @param {string} date - Датата на записа на предпочитанията.
 * @param {Object} booksUserPreferences - Обект с предпочитанията на потребителя.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но хвърля грешка при неуспех.
 * @throws {Error} - Хвърля грешка, ако заявката не е успешна.
 */
export const saveBooksUserPreferences = async (
  date: string,
  booksUserPreferences: BooksUserPreferences,
  token: string | null
): Promise<void> => {
  try {
    const {
      genres,
      moods,
      authors,
      origin,
      pacing,
      depth,
      targetGroup,
      interests
    } = booksUserPreferences;

    const preferredGenresEn =
      genres.length > 0 ? genres.map((g) => g.en).join(", ") : null;
    const preferredGenresBg =
      genres.length > 0 ? genres.map((g) => g.bg).join(", ") : null;

    const formattedPreferences = {
      token: token,
      preferred_genres_en: preferredGenresEn,
      preferred_genres_bg: preferredGenresBg,
      mood: Array.isArray(moods) ? moods.join(", ") : null,
      preferred_authors: authors,
      preferred_origin: origin,
      preferred_pacing: pacing,
      preferred_depth: depth,
      preferred_target_group: targetGroup,
      interests: interests || null,
      date: date
    };
    console.log("preferences: ", formattedPreferences);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/save-preferences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          preferencesType: "books",
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
 * Извлича данни за книга от Google Books чрез няколко различни търсачки в случай на неуспех.
 * Ако не успее да извлече данни от всички търсачки, хвърля грешка.
 *
 * @async
 * @function fetchBooksIDWithFailover
 * @param {string} bookName - Името на книгата, за който се извличат данни.
 * @returns {Promise<Object>} - Връща обект с данни от Google Books за книгата.
 * @throws {Error} - Хвърля грешка, ако не успее да извлече данни от всички търсачки.
 */
const fetchBooksIDWithFailover = async (
  bookName: string,
  source: string
): Promise<any> => {
  const enginesGoogleBooks = [
    { key: "AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw", cx: "d059d8edb90514692" },
    { key: "AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA", cx: "422c2707d8062436a" },
    { key: "AIzaSyAUOQzjNbBnGSBVvCZkWqHX7uebGZRY0lg", cx: "46127fd515c5d40be" }
  ];

  const enginesGoodreads = [
    { key: "AIzaSyDx1TITxqoRZR3stELH_EKM4CRFIihcrUE", cx: "16d236f4de37240b0" },
    { key: "AIzaSyAefnCBUG8640RF8b2pd1cWyS6ZBXBXIeQ", cx: "16d236f4de37240b0" },
    { key: "AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA", cx: "450bbb0da19164cf6" },
    { key: "AIzaSyAUOQzjNbBnGSBVvCZkWqHX7uebGZRY0lg", cx: "727f76a1178b143c3" },
    { key: "AIzaSyDoOjTIaxiG8b8fmuIbUAVHTQBzubTsYso", cx: "450bbb0da19164cf6" },
    { key: "AIzaSyB7Sal-d83t6ksI7vePRehZcWgYf42q-Tg", cx: "727f76a1178b143c3" }
  ];

  const engines =
    source === "GoogleBooks" ? enginesGoogleBooks : enginesGoodreads;

  for (let engine of engines) {
    try {
      const response = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?key=${
          engine.key
        }&cx=${engine.cx}&q=${encodeURIComponent(bookName)}`
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
          `No items found for book "${bookName}" with engine ${engine.cx}`
        );
        continue;
      }

      console.log(
        `Successfully fetched book data for "${bookName}" using engine: ${engine.cx}`
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

  // If all engines fail, throw a specific error
  const errorMessage = `Failed to fetch Book data for "${bookName}" using all available engines.`;
  console.error(errorMessage);
  throw new Error(errorMessage);
};

/**
 * Обработва жанровете на книги от категориите на Google Books, като ги организира в основни категории с уникални подкатегории,
 * включително подкатегории на подкатегориите и всички нива на вложеност.
 *
 * @function processBookGenres
 * @param {string[]} categories - Списък с категории от Google Books API.
 * @param {boolean} translateGenres - Определя дали да се преведат жанровете на български.
 * @returns {Record<string, string[]>} - Обект, където ключовете са основните категории, а стойностите са подкатегории, включително всички нива на вложеност.
 */
export const processBookGenres = async (
  categories: string[],
  translateGenres: boolean = false
): Promise<Record<string, string[]>> => {
  // Инициализиране на обект за съхранение на резултатите
  const genreMap: Record<string, string[]> = {};

  // Рекурсивна функция за добавяне на подкатегории на всички нива
  const addSubCategories = async (
    mainCategory: string,
    subCategories: string[]
  ) => {
    const translatedMain = translateGenres
      ? await translate(mainCategory)
      : mainCategory; // Превеждаме, ако е нужно

    if (!genreMap[translatedMain]) {
      genreMap[translatedMain] = [];
    }

    // Обхождаме всички подкатегории на дадената категория
    for (const subCategory of subCategories) {
      const translatedSub = translateGenres
        ? await translate(subCategory)
        : subCategory; // Превеждаме, ако е нужно
      if (
        translatedSub.toLowerCase() !== "general" &&
        translatedSub.toLowerCase() !== "генерал" &&
        !genreMap[translatedMain].includes(translatedSub)
      ) {
        genreMap[translatedMain].push(translatedSub);
      }
    }
  };

  // Изчакваме всички асинхронни операции да завършат
  const promises = categories
    ? categories.map(async (category) => {
        // Разделяне на категорията на различни нива по " / "
        const parts = category.split(" / ");
        const mainCategory = parts[0].trim(); // Основна категория
        const subCategories = parts.slice(1).map((sub) => sub.trim()); // Всички подкатегории след първоначалната основна категория

        // Рекурсивно добавяне на подкатегориите за всяка категория
        await addSubCategories(mainCategory, subCategories);
      })
    : [];

  // Изчакваме всички промиси да завършат
  await Promise.all(promises);

  // Връщане на обекта с организираните жанрове
  return genreMap;
};

/**
 * Функция за премахване на HTML тагове от даден текст.
 * @param {string} text - Текстът, който трябва да бъде обработен.
 * @returns {string} - Текстът без HTML тагове.
 */
export const removeHtmlTags = (text: string): string => {
  return text.replace(/<[^>]*>/g, ""); // Регулярен израз за премахване на всички HTML тагове
};

/**
 * Проверява и обработва всички полета от обект, като приоритет се дава на основните данни.
 *
 * @function processDataWithFallback
 * @param {any} primaryData - Основните данни от първичния източник (например Google Books).
 * @param {any} fallbackData - Данните от алтернативния източник (например AI).
 * @returns {any} - Връща наличните данни, като приоритет се дава на основния източник.
 */
export const processDataWithFallback = (
  primaryData: any,
  fallbackData: any
): any => {
  // Проверка дали основните данни са дефинирани и не са null
  if (primaryData !== undefined && primaryData !== null) {
    // Ако данните са стринг, проверява дали са празни след trim()
    if (typeof primaryData === "string" && primaryData.trim() !== "") {
      return primaryData;
    }
    // Ако данните не са стринг, приема ги за валидни
    if (typeof primaryData !== "string") {
      return primaryData;
    }
  }

  // Ако няма основни данни, използваме алтернативния източник
  return fallbackData;
};

/**
 * Генерира препоръки за книги, базирани на предпочитанията на потребителя,
 * като използва OpenAI API за създаване на списък с препоръки.
 * Връща списък с препоръки в JSON формат.
 *
 * @async
 * @function generateBooksRecommendations
 * @param {string} date - Датата на генерирането на препоръките.
 * @param {BooksUserPreferences} booksUserPreferences - Предпочитанияте на потребителя за книги.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setRecommendationList - Функция за задаване на препоръките в компонент.
 * @param {React.Dispatch<React.SetStateAction<{ [key: string]: any }>>} setBookmarkedBooks - Функция за задаване на любими книги в компонент.
 * @param {string | null} token - Токенът на потребителя, използван за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но актуализира препоръките.
 * @throws {Error} - Хвърля грешка, ако заявката за препоръки е неуспешна.
 */
export const generateBooksRecommendations = async (
  date: string,
  booksUserPreferences: BooksUserPreferences,
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
  setBookmarkedBooks: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >,
  token: string | null
) => {
  try {
    const requestBody =
      import.meta.env.VITE_BOOKS_SOURCE === "GoogleBooks"
        ? googleBooksPrompt(booksUserPreferences)
        : goodreadsPrompt(booksUserPreferences);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/get-model-response`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          provider: "openai",
          modelOpenAI: requestBody?.model, // Use the model from the prompt function
          messages: requestBody?.messages || []
        })
      }
    );

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

    for (const book of recommendations) {
      const bookName = book.real_edition_title;
      console.log("Processing book: ", bookName);

      let bookResults;
      try {
        bookResults = await fetchBooksIDWithFailover(
          bookName,
          import.meta.env.VITE_BOOKS_SOURCE
        );
      } catch (error) {
        console.error(`Failed to fetch book data for ${bookName}:`, error);
        continue;
      }

      const bookItem = bookResults.items.find((item: { link: string }) =>
        import.meta.env.VITE_BOOKS_SOURCE == "GoogleBooks"
          ? item.link.includes("books.google.com/books/about/")
          : item.link.includes("goodreads.com/book/show/")
      );
      console.log(`bookItem: ${bookItem}`);

      if (!bookItem) {
        console.warn(`No valid book item found for: ${bookName}`);
        continue; // Skip to the next book
      }

      const bookUrl = bookItem.link;
      const bookId =
        import.meta.env.VITE_BOOKS_SOURCE == "GoogleBooks"
          ? bookUrl.match(/id=([a-zA-Z0-9-_]+)/)?.[1]
          : bookUrl.match(/show\/(\d+)/)?.[1];

      if (!bookId) {
        console.warn(`No valid book ID found for: ${bookName}`);
        continue; // Skip to the next book
      }

      if (import.meta.env.VITE_BOOKS_SOURCE == "GoogleBooks") {
        const googleBooksResponse = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );

        if (!googleBooksResponse.ok) {
          console.error(
            `Failed to fetch Google Books data for ${bookName}. Status: ${googleBooksResponse.status}`
          );
          continue; // Skip to the next book
        }

        const googleBooksData = await googleBooksResponse.json();

        console.log(
          `Google Books data for ${bookName}: ${JSON.stringify(
            googleBooksData,
            null,
            2
          )}, `
        );

        const author = await processDataWithFallback(
          translate(googleBooksData.volumeInfo?.authors.join(", ")),
          translate(book?.author)
        );
        const description = await processDataWithFallback(
          translate(removeHtmlTags(googleBooksData.volumeInfo?.description)),
          book.description
        );
        const genre_en = await processBookGenres(
          googleBooksData.volumeInfo?.categories
        );
        const genre_bg = await processBookGenres(
          googleBooksData.volumeInfo?.categories,
          true
        );
        const language = await processDataWithFallback(
          translate(ISO6391.getName(googleBooksData.volumeInfo?.language)),
          book?.language
        );

        const publisher = await translate(googleBooksData.volumeInfo.publisher);

        const recommendationData = {
          google_books_id: googleBooksData.id,
          title_en: googleBooksData.volumeInfo.title,
          title_bg: book.title_bg,
          real_edition_title: book.real_edition_title,
          author: author,
          genre_en: genre_en,
          genre_bg: genre_bg,
          description: description,
          language: language,
          origin: book.origin,
          date_of_first_issue: book.date_of_first_issue,
          date_of_issue: processDataWithFallback(
            googleBooksData.volumeInfo.publishedDate,
            book.date_of_issue
          ),
          publisher: publisher,
          goodreads_rating: book.goodreads_rating,
          reason: book.reason,
          adaptations: book.adaptations,
          ISBN_10: googleBooksData.volumeInfo.industryIdentifiers.find(
            (identifier: IndustryIdentifier) => identifier.type === "ISBN_10"
          ).identifier,
          ISBN_13: googleBooksData.volumeInfo.industryIdentifiers.find(
            (identifier: IndustryIdentifier) => identifier.type === "ISBN_13"
          ).identifier,
          page_count: processDataWithFallback(
            googleBooksData.volumeInfo.printedPageCount,
            book.page_count
          ),
          imageLink: googleBooksData.volumeInfo.imageLinks.thumbnail,
          source: "GoogleBooks"
        };

        // Първо, задаваме списъка с препоръки
        setRecommendationList((prevRecommendations) => [
          ...prevRecommendations,
          recommendationData
        ]);

        // След това изпълняваме проверката и записа паралелно, използвайки self-invoking функцията
        (async () => {
          // Проверяваме дали книгата съществува в таблицата за readlist
          const existsInReadlist = await checkRecommendationExistsInReadlist(
            googleBooksData.id,
            token,
            recommendationData.source
          );

          // Ако книгата не съществува в readlist, добавяме я към "bookmarkedBooks" с информация за ID и статус
          if (existsInReadlist) {
            setBookmarkedBooks((prevBooks) => {
              return {
                ...prevBooks,
                [recommendationData.google_books_id]: recommendationData
              };
            });
          }
          // Записваме препоръката в базата данни
          await saveBookRecommendation(recommendationData, date, token);
        })();
      } else {
        try {
          const goodreadsResponse = await fetch(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/get-goodreads-data-for-a-book?url=${bookUrl}`
          );

          if (!goodreadsResponse.ok) {
            console.error(
              `Failed to fetch Goodreads data for ${bookName}. Status: ${goodreadsResponse.status}`
            );
            continue; // Skip to the next book
          }

          const goodreadsData = await goodreadsResponse.json();

          console.log(
            `Goodreads data for ${bookName}: ${JSON.stringify(
              goodreadsData,
              null,
              2
            )}, `
          );

          const author = await translate(goodreadsData.contributors);
          const description = await translateWithDetection(
            goodreadsData.description
          );

          const genre_en = goodreadsData.genres;

          const genres_bg_raw = await translate(goodreadsData.genres);
          const genre_bg = genres_bg_raw
            .split(",") // Split the string by commas into an array
            .map(
              (genre) =>
                genre.trim().charAt(0).toUpperCase() + genre.trim().slice(1)
            ) // Capitalize the first letter of each word
            .join(", "); // Join the array back into a string

          const language = await translate(goodreadsData.language);

          const publisher = await translate(goodreadsData.publisher);

          const recommendationData = {
            goodreads_id: bookId,
            title_en: goodreadsData.title,
            original_title: goodreadsData.original_title,
            title_bg: book.title_bg,
            real_edition_title: book.real_edition_title,
            author: author,
            genre_en: genre_en,
            genre_bg: genre_bg,
            description: description,
            language: language,
            origin: book.origin,
            date_of_first_issue: goodreadsData.first_publication_info,
            date_of_issue: goodreadsData.publication_time,
            publisher: publisher,
            goodreads_rating: goodreadsData.rating,
            goodreads_ratings_count: goodreadsData.ratings_count,
            goodreads_reviews_count: goodreadsData.reviews_count,
            reason: book.reason,
            adaptations: book.adaptations,
            ISBN_10: goodreadsData.isbn10 || goodreadsData.asin,
            ISBN_13: goodreadsData.isbn13,
            page_count: goodreadsData.pages_count,
            book_format: goodreadsData.book_format,
            imageLink: goodreadsData.image_url,
            literary_awards: goodreadsData.literary_awards,
            setting: goodreadsData.setting,
            characters: goodreadsData.characters,
            series: goodreadsData.series,
            source: "Goodreads"
          };

          // Първо, задаваме списъка с препоръки
          setRecommendationList((prevRecommendations) => [
            ...prevRecommendations,
            recommendationData
          ]);

          // След това изпълняваме проверката и записа паралелно, използвайки self-invoking функцията
          (async () => {
            // Проверяваме дали книгата съществува в таблицата за readlist
            const existsInReadlist = await checkRecommendationExistsInReadlist(
              bookId,
              token,
              recommendationData.source
            );

            // Ако книгата не съществува в readlist, добавяме я към "bookmarkedBooks" с информация за ID и статус
            if (existsInReadlist) {
              setBookmarkedBooks((prevBooks) => {
                return {
                  ...prevBooks,
                  [recommendationData.goodreads_id]: recommendationData
                };
              });
            }
            // Записваме препоръката в базата данни
            await saveBookRecommendation(recommendationData, date, token);
          })();
        } catch (error) {
          console.error(
            `Error processing book: ${book.real_edition_title}`,
            error
          );
          continue; // Skip to the next book
        }
      }
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
  }
};

/**
 * Записва препоръка за книга в базата данни.
 * Препоръката съдържа подробности за книгата като заглавие, жанр, рейтинг и други.
 * След успешното записване, препоръката се изпраща в сървъра.
 *
 * @async
 * @function saveBookRecommendation
 * @param {any} recommendation - Обект, съдържащ данни за препоръчаната книга.
 * @param {string} date - Дата на генерирането на препоръката.
 * @param {string | null} token - Токенът на потребителя за аутентификация.
 * @returns {Promise<void>} - Няма връщан резултат, но извършва записване на препоръката.
 * @throws {Error} - Хвърля грешка, ако не може да се запази препоръката в базата данни.
 */
export const saveBookRecommendation = async (
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
      date: date,
      source: recommendation.source || null
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
          recommendationType: "books",
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
 * @param {React.Dispatch<React.SetStateAction<NotificationState | null>>} setNotification - Функция за задаване на състоянието на известията.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading - Функция за задаване на статус на зареждане.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSubmitted - Функция за задаване на статус за подадена заявка.
 * @param {React.Dispatch<React.SetStateAction<number>>} setSubmitCount - Функция за актуализиране на броя на подадените заявки.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} setRecommendationList - Функция за актуализиране на списъка с препоръки.
 * @param {React.Dispatch<React.SetStateAction<{ [key: string]: any }>>} setBookmarkedBooks - Функция за актуализиране на списъка с отметнати книги.
 * @param {BooksUserPreferences} booksUserPreferences - Предпочитания на потребителя за книги.
 * @param {string | null} token - Токенът за аутентификация на потребителя.
 * @param {number} submitCount - Броят на подадените заявки.
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
  setBookmarkedBooks: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >,
  token: string | null,
  submitCount: number,
  booksUserPreferences: BooksUserPreferences
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

  if (booksUserPreferences) {
    const { moods, origin, pacing, depth, targetGroup } = booksUserPreferences;

    if (!moods || !origin || !pacing || !depth || !targetGroup) {
      showNotification(
        setNotification,
        "Моля, попълнете всички задължителни полета!",
        "warning"
      );
      return;
    }
  }

  setLoading(true);
  setSubmitted(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/handle-submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "books"
        })
      }
    );

    const data = await response.json();

    const date = new Date().toISOString();

    if (response.status === 200) {
      setRecommendationList([]);
      if (
        booksUserPreferences &&
        Object.keys(booksUserPreferences).length > 0
      ) {
        await saveBooksUserPreferences(date, booksUserPreferences, token);
        await generateBooksRecommendations(
          date,
          booksUserPreferences,
          setRecommendationList,
          setBookmarkedBooks,
          token
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
    setSubmitted(true);
  }
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
export const handleBookmarkClick = (
  book: Recommendation,
  setBookmarkedBooks?: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >,
  setCurrentBookmarkStatus?: React.Dispatch<React.SetStateAction<boolean>>,
  setAlertVisible?: React.Dispatch<React.SetStateAction<boolean>>
) => {
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
      const selectedGenre = (
        import.meta.env.VITE_BOOKS_SOURCE == "GoogleBooks"
          ? googleBooksGenreOptions
          : goodreadsGenreOptions
      ).find((genre) => genre.bg === answer);

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
 * @returns {void} - Няма връщан резултат, но актуализира състоянието на компонентите.
 */
export const handleRetakeQuiz = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setLoading(true);
  setTimeout(() => {
    setSubmitted(false);
    setLoading(false);
  }, 500);
};
