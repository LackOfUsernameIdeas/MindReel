import { FC, useEffect, useMemo, useRef, useState, useCallback } from "react";
import ErrorCard from "../../../../components/common/error/error";
import "aframe";
import "aframe-extras";
import "aframe-physics-system";
import "aframe-websurfaces";
import MovieCard from "./vr/MovieCard";
import DetailModal from "./vr/DetailModal";
import TrailerModal from "./vr/TrailerModal";
import ExitSign from "./vr/ExitSign";
import Seat from "./vr/Seat";
import PopcornStand from "./vr/PopcornStand";
import { NavigationArrows } from "./vr/NavigationArrows";
import AnalysisPoster from "./vr/AnalysisPoster.tsx";
import RelevancePoster from "./vr/RelevancePoster";
import { Recommendation } from "@/container/recommendations/movies_series/moviesSeriesRecommendations-types.ts";
import {
  downloadMultipleTrailers,
  handleBookmarkClick
} from "@/container/recommendations/movies_series/helper_functions.ts";
import GoodTiming from "@/assets/fonts/GoodTiming.ttf";
import { translate } from "@/container/helper_functions_common";
import ProjectorHousing from "@/container/recommendations/movies_series/Components/vr/ProjectorHousing.tsx";
import BookmarkModal from "@/container/recommendations/movies_series/Components/vr/BookmarkModal.tsx";
import Doors from "@/container/recommendations/movies_series/Components/vr/Doors.tsx";

