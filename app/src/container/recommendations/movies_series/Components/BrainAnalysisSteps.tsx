import { FC, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import {
  MoviesSeriesUserPreferences,
  NotificationState,
  RecommendationsAnalysis
} from "../moviesSeriesRecommendations-types";
import { handleSubmit } from "../helper_functions";
import BrainAnalysisTrackStats from "../../../../components/common/brainAnalysis/BrainAnalysisTrackStats";
import { BrainData } from "@/container/types_common";
import Loader from "@/components/common/loader/Loader";
import {
  connectSocketIO,
  MAX_DATA_POINTS,
  updateSeriesData
} from "@/container/helper_functions_common";
import { steps } from "@/container/data_common";
import DownloadButton from "@/components/common/download/Download";
import { InfoboxModal } from "../../../../components/common/infobox/InfoboxModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

// Компонент за въпросите по време на мозъчния анализ
export const BrainAnalysisSteps: FC<{
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationState | null>
  >;
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>;
  setRecommendationsAnalysis: React.Dispatch<
    React.SetStateAction<RecommendationsAnalysis>
  >;
  setBookmarkedMovies: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >;
  submitted: boolean;
  token: string | null;
  submitCount: number;
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>;
  setIsBrainAnalysisComplete: React.Dispatch<React.SetStateAction<boolean>>;
  isBrainAnalysisComplete: boolean;
}> = ({
  currentStepIndex,
  setCurrentStepIndex,
  setSubmitted,
  setNotification,
  setRecommendationList,
  setRecommendationsAnalysis,
  setBookmarkedMovies,
  submitted,
  token,
  submitCount,
  setSubmitCount,
  setIsBrainAnalysisComplete,
  isBrainAnalysisComplete
}) => {
  // Състояния за текущия индекс на въпроса, показване на въпроса, дали анализът е завършен и cooldown между въпроси
  const [showStep, setShowStep] = useState(true);
  const [transmissionComplete, setTransmissionComplete] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Зареждане...");
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [chartData, setChartData] = useState<BrainData | null>(null);
  const [seriesData, setSeriesData] = useState<BrainData[]>([]);
  const [attentionMeditation, setAttentionMeditation] = useState<
    {
      name: string;
      data: { x: string; y: number }[];
    }[]
  >([
    { name: "Attention", data: [] },
    { name: "Meditation", data: [] }
  ]);
  // State за отваряне/затваряне на InfoBox
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Състояние за избраното изображение (за показване в пълен размер)
  const closeModal = () => setSelectedImage(null); // Функция за затваряне на прозорецa с изображението

  useEffect(() => {
    if (isBrainAnalysisComplete) {
      connectSocketIO(
        setChartData,
        setTransmissionComplete,
        setConnectionError
      );
    }

    return () => {
      if (isBrainAnalysisComplete) {
        console.log(
          "Component unmounted, WebSocket connection should be closed."
        );
      }
    };
  }, [isBrainAnalysisComplete]);

  const retryConnection = () => {
    setConnectionError(false);
    connectSocketIO(setChartData, setTransmissionComplete, setConnectionError);
  };

  useEffect(() => {
    if (!chartData) return;
    if (!submitted) setLoading(false);

    setSeriesData((prevData) => {
      // Създаваме нов обект, копирайки само ненулевите стойности
      const filteredChartData: any = {
        time: chartData.time,
        delta: chartData.delta,
        theta: chartData.theta,
        lowAlpha: chartData.lowAlpha,
        highAlpha: chartData.highAlpha,
        lowBeta: chartData.lowBeta,
        highBeta: chartData.highBeta,
        lowGamma: chartData.lowGamma,
        highGamma: chartData.highGamma
      };

      // Добавяме attention и meditation само ако не са 0
      if (chartData.attention !== 0) {
        filteredChartData.attention = chartData.attention;
      }
      if (chartData.meditation !== 0) {
        filteredChartData.meditation = chartData.meditation;
      }

      const newData = [...prevData, filteredChartData];

      // Филтриране на данните – изключва само обекти, в които ВСИЧКИ brain wave стойности са 0
      const filteredData = newData.filter((data) => {
        const hasWaveData =
          data.delta !== 0 ||
          data.theta !== 0 ||
          data.lowAlpha !== 0 ||
          data.highAlpha !== 0 ||
          data.lowBeta !== 0 ||
          data.highBeta !== 0 ||
          data.lowGamma !== 0 ||
          data.highGamma !== 0;

        const hasAttentionMeditation =
          (data.attention !== undefined && data.attention !== 0) ||
          (data.meditation !== undefined && data.meditation !== 0);

        // Включва данни ако има brain waves ИЛИ attention/meditation
        return hasWaveData || hasAttentionMeditation;
      });

      return filteredData.length > MAX_DATA_POINTS
        ? filteredData.slice(-MAX_DATA_POINTS)
        : filteredData;
    });

    // Актуализира attention/meditation графиката само ако и двете не са нулеви
    if (chartData.attention === 0 || chartData.meditation === 0) return;

    setAttentionMeditation((prevData) =>
      prevData.map((stat, index) => {
        const key = index === 0 ? "attention" : "meditation";
        const value = chartData[key];
        return {
          ...stat,
          data: updateSeriesData(
            stat.data,
            chartData.time,
            typeof value === "number" ? value : 0
          )
        };
      })
    );
  }, [chartData]);

  // Общо количество стъпки
  const totalSteps = steps.length;
  // Текущата стъпка, който ще бъде показан
  const currentStep = steps[currentStepIndex];

  const moviesSeriesUserPreferences: MoviesSeriesUserPreferences = {
    recommendationType: "", // Вид на предпочитанията
    genres: [], // Жанрове на английски и български
    moods: [], // Настроения
    timeAvailability: "", // Наличност на време
    age: "", // Възраст
    actors: "", // Любими актьори
    directors: "", // Любими режисьори
    interests: "", // Интереси
    countries: "", // Предпочитани държави
    pacing: "", // Бързина на сюжетното действие
    depth: "", // Дълбочина на историята
    targetGroup: "" // Целева група
  };

  // Функция за преминаване към следващия въпрос
  const handleNext = () => {
    // Ако има активен cooldown, не се активира функцията
    if (isOnCooldown) return;
    setIsOnCooldown(true); // Слагаме cooldown
    // Изключваме показването на въпроса (за анимация)
    setShowStep(false);
    setTimeout(() => {
      // Проверяваме дали има още въпроси
      if (currentStepIndex < totalSteps - 1) {
        // Ако има, увеличаваме индекса на въпроса
        setCurrentStepIndex((prevIndex) => prevIndex + 1);
      } else {
        // Ако няма повече въпроси, маркираме анализата като завършена
        setLoadingMessage("Изчакване на връзка с устройството...");
        setIsBrainAnalysisComplete(true);
        setLoading(true);
      }
      // Включваме отново показването на въпроса
      setShowStep(true);
      setTimeout(() => {
        setIsOnCooldown(false); // Премахваме cooldown
      }, 500);
    }, 500); // Задаваме забавяне за анимацията
  };

  const isBackDisabled = currentStepIndex === 0;

  // Функция за връщане на предишна стъпка
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setShowStep(false); // Пускане на анимация
      setTimeout(() => {
        setCurrentStepIndex((prevIndex) => prevIndex - 1);
        setShowStep(true);
      }, 500); // Задаваме забавяне за анимацията
    }
  };

  // Функция за пропускане на стъпките
  const handleSkipAll = () => {
    setLoadingMessage("Изчакване на връзка с устройството...");
    setIsBrainAnalysisComplete(true); // Mark analysis as completed
    setLoading(true);
  };

  // Функция за изпращане на заявки за препоръки
  const handleRecommendationsSubmit = async (brainData: BrainData[]) => {
    setLoadingMessage("Генериране на препоръки...");
    await handleSubmit(
      setNotification,
      setLoading,
      setSubmitted,
      setSubmitCount,
      setRecommendationList,
      setRecommendationsAnalysis,
      setBookmarkedMovies,
      token,
      submitCount,
      true,
      moviesSeriesUserPreferences,
      brainData,
      "movies_series"
    );
  };

  // Функция за отваряне/затваряне на InfoBox
  const handleInfoButtonClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Everything disappears when there's a connection error */}
      <CSSTransition
        in={!connectionError}
        timeout={400}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <CSSTransition
            in={loading}
            timeout={500} // Време за анимация
            classNames="fade"
            unmountOnExit
          >
            <Loader brainAnalysis loadingMessage={loadingMessage} />
          </CSSTransition>
          <CSSTransition
            in={!loading && !isBrainAnalysisComplete && showStep}
            timeout={500} // Време за анимация
            classNames="fade"
            unmountOnExit
          >
            <div className="w-full max-w-4xl">
              <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
                <h2 className="text-xl font-semibold break-words">
                  {currentStep.step}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {currentStep.description}
                </p>
              </div>

              <div
                className={`flex ${
                  isBackDisabled ? "justify-end" : "justify-between"
                }`}
              >
                {!isBackDisabled && (
                  <div className="flex justify-start">
                    <button
                      onClick={handleBack}
                      className="back-button text-secondary dark:text-white hover:opacity-70 text-3xl transition-all duration-300 "
                    >
                      &#8592;
                    </button>
                  </div>
                )}
                {!isBrainAnalysisComplete && (
                  <button
                    onClick={handleSkipAll}
                    className="back-button text-secondary dark:text-white hover:opacity-70 text-3xl transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="text-sm">Пропускане на стъпките</span>{" "}
                    &#8594;
                  </button>
                )}
              </div>

              {/* Показваме изображението за пример (като част от въпроса) */}
              <div className="border-2 border-primary rounded-lg p-4 bg-opacity-50 bg-bodybg text-white">
                <div className="flex flex-wrap justify-center gap-4">
                  {currentStep.images?.map((imgSrc, index) => (
                    <img
                      key={index}
                      src={imgSrc}
                      alt={`Изображение ${index}`}
                      className="h-32 cursor-pointer rounded-lg object-contain border-2 border-primary transition-transform hover:scale-105"
                      onClick={() => setSelectedImage(imgSrc)}
                    />
                  ))}
                </div>
                {currentStep.fileName && (
                  <div className="flex justify-center py-2">
                    <DownloadButton fileName={currentStep.fileName} />
                  </div>
                )}
                {selectedImage && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                    onClick={closeModal}
                  >
                    <img
                      src={selectedImage}
                      alt="Full-size"
                      className="max-w-full max-h-full rounded-lg shadow-lg"
                      onClick={(e) => e.stopPropagation()} // Предотвратява затварянето при клик върху изображението
                    />
                    {/* Х Бутон */}
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 p-2 bg-opacity-60 rounded-full transition-transform duration-300 transform hover:scale-110 z-10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 48 48"
                      >
                        <linearGradient
                          id="hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1"
                          x1="7.534"
                          x2="27.557"
                          y1="7.534"
                          y2="27.557"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0" stopColor="#f44f5a"></stop>
                          <stop offset=".443" stopColor="#ee3d4a"></stop>
                          <stop offset="1" stopColor="#e52030"></stop>
                        </linearGradient>
                        <path
                          fill="url(#hbE9Evnj3wAjjA2RX0We2a_OZuepOQd0omj_gr1)"
                          d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"
                        ></path>
                        <linearGradient
                          id="hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2"
                          x1="27.373"
                          x2="40.507"
                          y1="27.373"
                          y2="40.507"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0" stopColor="#a8142e"></stop>
                          <stop offset=".179" stopColor="#ba1632"></stop>
                          <stop offset=".243" stopColor="#c21734"></stop>
                        </linearGradient>
                        <path
                          fill="url(#hbE9Evnj3wAjjA2RX0We2b_OZuepOQd0omj_gr2)"
                          d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                )}

                <div className="mt-4 flex justify-center">
                  <div className="h-4 w-full max-w-md bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-3000 ease-linear"
                      style={{
                        width: `${(currentStepIndex / (totalSteps - 1)) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-center mt-2 text-secondary dark:text-white">
                  Разглеждане на стъпките... {currentStepIndex}/{totalSteps - 1}
                </p>
              </div>
              {/* Бутон за преминаване към следващия въпрос или завършване на анализа */}
              <div
                onClick={handleNext}
                className="next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-6 flex justify-center items-center transition-all duration-300 ease-in-out transform opacity-100 cursor-pointer hover:scale-105"
              >
                {currentStepIndex === totalSteps - 1
                  ? "Напред към анализа"
                  : "Следваща стъпка"}
              </div>
            </div>
          </CSSTransition>
          <CSSTransition
            in={!loading && isBrainAnalysisComplete}
            timeout={500} // Време за анимация
            classNames="fade"
            unmountOnExit
          >
            <div className="w-full">
              <BrainAnalysisTrackStats
                handleRecommendationsSubmit={handleRecommendationsSubmit}
                transmissionComplete={transmissionComplete}
                seriesData={seriesData}
                chartData={chartData}
                attentionMeditation={attentionMeditation}
                handleInfoButtonClick={handleInfoButtonClick}
              />
              <InfoboxModal
                onClick={handleInfoButtonClick}
                isModalOpen={isModalOpen}
                title="Мозъчна активност"
                description={
                  <>
                    <p>
                      <span className="font-semibold">Мозъчните вълни</span> са
                      електрически сигнали, генерирани от милиардите неврони в
                      мозъка. Те се анализират чрез т.нар.{" "}
                      <span className="font-semibold">
                        спектрална плътност на мощността (Power Spectral Density
                        или PSD)
                      </span>
                      , която показва как{" "}
                      <span className="font-semibold">енергията (силата)</span>{" "}
                      на вълните е разпределена в различни честотни диапазони.
                      Всеки един от тях е кръстен с буква от гръцката азбука.
                      Диапазоните могат да се разделят и на поддиапазони{" "}
                      <span className="font-semibold">(Low и High)</span>. Освен
                      мозъчните вълни, съществуват и специализирани алгоритми,
                      разработени от{" "}
                      <span className="font-semibold">NeuroSky</span>, които
                      анализират мозъчната дейност и извличат полезни показатели
                      -
                      <span className="font-semibold">
                        Attention (Измерване на вниманието)
                      </span>{" "}
                      и{" "}
                      <span className="font-semibold">
                        Mediation (Измерване на медитативното състояние)
                      </span>
                      .
                    </p>
                    <Accordion
                      type="single"
                      collapsible
                      className="space-y-4 pt-5"
                    >
                      <AccordionItem value="delta">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <span className="text-xl text-primary">Δ</span>{" "}
                            Delta вълни (0-4 Hz)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          Вълните с най-ниска честота са{" "}
                          <span className="font-semibold">Делта δ (0-4Hz)</span>{" "}
                          – когато имаме най-ниски нива на мозъчна активност.
                          При по-високи стойности на проявление на Делта
                          вълните, в сравнение с останалите, е характерно
                          състояние, при което човек е{" "}
                          <span className="font-semibold">
                            изключително отпуснат или дори заспал
                          </span>
                          . Човешкият мозък увеличава делта вълните, за да
                          намали съзнанието за физическия свят около него.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="theta">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <span className="text-xl text-primary">Θ</span>{" "}
                            Theta вълни (4-7 Hz)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <span className="font-semibold">Тета θ (4-7Hz)</span>{" "}
                          вълните се проявяват при по-високи, но все още
                          сравнително ниски нива на мозъчна активност. При
                          по-високи стойности на Тета вълни, в сравнение с
                          останалите, е характерно състояние, при което човек е{" "}
                          <span className="font-semibold">по-отпуснат</span>.
                          Освен това, тези вълни са силно свързани с
                          креативността, интуицията и въображението – като цяло
                          с{" "}
                          <span className="font-semibold">
                            вътрешна концентрация, медитация и духовно
                            осъзнаване
                          </span>{" "}
                          –{" "}
                          <span className="font-semibold">
                            състояние между будността и съня (хипнагонично
                            състояние)
                          </span>
                          .
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="low-alpha">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <span className="text-xl text-primary">α</span> Low
                            Alpha вълни (8-10 Hz)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <span className="font-semibold">
                            Ниските Алфа α вълни (8-10 Hz)
                          </span>{" "}
                          са характерни за преходни състояния между будност и
                          сън,{" "}
                          <span className="font-semibold">
                            лека разсеяност или унесено състояние
                          </span>
                          , тъй като са на границата с Тета вълните.{" "}
                          <span className="font-semibold">Алфа α (8-12Hz)</span>{" "}
                          вълните се проявяват при умерени нива на мозъчна
                          активност. При по-високи стойности на Алфа вълни, в
                          сравнение с останалите, е характерно състояние, при
                          което човек е{" "}
                          <span className="font-semibold">
                            спокоен, уравновесен, в добро настроение
                          </span>{" "}
                          – в{" "}
                          <span className="font-semibold">
                            нормално състояние
                          </span>
                          , при което има умствена координация и съзнателност.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="high-alpha">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <span className="text-xl text-primary">Α</span> High
                            Alpha вълни (10-12 Hz)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <span className="font-semibold">
                            Високите Алфа α вълни (10-12 Hz)
                          </span>{" "}
                          са свързани с{" "}
                          <span className="font-semibold">
                            оптимално и релаксирано
                          </span>
                          , но същевременно{" "}
                          <span className="font-semibold">концентрирано</span>{" "}
                          състояние, тъй като са на границата с Бета вълните. Те
                          се свързват с по-добра когнитивна ефективност, но без
                          да преминават в напрегнато състояние.{" "}
                          <span className="font-semibold">
                            Алфа α (8-12Hz) вълните
                          </span>{" "}
                          се проявяват при умерени нива на мозъчна активност.
                          При по-високи стойности на Алфа вълни, в сравнение с
                          останалите, е характерно състояние, при което човек е{" "}
                          <span className="font-semibold">
                            спокоен, уравновесен, в добро настроение
                          </span>{" "}
                          – в{" "}
                          <span className="font-semibold">
                            нормално състояние
                          </span>
                          , при което има умствена координация и съзнателност.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="low-beta">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <span className="text-xl text-primary">β</span> Low
                            Beta вълни (12-15 Hz)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <span className="font-semibold">
                            Ниски Бета β вълни (12-15 Hz)
                          </span>{" "}
                          – свързани са със{" "}
                          <span className="font-semibold">
                            спокойна концентрация
                          </span>{" "}
                          и устойчива{" "}
                          <span className="font-semibold">бдителност</span>, тъй
                          като са на границата с Алфа вълните. Те често се
                          асоциират със{" "}
                          <span className="font-semibold">
                            сензомоторния ритъм (SMR)
                          </span>{" "}
                          – специфичен мозъчен ритъм в диапазона 12–15 Hz, който
                          се генерира в сензомоторната кора.{" "}
                          <span className="font-semibold">SMR</span> играе
                          ключова роля в регулирането на двигателния контрол и е
                          свързан със състояния на спокойна концентрация, при
                          които тялото остава неподвижно, а умът е{" "}
                          <span className="font-semibold">фокусиран</span>.
                          Поддържането на стабилен SMR ритъм може да допринесе
                          за подобряване на вниманието, когнитивната ефективност
                          и самоконтрола, като същевременно намали
                          импулсивността и хиперактивността.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="high-beta">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <span className="text-xl text-primary">Β</span> High
                            Beta вълни (18-30 Hz)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <span className="font-semibold">
                            Високи Бета β вълни (18-30 Hz)
                          </span>{" "}
                          – асоциират се с{" "}
                          <span className="font-semibold">
                            когнитивна активност, стрес, тревожност и нервност
                          </span>
                          , тъй като мозъкът е в състояние на{" "}
                          <span className="font-semibold">
                            прекомерна активност и бдителност
                          </span>
                          .{" "}
                          <span className="font-semibold">
                            Бета β (12-30Hz) вълните
                          </span>{" "}
                          се проявяват при по-високи нива на мозъчна активност.
                          Тези вълни са свързани с{" "}
                          <span className="font-semibold">
                            логическото мислене, критичния анализ и когнитивната
                            обработка на информация
                          </span>
                          .
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="low-gamma">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <span className="text-xl text-primary">γ</span> Low
                            Gamma вълни (30-40 Hz)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          Вълните, които притежават{" "}
                          <span className="font-semibold">
                            най-силна честота
                          </span>{" "}
                          (най-бързи) са{" "}
                          <span className="font-semibold">
                            Гама γ вълните (над 30Hz)
                          </span>
                          . Те се проявяват при{" "}
                          <span className="font-semibold">интензивни</span> нива
                          на мозъчна активност. Те играят ключова роля в
                          синхронизирането на различните части на мозъка, което
                          позволява едновременно обработване на информация от
                          различни източници.{" "}
                          <span className="font-semibold">
                            Ниските Гама γ вълни (30-40 Hz)
                          </span>{" "}
                          са свързани с{" "}
                          <span className="font-semibold">
                            добра концентрация, ефективна обработка на
                            информация и синхронизация между мозъчните региони
                          </span>
                          . Оптималните стойности в този диапазон подпомагат
                          дългосрочната памет.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="high-gamma">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <span className="text-xl text-primary">Γ</span> High
                            Gamma вълни (40+ Hz)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          Вълните, които притежават{" "}
                          <span className="font-semibold">
                            най-силна честота
                          </span>{" "}
                          (най-бързи) са{" "}
                          <span className="font-semibold">
                            Гама γ вълните (над 30Hz)
                          </span>
                          . Те се проявяват при{" "}
                          <span className="font-semibold">интензивни</span> нива
                          на мозъчна активност. Те играят ключова роля в
                          синхронизирането на различните части на мозъка, което
                          позволява едновременно обработване на информация от
                          различни източници.{" "}
                          <span className="font-semibold">
                            Високите Гама γ вълни (40+ Hz)
                          </span>{" "}
                          са асоциират с изключително{" "}
                          <span className="font-semibold">
                            висока невронна активност и интензивна когнитивна
                            дейност
                          </span>
                          . При прекомерна активност в този диапазон, може да се
                          наблюдават{" "}
                          <span className="font-semibold">
                            свръхвъзбуда, тревожност, когнитивно пренатоварване
                            или дори свръхвисоки нива на стрес
                          </span>
                          .
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="attention">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <i className="text-xl text-primary ti ti-message-report" />
                            Attention
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <span className="font-semibold">
                            Attention (Измерване на вниманието)
                          </span>{" "}
                          - измерва нивото на концентрация и интензивността на
                          фокуса. Стойността му варира от{" "}
                          <span className="font-semibold">0 до 100</span>.
                          Високите стойности показват{" "}
                          <span className="font-semibold">
                            силна съсредоточеност
                          </span>{" "}
                          върху една мисъл или задача, а ниските стойности
                          означават
                          <span className="font-semibold">
                            {" "}
                            разсеяност или липса на концентрация
                          </span>
                          .
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="mediation">
                        <AccordionTrigger>
                          <div className="flex items-center gap-3 font-semibold">
                            <i className="text-xl text-primary ti ti-chart-histogram" />
                            Mediation
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <span className="font-semibold">
                            Mediation (Измерване на медитативното състояние)
                          </span>{" "}
                          – измерва нивото на спокойствие и релаксация.
                          Стойността му варира от{" "}
                          <span className="font-semibold">0 до 100</span>.
                          Високите стойности показват{" "}
                          <span className="font-semibold">
                            спокойствие, отпускане и баланс
                          </span>
                          . Ниските стойности сигнализират за
                          <span className="font-semibold">
                            {" "}
                            напрежение, стрес или неспокойствие
                          </span>
                          .
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                }
              />
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>

      {/* Fade-in error message when connection fails */}
      <CSSTransition
        in={connectionError}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div className="fixed inset-0 flex flex-col items-center justify-center space-y-4 text-center">
          <p>⚠️ Неуспешно свързване със сървъра.</p>
          <button
            onClick={retryConnection}
            className="mt-2 px-4 py-2 font-semibold rounded-lg hover:bg-opacity-80 transition"
          >
            🔄 Опитай отново
          </button>
        </div>
      </CSSTransition>
    </div>
  );
};
