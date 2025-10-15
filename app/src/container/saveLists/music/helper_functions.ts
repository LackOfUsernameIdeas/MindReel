// ==============================
// Импортиране на типове и интерфейси
// ==============================
import { MovieSeriesRecommendation } from "@/container/types_common";
import { DataType, NameMappings } from "./listenlist-types";
import { translate } from "@/container/helper_functions_common";

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
        key: "topRecommendationsWatchlist",
        endpoint: "/stats/individual/watchlist",
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
          setData((prevState: DataType) => ({
            ...prevState,
            [key]: processedData
          }));
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
 * Извлича автори, режисьори, сценаристи и езици от подадения обект, като премахва дублиращите се стойности.
 *
 * @param {Object} item - Обектът, съдържащ информация за книгата или филма.
 * @param {string} [item.actors] - Списък с актьори, разделени със запетая.
 * @param {string} [item.director] - Списък с режисьори, разделени със запетая.
 * @param {string} [item.writer] - Списък с сценаристи, разделени със запетая.
 * @param {string} [item.language] - Списък с езици, разделени със запетая.
 * @returns {Object} - Обект със свойства `actors`, `directors`, `writers` и `languages`, всеки от които е масив от уникални низове.
 */
export const extractItemFromStringList = (
  item: any
): {
  actors: string[];
  directors: string[];
  writers: string[];
  languages: string[];
} => {
  const uniqueValues = (str?: string): string[] => {
    return str ? [...new Set(str.split(",").map((value) => value.trim()))] : [];
  };

  return {
    actors: uniqueValues(item.actors),
    directors: uniqueValues(item.director),
    writers: uniqueValues(item.writer),
    languages: uniqueValues(item.language)
  };
};

/**
 * Превежда типа на филма или сериала на български.
 *
 * @param {string} type - Типът на филма или сериала (например "movie" или "series").
 * @returns {string} - Преведеният тип на български (например "Филм" или "Сериал").
 */
export const getTranslatedType = (type: string) =>
  type === "movie" ? "Филм" : type === "series" ? "Сериал" : type;

/**
 * Филтрира данните според подадените критерии за жанрове, продължителност, вид, година на издаване и други параметри.
 *
 * @param {Object} filters - Обект с филтри, които ще се приложат към данните.
 * @param {string[]} filters.genres - Списък с избрани жанрове, по които да се филтрират филмите и сериалите.
 * @param {string[]} filters.runtime - Списък с диапазони за продължителността (напр. "Под 60 минути").
 * @param {string[]} filters.actor - Списък с актьори, по които да се филтрират резултатите.
 * @param {string[]} filters.director - Списък с режисьори, по които да се филтрират резултатите.
 * @param {string[]} filters.writer - Списък със сценаристи, по които да се филтрират резултатите.
 * @param {string[]} filters.language - Списък с езици, на които са филмите/сериалите.
 * @param {string[]} filters.type - Видът на съдържанието - филм или сериал.
 * @param {string[]} filters.imdbRating - Списък с диапазони на IMDb рейтинга (напр. "Над 8.0").
 * @param {string[]} filters.metascore - Списък с диапазони на Metascore (напр. "От 70 до 90").
 * @param {string[]} filters.boxOffice - Списък с диапазони на приходи от боксофиса (напр. "Над 100 млн.").
 * @param {string[]} filters.year - Списък с времеви интервали за годината на издаване (напр. "След 2020").
 *
 * @param {NameMappings} nameMappings - Мапинг за съответствие между английски и български имена на актьорите, режисьорите, сценаристите и езиците.
 * @param {MovieSeriesRecommendation[]} data - Масив от филми и сериали, които ще бъдат филтрирани.
 * @param {React.Dispatch<React.SetStateAction<MovieSeriesRecommendation[]>>} setFilteredData - Функция за актуализиране на състоянието на филтрираните данни.
 * @param {React.Dispatch<React.SetStateAction<number>>} setCurrentPage - Функция за нулиране на страницата на резултатите след прилагане на филтрите.
 *
 * Функцията обработва масив от филми и сериали, като проверява дали те отговарят на избраните критерии.
 * Ако даден филтър е празен, той не ограничава резултатите. Филмите и сериалите се сравняват по жанр,
 * продължителност, вид, година на издаване, рейтинг и други критерии.
 *
 * @returns {void}
 */
