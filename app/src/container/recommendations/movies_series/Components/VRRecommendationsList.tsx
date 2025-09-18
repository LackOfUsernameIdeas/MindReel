import { FC, useState, useEffect } from "react";
import { RecommendationsProps } from "../moviesSeriesRecommendations-types";
import VRRecommendationCard from "./VRRecommendationCard";
import ErrorCard from "../../../../components/common/error/error";
import "aframe";
import "aframe-extras";
import "aframe-physics-system";
import "aframe-websurfaces";

// Add custom A-Frame elements to JSX namespace for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        webxr?: string;
        "vr-mode-ui"?: string;
        renderer?: string;
        embedded?: boolean;
        style?: React.CSSProperties;
      };
      "a-entity": React.ClassAttributes<HTMLElement> &
        React.HTMLAttributes<HTMLElement> & {
          position?: string;
          class?: string;
          cursor?: string;
          "laser-controls"?: string;
          raycaster?: string;
          "super-hands"?: boolean;
          onClick?: React.MouseEventHandler<HTMLElement>;
          draggable?: boolean;
          geometry?: string;
          websurface?: string;
        };
      "a-camera": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        position?: string;
      };
      "a-plane": React.ClassAttributes<HTMLElement> &
        React.HTMLAttributes<HTMLElement> & {
          width?: string | number;
          height?: string | number;
          class?: string;
          color?: string;
          material?: string;
          position?: string;
          rotation?: string;
          "static-body"?: boolean;
          onClick?: (event: any) => void;
        };
      "a-box": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        position?: string;
        width?: string;
        height?: string;
        depth?: string;
        color?: string;
        material?: string;
      };
      "a-cylinder": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        position?: string;
        radius?: string;
        height?: string;
        color?: string;
        material?: string;
      };
      "a-light": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        type?: string;
        position?: string;
        color?: string;
        intensity?: string | number;
        distance?: string | number;
        angle?: string | number;
      };
      "a-text": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        align?: string;
        color?: string;
        width?: number | string;
        "wrap-count"?: string | number;
        font?: string;
        position?: string;
        class?: string;
        material?: string;
        onClick?: (event: any) => void;
      };
      "a-sky"?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export const VRRecommendationsList: FC<RecommendationsProps> = ({
  recommendationList,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  currentIndex,
  setCurrentIndex,
  setAlertVisible,
  bookmarkedMovies
}) => {
  const [inTransition, setInTransition] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const animationDuration = 500;

  // Initialize A-Frame components
  useEffect(() => {
    // Register color-changer component for interactions
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

    // Listen for WebXR session events
    const scene = document.querySelector("a-scene") as any;
    scene?.renderer?.xr?.addEventListener("sessionstart", () => {
      console.log("WebXR session started. VR mode active.");
    });
  }, []);

  if (!recommendationList.length) {
    return (
      <ErrorCard
        message={`Няма налични препоръки :(\nМоля, опитайте отново. 🔄`}
        mt={10}
      />
    );
  }

  const handleNext = () => {
    if (inTransition) return;

    setDirection("right");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === recommendationList.length - 1 ? 0 : prevIndex + 1
      );
      setInTransition(false);
    }, animationDuration);
  };

  const handlePrevious = () => {
    if (inTransition) return;

    setDirection("left");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? recommendationList.length - 1 : prevIndex - 1
      );
      setInTransition(false);
    }, animationDuration);
  };

  const openModal = (type: "description" | "plot") => {
    // This function is passed down but modals are handled in VRRecommendationCard
    console.log(`Modal type ${type} requested`);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <a-scene
        webxr="optionalFeatures: local-floor, bounded-floor, hand-tracking"
        vr-mode-ui="enabled: true"
        renderer="antialias: true"
        embedded
        style={{ width: "100%", height: "100%" }}
      >
        {/* Camera and controls */}
        <a-camera position="0 1.6 5"></a-camera>
        <a-entity cursor="rayOrigin:mouse"></a-entity>

        {/* Hand controllers for VR */}
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

        {/* Environment setup */}
        <a-sky color="#1a1a2e" />

        {/* Cinema floor */}
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

        {/* Navigation arrows */}
        {!inTransition && (
          <>
            <a-entity
              position="-6 2.5 -8"
              class="clickable"
              onClick={handlePrevious}
            >
              <a-plane
                width="1"
                height="1"
                color="#333333"
                material="shader: flat; opacity: 0.8"
              ></a-plane>
              <a-text
                value="◀"
                position="0 0 0.01"
                align="center"
                color="#FFFFFF"
                width="8"
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              ></a-text>
            </a-entity>

            <a-entity
              position="6 2.5 -8"
              class="clickable"
              onClick={handleNext}
            >
              <a-plane
                width="1"
                height="1"
                color="#333333"
                material="shader: flat; opacity: 0.8"
              ></a-plane>
              <a-text
                value="▶"
                position="0 0 0.01"
                align="center"
                color="#FFFFFF"
                width="8"
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              ></a-text>
            </a-entity>
          </>
        )}

        {/* Current recommendation index indicator */}
        <a-text
          value={`${currentIndex + 1} / ${recommendationList.length}`}
          position="0 5 -8"
          align="center"
          color="#FFFFFF"
          width="6"
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        ></a-text>

        {/* Main recommendation card - only show when not in transition */}
        {!inTransition && (
          <VRRecommendationCard
            recommendationList={recommendationList}
            currentIndex={currentIndex}
            isExpanded={false}
            openModal={openModal}
            setCurrentBookmarkStatus={setCurrentBookmarkStatus}
            setAlertVisible={setAlertVisible}
            setBookmarkedMovies={setBookmarkedMovies}
            bookmarkedMovies={bookmarkedMovies}
          />
        )}

        {/* Cinema screen backdrop */}
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

        {/* Cinema seats */}
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

        {/* Cinema walls */}
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

        {/* Decorative columns */}
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

        {/* Lighting setup */}
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
        ></a-light>
        <a-light
          type="spot"
          position="5 7 0"
          color="#ffaa00"
          intensity="0.8"
          angle="45"
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

        {/* Exit signs */}
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

        {/* Side panels */}
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

        {/* Decorative popcorn stand */}
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
    </div>
  );
};
