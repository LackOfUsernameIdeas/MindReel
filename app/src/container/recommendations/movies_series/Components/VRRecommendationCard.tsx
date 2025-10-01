import { FC, useEffect, useState } from "react";
import { RecommendationCardProps } from "../moviesSeriesRecommendations-types";
import { translate } from "../../../helper_functions_common";
import { handleBookmarkClick } from "../helper_functions";
import MovieCardVR from "./MovieCardVR";
import DetailModal from "./DetailModal";
import TrailerModal from "./TrailerModal";

// VR Card component for generated movies/series based on user preferences
const VRRecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMovies
}) => {
  const [translatedDirectors, setTranslatedDirectors] = useState<string>("");
  const [translatedWriters, setTranslatedWriters] = useState<string>("");
  const [translatedActors, setTranslatedActors] = useState<string>("");
  const [translatedAwards, setTranslatedAwards] = useState<string>("");
  const [translatedGenres, setTranslatedGenres] = useState<string>("");
  const [translatedPlot, setTranslatedPlot] = useState<string>("");
  const [translatedCountry, setTranslatedCountry] = useState<string>("");
  const [translatedLanguage, setTranslatedLanguage] = useState<string>("");
  const [translatedDescription, setTranslatedDescription] =
    useState<string>("");

  // VR-specific states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [detailModalType, setDetailModalType] = useState<
    "description" | "plot" | null
  >(null);

  const recommendation = recommendationList[currentIndex];

  // Check if current movie is bookmarked
  const isBookmarked = Array.isArray(bookmarkedMovies)
    ? bookmarkedMovies.some((movie) => movie.imdbID === recommendation.imdbID)
    : false;

  // Translation effects
  useEffect(() => {
    async function fetchDirectorTranslation() {
      const translated = await translate(recommendation.director);
      setTranslatedDirectors(translated);
    }
    fetchDirectorTranslation();
  }, [recommendation.director]);

  useEffect(() => {
    async function fetchWriterTranslation() {
      const translated = await translate(recommendation.writer);
      setTranslatedWriters(translated);
    }
    fetchWriterTranslation();
  }, [recommendation.writer]);

  useEffect(() => {
    async function fetchActorsTranslation() {
      const translated = await translate(recommendation.actors);
      setTranslatedActors(translated);
    }
    fetchActorsTranslation();
  }, [recommendation.actors]);

  useEffect(() => {
    async function fetchAwardsTranslation() {
      const translated = await translate(recommendation.awards);
      setTranslatedAwards(translated);
    }
    fetchAwardsTranslation();
  }, [recommendation.awards]);

  useEffect(() => {
    async function fetchGenresTranslation() {
      const translated = await translate(recommendation.genre);
      setTranslatedGenres(translated);
    }
    fetchGenresTranslation();
  }, [recommendation.genre]);

  useEffect(() => {
    async function fetchPlotTranslation() {
      const translated = await translate(recommendation.plot);
      setTranslatedPlot(translated);
    }
    fetchPlotTranslation();
  }, [recommendation.plot]);

  useEffect(() => {
    async function fetchCountryTranslation() {
      const translated = await translate(recommendation.country);
      setTranslatedCountry(translated);
    }
    fetchCountryTranslation();
  }, [recommendation.country]);

  useEffect(() => {
    async function fetchLanguageTranslation() {
      const translated = await translate(recommendation.language);
      setTranslatedLanguage(translated);
    }
    fetchLanguageTranslation();
  }, [recommendation.language]);

  useEffect(() => {
    async function fetchDescriptionTranslation() {
      const translated = await translate(recommendation.description);
      setTranslatedDescription(translated);
    }
    fetchDescriptionTranslation();
  }, [recommendation.description]);

  // Handle bookmark click
  const handleBookmark = () => {
    handleBookmarkClick(
      recommendation,
      setBookmarkedMovies,
      setCurrentBookmarkStatus,
      setAlertVisible
    );
  };

  // Handle showing detail modals
  const handleShowDetail = (type: "description" | "plot") => {
    setDetailModalType(type);
    setShowDetailModal(true);
  };

  // Handle closing detail modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailModalType(null);
  };

  // Handle showing trailer
  const handleShowTrailer = () => {
    setShowTrailerModal(true);
  };

  // Handle closing trailer modal
  const handleCloseTrailerModal = () => {
    setShowTrailerModal(false);
  };

  // Create recommendation object compatible with MovieCardVR
  const vrRecommendation = {
    ...recommendation,
    title_bg: recommendation.title || recommendation.bgName,
    title_en: recommendation.title,
    genre_bg: translatedGenres || recommendation.genre,
    genre_en: recommendation.genre,
    description: translatedDescription || recommendation.description,
    plot: translatedPlot || recommendation.plot,
    director: translatedDirectors || recommendation.director,
    writer: translatedWriters || recommendation.writer,
    actors: translatedActors || recommendation.actors,
    awards: translatedAwards || recommendation.awards,
    country: translatedCountry || recommendation.country,
    language: translatedLanguage || recommendation.language
  };

  console.log("Current recommendation:", vrRecommendation);

  return (
    <>
      {/* <MovieCardVR
        position="0 2.5 -8"
        recommendation={vrRecommendation}
        handleBookmarkClick={handleBookmark}
        isBookmarked={isBookmarked}
        onShowDetail={handleShowDetail}
        onShowTrailer={handleShowTrailer}
      />

      <DetailModal
        isVisible={showDetailModal}
        contentType={detailModalType}
        description={translatedDescription || recommendation.description}
        plot={translatedPlot || recommendation.plot}
        onClose={handleCloseDetailModal}
        position="0 3.5 -4"
      />

      <TrailerModal
        isVisible={showTrailerModal}
        title={vrRecommendation.title_bg || vrRecommendation.title_en}
        trailerUrl={
          recommendation.youtubeTrailerUrl ||
          "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
        onClose={handleCloseTrailerModal}
        position="0 3.5 -2"
      /> */}
    </>
  );
};

export default VRRecommendationCard;
