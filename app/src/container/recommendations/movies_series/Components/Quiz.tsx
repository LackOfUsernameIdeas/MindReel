import { FC, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { RecommendationsList } from "./RecommendationsList";
import { QuizQuestions } from "./QuizQuestions";
import { handleRetakeQuiz } from "../helper_functions";
import Loader from "@/components/common/loader/Loader";
import {
  QuizProps,
  RecommendationsAnalysis
} from "../moviesSeriesRecommendations-types";
import RecommendationsAnalysesWidgets from "@/components/common/recommendationsAnalyses/recommendationsAnalyses";

export const Quiz: FC<QuizProps> = ({
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMovies
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendationList, setRecommendationList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBrainAnalysisComplete, setIsBrainAnalysisComplete] = useState(false);
  const [renderBrainAnalysis, setRenderBrainAnalysis] = useState(false);
  const [renderVrScene, setRenderVrScene] = useState(false);
  const [recommendationsAnalysis, setRecommendationsAnalysis] =
    useState<RecommendationsAnalysis>({
      relevantCount: 0,
      totalCount: 0,
      precisionValue: 0,
      precisionPercentage: 0,
      relevantRecommendations: []
    });

  const alreadyHasRecommendations = recommendationList.length > 0;

  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex + 1) % recommendationsAnalysis.relevantRecommendations.length
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? recommendationsAnalysis.relevantRecommendations.length - 1
        : prevIndex - 1
    );
  };

  const isAnalysisUpdated = () =>
    recommendationsAnalysis.relevantCount !== 0 ||
    recommendationsAnalysis.totalCount !== 0 ||
    recommendationsAnalysis.precisionValue !== 0 ||
    recommendationsAnalysis.precisionPercentage !== 0 ||
    recommendationsAnalysis.relevantRecommendations.length > 0;

  console.log("recommendationsAnalysis: ", recommendationsAnalysis);
  return (
    <div className="flex items-center justify-center px-4">
      <CSSTransition
        in={loading}
        timeout={100}
        classNames="fade"
        unmountOnExit
        key="loading"
      >
        <Loader />
      </CSSTransition>

      <CSSTransition
        in={!loading && !submitted}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div className={`${!isBrainAnalysisComplete && "w-full max-w-4xl"}`}>
          <QuizQuestions
            setLoading={setLoading}
            setSubmitted={setSubmitted}
            submitted={submitted}
            showViewRecommendations={
              alreadyHasRecommendations &&
              ((!renderBrainAnalysis && !renderVrScene && !submitted) ||
                (renderBrainAnalysis && !isBrainAnalysisComplete) ||
                (renderVrScene && !submitted))
            }
            alreadyHasRecommendations={alreadyHasRecommendations}
            setRecommendationList={setRecommendationList}
            setRecommendationsAnalysis={setRecommendationsAnalysis}
            setBookmarkedMovies={setBookmarkedMovies}
            setIsBrainAnalysisComplete={setIsBrainAnalysisComplete}
            isBrainAnalysisComplete={isBrainAnalysisComplete}
            renderBrainAnalysis={renderBrainAnalysis}
            setRenderBrainAnalysis={setRenderBrainAnalysis}
            renderVrScene={renderVrScene}
            setRenderVrScene={setRenderVrScene}
          />
        </div>
      </CSSTransition>

      <CSSTransition
        in={!loading && submitted}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <div className="my-6 text-center">
            <p className="text-lg text-gray-600">
              Искате други препоръки?{" "}
              <button
                onClick={() =>
                  handleRetakeQuiz(
                    setLoading,
                    setSubmitted,
                    setIsBrainAnalysisComplete,
                    setCurrentIndex,
                    renderBrainAnalysis,
                    renderVrScene,
                    setRenderBrainAnalysis
                  )
                }
                className="text-primary font-semibold hover:text-secondary transition-colors underline"
              >
                Повторете {renderBrainAnalysis ? "анализа" : "въпросника"}
              </button>
            </p>
          </div>

          {/* Conditional rendering based on renderVrScene */}
          {renderVrScene ? (
            <h1 className="text-3xl font-bold text-center text-white">
              VR Scene Experience Complete
            </h1>
          ) : (
            <>
              <RecommendationsList
                recommendationList={recommendationList}
                setCurrentBookmarkStatus={setCurrentBookmarkStatus}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                setAlertVisible={setAlertVisible}
                setBookmarkedMovies={setBookmarkedMovies}
                bookmarkedMovies={bookmarkedMovies}
              />
              {recommendationList.length && isAnalysisUpdated() && (
                <RecommendationsAnalysesWidgets
                  recommendationsAnalysis={recommendationsAnalysis}
                  currentIndex={currentIndex}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  isSwitching={false}
                  newGeneration
                />
              )}
            </>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};
