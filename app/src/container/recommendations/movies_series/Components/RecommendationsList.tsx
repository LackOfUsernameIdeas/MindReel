import { FC, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { RecommendationsProps } from "../moviesSeriesRecommendations-types";
import RecommendationCard from "./RecommendationCard";
import { PlotModal } from "./PlotModal";
import ErrorCard from "../../../../components/common/error/error";

export const RecommendationsList: FC<RecommendationsProps> = ({
  recommendationList,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  currentIndex,
  setCurrentIndex,
  setAlertVisible,
  bookmarkedMovies
}) => {
  const [inTransition, setInTransition] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"description" | "plot">(
    "description"
  );
  const animationDuration = 500;

  if (!recommendationList.length) {
    return (
      <ErrorCard
        message={`Няма налични препоръки :(\nМоля, опитайте отново. 🔄`}
        mt={10}
      />
    );
  }

  const handleNext = () => {
    setDirection("right");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === recommendationList.length - 1 ? 0 : prevIndex + 1
      );
      setIsExpanded(false);
      setInTransition(false);
    }, 500);
  };

  const handlePrevious = () => {
    setDirection("left");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? recommendationList.length - 1 : prevIndex - 1
      );
      setIsExpanded(false);
      setInTransition(false);
    }, 500);
  };

  const openModal = (type: "description" | "plot") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between">
      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames="arrows"
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <svg
          onClick={handlePrevious}
          className="absolute z-10 top-1/2 left-[-3rem] md:left-[-4rem] lg:left-[-4rem] xl:left-[-6rem] 2xl:left-[-10rem] transform -translate-y-1/2 text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "4rem",
            height: "4rem",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
          }}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </CSSTransition>

      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames={`slide-${direction}`}
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <RecommendationCard
          recommendationList={recommendationList}
          currentIndex={currentIndex}
          isExpanded={isExpanded}
          openModal={openModal}
          setCurrentBookmarkStatus={setCurrentBookmarkStatus}
          setAlertVisible={setAlertVisible}
          setBookmarkedMovies={setBookmarkedMovies}
          bookmarkedMovies={bookmarkedMovies}
        />
      </CSSTransition>

      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames="arrows"
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <svg
          onClick={handleNext}
          className="absolute z-2 top-1/2 right-[-3rem] md:right-[-4rem] lg:right-[-4rem] xl:right-[-6rem] 2xl:right-[-10rem] transform -translate-y-1/2 text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "4rem",
            height: "4rem",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
          }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </CSSTransition>

      <CSSTransition
        in={isModalOpen}
        timeout={300}
        classNames="fade-no-transform"
        unmountOnExit
      >
        <PlotModal
          recommendationList={recommendationList}
          currentIndex={currentIndex}
          closeModal={closeModal}
          modalType={modalType}
        />
      </CSSTransition>
    </div>
  );
};
