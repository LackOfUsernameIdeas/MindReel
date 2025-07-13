import { FC, useEffect, useState } from "react";
import { Quiz } from "./Components/Quiz";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../../helper_functions_common";
import {
  removeFromWatchlist,
  saveToWatchlist
} from "../../helper_functions_common";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Notification from "../../../components/common/notification/Notification";
import {
  NotificationState,
  Recommendation
} from "./musicRecommendations-types";
import BookmarkAlert from "./Components/BookmarkAlert";

interface MusicRecommendationsProps {}

const MusicRecommendations: FC<MusicRecommendationsProps> = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationState | null>(
    null // Състояние за съхраняване на текущото известие (съобщение и тип)
  );

  const [bookmarkedMusic, setBookmarkedMusic] = useState<{
    [key: string]: any;
  }>({});

  const [alertVisible, setAlertVisible] = useState(false); // To control alert visibility
  const [currentBookmarkStatus, setCurrentBookmarkStatus] = useState(false); // Track current bookmark status

  useEffect(() => {
    validateToken(setNotification); // Стартиране на проверката на токена при първоначално зареждане на компонента
  }, []);

  const handleNotificationClose = () => {
    if (notification?.type === "error") {
      navigate("/signin");
    }
    setNotification(null);
  };

  const handleBookmarkClick = (movie: Recommendation) => {
    setBookmarkedMusic((prev) => {
      const isBookmarked = !!prev[movie.imdbID];
      const updatedBookmarks = { ...prev };
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (isBookmarked) {
        // Remove the movie from bookmarks if it's already bookmarked
        delete updatedBookmarks[movie.imdbID];

        removeFromWatchlist(movie.imdbID, token).catch((error) => {
          console.error("Error removing from watchlist:", error);
        });
      } else {
        // Add the movie to bookmarks if it's not already bookmarked
        updatedBookmarks[movie.imdbID] = movie;

        saveToWatchlist(movie, token).catch((error) => {
          console.error("Error saving to watchlist:", error);
        });
      }

      setCurrentBookmarkStatus(!isBookmarked); // Update the current bookmark status
      setAlertVisible(true); // Show the alert

      return updatedBookmarks; // Return the updated bookmarks object
    });
  };
  console.log("bookmarkedMusic: ", bookmarkedMusic);

  const handleDismiss = () => {
    setAlertVisible(false);
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      {alertVisible && (
        <BookmarkAlert
          isBookmarked={currentBookmarkStatus}
          onDismiss={handleDismiss}
        />
      )}
      <FadeInWrapper>
        <Quiz
          bookmarkedMusic={bookmarkedMusic}
          setBookmarkedMusic={setBookmarkedMusic}
          setCurrentBookmarkStatus={setCurrentBookmarkStatus}
          setAlertVisible={setAlertVisible}
        />
      </FadeInWrapper>
    </>
  );
};

export default MusicRecommendations;
