import { useState, useEffect } from "react";
import { Recommendation } from "@/container/recommendations/movies_series/moviesSeriesRecommendations-types.ts";
import "aframe-troika-text";

interface MovieCardVRProps {
  position?: string;
  recommendation: Recommendation;
  handleBookmarkClick?: () => void;
  isBookmarked?: boolean;
  onShowDetail?: (type: "description" | "plot") => void;
  onShowTrailer?: () => void;
}

function getMetascoreColor(metascore: string): string {
  const score = Number.parseInt(metascore);
  if (isNaN(score)) return "#AAA";
  if (score >= 60) return "#54A72A";
  if (score >= 40) return "#FFCC33";
  return "#FF0000";
}

const MovieCardVR = ({
  position = "0 6 -4",
  recommendation,
  handleBookmarkClick,
  isBookmarked: externalIsBookmarked,
  onShowDetail,
  onShowTrailer
}: MovieCardVRProps) => {
  const [internalIsBookmarked, setInternalIsBookmarked] = useState(false);
  const [loadedSections, setLoadedSections] = useState(0);

  // Progressively load sections to prevent memory overload
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Load sections with small delays
    for (let i = 1; i <= 6; i++) {
      const timer = setTimeout(() => {
        setLoadedSections(i);
      }, i * 50); // 50ms between each section
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [recommendation.imdbID]); // Reset when movie changes

  const isBookmarked =
    externalIsBookmarked !== undefined
      ? externalIsBookmarked
      : internalIsBookmarked;

  const handleInternalBookmarkClick = () => {
    if (handleBookmarkClick) {
      handleBookmarkClick();
    } else {
      setInternalIsBookmarked(!internalIsBookmarked);
    }
  };

  const handleShowDescription = () => {
    if (onShowDetail) {
      onShowDetail("description");
    }
  };

  const handleShowPlot = () => {
    if (onShowDetail) {
      onShowDetail("plot");
    }
  };

  const handleShowTrailer = () => {
    if (onShowTrailer) {
      onShowTrailer();
    }
  };

  const isMovie = recommendation.type === "movie";
  const runtime = recommendation.runtimeGoogle || recommendation.runtime;
  const rottenTomatoesRating =
    recommendation.ratings?.find(
      (rating) => rating.Source === "Rotten Tomatoes"
    )?.Value || "N/A";

  const cardWidth = 13.0;
  const cardHeight = 9.0;
  const posterWidth = 3.2;
  const posterHeight = 4.8;
  const gapBetweenPosterAndText = 0.4;
  const textContentWidth =
    cardWidth - posterWidth - gapBetweenPosterAndText - 1.0;

  const posterX = -cardWidth / 2 + posterWidth / 2 + 0.4;
  const posterY = cardHeight / 2 - posterHeight / 2 - 0.4;

  const textX = posterX + posterWidth / 2 + gapBetweenPosterAndText + 0.3;
  const textStartY = cardHeight / 2 - 0.4;

  const bookmarkOutlineSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#FFCC33" strokeWidth="2">
      <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"/>
    </svg>
  `)}`;

  const bookmarkFilledSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="#FFCC33">
      <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"/>
    </svg>
  `)}`;

  const playButtonSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="white" fillOpacity="0.9">
      <circle cx="12" cy="12" r="12" fill="black" fillOpacity="0.6"/>
      <polygon points="10,8 16,12 10,16" fill="white"/>
    </svg>
  `)}`;

  return (
    <a-entity
      position={position}
      class="clickable"
      color-changer
      dynamic-body="mass: 0"
      data-grabbable=""
      data-stretchable=""
      draggable
    >
      <a-plane
        width={cardWidth}
        height={cardHeight}
        color="#0f0f0f"
        material="shader: flat; opacity: 0.95"
        position="0 0 0"
      ></a-plane>

      <a-plane
        width={cardWidth + 0.08}
        height={cardHeight + 0.08}
        color="#333333"
        material="shader: flat; opacity: 0.8"
        position="0 0 -0.02"
      ></a-plane>

      {/* poster group */}
      <a-entity position={`${posterX} ${posterY} 0.02`}>
        <a-plane
          width={posterWidth + 0.1}
          height={posterHeight + 0.1}
          color="#222222"
          material="shader: flat"
          position="0 0 -0.01"
        ></a-plane>

        <a-image
          src={recommendation.poster}
          position="0 0 0.01"
          width={posterWidth}
          height={posterHeight}
          material="shader: flat"
        ></a-image>

        <a-plane
          width={posterWidth}
          height={posterHeight}
          color="#000000"
          material="shader: flat; opacity: 0.3"
          position="0 0 0.02"
          class="clickable"
          onClick={handleShowTrailer}
        ></a-plane>

        <a-image
          src={playButtonSvg}
          position="0 0 0.03"
          width="0.8"
          height="0.8"
          material="shader: flat; transparent: true"
          class="clickable"
          onClick={handleShowTrailer}
        ></a-image>

        <a-entity
          position={`${-posterWidth / 2 + 0.3} ${posterHeight / 2 - 0.3} 0.04`}
        >
          <a-image
            src={isBookmarked ? bookmarkFilledSvg : bookmarkOutlineSvg}
            position="0 0 0.01"
            width="0.25"
            height="0.25"
            material="shader: flat; transparent: true"
            class="clickable"
            onClick={handleInternalBookmarkClick}
          ></a-image>
        </a-entity>
      </a-entity>

      {/* text group - progressively loaded */}
      <a-entity position={`${textX} 0 0.02`}>
        {/* Section 1: Title and basic info */}
        {loadedSections >= 1 && (
          <>
            <a-troika-text
              value={recommendation.title}
              position={`0 ${textStartY} 0`}
              align="left"
              color="#FFFFFF"
              width={textContentWidth * 0.9}
              max-width={textContentWidth * 0.9}
              font="#good-timing-font"
            ></a-troika-text>

            <a-troika-text
              value={recommendation.title}
              position={`0 ${textStartY - 0.4} 0`}
              align="left"
              color="#BBBBBB"
              width={textContentWidth * 0.8}
              max-width={textContentWidth * 0.8}
              font="#good-timing-font"
            ></a-troika-text>
          </>
        )}

        {/* Section 2: Genre and runtime */}
        {loadedSections >= 2 && (
          <a-troika-text
            value={`${recommendation.genre} | ${runtime} | ${recommendation.year} | Rating: ${recommendation.rated}`}
            position={`0 ${textStartY - 0.7} 0`}
            align="left"
            color="#AAAAAA"
            width={textContentWidth * 0.7}
            max-width={textContentWidth * 0.7}
            font="#good-timing-font"
          ></a-troika-text>
        )}

        {/* Section 3: Ratings */}
        {loadedSections >= 3 && (
          <a-entity position={`0 ${textStartY - 1.15} 0`}>
            <a-troika-text
              value={`IMDb: ${recommendation.imdbRating} / ${recommendation.imdbVotes} votes`}
              position="0 0 0"
              align="left"
              color="#FFCC33"
              width={textContentWidth * 0.6}
              max-width={textContentWidth * 0.6}
              font="#good-timing-font"
            ></a-troika-text>

            {isMovie && (
              <a-entity position={`4.2 0 0`}>
                <a-plane
                  width="0.8"
                  height="0.35"
                  color={getMetascoreColor(recommendation.metascore)}
                  material="shader: flat"
                  position="0 -0.035 0.01"
                ></a-plane>
                <a-troika-text
                  value={recommendation.metascore}
                  position="0 0 0.02"
                  align="center"
                  color="#FFFFFF"
                  width={textContentWidth * 0.6}
                  font="#good-timing-font"
                ></a-troika-text>
                <a-troika-text
                  value="Metascore"
                  position="0.5 0 0"
                  align="left"
                  color="#FFFFFF"
                  width={textContentWidth * 0.6}
                  font="#good-timing-font"
                ></a-troika-text>
              </a-entity>
            )}

            {isMovie && (
              <a-entity position={`6.8 0 0`}>
                <a-plane
                  width="0.8"
                  height="0.35"
                  color="#FF0000"
                  material="shader: flat"
                  position="0 -0.035 0.01"
                ></a-plane>
                <a-troika-text
                  value={rottenTomatoesRating.replace("%", "")}
                  position="0 0 0.02"
                  align="center"
                  color="#FFFFFF"
                  width={textContentWidth * 0.6}
                  font="#good-timing-font"
                ></a-troika-text>
                <a-troika-text
                  value="RT %"
                  position="0.5 0 0"
                  align="left"
                  color="#FFFFFF"
                  width={textContentWidth * 0.6}
                  font="#good-timing-font"
                ></a-troika-text>
              </a-entity>
            )}
          </a-entity>
        )}

        {/* Section 4: Reason */}
        {loadedSections >= 4 && recommendation.reason && (
          <a-entity position={`0 ${textStartY - 1.9} 0`}>
            <a-troika-text
              value={`Why we recommend ${recommendation.title}?`}
              position="0 0.2 0"
              align="left"
              color="#FFFFFF"
              width={textContentWidth * 0.9}
              max-width={textContentWidth * 0.9}
              font="#good-timing-font"
            ></a-troika-text>
            <a-troika-text
              value={recommendation.reason}
              position="0 -0.35 0"
              align="left"
              color="#CCCCCC"
              width={textContentWidth * 0.7}
              max-width={textContentWidth * 0.7}
              font="#good-timing-font"
            ></a-troika-text>
          </a-entity>
        )}

        {/* Section 5: Description and Plot */}
        {loadedSections >= 5 && (
          <>
            <a-entity position={`0 ${textStartY - 2.85} 0`}>
              <a-troika-text
                value="Description"
                position="0 0.1 0"
                align="left"
                color="#FFFFFF"
                width={textContentWidth * 0.9}
                max-width={textContentWidth * 0.9}
                font="#good-timing-font"
              ></a-troika-text>
              <a-troika-text
                value={recommendation.description.substring(0, 120) + "..."}
                position="0 -0.35 0"
                align="left"
                color="#CCCCCC"
                width={textContentWidth * 0.7}
                max-width={textContentWidth * 0.7}
                font="#good-timing-font"
              ></a-troika-text>
              <a-troika-text
                value="Full description"
                position="0 -0.6 0"
                align="left"
                color="#4A9EFF"
                width={textContentWidth * 0.5}
                max-width={textContentWidth * 0.5}
                font="#good-timing-font"
                class="clickable"
                onClick={handleShowDescription}
              ></a-troika-text>
            </a-entity>

            <a-entity position={`0 ${textStartY - 3.85} 0`}>
              <a-troika-text
                value="Plot"
                position="0 0.05 0"
                align="left"
                color="#FFFFFF"
                width={textContentWidth * 0.9}
                max-width={textContentWidth * 0.9}
                font="#good-timing-font"
              ></a-troika-text>
              <a-troika-text
                value={recommendation.plot.substring(0, 120) + "..."}
                position="0 -0.35 0"
                align="left"
                color="#CCCCCC"
                width={textContentWidth * 0.7}
                max-width={textContentWidth * 0.7}
                font="#good-timing-font"
              ></a-troika-text>
              <a-troika-text
                value="Full plot"
                position="0 -0.6 0"
                align="left"
                color="#4A9EFF"
                width={textContentWidth * 0.5}
                max-width={textContentWidth * 0.5}
                font="#good-timing-font"
                class="clickable"
                onClick={handleShowPlot}
              ></a-troika-text>
            </a-entity>
          </>
        )}

        {/* Section 6: Additional Information */}
        {loadedSections >= 6 && (
          <a-entity position={`0 ${textStartY - 4.75} 0`}>
            <a-troika-text
              value="Additional Information:"
              position="0 0 0"
              align="left"
              color="#FFFFFF"
              width={textContentWidth * 0.9}
              max-width={textContentWidth * 0.9}
              font="#good-timing-font"
            ></a-troika-text>

            <a-troika-text
              value={`Director: ${recommendation.director}    Screenwriter: ${recommendation.writer}`}
              position="0 -0.35 0"
              align="left"
              color="#FF6B6B"
              width={textContentWidth * 0.7}
              max-width={textContentWidth * 0.7}
              font="#good-timing-font"
            ></a-troika-text>

            <a-troika-text
              value={`Actors: ${recommendation.actors}    Production: ${recommendation.production}    Released: ${recommendation.released}`}
              position="0 -0.65 0"
              align="left"
              color="#FF6B6B"
              width={textContentWidth * 0.7}
              max-width={textContentWidth * 0.7}
              font="#good-timing-font"
            ></a-troika-text>

            <a-troika-text
              value={`Language: ${recommendation.language}    Country: ${recommendation.country}    Awards: ${recommendation.awards}`}
              position="0 -1.0 0"
              align="left"
              color="#FF6B6B"
              width={textContentWidth * 0.7}
              max-width={textContentWidth * 0.7}
              font="#good-timing-font"
            ></a-troika-text>

            <a-troika-text
              value={`Box Office: ${recommendation.boxOffice}    DVD: ${recommendation.DVD}    Website: ${recommendation.website}`}
              position="0 -1.3 0"
              align="left"
              color="#FF6B6B"
              width={textContentWidth * 0.7}
              max-width={textContentWidth * 0.7}
              font="#good-timing-font"
            ></a-troika-text>
          </a-entity>
        )}
      </a-entity>
    </a-entity>
  );
};

export default MovieCardVR;
