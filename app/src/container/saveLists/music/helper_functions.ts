// ==============================
// Импортиране на типове и интерфейси
// ==============================
import { DataType } from "./listenlist-types";
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
        key: "topRecommendationsListenlist",
        endpoint: "/stats/individual/listenlist",
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