export const handleApplyFilters = (
  filters: {
    genres: string[];
    runtime: string[];
    actor: string[];
    director: string[];
    writer: string[];
    language: string[];
    type: string[];
    imdbRating: string[];
    metascore: string[];
    boxOffice: string[];
    year: string[];
  },
  nameMappings: NameMappings,
  data: MovieSeriesRecommendation[],
  setFilteredData: React.Dispatch<
    React.SetStateAction<MovieSeriesRecommendation[]>
  >,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const filtered = data.filter((item) => {
    const { actors, directors, writers, languages } =
      extractItemFromStringList(item);
    const movieGenres = item.genre_bg.split(",").map((genre) => genre.trim());
    const matchesGenre =
      filters.genres.length === 0 ||
      filters.genres.some((selectedGenre) =>
        movieGenres.includes(selectedGenre)
      );

    const runtime = parseInt(item.runtime.replace(/\D/g, ""), 10);
    const matchesRuntime =
      filters.runtime.length === 0 ||
      filters.runtime.some((r) => {
        if (r === "Под 60 минути") return runtime < 60;
        if (r === "60 до 120 минути") return runtime >= 60 && runtime <= 120;
        if (r === "120 до 180 минути") return runtime > 120 && runtime <= 180;
        if (r === "Повече от 180 минути") return runtime > 180;
        return true;
      });

    const matchesType =
      filters.type.length === 0 ||
      filters.type.includes(getTranslatedType(item.type));

    const matchesActors =
      filters.actor.length === 0 ||
      filters.actor.some((selectedActor) =>
        checkPersonMatch(
          nameMappings,
          selectedActor.toLowerCase(),
          actors,
          "actors"
        )
      );

    const matchesDirector =
      filters.director.length === 0 ||
      filters.director.some((selectedDirector) =>
        checkPersonMatch(
          nameMappings,
          selectedDirector.toLowerCase(),
          directors,
          "directors"
        )
      );

    const matchesWriter =
      filters.writer.length === 0 ||
      filters.writer.some((selectedWriter) =>
        checkPersonMatch(
          nameMappings,
          selectedWriter.toLowerCase(),
          writers,
          "writers"
        )
      );

    const matchesLanguage =
      filters.language.length === 0 ||
      filters.language.some((selectedLanguage) =>
        checkPersonMatch(
          nameMappings,
          selectedLanguage.toLowerCase(),
          languages,
          "languages"
        )
      );

    const imdbRating = parseInt(item.imdbRating, 10);
    const matchesImdbRating =
      filters.imdbRating.length === 0 ||
      filters.imdbRating.some((r) => {
        if (r === "Под 5.0") return imdbRating < 5.0;
        if (r === "5.0 до 7.0") return imdbRating >= 5.0 && imdbRating < 7.0;
        if (r === "7.0 до 8.5") return imdbRating >= 7.0 && imdbRating < 8.5;
        if (r === "8.5 до 9.5") return imdbRating >= 8.5 && imdbRating < 9.5;
        if (r === "Над 9.5") return imdbRating >= 9.5;
        return true;
      });

    const metascore = parseInt(item.metascore, 10);
    const matchesMetascore =
      filters.metascore.length === 0 ||
      filters.metascore.some((m) => {
        if (item.type === "series") return false;
        if (m === "Под 35") return metascore < 35;
        if (m === "35 до 50") return metascore >= 35 && metascore < 50;
        if (m === "50 до 75") return metascore >= 50 && metascore < 75;
        if (m === "75 до 95") return metascore >= 75 && metascore < 95;
        if (m === "Над 95") return metascore >= 95;
        return true;
      });

    const boxOffice = parseInt(item.boxOffice.replace(/\D/g, ""), 10) || 0;
    const matchesBoxOffice =
      filters.boxOffice.length === 0 ||
      filters.boxOffice.some((b) => {
        if (item.type === "series") return false;

        if (b === "Без приходи") return boxOffice === 0;
        if (b === "Под 50 млн.") return boxOffice > 0 && boxOffice < 50_000_000;
        if (b === "50 до 150 млн.")
          return boxOffice >= 50_000_000 && boxOffice < 150_000_000;
        if (b === "150 до 300 млн.")
          return boxOffice >= 150_000_000 && boxOffice < 300_000_000;
        if (b === "Над 300 млн.") return boxOffice >= 300_000_000;

        return true;
      });

    const year = parseInt(item.year, 10);
    const matchesYear =
      filters.year.length === 0 ||
      filters.year.some((y) => {
        if (y === "Преди 2000") return year < 2000;
        if (y === "2000 до 2010") return year >= 2000 && year <= 2010;
        if (y === "2010 до 2020") return year > 2010 && year <= 2020;
        if (y === "След 2020") return year > 2020;
        return true;
      });

    return (
      matchesGenre &&
      matchesRuntime &&
      matchesActors &&
      matchesDirector &&
      matchesWriter &&
      matchesLanguage &&
      matchesType &&
      matchesYear &&
      matchesImdbRating &&
      matchesMetascore &&
      matchesBoxOffice
    );
  });

  setFilteredData(filtered);
  setCurrentPage(1);
};

