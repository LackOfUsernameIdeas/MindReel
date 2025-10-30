import { useEffect, useState } from "react";
import {
  registerYouTubeIframeComponent,
  getYouTubeVideoId
} from "./YouTubeComponent";

interface TrailerModalProps {
  isVisible: boolean;
  isTrailerPlaying: boolean;
  setIsTrailerPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  onClose: () => void;
  position?: string;
  videoUrl?: string; // Direct video file URL (.mp4, .webm, etc.)
  youtubeUrl?: string; // YouTube URL (any format)
}

const TrailerModal = ({
  isVisible,
  isTrailerPlaying,
  setIsTrailerPlaying,
  title,
  onClose,
  position = "0 3.5 -4",
  videoUrl,
  youtubeUrl
}: TrailerModalProps) => {
  const [modalOpacity, setModalOpacity] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );

  // Register YouTube component once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      registerYouTubeIframeComponent();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Extract video ID from YouTube URL
  const videoId = youtubeUrl ? getYouTubeVideoId(youtubeUrl) : null;
  const isYouTube = !!videoId;
  const hasDirectVideo = !!videoUrl && !isYouTube;

  console.log("TrailerModal state:", {
    isYouTube,
    hasDirectVideo,
    videoId,
    videoUrl
  });

  // Handle modal visibility
  useEffect(() => {
    if (isVisible) {
      setModalOpacity(1);
    } else {
      setModalOpacity(0);
      setIsTrailerPlaying(false);

      // Clean up video element
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    }
  }, [isVisible, videoElement]);

  // Setup direct video element (only for non-YouTube videos)
  useEffect(() => {
    // CRITICAL: Only create video element if we have a direct video file, NOT YouTube
    if (!isVisible || !hasDirectVideo || isYouTube) {
      console.log("Skipping video element creation:", {
        isVisible,
        hasDirectVideo,
        isYouTube
      });
      return;
    }

    console.log("Creating video element for direct video:", videoUrl);

    const videoElementId = "dynamic-trailer-video";
    let video = document.getElementById(videoElementId) as HTMLVideoElement;

    if (!video) {
      video = document.createElement("video");
      video.id = videoElementId;
      video.setAttribute("crossorigin", "anonymous");
      video.setAttribute("playsinline", "");
      video.muted = true;

      const assets = document.querySelector("a-assets");
      if (assets) {
        assets.appendChild(video);
        console.log("Video element added to a-assets");
      } else {
        console.warn("No a-assets element found");
      }
    }

    setVideoElement(video);

    // Set video source
    if (videoUrl && video.src !== videoUrl) {
      video.src = videoUrl;
      video.load();
      console.log("Video source set:", videoUrl);
    }

    return () => {
      if (video) {
        video.pause();
      }
    };
  }, [isVisible, videoUrl, hasDirectVideo, isYouTube]);

  // Video progress tracking for direct videos only
  useEffect(() => {
    if (!videoElement || !hasDirectVideo || isYouTube) return;

    const updateProgress = () => {
      if (videoElement.duration > 0) {
        setProgress(videoElement.currentTime / videoElement.duration);
        setCurrentTime(videoElement.currentTime);
        setDuration(videoElement.duration);
        setIsPlaying(!videoElement.paused);
      }
    };

    videoElement.addEventListener("timeupdate", updateProgress);
    videoElement.addEventListener("loadedmetadata", updateProgress);

    return () => {
      videoElement.removeEventListener("timeupdate", updateProgress);
      videoElement.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [videoElement, hasDirectVideo, isYouTube]);

  // Auto-play direct videos only
  useEffect(() => {
    if (isTrailerPlaying && hasDirectVideo && !isYouTube && videoElement) {
      console.log("Attempting to play direct video");
      videoElement.muted = false;
      videoElement.play().catch((err) => {
        console.warn("Autoplay blocked:", err.message);
      });
    }
  }, [isTrailerPlaying, hasDirectVideo, isYouTube, videoElement]);

  const handlePlayClick = () => {
    console.log("Play clicked");
    setIsTrailerPlaying(true);
  };

  const togglePlayPause = () => {
    if (!videoElement || !hasDirectVideo) return;
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  const restartVideo = () => {
    if (!videoElement || !hasDirectVideo) return;
    videoElement.currentTime = 0;
    videoElement.play();
  };

  const seekTo = (fraction: number) => {
    if (!videoElement || !hasDirectVideo || !videoElement.duration) return;
    videoElement.currentTime = videoElement.duration * fraction;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isVisible) return null;

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

  const pauseIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 32 32">
      <rect x="8" y="6" width="4" height="20" rx="1"/>
      <rect x="20" y="6" width="4" height="20" rx="1"/>
    </svg>
  `)}`;

  const playIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 32 32">
      <polygon points="10,6 10,26 24,16" fill="white"/>
    </svg>
  `)}`;

  const restartIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 32 32">
      <path d="M16 4 L12 8 L16 12 L16 9 C20.4 9 24 12.6 24 17 C24 21.4 20.4 25 16 25 C11.6 25 8 21.4 8 17 L6 17 C6 22.5 10.5 27 16 27 C21.5 27 26 22.5 26 17 C26 11.5 21.5 7 16 7 L16 4 Z"/>
    </svg>
  `)}`;

  return (
    <a-entity position={position}>
      {/* Modal background */}
      <a-plane
        width="26"
        height="16"
        color="#000000"
        material={`shader: flat; opacity: ${modalOpacity * 0.85}`}
        position="0 0 -0.5"
      />

      {/* Video container background */}
      <a-plane
        width="14"
        height="9"
        color="#1a1a1a"
        material={`shader: flat; opacity: ${modalOpacity * 0.98}`}
        position="0 0.5 0"
      />

      <a-plane
        width="14.1"
        height="9.1"
        color="#333333"
        material={`shader: flat; opacity: ${modalOpacity * 0.6}`}
        position="0 0.5 -0.01"
      />

      {/* Title */}
      <a-text
        value={title.toUpperCase()}
        position="-6.8 4.2 0.01"
        align="left"
        color="#FFFFFF"
        width="6"
        material={`opacity: ${modalOpacity}`}
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      />

      {/* Video content */}
      {isTrailerPlaying ? (
        <>
          {isYouTube && videoId ? (
            <>
              {/* Black background for YouTube iframe */}
              <a-plane
                width="12"
                height="6.75"
                color="#000000"
                material={`shader: flat; opacity: ${modalOpacity}`}
                position="0 1 0.01"
              />

              {/* YouTube iframe component - THIS CREATES THE OVERLAY */}
              <a-entity
                position="0 1 0.02"
                youtube-iframe={`videoId: ${videoId}; width: 12; height: 6.75; autoplay: true; visible: true`}
              />

              {/* Info text */}
              <a-text
                value="YouTube video (interactive overlay)"
                position="0 -2.5 0.02"
                align="center"
                color="#888888"
                width="6"
                material={`opacity: ${modalOpacity * 0.7}`}
                font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
              />
            </>
          ) : hasDirectVideo ? (
            <>
              {/* Direct video playback */}
              <a-video
                src="#dynamic-trailer-video"
                position="0 1 0.02"
                width="12"
                height="6.75"
              />

              {/* Video controls bar */}
              <a-plane
                width="12"
                height="1.5"
                color="#000000"
                material={`shader: flat; opacity: ${modalOpacity * 0.8}`}
                position="0 -2.5 0.02"
              />

              {/* Play/Pause button */}
              <a-entity
                position="-4.5 -2.5 0.03"
                class="clickable"
                onClick={togglePlayPause}
              >
                <a-image
                  src={isPlaying ? pauseIconSvg : playIconSvg}
                  width="0.8"
                  height="0.8"
                  material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
                />
              </a-entity>

              {/* Restart button */}
              <a-entity
                position="-3.5 -2.5 0.03"
                class="clickable"
                onClick={restartVideo}
              >
                <a-image
                  src={restartIconSvg}
                  width="0.7"
                  height="0.7"
                  material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
                />
              </a-entity>

              {/* Time display */}
              <a-text
                value={`${formatTime(currentTime)} / ${formatTime(duration)}`}
                position="-2.5 -2.5 0.03"
                align="left"
                color="#FFFFFF"
                width="4"
                material={`opacity: ${modalOpacity}`}
              />

              {/* Progress bar */}
              <a-entity position="1.5 -2.5 0.03">
                <a-plane
                  width="6"
                  height="0.15"
                  color="#444444"
                  material={`shader: flat; opacity: ${modalOpacity}`}
                />

                <a-plane
                  width={6 * progress}
                  height="0.15"
                  color="#ff4444"
                  material={`shader: flat; opacity: ${modalOpacity}`}
                  position={`${-3 + (6 * progress) / 2} 0 0.01`}
                />

                <a-sphere
                  radius="0.08"
                  color="#ffffff"
                  material={`shader: flat; opacity: ${modalOpacity}`}
                  position={`${-3 + 6 * progress} 0 0.02`}
                />

                <a-plane
                  width="6"
                  height="0.4"
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
              {/* No video source */}
              <a-plane
                width="12"
                height="6.75"
                color="#000000"
                material={`shader: flat; opacity: ${modalOpacity}`}
                position="0 1 0.01"
              />
              <a-text
                value="No video source provided"
                position="0 1 0.02"
                align="center"
                color="#FFFFFF"
                width="8"
                material={`opacity: ${modalOpacity}`}
                font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              />
            </>
          )}
        </>
      ) : (
        <>
          {/* Thumbnail/preview state */}
          <a-plane
            width="12"
            height="6.75"
            color="#000000"
            material={`shader: flat; opacity: ${modalOpacity}`}
            position="0 1 0.01"
          />

          <a-image
            src="/youtube-video-player-interface-with-butch-cassidy-.png"
            width="12"
            height="6.75"
            material={`shader: flat; opacity: ${modalOpacity}`}
            position="0 1 0.02"
          />

          <a-image
            src={playButtonSvg}
            width="1.5"
            height="1.5"
            material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
            position="0 1 0.03"
            class="clickable"
            onClick={handlePlayClick}
          />
        </>
      )}

      {/* Close button */}
      <a-entity position="5.5 -3.8 0.01">
        <a-plane
          width="1.8"
          height="0.7"
          color="#333333"
          material={`shader: flat; opacity: ${modalOpacity * 0.9}`}
          class="clickable"
          onClick={onClose}
        />
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
        />
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
      />
    </a-entity>
  );
};

export default TrailerModal;
