import { FC, useState, useEffect, useRef } from "react";
import { ExternalLink, Eye, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import { handleMusicBookmarkClick } from "../../../helper_functions_common";
import { RecommendationCardAlertProps } from "../listenlist-types";

const RecommendationCardAlert: FC<RecommendationCardAlertProps> = ({
  selectedItem,
  onClose,
  setBookmarkedMusic,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMusic
}) => {
  const [visible, setVisible] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [albumCoverError, setAlbumCoverError] = useState(false);
  const previewLength = 150;
  const modalRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const [lastY, setLastY] = useState<number>(0);

  // Helper functions
  const formatArtists = (artists?: string | string[] | null): string => {
    if (!artists) return "N/A";
    if (Array.isArray(artists)) return artists.join(", ");
    return artists;
  };

  const formatDuration = (ms?: number | null): string => {
    if (!ms) return "N/A";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num?: number | null): string => {
    if (!num) return "N/A";
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "Неизвестна";
    return new Date(dateString).toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleTrailerModalClick = () => {
    selectedItem?.youtubeMusicVideoUrl && setIsVideoModalOpen((prev) => !prev);
  };

  const handleReasonModalClick = () => {
    setIsReasonModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (dragging) e.preventDefault();
    };

    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [dragging]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragging(true);
    setLastY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const deltaY = e.touches[0].clientY - lastY;
    setLastY(e.touches[0].clientY);
    requestAnimationFrame(() => {
      setPosition((prev) => prev + deltaY);
    });
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (selectedItem) {
      setVisible(true);
    }
  }, [selectedItem]);

  useEffect(() => {
    setAlbumCoverError(false);
  }, [selectedItem?.albumCover]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!selectedItem) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300 p-4 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        style={{
          transform: `translateY(${position}px)`,
          transition: dragging ? "none" : "transform 0.3s ease-out"
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative p-4 sm:p-6 rounded-lg shadow-lg bg-[rgb(var(--body-bg))] glow-effect border-2 dark:border-white border-secondary max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
          visible ? "scale-100" : "scale-75"
        } w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw]`}
      >
        <div className="recommendation-card">
          <div className="flex w-full items-start flex-col md:flex-row gap-4 md:gap-6">
            <div className="relative flex-shrink-0 w-full md:w-auto flex flex-col items-center">
              {/* Album Cover */}
              <div
                className={`relative group ${
                  selectedItem.youtubeMusicVideoUrl ? "cursor-pointer" : ""
                } w-full max-w-[280px] sm:max-w-[320px] md:max-w-none md:w-64`}
                onClick={handleTrailerModalClick}
              >
                {!albumCoverError && selectedItem.albumCover ? (
                  <img
                    src={selectedItem.albumCover}
                    alt=""
                    onError={() => setAlbumCoverError(true)}
                    className={`rounded-lg w-full h-auto transition-all duration-300 ${
                      selectedItem.youtubeMusicVideoUrl
                        ? "group-hover:scale-102 group-hover:blur-sm"
                        : ""
                    }`}
                  />
                ) : (
                  <div className="rounded-lg w-full aspect-[3.8/4] bg-white/70 dark:bg-bodybg2" />
                )}
                {/* Play button */}
                {selectedItem.youtubeMusicVideoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                    <div className="group relative">
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 group-hover:scale-[1.7] transition-transform duration-500"></div>
                      <div className="relative bg-white/10 backdrop-blur-md rounded-full p-4 sm:p-6 border border-white/30 shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 group-hover:border-white/50">
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="white"
                          viewBox="0 0 24 24"
                          className="size-12 sm:size-16 text-white drop-shadow-lg relative z-10 transform transition-transform duration-300 group-hover:scale-105"
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
                  handleMusicBookmarkClick(
                    selectedItem,
                    setBookmarkedMusic,
                    setCurrentBookmarkStatus,
                    setAlertVisible
                  )
                }
                className="absolute top-2 left-2 sm:top-4 sm:left-4 p-2 text-[#FFCC33] bg-black/50 bg-opacity-60 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  className="sm:w-[35px] sm:h-[35px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  {bookmarkedMusic[selectedItem?.spotifyID ?? ""] ? (
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

            <div className="flex-grow w-full md:flex-1 text-left">
              {/* Main Information */}
              <div className="mb-4">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                  {selectedItem.title || "Заглавие не е налично"}
                </p>
                <p className="text-sm sm:text-md md:text-lg font-semibold text-opacity-60 italic mb-2">
                  {formatArtists(selectedItem.artists)}
                </p>
                <p className="flex flex-wrap gap-1 text-xs sm:text-sm italic text-defaulttextcolor/70">
                  {selectedItem.albumType || "Тип неизвестен"} |{" "}
                  {formatDuration(selectedItem.durationMs)} |{" "}
                  {formatDate(selectedItem.albumReleaseDateInSpotify)} |{" "}
                  {selectedItem.spotifyPopularity
                    ? `Популярност: ${selectedItem.spotifyPopularity}/100`
                    : "Популярност: N/A"}
                </p>

                {/* Ratings */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-6 py-2">
                  {selectedItem.spotifyPopularity && (
                    <div
                      className="flex items-center gap-2 dark:text-[#1DB954] text-[#1DB954]"
                      title="Spotify популярност: Базирана на слушания и взаимодействия."
                    >
                      <span className="font-bold text-sm sm:text-base md:text-lg">
                        Spotify:{" "}
                      </span>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#1DB954] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">
                          S
                        </span>
                      </div>
                      <span className="font-bold text-sm sm:text-base md:text-lg">
                        {selectedItem.spotifyPopularity}/100
                      </span>
                      {selectedItem.spotifyUrl && (
                        <Button
                          asChild
                          className="bg-secondary/10 dark:bg-secondary/20 text-xs sm:text-sm px-2 py-1 h-auto"
                        >
                          <a
                            href={selectedItem.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">
                              Слушай в Spotify
                            </span>
                            <span className="sm:hidden">Spotify</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  )}

                  {selectedItem.youtubeMusicVideoViews && (
                    <div
                      className="flex items-center gap-2"
                      title="YouTube гледания: Общ брой гледания на музикалното видео."
                    >
                      <Eye className="text-[#FF0000] w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0" />
                      <span className="text-red-400 font-semibold text-sm sm:text-base md:text-lg">
                        {formatNumber(selectedItem.youtubeMusicVideoViews)}{" "}
                        гледания
                      </span>
                    </div>
                  )}

                  {selectedItem.youtubeMusicVideoLikes && (
                    <div
                      className="flex items-center gap-2"
                      title="YouTube харесвания: Брой харесвания на видеото."
                    >
                      <ThumbsUp className="text-[#FF0000] w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0" />
                      <span className="text-red-400 font-semibold text-sm sm:text-base md:text-lg">
                        {formatNumber(selectedItem.youtubeMusicVideoLikes)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reason for recommendation */}
              {selectedItem.reason && (
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Защо препоръчваме {selectedItem.title || "тази песен"}?
                  </h3>
                  <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
                    <p className="text-sm sm:text-base text-opacity-80 italic">
                      {selectedItem.reason.length > previewLength
                        ? `${selectedItem.reason.substring(
                            0,
                            previewLength
                          )}...`
                        : selectedItem.reason}
                    </p>
                  </div>
                  {selectedItem.reason.length > previewLength && (
                    <button
                      onClick={handleReasonModalClick}
                      className="mt-2 text-sm sm:text-base underline hover:scale-105 transition"
                    >
                      Пълно обяснение
                    </button>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Описание
                </h3>
                <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
                  <p className="text-sm sm:text-base text-opacity-80 italic">
                    {selectedItem.description.length > previewLength
                      ? `${selectedItem.description.substring(
                          0,
                          previewLength
                        )}...`
                      : selectedItem.description}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Допълнителна информация:
                </h3>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:text-base text-opacity-80">
                  <li>
                    <strong className="text-primary">Артисти:</strong>{" "}
                    {formatArtists(selectedItem.artists)}
                  </li>
                  <li>
                    <strong className="text-primary">Албум:</strong>{" "}
                    {selectedItem.albumTitle || "Неизвестен"}
                  </li>
                  <li>
                    <strong className="text-primary">Тип албум:</strong>{" "}
                    {selectedItem.albumType || "Неизвестен"}
                  </li>
                  <li>
                    <strong className="text-primary">Продължителност:</strong>{" "}
                    {formatDuration(selectedItem.durationMs)}
                  </li>
                  <li>
                    <strong className="text-primary">Дата на издаване:</strong>{" "}
                    {formatDate(selectedItem.albumReleaseDateInSpotify)}
                  </li>
                  {selectedItem.albumTotalTracks && (
                    <li>
                      <strong className="text-primary">Песни в албума:</strong>{" "}
                      {selectedItem.albumTotalTracks}
                    </li>
                  )}
                  {selectedItem.spotifyPopularity && (
                    <li>
                      <strong className="text-primary">
                        Spotify популярност:
                      </strong>{" "}
                      {selectedItem.spotifyPopularity}/100
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 sm:p-2 text-[#FFCC33] bg-opacity-60 rounded-full transition-transform duration-300 transform hover:scale-110 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="40"
            height="40"
            className="sm:w-[50px] sm:h-[50px]"
            viewBox="0 0 48 48"
          >
            <linearGradient
              id="hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1"
              x1="7.534"
              x2="27.557"
              y1="7.534"
              y2="27.557"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#f44f5a"></stop>
              <stop offset=".443" stopColor="#ee3d4a"></stop>
              <stop offset="1" stopColor="#e52030"></stop>
            </linearGradient>
            <path
              fill="url(#hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1)"
              d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"
            ></path>
            <linearGradient
              id="hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2"
              x1="27.373"
              x2="40.507"
              y1="27.373"
              y2="40.507"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#a8142e"></stop>
              <stop offset=".179" stopColor="#ba1632"></stop>
              <stop offset=".243" stopColor="#c21734"></stop>
            </linearGradient>
            <path
              fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)"
              d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Video Modal */}
      {selectedItem.youtubeMusicVideoUrl && (
        <InfoboxModal
          onClick={handleTrailerModalClick}
          isModalOpen={isVideoModalOpen}
          title={`Музикално видео на ${selectedItem.title} - ${formatArtists(
            selectedItem.artists
          )}`}
          description={
            <div className="container text-center">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={selectedItem.youtubeMusicVideoUrl}
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
      {selectedItem.reason && selectedItem.reason.length > previewLength && (
        <InfoboxModal
          onClick={handleReasonModalClick}
          isModalOpen={isReasonModalOpen}
          title={`Защо препоръчваме ${selectedItem.title}?`}
          description={
            <div className="text-left">
              <p className="text-opacity-80 italic whitespace-pre-wrap">
                {selectedItem.reason}
              </p>
            </div>
          }
        />
      )}
    </div>
  );
};

export default RecommendationCardAlert;
