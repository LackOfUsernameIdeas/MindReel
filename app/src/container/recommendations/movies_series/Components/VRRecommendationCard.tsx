import { FC, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { RecommendationCardProps } from "../moviesSeriesRecommendations-types";
import { translate } from "../../../helper_functions_common";
import { handleBookmarkClick } from "../helper_functions";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";

// Кард за генериран филм/сериал спрямо потребителските предпочитания
const VRRecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex,
  openModal,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMovies
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

  const [posterError, setPosterError] = useState(false); // Състояние за грешка при зареждане на изображението

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

  useEffect(() => {
    setPosterError(false); // Ресет на грешката при зареждане на изображението
  }, [recommendation.poster]);

  console.log("recommendationList", recommendationList);
  return (
    <h1 className="text-3xl font-bold text-center text-white">
      VR Scene Experience Complete
    </h1>
  );
};

export default VRRecommendationCard;
