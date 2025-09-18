import { useState, useEffect, useRef } from "react";
import "aframe-websurfaces";

interface TrailerModalProps {
  isVisible: boolean;
  title: string;
  trailerUrl?: string;
  onClose: () => void;
  position?: string;
}

const TrailerModal = ({
  isVisible,
  title,
  trailerUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  onClose,
  position = "0 3.5 -4"
}: TrailerModalProps) => {
  const [modalOpacity, setModalOpacity] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVisible) {
      setModalOpacity(1);
    } else {
      setModalOpacity(0);
      setIsPlaying(false);
    }
  }, [isVisible]);

  useEffect(() => {
    const el = document.getElementById("yt-surface") as any;
    if (el?.websurface_iframe) {
      el.websurface_iframe.setAttribute(
        "allow",
        "autoplay *; encrypted-media; fullscreen; picture-in-picture; xr-spatial-tracking"
      );
    }
  }, [isPlaying]);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  if (!isVisible) return null;

  const closeIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  `)}`;

  const playButtonSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="white">
      <circle cx="12" cy="12" r="12" fill="#FF0000" fillOpacity="0.9"/>
      <polygon points="10,8 16,12 10,16" fill="white"/>
    </svg>
  `)}`;

  return (
    <>
      <a-entity position={position}>
        {/* Background overlay for focus effect */}
        <a-plane
          width="25"
          height="15"
          color="#000000"
          material={`shader: flat; opacity: ${modalOpacity * 0.8}`}
          position="0 0 -0.5"
        ></a-plane>

        {/* Modal container */}
        <a-plane
          width="12"
          height="8"
          color="#1a1a1a"
          material={`shader: flat; opacity: ${modalOpacity * 0.95}`}
          position="0 0 0"
        ></a-plane>

        {/* Modal border */}
        <a-plane
          width="12.1"
          height="8.1"
          color="#333333"
          material={`shader: flat; opacity: ${modalOpacity * 0.8}`}
          position="0 0 -0.01"
        ></a-plane>

        {/* Modal title */}
        <a-text
          value={`ТРЕЙЛЪР НА ${title.toUpperCase()}`}
          position="-5.8 3.5 0.01"
          align="left"
          color="#FFFFFF"
          width="8"
          material={`opacity: ${modalOpacity}`}
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        ></a-text>

        {isPlaying ? (
          <>
            <a-entity
              id="yt-surface"
              position="0 0.2 0.02"
              geometry="primitive: plane; width: 10; height: 5.6"
              websurface={`url: ${trailerUrl}?autoplay=1&playsinline=1&enablejsapi=1&rel=0;`}
            ></a-entity>

            <a-entity position="4 2.5 0.02">
              <a-plane
                width="1.5"
                height="0.6"
                color="#ff0000"
                material={`shader: flat; opacity: ${modalOpacity}`}
                position="0 0 0"
                class="clickable"
                onClick={() => setIsPlaying(false)}
              ></a-plane>
              <a-text
                value="СТОП"
                position="0 0 0.01"
                align="center"
                color="#FFFFFF"
                width="4"
                material={`opacity: ${modalOpacity}`}
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
                class="clickable"
                onClick={() => setIsPlaying(false)}
              ></a-text>
            </a-entity>
          </>
        ) : (
          <>
            {/* Video player area with poster */}
            <a-plane
              width="10"
              height="5.6"
              color="#000000"
              material={`shader: flat; opacity: ${modalOpacity}`}
              position="0 0.2 0.01"
            ></a-plane>

            <a-image
              src="/youtube-video-player-interface-with-butch-cassidy-.png"
              width="10"
              height="5.6"
              material={`shader: flat; opacity: ${modalOpacity}`}
              position="0 0.2 0.02"
            ></a-image>

            <a-image
              src={playButtonSvg}
              width="1.2"
              height="1.2"
              material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
              position="0 0.2 0.03"
              class="clickable"
              onClick={handlePlayClick}
            ></a-image>
          </>
        )}

        {/* Close button */}
        <a-entity position="4.5 -3.5 0.01">
          <a-plane
            width="1.5"
            height="0.6"
            color="#4CAF50"
            material={`shader: flat; opacity: ${modalOpacity}`}
            position="0 0 0"
            class="clickable"
            onClick={onClose}
          ></a-plane>
          <a-text
            value="ЗАТВОРИ"
            position="0 0 0.01"
            align="center"
            color="#FFFFFF"
            width="4"
            material={`opacity: ${modalOpacity}`}
            font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
            class="clickable"
            onClick={onClose}
          ></a-text>
        </a-entity>

        {/* Close icon in top right */}
        <a-image
          src={closeIconSvg}
          width="0.3"
          height="0.3"
          material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
          position="5.7 3.7 0.01"
          class="clickable"
          onClick={onClose}
        ></a-image>
      </a-entity>
    </>
  );
};

export default TrailerModal;
