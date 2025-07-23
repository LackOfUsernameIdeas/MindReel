import { FC, useState } from "react";
import {
  Play,
  ExternalLink,
  Clock,
  Calendar,
  Users,
  Disc,
  Eye,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import { RecommendationCardProps } from "../musicRecommendations-types";

const MusicRecommendationCard: FC<RecommendationCardProps> = ({
  recommendationList,
  currentIndex,
  isExpanded,
  openModal,
  setBookmarkedMusic,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMusic
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false); // Състояние за отваряне на модалния прозорец

  const recommendation = recommendationList[currentIndex];
  const isBookmarked = recommendation.id
    ? bookmarkedMusic[recommendation.id]
    : false;

  const handleBookmark = () => {
    if (!recommendation.id) return;

    setBookmarkedMusic((prev) => {
      const newBookmarked = { ...prev };
      if (isBookmarked) {
        delete newBookmarked[recommendation.id!];
        setCurrentBookmarkStatus(false);
      } else {
        newBookmarked[recommendation.id!] = recommendation;
        setCurrentBookmarkStatus(true);
      }
      return newBookmarked;
    });
    setAlertVisible(true);
  };

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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-0">
          <div className="flex w-full items-center sm:items-start flex-col lg:flex-row">
            {/* Album Cover Section */}
            <div className="relative flex-shrink-0 mb-6 lg:mb-0 lg:mr-8 flex flex-col items-center p-6">
              <div
                className={`relative group ${
                  recommendation.youtubeMusicVideoUrl ? "cursor-pointer" : ""
                }`}
                onClick={handleTrailerModalClick}
              >
                <img
                  src={
                    recommendation.albumCover ||
                    "/placeholder.svg?height=320&width=320&query=music album cover"
                  }
                  alt={`${recommendation.albumTitle || "Album"} Cover`}
                  className={`rounded-2xl w-80 h-80 object-cover transition-all duration-300 shadow-2xl ${
                    recommendation.youtubeMusicVideoUrl
                      ? "group-hover:scale-105 group-hover:blur-sm"
                      : ""
                  }`}
                />

                {/* Play Button Overlay */}
                {recommendation.youtubeMusicVideoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 group-hover:scale-[1.7] transition-transform duration-500"></div>
                        <div className="relative bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/30 shadow-2xl">
                          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
                          <Play className="w-16 h-16 text-white fill-white drop-shadow-lg relative z-10" />
                          <div className="absolute inset-0 rounded-full border-2 border-white/40 group-hover:animate-ping"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {recommendation.youtubeMusicVideoViews && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {formatNumber(recommendation.youtubeMusicVideoViews)}
                  </Badge>
                )}
                {recommendation.youtubeMusicVideoLikes && (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  >
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {formatNumber(recommendation.youtubeMusicVideoLikes)}
                  </Badge>
                )}
                {recommendation.youtubeMusicVideoComments && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {formatNumber(recommendation.youtubeMusicVideoComments)}
                  </Badge>
                )}
              </div>

              {/* Bookmark Button */}
              <Button
                onClick={handleBookmark}
                variant={isBookmarked ? "default" : "outline"}
                className="mt-4 w-full"
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                    Запазено
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Запази
                  </>
                )}
              </Button>
            </div>

            {/* Content Section */}
            <div className="flex-grow p-6 space-y-6">
              {/* Title and Artist */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {recommendation.title}
                </h1>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
                  {recommendation.artists}
                </h2>

                {/* Song Details */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(recommendation.durationMs)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(recommendation.albumReleaseDateInSpotify)}
                  </div>
                  {recommendation.albumType && (
                    <div className="flex items-center gap-1">
                      <Disc className="w-4 h-4" />
                      {recommendation.albumType}
                    </div>
                  )}
                  {recommendation.spotifyPopularity && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Популярност: {recommendation.spotifyPopularity}/100
                    </div>
                  )}
                </div>
              </div>

              {/* Spotify Rating */}
              {recommendation.spotifyPopularity && (
                <div className="flex items-center space-x-4 py-4 px-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                      <div className="font-semibold text-green-800 dark:text-green-200">
                        Spotify Популярност
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {recommendation.spotifyPopularity}/100
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reason for Recommendation */}
              {recommendation.reason && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">
                    Защо препоръчваме "{recommendation.title}"?
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 italic leading-relaxed">
                    {recommendation.reason}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-200">
                  Описание
                </h3>
                <div
                  className={`text-purple-700 dark:text-purple-300 italic leading-relaxed transition-all duration-500 ease-in-out ${
                    isExpanded ? "" : "max-h-[3rem] overflow-hidden opacity-70"
                  }`}
                >
                  <p>
                    {isExpanded ||
                    recommendation.description.length <=
                      descriptionPreviewLength
                      ? recommendation.description
                      : `${recommendation.description.substring(
                          0,
                          descriptionPreviewLength
                        )}...`}
                  </p>
                </div>
                {recommendation.description.length >
                  descriptionPreviewLength && (
                  <Button
                    variant="link"
                    onClick={() => openModal("description")}
                    className="mt-2 p-0 h-auto text-purple-600 hover:text-purple-800"
                  >
                    Пълно описание
                  </Button>
                )}
              </div>

              {/* Album Information */}
              {(recommendation.albumTitle ||
                recommendation.albumType ||
                recommendation.albumTotalTracks) && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">
                    Информация за албума:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {recommendation.albumTitle && (
                      <div>
                        <strong className="text-primary">Албум:</strong>{" "}
                        {recommendation.albumTitle}
                      </div>
                    )}
                    {recommendation.albumType && (
                      <div>
                        <strong className="text-primary">Тип:</strong>{" "}
                        {recommendation.albumType}
                      </div>
                    )}
                    {recommendation.albumTotalTracks && (
                      <div>
                        <strong className="text-primary">Общо песни:</strong>{" "}
                        {recommendation.albumTotalTracks}
                      </div>
                    )}
                    {recommendation.albumReleaseDateInSpotify && (
                      <div>
                        <strong className="text-primary">
                          Дата на издаване:
                        </strong>{" "}
                        {formatDate(recommendation.albumReleaseDateInSpotify)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
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
                {recommendation.youtubeMusicVideoUrl && (
                  <Button variant="outline" onClick={handleTrailerModalClick}>
                    <Play className="w-4 h-4 mr-2" />
                    Гледай видеото
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Modal */}
      {recommendation.youtubeMusicVideoUrl && (
        <InfoboxModal
          onClick={handleTrailerModalClick}
          isModalOpen={isVideoModalOpen}
          title={`Трейлър на ${recommendation.title}`}
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

export default MusicRecommendationCard;
