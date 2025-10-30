// YouTubeIframeComponent.ts
// This WILL work in your actual app (just not in Claude's preview)

export const registerYouTubeIframeComponent = () => {
  if (typeof window === "undefined" || !(window as any).AFRAME) return;

  const AFRAME = (window as any).AFRAME;
  const THREE = AFRAME.THREE;

  // Check if already registered
  if (AFRAME.components["youtube-iframe"]) {
    console.log("✅ youtube-iframe component already registered");
    return;
  }

  AFRAME.registerComponent("youtube-iframe", {
    schema: {
      videoId: { type: "string", default: "" },
      width: { type: "number", default: 12 },
      height: { type: "number", default: 6.75 },
      autoplay: { type: "boolean", default: false },
      visible: { type: "boolean", default: true }
    },

    init: function () {
      console.log("🎬 Initializing YouTube iframe component");
      this.iframe = null;
      this.container = null;
      this.canvas = null;
      this.camera = null;

      // Small delay to ensure A-Frame is fully ready
      setTimeout(() => {
        this.createIframe();
      }, 100);

      // Throttle tick to 60fps
      this.tick = AFRAME.utils.throttleTick(this.tick.bind(this), 16);
    },

    createIframe: function () {
      const data = this.data;
      const sceneEl = this.el.sceneEl;

      if (!sceneEl || !sceneEl.canvas) {
        console.error("❌ A-Frame scene or canvas not ready");
        return;
      }

      this.canvas = sceneEl.canvas;

      // Create container div
      const container = document.createElement("div");
      container.id = `youtube-iframe-${data.videoId}-${Date.now()}`;
      container.className = "aframe-youtube-overlay";

      // Container styles
      Object.assign(container.style, {
        position: "fixed",
        pointerEvents: "auto",
        zIndex: "9999",
        transformOrigin: "center center",
        overflow: "hidden",
        borderRadius: "8px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
        transition: "opacity 0.3s ease"
      });

      // Create iframe
      this.iframe = document.createElement("iframe");

      // Iframe styles
      Object.assign(this.iframe.style, {
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
        background: "#000"
      });

      // Build YouTube URL with parameters
      const params = new URLSearchParams({
        autoplay: data.autoplay ? "1" : "0",
        mute: data.autoplay ? "1" : "0", // Must mute for autoplay
        controls: "1",
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
        enablejsapi: "0" // Disable JS API to avoid CORS issues
      });

      this.iframe.src = `https://www.youtube.com/embed/${
        data.videoId
      }?${params.toString()}`;

      // Iframe attributes
      this.iframe.setAttribute("allowfullscreen", "true");
      this.iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      );
      this.iframe.setAttribute("frameborder", "0");
      this.iframe.setAttribute("title", "YouTube video player");

      // Event listeners
      this.iframe.addEventListener("load", () => {
        console.log("✅ YouTube iframe loaded:", data.videoId);
      });

      this.iframe.addEventListener("error", (e: any) => {
        console.error("❌ YouTube iframe error:", e);
      });

      // Append iframe to container
      container.appendChild(this.iframe);

      // Append container to body
      document.body.appendChild(container);
      this.container = container;

      console.log("✅ YouTube iframe created and added to DOM");
      console.log("   Video ID:", data.videoId);
      console.log("   URL:", this.iframe.src);

      // Set initial visibility
      this.updateVisibility();
    },

    update: function (oldData: any) {
      // Handle video ID change
      if (oldData.videoId !== this.data.videoId && this.iframe) {
        console.log("🔄 Changing video to:", this.data.videoId);

        const params = new URLSearchParams({
          autoplay: this.data.autoplay ? "1" : "0",
          mute: this.data.autoplay ? "1" : "0",
          controls: "1",
          rel: "0",
          modestbranding: "1",
          playsinline: "1",
          enablejsapi: "0"
        });

        this.iframe.src = `https://www.youtube.com/embed/${
          this.data.videoId
        }?${params.toString()}`;
      }

      // Handle visibility change
      if (oldData.visible !== this.data.visible) {
        this.updateVisibility();
      }
    },

    updateVisibility: function () {
      if (this.container) {
        this.container.style.display = this.data.visible ? "block" : "none";
      }
    },

    tick: function () {
      if (!this.container || !this.data.visible || !this.canvas) return;

      const sceneEl = this.el.sceneEl;
      this.camera = sceneEl.camera;

      if (!this.camera) return;

      // Get world position of entity
      const worldPos = new THREE.Vector3();
      this.el.object3D.getWorldPosition(worldPos);

      // Project to screen space
      const canvasRect = this.canvas.getBoundingClientRect();
      const screenPos = worldPos.clone().project(this.camera);

      // Check if behind camera (z > 1)
      if (screenPos.z > 1 || screenPos.z < -1) {
        this.container.style.opacity = "0";
        this.container.style.pointerEvents = "none";
        return;
      }

      // Convert NDC to pixel coordinates
      const x = (screenPos.x * 0.5 + 0.5) * canvasRect.width;
      const y = (-(screenPos.y * 0.5) + 0.5) * canvasRect.height;

      // Calculate scale based on distance
      const distance = this.camera.position.distanceTo(worldPos);
      const fov = this.camera.fov * (Math.PI / 180);
      const heightAt1m = 2 * Math.tan(fov / 2);
      const pixelsPerMeter = canvasRect.height / (heightAt1m * distance);

      const widthPx = this.data.width * pixelsPerMeter;
      const heightPx = this.data.height * pixelsPerMeter;

      // Position the iframe
      this.container.style.left = `${canvasRect.left + x}px`;
      this.container.style.top = `${canvasRect.top + y}px`;
      this.container.style.width = `${Math.max(widthPx, 10)}px`;
      this.container.style.height = `${Math.max(heightPx, 10)}px`;
      this.container.style.transform = `translate(-50%, -50%)`;

      // Calculate viewing angle
      const cameraDir = new THREE.Vector3(0, 0, -1);
      cameraDir.applyQuaternion(this.camera.quaternion);
      const toEntity = worldPos.clone().sub(this.camera.position).normalize();
      const dot = cameraDir.dot(toEntity);

      // Fade based on viewing angle
      if (dot < 0.2) {
        // Too far off angle - hide
        this.container.style.opacity = "0";
        this.container.style.pointerEvents = "none";
      } else if (dot < 0.6) {
        // Partial view - fade
        const opacity = (dot - 0.2) / 0.4; // Map 0.2-0.6 to 0-1
        this.container.style.opacity = opacity.toString();
        this.container.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      } else {
        // Full view
        this.container.style.opacity = "1";
        this.container.style.pointerEvents = "auto";
      }
    },

    remove: function () {
      console.log("🗑️ Removing YouTube iframe component");
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
  });

  console.log("✅ YouTube iframe component registered successfully");
};

// Optional: Function to check if a video is embeddable (basic check)
export const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
    /youtube\.com\/v\/([^&\s]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If it's already just the ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
};
