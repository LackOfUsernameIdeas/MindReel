import { useEffect } from "react";
import "aframe";

const TestVr = () => {
  useEffect(() => {
    // Register swipe-based carousel rotation
    AFRAME.registerComponent("swipe-rotate", {
      init: function () {
        this.el.sceneEl?.addEventListener("axismove", (e: any) => {
          const [x] = e.detail.axis;
          this.el.object3D.rotation.y -= x * 0.05;
        });
      }
    });

    const scene = document.querySelector("a-scene");
    if (scene) {
      scene.addEventListener("loaded", () => {
        console.log("A-Frame scene loaded");
        scene.setAttribute("vr-mode-ui", "enabled: true");
      });
    }
  }, []);

  const cardsData = [
    { title: "Movie 1", description: "Awesome movie 1" },
    { title: "Movie 2", description: "Awesome movie 2" },
    { title: "Movie 3", description: "Awesome movie 3" },
    { title: "Movie 4", description: "Awesome movie 4" },
    { title: "Movie 5", description: "Awesome movie 5" }
  ];

  const radius = 2;
  const cardCount = cardsData.length;

  return (
    <a-scene vr-mode-ui="enabled: true" renderer="antialias: true">
      {/* Camera & cursor */}
      <a-entity id="rig" position="0 1.6 0">
        <a-camera>
          <a-entity
            cursor="fuse: false; rayOrigin: mouse"
            raycaster="objects: .interactable"
            position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
            material="color: black; shader: flat"
          ></a-entity>
        </a-camera>
      </a-entity>

      {/* Controllers with laser interaction */}
      <a-entity laser-controls="hand: left"></a-entity>
      <a-entity laser-controls="hand: right"></a-entity>
      <a-entity hand-controls="hand: left"></a-entity>
      <a-entity hand-controls="hand: right"></a-entity>

      {/* Carousel container */}
      {cardsData.map((card, i) => {
        const angle = (i / cardCount) * 2 * Math.PI;
        const x = radius * Math.sin(angle);
        const z = -radius * Math.cos(angle);
        const rotationY = (angle * 180) / Math.PI + 180; // Face center

        return (
          <a-plane
            key={i}
            position={`${x} 1.6 ${z}`}
            rotation={`0 ${rotationY} 0`}
            width="1.2"
            height="1.6"
            color="#222"
            material="opacity: 0.8"
            className="clickable"
          >
            <a-text
              value={card.title}
              position="0 0.4 0.1"
              align="center"
              color="#FFF"
              width="2"
            />
            <a-text
              value={card.description}
              position="0 -0.1 0.1"
              align="center"
              color="#AAA"
              width="2"
            />
          </a-plane>
        );
      })}
      {/* Ground & sky for immersion */}
      <a-plane
        position="0 0 0"
        rotation="-90 0 0"
        width="30"
        height="30"
        color="#444"
      ></a-plane>

      <a-sky color="#ECECEC"></a-sky>
    </a-scene>
  );
};

export default TestVr;
