import { useEffect } from "react";
import "aframe";
import "aframe-extras";
import "aframe-physics-system";
import MovieCard from "./MovieCard";

const TestVr = () => {
  useEffect(() => {
    AFRAME.registerComponent("color-changer", {
      init: function () {
        this.el.addEventListener("raycaster-intersected", () => {
          this.el.setAttribute("material", "color", "#4CAF50");
        });
        this.el.addEventListener("raycaster-intersected-cleared", () => {
          this.el.setAttribute("material", "color", "#F44336");
        });
      }
    });

    const scene = document.querySelector("a-scene");
    scene?.renderer?.xr?.addEventListener("sessionstart", () => {
      console.log("WebXR session started. Hands should now spawn.");
    });
  }, []);

  return (
    <a-scene
      webxr="optionalFeatures: local-floor, bounded-floor, hand-tracking"
      vr-mode-ui="enabled: true"
      renderer="antialias: true"
      embedded
    >
      <a-camera position="0 1.6 5"></a-camera>
      <a-entity cursor="rayOrigin:mouse"></a-entity>

      <a-entity
        laser-controls="hand: right"
        raycaster="objects: .clickable"
        super-hands
      ></a-entity>
      <a-entity
        laser-controls="hand: left"
        raycaster="objects: .clickable"
        super-hands
      ></a-entity>

      {/* no actual placeholder rn */}
      <a-sky src="/placeholder.svg?height=2048&width=4096" color="#1a1a2e" />

      <a-plane
        rotation="-90 0 0"
        width="50"
        height="50"
        color="#8B0000"
        material="roughness: 0.8"
        position="0 0 0"
        static-body
      ></a-plane>

      <a-plane
        rotation="-90 0 0"
        width="48"
        height="48"
        color="#A0522D"
        material="roughness: 0.9; opacity: 0.3"
        position="0 0.01 0"
      ></a-plane>

      {/* to do: make these 5 in a ring, also make them controllable*/}
      <MovieCard position="0 2.5 -8" />

      <a-plane
        position="0 3 -12"
        width="20"
        height="12"
        color="#000000"
        material="shader: flat"
      ></a-plane>

      <a-box
        position="0 3 -12.1"
        width="21"
        height="13"
        depth="0.2"
        color="#8B4513"
        material="metalness: 0.3; roughness: 0.7"
      ></a-box>

      {/* seat rows */}
      <a-entity position="0 0 2">
        {Array.from({ length: 8 }, (_, i) => (
          <a-entity key={`seat-1-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`}>
            <a-box
              width="1"
              height="0.1"
              depth="1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="0 0.4 -0.4"
              width="1"
              height="0.8"
              depth="0.1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="-0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
            <a-box
              position="0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
          </a-entity>
        ))}
      </a-entity>

      <a-entity position="0 0 4">
        {Array.from({ length: 8 }, (_, i) => (
          <a-entity key={`seat-2-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`}>
            <a-box
              width="1"
              height="0.1"
              depth="1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="0 0.4 -0.4"
              width="1"
              height="0.8"
              depth="0.1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="-0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
            <a-box
              position="0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
          </a-entity>
        ))}
      </a-entity>

      <a-entity position="0 0.2 6">
        {Array.from({ length: 8 }, (_, i) => (
          <a-entity key={`seat-3-${i}`} position={`${(i - 3.5) * 1.2} 0.5 0`}>
            <a-box
              width="1"
              height="0.1"
              depth="1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="0 0.4 -0.4"
              width="1"
              height="0.8"
              depth="0.1"
              color="#8B0000"
              material="roughness: 0.8"
            ></a-box>
            <a-box
              position="-0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
            <a-box
              position="0.45 0.3 -0.2"
              width="0.1"
              height="0.4"
              depth="0.6"
              color="#654321"
            ></a-box>
          </a-entity>
        ))}
      </a-entity>

      {/* walls */}
      <a-plane
        position="-15 4 -5"
        rotation="0 90 0"
        width="30"
        height="8"
        color="#2F1B14"
        material="roughness: 0.9"
      ></a-plane>

      <a-plane
        position="15 4 -5"
        rotation="0 -90 0"
        width="30"
        height="8"
        color="#2F1B14"
        material="roughness: 0.9"
      ></a-plane>

      <a-plane
        position="0 4 10"
        width="30"
        height="8"
        color="#2F1B14"
        material="roughness: 0.9"
      ></a-plane>

      {/* columns */}
      <a-cylinder
        position="-8 4 -2"
        radius="0.5"
        height="8"
        color="#8B4513"
        material="metalness: 0.2; roughness: 0.8"
      ></a-cylinder>
      <a-cylinder
        position="8 4 -2"
        radius="0.5"
        height="8"
        color="#8B4513"
        material="metalness: 0.2; roughness: 0.8"
      ></a-cylinder>

      {/* all red lightings, screen, ceiling and floor */}
      <a-light type="ambient" color="#1a1a2e" intensity="0.3"></a-light>

      <a-light
        type="point"
        position="0 4 -10"
        color="#ffffff"
        intensity="1.5"
        distance="15"
      ></a-light>

      <a-light
        type="spot"
        position="-5 7 0"
        color="#ffaa00"
        intensity="0.8"
        angle="45"
        target="#moviecard"
      ></a-light>
      <a-light
        type="spot"
        position="5 7 0"
        color="#ffaa00"
        intensity="0.8"
        angle="45"
        target="#moviecard"
      ></a-light>

      <a-light
        type="point"
        position="-6 0.2 2"
        color="#ff6b35"
        intensity="0.5"
        distance="3"
      ></a-light>
      <a-light
        type="point"
        position="6 0.2 2"
        color="#ff6b35"
        intensity="0.5"
        distance="3"
      ></a-light>
      <a-light
        type="point"
        position="-6 0.2 6"
        color="#ff6b35"
        intensity="0.5"
        distance="3"
      ></a-light>
      <a-light
        type="point"
        position="6 0.2 6"
        color="#ff6b35"
        intensity="0.5"
        distance="3"
      ></a-light>

      {/* deco elements (barely sucessful currently lul)*/}
      <a-text
        position="-12 6 8"
        value="EXIT"
        color="#00ff00"
        align="center"
        width="8"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      ></a-text>
      <a-text
        position="12 6 8"
        value="EXIT"
        color="#00ff00"
        align="center"
        width="8"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      ></a-text>

      <a-plane
        position="-10.5 5 -11.5"
        width="1"
        height="10"
        color="#8B0000"
        material="roughness: 0.9"
      ></a-plane>
      <a-plane
        position="10.5 5 -11.5"
        width="1"
        height="10"
        color="#8B0000"
        material="roughness: 0.9"
      ></a-plane>

      <a-entity position="-10 1 8">
        <a-cylinder
          radius="1"
          height="2"
          color="#FFD700"
          material="metalness: 0.5; roughness: 0.3"
        ></a-cylinder>
        <a-text
          position="0 1.5 0"
          value="POPCORN"
          color="#ff0000"
          align="center"
          width="6"
        ></a-text>
      </a-entity>
    </a-scene>
  );
};

export default TestVr;
