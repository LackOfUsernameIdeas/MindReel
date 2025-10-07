// ==============================
// Импортиране на типове и интерфейси
// ==============================
import { BookRecommendation } from "@/container/types_common";
import { SetStateAction } from "react";

// ==============================
// Функции за работа с данни
// ==============================

/**
 * Извлича данни от API за платформата и ги запазва в състоянието.
 *
 * @param {string} token - Токен за удостоверяване.
 * @param {React.Dispatch<React.SetStateAction<any>>} setData - Функция за задаване на общи данни.
 * @throws {Error} - Хвърля грешка, ако заявката е неуспешна.
 */
export const fetchData = async (
  token: string,
  setData: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<any>>
): Promise<void> => {
  try {
    // Fetch statistics data independently
    const endpoints = [
      {
        key: "topRecommendationsReadlist",
        endpoint: "/stats/individual/readlist",
        method: "POST",
        body: { token: token }
      }
    ];

    // Loop over each endpoint, fetch data, and update state independently
    const fetchPromises = endpoints.map(
      async ({ key, endpoint, method, body }) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
            {
              method: method,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: method === "POST" ? JSON.stringify(body) : undefined
            }
          );
          const data = await res.json();
          // Replace response with an empty array if it contains a `message` field
          const processedData =
            data && typeof data === "object" && data.message ? [] : data;

          setData({
            topRecommendationsReadlist: processedData
          });
        } catch (error) {
          return console.error(`Error fetching ${key}:`, error);
        }
      }
    );
    Promise.all(fetchPromises).finally(() => setLoading(false));
  } catch (error) {
    console.error("Error in fetchData:", error);
    throw error;
  }
};

/**
 * Функция за обработка на жанрове.
 * Ако жанровете са подадени като string, се опитваме да ги парсираме в JSON формат.
 * Ако парсирането не успее, се връща null.
 *
 * @param {any} resolvedGenres - Жанрове, които могат да бъдат string или обект.
 * @returns {any} Върща парсираните жанрове или оригиналния обект.
 */
export const parseResolvedGenres = async (resolvedGenres: any) => {
  // Обработка на string
  if (typeof resolvedGenres === "string") {
    try {
      return JSON.parse(resolvedGenres); // Опит за парсиране на JSON ако е string
    } catch (error) {
      console.warn("Неуспешно парсиране на жанрове от string:", resolvedGenres);
      return null; // Връщане на null, ако парсирането не е успешно
    }
  }
  return resolvedGenres;
};

/**
 * Функция за обработка на жанровете за Google Books API.
 * Преобразува жанровете в string-ове, които могат да се покажат на потребителя.
 *
 * @param {any} genres - Жанровете, които ще бъдат обработени.
 * @param {(value: SetStateAction<string[]>) => void} setGenres - Функция за сетване на жанровете в state.
 */
export const processGenresForGoogleBooks = (
  genres: any,
  setGenres: (value: SetStateAction<string[]>) => void
) => {
  if (genres && typeof genres === "object") {
    const genreEntries = Object.entries(genres);
    const genreStrings = genreEntries.map(([category, subGenres]) => {
      return `${category}: ${
        Array.isArray(subGenres)
          ? subGenres.join(", ")
          : subGenres || "Няма поджанрове"
      }`;
    });
    setGenres(genreStrings);
  } else {
    console.warn("Неочакван формат за жанровете на Google Books:", genres);
    setGenres(["Няма жанрове за показване."]);
  }
};

/**
 * Форматира жанровете, като обработва JSON или връща жанра с главна буква.
 * @param {string | null} genre - Жанрът в текстов или JSON формат.
 * @returns {string} - Форматиран списък с жанрове или съобщение, ако липсва.
 */
export const formatGenres = (genre: string | null): string => {
  if (!genre) return "Няма жанр";

  try {
    const parsed = JSON.parse(genre);
    if (typeof parsed === "object" && !Array.isArray(parsed)) {
      return [...new Set(Object.values(parsed).flat())]
        .map((g) =>
          typeof g === "string" ? g.charAt(0).toUpperCase() + g.slice(1) : ""
        )
        .join(", ");
    }
  } catch {}

  return genre.charAt(0).toUpperCase() + genre.slice(1);
};

/**
 * Извлича автори, издатели от подадения обект.
 *
 * @param {Object} item - Обектът, съдържащ информация за книгата.
 * @param {string} [item.author] - Списък с автори, разделени със запетая.
 * @param {string} [item.publisher] - Списък с издатели, разделени със запетая.
 * @returns {Object} - Обект със свойства `authors` и `publishers`.
 */
