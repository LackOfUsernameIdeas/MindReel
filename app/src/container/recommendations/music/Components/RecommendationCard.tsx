import { FC, useEffect, useState } from "react";
import { ExternalLink, Eye, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import { handleBookmarkClick } from "../helper_functions";
import { RecommendationCardProps } from "../musicRecommendations-types";

const RecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex,
  setBookmarkedMusic,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMusic
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [albumCoverError, setAlbumCoverError] = useState(false);

  const recommendation = recommendationList[currentIndex];

  const handleTrailerModalClick = () => {
    recommendation.youtubeMusicVideoUrl && setIsVideoModalOpen((prev) => !prev);
  };

  const handleReasonModalClick = () => {
    setIsReasonModalOpen((prev) => !prev);
  };

  const formatDuration = (ms: number | null | undefined) => {
    if (!ms) return "Неизвестно";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num: number | null) => {
    if (!num) return "N/A";
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Неизвестна";
    return new Date(dateString).toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const descriptionPreviewLength = 150;
  const reasonPreviewLength = 150;

  useEffect(() => {
    setAlbumCoverError(false);
  }, [recommendation.albumCover]);

  console.log("recommendationList", recommendationList);

  console.log("bookmarkedMusic", bookmarkedMusic);
  return (
    <div className="recommendation-card">
      <div className="flex w-full items-center sm:items-start flex-col lg:flex-row">
        <div className="relative flex-shrink-0 mb-4 lg:mb-0 lg:mr-6 xl:mr-8 flex flex-col items-center">
          {/* Album Cover */}
          <div
            className={`relative group ${
              recommendation.youtubeMusicVideoUrl ? "cursor-pointer" : ""
            } `}
            onClick={handleTrailerModalClick}
          >
            {!albumCoverError && recommendation.albumCover ? (
              <img
                src={recommendation.albumCover}
                alt=""
                onError={() => setAlbumCoverError(true)}
                className={`rounded-lg w-72 sm:w-80 lg:w-64 xl:w-80 2xl:w-96 h-auto transition-all duration-300 ${
                  recommendation.youtubeMusicVideoUrl
                    ? "group-hover:scale-102 group-hover:blur-sm"
                    : ""
                }`}
              />
            ) : (
              <div className="rounded-lg w-72 sm:w-80 lg:w-64 xl:w-80 2xl:w-96 aspect-[3.8/4] bg-white/70 dark:bg-bodybg2" />
            )}
            {/* Play button */}
            {recommendation.youtubeMusicVideoUrl && (
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                <div className="group relative">
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 group-hover:scale-[1.7] transition-transform duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-full p-4 lg:p-5 xl:p-6 border border-white/30 shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 group-hover:border-white/50">
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      className="size-12 lg:size-14 xl:size-16 text-white drop-shadow-lg relative z-10 transform transition-transform duration-300 group-hover:scale-105"
                      style={{
                        filter:
                          "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))"
                      }}
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <div className="absolute inset-0 rounded-full border-2 border-white/40 group-hover:animate-ping"></div>
                  </div>
                  <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full bg-black/20 blur-lg -z-10"></div>
                </div>
              </div>
            )}
          </div>
          {/* Bookmark Button */}
          <button
            onClick={() =>
              handleBookmarkClick(
                recommendation,
                setBookmarkedMusic,
                setCurrentBookmarkStatus,
                setAlertVisible
              )
            }
            className="absolute top-4 left-4 p-2 text-[#FFCC33] bg-black/50 bg-opacity-60 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {bookmarkedMusic[recommendation.spotifyID ?? ""] ? (
                <>
                  <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553L12 15.125 6 18.553V4h12v14.553z"></path>
                  <path d="M6 18.553V4h12v14.553L12 15.125l-6 3.428z"></path>
                </>
              ) : (
                <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"></path>
              )}
            </svg>
          </button>
        </div>

        <div className="flex-grow min-w-0">
          {/* Main Information */}
          <div className="top-0 z-10">
            <a
              href="#"
              className="block text-xl sm:text-2xl xl:text-3xl font-bold mb-1"
            >
              {recommendation.title || "Заглавие не е налично"}
            </a>
            <a
              href="#"
              className="block text-base sm:text-lg font-semibold text-opacity-60 italic mb-2"
            >
              {recommendation.artists || "Артисти неизвестни"}
            </a>
            <p className="flex flex-wrap gap-x-1 recommendation-small-details text-xs sm:text-sm italic text-defaulttextcolor/70">
              <span>{recommendation.albumType || "Тип неизвестен"}</span>
              <span>|</span>
              <span>{formatDuration(recommendation.durationMs)}</span>
              <span>|</span>
              <span>
                {formatDate(recommendation.albumReleaseDateInSpotify)}
              </span>
              <span>|</span>
              <span>
                {recommendation.spotifyPopularity
                  ? `Популярност: ${recommendation.spotifyPopularity}/100`
                  : "Популярност: N/A"}
              </span>
            </p>

            {/* Ratings */}
            <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center space-y-3 lg:space-y-0 lg:space-x-4 xl:space-x-6 py-2">
              {recommendation.spotifyPopularity && (
                <div
                  className="flex items-center space-x-2 dark:text-[#1DB954] text-[#1DB954]"
                  title="Spotify популярност: Базирана на слушания и взаимодействия."
                >
                  <span className="font-bold text-base lg:text-lg">
                    Spotify:{" "}
                  </span>
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-[#1DB954] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs lg:text-sm">
                      S
                    </span>
                  </div>
                  <span className="font-bold text-base lg:text-lg">
                    {recommendation.spotifyPopularity}/100
                  </span>
                  {recommendation.spotifyUrl && (
                    <Button
                      asChild
                      className="bg-secondary/10 dark:bg-secondary/20 text-xs lg:text-sm px-2 py-1 h-auto"
                    >
                      <a
                        href={recommendation.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                        <span className="hidden xl:inline">
                          Слушай в Spotify
                        </span>
                        <span className="xl:hidden">Spotify</span>
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {recommendation.youtubeMusicVideoViews && (
                <div
                  className="flex items-center space-x-2"
                  title="YouTube гледания: Общ брой гледания на музикалното видео."
                >
                  <Eye className="text-[#FF0000] w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 flex-shrink-0" />
                  <span className="text-red-400 font-semibold text-sm lg:text-base xl:text-lg break-all">
                    {formatNumber(recommendation.youtubeMusicVideoViews)}{" "}
                    гледания
                  </span>
                </div>
              )}

              {recommendation.youtubeMusicVideoLikes && (
                <div
                  className="flex items-center space-x-2"
                  title="YouTube харесвания: Брой харесвания на видеото."
                >
                  <ThumbsUp className="text-[#FF0000] w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 flex-shrink-0" />
                  <span className="text-red-400 font-semibold text-sm lg:text-base xl:text-lg break-all">
                    {formatNumber(recommendation.youtubeMusicVideoLikes)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Reason for recommendation */}
          {recommendation.reason && (
            <div className="mb-4">
              <h3 className="text-base lg:text-lg font-semibold mb-2">
                Защо препоръчваме {recommendation.title || "тази песен"}?
              </h3>
              <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
                <p className="text-sm lg:text-base text-opacity-80 italic">
                  {recommendation.reason.length > reasonPreviewLength
                    ? `${recommendation.reason.substring(
                        0,
                        reasonPreviewLength
                      )}...`
                    : recommendation.reason}
                </p>
              </div>
              {recommendation.reason.length > reasonPreviewLength && (
                <button
                  onClick={handleReasonModalClick}
                  className="mt-2 text-sm lg:text-base underline hover:scale-105 transition"
                >
                  Пълно обяснение
                </button>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <h3 className="text-base lg:text-lg font-semibold mb-2">
              Описание
            </h3>
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
              <p className="text-sm lg:text-base text-opacity-80 italic">
                {recommendation.description.length > descriptionPreviewLength
                  ? `${recommendation.description.substring(
                      0,
                      descriptionPreviewLength
                    )}...`
                  : recommendation.description}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-0">
            <h3 className="text-base lg:text-lg font-semibold mb-2">
              Допълнителна информация:
            </h3>
            <ul className="flex flex-wrap gap-x-3 lg:gap-x-4 gap-y-1 text-sm lg:text-base text-opacity-80">
              <li>
                <strong className="text-primary">Артисти:</strong>{" "}
                {recommendation.artists.length > 0
                  ? recommendation.artists
                  : "Неизвестни"}
              </li>
              <li>
                <strong className="text-primary">Албум:</strong>{" "}
                {recommendation.albumTitle || "Неизвестен"}
              </li>
              <li>
                <strong className="text-primary">Тип албум:</strong>{" "}
                {recommendation.albumType || "Неизвестен"}
              </li>
              <li>
                <strong className="text-primary">Продължителност:</strong>{" "}
                {formatDuration(recommendation.durationMs)}
              </li>
              <li>
                <strong className="text-primary">Дата на издаване:</strong>{" "}
                {formatDate(recommendation.albumReleaseDateInSpotify)}
              </li>
              {recommendation.albumTotalTracks && (
                <li>
                  <strong className="text-primary">Песни в албума:</strong>{" "}
                  {recommendation.albumTotalTracks}
                </li>
              )}
              {recommendation.spotifyPopularity && (
                <li>
                  <strong className="text-primary">Spotify популярност:</strong>{" "}
                  {recommendation.spotifyPopularity}/100
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {recommendation.youtubeMusicVideoUrl && (
        <InfoboxModal
          onClick={handleTrailerModalClick}
          isModalOpen={isVideoModalOpen}
          title={`Музикално видео на ${recommendation.title} - ${recommendation.artists}`}
          description={
            <div className="container text-center">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={recommendation.youtubeMusicVideoUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* Reason Modal */}
      {recommendation.reason &&
        recommendation.reason.length > reasonPreviewLength && (
          <InfoboxModal
            onClick={handleReasonModalClick}
            isModalOpen={isReasonModalOpen}
            title={`Защо препоръчваме ${recommendation.title}?`}
            description={
              <div className="text-left">
                <p className="text-opacity-80 italic whitespace-pre-wrap">
                  {recommendation.reason}
                </p>
              </div>
            }
          />
        )}
    </div>
  );
};

export default RecommendationCard;
