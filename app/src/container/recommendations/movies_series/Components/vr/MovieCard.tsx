import { useEffect, useState } from "react";
import { Recommendation } from "@/container/recommendations/movies_series/moviesSeriesRecommendations-types.ts";
import "aframe-troika-text";
import GoodTiming from "@/assets/fonts/GoodTiming.ttf";

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
  const [showPopup, setShowPopup] = useState(false);
  const [popupOpacity, setPopupOpacity] = useState(0);

  const isBookmarked =
    externalIsBookmarked !== undefined
      ? externalIsBookmarked
      : internalIsBookmarked;

  useEffect(() => {
    if (showPopup) {
      setPopupOpacity(1);
      const timer = setTimeout(() => {
        setPopupOpacity(0);
        setTimeout(() => setShowPopup(false), 500);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleInternalBookmarkClick = () => {
    if (handleBookmarkClick) {
      handleBookmarkClick();
    } else {
      setInternalIsBookmarked(!internalIsBookmarked);
      setShowPopup(true);
    }
  };

  const handlePopupDismiss = () => {
    setPopupOpacity(0);
    setTimeout(() => setShowPopup(false), 500);
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

  const infoIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
  `)}`;

  const closeIconSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="white">
      <path d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 2.02429 15.3623 1.82579 15.3599C1.62732 15.3574 1.35883 15.2449 1.1512 15.046C0.961768 14.8474 0.849193 14.5787 0.846752 14.2977C0.844311 14.0168 0.956197 13.7462 1.1512 13.5441L6.8174 7.87312L1.1512 2.20206C0.950523 2.00115 0.837777 1.72867 0.837777 1.44457C0.837777 1.16047 0.950523 0.887983 1.1512 0.687069Z"/>
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
      {showPopup && (
        <a-entity position="0 5.5 2">
          <a-plane
            width="8"
            height="1.5"
            color={isBookmarked ? "#22C55E" : "#EF4444"}
            material={`shader: flat; opacity: ${popupOpacity}`}
            position="0 0 0.01"
          ></a-plane>

          <a-entity position="-3.5 0 0.02">
            <a-image
              src={infoIconSvg}
              width="0.3"
              height="0.3"
              material={`shader: flat; transparent: true; opacity: ${popupOpacity}`}
              position="0 0 0"
            ></a-image>

            <a-troika-text
              value={
                isBookmarked ? "Added to watchlist" : "Removed from watchlist"
              }
              position="0.4 0.1 0"
              align="left"
              color="#FFFFFF"
              width="6"
              material={`opacity: ${popupOpacity}`}
              font={GoodTiming}
            ></a-troika-text>

            <a-troika-text
              value={`Your ${recommendation.type} has been ${
                isBookmarked ? "saved to" : "removed from"
              } your watchlist!`}
              position="0.4 -0.2 0"
              align="left"
              color="#FFFFFF"
              width="5"
              material={`opacity: ${popupOpacity * 0.8}`}
              font={GoodTiming}
            ></a-troika-text>
          </a-entity>

          <a-image
            src={closeIconSvg}
            width="0.2"
            height="0.2"
            material={`shader: flat; transparent: true; opacity: ${popupOpacity}`}
            position="3.7 0.4 0.02"
            class="clickable"
            onClick={handlePopupDismiss}
          ></a-image>
        </a-entity>
      )}

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

      {/* text group */}
      <a-entity position={`${textX} 0 0.02`}>
        <a-troika-text
          value={recommendation.title}
          position={`0 ${textStartY} 0`}
          align="left"
          color="#FFFFFF"
          width={textContentWidth * 0.9}
          wrap-count="40"
          font={GoodTiming}
        ></a-troika-text>

        <a-troika-text
          value={recommendation.title}
          position={`0 ${textStartY - 0.4} 0`}
          align="left"
          color="#BBBBBB"
          width={textContentWidth * 0.8}
          wrap-count="45"
          font={GoodTiming}
        ></a-troika-text>

        <a-troika-text
          value={`${recommendation.genre} | ${runtime} | ${recommendation.year} | Rating: ${recommendation.rated}`}
          position={`0 ${textStartY - 0.7} 0`}
          align="left"
          color="#AAAAAA"
          width={textContentWidth * 0.7}
          wrap-count="70"
          font={GoodTiming}
        ></a-troika-text>

        <a-entity position={`0 ${textStartY - 1.15} 0`}>
          <a-troika-text
            value={`IMDb: ${recommendation.imdbRating} / ${recommendation.imdbVotes} votes`}
            position="0 0 0"
            align="left"
            color="#FFCC33"
            width={textContentWidth * 0.6}
            wrap-count="35"
            font={GoodTiming}
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
                font={GoodTiming}
              ></a-troika-text>
              <a-troika-text
                value="Metascore"
                position="0.5 0 0"
                align="left"
                color="#FFFFFF"
                width={textContentWidth * 0.6}
                font={GoodTiming}
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
                font={GoodTiming}
              ></a-troika-text>
              <a-troika-text
                value="RT %"
                position="0.5 0 0"
                align="left"
                color="#FFFFFF"
                width={textContentWidth * 0.6}
                font={GoodTiming}
              ></a-troika-text>
            </a-entity>
          )}
        </a-entity>

        {recommendation.reason && (
          <a-entity position={`0 ${textStartY - 1.9} 0`}>
            <a-troika-text
              value={`Why we recommend ${recommendation.title}?`}
              position="0 0.2 0"
              align="left"
              color="#FFFFFF"
              width={textContentWidth * 0.9}
              wrap-count="45"
              font={GoodTiming}
            ></a-troika-text>
            <a-troika-text
              value={recommendation.reason}
              position="0 -0.35 0"
              align="left"
              color="#CCCCCC"
              width={textContentWidth * 0.7}
              wrap-count="65"
              font={GoodTiming}
            ></a-troika-text>
          </a-entity>
        )}

        <a-entity position={`0 ${textStartY - 2.85} 0`}>
          <a-troika-text
            value="Description"
            position="0 0.1 0"
            align="left"
            color="#FFFFFF"
            width={textContentWidth * 0.9}
            wrap-count="45"
            font={GoodTiming}
          ></a-troika-text>
          <a-troika-text
            value={recommendation.description.substring(0, 120) + "..."}
            position="0 -0.35 0"
            align="left"
            color="#CCCCCC"
            width={textContentWidth * 0.7}
            wrap-count="65"
            font={GoodTiming}
          ></a-troika-text>
          <a-troika-text
            value="Full description"
            position="0 -0.6 0"
            align="left"
            color="#4A9EFF"
            width={textContentWidth * 0.5}
            wrap-count="45"
            font={GoodTiming}
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
            wrap-count="45"
            font={GoodTiming}
          ></a-troika-text>
          <a-troika-text
            value={recommendation.plot.substring(0, 120) + "..."}
            position="0 -0.35 0"
            align="left"
            color="#CCCCCC"
            width={textContentWidth * 0.7}
            wrap-count="65"
            font={GoodTiming}
          ></a-troika-text>
          <a-troika-text
            value="Full plot"
            position="0 -0.6 0"
            align="left"
            color="#4A9EFF"
            width={textContentWidth * 0.5}
            wrap-count="45"
            font={GoodTiming}
            class="clickable"
            onClick={handleShowPlot}
          ></a-troika-text>
        </a-entity>

        <a-entity position={`0 ${textStartY - 4.75} 0`}>
          <a-troika-text
            value="Additional Information:"
            position="0 0 0"
            align="left"
            color="#FFFFFF"
            width={textContentWidth * 0.9}
            wrap-count="45"
            font={GoodTiming}
          ></a-troika-text>

          <a-troika-text
            value={`Director: ${recommendation.director}    Screenwriter: ${recommendation.writer}`}
            position="0 -0.35 0"
            align="left"
            color="#FF6B6B"
            width={textContentWidth * 0.7}
            wrap-count="70"
            font={GoodTiming}
          ></a-troika-text>

          <a-troika-text
            value={`Actors: ${recommendation.actors}    Production: ${recommendation.production}    Released: ${recommendation.released}`}
            position="0 -0.65 0"
            align="left"
            color="#FF6B6B"
            width={textContentWidth * 0.7}
            wrap-count="70"
            font={GoodTiming}
          ></a-troika-text>

          <a-troika-text
            value={`Language: ${recommendation.language}    Country: ${recommendation.country}    Awards: ${recommendation.awards}`}
            position="0 -1.0 0"
            align="left"
            color="#FF6B6B"
            width={textContentWidth * 0.7}
            wrap-count="70"
            font={GoodTiming}
          ></a-troika-text>

          <a-troika-text
            value={`Box Office: ${recommendation.boxOffice}    DVD: ${recommendation.DVD}    Website: ${recommendation.website}`}
            position="0 -1.3 0"
            align="left"
            color="#FF6B6B"
            width={textContentWidth * 0.7}
            wrap-count="70"
            font={GoodTiming}
          ></a-troika-text>
        </a-entity>
      </a-entity>
    </a-entity>
  );
};

export default MovieCardVR;
