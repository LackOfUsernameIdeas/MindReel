import React, { Fragment } from "react";
import { CSSTransition } from "react-transition-group"; // Import CSSTransition
import PrecisionFormula from "../precisionFormula/precisionFormula";
import Collapsible from "../collapsible/collapsible";
import RelevantRecommendations from "../relevantRecommendations/relevantRecommendations";
import Widget from "../widget/widget";
import { Card } from "@/components/ui/card";
import { RecommendationsAnalysesWidgetsProps } from "./recommendationsAnalyses-types";
import { useNavigate } from "react-router-dom";

const RecommendationsAnalysesWidgets: React.FC<
  RecommendationsAnalysesWidgetsProps
> = ({
  recommendationsAnalysis,
  currentIndex,
  handlePrev,
  handleNext,
  isSwitching = true,
  inTransition = false,
  setInTransition,
  direction = "right",
  newGeneration
}) => {
  const {
    relevantCount,
    totalCount,
    precisionValue,
    precisionPercentage,
    relevantRecommendations
  } = recommendationsAnalysis;
  const navigate = useNavigate();
  return (
    <Fragment>
      <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl max-w-7xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center mt-4">
        <h2 className="!text-3xl goodTiming font-bold">
          Анализ на {isSwitching ? "последно генерираните" : "текущите"}{" "}
          препоръки:
        </h2>
        <p className="text-base text-gray-600">
          {newGeneration
            ? "Искате да разгледате по-подробен анализ? "
            : "Искате да разгледате още анализи? "}
          <button
            onClick={() =>
              navigate(
                `${
                  newGeneration
                    ? `${import.meta.env.BASE_URL}app/aiAnalysator`
                    : `${
                        import.meta.env.BASE_URL
                      }app/recommendations/movies_series`
                }`
              )
            }
            className="text-primary font-semibold hover:text-secondary transition-colors underline"
          >
            {newGeneration ? "Посетете AI Анализатор." : "Към Нови Препоръки."}
          </button>
        </p>
      </Card>

      <CSSTransition
        in={!inTransition} // Активиране на анимацията, когато 'inTransition' е false
        timeout={500} // Задаване на времето за анимация (например 500ms)
        classNames={`slide-${direction}`} // Определяне на посоката на анимацията въз основа на 'isSwitching'
        onExited={setInTransition ? () => setInTransition(false) : () => {}} // Нулиране на състоянието след като анимацията приключи
        unmountOnExit // Премахване на компонента, когато анимацията завърши
      >
        <div className="bg-bodybg mt-4 p-6 rounded-xl shadow-lg space-y-6 max-w-7xl">
          <div className="relative w-full">
            {isSwitching && (
              <svg
                onClick={handlePrev}
                className="absolute top-1/2 transform -translate-y-1/2 left-[-5.5rem] sm:left-[-7rem] text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: "5rem",
                  height: "5rem",
                  filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
                }}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            )}

            <RelevantRecommendations
              relevantRecommendations={relevantRecommendations}
              currentIndex={currentIndex}
              title_en={relevantRecommendations[currentIndex].title_en}
              title_bg={relevantRecommendations[currentIndex].title_bg}
            />

            {isSwitching && (
              <svg
                onClick={handleNext}
                className="absolute top-1/2 transform -translate-y-1/2 right-[-5.5rem] sm:right-[-7rem] text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: "5rem",
                  height: "5rem",
                  filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
                }}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </div>
        </div>
      </CSSTransition>

      <div className="bg-bodybg mt-4 p-6 max-w-7xl rounded-xl shadow-lg space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Widget
            icon={<i className="ti ti-checklist text-3xl"></i>}
            title="Брой релевантни препоръки"
            value={relevantCount}
          />
          <Widget
            icon={<i className="ti ti-list text-3xl"></i>}
            title="Общ брой генерирани препоръки"
            value={totalCount}
          />
          <Widget
            icon={<i className="ti ti-percentage text-3xl"></i>}
            title="Precision в процент"
            value={`${precisionPercentage}%`}
          />
          <Widget
            icon={<i className="ti ti-star text-3xl"></i>}
            title="Средна релевантност"
            value={(
              relevantRecommendations.reduce(
                (acc, rec) => acc + rec.relevanceScore,
                0
              ) / relevantRecommendations.length
            ).toFixed(2)}
          />
        </div>
        <Collapsible
          title={
            <div className="flex items-center">
              <i className="ti ti-math-function text-2xl mr-2"></i>
              Изчисляване на Precision за{" "}
              {isSwitching ? "последното" : "текущото"} генериране на препоръки
            </div>
          }
        >
          <PrecisionFormula
            relevantCount={relevantCount}
            totalCount={totalCount}
            precisionValue={precisionValue}
            precisionPercentage={precisionPercentage}
          />
        </Collapsible>
      </div>
    </Fragment>
  );
};

export default RecommendationsAnalysesWidgets;
