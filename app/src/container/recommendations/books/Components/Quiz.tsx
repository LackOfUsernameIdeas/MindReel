import { FC, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { RecommendationsList } from "./RecommendationsList";
import { QuizQuestions } from "./QuizQuestions";
import { handleRetakeQuiz } from "../helper_functions";
import Loader from "../../../../components/common/loader/Loader";
import { QuizProps } from "../booksRecommendations-types";
import { Card } from "@/components/ui/card";

export const Quiz: FC<QuizProps> = ({
  setBookmarkedBooks,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedBooks
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendationList, setRecommendationList] = useState<any[]>([]);
  const [isBrainAnalysisComplete, setIsBrainAnalysisComplete] = useState(false);
  const [renderBrainAnalysis, setRenderBrainAnalysis] = useState(false);
  console.log("recommendationList: ", recommendationList);

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
            setBookmarkedBooks={setBookmarkedBooks}
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
            setCurrentBookmarkStatus={setCurrentBookmarkStatus}
            setAlertVisible={setAlertVisible}
            setBookmarkedBooks={setBookmarkedBooks}
            bookmarkedBooks={bookmarkedBooks}
          />
          <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl max-w-7xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center mt-4">
            <p className="text-base">Източник: Google Books / Goodreads 📖</p>
          </Card>
        </div>
      </CSSTransition>
    </div>
  );
};
