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
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setModalOpacity(1);
      setCurrentPage(0); // Reset to first page when opening
    } else {
      setModalOpacity(0);
    }
  }, [isVisible, contentType]);

  if (!isVisible || !contentType) return null;

  const fullContent = contentType === "description" ? description : plot;
  const modalTitle =
    contentType === "description" ? "Full Description" : "Full Plot";

  // Pagination logic - approximately 1100 chars per page
  const CHARS_PER_PAGE = 1100;
  const totalPages = Math.ceil(fullContent.length / CHARS_PER_PAGE);
  const startIdx = currentPage * CHARS_PER_PAGE;
  const endIdx = Math.min(startIdx + CHARS_PER_PAGE, fullContent.length);
  const content = fullContent.substring(startIdx, endIdx);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const infoIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 50 50" fill="#db1303">
      <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
    </svg>`)}`;

  const leftArrowSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>`)}`;

  const rightArrowSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>`)}`;

  return (
    <a-entity position={position}>
      {/* Dark overlay background */}
      <a-plane
        width="30"
        height="18"
        color="#000000"
        material={`shader: flat; opacity: ${modalOpacity * 0.75}`}
        position="0 0 -0.5"
      />

      {/* Outer glow effect */}
      <a-plane
        width="11.2"
        height="7.2"
        color="#db1303"
        material={`shader: flat; opacity: ${modalOpacity * 0.2}`}
        position="0 0 -0.04"
      />

      {/* Shadow/depth layer */}
      <a-plane
        width="11.1"
        height="7.1"
        color="#000000"
        material={`shader: flat; opacity: ${modalOpacity * 0.7}`}
        position="0 0 -0.03"
      />

      {/* Border */}
      <a-plane
        width="11"
        height="7"
        color="#2a2a2a"
        material={`shader: flat; opacity: ${modalOpacity * 0.95}`}
        position="0 0 -0.02"
      />

      {/* Main card background */}
      <a-plane
        width="10.8"
        height="6.8"
        color="#0f0f0f"
        material={`shader: flat; opacity: ${modalOpacity * 0.98}`}
        position="0 0 0"
      />

      {/* Top decorative bar */}
      <a-plane
        width="10.8"
        height="0.2"
        color="#db1303"
        material={`shader: flat; opacity: ${
          modalOpacity * 0.9
        }; emissive: #db1303; emissiveIntensity: 0.5`}
        position="0 3.3 0.01"
      />

      {/* Bottom accent line */}
      <a-plane
        width="10.8"
        height="0.08"
        color="#db1303"
        material={`shader: flat; opacity: ${modalOpacity * 0.5}`}
        position="0 -3.36 0.01"
      />

      {/* Header section background */}
      <a-plane
        width="10"
        height="0.9"
        color="#1a1a1a"
        material={`shader: flat; opacity: ${modalOpacity * 0.8}`}
        position="0 2.5 0.01"
      />

      {/* Info icon */}
      <a-image
        src={infoIconSvg}
        width="0.4"
        height="0.4"
        material={`shader: flat; transparent: true; opacity: ${modalOpacity}`}
        position="-4.7 2.52 0.02"
      />

      {/* Title */}
      <a-text
        value={modalTitle}
        position="-4.4 2.55 0.02"
        align="left"
        color="#FFFFFF"
        width="7"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        material={`opacity: ${modalOpacity}`}
      />

      {/* Page indicator */}
      {totalPages > 1 && (
        <a-text
          value={`Page ${currentPage + 1}/${totalPages}`}
          position="4.8 2.52 0.02"
          align="right"
          color="#FFFFFF"
          width="5"
          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
          material={`opacity: ${modalOpacity}`}
        />
      )}

      {/* Decorative line under title */}
      <a-plane
        width="10"
        height="0.03"
        color="#db1303"
        material={`shader: flat; opacity: ${modalOpacity * 0.4}`}
        position="0 2.05 0.02"
      />

      {/* Content background */}
      <a-plane
        width="10"
        height="4.2"
        color="#141414"
        material={`shader: flat; opacity: ${modalOpacity * 0.5}`}
        position="0 0.3 0.015"
      />

      {/* Content text */}
      <a-text
        value={content}
        position={"-4.5 1.8 0.02"}
        align="left"
        color="#E5E5E5"
        width={"9"}
        wrap-count={"85"}
        line-height={"55"}
        font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
        material={`opacity: ${modalOpacity}`}
        baseline="top"
      />

      {/* Pagination controls */}
      {totalPages > 1 && (
        <a-entity position="0 -2.25 0.02">
          {" "}
          {/* halfway down from -2 to -2.25 */}
          {/* Previous button */}
          <a-entity position="-2 0 0">
            <a-plane
              width="1.4"
              height="0.6"
              color="#1a1a1a"
              material={`shader: flat; opacity: ${
                currentPage > 0 ? modalOpacity * 0.9 : modalOpacity * 0.3
              }`}
              position="0 0 0"
              class="clickable"
              onClick={handlePrevPage}
            />
            <a-image
              src={leftArrowSvg}
              width="0.3"
              height="0.3"
              material={`shader: flat; transparent: true; opacity: ${
                currentPage > 0 ? modalOpacity : modalOpacity * 0.3
              }`}
              position="-0.3 0 0.01"
            />
            <a-text
              value="PREV"
              position="0.1 0 0.01"
              align="center"
              color="#FFFFFF"
              width="3"
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              material={`opacity: ${
                currentPage > 0 ? modalOpacity : modalOpacity * 0.3
              }`}
            />
          </a-entity>
          {/* Next button */}
          <a-entity position="2 0 0">
            <a-plane
              width="1.4"
              height="0.6"
              color="#1a1a1a"
              material={`shader: flat; opacity: ${
                currentPage < totalPages - 1
                  ? modalOpacity * 0.9
                  : modalOpacity * 0.3
              }`}
              position="0 0 0"
              class="clickable"
              onClick={handleNextPage}
            />
            <a-text
              value="NEXT"
              position="-0.1 0 0.01"
              align="center"
              color="#FFFFFF"
              width="3"
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
              material={`opacity: ${
                currentPage < totalPages - 1 ? modalOpacity : modalOpacity * 0.3
              }`}
            />
            <a-image
              src={rightArrowSvg}
              width="0.3"
              height="0.3"
              material={`shader: flat; transparent: true; opacity: ${
                currentPage < totalPages - 1 ? modalOpacity : modalOpacity * 0.3
              }`}
              position="0.3 0 0.01"
            />
          </a-entity>
        </a-entity>
      )}

      {/* Close button */}
      <a-entity position="4.25 -2.7 0.02">
        <a-plane
          width="1.5"
          height="0.6"
          color="#000000"
          material={`shader: flat; opacity: ${modalOpacity * 0.4}`}
          position="0.02 -0.02 -0.01"
        />
        <a-plane
          width="1.5"
          height="0.6"
          color="#DC2626"
          material={`shader: flat; opacity: ${
            modalOpacity * 0.95
          }; emissive: #DC2626; emissiveIntensity: 0.3`}
          position="0 0 0"
          class="clickable"
          onClick={onClose}
        />
        <a-plane
          width="1.52"
          height="0.62"
          color="#ff4444"
          material={`shader: flat; opacity: ${modalOpacity * 0.3}`}
          position="0 0 -0.005"
        />
        <a-text
          value="CLOSE"
          position="0 0 0.01"
          align="center"
          color="#FFFFFF"
          width="4"
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
          material={`opacity: ${modalOpacity}`}
        />
      </a-entity>
    </a-entity>
  );
};

export default DetailModal;