export const extractItemFromStringList = (
  item: any
): {
  authors: string[];
  publishers: string[];
} => {
  const exclusions = ["LLC", "INC.", "INCORPORATED"];

  const authors = item.author
    ? item.author.split(",").map((author: string) => author.trim())
    : [];

  const publishers = item.publisher
    ? item.publisher
        .split(",")
        .map((publisher: string) => publisher.trim())
        .filter(
          (publisher: string) =>
            !exclusions.some((excluded) =>
              publisher.toUpperCase().endsWith(excluded)
            )
        )
    : [];

  return { authors, publishers };
};

/**
 * Извлича годината от дадена дата.
 * @param {string} date - Дата във формат ISO или друг валиден формат.
 * @returns {number | null} - Годината като число или `null`, ако датата не е валидна.
 */
export const extractYear = (date: string): number | null => {
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? null : parsedDate.getFullYear();
};

/**
 * Жанровете, които си съответстват
 * @param {string} key - Жанрът, който е главен и се използва за филтриране
 * @returns {number | null} - Кейсове, които означават едно и също като главния жанр. Tе се търсят когато главният жанр е избран.
 */
export const genresCorrespondanceMapping: {
  [key: string]: string[];
} = {
  Биография: ["Биография", "Биографии"],
  "Историческа фикция": ["Историческа фикция", "Исторически"],
  "Литературна фикция": ["Литературна фикция", "Художествена литература"],
  "Хумор и комедия": ["Хумор и комедия", "Хумористично", "Хумор"]
};

/**
 * Жанровете, които си отпадат
 * @param {string} key - Жанрът, който е главен и се използва за сортиране
 * @returns {string[]} - Кейсове, които означават едно и също като главния жанр. Tе не се визуализират в менюто за сортиране.
 */
const redundantGenresMapping: Record<string, string[]> = {
  Биография: ["Биографии"],
  "Историческа фикция": ["Исторически"],
  "Литературна фикция": ["Художествена литература"],
  "Хумор и комедия": ["Хумор", "Хумористично"]
};

/**
 * Търси съответстващи жанрове спрямо главен жанр.
 * @param {string} genre - Жанрът, който се търси
 * @returns {string[]} - Съответстващите жанрове
 */
export const getRelatedGenres = (genre: string) => {
  return genresCorrespondanceMapping[genre] || [genre];
};

/**
 * Връща главен жанр.
 * @param {string} genre - Жанрът, който трябва да бъде проверен.
 * @returns {string} - Главният жанр, ако жанрът съществува в `redundantGenresMapping`, иначе оригиналния жанр.
 */
export const getMainGenre = (genre: string): string => {
  for (const mainGenre in redundantGenresMapping) {
    if (redundantGenresMapping[mainGenre].includes(genre)) {
      return mainGenre;
    }
  }
  return genre;
};

/**
 * Филтрира ненужните, повтарящи се жанрове.
 * @param {Array<{ bg: string }>} genreOptions - Всички жанрове
 * @returns {string[]} - Всички жанрове, без тези които се повтарят (Главни жанрове).
 */
export const processGenres = (genreOptions: Array<{ bg: string }>) =>
  genreOptions
    .filter(
      (genre) =>
        !Object.values(redundantGenresMapping).flat().includes(genre.bg)
    )
    .map((genre) => ({
      ...genre,
      bg: getMainGenre(genre.bg)
    }));

/**
 * Филтрира данните според подадените критерии за жанрове, брой страници, автори, издатели, рейтинг и година на писане.
 *
 * @param {Object} filters - Обект с филтри, които ще се приложат към данните.
 * @param {string[]} filters.genres - Списък с избрани жанрове, по които да се филтрират книгите.
 * @param {string[]} filters.pages - Списък с диапазони за броя страници (напр. "Под 100 страници").
 * @param {string[]} filters.author - Списък с автори, чиито книги да бъдат показани.
 * @param {string[]} filters.publisher - Списък с издатели, чиито книги да бъдат включени.
 * @param {string[]} filters.goodreadsRatings - Списък с диапазони на рейтингите в Goodreads (напр. "Над 4.0").
 * @param {string[]} filters.year - Списък с времеви интервали за годината на писане (напр. "След 2010").
 *
 * @param {BookRecommendation[]} data - Масив от книги, които ще бъдат филтрирани.
 * @param {React.Dispatch<React.SetStateAction<BookRecommendation[]>>} setFilteredData - Функция за актуализиране на състоянието на филтрираните данни.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentPage - Функция за нулиране на страницата на резултатите след прилагане на филтрите.
 *
 * Функцията обработва масив от книги, като проверява дали всяка книга отговаря на избраните критерии.
 * Ако даден филтър е празен, той не ограничава резултатите. Книгите се сравняват по жанр,
 * брой страници, автор, издател, рейтинг и година на писане.
 *
 * @returns {void}
 */
