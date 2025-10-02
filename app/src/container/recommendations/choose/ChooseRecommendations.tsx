import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Loader from "../../../components/common/loader/Loader";
import { DataType } from "./choose-types";
import { getAverageMetrics } from "../../helper_functions_common";
import { Card } from "@/components/ui/card";
import MainMetricsWidget from "@/container/aiAnalysator/Components/MainMetricsWidget";

const ChooseRecommendations: FC = () => {
  // Състояние за проследяване дали зареждаме съдържание
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Хук за пренасочване към различни страници

  // Състояние за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    averagePrecisionPercentage: "", // Средна прецизност в проценти
    averagePrecisionLastRoundPercentage: "", // Средна прецизност за последния кръг в проценти
    averageRecallPercentage: "", // Среден Recall в проценти
    averageF1ScorePercentage: "" // Среден F1 резултат в проценти
  });

  // Въпросът, който ще се покаже на потребителя, и опциите за избор
  const question = {
    question:
      "Искате да гледате, четете или слушате нещо, но не знаете какво? MindReel ще направи избора Ви лесен като Ви зададе няколко въпроса за Вашите предпочитания и Ви предложи най-добре отговарящите на тях филми, сериали, книги и музика!", // Самият въпрос
    options: [
      { label: "Филми и сериали", route: "/app/recommendations/movies_series" }, // Опция за филми и сериали
      { label: "Книги", route: "/app/recommendations/books" }, // Опция за книги
      { label: "Музика", route: "/app/recommendations/music" } // Опция за музика
    ]
  };

  // Функция, която се изпълнява при клик върху даден бутон
  const handleOptionClick = (route: string) => {
    setLoading(true); // Задаваме състоянието на "зареждане"
    navigate(route); // Пренасочваме към избрания маршрут
    setLoading(false); // Изключваме състоянието на "зареждане" (след приключване)
  };

  // useEffect за извличане на данни, когато компонентът се зареди за първи път
  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      try {
        const averageMetrics = await getAverageMetrics(); // Изчакваме да получим данните
        setData((prevData) => ({
          ...prevData,
          averagePrecisionPercentage:
            averageMetrics.average_precision_percentage,
          averagePrecisionLastRoundPercentage:
            averageMetrics.average_precision_last_round_percentage,
          averageRecallPercentage: averageMetrics.average_recall_percentage,
          averageF1ScorePercentage: averageMetrics.average_f1_score_percentage
        }));
      } catch (error) {
        console.error("Error fetching average metrics:", error);
      }
    };

    fetchDataAndUpdate();
  }, []); // Празен масив - изпълнява се само веднъж при зареждане на компонента

  return (
    <FadeInWrapper>
      {/* Основният контейнер с анимация за избледняване */}
      <CSSTransition
        in={!loading} // Анимацията се изпълнява само ако не зареждаме
        timeout={500} // Продължителност на анимацията
        classNames="fade" // CSS класове за анимация
        unmountOnExit // Компонентът се премахва от DOM, ако не се показва
      >
        <div className="mb-[12rem]">
          {/* Карти с информация за AI */}
          <div className="bg-bodybg p-6 rounded-xl shadow-lg space-y-6 my-[1.5rem]">
            {/* Карти с информация за потребителя */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6 lg:grid-cols-12">
              <MainMetricsWidget
                className="col-span-3 bg-bodybg"
                icon={<i className="ti ti-percentage-60 text-2xl"></i>}
                title="Среден Precision (за последно генериране)"
                value={`${data.averagePrecisionLastRoundPercentage}%`}
                description="Средна стойност, спрямо всички потребители (отнася се за последно
              генерираните от тях препоръки)"
              />
              <MainMetricsWidget
                className="col-span-3 bg-bodybg"
                icon={<i className="ti ti-percentage-60 text-2xl"></i>}
                title="Среден Precision (като цяло)"
                value={`${data.averagePrecisionPercentage}%`}
                description="Средна стойност, спрямо всички потребители (отнася се за всички препоръки в
              платформата)"
              />
              <MainMetricsWidget
                className="col-span-3 bg-bodybg"
                icon={<i className="ti ti-percentage-40 text-2xl"></i>}
                title="Среден Recall"
                value={`${data.averageRecallPercentage}%`}
                description="Средна стойност, спрямо всички потребители (отнася се за всички препоръки в
              платформата)"
              />
              <MainMetricsWidget
                className="col-span-3 bg-bodybg"
                icon={<i className="ti ti-percentage-70 text-2xl"></i>}
                title="Среден F1 Score"
                value={`${data.averageF1ScorePercentage}%`}
                description="Средна стойност, спрямо всички потребители (отнася се за всички препоръки в
              платформата)"
              />
            </div>
          </div>

          {/* Въпрос и бутоните за избор */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-4xl text-center">
              {/* Текстът на въпроса */}
              <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center">
                <h2 className="text-[1.3rem] goodTiming text-defaulttextcolor dark:text-white/80">
                  {question.question}
                </h2>
              </Card>
              <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300 mt-[1.5rem]">
                <h5 className="text-2xl font-semibold break-words">
                  Какво искате да разгледате в момента?
                </h5>
              </div>
              {/* Бутоните, подравнени хоризонтално */}
              <div className="flex flex-col sm:flex-row justify-between sm:gap-4 w-full">
                {question.options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleOptionClick(option.route)}
                    className={`w-full sm:w-1/2 py-6 next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 flex justify-center items-center text-4xl transition-all duration-300 ease-in-out transform hover:scale-105`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>

      {/* Анимация за показване на Loader при зареждане */}
      <CSSTransition
        in={loading} // Loader се показва, ако зареждаме
        timeout={100} // Продължителност на анимацията
        classNames="fade" // CSS класове за анимация
        unmountOnExit // Loader се премахва от DOM, ако не се показва
        key="loading"
      >
        <Loader />
      </CSSTransition>
    </FadeInWrapper>
  );
};

export default ChooseRecommendations;
