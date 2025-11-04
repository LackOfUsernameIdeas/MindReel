import {FC, useEffect, useMemo, useRef, useState} from "react";
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
import {NavigationArrows} from "./vr/NavigationArrows";
import {Recommendation} from "@/container/recommendations/movies_series/moviesSeriesRecommendations-types.ts";
import {
    downloadMultipleTrailers,
    handleBookmarkClick
} from "@/container/recommendations/movies_series/helper_functions.ts";
import GoodTiming from "@/assets/fonts/GoodTiming.ttf";
import {translate} from "@/container/helper_functions_common";
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
}> = ({
          recommendationList,
          currentIndex,
          setCurrentIndex,
          setBookmarkedMovies,
          setCurrentBookmarkStatus,
          bookmarkedMovies
      }) => {
    // A ref to track if trailers have been downloaded
    const trailersDownloadedRef = useRef(false);

    const [showPopup, setShowPopup] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
    const [detailModalType, setDetailModalType] = useState<
        "description" | "plot" | null
    >(null);

    // Translation states
    const [translatedDescription, setTranslatedDescription] =
        useState<string>("");
    const [translatedPlot, setTranslatedPlot] = useState<string>("");
    const [isTranslating, setIsTranslating] = useState(false);

    // State for downloaded trailer URLs mapped to imdbID
    const [trailerUrls, setTrailerUrls] = useState<Record<string, string>>({});

    // State for tracking loading status of trailers
    const [trailerLoadingStatus, setTrailerLoadingStatus] = useState<
        Record<string, "loading" | "success" | "error">
    >({});

    const movie = recommendationList[currentIndex];
    const isBookmarked = !!bookmarkedMovies[movie.imdbID];

    // Get the video URL for current movie
    const currentVideoUrl = trailerUrls[movie.imdbID] || null;

    // Get the trailer status for current movie
    const currentTrailerStatus = trailerLoadingStatus[movie.imdbID];

    // Memoize seat rows to prevent recreation
    const seatRows = useMemo(
        () => [
            {position: "0 0 2", yOffset: 0.5},
            {position: "0 0.1 4", yOffset: 0.5},
            {position: "0 0.2 6", yOffset: 0.5},
            {position: "0 0.3 8", yOffset: 0.5},
            {position: "0 0.4 10", yOffset: 0.5},
            {position: "0 0.5 12", yOffset: 0.5},
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

    // Download trailers for all of the recommendations
    useEffect(() => {
        // Skip if already downloaded during this session
        if (trailersDownloadedRef.current) {
            return;
        }

        const downloadInitialTrailers = async () => {
            // Mark as downloaded at the start
            trailersDownloadedRef.current = true;

            // Mark all as loading initially
            const initialLoadingStatus: Record<string, "loading"> = {};
            recommendationList.forEach((rec) => {
                if (rec.youtubeTrailerUrl) {
                    initialLoadingStatus[rec.imdbID] = "loading";
                }
            });
            setTrailerLoadingStatus(initialLoadingStatus);

            await downloadMultipleTrailers(
                recommendationList,
                // Callback fires immediately when each trailer is ready
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

        if (recommendationList.length > 0) {
            downloadInitialTrailers();
        }
    }, [recommendationList]);

    // Translate description and plot when movie changes
    useEffect(() => {
        const translateContent = async () => {
            if (movie) {
                setIsTranslating(true);
                try {
                    const [desc, plt] = await Promise.all([
                        translate(movie.description, "bg", "en"),
                        translate(movie.plot, "bg", "en")
                    ]);
                    setTranslatedDescription(desc);
                    setTranslatedPlot(plt);
                } catch (error) {
                    console.error("Translation error:", error);
                    // Fallback to original text
                    setTranslatedDescription(movie.description);
                    setTranslatedPlot(movie.plot);
                } finally {
                    setIsTranslating(false);
                }
            }
        };

        translateContent();
    }, [movie]);

    const handleShowDetail = (type: "description" | "plot") => {
        setDetailModalType(type);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setDetailModalType(null);
    };

    const handleShowTrailer = () => {
        setShowTrailerModal(true);
    };

    const handleCloseTrailerModal = (quickClose: boolean) => {
        setShowTrailerModal(false);
        !quickClose && setIsTrailerPlaying(false);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === recommendationList.length - 1 ? 0 : prevIndex + 1
        );
        setShowDetailModal(false);
        setShowTrailerModal(false);
        setIsTrailerPlaying(false);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? recommendationList.length - 1 : prevIndex - 1
        );
        setShowDetailModal(false);
        setShowTrailerModal(false);
        setIsTrailerPlaying(false);
    };

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

            <a-sky color="#0a0a15"/>

            {showPopup && (
                <BookmarkModal isVisible={showPopup} setIsVisible={setShowPopup} isBookmarked={isBookmarked}/>
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
                ></a-plane>

                <a-plane
                    rotation="-90 0 0"
                    width="46"
                    height="46"
                    color="#4a1515"
                    material="roughness: 0.98; opacity: 0.6"
                    position="0 0.01 0"
                ></a-plane>

                <a-plane
                    rotation="-90 0 0"
                    width="2"
                    height="60"
                    color="#8b2020"
                    material="roughness: 0.9"
                    position="-6 0.02 -2"
                ></a-plane>
                <a-plane
                    rotation="-90 0 0"
                    width="2"
                    height="60"
                    color="#8b2020"
                    material="roughness: 0.9"
                    position="6 0.02 -2"
                ></a-plane>
            </a-entity>

            {/* WALL BEHIND MOVIE CARD */}
            <a-entity>
                <a-plane
                    position="0 3 -12"
                    width="16"
                    height="20"
                    color="#0a0a0a"
                    material="shader: flat; emissive: #1a1a2e; emissiveIntensity: 0.3"
                ></a-plane>
                <a-box
                    position="0 3 -11.9"
                    width="21"
                    height="18"
                    depth="0.3"
                    color="#3d2817"
                    material="metalness: 0.4; roughness: 0.6; emissive: #1a0f08; emissiveIntensity: 0.1"
                ></a-box>
                <a-plane
                    position="-10 5 -11.5"
                    rotation="0 45 0"
                    width="1.2"
                    height="16"
                    color="#6b1a1a"
                    material="roughness: 0.8; metalness: 0.1"
                ></a-plane>
                <a-plane
                    position="10 5 -11.5"
                    rotation="0 335 0"
                    width="1.2"
                    height="16"
                    color="#6b1a1a"
                    material="roughness: 0.8; metalness: 0.1"
                ></a-plane>
            </a-entity>

            {!showTrailerModal && (
                <>
                    <MovieCard
                        position="0 2.5 -8"
                        handleBookmarkClick={() =>
                            handleBookmarkClick(
                                movie,
                                setBookmarkedMovies,
                                setCurrentBookmarkStatus,
                                setShowPopup
                            )
                        }
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

            {/* Optimized seat rows with LOD */}
            {seatRows.map((row, rowIndex) => (
                <a-entity key={`row-${rowIndex}`} position={row.position}>
                    {Array.from({length: 8}, (_, i) => (
                        <Seat
                            key={`seat-${rowIndex}-${i}`}
                            position={`${(i - 3.5) * 1.2} ${row.yOffset} 0`}
                            rowIndex={rowIndex}
                        />
                    ))}
                </a-entity>
            ))}

            {/* WALL LEFT */}
            <a-entity>
                <a-plane
                    position="-10 4 -5"
                    rotation="0 90 0"
                    width="60"
                    height="16"
                    color="#1a0f0a"
                    material="roughness: 0.95; metalness: 0.05"
                ></a-plane>

                <a-box
                    position="-9.9 10.5 -5"
                    rotation="0 90 0"
                    width="60"
                    height="0.3"
                    depth="0.2"
                    color="#3d2817"
                    material="metalness: 0.3; roughness: 0.6"
                ></a-box>
                <a-box
                    position="-9.9 6.5 -5"
                    rotation="0 90 0"
                    width="60"
                    height="0.3"
                    depth="0.2"
                    color="#3d2817"
                    material="metalness: 0.3; roughness: 0.6"
                ></a-box>
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
                ></a-plane>

                <a-box
                    position="9.9 10.5 -5"
                    rotation="0 -90 0"
                    width="60"
                    height="0.3"
                    depth="0.2"
                    color="#3d2817"
                    material="metalness: 0.3; roughness: 0.6"
                ></a-box>
                <a-box
                    position="9.9 6.5 -5"
                    rotation="0 -90 0"
                    width="60"
                    height="0.3"
                    depth="0.2"
                    color="#3d2817"
                    material="metalness: 0.3; roughness: 0.6"
                ></a-box>
            </a-entity>

            <ExitSign position="-6 4 12"/>
            <ExitSign position="6 4 12"/>

            <Doors position="6 0.15 13.65" rotation="0 180 0"/>
            <Doors position="-6 0.15 13.65" rotation="0 180 0"/>

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
                ></a-box>
                <a-box
                    position="0 8 13"
                    width="21"
                    height="7.15"
                    depth="2.5"
                    color="#3d2817"
                    material="metalness: 0.4; roughness: 0.6; emissive: #1a0f08; emissiveIntensity: 0.1"
                ></a-box>
                <a-plane
                    position="0 3 14"
                    width="16"
                    height="20"
                    color="#0a0a0a"
                    material="shader: flat; emissive: #1a1a2e; emissiveIntensity: 0.3"
                ></a-plane>
                <a-box
                    position="0 3 13.9"
                    width="21"
                    height="18"
                    depth="0.3"
                    color="#3d2817"
                    material="metalness: 0.4; roughness: 0.6; emissive: #1a0f08; emissiveIntensity: 0.1"
                ></a-box>
                <a-plane
                    position="-10 5 13.5"
                    rotation="0 45 0"
                    width="1.2"
                    height="16"
                    color="#6b1a1a"
                    material="roughness: 0.8; metalness: 0.1"
                ></a-plane>
                <a-plane
                    position="10 5 13.5"
                    rotation="0 335 0"
                    width="1.2"
                    height="16"
                    color="#6b1a1a"
                    material="roughness: 0.8; metalness: 0.1"
                ></a-plane>
            </a-entity>

            {/* COLUMN LEFT */}
            <a-entity>
                <a-cylinder
                    position="-8 4 -2"
                    radius="0.6"
                    height="12"
                    color="#3d2817"
                    material="metalness: 0.3; roughness: 0.7"
                ></a-cylinder>
                {/* base */}
                <a-cylinder
                    position="-8 0.3 -2"
                    radius="0.8"
                    height="0.6"
                    color="#2d1810"
                    material="metalness: 0.4; roughness: 0.6"
                ></a-cylinder>
                {/* top */}
                <a-cylinder
                    position="-8 11.7 -2"
                    radius="0.8"
                    height="0.6"
                    color="#2d1810"
                    material="metalness: 0.4; roughness: 0.6"
                ></a-cylinder>
            </a-entity>

            {/* COLUMN RIGHT */}
            <a-entity>
                <a-cylinder
                    position="8 4 -2"
                    radius="0.6"
                    height="12"
                    color="#3d2817"
                    material="metalness: 0.3; roughness: 0.7"
                ></a-cylinder>
                <a-cylinder
                    position="8 0.3 -2"
                    radius="0.8"
                    height="0.6"
                    color="#2d1810"
                    material="metalness: 0.4; roughness: 0.6"
                ></a-cylinder>
                <a-cylinder
                    position="8 11.7 -2"
                    radius="0.8"
                    height="0.6"
                    color="#2d1810"
                    material="metalness: 0.4; roughness: 0.6"
                ></a-cylinder>
            </a-entity>

            {/* LIGHTING */}
            <a-light type="ambient" color="#0f0f1a" intensity="0.7"></a-light>

            {/* Movie card spotlights */}
            <a-light
                type="spot"
                position="-5 7 0"
                color="#ffd699"
                intensity="1.2"
                angle="40"
                penumbra="0.3"
                target="#moviecard"
            ></a-light>
            <a-light
                type="spot"
                position="5 7 0"
                color="#ffd699"
                intensity="1.2"
                angle="40"
                penumbra="0.3"
                target="#moviecard"
            ></a-light>

            {/* Floor lighting */}
            <a-light
                type="point"
                position="-6 0.3 4"
                color="#ff4d1a"
                intensity="1.8"
                distance="35"
                decay="2"
            ></a-light>
            <a-light
                type="point"
                position="6 0.3 4"
                color="#ff4d1a"
                intensity="1.8"
                distance="35"
                decay="2"
            ></a-light>
            <a-light
                type="point"
                position="-6 0.3 12"
                color="#ff4d1a"
                intensity="1.8"
                distance="35"
                decay="2"
            ></a-light>
            <a-light
                type="point"
                position="6 0.3 12"
                color="#ff4d1a"
                intensity="1.8"
                distance="35"
                decay="2"
            ></a-light>

            {/* Wall accent lights */}
            <a-light
                type="point"
                position="-12 3 -5"
                color="#ffb366"
                intensity="0.8"
                distance="6"
            ></a-light>
            <a-light
                type="point"
                position="12 3 -5"
                color="#ffb366"
                intensity="0.8"
                distance="6"
            ></a-light>

            <PopcornStand position="-8 0 6" rotation="0 90 0"/>
            <PopcornStand position="8 0 6" rotation="0 270 0"/>

            {/* ROOF */}
            <a-entity>
                <a-plane
                    rotation="90 0 0"
                    width="30"
                    height="60"
                    color="#0a0a0a"
                    material="roughness: 0.9; side: double"
                    position="0 11 -5"
                ></a-plane>

                <a-cylinder
                    position="-5 10.9 -5"
                    radius="0.5"
                    height="0.4"
                    color="#2a2a2a"
                    material="emissive: #ffcc99; emissiveIntensity: 0.4"
                ></a-cylinder>
                <a-cylinder
                    position="5 10.9 -5"
                    radius="0.5"
                    height="0.4"
                    color="#2a2a2a"
                    material="emissive: #ffcc99; emissiveIntensity: 0.4"
                ></a-cylinder>
                <a-cylinder
                    position="0 10.9 0"
                    radius="0.5"
                    height="0.4"
                    color="#2a2a2a"
                    material="emissive: #ffcc99; emissiveIntensity: 0.4"
                ></a-cylinder>

                <ProjectorHousing position="0 6.05 4" rotation="-15 0 0"/>
            </a-entity>
        </a-scene>
    );
};
