import { FC } from "react";

interface NavigationArrowsProps {
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const NavigationArrows: FC<NavigationArrowsProps> = ({
  currentIndex,
  totalCount,
  onPrevious,
  onNext
}) => {
  const leftArrowSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="white">
      <path d="M65 85 L25 50 L65 15" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `)}`;

  const rightArrowSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="white">
      <path d="M35 15 L75 50 L35 85" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `)}`;

  return (
    <>
      {/* LEFT ARROW */}
      <a-entity position="-7 2.5 -7">
        {/* Glow background */}
        <a-circle
          radius="0.7"
          color="#8b2020"
          material="shader: flat; opacity: 0.3"
          position="0 0 -0.01"
        ></a-circle>

        {/* Arrow button */}
        <a-circle
          radius="0.6"
          color="#1a0a0a"
          material="shader: flat; opacity: 0.9"
          className="clickable"
          animation__mouseenter="property: scale; to: 1.15 1.15 1; startEvents: mouseenter; dur: 200"
          animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
          animation__click="property: components.material.material.color; type: color; from: #8b2020; to: #1a0a0a; startEvents: click; dur: 200"
          onClick={onPrevious}
        >
          <a-image
            src={leftArrowSvg}
            width="0.5"
            height="0.5"
            material="shader: flat; transparent: true"
            position="0 0 0.01"
          ></a-image>
        </a-circle>
      </a-entity>

      {/* RIGHT ARROW */}
      <a-entity position="7 2.5 -7">
        {/* Glow background */}
        <a-circle
          radius="0.7"
          color="#8b2020"
          material="shader: flat; opacity: 0.3"
          position="0 0 -0.01"
        ></a-circle>

        {/* Arrow button */}
        <a-circle
          radius="0.6"
          color="#1a0a0a"
          material="shader: flat; opacity: 0.9"
          className="clickable"
          animation__mouseenter="property: scale; to: 1.15 1.15 1; startEvents: mouseenter; dur: 200"
          animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
          animation__click="property: components.material.material.color; type: color; from: #8b2020; to: #1a0a0a; startEvents: click; dur: 200"
          onClick={onNext}
        >
          <a-image
            src={rightArrowSvg}
            width="0.5"
            height="0.5"
            material="shader: flat; transparent: true"
            position="0 0 0.01"
          ></a-image>
        </a-circle>
      </a-entity>

      {/* COUNTER DISPLAY */}
      <a-entity position="0 8 -7.9">
        <a-plane
          width="2"
          height="0.5"
          color="#1a0a0a"
          material="shader: flat; opacity: 0.8"
        ></a-plane>
        <a-text
          value={`${currentIndex + 1} / ${totalCount}`}
          align="center"
          color="#FFFFFF"
          width="4"
          position="0 0 0.01"
        ></a-text>
      </a-entity>
    </>
  );
};
