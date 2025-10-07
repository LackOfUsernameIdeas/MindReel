import { DefaultVrComponentProps } from "@/container/types_common";

export default function Seat({
  position = "0 0 0",
  rotation = "0 180 0"
}: DefaultVrComponentProps) {
  return (
    <a-entity position={position} rotation={rotation}>
      {/* seat cushion - main */}
      <a-box
        position="0 0 0"
        width="0.95"
        height="0.18"
        depth="0.95"
        color="#8b2424"
        material="roughness: 0.6; metalness: 0.1"
      ></a-box>

      {/* seat cushion - front */}
      <a-cylinder
        position="0 0 0.475"
        radius="0.09"
        height="0.95"
        rotation="0 0 90"
        color="#8b2424"
        material="roughness: 0.6; metalness: 0.1"
      ></a-cylinder>

      {/* seat cushion - stitching lines */}
      <a-box
        position="-0.25 0.095 0"
        width="0.02"
        height="0.01"
        depth="0.8"
        color="#5a1515"
      ></a-box>
      <a-box
        position="0.25 0.095 0"
        width="0.02"
        height="0.01"
        depth="0.8"
        color="#5a1515"
      ></a-box>

      {/* backrest - main */}
      <a-box
        position="0 0.55 -0.42"
        width="0.95"
        height="1"
        depth="0.16"
        color="#8b2424"
        material="roughness: 0.6; metalness: 0.1"
      ></a-box>

      {/* backrest - top */}
      <a-cylinder
        position="0 1.05 -0.42"
        radius="0.08"
        height="0.95"
        rotation="0 0 90"
        color="#8b2424"
        material="roughness: 0.6; metalness: 0.1"
      ></a-cylinder>

      {/* backrest - support */}
      <a-box
        position="0 0.4 -0.34"
        width="0.7"
        height="0.3"
        depth="0.08"
        color="#9b2a2a"
        material="roughness: 0.5; metalness: 0.1"
      ></a-box>

      {/* backrest - stitching */}
      <a-box
        position="-0.25 0.55 -0.33"
        width="0.02"
        height="0.8"
        depth="0.01"
        color="#5a1515"
      ></a-box>
      <a-box
        position="0.25 0.55 -0.33"
        width="0.02"
        height="0.8"
        depth="0.01"
        color="#5a1515"
      ></a-box>

      {/* left armrest - main */}
      <a-box
        position="-0.475 0.35 -0.15"
        width="0.14"
        height="0.12"
        depth="0.7"
        color="#2d1810"
        material="roughness: 0.4; metalness: 0.4"
      ></a-box>

      {/* left armrest - top */}
      <a-box
        position="-0.475 0.42 -0.15"
        width="0.13"
        height="0.04"
        depth="0.68"
        color="#3d2820"
        material="roughness: 0.5; metalness: 0.2"
      ></a-box>

      {/* left armrest - support */}
      <a-box
        position="-0.475 0.15 -0.15"
        width="0.1"
        height="0.3"
        depth="0.1"
        color="#2d1810"
        material="roughness: 0.4; metalness: 0.4"
      ></a-box>

      {/* left armrest - cup holder */}
      <a-cylinder
        position="-0.475 0.45 0.15"
        radius="0.055"
        height="0.06"
        color="#1a1410"
        material="roughness: 0.3; metalness: 0.6"
      ></a-cylinder>
      <a-cylinder
        position="-0.475 0.42 0.15"
        radius="0.045"
        height="0.04"
        color="#0a0a0a"
        material="roughness: 0.2; metalness: 0.7"
      ></a-cylinder>

      {/* right armrest - main */}
      <a-box
        position="0.475 0.35 -0.15"
        width="0.14"
        height="0.12"
        depth="0.7"
        color="#2d1810"
        material="roughness: 0.4; metalness: 0.4"
      ></a-box>

      {/* rightg armrest - top */}
      <a-box
        position="0.475 0.42 -0.15"
        width="0.13"
        height="0.04"
        depth="0.68"
        color="#3d2820"
        material="roughness: 0.5; metalness: 0.2"
      ></a-box>

      {/* right armrest - support */}
      <a-box
        position="0.475 0.15 -0.15"
        width="0.1"
        height="0.3"
        depth="0.1"
        color="#2d1810"
        material="roughness: 0.4; metalness: 0.4"
      ></a-box>

      {/* right armrest - cup holder */}
      <a-cylinder
        position="0.475 0.45 0.15"
        radius="0.055"
        height="0.06"
        color="#1a1410"
        material="roughness: 0.3; metalness: 0.6"
      ></a-cylinder>
      <a-cylinder
        position="0.475 0.42 0.15"
        radius="0.045"
        height="0.04"
        color="#0a0a0a"
        material="roughness: 0.2; metalness: 0.7"
      ></a-cylinder>

      {/* front left leg */}
      <a-cylinder
        position="-0.35 -0.25 0.35"
        radius="0.04"
        height="0.5"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-cylinder>
      <a-sphere
        position="-0.35 -0.5 0.35"
        radius="0.05"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-sphere>

      {/* front right leg */}
      <a-cylinder
        position="0.35 -0.25 0.35"
        radius="0.04"
        height="0.5"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-cylinder>
      <a-sphere
        position="0.35 -0.5 0.35"
        radius="0.05"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-sphere>

      {/* back left leg */}
      <a-cylinder
        position="-0.35 -0.25 -0.35"
        radius="0.04"
        height="0.5"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-cylinder>
      <a-sphere
        position="-0.35 -0.5 -0.35"
        radius="0.05"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-sphere>

      {/* back right leg */}
      <a-cylinder
        position="0.35 -0.25 -0.35"
        radius="0.04"
        height="0.5"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-cylinder>
      <a-sphere
        position="0.35 -0.5 -0.35"
        radius="0.05"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-sphere>

      {/* leg cross support - front */}
      <a-cylinder
        position="0 -0.4 0.35"
        radius="0.02"
        height="0.7"
        rotation="0 0 90"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-cylinder>

      {/* leg cross support - back */}
      <a-cylinder
        position="0 -0.4 -0.35"
        radius="0.02"
        height="0.7"
        rotation="0 0 90"
        color="#1a1a1a"
        material="metalness: 0.8; roughness: 0.2"
      ></a-cylinder>
    </a-entity>
  );
}
