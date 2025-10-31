import { useEffect, useState } from "react";

interface DetailModalProps {
  isVisible: boolean;
  contentType: "description" | "plot" | null;
  description: string;
  plot: string;
  onClose: () => void;
  position?: string;
}

const DetailModal = ({
  isVisible,
  contentType,
  description,
  plot,
  onClose,
  position = "0 3.5 -4"
}: DetailModalProps) => {
  const [modalOpacity, setModalOpacity] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setModalOpacity(1);
    } else {
      setModalOpacity(0);
    }
  }, [isVisible]);

  if (!isVisible || !contentType) return null;

  const content = contentType === "description" ? description : plot;
  const modalTitle =
    contentType === "description" ? "Full Description" : "Full Plot";

  const closeIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  `)}`;

  return (
    <a-entity position={position}>
      <a-plane
        width="20"
        height="12"
        color="#000000"
        material={`shader: flat; opacity: ${modalOpacity * 0.7}`}
        position="0 0 -0.5"
      ></a-plane>

      <a-plane
        width="6"
        height="4"
        color="#1a1a1a"
        material={`shader: flat; opacity: ${modalOpacity * 0.95}`}
        position="0 0 0"
      ></a-plane>

      <a-plane
        width="6.1"
        height="4.1"
        color="#333333"
        material={`shader: flat; opacity: ${modalOpacity * 0.8}`}
        position="0 0 -0.01"
      ></a-plane>

      <a-text
        value={modalTitle}
        position="-2.8 1.6 0.01"
        align="left"
        color="#FFFFFF"
        width="6"
        material={`opacity: ${modalOpacity}`}
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      ></a-text>

      <a-text
        value={content}
        position="-2.8 0.1 0.01"
        align="left"
        color="#CCCCCC"
        width="4"
        wrap-count="60"
        material={`opacity: ${modalOpacity}`}
        font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
      ></a-text>

      <a-entity position="2.2 -1.5 0.01">
        <a-plane
          width="1.2"
          height="0.5"
          color="#DC2626"
          material={`shader: flat; opacity: ${modalOpacity}`}
          position="0 0 0"
          class="clickable"
          onClick={onClose}
        ></a-plane>
        <a-text
          value="Close"
          position="0 0 0.01"
          align="center"
          color="#FFFFFF"
          width="4"
          material={`opacity: ${modalOpacity}`}
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
          class="clickable"
          onClick={onClose}
        ></a-text>
      </a-entity>

      <a-image
        src={closeIconSvg}
        width="0.25"
        height="0.25"
        material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
        position="2.8 1.8 0.01"
        class="clickable"
        onClick={onClose}
      ></a-image>
    </a-entity>
  );
};

export default DetailModal;