export const handleApplyFilters = (
  filters: {
    genres: string[]; // Филтър по жанрове
    pages: string[]; // Филтър по брой страници
    author: string[]; // Филтър по автори
    publisher: string[]; // Филтър по издатели
    goodreadsRatings: string[]; // Филтър по рейтинг в goodreads
    year: string[]; // Филтър по година на писане
  },
  data: BookRecommendation[],
  setFilteredData: React.Dispatch<React.SetStateAction<BookRecommendation[]>>,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const filtered = data.filter((item) => {
    const { authors, publishers } = extractItemFromStringList(item);
    const bookGenres = formatGenres(item.genre_bg)
      .split(",")
      .map((genre) => genre.trim());

    const matchesGenre =
      filters.genres.length === 0 ||
      filters.genres.some((selectedGenre) =>
        bookGenres.some((bookGenre) =>
          getRelatedGenres(selectedGenre).some((relatedGenre) =>
            bookGenre.toLowerCase().includes(relatedGenre.toLowerCase())
          )
        )
      );

    const matchesPages =
      filters.pages.length === 0 ||
      filters.pages.some((p) => {
        if (p === "Под 100 страници") return item.page_count < 100;
        if (p === "100 до 200 страници")
          return item.page_count >= 100 && item.page_count <= 200;
        if (p === "200 до 300 страници")
          return item.page_count > 200 && item.page_count <= 300;
        if (p === "300 до 400 страници")
          return item.page_count > 300 && item.page_count <= 400;
        if (p === "400 до 500 страници")
          return item.page_count > 400 && item.page_count <= 500;
        if (p === "Повече от 500 страници") return item.page_count > 500;
        return true;
      });

    const matchesAuthor =
      filters.author.length === 0 ||
      filters.author.some((selectedAuthor) =>
        authors.some((bookAuthor) =>
          bookAuthor.toLowerCase().includes(selectedAuthor.toLowerCase())
        )
      );
    const matchesPublisher =
      filters.publisher.length === 0 ||
      filters.publisher.some((selectedPublisher) =>
        publishers.some((bookPublisher) =>
          bookPublisher.toLowerCase().includes(selectedPublisher.toLowerCase())
        )
      );
    const matchesGoodreadsRating =
      filters.goodreadsRatings.length === 0 ||
      filters.goodreadsRatings.some((range) => {
        const rating = item.goodreads_rating
          ? item.goodreads_rating.toString().trim()
          : "";
        const numericRating = parseFloat(rating); // Това е безопасно, защото 'rating' вече е string
        if (isNaN(numericRating)) return false;

        if (range === "Под 3.0") return numericRating < 3.0;
        if (range === "3.0 до 3.5")
          return numericRating >= 3.0 && numericRating < 3.5;
        if (range === "3.5 до 4.0")
          return numericRating >= 3.5 && numericRating < 4.0;
        if (range === "4.0 до 4.5")
          return numericRating >= 4.0 && numericRating < 4.5;
        if (range === "Над 4.5") return numericRating >= 4.5;

        return true;
      });

    const year = extractYear(item.date_of_issue);
    const matchesYear =
      filters.year.length === 0 ||
      filters.year.some((y) => {
        if (year === null) return false;
        if (y === "Преди 1900") return year < 1900;
        if (y === "1900 до 1950") return year >= 1900 && year <= 1950;
        if (y === "1950 до 1980") return year > 1950 && year <= 1980;
        if (y === "1980 до 2000") return year > 1980 && year <= 2000;
        if (y === "2000 до 2010") return year > 2000 && year <= 2010;
        if (y === "След 2010") return year > 2010;
        return true;
      });

    return (
      matchesGenre &&
      matchesPages &&
      matchesAuthor &&
      matchesPublisher &&
      matchesGoodreadsRating &&
      matchesYear
    );
  });

  setFilteredData(filtered);
  setCurrentPage(1);
};
