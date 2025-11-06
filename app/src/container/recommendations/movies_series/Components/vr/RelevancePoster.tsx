import React from "react";

interface RelevancePosterProps {
  position: string;
  rotation?: string;
  recommendation: {
    title_bg: string;
    title_en: string;
    isRelevant: boolean;
    relevanceScore: number;
    criteriaScores: {
      genres: number;
      type: number;
      mood: number;
      timeAvailability: number;
      preferredAge: number;
      targetGroup: number;
    };
  };
}

const RelevancePoster: React.FC<RelevancePosterProps> = ({
  position,
  rotation = "0 0 0",
  recommendation
}) => {
  const { title_en, isRelevant, relevanceScore, criteriaScores } =
    recommendation;

  // Create status badge color
  const badgeColor = isRelevant ? "#22c55e" : "#ef4444";
  const badgeText = isRelevant ? "RELEVANT" : "NOT RELEVANT";

  // Criteria icons SVGs
  const genresIcon = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#db1303" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  `)}`;

  const typeIcon = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#db1303" stroke-width="2">
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
      <polyline points="17 2 12 7 7 2"/>
    </svg>
  `)}`;

  const moodIcon = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
        stroke="#db1303" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  `)}`;

  const timeIcon = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#db1303" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  `)}`;

  const ageIcon = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#db1303" stroke-width="2">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  `)}`;

  const targetIcon = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#db1303" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  `)}`;

  const criteriaData = [
    { key: "genres", label: "Genres", icon: genresIcon, max: 2 },
    { key: "type", label: "Type", icon: typeIcon, max: 1 },
    { key: "mood", label: "Mood", icon: moodIcon, max: 1 },
    { key: "timeAvailability", label: "Time", icon: timeIcon, max: 1 },
    { key: "preferredAge", label: "Age", icon: ageIcon, max: 1 },
    { key: "targetGroup", label: "Target Group", icon: targetIcon, max: 1 }
  ];

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
        width="3.8"
        height="0.7"
        color="#141414"
        material="shader: flat; opacity: 0.9"
        position="0 2.1 0.01"
      />

      {/* Movie title */}
      <a-text
        value={
          title_en.length > 25 ? title_en.substring(0, 25) + "..." : title_en
        }
        position="0 2.15 0.02"
        align="center"
        color="#FFFFFF"
        width="3.8"
        scale="2 2 2"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      />

      {/* Status badge */}
      <a-plane
        width="3.1"
        height="0.6"
        color={badgeColor}
        material={`shader: flat; opacity: 0.9; emissive: ${badgeColor}; emissiveIntensity: 0.3`}
        position="0 1.3 0.01"
      />
      <a-text
        value={badgeText}
        position="0 1.32 0.02"
        align="center"
        color="#FFFFFF"
        width="3"
        scale="2 2 2"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      />

      {/* Relevance score section */}
      <a-text
        value="RELEVANCE SCORE:"
        position="0 0.75 0.02"
        align="center"
        color="#B0B0B0"
        width="3.5"
        scale="1.2 1.2 1.2"
        font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
      />

      <a-text
        value={`${relevanceScore} / 7`}
        position="0 0.4 0.02"
        align="center"
        color="#DC2626"
        width="2.5"
        scale="1.7 1.7 1.7"
        font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
      />

      {/* Progress bar for relevance */}
      <a-plane
        width="3.5"
        height="0.1"
        color="#2a2a2a"
        material="shader: flat; opacity: 0.8"
        position="0 0.1 0.01"
      />
      <a-plane
        width={`${(relevanceScore / 7) * 3.5}`}
        height="0.1"
        color="#DC2626"
        material={`shader: flat; opacity: 0.9; emissive: #DC2626; emissiveIntensity: 0.4`}
        position={`${((relevanceScore / 7) * 3.5 - 3.5) / 2} 0.1 0.02`}
      />

      {/* Divider */}
      <a-plane
        width="3.8"
        height="0.03"
        color="#db1303"
        material="shader: flat; opacity: 0.5"
        position="0 -0.25 0.01"
      />

      {/* Criteria scores - 2 columns, 3 rows */}
      {criteriaData.map((criteria, idx) => {
        const row = Math.floor(idx / 2);
        const col = idx % 2;
        const xPos = col === 0 ? -1 : 1;
        const yPos = 0.35 - row * 0.65 - 1.2;
        const score =
          criteriaScores[criteria.key as keyof typeof criteriaScores];
        const progressWidth = (score / criteria.max) * 1.4;

        return (
          <a-entity key={criteria.key} position={`${xPos} ${yPos} 0.02`}>
            {/* Background */}
            <a-plane
              width="1.9"
              height="0.55"
              color="#141414"
              material="shader: flat"
              position="0 0 -0.01"
            />

            {/* Icon */}
            <a-image
              src={criteria.icon}
              width="0.25"
              height="0.25"
              position="-0.75 0 0"
            />

            {/* Label */}
            <a-text
              value={criteria.label}
              position="-0.55 0.09 0"
              align="left"
              color="#B0B0B0"
              width="2"
              scale="1.5 1.5 1.5"
              font="https://cdn.aframe.io/fonts/Exo2SemiBold.fnt"
            />

            {/* Score */}
            <a-text
              value={`${score}/${criteria.max}`}
              position="0.85 0.15 0"
              align="right"
              color="#DC2626"
              width="1.5"
              scale="1.75 1.75 1.75"
              font="https://cdn.aframe.io/fonts/Exo2Bold.fnt"
            />

            {/* Progress bar background */}
            <a-plane
              width="1.4"
              height="0.08"
              color="#2a2a2a"
              material="shader: flat; opacity: 0.8"
              position="0.15 -0.1 0"
            />

            {/* Progress bar fill */}
            <a-plane
              width={progressWidth}
              height="0.08"
              color="#DC2626"
              material={`shader: flat; opacity: 0.9; emissive: #DC2626; emissiveIntensity: 0.3`}
              position={`0.15 -0.1 0.01`}
            />
          </a-entity>
        );
      })}

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

export default RelevancePoster;
