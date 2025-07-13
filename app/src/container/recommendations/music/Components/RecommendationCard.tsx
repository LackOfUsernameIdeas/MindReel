import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { RecommendationCardProps } from "../musicRecommendations-types";
import { translate } from "../../../helper_functions_common";
import { handleBookmarkClick } from "../helper_functions";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";

// Кард за генериран филм/сериал спрямо потребителските предпочитания
const RecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex,
  openModal,
  setBookmarkedMusic,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMusic
}) => {
  const [translatedDirectors, setTranslatedDirectors] = useState<string>(""); // Преведените режисьори
  const [translatedWriters, setTranslatedWriters] = useState<string>(""); // Преведените сценаристи
  const [translatedActors, setTranslatedActors] = useState<string>(""); // Преведените актьори
  const [translatedAwards, setTranslatedAwards] = useState<string>(""); // Преведените награди
  const [translatedGenres, setTranslatedGenres] = useState<string>(""); // Преведените жанрове
  const [translatedPlot, setTranslatedPlot] = useState<string>(""); // Преведеното описание на сюжета
  const [translatedCountry, setTranslatedCountry] = useState<string>(""); // Преведената страна
  const [translatedLanguage, setTranslatedLanguage] = useState<string>(""); // Преведеният език

  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false); // Състояние за отваряне на модалния прозорец

  const handleTrailerModalClick = () => {
    setIsTrailerModalOpen((prev) => !prev);
  }; // Функция за обработка на клик - модален прозорец

  const plotPreviewLength = 150; // Дължина на прегледа на съдържанието (oписаниeто и сюжета)
  const recommendation = recommendationList[currentIndex]; // Генерираният филм/сериал
  // Времетраене (за филм - времетраеното на филма, за сериал - средното времетраене на един епизод)
  const runtime = recommendation.runtimeGoogle || recommendation.runtime;
  const isMovie = recommendation.type === "movie"; // Bool филм или не
  // Рейтинг от Rotten Tomatoes, ако е наличен
  const rottenTomatoesRating =
    recommendation.ratings?.find(
      (rating) => rating.Source === "Rotten Tomatoes"
    )?.Value || "N/A";

  // useEffect за превод на името на режисьора
  useEffect(() => {
    async function fetchDirectorTranslation() {
      const translated = await translate(recommendation.director);
      setTranslatedDirectors(translated);
    }

    fetchDirectorTranslation();
  }, [recommendation.director]);

  // useEffect за превод на името на сценариста
  useEffect(() => {
    async function fetchWriterTranslation() {
      const translated = await translate(recommendation.writer);
      setTranslatedWriters(translated);
    }

    fetchWriterTranslation();
  }, [recommendation.writer]);

  // useEffect за превод на името на актьорите
  useEffect(() => {
    async function fetchActorsTranslation() {
      const translated = await translate(recommendation.actors);
      setTranslatedActors(translated);
    }

    fetchActorsTranslation();
  }, [recommendation.actors]);

  // useEffect за превод на наградите на филма/сериала
  useEffect(() => {
    async function fetchAwardsTranslation() {
      const translated = await translate(recommendation.awards);
      setTranslatedAwards(translated);
    }

    fetchAwardsTranslation();
  }, [recommendation.awards]);

  // useEffect за превод на жанровете на филма/сериала
  useEffect(() => {
    async function fetchGenresTranslation() {
      const translated = await translate(recommendation.genre);
      setTranslatedGenres(translated);
    }

    fetchGenresTranslation();
  }, [recommendation.genre]);

  // useEffect за превод на сюжета на филма/сериала
  useEffect(() => {
    async function fetchPlotTranslation() {
      const translated = await translate(recommendation.plot);
      setTranslatedPlot(translated);
    }

    fetchPlotTranslation();
  }, [recommendation.plot]);

  // useEffect за превод на държавата на филма/сериала
  useEffect(() => {
    async function fetchCountryTranslation() {
      const translated = await translate(recommendation.country);
      setTranslatedCountry(translated);
    }

    fetchCountryTranslation();
  }, [recommendation.country]);

  // useEffect за превод на езика на филма/сериала
  useEffect(() => {
    async function fetchLanguageTranslation() {
      const translated = await translate(recommendation.language);
      setTranslatedLanguage(translated);
    }

    fetchLanguageTranslation();
  }, [recommendation.language]);

  console.log("recommendationList", recommendationList);
  return (
    <div className="recommendation-card">
      <div className="flex w-full items-center sm:items-start flex-col md:flex-row">
        <div className="relative flex-shrink-0 mb-4 md:mb-0 md:mr-8 flex flex-col items-center">
          {/* Постер */}
          <div
            className={`relative group ${
              recommendation.youtubeTrailerUrl ? "cursor-pointer" : ""
            } `}
            onClick={handleTrailerModalClick}
          >
            <img
              src={recommendation.poster}
              alt={`${recommendation.bgName || "Movie"} Poster`}
              className={`rounded-lg w-96 h-auto transition-all duration-300 ${
                recommendation.youtubeTrailerUrl
                  ? "group-hover:scale-102 group-hover:blur-sm"
                  : ""
              }`}
            />

            {/* Play button */}
            {recommendation.youtubeTrailerUrl && (
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
              handleBookmarkClick(
                recommendation,
                setBookmarkedMusic,
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
              {bookmarkedMusic[recommendation.imdbID] ? (
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

        <div className="flex-grow">
          {/* Главна информация */}
          <div className="top-0 z-10">
            <a href="#" className="block text-xl sm:text-3xl font-bold mb-1">
              {recommendation.bgName || "Заглавие не е налично"}
            </a>
            <a
              href="#"
              className="block text-md sm:text-lg font-semibold text-opacity-60 italic mb-2"
            >
              {recommendation.title || "Заглавие на английски не е налично"}
            </a>
            <p className="flex gap-1 recommendation-small-details text-sm italic text-defaulttextcolor/70">
              {translatedGenres || "Жанр неизвестен"} |{" "}
              {!isMovie &&
                `Брой сезони: ${
                  recommendation.totalSeasons || "Неизвестен"
                } | `}
              {runtime || "Неизвестно времетраене"}{" "}
              {!isMovie && (
                <p title="Средно аритметично времетраене на един епизод">
                  (Ср. за 1 епизод)
                </p>
              )}
              | {recommendation.year || "Година неизвестна"} | Рейтинг:{" "}
              {recommendation.rated || "N/A"}
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
                  {recommendation.imdbRating || "N/A"} /{" "}
                  {recommendation.imdbVotes || "N/A"} гласа
                </span>
              </div>
              {isMovie && (
                <div
                  className="flex items-center space-x-2"
                  title="Метаскор: Средно претеглена оценка от критически рецензии за филма."
                >
                  <div
                    className={`flex items-center justify-center rounded-md text-white ${
                      parseInt(recommendation.metascore) >= 60
                        ? "bg-[#54A72A]"
                        : parseInt(recommendation.metascore) >= 40
                        ? "bg-[#FFCC33]"
                        : "bg-[#FF0000]"
                    }`}
                    style={{ width: "2.2rem", height: "2.2rem" }}
                  >
                    <span
                      className={`${
                        recommendation.metascore === "N/A" ||
                        !recommendation.metascore
                          ? "text-sm"
                          : "text-xl"
                      }`}
                    >
                      {recommendation.metascore || "N/A"}
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
          {recommendation.reason && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Защо препоръчваме{" "}
                {recommendation.bgName || "Заглавие не е налично"}?
              </h3>
              <p className="text-opacity-80 italic">{recommendation.reason}</p>
            </div>
          )}
          {/* Описание */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Описание</h3>
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
              <p className="text-opacity-80 italic">
                {recommendation.description.length > plotPreviewLength
                  ? `${recommendation.description.substring(
                      0,
                      plotPreviewLength
                    )}...`
                  : recommendation.description}
              </p>
            </div>
            {recommendation.description &&
              recommendation.description.length > plotPreviewLength && (
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
                {translatedPlot.length > plotPreviewLength
                  ? `${translatedPlot.substring(0, plotPreviewLength)}...`
                  : translatedPlot}
              </p>
            </div>

            {translatedPlot && translatedPlot.length > plotPreviewLength && (
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
                  {recommendation.production || "N/A"}
                </li>
              )}
              <li>
                <strong className="text-primary">Пуснат на:</strong>{" "}
                {recommendation.released || "N/A"}
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
                  {recommendation.boxOffice || "N/A"}
                </li>
              )}
              {isMovie && (
                <li>
                  <strong className="text-primary">DVD:</strong>{" "}
                  {recommendation.DVD !== "N/A" ? recommendation.DVD : "Няма"}
                </li>
              )}
              {isMovie && (
                <li>
                  <strong className="text-primary">Уебсайт:</strong>{" "}
                  {recommendation.website !== "N/A"
                    ? recommendation.website
                    : "Няма"}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {recommendation.youtubeTrailerUrl && (
        <InfoboxModal
          onClick={handleTrailerModalClick}
          isModalOpen={isTrailerModalOpen}
          title={`Трейлър на ${recommendation.bgName} - ${recommendation.title}`}
          description={
            <div className="container text-center">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={recommendation.youtubeTrailerUrl}
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

export default RecommendationCard;
