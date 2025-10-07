import { useState, useEffect } from "react";

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
  position = "0 3.5 -4" // Lowered position to be closer to ground
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
      {/* Background overlay for focus effect */}
      <a-plane
        width="20" // Reduced from 50 to 20 for smaller overlay
        height="12" // Reduced from 30 to 12 for smaller overlay
        color="#000000"
        material={`shader: flat; opacity: ${modalOpacity * 0.7}`}
        position="0 0 -0.5"
      ></a-plane>

      {/* Modal container */}
      <a-plane
        width="6" // Reduced from 12 to 6 for smaller modal
        height="4" // Reduced from 8 to 4 for smaller modal
        color="#1a1a1a"
        material={`shader: flat; opacity: ${modalOpacity * 0.95}`}
        position="0 0 0"
      ></a-plane>

      {/* Modal border */}
      <a-plane
        width="6.1" // Adjusted border size to match new modal size
        height="4.1" // Adjusted border size to match new modal size
        color="#333333"
        material={`shader: flat; opacity: ${modalOpacity * 0.8}`}
        position="0 0 -0.01"
      ></a-plane>

      {/* Modal title */}
      <a-text
        value={modalTitle}
        position="-2.8 1.6 0.01" // Adjusted position for smaller modal
        align="left"
        color="#FFFFFF"
        width="6" // Reduced width for better fit
        material={`opacity: ${modalOpacity}`}
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      ></a-text>

      {/* Modal content */}
      <a-text
        value={content}
        position="-2.8 1 0.01" // Adjusted position for smaller modal
        align="left"
        color="#CCCCCC"
        width="4" // Reduced width for better text wrapping
        wrap-count="60" // Reduced wrap count for smaller modal
        material={`opacity: ${modalOpacity}`}
        font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
      ></a-text>

      {/* Close button */}
      <a-entity position="2.2 -1.5 0.01">
        <a-plane
          width="1.2" // Slightly smaller close button
          height="0.5" // Slightly smaller close button
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

      {/* Close icon in top right */}
      <a-image
        src={closeIconSvg}
        width="0.25" // Slightly smaller close icon
        height="0.25" // Slightly smaller close icon
        material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
        position="2.8 1.8 0.01" // Adjusted position for smaller modal
        class="clickable"
        onClick={onClose}
      ></a-image>
    </a-entity>
  );
};

export default DetailModal;
