import { DefaultVrComponentProps } from "@/container/types_common";

export default function PopcornStand({
  position = "0 0 0",
  rotation = "0 0 0"
}: DefaultVrComponentProps) {
  return (
    <a-entity position={position} rotation={rotation}>
      {/* base counter structure */}
      <a-box
        position="0 0.5 0"
        width="2.5"
        height="1"
        depth="1.2"
        color="#8B4513"
        metalness="0.3"
        roughness="0.6"
      />

      {/* counter top */}
      <a-box
        position="0 1.05 0"
        width="2.6"
        height="0.1"
        depth="1.3"
        color="#654321"
        metalness="0.4"
        roughness="0.5"
      />

      {/* glass display case frame */}
      <a-box
        position="0 1.5 0"
        width="2.4"
        height="0.8"
        depth="1.1"
        color="#333333"
        opacity="0.3"
        metalness="0.8"
        roughness="0.2"
      />

      {/* glass panels */}
      <a-box
        position="0 1.5 0.55"
        width="2.3"
        height="0.75"
        depth="0.05"
        color="#ffffff"
        opacity="0.3"
        transparent={true}
        metalness="0.9"
        roughness="0.1"
      />
      <a-box
        position="0 1.5 -0.55"
        width="2.3"
        height="0.75"
        depth="0.05"
        color="#ffffff"
        opacity="0.3"
        transparent={true}
        metalness="0.9"
        roughness="0.1"
      />
      <a-box
        position="1.15 1.5 0"
        width="0.05"
        height="0.75"
        depth="1.0"
        color="#ffffff"
        opacity="0.3"
        transparent={true}
        metalness="0.9"
        roughness="0.1"
      />
      <a-box
        position="-1.15 1.5 0"
        width="0.05"
        height="0.75"
        depth="1.0"
        color="#ffffff"
        opacity="0.3"
        transparent={true}
        metalness="0.9"
        roughness="0.1"
      />

      {/* popcorn machine body */}
      <a-box
        position="0 1.4 0"
        width="0.6"
        height="0.6"
        depth="0.6"
        color="#DC143C"
        metalness="0.6"
        roughness="0.3"
      />

      {/* popcorn machine glass dome */}
      <a-sphere
        position="0 1.85 0"
        radius="0.35"
        color="#ffffff"
        opacity="0.4"
        transparent={true}
        metalness="0.9"
        roughness="0.1"
        segments-height="8"
        segments-width="16"
      />

      {/* kettle */}
      <a-cylinder
        position="0 1.7 0"
        radius="0.2"
        height="0.25"
        color="#FFD700"
        metalness="0.9"
        roughness="0.2"
      />

      {/* kettle handle */}
      <a-torus
        position="0 1.85 0"
        radius="0.15"
        radius-tubular="0.02"
        color="#FFD700"
        metalness="0.9"
        roughness="0.2"
        rotation="90 0 0"
      />

      {/* machine top vent */}
      <a-cone
        position="0 2.25 0"
        radius-bottom="0.15"
        radius-top="0.1"
        height="0.2"
        color="#DC143C"
        metalness="0.6"
        roughness="0.3"
      />

      {/* popcorn inside display */}
      <a-sphere
        position="-0.6 1.3 0.2"
        radius="0.15"
        color="#FFFACD"
        roughness="0.8"
      />
      <a-sphere
        position="-0.5 1.25 -0.1"
        radius="0.12"
        color="#FFFACD"
        roughness="0.8"
      />
      <a-sphere
        position="-0.7 1.35 0"
        radius="0.13"
        color="#FFF8DC"
        roughness="0.8"
      />
      <a-sphere
        position="0.6 1.3 0.15"
        radius="0.14"
        color="#FFFACD"
        roughness="0.8"
      />
      <a-sphere
        position="0.55 1.28 -0.15"
        radius="0.11"
        color="#FFF8DC"
        roughness="0.8"
      />
      <a-sphere
        position="0.7 1.32 0.05"
        radius="0.13"
        color="#FFFACD"
        roughness="0.8"
      />

      {/* cup dispenser - left side */}
      <a-cylinder
        position="-0.9 1.4 0.3"
        radius="0.12"
        height="0.5"
        color="#ffffff"
        roughness="0.3"
      />
      <a-cylinder
        position="-0.9 1.4 0.3"
        radius="0.13"
        height="0.05"
        color="#DC143C"
        metalness="0.5"
        roughness="0.4"
      />

      {/* napkin holder - right side */}
      <a-box
        position="0.9 1.25 0.3"
        width="0.25"
        height="0.3"
        depth="0.2"
        color="#8B4513"
        metalness="0.4"
        roughness="0.5"
      />
      <a-box
        position="0.9 1.3 0.3"
        width="0.22"
        height="0.15"
        depth="0.18"
        color="#ffffff"
        roughness="0.7"
      />

      {/* striped awning top */}
      <a-box
        position="0 2.0 0"
        width="2.6"
        height="0.05"
        depth="1.3"
        color="#DC143C"
        metalness="0.3"
        roughness="0.6"
      />

      {/* awning stripes */}
      <a-box
        position="-0.8 2.025 0"
        width="0.4"
        height="0.06"
        depth="1.3"
        color="#ffffff"
        roughness="0.6"
      />
      <a-box
        position="0 2.025 0"
        width="0.4"
        height="0.06"
        depth="1.3"
        color="#ffffff"
        roughness="0.6"
      />
      <a-box
        position="0.8 2.025 0"
        width="0.4"
        height="0.06"
        depth="1.3"
        color="#ffffff"
        roughness="0.6"
      />

      {/* sign */}
      <a-box
        position="0 2.3 0"
        width="1.8"
        height="0.4"
        depth="0.1"
        color="#FFD700"
        metalness="0.7"
        roughness="0.3"
      />

      <a-text
        value="POP"
        position="-0.45 2.25 0.06"
        align="center"
        color="#DC143C"
        width="5"
        font="roboto"
        shader="flat"
      />
      <a-text
        value="CORN"
        position="0.45 2.25 0.06"
        align="center"
        color="#DC143C"
        width="5"
        font="roboto"
        shader="flat"
      />
      {/* sign border lights */}
      <a-sphere
        position="-0.85 2.45 0.05"
        radius="0.04"
        color="#ffffff"
        emissive="#ffff00"
        emissive-intensity="2"
      />
      <a-sphere
        position="-0.6 2.45 0.05"
        radius="0.04"
        color="#ffffff"
        emissive="#ffff00"
        emissive-intensity="2"
      />
      <a-sphere
        position="-0.35 2.45 0.05"
        radius="0.04"
        color="#ffffff"
        emissive="#ffff00"
        emissive-intensity="2"
      />
      <a-sphere
        position="-0.1 2.45 0.05"
        radius="0.04"
        color="#ffffff"
        emissive="#ffff00"
        emissive-intensity="2"
      />
      <a-sphere
        position="0.1 2.45 0.05"
        radius="0.04"
        color="#ffffff"
        emissive="#ffff00"
        emissive-intensity="2"
      />
      <a-sphere
        position="0.35 2.45 0.05"
        radius="0.04"
        color="#ffffff"
        emissive="#ffff00"
        emissive-intensity="2"
      />
      <a-sphere
        position="0.6 2.45 0.05"
        radius="0.04"
        color="#ffffff"
        emissive="#ffff00"
        emissive-intensity="2"
      />
      <a-sphere
        position="0.85 2.45 0.05"
        radius="0.04"
        color="#ffffff"
        emissive="#ffff00"
        emissive-intensity="2"
      />

      {/* price board */}
      <a-entity position="-1.2 1.70 0.65" rotation="0 10 0">
        <a-box
          width="0.5"
          height="0.6"
          depth="0.05"
          color="#111"
          material="roughness: 0.6; metalness: 0.2; envMapIntensity: 0.3"
          shadow="receive: true; cast: true"
        >
          {/* frame */}
          <a-box
            width="0.52"
            height="0.62"
            depth="0.03"
            color="#333"
            position="0 0 -0.02"
            material="roughness: 0.8"
          ></a-box>
        </a-box>
        <a-text
          value="PRICE BOARD"
          position="0 0.2 0.03"
          align="center"
          color="#FFD700"
          width="1.2"
          font="kelsonsans"
          shader="msdf"
          negate="false"
        ></a-text>
        {/* divider line */}
        <a-plane
          position="0 0.13 0.03"
          height="0.002"
          width="0.35"
          color="#FFD700"
          material="shader: flat"
        ></a-plane>

        <a-text
          value="SMALL\n$5"
          position="0 0.03 0.03"
          align="center"
          color="#FFFFFF"
          width="1.2"
          font="roboto"
          shader="msdf"
          negate="false"
        ></a-text>
        <a-text
          value="LARGE\n$8"
          position="0 -0.1 0.03"
          align="center"
          color="#FFFFFF"
          width="1.2"
          font="roboto"
          shader="msdf"
          negate="false"
        ></a-text>
      </a-entity>

      {/* butter dispenser */}
      <a-cylinder
        position="0.9 1.25 -0.2"
        radius="0.08"
        height="0.35"
        color="#FFD700"
        metalness="0.8"
        roughness="0.2"
      />
      <a-cylinder
        position="0.9 1.45 -0.2"
        radius="0.06"
        height="0.1"
        color="#DC143C"
        metalness="0.5"
        roughness="0.4"
      />

      {/* stand lighting */}
      <a-light
        type="point"
        position="0 2.2 0"
        color="#FFD700"
        intensity="0.8"
        distance="3"
      />
      <a-light
        type="point"
        position="0 1.5 0"
        color="#ffffff"
        intensity="0.5"
        distance="2"
      />
    </a-entity>
  );
}
