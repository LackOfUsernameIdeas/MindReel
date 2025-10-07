import { FC, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { RecommendationsList } from "./RecommendationsList";
import { QuizQuestions } from "./QuizQuestions";
import { handleRetakeQuiz } from "../helper_functions";
import Loader from "@/components/common/loader/Loader";

export const Quiz: FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendationList, setRecommendationList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const alreadyHasRecommendations = recommendationList.length > 0;

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
                          setCurrentIndex
                        )
                      }
                      className="text-primary font-semibold hover:text-secondary transition-colors underline"
                    >
                      Повторете въпросника
                    </button>
                  </p>
                </div>
                <RecommendationsList
                  recommendationList={recommendationList}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                />
              </div>
            ) : (
              <div className="w-full max-w-4xl">
                <QuizQuestions
                  setLoading={setLoading}
                  setSubmitted={setSubmitted}
                  submitted={submitted}
                  showViewRecommendations={
                    alreadyHasRecommendations && !submitted
                  }
                  alreadyHasRecommendations={alreadyHasRecommendations}
                  setRecommendationList={setRecommendationList}
                />
              </div>
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};
