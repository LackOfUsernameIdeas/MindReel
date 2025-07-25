import { FC, useEffect, useState } from "react";
import { Play, ExternalLink, Eye, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import { RecommendationCardProps } from "../musicRecommendations-types";

const RecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false); // Състояние за отваряне на модалния прозорец

  const [albumCoverError, setAlbumCoverError] = useState(false); // Състояние за грешка при зареждане на изображението

  const recommendation = recommendationList[currentIndex];

  const handleTrailerModalClick = () => {
    recommendation.youtubeMusicVideoUrl && setIsVideoModalOpen((prev) => !prev);
  }; // Функция за обработка на клик - модален прозорец

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

  useEffect(() => {
    setAlbumCoverError(false); // Ресет на грешката при зареждане на изображението
  }, [recommendation.albumCover]);

  console.log("recommendationList", recommendationList);
  return (
    <div className="recommendation-card">
      <div className="flex w-full items-center sm:items-start flex-col md:flex-row">
        <div className="relative flex-shrink-0 mb-4 md:mb-0 md:mr-8 flex flex-col items-center">
          {/* Постер */}
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
                className={`rounded-lg w-96 h-auto transition-all duration-300 ${
                  recommendation.youtubeMusicVideoUrl
                    ? "group-hover:scale-102 group-hover:blur-sm"
                    : ""
                }`}
              />
            ) : (
              <div className="rounded-lg w-96 aspect-[3.8/4] bg-white/70 dark:bg-bodybg2" />
            )}
            {/* Play button */}
            {recommendation.youtubeMusicVideoUrl && (
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                <div className="group relative">
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 group-hover:scale-[1.7] transition-transform duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/30 shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 group-hover:border-white/50">
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      className="size-16 text-white drop-shadow-lg relative z-10 transform transition-transform duration-300 group-hover:scale-105"
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
        </div>

        <div className="flex-grow">
          {/* Главна информация */}
          <div className="top-0 z-10">
            <a href="#" className="block text-xl sm:text-3xl font-bold mb-1">
              {recommendation.title || "Заглавие не е налично"}
            </a>
            <a
              href="#"
              className="block text-md sm:text-lg font-semibold text-opacity-60 italic mb-2"
            >
              {recommendation.artists || "Артисти неизвестни"}
            </a>
            <p className="flex gap-1 recommendation-small-details text-sm italic text-defaulttextcolor/70">
              {recommendation.albumType || "Тип неизвестен"} |{" "}
              {formatDuration(recommendation.durationMs)} |{" "}
              {formatDate(recommendation.albumReleaseDateInSpotify)} |{" "}
              {recommendation.spotifyPopularity
                ? `Популярност: ${recommendation.spotifyPopularity}/100`
                : "Популярност: N/A"}
            </p>

            {/* Рейтинги */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 py-2">
              {recommendation.spotifyPopularity && (
                <div
                  className="flex items-center space-x-2 dark:text-[#1DB954] text-[#1DB954]"
                  title="Spotify популярност: Базирана на слушания и взаимодействия."
                >
                  <span className="font-bold text-lg">Spotify: </span>
                  <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="font-bold text-lg">
                    {recommendation.spotifyPopularity}/100
                  </span>
                  {recommendation.spotifyUrl && (
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <a
                        href={recommendation.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Слушай в Spotify
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
                  <Eye className="text-[#FF0000] w-8 h-8" />
                  <span className="text-red-400 font-semibold text-md sm:text-sm md:text-lg">
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
                  <ThumbsUp className="text-[#FF0000] w-8 h-8" />
                  <span className="text-red-400 font-semibold text-md sm:text-sm md:text-lg">
                    {formatNumber(recommendation.youtubeMusicVideoLikes)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Причина за препоръчване */}
          {recommendation.reason && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Защо препоръчваме {recommendation.title || "тази песен"}?
              </h3>
              <p className="text-opacity-80 italic">{recommendation.reason}</p>
            </div>
          )}

          {/* Описание */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Описание</h3>
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-[3rem] opacity-70">
              <p className="text-opacity-80 italic">
                {recommendation.description.length > descriptionPreviewLength
                  ? `${recommendation.description.substring(
                      0,
                      descriptionPreviewLength
                    )}...`
                  : recommendation.description}
              </p>
            </div>
          </div>

          {/* Допълнителна информация */}
          <div className="mb-0">
            <h3 className="text-lg font-semibold mb-2">
              Допълнителна информация:
            </h3>
            <ul className="flex flex-wrap gap-x-4 text-opacity-80">
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
    </div>
  );
};

export default RecommendationCard;
