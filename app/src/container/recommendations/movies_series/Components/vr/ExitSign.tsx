import { DefaultVrComponentProps } from "@/container/types_common";

const ExitSign = ({
  position = "0 0 0",
  rotation = "0 180 0"
}: DefaultVrComponentProps) => {
  return (
    <a-entity position={position} rotation={rotation}>
      {/* main box */}
      <a-box
        position="0 0 0"
        width="0.8"
        height="0.3"
        depth="0.08"
        color="#1a1a1a"
        metalness="0.7"
        roughness="0.4"
      />

      {/* border */}
      <a-box
        position="0 0 0.041"
        width="0.82"
        height="0.32"
        depth="0.001"
        color="#2a2a2a"
        metalness="0.9"
        roughness="0.3"
      />

      {/* inner frame */}
      <a-box
        position="0 0 0.042"
        width="0.76"
        height="0.26"
        depth="0.001"
        color="#0a0a0a"
        metalness="0.8"
        roughness="0.5"
      />

      {/* illuminated background panel */}
      <a-box
        position="0 0 0.043"
        width="0.74"
        height="0.24"
        depth="0.001"
        color="#00ff00"
        emissive="#00ff00"
        emissive-intensity="0.8"
        opacity="0.9"
        transparent="true"
      />

      <a-text
        value="EXIT"
        position="-0.15 0 0.045"
        align="center"
        width="4"
        color="#ffffff"
        font="roboto"
        shader="flat"
      />

      <a-text
        value=">>>"
        position="0.2 0 0.045"
        align="center"
        width="4"
        color="#ffffff"
        font="roboto"
        shader="flat"
      />

      {/* mounting bracket - top */}
      <a-box
        position="0 0.16 0"
        width="0.1"
        height="0.02"
        depth="0.06"
        color="#2a2a2a"
        metalness="0.9"
        roughness="0.3"
      />

      {/* mounting chain - left */}
      <a-cylinder
        position="-0.35 0.25 0"
        radius="0.005"
        height="0.2"
        color="#3a3a3a"
        metalness="0.8"
        roughness="0.4"
      />

      {/* mounting chain - right */}
      <a-cylinder
        position="0.35 0.25 0"
        radius="0.005"
        height="0.2"
        color="#3a3a3a"
        metalness="0.8"
        roughness="0.4"
      />

      {/* ceiling mount points - left */}
      <a-cylinder
        position="-0.35 0.35 0"
        radius="0.015"
        height="0.02"
        color="#4a4a4a"
        metalness="1"
        roughness="0.2"
      />

      {/* ceiling mount points - right */}
      <a-cylinder
        position="0.35 0.35 0"
        radius="0.015"
        height="0.02"
        color="#4a4a4a"
        metalness="1"
        roughness="0.2"
      />

      {/* corner screws - top left */}
      <a-cylinder
        position="-0.38 0.14 0.041"
        radius="0.008"
        height="0.01"
        rotation="90 0 0"
        color="#1a1a1a"
        metalness="0.9"
        roughness="0.3"
      />

      {/* corner screws - top right */}
      <a-cylinder
        position="0.38 0.14 0.041"
        radius="0.008"
        height="0.01"
        rotation="90 0 0"
        color="#1a1a1a"
        metalness="0.9"
        roughness="0.3"
      />

      {/* corner screws - Bottom left */}
      <a-cylinder
        position="-0.38 -0.14 0.041"
        radius="0.008"
        height="0.01"
        rotation="90 0 0"
        color="#1a1a1a"
        metalness="0.9"
        roughness="0.3"
      />

      {/* corner screws - Bottom right */}
      <a-cylinder
        position="0.38 -0.14 0.041"
        radius="0.008"
        height="0.01"
        rotation="90 0 0"
        color="#1a1a1a"
        metalness="0.9"
        roughness="0.3"
      />

      {/* Ventilation Slots - top */}
      <a-box
        position="-0.15 0.12 -0.041"
        width="0.08"
        height="0.01"
        depth="0.001"
        color="#0a0a0a"
      />
      <a-box
        position="0 0.12 -0.041"
        width="0.08"
        height="0.01"
        depth="0.001"
        color="#0a0a0a"
      />
      <a-box
        position="0.15 0.12 -0.041"
        width="0.08"
        height="0.01"
        depth="0.001"
        color="#0a0a0a"
      />

      {/* power LED */}
      <a-circle
        position="0.35 -0.12 0.041"
        radius="0.008"
        rotation="0 0 0"
        color="#00ff00"
        emissive="#00ff00"
        emissive-intensity="2"
      />

      {/* battery indicator */}
      <a-circle
        position="0.32 -0.12 0.041"
        radius="0.006"
        rotation="0 0 0"
        color="#ffaa00"
        emissive="#ffaa00"
        emissive-intensity="1.5"
      />

      {/* point light - front glow */}
      <a-light
        type="point"
        position="0 0 0.1"
        intensity="1.2"
        color="#00ff00"
        distance="2"
        decay="2"
      />

      {/* point light - ambient glow */}
      <a-light
        type="point"
        position="0 0 0"
        intensity="0.8"
        color="#00ff00"
        distance="1.5"
        decay="2"
      />

      {/* spot light - down illumination */}
      <a-light
        type="spot"
        position="0 -0.05 0.05"
        target="#exitFloor"
        intensity="0.5"
        angle="60"
        penumbra="0.5"
        color="#00ff00"
        distance="3"
        decay="1.5"
      />

      {/* floor target (invisible) */}
      <a-entity id="exitFloor" position="0 -2 0" />
    </a-entity>
  );
};

export default ExitSign;
