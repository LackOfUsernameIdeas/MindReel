import { FC, useEffect, useRef } from "react";

const CustomVRButton: FC = () => {
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    const scene = document.querySelector("a-scene");
    sceneRef.current = scene;

    // Hide the default A-Frame VR button
    const style = document.createElement("style");
    style.textContent = `
      .a-enter-vr-button {
        display: none !important;
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

  return (
    <div className="flex justify-center">
      <button
        onClick={enterVR}
        className="next glow-next bg-opacity-80 text-white font-bold rounded-2xl py-6 px-10 text-2xl transition-all duration-300 ease-in-out transform hover:scale-110 shadow-lg"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem"
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            display: "inline-block",
            verticalAlign: "middle"
          }}
          className="translate-y-[0.1rem]"
        >
          <path d="M20 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-1.6-.8l-1.6-2.13a1 1 0 0 0-1.6 0L9.6 17.2A2 2 0 0 1 8 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        </svg>
        <span style={{ display: "inline-block", verticalAlign: "middle" }}>
          Влезте във VR сцена
        </span>
      </button>
    </div>
  );
};

export default CustomVRButton;
