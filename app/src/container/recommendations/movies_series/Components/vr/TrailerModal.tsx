import type React from "react"
import {useEffect, useState} from "react"

interface TrailerModalProps {
    isVisible: boolean
    isTrailerPlaying: boolean
    setIsTrailerPlaying: React.Dispatch<React.SetStateAction<boolean>>
    onClose: (qclose: boolean) => void
    position?: string
    videoUrl?: string // Direct Cloud Run video URL to play
}

const TrailerModal = ({
                          isVisible,
                          isTrailerPlaying,
                          setIsTrailerPlaying,
                          onClose,
                          position = "0 3.5 -4",
                          videoUrl,
                      }: TrailerModalProps) => {
    const [modalOpacity, setModalOpacity] = useState(0)
    const [progress, setProgress] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

    useEffect(() => {
        if (isVisible) {
            setModalOpacity(1)
            // Get or create video element
            const videoId = "dynamic-trailer-video"
            let video = document.getElementById(videoId) as HTMLVideoElement

            if (!video) {
                // Create video element if it doesn't exist
                video = document.createElement("video")
                video.id = videoId
                video.setAttribute("crossorigin", "anonymous")
                video.setAttribute("playsinline", "")
                video.muted = true

                // Add to assets
                const assets = document.querySelector("a-assets")
                if (assets) {
                    assets.appendChild(video)
                }
            }

            setVideoElement(video)

            // Set video source if provided
            if (videoUrl) {
                video.src = videoUrl
                video.load()
            }
        } else {
            setModalOpacity(0)
            setIsTrailerPlaying(false)
            if (videoElement) {
                videoElement.pause()
                videoElement.currentTime = 0
            }
        }
    }, [isVisible, videoUrl])

    useEffect(() => {
        if (!videoElement) return

        const updateProgress = () => {
            if (videoElement.duration > 0) {
                setProgress(videoElement.currentTime / videoElement.duration)
                setCurrentTime(videoElement.currentTime)
                setDuration(videoElement.duration)
                setIsPlaying(!videoElement.paused)
            }
        }

        videoElement.addEventListener("timeupdate", updateProgress)
        videoElement.addEventListener("loadedmetadata", updateProgress)
        return () => {
            videoElement.removeEventListener("timeupdate", updateProgress)
            videoElement.removeEventListener("loadedmetadata", updateProgress)
        }
    }, [videoElement])

    useEffect(() => {
        if (isTrailerPlaying && videoElement) {
            videoElement.muted = false
            videoElement.play().catch((err) => console.warn("Autoplay blocked:", err))
        }
    }, [isTrailerPlaying, videoElement])

    const handlePlayClick = () => {
        setIsTrailerPlaying(true)
    }

    const togglePlayPause = () => {
        if (!videoElement) return
        if (videoElement.paused) {
            videoElement.play()
        } else {
            videoElement.pause()
        }
    }

    const restartVideo = () => {
        if (!videoElement) return
        videoElement.currentTime = 0
        videoElement.play()
    }

    const seekTo = (fraction: number) => {
        if (!videoElement || !videoElement.duration) return
        videoElement.currentTime = videoElement.duration * fraction
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    if (!isVisible) return null

    const closeIconSvg = `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 
                   5 17.59 6.41 19 12 13.41 17.59 19 
                   19 17.59 13.41 12z"/>
        </svg>
      `)}`

    const playButtonSvg = `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="white" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="rgba(0,0,0,0.7)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <polygon points="32,25 32,55 55,40" fill="white"/>
        </svg>
      `)}`

    const pauseIconSvg = `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 32 32">
          <rect x="8" y="6" width="4" height="20" rx="1"/>
          <rect x="20" y="6" width="4" height="20" rx="1"/>
        </svg>
      `)}`

    const playIconSvg = `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 32 32">
          <polygon points="10,6 10,26 24,16" fill="white"/>
        </svg>
      `)}`

    const restartIconSvg = `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 32 32">
          <path d="M16 4 L12 8 L16 12 L16 9 C20.4 9 24 12.6 24 17 C24 21.4 20.4 25 16 25 C11.6 25 8 21.4 8 17 L6 17 C6 22.5 10.5 27 16 27 C21.5 27 26 22.5 26 17 C26 11.5 21.5 7 16 7 L16 4 Z"/>
        </svg>
      `)}`

    return (
        <>
            <a-entity position={position}>
                <a-entity position="0 1 0">
                    {isTrailerPlaying ? (
                        <a-curvedimage
                            src="#dynamic-trailer-video"
                            height="9"
                            radius="12"
                            theta-length="80"
                            position="0 -1 12"
                            rotation="-2 138 2"
                        />
                    ) : (
                        <a-entity position="0 -2 1">
                            <a-plane
                                width="8"
                                height="4.5"
                                color="#000000"
                                material={`shader: flat; opacity: ${modalOpacity}`}
                                position="0 0 -0.01"
                            ></a-plane>
                            <a-image
                                src={playButtonSvg}
                                width="1.5"
                                height="1.5"
                                material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
                                position="0 0 0.01"
                                class="clickable"
                                onClick={handlePlayClick}
                            ></a-image>
                            <a-image
                                src={closeIconSvg}
                                width="0.2"
                                height="0.2"
                                material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
                                position="3.75 2 0.01"
                                class="clickable"
                                onClick={() => {
                                    onClose(true)
                                }}
                            ></a-image>
                        </a-entity>
                    )}
                </a-entity>

                {isTrailerPlaying && (
                    <a-entity position="0 -4.2 7" rotation="-55 0 0">
                        <a-plane
                            width="10"
                            height="1.8"
                            color="#0a0a0a"
                            material={`shader: flat; opacity: ${modalOpacity * 0.92}`}
                            position="0 0 0"
                            radius="0.1"
                        ></a-plane>
                        <a-plane
                            width="10.1"
                            height="1.9"
                            color="#1a1a1a"
                            material={`shader: flat; opacity: ${modalOpacity * 0.5}`}
                            position="0 0 -0.01"
                        ></a-plane>
                        <a-entity position="-4 0.2 0.02" class="clickable" onClick={togglePlayPause}>

                            <a-image
                                src={isPlaying ? pauseIconSvg : playIconSvg}
                                width="0.6"
                                height="0.6"
                                material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
                                position="0 0 0.01"
                            />
                        </a-entity>
                        <a-entity position="-2.8 0.2 0.02" class="clickable" onClick={restartVideo}>

                            <a-image
                                src={restartIconSvg}
                                width="0.55"
                                height="0.55"
                                material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
                                position="0 0 0.01"
                            />
                        </a-entity>
                        <a-text
                            value={`${formatTime(currentTime)} / ${formatTime(duration)}`}
                            position="-1.5 0.2 0.02"
                            align="left"
                            color="#FFFFFF"
                            width="5"
                            material={`opacity: ${modalOpacity * 0.95}`}
                        />
                        <a-entity position="0 -0.6 0.02">
                            <a-plane
                                width="8.5"
                                height="0.12"
                                color="#2a2a2a"
                                material={`shader: flat; opacity: ${modalOpacity * 0.9}`}
                                radius="0.06"
                            />
                            <a-plane
                                width={8.5 * progress}
                                height="0.12"
                                color="#ff4444"
                                material={`shader: flat; opacity: ${modalOpacity}`}
                                position={`${-4.25 + (8.5 * progress) / 2} 0 0.01`}
                                radius="0.06"
                            />
                            <a-sphere
                                radius="0.12"
                                color="#ffffff"
                                material={`shader: flat; opacity: ${modalOpacity}`}
                                position={`${-4.25 + 8.5 * progress} 0 0.02`}
                            />
                            <a-plane
                                width="8.5"
                                height="0.5"
                                color="#000"
                                opacity="0"
                                class="clickable"
                                onClick={(e: any) => {
                                    const uv = e.detail.intersection.uv
                                    if (uv) seekTo(uv.x)
                                }}
                            />
                        </a-entity>
                        <a-entity position="4 0.2 0.02">
                            <a-plane
                                width="1.5"
                                height="0.8"
                                color="#ff4444"
                                material={`shader: flat; opacity: ${modalOpacity * 0.85}`}
                                class="clickable"
                                onClick={() => {
                                    onClose(false)
                                }}
                                radius="0.1"
                            ></a-plane>
                            <a-text
                                value="CLOSE"
                                position="0 0 0.01"
                                align="center"
                                color="#FFFFFF"
                                width="4"
                                material={`opacity: ${modalOpacity}`}
                                class="clickable"
                                onClick={() => {
                                    onClose(false)
                                }}
                            ></a-text>
                        </a-entity>
                    </a-entity>
                )}
            </a-entity>
        </>
    )
}

export default TrailerModal
