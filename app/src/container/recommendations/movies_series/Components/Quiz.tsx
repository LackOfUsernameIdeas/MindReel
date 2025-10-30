import { FC, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { RecommendationsList } from "./RecommendationsList";
import { QuizQuestions } from "./QuizQuestions";
import { handleRetakeQuiz } from "../helper_functions";
import Loader from "@/components/common/loader/Loader";
import {
  QuizProps,
  RecommendationsAnalysis
} from "../moviesSeriesRecommendations-types";
import RecommendationsAnalysesWidgets from "@/components/common/recommendationsAnalyses/recommendationsAnalyses";
import { VRRecommendationsList } from "./VRRecommendationsList";
import CustomVRButton from "./vr/CustomVRButton";

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

  // Determine which view to show
  const getViewKey = () => {
    if (loading) return "loading";
    if (submitted) return "results";
    return "questions";
  };

  return (
    <div className="flex items-center justify-center px-4">
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={getViewKey()}
          timeout={500}
          classNames="fade"
          unmountOnExit
        >
          <>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            ) : submitted ? (
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

                {renderVrScene ? (
                  <div>
                    <CustomVRButton />
                    <iframe
                      width="560"
                      height="315"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>

                    <VRRecommendationsList
                      recommendationList={recommendationList}
                      currentIndex={currentIndex}
                      setBookmarkedMovies={setBookmarkedMovies}
                      setCurrentBookmarkStatus={setCurrentBookmarkStatus}
                      bookmarkedMovies={bookmarkedMovies}
                    />
                  </div>
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
            ) : (
              <div
                className={`${!isBrainAnalysisComplete && "w-full max-w-4xl"}`}
              >
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
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};
