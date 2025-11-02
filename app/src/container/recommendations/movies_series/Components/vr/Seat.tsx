import { DefaultVrComponentProps } from "@/container/types_common";
import { useMemo } from "react";

// Simple seat for distant rows (only 5 primitives!)
function SimpleSeat({
  position = "0 0 0",
  rotation = "0 180 0"
}: DefaultVrComponentProps) {
  return (
    <a-entity position={position} rotation={rotation}>
      {/* Seat cushion */}
      <a-box
        position="0 0 0"
        width="0.95"
        height="0.18"
        depth="0.95"
        color="#8b2424"
        material="roughness: 0.6"
      ></a-box>

      {/* Backrest */}
      <a-box
        position="0 0.55 -0.42"
        width="0.95"
        height="1"
        depth="0.16"
        color="#8b2424"
        material="roughness: 0.6"
      ></a-box>

      {/* Left armrest */}
      <a-box
        position="-0.475 0.35 -0.15"
        width="0.14"
        height="0.16"
        depth="0.7"
        color="#2d1810"
        material="roughness: 0.4"
      ></a-box>

      {/* Right armrest */}
      <a-box
        position="0.475 0.35 -0.15"
        width="0.14"
        height="0.16"
        depth="0.7"
        color="#2d1810"
        material="roughness: 0.4"
      ></a-box>

      {/* Single leg representation */}
      <a-box
        position="0 -0.25 0"
        width="0.7"
        height="0.5"
        depth="0.08"
        color="#1a1a1a"
        material="roughness: 0.2"
      ></a-box>
    </a-entity>
  );
}

// Detailed seat for close rows (15 primitives)
function DetailedSeat({
  position = "0 0 0",
  rotation = "0 180 0"
}: DefaultVrComponentProps) {
  const materials = useMemo(
    () => ({
      redFabric: "roughness: 0.6; metalness: 0.1",
      darkWood: "roughness: 0.4; metalness: 0.4",
      lightWood: "roughness: 0.5; metalness: 0.2",
      metal: "metalness: 0.8; roughness: 0.2"
    }),
    []
  );

  return (
    <a-entity position={position} rotation={rotation}>
      {/* SEAT CUSHION */}
      <a-entity>
        <a-box
          position="0 0 0"
          width="0.95"
          height="0.18"
          depth="0.95"
          color="#8b2424"
          material={materials.redFabric}
        ></a-box>
        <a-cylinder
          position="0 0 0.475"
          radius="0.09"
          height="0.95"
          rotation="0 0 90"
          color="#8b2424"
          material={materials.redFabric}
        ></a-cylinder>
      </a-entity>

      {/* BACKREST */}
      <a-entity>
        <a-box
          position="0 0.55 -0.42"
          width="0.95"
          height="1"
          depth="0.16"
          color="#8b2424"
          material={materials.redFabric}
        ></a-box>
        <a-cylinder
          position="0 1.05 -0.42"
          radius="0.08"
          height="0.95"
          rotation="0 0 90"
          color="#8b2424"
          material={materials.redFabric}
        ></a-cylinder>
        <a-box
          position="0 0.4 -0.34"
          width="0.7"
          height="0.3"
          depth="0.08"
          color="#9b2a2a"
          material="roughness: 0.5; metalness: 0.1"
        ></a-box>
      </a-entity>

      {/* LEFT ARMREST */}
      <a-entity>
        <a-box
          position="-0.475 0.35 -0.15"
          width="0.14"
          height="0.12"
          depth="0.7"
          color="#2d1810"
          material={materials.darkWood}
        ></a-box>
        <a-box
          position="-0.475 0.42 -0.15"
          width="0.13"
          height="0.04"
          depth="0.68"
          color="#3d2820"
          material={materials.lightWood}
        ></a-box>
        <a-cylinder
          position="-0.475 0.45 0.15"
          radius="0.055"
          height="0.06"
          color="#1a1410"
          material="roughness: 0.3; metalness: 0.6"
        ></a-cylinder>
      </a-entity>

      {/* RIGHT ARMREST */}
      <a-entity>
        <a-box
          position="0.475 0.35 -0.15"
          width="0.14"
          height="0.12"
          depth="0.7"
          color="#2d1810"
          material={materials.darkWood}
        ></a-box>
        <a-box
          position="0.475 0.42 -0.15"
          width="0.13"
          height="0.04"
          depth="0.68"
          color="#3d2820"
          material={materials.lightWood}
        ></a-box>
        <a-cylinder
          position="0.475 0.45 0.15"
          radius="0.055"
          height="0.06"
          color="#1a1410"
          material="roughness: 0.3; metalness: 0.6"
        ></a-cylinder>
      </a-entity>

      {/* LEGS - Simplified */}
      <a-entity>
        <a-cylinder
          position="-0.35 -0.25 0.35"
          radius="0.04"
          height="0.5"
          color="#1a1a1a"
          material={materials.metal}
        ></a-cylinder>
        <a-cylinder
          position="0.35 -0.25 0.35"
          radius="0.04"
          height="0.5"
          color="#1a1a1a"
          material={materials.metal}
        ></a-cylinder>
        <a-cylinder
          position="-0.35 -0.25 -0.35"
          radius="0.04"
          height="0.5"
          color="#1a1a1a"
          material={materials.metal}
        ></a-cylinder>
        <a-cylinder
          position="0.35 -0.25 -0.35"
          radius="0.04"
          height="0.5"
          color="#1a1a1a"
          material={materials.metal}
        ></a-cylinder>
      </a-entity>
    </a-entity>
  );
}

// Main seat component with LOD
export default function Seat({
  position = "0 0 0",
  rotation = "0 180 0",
  rowIndex = 0
}: DefaultVrComponentProps & { rowIndex?: number }) {
  // Use simple seats for rows 4-7 (far from camera)
  // Use detailed seats for rows 0-3 (close to camera)
  const useSimple = rowIndex >= 4;

  if (useSimple) {
    return <SimpleSeat position={position} rotation={rotation} />;
  }

  return <DetailedSeat position={position} rotation={rotation} />;
}
