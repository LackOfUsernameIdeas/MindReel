import { useEffect, useState, useRef } from "react";
import type { Entity } from "aframe";

interface TrailerModalProps {
  isVisible: boolean;
  isTrailerPlaying: boolean;
  setIsTrailerPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  onClose: () => void;
  position?: string;
  trailerUrl?: string;
}

const TrailerModal = ({
  isVisible,
  isTrailerPlaying,
  setIsTrailerPlaying,
  title,
  onClose,
  position = "0 3.5 -4",
  trailerUrl
}: TrailerModalProps) => {
  const [modalOpacity, setModalOpacity] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const browserRef = useRef<Entity | null>(null);

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      const fadeInTimer = setTimeout(() => setModalOpacity(1), 50);
      return () => clearTimeout(fadeInTimer);
    } else {
      setModalOpacity(0);
      const fadeOutTimer = setTimeout(() => {
        if (browserRef.current) {
          browserRef.current.setAttribute("websurface", "url", "about:blank");
        }
        setIsTrailerPlaying(false);
        setIsMounted(false);
      }, 300);
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isVisible, setIsTrailerPlaying]);

  // Handle VR mode exit
  useEffect(() => {
    const handleExitVR = () => {
      if (isTrailerPlaying) {
        setIsTrailerPlaying(false);
        onClose();
      }
    };

    const sceneEl = document.querySelector("a-scene");
    if (sceneEl) {
      sceneEl.addEventListener("exit-vr", handleExitVR);
      return () => {
        sceneEl.removeEventListener("exit-vr", handleExitVR);
      };
    }
  }, [isTrailerPlaying, setIsTrailerPlaying, onClose]);

  // Update websurface URL when playing starts
  useEffect(() => {
    if (browserRef.current && isTrailerPlaying) {
      // Small delay to ensure the entity is fully mounted
      setTimeout(() => {
        if (browserRef.current) {
          browserRef.current.setAttribute("websurface", {
            url: trailerUrl,
            width: 12,
            height: 6.75,
            autoUpdate: true,
            interactive: true
          });
        }
      }, 100);
    }
  }, [isTrailerPlaying, trailerUrl]);

  const handlePlayClick = () => {
    setIsTrailerPlaying(true);
  };

  const handleExitBrowser = () => {
    if (browserRef.current) {
      browserRef.current.setAttribute("websurface", "url", "about:blank");
    }
    setIsTrailerPlaying(false);
  };

  if (!isMounted) return null;

  const closeIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 
               5 17.59 6.41 19 12 13.41 17.59 19 
               19 17.59 13.41 12z"/>
    </svg>
  `)}`;

  const playButtonSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="white" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="35" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
      <polygon points="32,25 32,55 55,40" fill="white"/>
    </svg>
  `)}`;

  const backArrowSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 32 32">
      <path d="M20 4 L8 16 L20 28 L22 26 L12 16 L22 6 Z"/>
    </svg>
  `)}`;

  return (
    <>
      <a-entity position={position}>
        <a-plane
          width="26"
          height="16"
          color="#000000"
          material={`shader: flat; opacity: ${modalOpacity * 0.85}`}
          position="0 0 -0.5"
        ></a-plane>

        <a-plane
          width="14"
          height="9"
          color="#1a1a1a"
          material={`shader: flat; opacity: ${modalOpacity * 0.98}`}
          position="0 0.5 0"
        ></a-plane>

        <a-plane
          width="14.1"
          height="9.1"
          color="#333333"
          material={`shader: flat; opacity: ${modalOpacity * 0.6}`}
          position="0 0.5 -0.01"
        ></a-plane>

        <a-text
          value={`${title.toUpperCase()}`}
          position="-6.8 4.2 0.01"
          align="left"
          color="#FFFFFF"
          width="6"
          material={`opacity: ${modalOpacity}`}
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        ></a-text>

        {isTrailerPlaying ? (
          <>
            {/* Browser surface with interactive websurface */}
            <a-entity
              ref={browserRef}
              position="0 1 0.1"
              websurface="url: about:blank; width: 12; height: 6.75; autoUpdate: true; interactive: true"
            ></a-entity>

            {/* Exit Browser Button - positioned even closer */}
            <a-entity position="-5.5 -2.5 0.15">
              <a-plane
                width="2"
                height="0.8"
                color="#ff4444"
                material={`shader: flat; opacity: ${modalOpacity * 0.9}`}
                class="clickable"
                onClick={handleExitBrowser}
              ></a-plane>
              <a-image
                src={backArrowSvg}
                width="0.5"
                height="0.5"
                material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
                position="-0.6 0 0.01"
              ></a-image>
              <a-text
                value="EXIT"
                position="0.1 0 0.01"
                align="center"
                color="#FFFFFF"
                width="4"
                material={`opacity: ${modalOpacity}`}
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
                class="clickable"
                onClick={handleExitBrowser}
              ></a-text>
            </a-entity>
          </>
        ) : (
          <>
            <a-plane
              width="12"
              height="6.75"
              color="#000000"
              material={`shader: flat; opacity: ${modalOpacity}`}
              position="0 1 0.01"
            ></a-plane>

            <a-image
              src="/youtube-video-player-interface-with-butch-cassidy-.png"
              width="12"
              height="6.75"
              material={`shader: flat; opacity: ${modalOpacity}`}
              position="0 1 0.02"
            ></a-image>

            <a-image
              src={playButtonSvg}
              width="1.5"
              height="1.5"
              material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
              position="0 1 0.03"
              class="clickable"
              onClick={handlePlayClick}
            ></a-image>
          </>
        )}

        <a-entity position="5.5 -3.8 0.01">
          <a-plane
            width="1.8"
            height="0.7"
            color="#333333"
            material={`shader: flat; opacity: ${modalOpacity * 0.9}`}
            class="clickable"
            onClick={onClose}
          ></a-plane>
          <a-text
            value="CLOSE"
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

        <a-image
          src={closeIconSvg}
          width="0.4"
          height="0.4"
          material={`shader: flat; transparent: true; opacity: ${
            modalOpacity * 0.8
          }`}
          position="6.7 4.2 0.01"
          class="clickable"
          onClick={onClose}
        ></a-image>
      </a-entity>
    </>
  );
};

export default TrailerModal;