export const VRRecommendationsList: FC<{
  recommendationList: Recommendation[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>;
  bookmarkedMovies: { [key: string]: Recommendation };
  recommendationsAnalysis?: {
    relevantCount: number;
    totalCount: number;
    precisionPercentage: number;
    relevantRecommendations: any[];
  };
}> = ({
  recommendationList,
  currentIndex,
  setCurrentIndex,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  bookmarkedMovies,
  recommendationsAnalysis
}) => {
  const trailersDownloadedRef = useRef(false);
  const translationCacheRef = useRef<
    Map<string, { desc: string; plot: string }>
  >(new Map());

  const [showPopup, setShowPopup] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [detailModalType, setDetailModalType] = useState<
    "description" | "plot" | null
  >(null);

  const [translatedDescription, setTranslatedDescription] =
    useState<string>("");
  const [translatedPlot, setTranslatedPlot] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);

  const [trailerUrls, setTrailerUrls] = useState<Record<string, string>>({});
  const [trailerLoadingStatus, setTrailerLoadingStatus] = useState<
    Record<string, "loading" | "success" | "error">
  >({});

  const movie = recommendationList[currentIndex];
  const isBookmarked = !!bookmarkedMovies[movie?.imdbID];

  const currentVideoUrl = trailerUrls[movie?.imdbID] || null;
  const currentTrailerStatus = trailerLoadingStatus[movie?.imdbID];

  // Memoize static scene elements
  const seatRows = useMemo(
    () => [
      { position: "0 0 2", yOffset: 0.5 },
      { position: "0 0.1 4", yOffset: 0.5 },
      { position: "0 0.2 6", yOffset: 0.5 },
      { position: "0 0.3 8", yOffset: 0.5 },
      { position: "0 0.4 10", yOffset: 0.5 },
      { position: "0 0.5 12", yOffset: 0.5 }
    ],
    []
  );

  // Memoize platform rows to prevent recreation
  const platformRows = useMemo(
    () => [
      { z: 2, y: 0.025, height: 0.05, planeY: 0.051 },
      { z: 4, y: 0.075, height: 0.15, planeY: 0.151 },
      { z: 6, y: 0.125, height: 0.25, planeY: 0.251 },
      { z: 8, y: 0.175, height: 0.35, planeY: 0.351 },
      { z: 10, y: 0.225, height: 0.45, planeY: 0.451 },
      { z: 12, y: 0.275, height: 0.55, planeY: 0.551 }
    ],
    []
  );

  // Memoize light positions
  const floorLights = useMemo(
    () => [
      { position: "-6 0.3 0" },
      { position: "6 0.3 0" },
      { position: "-6 0.3 6" },
      { position: "6 0.3 6" },
      { position: "-6 0.3 12" },
      { position: "6 0.3 12" }
    ],
    []
  );

  if (!recommendationList.length) {
    return (
      <ErrorCard
        message={`Няма налични препоръки :(\nМоля, опитайте отново. 🔄`}
        mt={10}
      />
    );
  }

  // Download trailers once
  useEffect(() => {
    if (trailersDownloadedRef.current || recommendationList.length === 0) {
      return;
    }

    const downloadInitialTrailers = async () => {
      trailersDownloadedRef.current = true;

      const initialLoadingStatus: Record<string, "loading"> = {};
      recommendationList.forEach((rec) => {
        if (rec.youtubeTrailerUrl) {
          initialLoadingStatus[rec.imdbID] = "loading";
        }
      });
      setTrailerLoadingStatus(initialLoadingStatus);

      await downloadMultipleTrailers(
        recommendationList,
        (imdbID, videoUrl, isError) => {
          setTrailerUrls((prev) => ({
            ...prev,
            [imdbID]: videoUrl
          }));
          setTrailerLoadingStatus((prev) => ({
            ...prev,
            [imdbID]: isError ? "error" : "success"
          }));
        }
      );
    };

    downloadInitialTrailers();
  }, [recommendationList]);

  // Translation with caching
  useEffect(() => {
    if (!movie) return;

    const translateContent = async () => {
      const cacheKey = movie.imdbID;
      const cached = translationCacheRef.current.get(cacheKey);

      if (cached) {
        setTranslatedDescription(cached.desc);
        setTranslatedPlot(cached.plot);
        setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      try {
        const [desc, plt] = await Promise.all([
          translate(movie.description, "bg", "en"),
          translate(movie.plot, "bg", "en")
        ]);

        translationCacheRef.current.set(cacheKey, { desc, plot: plt });
        setTranslatedDescription(desc);
        setTranslatedPlot(plt);
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedDescription(movie.description);
        setTranslatedPlot(movie.plot);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [movie?.imdbID]); // Only depend on ID, not entire object

  // Memoize event handlers
  const handleShowDetail = useCallback((type: "description" | "plot") => {
    setDetailModalType(type);
    setShowDetailModal(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setDetailModalType(null);
  }, []);

  const handleShowTrailer = useCallback(() => {
    setShowTrailerModal(true);
  }, []);

  const handleCloseTrailerModal = useCallback((quickClose: boolean) => {
    setShowTrailerModal(false);
    if (!quickClose) {
      setIsTrailerPlaying(false);
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === recommendationList.length - 1 ? 0 : prevIndex + 1
    );
    setShowDetailModal(false);
    setShowTrailerModal(false);
    setIsTrailerPlaying(false);
  }, [recommendationList.length, setCurrentIndex]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recommendationList.length - 1 : prevIndex - 1
    );
    setShowDetailModal(false);
    setShowTrailerModal(false);
    setIsTrailerPlaying(false);
  }, [recommendationList.length, setCurrentIndex]);

  const handleBookmark = useCallback(() => {
    handleBookmarkClick(
      movie,
      setBookmarkedMovies,
      setCurrentBookmarkStatus,
      setShowPopup
    );
  }, [movie, setBookmarkedMovies, setCurrentBookmarkStatus]);

  return (
    <a-scene
      webxr="optionalFeatures: local-floor, bounded-floor, hand-tracking"
      vr-mode-ui="enabled: false"
      renderer="antialias: true; colorManagement: true; physicallyCorrectLights: true"
      embedded
      fog="type: linear; color: #0a0a15; near: 10; far: 40"
    >
      <a-camera position="0 1.6 5"></a-camera>
      <a-entity cursor="rayOrigin:mouse"></a-entity>

      <a-entity
        laser-controls="hand: right"
        raycaster="objects: .clickable"
        super-hands
      ></a-entity>
      <a-entity
        laser-controls="hand: left"
        raycaster="objects: .clickable"
        super-hands
      ></a-entity>

      <a-assets>
        <a-asset-item id="good-timing-font" src={GoodTiming}></a-asset-item>
      </a-assets>

      <a-sky color="#0a0a15" />

      {showPopup && (
        <BookmarkModal
          isVisible={showPopup}
          setIsVisible={setShowPopup}
          isBookmarked={isBookmarked}
        />
      )}

      <DetailModal
        isVisible={showDetailModal}
        contentType={detailModalType}
        description={isTranslating ? "Translating..." : translatedDescription}
        plot={isTranslating ? "Translating..." : translatedPlot}
        onClose={handleCloseDetailModal}
      />

      <TrailerModal
        isVisible={showTrailerModal}
        isTrailerPlaying={isTrailerPlaying}
        setIsTrailerPlaying={setIsTrailerPlaying}
        onClose={handleCloseTrailerModal}
        position="0 5 -8"
        videoUrl={currentVideoUrl || undefined}
      />

      {/* FLOOR */}
      <a-entity>
        <a-plane
          rotation="-90 0 0"
          width="50"
          height="50"
          color="#1a0a0a"
          material="roughness: 0.95; metalness: 0.05"
          position="0 0 0"
        />
        <a-plane
          rotation="-90 0 0"
          width="46"
          height="46"
          color="#4a1515"
          material="roughness: 0.98; opacity: 0.6"
          position="0 0.01 0"
        />

        {/* SEAT ROWS PLATFORMS */}
        {platformRows.map((row, idx) => (
          <a-entity key={`platform-${idx}`}>
            <a-box
              position={`0 ${row.y} ${row.z}`}
              width="10"
              height={`${row.height}`}
              depth="1.5"
              color="#2a1010"
              material="roughness: 0.95"
            />
            <a-plane
              rotation="-90 0 0"
              width="9.5"
              height="1.4"
              color="#4a1515"
              material="roughness: 0.98; opacity: 0.8"
              position={`0 ${row.planeY} ${row.z}`}
            />
          </a-entity>
        ))}

        {/* CARPETS */}
        <a-plane
          rotation="-90 0 0"
          width="1.8"
          height="14"
          color="#8b2020"
          material="roughness: 0.9"
          position="-6 0.03 6"
        />
        <a-plane
          rotation="-90 0 0"
          width="1.8"
          height="14"
          color="#8b2020"
          material="roughness: 0.9"
          position="6 0.03 6"
        />
        <a-plane
          rotation="-90 -90 0"
          width="1.8"
          height="12"
          color="#8b2020"
          material="roughness: 0.9"
          position="0 0.02 -0.1"
        />

        {/* CARPET LIGHT STRIPS */}
        <a-box
          position="-5.1 0.03 6.9"
          width="0.08"
          height="0.02"
          depth="12.2"
          color="#ff6b35"
          material="emissive: #ff6b35; emissiveIntensity: 0.6; roughness: 0.3"
        />
        <a-box
          position="5.1 0.03 6.9"
          width="0.08"
          height="0.02"
          depth="12.2"
          color="#ff6b35"
          material="emissive: #ff6b35; emissiveIntensity: 0.6; roughness: 0.3"
        />

        {/* FLOOR LIGHTING */}
        {floorLights.map((light, idx) => (
          <a-light
            key={`floor-light-${idx}`}
            type="point"
            position={light.position}
            color="#ff4d1a"
            intensity="1.8"
            distance="35"
            decay="2"
          />
        ))}

        {/* SEAT ROWS */}
        {seatRows.map((row, rowIndex) => (
          <a-entity key={`row-${rowIndex}`} position={row.position}>
            {Array.from({ length: 8 }, (_, i) => (
              <Seat
                key={`seat-${rowIndex}-${i}`}
                position={`${(i - 3.5) * 1.2} ${row.yOffset} 0`}
                rowIndex={rowIndex}
              />
            ))}
          </a-entity>
        ))}
      </a-entity>

      {/* WALL BEHIND MOVIE CARD */}
      <a-entity>
        <a-plane
          position="0 3 -12"
          width="16"
          height="20"
          color="#0a0a0a"
          material="shader: flat; emissive: #1a1a2e; emissiveIntensity: 0.3"
        />
        <a-box
          position="0 3 -11.9"
          width="21"
          height="18"
          depth="0.3"
          color="#3d2817"
          material="metalness: 0.4; roughness: 0.6; emissive: #1a0f08; emissiveIntensity: 0.1"
        />
        <a-plane
          position="-10 5 -11.5"
          rotation="0 45 0"
          width="1.2"
          height="16"
          color="#6b1a1a"
          material="roughness: 0.8; metalness: 0.1"
        />
        <a-plane
          position="10 5 -11.5"
          rotation="0 335 0"
          width="1.2"
          height="16"
          color="#6b1a1a"
          material="roughness: 0.8; metalness: 0.1"
        />
      </a-entity>

      {!showTrailerModal && (
        <>
          <MovieCard
            position="0 2.5 -8"
            handleBookmarkClick={handleBookmark}
            recommendation={movie}
            isBookmarked={isBookmarked}
            onShowDetail={handleShowDetail}
            onShowTrailer={handleShowTrailer}
            trailerStatus={currentTrailerStatus}
          />
          <NavigationArrows
            currentIndex={currentIndex}
            totalCount={recommendationList.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </>
      )}

      {/* WALL LEFT */}
      <a-entity>
        <a-plane
          position="-10 4 -5"
          rotation="0 90 0"
          width="60"
          height="16"
          color="#1a0f0a"
          material="roughness: 0.95; metalness: 0.05"
        />
        <a-box
          position="-9.9 10.5 -5"
          rotation="0 90 0"
          width="60"
          height="0.3"
          depth="0.2"
          color="#3d2817"
          material="metalness: 0.3; roughness: 0.6"
        />
        <a-box
          position="-9.9 6.5 -5"
          rotation="0 90 0"
          width="60"
          height="0.3"
          depth="0.2"
          color="#3d2817"
          material="metalness: 0.3; roughness: 0.6"
        />
      </a-entity>

      {/* WALL RIGHT */}
      <a-entity>
        <a-plane
          position="10 4 -5"
          rotation="0 -90 0"
          width="60"
          height="16"
          color="#1a0f0a"
          material="roughness: 0.95; metalness: 0.05"
        />
        <a-box
          position="9.9 10.5 -5"
          rotation="0 -90 0"
          width="60"
          height="0.3"
          depth="0.2"
          color="#3d2817"
          material="metalness: 0.3; roughness: 0.6"
        />
        <a-box
          position="9.9 6.5 -5"
          rotation="0 -90 0"
          width="60"
          height="0.3"
          depth="0.2"
          color="#3d2817"
          material="metalness: 0.3; roughness: 0.6"
        />
      </a-entity>

      <ExitSign position="-6 4 12" />
      <ExitSign position="6 4 12" />

      <Doors position="6 0.15 13.65" rotation="0 180 0" />
      <Doors position="-6 0.15 13.65" rotation="0 180 0" />

      {/* BACK WALL */}
      <a-entity>
        <a-box
          position="0 10 11"
          rotation="-20 0 0"
          width="21"
          height="7.15"
          depth="1"
          color="#3d2817"
          material="metalness: 0.4; roughness: 0.6; emissive: #1a0f08; emissiveIntensity: 0.1"
        />
        <a-box
          position="0 8 13"
          width="21"
          height="7.15"
          depth="2.5"
          color="#3d2817"
          material="metalness: 0.4; roughness: 0.6; emissive: #1a0f08; emissiveIntensity: 0.1"
        />
        <a-plane
          position="0 3 14"
          width="16"
          height="20"
          color="#0a0a0a"
          material="shader: flat; emissive: #1a1a2e; emissiveIntensity: 0.3"
        />
        <a-box
          position="0 3 13.9"
          width="21"
          height="18"
          depth="0.3"
          color="#3d2817"
          material="metalness: 0.4; roughness: 0.6; emissive: #1a0f08; emissiveIntensity: 0.1"
        />
        <a-plane
          position="-10 5 13.5"
          rotation="0 45 0"
          width="1.2"
          height="16"
          color="#6b1a1a"
          material="roughness: 0.8; metalness: 0.1"
        />
        <a-plane
          position="10 5 13.5"
          rotation="0 335 0"
          width="1.2"
          height="16"
          color="#6b1a1a"
          material="roughness: 0.8; metalness: 0.1"
        />
      </a-entity>

      {/* COLUMN LEFT */}
      <a-entity>
        <a-cylinder
          position="-8 4 -2"
          radius="0.6"
          height="12"
          color="#3d2817"
          material="metalness: 0.3; roughness: 0.7"
        />
        <a-cylinder
          position="-8 0.3 -2"
          radius="0.8"
          height="0.6"
          color="#2d1810"
          material="metalness: 0.4; roughness: 0.6"
        />
        <a-cylinder
          position="-8 11.7 -2"
          radius="0.8"
          height="0.6"
          color="#2d1810"
          material="metalness: 0.4; roughness: 0.6"
        />
      </a-entity>

      {/* COLUMN RIGHT */}
      <a-entity>
        <a-cylinder
          position="8 4 -2"
          radius="0.6"
          height="12"
          color="#3d2817"
          material="metalness: 0.3; roughness: 0.7"
        />
        <a-cylinder
          position="8 0.3 -2"
          radius="0.8"
          height="0.6"
          color="#2d1810"
          material="metalness: 0.4; roughness: 0.6"
        />
        <a-cylinder
          position="8 11.7 -2"
          radius="0.8"
          height="0.6"
          color="#2d1810"
          material="metalness: 0.4; roughness: 0.6"
        />
      </a-entity>

      {/* ANALYSIS POSTERS */}
      {recommendationsAnalysis &&
        (() => {
          const avgRelevance =
            recommendationsAnalysis.relevantRecommendations.length > 0
              ? (
                  recommendationsAnalysis.relevantRecommendations.reduce(
                    (acc: number, rec: any) => acc + rec.relevanceScore,
                    0
                  ) / recommendationsAnalysis.relevantRecommendations.length
                ).toFixed(2)
              : "0.00";

          // Convert precisionPercentage to string if it's a number
          const precisionStr =
            typeof recommendationsAnalysis.precisionPercentage === "number"
              ? recommendationsAnalysis.precisionPercentage.toFixed(2)
              : recommendationsAnalysis.precisionPercentage;

          // Find current recommendation's analysis data
          const currentRecommendationAnalysis =
            recommendationsAnalysis.relevantRecommendations.find(
              (rec: any) => rec.imdbID === movie.imdbID
            );

          return (
            <>
              {/* Left wall - Overall Analysis Poster */}
              <AnalysisPoster
                position="-9.85 3.5 2"
                rotation="0 90 0"
                relevantCount={recommendationsAnalysis.relevantCount}
                totalCount={recommendationsAnalysis.totalCount}
                precisionPercentage={precisionStr}
                averageRelevance={avgRelevance}
              />

              {/* Right wall - Current Recommendation Relevance Poster */}
              {currentRecommendationAnalysis && (
                <RelevancePoster
                  position="9.85 3.5 2"
                  rotation="0 -90 0"
                  recommendation={currentRecommendationAnalysis}
                />
              )}
            </>
          );
        })()}

      {/* LIGHTING */}
      <a-light type="ambient" color="#0f0f1a" intensity="0.7" />

      <a-light
        type="spot"
        position="-5 7 0"
        color="#ffd699"
        intensity="1.2"
        angle="40"
        penumbra="0.3"
        target="#moviecard"
      />
      <a-light
        type="spot"
        position="5 7 0"
        color="#ffd699"
        intensity="1.2"
        angle="40"
        penumbra="0.3"
        target="#moviecard"
      />

      <PopcornStand position="-8 0 6" rotation="0 90 0" />
      <PopcornStand position="8 0 6" rotation="0 270 0" />

      {/* ROOF */}
      <a-entity>
        <a-plane
          rotation="90 0 0"
          width="30"
          height="60"
          color="#0a0a0a"
          material="roughness: 0.9; side: double"
          position="0 11 -5"
        />
        <a-cylinder
          position="-5 10.9 -5"
          radius="0.5"
          height="0.4"
          color="#2a2a2a"
          material="emissive: #ffcc99; emissiveIntensity: 0.4"
        />
        <a-cylinder
          position="5 10.9 -5"
          radius="0.5"
          height="0.4"
          color="#2a2a2a"
          material="emissive: #ffcc99; emissiveIntensity: 0.4"
        />
        <a-cylinder
          position="0 10.9 0"
          radius="0.5"
          height="0.4"
          color="#2a2a2a"
          material="emissive: #ffcc99; emissiveIntensity: 0.4"
        />
        <ProjectorHousing position="0 6.05 4" rotation="-15 0 0" />
      </a-entity>
    </a-scene>
  );
};
