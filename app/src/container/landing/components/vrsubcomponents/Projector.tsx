import { DefaultVrComponentProps } from "@/container/types_common";

const Projector = ({
  position = "0 0 0",
  rotation = "0 0 0"
}: DefaultVrComponentProps) => {
  return (
    <a-entity position={position} rotation={rotation}>
      {/* a bit of light */}
      <a-light type="point" position="0 2 0" intensity="0.5" color="#ffd700" />

      {/* body */}
      <a-box
        position="0 0 0"
        width="0.6"
        height="0.35"
        depth="0.4"
        color="#2a2a2a"
        metalness="0.8"
        roughness="0.3"
      />

      {/* top vent */}
      <a-box
        position="0 0.2 0"
        width="0.5"
        height="0.05"
        depth="0.3"
        color="#1a1a1a"
        metalness="0.6"
        roughness="0.5"
      />

      {/* slits for the vents */}
      <a-box
        position="-0.15 0.2 0"
        width="0.03"
        height="0.06"
        depth="0.25"
        color="#0a0a0a"
      />
      <a-box
        position="-0.1 0.2 0"
        width="0.03"
        height="0.06"
        depth="0.25"
        color="#0a0a0a"
      />
      <a-box
        position="-0.05 0.2 0"
        width="0.03"
        height="0.06"
        depth="0.25"
        color="#0a0a0a"
      />
      <a-box
        position="0 0.2 0"
        width="0.03"
        height="0.06"
        depth="0.25"
        color="#0a0a0a"
      />
      <a-box
        position="0.05 0.2 0"
        width="0.03"
        height="0.06"
        depth="0.25"
        color="#0a0a0a"
      />
      <a-box
        position="0.1 0.2 0"
        width="0.03"
        height="0.06"
        depth="0.25"
        color="#0a0a0a"
      />
      <a-box
        position="0.15 0.2 0"
        width="0.03"
        height="0.06"
        depth="0.25"
        color="#0a0a0a"
      />

      {/* lens front */}
      <a-cylinder
        position="0 0 -0.3"
        radius="0.15"
        height="0.2"
        rotation="90 0 0"
        color="#1a1a1a"
        metalness="0.9"
        roughness="0.2"
      />

      {/* lens */}
      <a-cylinder
        position="0 0 -0.38"
        radius="0.12"
        height="0.05"
        rotation="90 0 0"
        color="#4a90e2"
        metalness="0.1"
        roughness="0.1"
        opacity="0.8"
        transparent="true"
      />

      {/* inner lens ring */}
      <a-torus
        position="0 0 -0.38"
        radius="0.1"
        radius-tubular="0.01"
        rotation="90 0 0"
        color="#0a0a0a"
        metalness="0.9"
        roughness="0.3"
      />

      {/* lens glow */}
      <a-cylinder
        position="0 0 -0.4"
        radius="0.11"
        height="0.02"
        rotation="90 0 0"
        color="#ffffff"
        emissive="#ffffff"
        emissive-intensity="2"
        opacity="0.6"
        transparent="true"
      />

      {/* point light from projector */}
      <a-light
        type="point"
        position="0 0 -0.4"
        intensity="1"
        color="#ffffff"
        distance="10"
        decay="2"
      />

      {/* spot light for projection beam */}
      <a-light
        type="spot"
        position="0 0 -0.4"
        target="#projectionTarget"
        intensity="4"
        angle="45"
        penumbra="0.3"
        color="#ffffff"
        distance="10"
        decay="1.5"
      />

      {/* target (invisible) */}
      <a-entity id="projectionTarget" position="0 0 -5" />

      {/* side panel */}
      <a-box
        position="0.32 0 0.1"
        width="0.05"
        height="0.25"
        depth="0.15"
        color="#1a1a1a"
        metalness="0.7"
        roughness="0.4"
      />

      {/* colorful buttons */}
      <a-circle
        position="0.35 0.08 0.1"
        radius="0.015"
        rotation="0 90 0"
        color="#00ff00"
        emissive="#00ff00"
        emissive-intensity="0.5"
      />
      <a-circle
        position="0.35 0.04 0.1"
        radius="0.015"
        rotation="0 90 0"
        color="#ff0000"
        emissive="#ff0000"
        emissive-intensity="0.5"
      />
      <a-circle
        position="0.35 0 0.1"
        radius="0.015"
        rotation="0 90 0"
        color="#ffaa00"
        emissive="#ffaa00"
        emissive-intensity="0.5"
      />

      {/* focus ring */}
      <a-torus
        position="0 0 -0.25"
        radius="0.16"
        radius-tubular="0.02"
        rotation="90 0 0"
        color="#3a3a3a"
        metalness="0.8"
        roughness="0.4"
      />

      {/* mounting bracket */}
      <a-box
        position="0 -0.2 0"
        width="0.5"
        height="0.05"
        depth="0.3"
        color="#2a2a2a"
        metalness="0.9"
        roughness="0.3"
      />

      {/* screws */}
      <a-cylinder
        position="-0.2 -0.22 0.1"
        radius="0.015"
        height="0.03"
        color="#4a4a4a"
        metalness="1"
        roughness="0.2"
      />
      <a-cylinder
        position="0.2 -0.22 0.1"
        radius="0.015"
        height="0.03"
        color="#4a4a4a"
        metalness="1"
        roughness="0.2"
      />
      <a-cylinder
        position="-0.2 -0.22 -0.1"
        radius="0.015"
        height="0.03"
        color="#4a4a4a"
        metalness="1"
        roughness="0.2"
      />
      <a-cylinder
        position="0.2 -0.22 -0.1"
        radius="0.015"
        height="0.03"
        color="#4a4a4a"
        metalness="1"
        roughness="0.2"
      />

      {/* self promo cough cough */}
      <a-text
        value="MindReel"
        position="0 0.2 0.21"
        align="center"
        width="0.8"
        color="#ffd700"
        font="roboto"
      />

      {/* model */}
      <a-text
        value="XR-5000"
        position="0 0.05 0.21"
        align="center"
        width="0.5"
        color="#888888"
        font="roboto"
      />

      {/* back exhaust */}
      <a-box
        position="0 0 0.22"
        width="0.3"
        height="0.2"
        depth="0.05"
        color="#1a1a1a"
        metalness="0.6"
        roughness="0.6"
      />

      {/* grille lines */}
      <a-box
        position="-0.1 0 0.23"
        width="0.02"
        height="0.15"
        depth="0.02"
        color="#0a0a0a"
      />
      <a-box
        position="-0.05 0 0.23"
        width="0.02"
        height="0.15"
        depth="0.02"
        color="#0a0a0a"
      />
      <a-box
        position="0 0 0.23"
        width="0.02"
        height="0.15"
        depth="0.02"
        color="#0a0a0a"
      />
      <a-box
        position="0.05 0 0.23"
        width="0.02"
        height="0.15"
        depth="0.02"
        color="#0a0a0a"
      />
      <a-box
        position="0.1 0 0.23"
        width="0.02"
        height="0.15"
        depth="0.02"
        color="#0a0a0a"
      />

      {/* cable */}
      <a-cylinder
        position="0.15 -0.15 0.2"
        radius="0.01"
        height="0.3"
        rotation="45 0 0"
        color="#0a0a0a"
      />
    </a-entity>
  );
};

export default Projector;
