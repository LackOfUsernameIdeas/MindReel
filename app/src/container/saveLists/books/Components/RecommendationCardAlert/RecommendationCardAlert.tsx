import { FC, useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { BookFormat } from "../../../../recommendations/books/booksRecommendations-types";
import { RecommendationCardProps } from "../../readlist-types";
import Genres from "./Genres";
import AwardsSection from "./Awards";
import { PlotModal } from "../PlotModal";
import {
  parseResolvedGenres,
  processGenresForGoogleBooks
} from "../../helper_functions";
import {
  handleBookBookmarkClick,
  processGenres
} from "../../../../helper_functions_common";

// Компонент за показване на избрана книга като alert
const RecommendationCardAlert: FC<RecommendationCardProps> = ({
  selectedItem, // Избран елемент за показване на информацията
  onClose, // Функция за затваряне на картата
  bookmarkedBooks, // Списък с добавените в отметки книги
  setBookmarkedBooks, // Функция за обновяване на списъка с отметки
  setCurrentBookmarkStatus, // Функция за задаване на текущия статус на отметка
  setAlertVisible // Функция за показване/скриване на предупредителен прозорец
}) => {
  const [description, setDescription] = useState<string>(""); // Описание на книгата
  const [author, setAuthor] = useState<string | null>(null); // Автор на книгата
  const [language, setLanguage] = useState<string | null>(null); // Език на книгата
  const [genres, setGenres] = useState<string[]>([]); // Жанрове на книгата
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false); // Статус на отворен/затворен модал за сюжет
  const plotPreviewLength = 150; // Дължина на прегледа на съдържанието (oписаниeто)
  const source = selectedItem?.source; // Източник на данните за книгата
  const isGoodreads = source === "Goodreads"; // Проверка дали източникът е Goodreads
  const [visible, setVisible] = useState(false); // Видимостта на картата
  const modalRef = useRef<HTMLDivElement>(null); // Референция към модалния контейнер за директна манипулация в DOM

  const [position, setPosition] = useState<number>(0); // Държи текущата вертикална позиция на модала (Y)
  const [dragging, setDragging] = useState<boolean>(false); // Флаг, който показва дали потребителят в момента влачи модала
  const [lastY, setLastY] = useState<number>(0); // Запазва последната Y-координата на допир за плавно движение

  const [posterError, setPosterError] = useState(false); // Състояние за грешка при зареждане на изображението

  // useEffect, който предотвратява скролването на фоновата страница, докато потребителят влачи модала
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (dragging) e.preventDefault(); // Спира скролването на основната страница
    };

    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll); // Премахва слушателя при спиране на влаченето
    };
  }, [dragging]);

  // Функция, която се изпълнява при докосване на модала
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragging(true); // Активира режима на влачене
    setLastY(e.touches[0].clientY); // Запазва началната Y-координата
  };

  // Функция, която се изпълнява при движение на пръста по екрана
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragging) return; // Ако не влачим, прекратяваме функцията

    const deltaY = e.touches[0].clientY - lastY; // Изчислява разликата в позицията
    setLastY(e.touches[0].clientY); // Обновява последната Y-координата

    // Използваме requestAnimationFrame за по-плавно движение
    requestAnimationFrame(() => {
      setPosition((prev) => prev + deltaY);
    });
  };

  // Функция, която се изпълнява, когато потребителят вдигне пръста си от екрана
  const handleTouchEnd = () => {
    setDragging(false); // Деактивира режима на влачене
  };

  // Изпълняваме след всяка промяна на избрания елемент
  useEffect(() => {
    if (selectedItem) {
      setVisible(true); // Правим картата видима, когато има избран елемент
    }
  }, [selectedItem]); // Зависимост: когато избраният елемент се промени

  // Функция за затваряне на картата с анимация
  const handleClose = () => {
    setVisible(false); // Скриваме картата
    setTimeout(() => {
      onClose(); // Извикваме родителската функция за затваряне след 300 ms
    }, 300);
  };

  // Функция за отваряне на модала за сюжет
  const handleOpenPlotModal = () => {
    setIsPlotModalOpen(true); // Отваряме модала
  };

  // Функция за затваряне на модала за сюжет
  const handleClosePlotModal = () => {
    setIsPlotModalOpen(false); // Затваряме модала
  };

  // useEffect, за да получим и зададем автора на книгата
  useEffect(() => {
    const resolveAuthor = async () => {
      if (selectedItem?.author) {
        try {
          // Ако авторът е string, директно го задаваме
          const resolvedAuthor =
            typeof selectedItem.author === "string"
              ? selectedItem.author
              : await selectedItem.author; // Ако е обещание, изчакваме неговото разрешаване
          setAuthor(resolvedAuthor); // Задаваме автора
        } catch (error) {
          console.error("Error resolving author:", error); // Обработваме грешка при получаване на автора
          setAuthor(null); // Ако има грешка, задаваме автора на null
        }
      } else {
        setAuthor(null); // Ако няма автор, задаваме null
      }
    };

    resolveAuthor(); // Извикваме функцията за разрешаване на автора
  }, [selectedItem?.author]); // Зависимост: когато авторът на избрания елемент се промени

  // useEffect при всяка промяна в описанието на избрания елемент
  useEffect(() => {
    // Функция за разрешаване на описанието на книгата
    const resolveDescription = async () => {
      if (selectedItem?.description) {
        try {
          // Ако описанието е string, задаваме го директно
          const resolvedDescription =
            typeof selectedItem.description === "string"
              ? selectedItem.description
              : await selectedItem.description; // Ако е обещание, изчакваме да се разреши
          setDescription(resolvedDescription); // Задаваме описанието
        } catch (error) {
          console.error("Error resolving description:", error); // Обработваме грешка при разрешаване на описанието
          setDescription("Няма описание"); // Ако има грешка, задаваме текст по подразбиране
        }
      } else {
        setDescription("Няма описание"); // Ако няма описание, задаваме текст по подразбиране
      }
    };

    resolveDescription(); // Извикваме функцията за разрешаване на описанието
  }, [selectedItem?.description]); // Зависимост: когато описанието на избрания елемент се промени

  // useEffect при всяка промяна в езика на избрания елемент
  useEffect(() => {
    // Функция за разрешаване на езика на книгата
    const resolveLanguage = async () => {
      if (selectedItem?.language) {
        console.log("a", selectedItem.language);
        try {
          // Ако езикът е string, задаваме го директно
          const resolvedLanguage =
            typeof selectedItem.language === "string"
              ? selectedItem.language
              : await selectedItem.language; // Ако е обещание, изчакваме да се разреши
          setLanguage(resolvedLanguage);
          console.log("b", resolvedLanguage); // Задаваме езика
        } catch (error) {
          console.error("Error resolving language:", error); // Обработваме грешка при разрешаване на езика
          setLanguage(null); // Ако има грешка, задаваме null
        }
      } else {
        setLanguage(null); // Ако няма език, задаваме null
      }
    };

    resolveLanguage(); // Извикваме функцията за разрешаване на езика
  }, [selectedItem?.language]); // Зависимост: когато езикът на избрания елемент се промени

  // useEffect при всяка промяна в жанра на избрания елемент
  useEffect(() => {
    // Функция за разрешаване на жанра на книгата
    const resolveGenres = async () => {
      try {
        let resolvedGenres: string | undefined = selectedItem?.genre_bg; // Извличаме жанровете на базата на езика bg

        // Проверяваме дали `resolvedGenres` е Promise, като гледаме дали има `.then`
        if (
          resolvedGenres &&
          typeof resolvedGenres === "object" &&
          "then" in resolvedGenres
        ) {
          resolvedGenres = await resolvedGenres; // Ако жанровете са Promise, изчакваме да се разрешат
        }

        // Обработка на жанровете в зависимост от източника (Goodreads или Google Books)
        if (isGoodreads) {
          processGenres(resolvedGenres, setGenres); // Ако източникът е Goodreads, обработваме по начин за Goodreads
        } else if (source === "GoogleBooks") {
          resolvedGenres = await parseResolvedGenres(resolvedGenres); // Ако не е Goodreads, извършваме парсиране
          processGenresForGoogleBooks(resolvedGenres, setGenres); // Обработваме жанровете за Google Books
        }
      } catch (error) {
        console.error("Грешка при разрешаване на жанровете:", error);
        setGenres([]); // Ако има грешка, задаваме празен списък
      }
    };

    resolveGenres(); // Извикваме функцията за разрешаване на жанра
  }, [selectedItem?.genre_bg]); // Зависимост: когато жанрът на избрания елемент се промени

  useEffect(() => {
    setPosterError(false); // Ресет на грешката при зареждане на изображението
  }, [selectedItem?.imageLink]);

  // Ако няма избран елемент, връщаме null, за да не рендерираме компонентата
  if (!selectedItem) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        style={{
          transform: `translateY(${position}px)`,
          transition: dragging ? "none" : "transform 0.3s ease-out"
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`m-2 sm:m-0 p-6 rounded-lg shadow-lg bg-[rgb(var(--body-bg))] glow-effect border-2 dark:border-white border-secondary text-center max-w-full transform transition-transform duration-300 ${
          visible ? "scale-100" : "scale-75"
        } w-full sm:w-[90%] md:w-[75%] lg:w-[85%] xl:w-[70%] 2xl:w-[50%]`}
      >
        <div className="recommendation-card">
          <div className="flex w-full items-center sm:items-start flex-col md:flex-row">
            <div className="relative flex-shrink-0 mb-4 md:mb-0 md:mr-8 flex flex-col items-center">
              {/* Постер */}
              {!posterError && selectedItem.imageLink ? (
                <img
                  src={selectedItem.imageLink}
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
                  handleBookBookmarkClick(
                    selectedItem,
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
                    selectedItem.google_books_id || selectedItem.goodreads_id
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
                    {selectedItem.characters ? (
                      <ul className="list-disc list-inside">
                        {selectedItem.characters
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

            <div className="flex-grow w-full md:w-2/3 text-left ml-8">
              <div className="flex-grow flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-8">
                  {/* Заглавия и важна информация */}
                  <div className="mb-2">
                    <p className="block text-xl sm:text-3xl font-bold overflow-hidden mb-2 sm:mb-0">
                      {selectedItem.title_bg || "Заглавие не е налично"}
                    </p>
                    <p className="block text-md sm:text-lg font-semibold text-opacity-60 italic mb-2">
                      {selectedItem.title_en ||
                        "Заглавие на английски не е налично"}
                    </p>
                    <p className="text-sm italic text-defaulttextcolor/70">
                      {author || "Неизвестен автор"},{" "}
                      {selectedItem.page_count || "Неизвестен брой"} страници
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
                          {selectedItem.series || "Не"}
                        </p>
                      </div>
                    )}
                    <strong className="text-xl text-defaulttextcolor/85">
                      Адаптации:
                    </strong>
                    <p className="text-base italic text-defaulttextcolor/70">
                      {selectedItem.adaptations ||
                        "Няма налична информация за адаптации :("}
                    </p>
                  </div>
                </div>
              </div>
              {/* Жанрове */}
              <Genres genres={genres} source={source} />
              {/* Рейтинг */}
              <div className="flex items-center space-x-8">
                <div
                  className="flex dark:text-[#FFCC33] text-[#bf9413] items-center space-x-2"
                  title="Goodreads рейтинг: Базиран на отзиви и оценки от потребители."
                >
                  <span className="font-bold text-lg">
                    Рейтинг в Goodreads:
                  </span>
                  <FaStar className="w-6 h-6" />
                  <span className="font-bold text-lg">
                    {selectedItem.goodreads_rating || "N/A"}{" "}
                    {isGoodreads &&
                      `/ ${selectedItem.goodreads_ratings_count.toLocaleString(
                        "bg-BG"
                      )} гласа`}
                  </span>
                </div>
              </div>
              {/* Ревюта */}
              <span className="italic text-sm mb-4 dark:text-[#FFCC33]/70 text-[#bf9413]">
                {isGoodreads &&
                  `Общо ${selectedItem.goodreads_reviews_count.toLocaleString(
                    "bg-BG"
                  )} ревюта в Goodreads`}
              </span>
              {/* Причина за препоръчване */}
              {selectedItem.reason && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Защо препоръчваме{" "}
                    {selectedItem.title_bg || "Заглавие не е налично"}?
                  </h3>
                  <p className="text-opacity-80 italic">
                    {selectedItem.reason}
                  </p>
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
                    onClick={handleOpenPlotModal}
                    className="mt-2 underline hover:scale-105 transition"
                  >
                    Пълно описание
                  </button>
                )}
              </div>
              {/* Награди */}
              {isGoodreads && <AwardsSection recommendation={selectedItem} />}
              {/* Допълнителна информация */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold mb-2">
                  Допълнителна информация:
                </h3>
                <ul className="flex flex-wrap gap-x-4 text-opacity-80">
                  <li>
                    <strong className="text-primary">Произход:</strong>{" "}
                    {selectedItem.origin || "Неизвестен"}
                  </li>
                  <li>
                    <strong className="text-primary">Език:</strong>{" "}
                    {language || "Неизвестен"}
                  </li>
                  {isGoodreads && (
                    <li>
                      <strong className="text-primary">Вид:</strong>{" "}
                      {selectedItem.book_format
                        ? BookFormat[
                            selectedItem.book_format as keyof typeof BookFormat
                          ]
                        : "Няма информация"}
                    </li>
                  )}
                  {isGoodreads && (
                    <li>
                      <strong className="text-primary">
                        Място на развитие на действието:
                      </strong>{" "}
                      {selectedItem.setting || "Неизвестна"}
                    </li>
                  )}
                  <li>
                    <strong className="text-primary">Издателство:</strong>{" "}
                    {selectedItem.publisher || "Неизвестно"}
                  </li>
                  <li>
                    <strong className="text-primary">
                      Година на публикуване на първо издание:
                    </strong>{" "}
                    {selectedItem.date_of_first_issue || "Неизвестна"}
                  </li>
                  <li>
                    <strong className="text-primary">
                      Дата на публикуване на това издание:
                    </strong>{" "}
                    {selectedItem.date_of_issue || "Неизвестна"}
                  </li>

                  <li>
                    <strong className="text-primary">ISBN_10 (ISBN_13):</strong>{" "}
                    {`${selectedItem.ISBN_10 || "N/A"} (${
                      selectedItem.ISBN_13 || "N/A"
                    })`}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Х */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#FFCC33] bg-opacity-60 rounded-full transition-transform duration-300 transform hover:scale-110 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 48 48"
          >
            <linearGradient
              id="hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1"
              x1="7.534"
              x2="27.557"
              y1="7.534"
              y2="27.557"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#f44f5a"></stop>
              <stop offset=".443" stop-color="#ee3d4a"></stop>
              <stop offset="1" stop-color="#e52030"></stop>
            </linearGradient>
            <path
              fill="url(#hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1)"
              d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"
            ></path>
            <linearGradient
              id="hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2"
              x1="27.373"
              x2="40.507"
              y1="27.373"
              y2="40.507"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#a8142e"></stop>
              <stop offset=".179" stop-color="#ba1632"></stop>
              <stop offset=".243" stop-color="#c21734"></stop>
            </linearGradient>
            <path
              fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)"
              d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"
            ></path>
          </svg>
        </button>
      </div>
      {/*Modal за пълното описание на книгата*/}
      <PlotModal
        isOpen={isPlotModalOpen}
        onClose={handleClosePlotModal}
        plot={description}
      />
    </div>
  );
};

export default RecommendationCardAlert;
