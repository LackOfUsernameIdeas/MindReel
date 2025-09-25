import { useState, useEffect, useRef } from "react";
import "aframe-websurfaces";

interface TrailerModalProps {
  isVisible: boolean;
  isTrailerPlaying: boolean;
  setIsTrailerPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  trailerUrl?: string;
  onClose: () => void;
  position?: string;
}

const TrailerModal = ({
  isVisible,
  isTrailerPlaying,
  setIsTrailerPlaying,
  title,
  trailerUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  onClose,
  position = "0 3.5 -4"
}: TrailerModalProps) => {
  const [modalOpacity, setModalOpacity] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setModalOpacity(1);
    } else {
      setModalOpacity(0);
      setIsTrailerPlaying(false);
      videoRef.current?.pause();
    }
  }, [isVisible]);

  // progress tracking
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const updateProgress = () => {
      if (v.duration > 0) {
        setProgress(v.currentTime / v.duration);
      }
    };

    v.addEventListener("timeupdate", updateProgress);
    return () => v.removeEventListener("timeupdate", updateProgress);
  }, []);

  // ensure autoplay works when you flip "play"
  useEffect(() => {
    if (isTrailerPlaying) {
      const v = videoRef.current;
      if (v) {
        v.muted = false;
        v.play().catch((err) => console.warn("Autoplay blocked:", err));
      }
    }
  }, [isTrailerPlaying]);

  const handlePlayClick = () => {
    setIsTrailerPlaying(true);
  };

  const togglePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  };

  const restartVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
  };

  const seekTo = (fraction: number) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    v.currentTime = v.duration * fraction;
  };

  if (!isVisible) return null;

  const closeIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white">
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 
               5 17.59 6.41 19 12 13.41 17.59 19 
               19 17.59 13.41 12z"/>
    </svg>
  `)}`;

  const playButtonSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="white">
      <circle cx="12" cy="12" r="12" fill="#FF0000" fill-opacity="0.9"/>
      <polygon points="10,8 16,12 10,16" fill="white"/>
    </svg>
  `)}`;

  return (
    <>
      <a-assets>
        <video
          id="trailer-video"
          ref={videoRef}
          src="cl16.mp4"
          autoPlay
          muted
          playsInline
          crossOrigin="anonymous"
        />
      </a-assets>

      <a-entity position={position}>
        <a-plane
          width="25"
          height="15"
          color="#000000"
          material={`shader: flat; opacity: ${modalOpacity * 0.8}`}
          position="0 0 -0.5"
        ></a-plane>

        <a-plane
          width="12"
          height="8"
          color="#1a1a1a"
          material={`shader: flat; opacity: ${modalOpacity * 0.95}`}
          position="0 0 0"
        ></a-plane>

        <a-plane
          width="12.1"
          height="8.1"
          color="#333333"
          material={`shader: flat; opacity: ${modalOpacity * 0.8}`}
          position="0 0 -0.01"
        ></a-plane>

        <a-text
          value={`ТРЕЙЛЪР НА ${title.toUpperCase()}`}
          position="-5.8 3.5 0.01"
          align="left"
          color="#FFFFFF"
          width="8"
          material={`opacity: ${modalOpacity}`}
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        ></a-text>

        {isTrailerPlaying ? (
          <>
            <a-video
              id="yt-surface"
              src="#trailer-video"
              position="0 0.2 0.02"
              width="10"
              height="5.6"
            />

            <a-entity
              position="4 2.5 0.02"
              class="clickable"
              onClick={togglePlayPause}
            >
              <a-plane width="1.5" height="0.6" color="#ff0000" />
              <a-text
                value="un/pause"
                position="0 0 0.01"
                align="center"
                color="#FFFFFF"
                width="4"
              />
            </a-entity>

            <a-entity
              position="4 1.5 0.02"
              class="clickable"
              onClick={restartVideo}
            >
              <a-plane width="1.5" height="0.6" color="#00aa00" />
              <a-text
                value="restart"
                position="0 0 0.01"
                align="center"
                color="#FFFFFF"
                width="4"
              />
            </a-entity>

            <a-entity position="0 -3 0.05">
              <a-plane width="8" height="0.2" color="#555" />

              <a-plane
                width={8 * progress}
                height="0.2"
                color="#ff0000"
                position={`${-4 + (8 * progress) / 2} 0 0.01`}
              />

              <a-plane
                width="8"
                height="0.2"
                color="#000"
                opacity="0"
                class="clickable"
                onClick={(e: any) => {
                  const uv = e.detail.intersection.uv;
                  if (uv) seekTo(uv.x);
                }}
              />
            </a-entity>
          </>
        ) : (
          <>
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

        <a-entity position="4.5 -3.5 0.01">
          <a-plane
            width="1.5"
            height="0.6"
            color="#4CAF50"
            material={`shader: flat; opacity: ${modalOpacity}`}
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
