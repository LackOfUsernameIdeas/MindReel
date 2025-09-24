import { useState, useEffect } from "react";
import "aframe";
import "aframe-extras";
import "aframe-physics-system";
import "aframe-websurfaces";
import MovieCard from "./MovieCard";
import DetailModal from "./DetailModal";
import TrailerModal from "./TrailerModal";

const TestVr = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupOpacity, setPopupOpacity] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [detailModalType, setDetailModalType] = useState<
    "description" | "plot" | null
  >(null);

  useEffect(() => {
    AFRAME.registerComponent("color-changer", {
      init: function () {
        this.el.addEventListener("raycaster-intersected", () => {
          this.el.setAttribute("material", "color", "#4CAF50");
        });
        this.el.addEventListener("raycaster-intersected-cleared", () => {
          this.el.setAttribute("material", "color", "#F44336");
        });
      }
    });

    const scene = document.querySelector("a-scene");
    scene?.renderer?.xr?.addEventListener("sessionstart", () => {
      console.log("WebXR session started. Hands should now spawn.");
    });
  }, []);

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

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
    setShowPopup(true);
  };

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
    <a-scene
      webxr="optionalFeatures: local-floor, bounded-floor, hand-tracking"
      vr-mode-ui="enabled: true"
      renderer="antialias: true"
      embedded
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

      {/* no actual placeholder rn */}
      <a-sky src="/placeholder.svg?height=2048&width=4096" color="#1a1a2e" />

      {showPopup && (
        <a-entity position="0 8 -6.5">
          <a-plane
            width="8"
            height="1.5"
            color={isBookmarked ? "#22C55E" : "#EF4444"}
            material={`shader: flat; opacity: ${popupOpacity}`}
            position="0 0 0.01"
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
              material={`opacity: ${popupOpacity * 0.8}`}
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
        trailerUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
        onClose={handleCloseTrailerModal}
        position="0 3.5 -2"
      />

      <a-plane
        rotation="-90 0 0"
        width="50"
        height="50"
        color="#8B0000"
        material="roughness: 0.8"
        position="0 0 0"
        static-body
      ></a-plane>

      <a-plane
        rotation="-90 0 0"
        width="48"
        height="48"
        color="#A0522D"
        material="roughness: 0.9; opacity: 0.3"
        position="0 0.01 0"
      ></a-plane>

      {/* to do: make these 5 in a ring, also make them controllable*/}
      <MovieCard
        position="0 2.5 -8"
        handleBookmarkClick={handleBookmarkClick}
        isBookmarked={isBookmarked}
        onShowDetail={handleShowDetail}
        onShowTrailer={handleShowTrailer}
      />

      <a-plane
        position="0 3 -12"
        width="20"
        height="12"
        color="#000000"
        material="shader: flat"
      ></a-plane>

      <a-box
        position="0 3 -12.1"
        width="21"
        height="13"
        depth="0.2"
        color="#8B4513"
        material="metalness: 0.3; roughness: 0.7"
      ></a-box>

      {/* seat rows */}
      <a-entity position="0 0 2">
        {Array.from({ length: 8 }, (_, i) => (
          <a-entity key={`seat-1-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`}>
            <a-box
              width="1"
              height="0.1"
              depth="1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="0 0.4 -0.4"
              width="1"
              height="0.8"
              depth="0.1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="-0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
            <a-box
              position="0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
          </a-entity>
        ))}
      </a-entity>

      <a-entity position="0 0 4">
        {Array.from({ length: 8 }, (_, i) => (
          <a-entity key={`seat-2-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`}>
            <a-box
              width="1"
              height="0.1"
              depth="1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="0 0.4 -0.4"
              width="1"
              height="0.8"
              depth="0.1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="-0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
            <a-box
              position="0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
          </a-entity>
        ))}
      </a-entity>

      <a-entity position="0 0.2 6">
        {Array.from({ length: 8 }, (_, i) => (
          <a-entity key={`seat-3-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`}>
            <a-box
              width="1"
              height="0.1"
              depth="1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="0 0.4 -0.4"
              width="1"
              height="0.8"
              depth="0.1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="-0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
            <a-box
              position="0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
          </a-entity>
        ))}
      </a-entity>

      {/* walls */}
      <a-plane
        position="-15 4 -5"
        rotation="0 90 0"
        width="30"
        height="8"
        color="#2F1B14"
        material="roughness: 0.9"
      ></a-plane>

      <a-plane
        position="15 4 -5"
        rotation="0 -90 0"
        width="30"
        height="8"
        color="#2F1B14"
        material="roughness: 0.9"
      ></a-plane>

      <a-plane
        position="0 4 10"
        width="30"
        height="8"
        color="#2F1B14"
        material="roughness: 0.9"
      ></a-plane>

      {/* columns */}
      <a-cylinder
        position="-8 4 -2"
        radius="0.5"
        height="8"
        color="#8B4513"
        material="metalness: 0.2; roughness: 0.8"
      ></a-cylinder>
      <a-cylinder
        position="8 4 -2"
        radius="0.5"
        height="8"
        color="#8B4513"
        material="metalness: 0.2; roughness: 0.8"
      ></a-cylinder>

      {/* all red lightings, screen, ceiling and floor */}
      <a-light type="ambient" color="#1a1a2e" intensity="0.3"></a-light>

      <a-light
        type="point"
        position="0 4 -10"
        color="#ffffff"
        intensity="1.5"
        distance="15"
      ></a-light>

      <a-light
        type="spot"
        position="-5 7 0"
        color="#ffaa00"
        intensity="0.8"
        angle="45"
        target="#moviecard"
      ></a-light>
      <a-light
        type="spot"
        position="5 7 0"
        color="#ffaa00"
        intensity="0.8"
        angle="45"
        target="#moviecard"
      ></a-light>

      <a-light
        type="point"
        position="-6 0.2 2"
        color="#ff6b35"
        intensity="0.5"
        distance="3"
      ></a-light>
      <a-light
        type="point"
        position="6 0.2 2"
        color="#ff6b35"
        intensity="0.5"
        distance="3"
      ></a-light>
      <a-light
        type="point"
        position="-6 0.2 6"
        color="#ff6b35"
        intensity="0.5"
        distance="3"
      ></a-light>
      <a-light
        type="point"
        position="6 0.2 6"
        color="#ff6b35"
        intensity="0.5"
        distance="3"
      ></a-light>

      {/* deco elements (barely sucessful currently lul)*/}
      <a-text
        position="-12 6 8"
        value="EXIT"
        color="#00ff00"
        align="center"
        width="8"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      ></a-text>
      <a-text
        position="12 6 8"
        value="EXIT"
        color="#00ff00"
        align="center"
        width="8"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      ></a-text>

      <a-plane
        position="-10.5 5 -11.5"
        width="1"
        height="10"
        color="#8B0000"
        material="roughness: 0.9"
      ></a-plane>
      <a-plane
        position="10.5 5 -11.5"
        width="1"
        height="10"
        color="#8B0000"
        material="roughness: 0.9"
      ></a-plane>

      <a-entity position="-10 1 8">
        <a-cylinder
          radius="1"
          height="2"
          color="#FFD700"
          material="metalness: 0.5; roughness: 0.3"
        ></a-cylinder>
        <a-text
          position="0 1.5 0"
          value="POPCORN"
          color="#ff0000"
          align="center"
          width="6"
        ></a-text>
      </a-entity>
    </a-scene>
  );
};

export default TestVr;
