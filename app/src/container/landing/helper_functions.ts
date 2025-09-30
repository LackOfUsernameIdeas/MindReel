import { DataType } from "./landing-types";

/**
 * Обработва избор от dropdown меню.
 *
 * @param {React.Dispatch<React.SetStateAction<string>>} setName - Функция за задаване на име.
 * @param {React.Dispatch<React.SetStateAction<number>>} setValue - Функция за задаване на стойност.
 * @param {string} name - Избраното име.
 * @param {number} value - Избраната стойност.
 */
export const handleDropdownClick = (
  setName: React.Dispatch<React.SetStateAction<string>>,
  setValue: React.Dispatch<React.SetStateAction<number>>,
  name: string,
  value: number
) => {
  setName(name);
  setValue(value);
};

/**
 * Извлича данни от API за платформата и ги запазва в състоянието.
 *
 * @param {React.Dispatch<React.SetStateAction<any>>} setUserData - Функция за задаване на потребителски данни.
 * @throws {Error} - Хвърля грешка, ако заявката е неуспешна.
 */
export const fetchData = async (
  setData: React.Dispatch<React.SetStateAction<any>>
): Promise<void> => {
  try {
    // Fetch statistics data independently
    const endpoints = [
      { key: "usersCount", endpoint: "/stats/platform/users-count" },
      { key: "topGenres", endpoint: "/stats/platform/top-genres" },
      { key: "totalAwards", endpoint: "/stats/platform/total-awards" },
      {
        key: "averageBoxOfficeAndScores",
        endpoint: "/stats/platform/average-scores"
      },
      { key: "booksAdaptationsCount", endpoint: "/stats/platform/adaptations" },
      {
        key: "averageSpotifyPopularity",
        endpoint: "/stats/platform/average-spotify-popularity"
      },
      {
        key: "averageYoutubeLikes",
        endpoint: "/stats/platform/average-youtube-likes"
      },
      {
        key: "averageYoutubeViews",
        endpoint: "/stats/platform/average-youtube-views"
      },
      {
        key: "averageYoutubeComments",
        endpoint: "/stats/platform/average-youtube-comments"
      }
    ];

    // Loop over each endpoint, fetch data, and update state independently
    endpoints.forEach(({ key, endpoint }) => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setData((prevState: DataType) => ({
            ...prevState,
            [key]: data
          }));
        })
        .catch((error) => console.error(`Error fetching ${key}:`, error));
    });
  } catch (error) {
    console.error("Error in fetchData:", error);
    throw error;
  }
};

/**
 * Форматира число в съкратен вид със символи K, M, B.
 * Примери:
 *  - 950 -> "950"
 *  - 1 200 -> "1.2K"
 *  - 4 500 000 -> "4.5M"
 *  - 2 000 000 000 -> "2B"
 *
 * @param {number} num - Числото, което ще бъде форматирано.
 * @returns {string} - Форматиран низ със съкратено представяне.
 */
export const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};
