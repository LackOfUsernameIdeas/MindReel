import React from "react";

interface AnalysisPosterProps {
  position: string;
  rotation?: string;
  relevantCount: number;
  totalCount: number;
  precisionPercentage: string;
  averageRelevance: string;
}

const AnalysisPoster: React.FC<AnalysisPosterProps> = ({
  position,
  rotation = "0 0 0",
  relevantCount,
  totalCount,
  precisionPercentage,
  averageRelevance
}) => {
  // Create icon SVGs
  const checklistIcon = `data:image/svg+xml;base64,${btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" 
       fill="none" stroke="#db1303" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 5H3"/>
    <path d="M16 12H3"/>
    <path d="M11 19H3"/>
    <path d="m15 18 2 2 4-4"/>
  </svg>
`)}`;

  const listIcon = `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#db1303" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>`
  )}`;

  const percentIcon = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#db1303" stroke-width="2">
      <line x1="19" y1="5" x2="5" y2="19"/>
      <circle cx="6.5" cy="6.5" r="2.5"/>
      <circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  `)}`;

  const starIcon = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#db1303" stroke="#db1303" stroke-width="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  `)}`;

  return (
    <a-entity position={position} rotation={rotation}>
      {/* Main poster background */}
      <a-plane
        width="4"
        height="5.5"
        color="#0f0f0f"
        material="shader: flat; opacity: 0.95"
        position="0 0 0"
      />

      {/* Border frame */}
      <a-plane
        width="4.1"
        height="5.6"
        color="#2a2a2a"
        material="shader: flat; opacity: 0.9"
        position="0 0 -0.01"
      />

      {/* Outer glow */}
      <a-plane
        width="4.2"
        height="5.7"
        color="#db1303"
        material="shader: flat; opacity: 0.15"
        position="0 0 -0.02"
      />

      {/* Top decorative bar */}
      <a-plane
        width="4"
        height="0.15"
        color="#db1303"
        material="shader: flat; emissive: #db1303; emissiveIntensity: 0.6"
        position="0 2.675 0.01"
      />

      {/* Title section */}
      <a-plane
        width="3.6"
        height="0.7"
        color="#141414"
        material="shader: flat; opacity: 0.9"
        position="0 2.1 0.01"
      />

      {/* Title */}
      <a-text
        value="OVERALL ANALYSIS"
        position="0 2.15 0.02"
        align="center"
        color="#FFFFFF"
        width="3.5"
        scale="2 2 2"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      />

      {/* Divider line */}
      <a-plane
        width="3.6"
        height="0.03"
        color="#db1303"
        material="shader: flat; opacity: 0.5"
        position="0 1.35 0.01"
      />

      {/* Widget 1: Relevant Recommendations */}
      <a-entity position="0 0.55 0.02">
        <a-plane
          width="3.6"
          height="0.75"
          color="#141414"
          material="shader: flat; opacity: 0.6"
          position="0 0 -0.01"
        />
        <a-image
          src={checklistIcon}
          width="0.35"
          height="0.35"
          position="-1.5 0 0"
        />
        <a-text
          value="Relevant Recommendations"
          position="-1.25 0 0"
          align="left"
          color="#B0B0B0"
          width="2.5"
          scale="1.25 1.25 1.25"
          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
        />
        <a-text
          value={relevantCount.toString()}
          position="1.5 0 0"
          align="center"
          color="#DC2626"
          width="2"
          scale="2.5 2.5 2.5"
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        />
      </a-entity>

      {/* Widget 2: Total Recommendations */}
      <a-entity position="0 -0.3 0.02">
        <a-plane
          width="3.6"
          height="0.75"
          color="#141414"
          material="shader: flat; opacity: 0.6"
          position="0 0 -0.01"
        />
        <a-image
          src={listIcon}
          width="0.35"
          height="0.35"
          position="-1.5 0 0"
        />
        <a-text
          value="Recommendations Generated"
          position="-1.25 0 0"
          align="left"
          color="#B0B0B0"
          width="2.5"
          scale="1.25 1.25 1.25"
          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
        />
        <a-text
          value={totalCount.toString()}
          position="1.5 0 0"
          align="center"
          color="#DC2626"
          width="2"
          scale="2.5 2.5 2.5"
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        />
      </a-entity>

      {/* Widget 3: Precision Percentage */}
      <a-entity position="0 -1.15 0.02">
        <a-plane
          width="3.6"
          height="0.75"
          color="#141414"
          material="shader: flat; opacity: 0.6"
          position="0 0 -0.01"
        />
        <a-image
          src={percentIcon}
          width="0.35"
          height="0.35"
          position="-1.5 0 0"
        />
        <a-text
          value="Precision"
          position="-1.25 0 0"
          align="left"
          color="#B0B0B0"
          width="2.5"
          scale="1.25 1.25 1.25"
          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
        />
        <a-text
          value={`${precisionPercentage}%`}
          position="1.2 0 0"
          align="center"
          color="#DC2626"
          width="2"
          scale="2.5 2.5 2.5"
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        />
      </a-entity>

      {/* Widget 4: Average Relevance */}
      <a-entity position="0 -2 0.02">
        <a-plane
          width="3.6"
          height="0.75"
          color="#141414"
          material="shader: flat; opacity: 0.6"
          position="0 0 -0.01"
        />
        <a-image
          src={starIcon}
          width="0.35"
          height="0.35"
          position="-1.5 0 0"
        />
        <a-text
          value="Average Relevance"
          position="-1.25 0 0"
          align="left"
          color="#B0B0B0"
          width="2.5"
          scale="1.25 1.25 1.25"
          font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
        />
        <a-text
          value={averageRelevance}
          position="1.4 0 0"
          align="center"
          color="#DC2626"
          width="2"
          scale="2.5 2.5 2.5"
          font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
        />
      </a-entity>

      {/* Bottom accent line */}
      <a-plane
        width="4"
        height="0.08"
        color="#db1303"
        material="shader: flat; opacity: 0.5"
        position="0 -2.71 0.01"
      />
    </a-entity>
  );
};

export default AnalysisPoster;
