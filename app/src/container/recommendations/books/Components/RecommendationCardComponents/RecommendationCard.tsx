import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import {
  BookFormat,
  RecommendationCardProps
} from "../../booksRecommendations-types";
import Genres from "./Genres";
import AwardsSection from "./Awards";
import { handleBookmarkClick } from "../../helper_functions";

// Кард за генерирана книга спрямо потребителските предпочитания
const RecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex,
  openModal,
  setBookmarkedBooks,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedBooks
}) => {
  const [description, setDescription] = useState<string | null>(null); // Описание на книгата
  const [author, setAuthor] = useState<string | null>(null); // Автор на книгата
  const [language, setLanguage] = useState<string | null>(null); // Език на книгата
  const [genres, setGenres] = useState<string[]>([]); // Жанрове на книгата

  const [posterError, setPosterError] = useState(false); // Състояние за грешка при зареждане на изображението

  const plotPreviewLength = 150; // Дължина на прегледа на съдържанието (oписаниeто)

  const recommendation = recommendationList[currentIndex]; // Генерираната книга
  const source = recommendation.source; // Източник на информация за книгата
  const isGoodreads = source === "Goodreads"; // Bool източник е Goodreads или не

  useEffect(() => {
    // Функция за асинхронно извличане на описанието
    const resolveDescription = async () => {
      // Проверява дали description е Promise и ако е, изчаква стойността му
      if (recommendation.description instanceof Promise) {
        const resolvedDescription = await recommendation.description;
        setDescription(resolvedDescription); // Задава резолвнатото описание
      } else {
        setDescription(recommendation.description); // Задава стойността директно, ако не е Promise
      }
    };

    resolveDescription(); // Извиква функцията при промяна на зависимостта
  }, [recommendation.description]);

  useEffect(() => {
    // Функция за асинхронно извличане на автора
    const resolveAuthor = async () => {
      // Проверява дали author е Promise и ако е, изчаква стойността му
      if (recommendation.author instanceof Promise) {
        const resolvedAuthor = await recommendation.author;
        setAuthor(resolvedAuthor); // Задава резолвнатия автор
      } else {
        setAuthor(recommendation.author); // Задава стойността директно, ако не е Promise
      }
    };

    resolveAuthor(); // Извиква функцията при промяна на зависимостта
  }, [recommendation.author]);

  useEffect(() => {
    // Функция за асинхронно извличане на езика
    const resolveLanguage = async () => {
      // Проверява дали language е Promise и ако е, изчаква стойността му
      if (recommendation.language instanceof Promise) {
        const resolvedLanguage = await recommendation.language;
        setLanguage(resolvedLanguage); // Задава резолвнатия език
      } else {
        setLanguage(recommendation.language); // Задава стойността директно, ако не е Promise
      }
    };

    resolveLanguage(); // Извиква функцията при промяна на зависимостта
  }, [recommendation.language]);

  useEffect(() => {
    // Функция за асинхронно извличане на жанровете
    const resolveGenres = async () => {
      let resolvedGenres;

      try {
        // Проверява дали genre_bg е Promise и ако е, изчаква стойността му
        if (recommendation.genre_bg instanceof Promise) {
          resolvedGenres = await recommendation.genre_bg;
        } else {
          resolvedGenres = recommendation.genre_bg;
        }

        // Обработка на жанровете според източника на данни
        if (isGoodreads) {
          // Ако е Goodreads, очакваме жанровете да бъдат низ със запетайки
          if (typeof resolvedGenres === "string") {
            const genreStrings = resolvedGenres
              .split(",")
              .map((genre) => genre.trim());
            setGenres(genreStrings);
          } else {
            console.warn(
              "Неочакван формат за жанрове от Goodreads:",
              resolvedGenres
            );
          }
        } else if (source === "GoogleBooks") {
          // Ако източникът е Google Books, очакваме жанровете да са обект с категории и поджанрове
          if (typeof resolvedGenres === "object" && resolvedGenres !== null) {
            const genreEntries = Object.entries(resolvedGenres);
            const genreStrings = genreEntries.map(([category, subGenres]) => {
              return `${category}: ${
                Array.isArray(subGenres)
                  ? subGenres.join(", ")
                  : subGenres || "Няма поджанрове"
              }`;
            });
            setGenres(genreStrings);
          } else {
            console.warn(
              "Неочакван формат за жанрове от Google Books:",
              resolvedGenres
            );
          }
        } else {
          console.error("Неизвестен тип източник:", source);
        }
      } catch (error) {
        console.error("Грешка при обработката на genre_bg:", error);
        setGenres([]); // В случай на грешка задаваме празен масив
      }
    };

    resolveGenres(); // Извиква функцията при промяна на зависимостта
  }, [recommendation.genre_bg]);

  useEffect(() => {
    setPosterError(false); // Ресет на грешката при зареждане на изображението
  }, [recommendation.imageLink]);

  return (
    <div className="recommendation-card">
      <div className="flex w-full items-center sm:items-start flex-col md:flex-row">
        <div className="relative flex-shrink-0 mb-4 md:mb-0 md:mr-8 flex flex-col items-center">
          {/* Постер */}
          {!posterError && recommendation.imageLink ? (
            <img
              src={recommendation.imageLink}
              alt=""
              onError={() => setPosterError(true)}
              className="rounded-lg w-[15rem] h-auto"
            />
          ) : (
            <div className="rounded-lg w-[15rem] aspect-[2.8/4] mb-4 bg-white/70 dark:bg-bodybg2" />
          )}
          {/* Бутон за добавяне/премахване от readlist */}
          <button
            onClick={() =>
              handleBookmarkClick(
                recommendation,
                setBookmarkedBooks,
                setCurrentBookmarkStatus,
                setAlertVisible
              )
            }
            className="absolute top-4 left-4 p-2 text-[#FFCC33] bg-black/50 bg-opacity-60 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {bookmarkedBooks[
                recommendation.google_books_id || recommendation.goodreads_id
              ] ? (
                <>
                  <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553L12 15.125 6 18.553V4h12v14.553z"></path>
                  <path d="M6 18.553V4h12v14.553L12 15.125l-6 3.428z"></path>
                </>
              ) : (
                <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"></path>
              )}
            </svg>
          </button>
          {/* Герои */}
          {isGoodreads && (
            <div>
              <strong className="text-xl text-defaulttextcolor/85 block text-center">
                Герои:
              </strong>
              <div className="mt-5">
                {recommendation.characters ? (
                  <ul className="list-disc list-inside">
                    {recommendation.characters
                      .split(", ")
                      .map((character, index) => (
                        <li key={index}>
                          <span className="text-sm font-semibold text-defaulttextcolor/70">
                            {character}
                          </span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-center">Няма информация за героите</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="flex-grow flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-8">
              {/* Заглавия и важна информация */}
              <div className="mb-2">
                <a href="#" className="block text-xl sm:text-3xl font-bold">
                  {recommendation.title_bg || "Заглавие не е налично"}
                </a>
                <a
                  href="#"
                  className="block text-md sm:text-lg font-semibold text-opacity-60 italic mb-2"
                >
                  {recommendation.title_en ||
                    "Заглавие на английски не е налично"}
                </a>
                <p className="text-sm italic text-defaulttextcolor/70">
                  {author || "Неизвестен автор"},{" "}
                  {recommendation.page_count || "неизвестен брой"} страници
                </p>
              </div>
              {/* Поредица и адаптации */}
              <div className="mb-4">
                {isGoodreads && (
                  <div>
                    <strong className="text-xl text-defaulttextcolor/85">
                      Част от поредица:
                    </strong>
                    <p className="text-base italic text-defaulttextcolor/70 mb-2">
                      {recommendation.series || "Не"}
                    </p>
                  </div>
                )}
                <strong className="text-xl text-defaulttextcolor/85">
                  Адаптации:
                </strong>
                <p className="text-base italic text-defaulttextcolor/70">
                  {recommendation.adaptations ||
                    "Няма налична информация за адаптации :("}
                </p>
              </div>
            </div>
          </div>
          {/* Жанрове */}
          <Genres genres={genres} />
          {/* Рейтинг */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div
              className="flex dark:text-[#FFCC33] text-[#bf9413] items-center space-x-2"
              title="Goodreads рейтинг: Базиран на отзиви и оценки от потребители."
            >
              <span className="font-bold text-lg">Рейтинг в Goodreads:</span>
              <FaStar className="w-6 h-6" />
              <span className="font-bold text-lg">
                {recommendation.goodreads_rating || "N/A"}{" "}
                {isGoodreads &&
                  `/ ${recommendation.goodreads_ratings_count.toLocaleString(
                    "bg-BG"
                  )} гласа`}
              </span>
            </div>
          </div>
          {/* Ревюта */}
          <span className="italic text-sm mb-4 dark:text-[#FFCC33]/70 text-[#bf9413]">
            {isGoodreads &&
              `Общо ${recommendation.goodreads_reviews_count.toLocaleString(
                "bg-BG"
              )} ревюта в Goodreads`}
          </span>
          {/* Причина за препоръчване */}
          {recommendation.reason && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Защо препоръчваме{" "}
                {recommendation.title_bg || "Заглавие не е налично"}?
              </h3>
              <p className="text-opacity-80 italic">{recommendation.reason}</p>
            </div>
          )}
          {/* Описание */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Описание</h3>
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
              <p className="text-opacity-80 italic">
                {description && description.length > plotPreviewLength
                  ? `${description.substring(0, plotPreviewLength)}...`
                  : description}
              </p>
            </div>

            {description && description.length > plotPreviewLength && (
              <button
                onClick={openModal}
                className="mt-2 underline hover:scale-105 transition"
              >
                Пълно описание
              </button>
            )}
          </div>
          {/* Награди */}
          {isGoodreads && <AwardsSection recommendation={recommendation} />}
          {/* Допълнителна информация */}
          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2">
              Допълнителна информация:
            </h3>
            <ul className="flex flex-wrap gap-x-4 text-opacity-80">
              <li>
                <strong className="text-primary">Произход:</strong>{" "}
                {recommendation.origin || "Неизвестен"}
              </li>
              <li>
                <strong className="text-primary">Език:</strong>{" "}
                {language || "Неизвестен"}
              </li>
              {isGoodreads && (
                <li>
                  <strong className="text-primary">Вид:</strong>{" "}
                  {recommendation.book_format
                    ? BookFormat[
                        recommendation.book_format as keyof typeof BookFormat
                      ]
                    : "Няма информация"}
                </li>
              )}
              {isGoodreads && (
                <li>
                  <strong className="text-primary">
                    Място на развитие на действието:
                  </strong>{" "}
                  {recommendation.setting || "Неизвестна"}
                </li>
              )}
              <li>
                <strong className="text-primary">Издателство:</strong>{" "}
                {recommendation.publisher || "Неизвестно"}
              </li>
              <li>
                <strong className="text-primary">
                  Година на публикуване на първо издание:
                </strong>{" "}
                {recommendation.date_of_first_issue || "Неизвестна"}
              </li>
              <li>
                <strong className="text-primary">
                  Дата на публикуване на това издание:
                </strong>{" "}
                {recommendation.date_of_issue || "Неизвестна"}
              </li>

              <li>
                <strong className="text-primary">ISBN_10 (ISBN_13):</strong>{" "}
                {`${recommendation.ISBN_10 || "N/A"} (${
                  recommendation.ISBN_13 || "N/A"
                })`}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