/**
 * Обработва дадена категория от елементи, премахва дублиращите се стойности,
 * превежда ги и създава двупосочна таблица за съответствия.
 *
 * @param {string[][]} items - Двумерен масив със стойности, които трябва да се обработят.
 * @returns {Promise<{ mappings: Map<string, string>, listItems: string[] }>}
 * Обект, съдържащ двупосочните съответствия и списък с преведените елементи.
 */
export const processCategory = async (items: string[][]) => {
  const uniqueItems = new Set(items.flat());
  const itemsArray = Array.from(uniqueItems);
  const translatedItems = await Promise.all(
    itemsArray.map((item) => translate(item))
  );

  // Create bidirectional mapping
  const mappings = new Map();
  itemsArray.forEach((item, i) => {
    mappings.set(item, translatedItems[i]);
    mappings.set(translatedItems[i], item);
  });

  return {
    mappings,
    listItems: translatedItems
  };
};

/**
 * Проверява дали дадено име съвпада със списък от лица, като сравнява
 * както оригиналното име, така и преведената му версия.
 *
 * @param {Object} nameMappings - Обект, съдържащ съответствия между оригинални и преведени имена.
 * @param {Map<string, string>} nameMappings.actors - Карта с актьори и техните преведени имена.
 * @param {Map<string, string>} nameMappings.directors - Карта с режисьори и техните преведени имена.
 * @param {Map<string, string>} nameMappings.writers - Карта със сценаристи и техните преведени имена.
 * @param {Map<string, string>} nameMappings.languages - Карта с езици и техните преведени имена.
 * @param {string} query - Търсената стойност (част от име или цяло име).
 * @param {string[]} personList - Списък с налични лица за проверка.
 * @param {keyof typeof nameMappings} mappingsKey - Ключът в обекта `nameMappings`, който трябва да се използва.
 * @returns {boolean} Връща `true`, ако има съвпадение, и `false` в противен случай.
 */
export const checkPersonMatch = (
  nameMappings: {
    actors: Map<string, string>;
    directors: Map<string, string>;
    writers: Map<string, string>;
    languages: Map<string, string>;
  },
  query: string,
  personList: string[],
  mappingsKey: keyof typeof nameMappings
) => {
  if (!personList?.length) return false;

  return personList.some((person) => {
    // Check English name
    if (person.toLowerCase().includes(query)) return true;

    // Check Bulgarian translation
    const translatedName = nameMappings[mappingsKey].get(person);
    if (translatedName?.toLowerCase().includes(query)) return true;

    // Check if any Bulgarian name contains the query and matches this person
    return Array.from(nameMappings[mappingsKey].entries()).some(
      ([bgName, engName]) =>
        bgName.toLowerCase().includes(query) && engName === person
    );
  });
};
