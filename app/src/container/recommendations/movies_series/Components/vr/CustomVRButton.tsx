import { FC, useEffect, useRef, useState } from "react";

const CustomVRButton: FC = () => {
  const sceneRef = useRef<any>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);

  useEffect(() => {
    const scene = document.querySelector("a-scene");
    sceneRef.current = scene;

    // Check if VR is supported
    if (navigator.xr) {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        setIsVRSupported(supported);
      });
    }

    // Style the default A-Frame VR button to match cinema theme
    const style = document.createElement("style");
    style.textContent = `
      .a-enter-vr-button {
        background: linear-gradient(135deg, #8b2020, #4a1515) !important;
        border: 2px solid #ff4d1a !important;
        color: #ffffff !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        font-weight: 600 !important;
        padding: 14px 28px !important;
        border-radius: 12px !important;
        box-shadow: 0 0 20px rgba(255, 77, 26, 0.4) !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
      }

      .a-enter-vr-button:hover {
        background: linear-gradient(135deg, #a02828, #5a1a1a) !important;
        box-shadow: 0 0 30px rgba(255, 77, 26, 0.6) !important;
        transform: translateY(-2px) !important;
      }

      .a-enter-vr-button:active {
        transform: translateY(0) !important;
      }

      .a-enter-vr-button::before {
        content: '🎬 ';
        margin-right: 8px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const enterVR = () => {
    if (sceneRef.current) {
      sceneRef.current.enterVR();
    }
  };

  if (!isVRSupported) return null;

  return (
    <button
      onClick={enterVR}
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 px-8 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-3 border-2 border-red-400"
      style={{
        boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)"
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-pulse"
      >
        <path
          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="9" cy="10" r="1.5" fill="currentColor" />
        <circle cx="15" cy="10" r="1.5" fill="currentColor" />
        <path
          d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg tracking-wide">Enter Cinema</span>
    </button>
  );
};

export default CustomVRButton;
