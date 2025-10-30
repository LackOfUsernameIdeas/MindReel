import { FC, useEffect, useRef, useState } from "react";
import ErrorCard from "../../../../components/common/error/error";
import "aframe";
import "aframe-extras";
import "aframe-physics-system";
import "aframe-websurfaces";
import MovieCard from "./vr/MovieCard";
import DetailModal from "./vr/DetailModal";
import TrailerModal from "./vr/TrailerModal";
import Projector from "./vr/Projector";
import ExitSign from "./vr/ExitSign";
import Seat from "./vr/Seat";
import PopcornStand from "./vr/PopcornStand";
import { Recommendation } from "@/container/recommendations/movies_series/moviesSeriesRecommendations-types.ts";
import { handleBookmarkClick } from "@/container/recommendations/movies_series/helper_functions.ts";

export const VRRecommendationsList: FC<{
  recommendationList: Recommendation[];
  currentIndex: number;
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
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  bookmarkedMovies
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<HTMLElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupOpacity, setPopupOpacity] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const [detailModalType, setDetailModalType] = useState<
    "description" | "plot" | null
  >(null);
  const movie = recommendationList[currentIndex];
  const isBookmarked = !!bookmarkedMovies[movie.imdbID];

  // Track VR mode state
  useEffect(() => {
    const handleEnterVR = () => setIsInVR(true);
    const handleExitVR = () => setIsInVR(false);

    const sceneEl = sceneRef.current;
    if (sceneEl) {
      sceneEl.addEventListener("enter-vr", handleEnterVR);
      sceneEl.addEventListener("exit-vr", handleExitVR);

      return () => {
        sceneEl.removeEventListener("enter-vr", handleEnterVR);
        sceneEl.removeEventListener("exit-vr", handleExitVR);
      };
    }
  }, []);

  if (!recommendationList.length) {
    return (
      <ErrorCard
        message={`Няма налични препоръки :(\nМоля, опитайте отново. 🔄`}
        mt={10}
      />
    );
  }

  useEffect(() => {
    if (showPopup) {
      setPopupOpacity(1);
      const timer = setTimeout(() => {
        setPopupOpacity(0);
        setTimeout(() => setShowPopup(false), 500);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handlePopupDismiss = () => {
    setPopupOpacity(0);
    setTimeout(() => setShowPopup(false), 500);
  };

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

  const handleCloseTrailerModal = () => {
    setShowTrailerModal(false);
  };

  const infoIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
  `)}`;

  const closeIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="white">
      <path d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 1.96663 15.3623 1.68594 15.3599C1.40526 15.3574 1.13677 15.2449 0.938279 15.046C0.739807 14.8474 0.627232 14.5787 0.624791 14.2977C0.62235 14.0168 0.730236 13.7462 0.92524 13.5441L6.59144 7.87312L0.92524 2.20206C0.724562 2.00115 0.611816 1.72867 0.611816 1.44457C0.611816 1.16047 0.724562 0.887983 0.92524 0.687069Z"/>
    </svg>
  `)}`;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <a-scene
        ref={sceneRef}
        webxr="optionalFeatures: local-floor, bounded-floor, hand-tracking"
        vr-mode-ui="enabled: false"
        renderer="antialias: true; colorManagement: true; physicallyCorrectLights: true"
        embedded
        fog="type: linear; color: #0a0a15; near: 10; far: 40"
        style={{
          display: isInVR ? "block" : "none",
          position: isInVR ? "fixed" : "relative",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: isInVR ? 9999 : 1
        }}
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
          <video
            id="trailer-video"
            ref={videoRef}
            src="/video.mp4"
            autoPlay
            muted
            playsInline
            crossOrigin="anonymous"
          />
        </a-assets>

        <a-sky color="#0a0a15" />

        {showPopup && (
          <a-entity position="0 8 -6.5">
            <a-plane
              width="8"
              height="1.5"
              color={isBookmarked ? "#10b981" : "#ef4444"}
              material={`shader: flat; opacity: ${popupOpacity}; side: double`}
              position="0 0 0.01"
            ></a-plane>

            <a-plane
              width="8.1"
              height="1.6"
              color="#000000"
              material={`shader: flat; opacity: ${popupOpacity * 0.3}`}
              position="0.05 -0.05 0"
            ></a-plane>

            <a-entity position="-3.5 0 0.02">
              <a-image
                src={infoIconSvg}
                width="0.3"
                height="0.3"
                material={`shader: flat; transparent: true; opacity: ${popupOpacity}`}
                position="0 0 0"
              ></a-image>

              <a-text
                value={
                  isBookmarked ? "Added to watchlist" : "Removed from watchlist"
                }
                position="0.4 0.35 0"
                align="left"
                color="#FFFFFF"
                width="6"
                material={`opacity: ${popupOpacity}`}
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              ></a-text>

              <a-text
                value={`Your movie/series has been ${
                  isBookmarked ? "saved to" : "removed from"
                } your watchlist!`}
                position="0.4 -0.2 0"
                align="left"
                color="#FFFFFF"
                width="5"
                material={`opacity: ${popupOpacity * 0.9}`}
                font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
              ></a-text>
            </a-entity>

            <a-image
              src={closeIconSvg}
              width="0.2"
              height="0.2"
              material={`shader: flat; transparent: true; opacity: ${popupOpacity}`}
              position="3.7 0.4 0.02"
              class="clickable"
              onClick={handlePopupDismiss}
            ></a-image>
          </a-entity>
        )}

        <DetailModal
          isVisible={showDetailModal}
          contentType={detailModalType}
          description="A film about a private detective who uncovers a complex intrigue of fraud and corruption in Los Angeles. Jake Gittes, a private detective, is involved in a case that turns out to be much more complex than it initially appeared, with corruption and intrigue around water rights in 1930s Los Angeles."
          plot="In 1937 Los Angeles, private detective Jake 'J.J.' Gittes is hired in a case of adultery. The current situation leads him to Hollis Mulwray, head of the city's water department, and his wife Evelyn. As Gittes investigates further, he discovers a web of corruption involving water rights, land development, and murder that reaches the highest levels of Los Angeles society."
          onClose={handleCloseDetailModal}
        />

        <TrailerModal
          isVisible={showTrailerModal}
          isTrailerPlaying={isTrailerPlaying}
          setIsTrailerPlaying={setIsTrailerPlaying}
          title="БЪЧ КАСИДИ И СЪНДЪНС КИД"
          onClose={handleCloseTrailerModal}
          position="0 5 -8"
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
            static-body
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
          />
        )}

        <Projector position="0 4 0" rotation="-15 0 0" />

        <a-entity position="0 0 2">
          {Array.from({ length: 8 }, (_, i) => (
            <Seat key={`seat-1-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`} />
          ))}
        </a-entity>

        <a-entity position="0 0.1 4">
          {Array.from({ length: 8 }, (_, i) => (
            <Seat key={`seat-2-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`} />
          ))}
        </a-entity>

        <a-entity position="0 0.2 6">
          {Array.from({ length: 8 }, (_, i) => (
            <Seat key={`seat-3-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`} />
          ))}
        </a-entity>

        <a-entity position="0 0.3 8">
          {Array.from({ length: 8 }, (_, i) => (
            <Seat key={`seat-3-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`} />
          ))}
        </a-entity>

        <a-entity position="0 0.4 10">
          {Array.from({ length: 8 }, (_, i) => (
            <Seat key={`seat-3-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`} />
          ))}
        </a-entity>

        <a-entity position="0 0.5 12">
          {Array.from({ length: 8 }, (_, i) => (
            <Seat key={`seat-3-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`} />
          ))}
        </a-entity>

        <a-entity position="0 0.6 14">
          {Array.from({ length: 8 }, (_, i) => (
            <Seat key={`seat-3-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`} />
          ))}
        </a-entity>

        <a-entity position="0 0.7 16">
          {Array.from({ length: 8 }, (_, i) => (
            <Seat key={`seat-3-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`} />
          ))}
        </a-entity>

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

        {/* BACK WALL */}
        <a-entity>
          <a-plane
            position="0 3 20"
            width="16"
            height="20"
            color="#0a0a0a"
            material="shader: flat; emissive: #1a1a2e; emissiveIntensity: 0.3"
          ></a-plane>
          <a-box
            position="0 3 19.9"
            width="21"
            height="18"
            depth="0.3"
            color="#3d2817"
            material="metalness: 0.4; roughness: 0.6; emissive: #1a0f08; emissiveIntensity: 0.1"
          ></a-box>
          <a-plane
            position="-10 5 19.5"
            rotation="0 45 0"
            width="1.2"
            height="16"
            color="#6b1a1a"
            material="roughness: 0.8; metalness: 0.1"
          ></a-plane>
          <a-plane
            position="10 5 19.5"
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
          <a-cylinder
            position="-8 0.3 -2"
            radius="0.8"
            height="0.6"
            color="#2d1810"
            material="metalness: 0.4; roughness: 0.6"
          ></a-cylinder>
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

        <a-light type="ambient" color="#0f0f1a" intensity="0.7"></a-light>

        {/* movie card spotlights */}
        <a-light
          type="spot"
          position="-5 7 0"
          color="#ffd699"
          intensity="1.2"
          angle="40"
          penumbra="0.3"
          target="#moviecard"
          castShadow="true"
        ></a-light>
        <a-light
          type="spot"
          position="5 7 0"
          color="#ffd699"
          intensity="1.2"
          angle="40"
          penumbra="0.3"
          target="#moviecard"
          castShadow="true"
        ></a-light>

        {/* floor lighting */}
        <a-light
          type="point"
          position="-6 0.3 2"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>
        <a-light
          type="point"
          position="6 0.3 2"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>
        <a-light
          type="point"
          position="-6 0.3 6"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>
        <a-light
          type="point"
          position="6 0.3 10"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>
        <a-light
          type="point"
          position="-6 0.3 10"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>
        <a-light
          type="point"
          position="6 0.3 14"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>
        <a-light
          type="point"
          position="-6 0.3 14"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>
        <a-light
          type="point"
          position="6 0.3 18"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>
        <a-light
          type="point"
          position="-6 0.3 18"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>

        <a-light
          type="point"
          position="6 0.3 6"
          color="#ff4d1a"
          intensity="1.5"
          distance="30"
          decay="2"
        ></a-light>

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

        <ExitSign position="-6 6 12" />
        <ExitSign position="6 6 12" />

        <PopcornStand position="-8 0 10" rotation="0 90 0" />
        <PopcornStand position="8 0 10" rotation="0 90 0" />

        {/* ROOF */}
        <a-entity>
          <a-plane
            rotation="90 0 0"
            width="30"
            height="60"
            color="#0a0a0a"
            material="roughness: 0.9; side: double"
            position="0 12 -5"
          ></a-plane>

          <a-cylinder
            position="-5 11.9 -5"
            radius="0.5"
            height="0.4"
            color="#2a2a2a"
            material="emissive: #ffcc99; emissiveIntensity: 0.4"
          ></a-cylinder>
          <a-cylinder
            position="5 11.9 -5"
            radius="0.5"
            height="0.4"
            color="#2a2a2a"
            material="emissive: #ffcc99; emissiveIntensity: 0.4"
          ></a-cylinder>
          <a-cylinder
            position="0 11.9 0"
            radius="0.5"
            height="0.4"
            color="#2a2a2a"
            material="emissive: #ffcc99; emissiveIntensity: 0.4"
          ></a-cylinder>
        </a-entity>
      </a-scene>
    </div>
  );
};
