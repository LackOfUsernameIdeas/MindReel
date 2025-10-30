// YouTubeIframeComponent.ts
declare global {
  interface Window {
    YT: any;
  }
}

export const registerYouTubeIframeComponent = () => {
  if (typeof window === "undefined" || !(window as any).AFRAME) return;

  const AFRAME = (window as any).AFRAME;
  const THREE = AFRAME.THREE;

  if (AFRAME.components["youtube-iframe"]) {
    console.log("✅ youtube-iframe already registered");
    return;
  }

  AFRAME.registerComponent("youtube-iframe", {
    schema: {
      videoId: { type: "string", default: "" },
      width: { type: "number", default: 12 },
      height: { type: "number", default: 6.75 },
      autoplay: { type: "boolean", default: true },
      visible: { type: "boolean", default: true }
    },

    init: function () {
      this.container = null;
      this.iframe = null;
      this.canvas = null;
      this.camera = null;
      this.player = null;

      setTimeout(() => this.createIframe(), 150);
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

      const container = document.createElement("div");
      container.className = "aframe-youtube-overlay";
      Object.assign(container.style, {
        position: "absolute",
        pointerEvents: "auto",
        zIndex: "100",
        background: "black",
        borderRadius: "8px",
        overflow: "hidden",
        width: "800px",
        height: "450px",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        opacity: "1"
      });

      const iframe = document.createElement("iframe");
      Object.assign(iframe.style, {
        width: "100%",
        height: "100%",
        border: "none",
        display: "block"
      });

      const params = new URLSearchParams({
        autoplay: "1",
        mute: "1",
        controls: "1",
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
        enablejsapi: "1"
      });

      iframe.src = `https://www.youtube.com/embed/${
        data.videoId
      }?${params.toString()}`;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.id = `yt-player-${data.videoId}-${Date.now()}`;

      container.appendChild(iframe);

      // Append after A-Frame canvas so it sits above
      const canvasParent = this.canvas.parentNode;
      if (canvasParent) canvasParent.appendChild(container);
      else document.body.appendChild(container);

      this.container = container;
      this.iframe = iframe;

      // Load YouTube API if not loaded
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }

      // Wait for API ready
      const waitForYT = () => {
        if (window.YT && window.YT.Player) {
          this.player = new window.YT.Player(iframe.id, {
            events: {
              onReady: (event: any) => {
                event.target.mute();
                event.target.playVideo();
                console.log("🎥 YouTube player ready and playing");
              },
              onError: (e: any) => console.error("❌ YouTube player error", e)
            }
          });
        } else {
          requestAnimationFrame(waitForYT);
        }
      };
      waitForYT();

      this.updateVisibility();
    },

    updateVisibility: function () {
      if (this.container) {
        this.container.style.display = this.data.visible ? "block" : "none";
        this.container.style.opacity = this.data.visible ? "1" : "0";
      }
    },

    tick: function () {
      if (!this.container || !this.data.visible || !this.canvas) return;
      const sceneEl = this.el.sceneEl;
      this.camera = sceneEl.camera;
      if (!this.camera) return;

      const worldPos = new THREE.Vector3();
      this.el.object3D.getWorldPosition(worldPos);
      const canvasRect = this.canvas.getBoundingClientRect();
      const screenPos = worldPos.clone().project(this.camera);
      if (screenPos.z > 1 || screenPos.z < -1) return;

      const x = (screenPos.x * 0.5 + 0.5) * canvasRect.width;
      const y = (-(screenPos.y * 0.5) + 0.5) * canvasRect.height;
      const distance = this.camera.position.distanceTo(worldPos);
      const fov = this.camera.fov * (Math.PI / 180);
      const heightAt1m = 2 * Math.tan(fov / 2);
      const pixelsPerMeter = canvasRect.height / (heightAt1m * distance);

      const widthPx = Math.max(this.data.width * pixelsPerMeter, 200);
      const heightPx = Math.max(this.data.height * pixelsPerMeter, 100);

      this.container.style.left = `${canvasRect.left + x}px`;
      this.container.style.top = `${canvasRect.top + y}px`;
      this.container.style.width = `${widthPx}px`;
      this.container.style.height = `${heightPx}px`;
    },

    remove: function () {
      if (this.container?.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
  });

  console.log("✅ YouTube iframe component registered successfully");
};

// Helper: extract video ID
export const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
    /youtube\.com\/v\/([^&\s]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
};
