import { FC, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
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
  console.log("recommendationList: ", recommendationList);

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
                      onClick={() => handleRetakeQuiz(setLoading, setSubmitted)}
                      className="text-primary font-semibold hover:text-secondary transition-colors underline"
                    >
                      Повторете въпросника
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
                  <p className="text-base">
                    Източник: Google Books / Goodreads 📖
                  </p>
                </Card>
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
                  setBookmarkedBooks={setBookmarkedBooks}
                />
              </div>
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};
