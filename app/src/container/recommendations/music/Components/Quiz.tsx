import { FC, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { RecommendationsList } from "./RecommendationsList";
import { QuizQuestions } from "./QuizQuestions";
import { handleRetakeQuiz } from "../helper_functions";
import Loader from "@/components/common/loader/Loader";

export const Quiz: FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendationList, setRecommendationList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBrainAnalysisComplete, setIsBrainAnalysisComplete] = useState(false);
  const [renderBrainAnalysis, setRenderBrainAnalysis] = useState(false);

  const alreadyHasRecommendations = recommendationList.length > 0;
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
              // Случай 1: Когато не сме в режим на мозъчен анализ и не сме изпратили въпросника
              ((!renderBrainAnalysis && !submitted) ||
                // Случай 2: Когато сме в режим на мозъчен анализ, но анализът не е завършен
                (renderBrainAnalysis && !isBrainAnalysisComplete))
            }
            alreadyHasRecommendations={alreadyHasRecommendations}
            setRecommendationList={setRecommendationList}
            setIsBrainAnalysisComplete={setIsBrainAnalysisComplete}
            isBrainAnalysisComplete={isBrainAnalysisComplete}
            renderBrainAnalysis={renderBrainAnalysis}
            setRenderBrainAnalysis={setRenderBrainAnalysis}
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
                    renderBrainAnalysis
                  )
                }
                className="text-primary font-semibold hover:text-secondary transition-colors underline"
              >
                Повторете {renderBrainAnalysis ? "анализа" : "въпросника"}
              </button>
            </p>
          </div>
          <RecommendationsList
            recommendationList={recommendationList}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
      </CSSTransition>
    </div>
  );
};
