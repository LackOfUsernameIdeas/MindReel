import { FC, useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { PlotAndDescriptionModal } from "./PlotAndDescriptionModal";
import { Rating, RecommendationCardAlertProps } from "../watchlist-types";
import {
  handleMovieSeriesBookmarkClick,
  translate
} from "../../../helper_functions_common";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";

// Компонент за показване на избран филм/сериал като alert
const RecommendationCardAlert: FC<RecommendationCardAlertProps> = ({
  selectedItem,
  onClose,
  bookmarkedMovies,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible
}) => {
  const [translatedDirectors, setTranslatedDirectors] = useState<string>(""); // Преведените режисьори
  const [translatedWriters, setTranslatedWriters] = useState<string>(""); // Преведените сценаристи
  const [translatedActors, setTranslatedActors] = useState<string>(""); // Преведените актьори
  const [translatedAwards, setTranslatedAwards] = useState<string>(""); // Преведените награди
  const [translatedPlot, setTranslatedPlot] = useState<string>(""); // Преведеното описание на сюжета
  const [translatedCountry, setTranslatedCountry] = useState<string>(""); // Преведената страна
  const [translatedLanguage, setTranslatedLanguage] = useState<string>(""); // Преведеният език
  const [visible, setVisible] = useState(false); // Показване на компонента
  const [isModalOpen, setIsModalOpen] = useState(false); // Статус на модалния прозорец
  const [modalType, setModalType] = useState<"description" | "plot">(
    "description"
  );
  const [modalData, setModalData] = useState<string | undefined>(""); // Данни за съдържанието на модалния прозорец
  const previewLength = 70; // Дължина на прегледа на съдържанието (oписаниeто и сюжета)
  const modalRef = useRef<HTMLDivElement>(null); // Референция към модалния контейнер за директна манипулация в DOM

  const [position, setPosition] = useState<number>(0); // Държи текущата вертикална позиция на модала (Y)
  const [dragging, setDragging] = useState<boolean>(false); // Флаг, който показва дали потребителят в момента влачи модала
  const [lastY, setLastY] = useState<number>(0); // Запазва последната Y-координата на допир за плавно движение

  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false); // Състояние за отваряне на модалния прозорец

  const [posterError, setPosterError] = useState(false); // Състояние за грешка при зареждане на изображението

  const handleTrailerModalClick = () => {
    setIsTrailerModalOpen((prev) => !prev);
  }; // Функция за обработка на клик - модален прозорец

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

  // Когато има информация за филма/сериала, кардът се render-ва
  useEffect(() => {
    if (selectedItem) {
      setVisible(true);
    }
  }, [selectedItem]);

  // Затваряме компонента след 300ms
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose(); // Извикваме
    }, 300);
  };

  // Отваря modal-а
  const openModal = (type: "description" | "plot") => {
    setModalType(type);
    setModalData(
      type === "description" ? selectedItem?.description || "" : translatedPlot
    );
    setIsModalOpen(true);
  };

  // Затваря modal-а
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // useEffect за превод на името на режисьора
  useEffect(() => {
    if (selectedItem?.director !== null) {
      async function fetchDirectorTranslation() {
        const translated =
          selectedItem?.director && (await translate(selectedItem.director));
        translated && setTranslatedDirectors(translated);
      }
      fetchDirectorTranslation();
    }
  }, [selectedItem?.director]);

  // useEffect за превод на името на сценариста
  useEffect(() => {
    if (selectedItem?.writer) {
      async function fetchWriterTranslation() {
        const translated =
          selectedItem?.writer && (await translate(selectedItem.writer));
        translated && setTranslatedWriters(translated);
      }
      fetchWriterTranslation();
    }
  }, [selectedItem?.writer]);

  // useEffect за превод на името на актьорите
  useEffect(() => {
    if (selectedItem?.actors) {
      async function fetchActorsTranslation() {
        const translated =
          selectedItem?.actors && (await translate(selectedItem.actors));
        translated && setTranslatedActors(translated);
      }
      fetchActorsTranslation();
    }
  }, [selectedItem?.actors]);

  // useEffect за превод на наградите на филма/сериала
  useEffect(() => {
    if (selectedItem?.awards) {
      async function fetchAwardsTranslation() {
        const translated =
          selectedItem?.awards && (await translate(selectedItem.awards));
        translated && setTranslatedAwards(translated);
      }
      fetchAwardsTranslation();
    }
  }, [selectedItem?.awards]);

  // useEffect за превод на сюжета на филма/сериала
  useEffect(() => {
    if (selectedItem?.plot) {
      async function fetchPlotTranslation() {
        const translated =
          selectedItem?.plot && (await translate(selectedItem.plot));
        translated && setTranslatedPlot(translated);
      }

      fetchPlotTranslation();
    }
  }, [selectedItem?.plot]);

  // useEffect за превод на държавата на филма/сериала
  useEffect(() => {
    if (selectedItem?.country) {
      async function fetchCountryTranslation() {
        const translated =
          selectedItem?.country && (await translate(selectedItem?.country));
        translated && setTranslatedCountry(translated);
      }
      fetchCountryTranslation();
    }
  }, [selectedItem?.country]);

  // useEffect за превод на езика на филма/сериала
  useEffect(() => {
    if (selectedItem?.language) {
      async function fetchLanguageTranslation() {
        const translated =
          selectedItem?.language && (await translate(selectedItem?.language));
        translated && setTranslatedLanguage(translated);
      }
      fetchLanguageTranslation();
    }
  }, [selectedItem?.language]);

  useEffect(() => {
    setPosterError(false); // Ресет на грешката при зареждане на изображението
  }, [selectedItem?.poster]);

  // Ако няма избран елемент, връщаме null (не рендерираме компонента)
  if (!selectedItem) return null;

  // Преведените жанрове, с дефолтна стойност, ако липсват
  const translatedGenres = selectedItem.genre_bg || "Жанр неизвестен";

  // Проверка дали избраният елемент е филм
  const isMovie = selectedItem.type === "movie";

  // Форматиране на рейтингите
  const ratings: Rating[] = Array.isArray(selectedItem.ratings)
    ? selectedItem.ratings
    : JSON.parse(selectedItem.ratings || "[]");

  // Рейтинг от Rotten Tomatoes, ако е наличен
  const rottenTomatoesRating = Array.isArray(ratings)
    ? ratings.find((rating) => rating.Source === "Rotten Tomatoes")?.Value ||
      "N/A"
    : "N/A";

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
        className={`m-2 sm:m-0 p-6 rounded-lg shadow-lg bg-[rgb(var(--body-bg))] glow-effect border-2 dark:border-white border-secondary text-center max-w-full transition-transform duration-300 ${
          visible ? "scale-100" : "scale-75"
        } w-full sm:w-[90%] md:w-[75%] lg:w-[85%] xl:w-[70%] 2xl:w-[50%]`}
      >
        <div className="recommendation-card">
          <div className="flex w-full items-center flex-col md:flex-row">
            <div className="relative flex-shrink-0 mb-4 md:mb-0 md:mr-8 flex flex-col items-center">
              {/* Постер */}
              <div
                className={`relative group ${
                  selectedItem.youtubeTrailerUrl ? "cursor-pointer" : ""
                } `}
                onClick={handleTrailerModalClick}
              >
                {!posterError && selectedItem.poster ? (
                  <img
                    src={selectedItem.poster}
                    alt=""
                    onError={() => setPosterError(true)}
                    className={`rounded-lg w-96 h-auto transition-all duration-300 ${
                      selectedItem.youtubeTrailerUrl
                        ? "group-hover:scale-102 group-hover:blur-sm"
                        : ""
                    }`}
                  />
                ) : (
                  <div className="rounded-lg w-96 aspect-[2.8/4] bg-white/70 dark:bg-bodybg2" />
                )}
                {/* Play button */}
                {selectedItem.youtubeTrailerUrl && (
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                    <div className="group relative">
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 group-hover:scale-[1.7] transition-transform duration-500"></div>
                      <div className="relative bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/30 shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 group-hover:border-white/50">
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="white"
                          viewBox="0 0 24 24"
                          className="size-16 text-white drop-shadow-lg relative z-10 transform transition-transform duration-300 group-hover:scale-105"
                          style={{
                            filter:
                              "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))"
                          }}
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <div className="absolute inset-0 rounded-full border-2 border-white/40 group-hover:animate-ping"></div>
                      </div>
                      <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full bg-black/20 blur-lg -z-10"></div>
                    </div>
                  </div>
                )}
              </div>
              {/* Бутон за добавяне/премахване от watchlist */}
              <button
                onClick={() =>
                  handleMovieSeriesBookmarkClick(
                    selectedItem,
                    setBookmarkedMovies,
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
                  {bookmarkedMovies[selectedItem.imdbID] ? (
                    <>
                      <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553L12 15.125 6 18.553V4h12v14.553z"></path>
                      <path d="M6 18.553V4h12v14.553L12 15.125l-6 3.428z"></path>
                    </>
                  ) : (
                    <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"></path>
                  )}
                </svg>
              </button>
            </div>

            <div className="flex-grow w-full md:w-2/3 text-left ml-8">
              {/* Главна информация */}
              <div className="top-0 z-10">
                <p className="block text-xl sm:text-3xl font-bold overflow-hidden mb-2 sm:mb-0">
                  {selectedItem.title_bg || "Заглавие не е налично"}
                </p>
                <p className="block text-md sm:text-lg font-semibold text-opacity-60 italic mb-2">
                  {selectedItem.title_en ||
                    "Заглавие на английски не е налично"}
                </p>
                <p className="flex gap-1 recommendation-small-details text-sm italic text-defaulttextcolor/70">
                  {translatedGenres || "Жанр неизвестен"} |{" "}
                  {!isMovie &&
                    `Брой сезони: ${
                      selectedItem.totalSeasons || "Неизвестен"
                    } | `}
                  {selectedItem.runtime || "Неизвестно времетраене"}{" "}
                  {!isMovie && (
                    <p title="Средно аритметично времетраене на един епизод">
                      (Ср. за 1 епизод)
                    </p>
                  )}
                  | {selectedItem.year || "Година неизвестна"} | Рейтинг:{" "}
                  {selectedItem.rated || "N/A"}
                </p>
                {/* Рейтинги */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 py-2">
                  <div
                    className="flex items-center space-x-2 dark:text-[#FFCC33] text-[#bf9413]"
                    title="IMDb рейтинг: Базиран на отзиви и оценки от потребители."
                  >
                    <span className="font-bold text-lg">IMDb: </span>
                    <FaStar className="w-8 h-8" />
                    <span className="font-bold text-lg">
                      {selectedItem.imdbRating || "N/A"} /{" "}
                      {selectedItem.imdbVotes || "N/A"} гласа
                    </span>
                  </div>
                  {isMovie && (
                    <div
                      className="flex items-center space-x-2"
                      title="Метаскор: Средно претеглена оценка от критически рецензии за филма."
                    >
                      <div
                        className={`flex items-center justify-center rounded-md text-white ${
                          parseInt(selectedItem.metascore) >= 60
                            ? "bg-[#54A72A]"
                            : parseInt(selectedItem.metascore) >= 40
                            ? "bg-[#FFCC33]"
                            : "bg-[#FF0000]"
                        }`}
                        style={{ width: "2.2rem", height: "2.2rem" }}
                      >
                        <span
                          className={`${
                            selectedItem.metascore === "N/A" ||
                            !selectedItem.metascore
                              ? "text-sm"
                              : "text-xl"
                          }`}
                        >
                          {selectedItem.metascore || "N/A"}
                        </span>
                      </div>
                      <span className="font-semibold text-md sm:text-sm md:text-lg">
                        Метаскор
                      </span>
                    </div>
                  )}
                  {isMovie && (
                    <div
                      className="flex items-center space-x-2"
                      title="Rotten Tomatoes рейтинг: Процент положителни рецензии от професионални критици."
                    >
                      <SiRottentomatoes className="text-[#FF0000] w-8 h-8" />
                      <span className="text-red-400 font-semibold text-md sm:text-sm md:text-lg">
                        {rottenTomatoesRating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
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
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Описание</h3>
                <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
                  <p className="text-opacity-80 italic">
                    {selectedItem.description.length > previewLength
                      ? `${selectedItem.description.substring(
                          0,
                          previewLength
                        )}...`
                      : selectedItem.description}
                  </p>
                </div>

                {selectedItem.description &&
                  selectedItem.description.length > previewLength && (
                    <button
                      onClick={() => openModal("description")}
                      className="mt-2 underline hover:scale-105 transition"
                    >
                      Пълно описание
                    </button>
                  )}
              </div>
              {/* Сюжет */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Сюжет</h3>
                <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
                  <p className="text-opacity-80 italic">
                    {translatedPlot.length > previewLength
                      ? `${translatedPlot.substring(0, previewLength)}...`
                      : translatedPlot}
                  </p>
                </div>

                {translatedPlot && translatedPlot.length > previewLength && (
                  <button
                    onClick={() => openModal("plot")}
                    className="mt-2 underline hover:scale-105 transition"
                  >
                    Пълен сюжет
                  </button>
                )}
              </div>
              {/* Допълнителна информация */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Допълнителна информация:
                </h3>
                <ul className="flex flex-wrap gap-x-4 text-opacity-80">
                  <li>
                    <strong className="text-primary">Режисьор:</strong>{" "}
                    {translatedDirectors && translatedDirectors !== "N/A"
                      ? translatedDirectors
                      : "Неизвестен"}
                  </li>
                  <li>
                    <strong className="text-primary">Сценаристи:</strong>{" "}
                    {translatedWriters && translatedWriters !== "N/A"
                      ? translatedWriters
                      : "Неизвестни"}
                  </li>
                  <li>
                    <strong className="text-primary">Актьори:</strong>{" "}
                    {translatedActors && translatedActors !== "N/A"
                      ? translatedActors
                      : "Неизвестни"}
                  </li>
                  {isMovie && (
                    <li>
                      <strong className="text-primary">Продукция:</strong>{" "}
                      {selectedItem.production || "N/A"}
                    </li>
                  )}
                  <li>
                    <strong className="text-primary">Пуснат на:</strong>{" "}
                    {selectedItem.released || "N/A"}
                  </li>
                  <li>
                    <strong className="text-primary">Език:</strong>{" "}
                    {translatedLanguage && translatedLanguage !== "N/A"
                      ? translatedLanguage
                      : "Неизвестен"}
                  </li>
                  <li>
                    <strong className="text-primary">Държава/-и:</strong>{" "}
                    {translatedCountry && translatedCountry !== "N/A"
                      ? translatedCountry
                      : "Неизвестна/-и"}
                  </li>
                  <li>
                    <strong className="text-primary">Награди:</strong>{" "}
                    {translatedAwards && translatedAwards !== "N/A"
                      ? translatedAwards
                      : "Няма"}
                  </li>
                  {isMovie && (
                    <li>
                      <strong className="text-primary">Боксофис:</strong>{" "}
                      {selectedItem.boxOffice || "N/A"}
                    </li>
                  )}
                  {isMovie && (
                    <li>
                      <strong className="text-primary">DVD:</strong>{" "}
                      {selectedItem.DVD !== "N/A" ? selectedItem.DVD : "Няма"}
                    </li>
                  )}
                  {isMovie && (
                    <li>
                      <strong className="text-primary">Уебсайт:</strong>{" "}
                      {selectedItem.website !== "N/A"
                        ? selectedItem.website
                        : "Няма"}
                    </li>
                  )}
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
      {/*Modal за пълното описание/сюжет на филма/сериала*/}
      <PlotAndDescriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        modalData={modalData}
        modalType={modalType}
      />
      {selectedItem.youtubeTrailerUrl && (
        <InfoboxModal
          onClick={handleTrailerModalClick}
          isModalOpen={isTrailerModalOpen}
          title={`Трейлър на ${selectedItem.title_bg} - ${selectedItem.title_en}`}
          description={
            <div className="container text-center">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={selectedItem.youtubeTrailerUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default RecommendationCardAlert;
