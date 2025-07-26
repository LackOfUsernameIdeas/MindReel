import { FC, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Genre, QuizQuestionProps } from "../moviesSeriesRecommendations-types";
import { motion } from "framer-motion";
import {
  handleAnswerClick,
  handleInputChange,
  handleBack,
  handleNext,
  isGenreOption,
  handleSubmit
} from "../helper_functions";
import {
  ageOptions,
  moodOptions,
  timeAvailabilityOptions,
  pacingOptions,
  depthOptions,
  targetGroupOptions
} from "../moviesSeriesRecommendations-data";
import {
  moviesSeriesGenreOptions,
  preferenceOptions
} from "../../../data_common";
import { ConfirmationModal } from "./ConfirmationModal";
import { ViewRecommendations } from "./ViewRecommendations";
import Notification from "../../../../components/common/notification/Notification";
import { useNavigate } from "react-router-dom";
import { BrainAnalysisSteps } from "./BrainAnalysisSteps";
import {
  getBrainAnalysisMarginClass,
  getMarginClass
} from "@/container/helper_functions_common";

export const QuizQuestions: FC<QuizQuestionProps> = ({
  setLoading,
  setSubmitted,
  submitted,
  showViewRecommendations,
  alreadyHasRecommendations,
  setRecommendationList,
  setRecommendationsAnalysis,
  setBookmarkedMovies,
  setIsBrainAnalysisComplete,
  isBrainAnalysisComplete,
  renderBrainAnalysis,
  setRenderBrainAnalysis
}) => {
  const [preferencesType, setPreferencesType] = useState<string | null>(null);
  const [recommendationType, setRecommendationType] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [timeAvailability, setTimeAvailability] = useState("");
  const [age, setAge] = useState("");
  const [actors, setActors] = useState("");
  const [directors, setDirectors] = useState("");
  const [interests, setInterests] = useState("");
  const [countries, setCountries] = useState("");
  const [pacing, setPacing] = useState("");
  const [depth, setDepth] = useState("");
  const [targetGroup, setTargetGroup] = useState("");

  const [submitCount, setSubmitCount] = useState(0);
  const [marginClass, setMarginClass] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string[] | null>(null);
  const typeOptions = ["Филм", "Сериал"];
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const questions = [
    {
      question: "Как искате да продължите?",
      options: preferenceOptions.moviesSeries,
      value: preferencesType,
      setter: setPreferencesType
    },
    {
      question: "Какво търсите - филм или сериал?",
      options: typeOptions,
      value: recommendationType,
      setter: setRecommendationType
    },
    {
      question: "Кои жанрове Ви се гледат в момента?",
      options: moviesSeriesGenreOptions,
      isMultipleChoice: true,
      value: genres,
      setter: setGenres
    },
    {
      question: "Как се чувствате в момента?",
      options: moodOptions,
      isMultipleChoice: true,
      value: moods,
      setter: setMoods
    },
    {
      question: "С какво време за гледане разполагате?",
      options: timeAvailabilityOptions,
      value: timeAvailability,
      setter: setTimeAvailability
    },
    {
      question: "Изберете приблизително време на създаване на филма/сериала.",
      options: ageOptions,
      value: age,
      setter: setAge
    },
    {
      question: "Кои са вашите любими актьори?",
      isInput: true,
      value: actors,
      setter: setActors,
      placeholder: "Пример: Брад Пит, Леонардо ди Каприо, Ема Уотсън"
    },
    {
      question: "Кои филмови режисьори предпочитате?",
      isInput: true,
      value: directors,
      setter: setDirectors,
      placeholder: "Пример: Дъфър брадърс, Стивън Спилбърг, Джеки Чан"
    },
    {
      question: "От кои страни предпочитате да е филмът/сериалът?",
      isInput: true,
      value: countries,
      setter: setCountries,
      placeholder: "Пример: България, САЩ"
    },
    {
      question:
        "Филми/Сериали с каква бързина на развитие на сюжетното действие предпочитате?",
      options: pacingOptions,
      value: pacing,
      setter: setPacing
    },
    {
      question: "Филми/Сериали с какво ниво на задълбочаване харесвате?",
      options: depthOptions,
      value: depth,
      setter: setDepth
    },
    {
      question: "Каква е вашата целева група?",
      options: targetGroupOptions,
      value: targetGroup,
      setter: setTargetGroup
    },
    {
      question: "Какви теми ви интересуват?",
      isInput: true,
      value: interests,
      setter: setInterests,
      placeholder: "Опишете темите, които ви интересуват",
      description:
        "Предпочитате филм/сериал, който засяга определена историческа епоха, държава или дори представя история по действителен случай? Интересуват ви филми, в които се разследва мистерия или социален проблем, или такива, в които животни играят важна роля? А какво ще кажете за филми, свързани с пътешествия и изследване на света, или пък разкази за въображаеми светове? Дайте описание. Можете също така да споделите примери за филми/сериали, които предпочитате."
    }
  ];
  const totalQuestions = questions.length;
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  const moviesSeriesUserPreferences = {
    recommendationType,
    genres,
    moods: moods?.map((mood) => mood.split(" ")[0]),
    timeAvailability,
    age,
    actors,
    directors,
    interests,
    countries,
    pacing,
    depth,
    targetGroup
  };

  const isBackDisabled = currentQuestionIndex === 0;
  const currentQuestion = questions[currentQuestionIndex];

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (currentQuestion.isInput && currentQuestion.setter === setInterests) {
      currentQuestion.value = interests;
    }
  }, [currentQuestion, interests]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleClick = () => {
    if (
      !(
        (selectedAnswer && selectedAnswer.length > 0) ||
        (currentQuestion.isInput &&
          typeof currentQuestion.value === "string" &&
          currentQuestion.value.trim() !== "")
      )
    ) {
      return;
    }

    // Handle the "Мозъчен анализ" case
    if (
      currentQuestionIndex === 0 &&
      selectedAnswer?.includes(
        "Мозъчен анализ - препоръките се дават на база анализ от устройство за измерване на мозъчни вълни"
      )
    ) {
      // Set state to render BrainAnalysisSteps
      setRenderBrainAnalysis(true);
    } else if (
      currentQuestionIndex === 0 &&
      selectedAnswer?.includes(
        "VR сцена - потапяне в киноизкуството чрез препоръчване на филми и сериали в реалистична VR среда"
      )
    ) {
      // TODO: Тук добавяш какво се случва при избор на VR сцена
    } else {
      if (currentQuestionIndex === totalQuestions - 1) {
        if (alreadyHasRecommendations) {
          handleOpenModal();
        } else {
          handleSubmit(
            setNotification,
            setLoading,
            setSubmitted,
            setSubmitCount,
            setRecommendationList,
            setRecommendationsAnalysis,
            setBookmarkedMovies,
            token,
            submitCount,
            false,
            moviesSeriesUserPreferences
          );
        }
      } else {
        handleNext(
          setSelectedAnswer,
          setShowQuestion,
          setCurrentQuestionIndex,
          questions
        );
      }
    }
  };

  const handleNotificationClose = () => {
    // Проверяваме дали типът на известието е "error"
    if (notification?.type === "error") {
      // Ако е грешка, пренасочваме потребителя към страницата за вход
      navigate("/signin");
    }
    // Затваряме известието, като го задаваме на null
    setNotification(null);
  };

  // Изпълняваме useEffect при всяка промяна на currentQuestion или selectedAnswer
  useEffect(() => {
    if (currentQuestion?.value) {
      // Проверяваме дали опциите на въпроса са масив и дали всички опции са жанрове
      if (
        Array.isArray(currentQuestion.options) &&
        currentQuestion.options.every(isGenreOption)
      ) {
        // Ако стойността на въпроса е масив, филтрираме и изваждаме само стойностите за bg
        const genreBgValues = Array.isArray(currentQuestion.value)
          ? currentQuestion.value
              .filter(
                (value): value is { en: string; bg: string } =>
                  typeof value === "object" && "bg" in value && "en" in value
              )
              .map((value) => value.bg)
          : [
              currentQuestion.value,
              // Търсим съответния bg за избраната стойност от опциите
              currentQuestion.options.find(
                (option: { en: string; bg: string }) =>
                  option.en === currentQuestion.value
              )?.bg || currentQuestion.value
            ];

        // Ако избраните стойности не съвпадат със стария отговор, обновяваме selectedAnswer
        if (JSON.stringify(genreBgValues) !== JSON.stringify(selectedAnswer)) {
          console.log("genreBgValues: ", genreBgValues);
          setSelectedAnswer(genreBgValues); // Актуализираме отговора
        }
      } else {
        // Ако стойността на въпроса не е жанрова опция, се уверяваме, че стойността е масив от string
        const newValue = Array.isArray(currentQuestion.value)
          ? currentQuestion.value.filter(
              (item): item is string => typeof item === "string"
            )
          : [currentQuestion.value].filter(
              (item): item is string => typeof item === "string"
            );

        // Сравняваме текущия отговор със стария, за да избегнем ненужни обновявания
        if (JSON.stringify(newValue) !== JSON.stringify(selectedAnswer)) {
          setSelectedAnswer(newValue); // Актуализираме отговора само при нужда
        }
      }
    }
  }, [currentQuestion, selectedAnswer]);

  useEffect(() => {
    async function fetchMargin() {
      const margin = await getBrainAnalysisMarginClass(
        currentStepIndex,
        isBrainAnalysisComplete
      );
      setMarginClass(margin);
    }

    fetchMargin();
  }, [currentStepIndex, isBrainAnalysisComplete]);

  console.log("user's preferences: ", moviesSeriesUserPreferences);
  return (
    <div>
      {showViewRecommendations && (
        <ViewRecommendations
          setShowQuestion={setShowQuestion}
          setLoading={setLoading}
          setSubmitted={setSubmitted}
        />
      )}
      {notification?.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      <CSSTransition
        in={showQuestion}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div
          className={`w-full ${
            !isBrainAnalysisComplete ? "max-w-4xl py-0" : "py-2"
          } px-4 mb-[12rem] ${
            window.innerWidth >= 640 && !renderBrainAnalysis
              ? getMarginClass(currentQuestion)
              : window.innerWidth >= 640 && renderBrainAnalysis
              ? marginClass
              : ""
          }`}
        >
          {/* Ако е избрана опцията за генериране на препоръки с устройство за анализ на мозъчните импулси, визуализираме компонента BrainAnalysisSteps */}
          {renderBrainAnalysis ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <BrainAnalysisSteps
                currentStepIndex={currentStepIndex}
                setCurrentStepIndex={setCurrentStepIndex}
                setSubmitted={setSubmitted}
                setNotification={setNotification}
                setRecommendationList={setRecommendationList}
                setRecommendationsAnalysis={setRecommendationsAnalysis}
                setBookmarkedMovies={setBookmarkedMovies}
                submitCount={submitCount}
                submitted={submitted}
                token={token}
                setSubmitCount={setSubmitCount}
                setIsBrainAnalysisComplete={setIsBrainAnalysisComplete}
                isBrainAnalysisComplete={isBrainAnalysisComplete}
              />
            </motion.div>
          ) : (
            <>
              <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
                <h2 className="text-xl font-semibold break-words">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.description && (
                  <p className="text-sm text-gray-500 mt-2">
                    {currentQuestion.description}
                  </p>
                )}
              </div>
              <div className={isBackDisabled ? "my-8" : "mb-2"}>
                {!isBackDisabled && (
                  <div className="flex justify-start ">
                    <button
                      onClick={() =>
                        handleBack(
                          setSelectedAnswer,
                          setShowQuestion,
                          setCurrentQuestionIndex,
                          questions
                        )
                      }
                      className="back-button text-secondary dark:text-white hover:opacity-70 text-3xl transition-all duration-300 "
                    >
                      &#8592;
                    </button>
                  </div>
                )}
              </div>
              {currentQuestion.isInput ? (
                <div className="mb-4">
                  {currentQuestion.setter === setInterests ? (
                    <div>
                      <textarea
                        className="form-control bg-opacity-70 border-2 rounded-lg p-4 mb-4 text-white glow-effect transition-all duration-300 hover:text-secondary"
                        placeholder={currentQuestion.placeholder}
                        value={interests}
                        onChange={(e) => {
                          handleInputChange(
                            currentQuestion.setter,
                            e.target.value
                          );

                          if (e.target.value.trim() === "") {
                            setSelectedAnswer([]);
                          } else {
                            setSelectedAnswer([e.target.value]);
                          }
                        }}
                        rows={4}
                        maxLength={200}
                        disabled={
                          currentQuestion.value === "Нямам предпочитания"
                        }
                      />
                      <div className="flex justify-between mx-2">
                        <label className="flex items-center cursor-pointer hover:text-secondary">
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={
                              currentQuestion.value === "Нямам предпочитания"
                            }
                            onChange={() => {
                              const newValue =
                                currentQuestion.value === "Нямам предпочитания"
                                  ? ""
                                  : "Нямам предпочитания";
                              currentQuestion.setter(newValue);
                              setSelectedAnswer(
                                newValue === "" ? [] : [newValue]
                              );
                            }}
                          />
                          <span>Нямам предпочитания</span>
                        </label>
                        <div className="text-right mt-2">
                          <small>{`${interests.length} / 200`}</small>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        className="input-field form-control bg-opacity-70 border-2 rounded-lg p-4 mb-4 text-white glow-effect transition-all duration-300 hover:text-secondary"
                        placeholder={currentQuestion.placeholder}
                        value={currentQuestion.value}
                        onChange={(e) => {
                          handleInputChange(
                            currentQuestion.setter,
                            e.target.value
                          );
                          if (e.target.value.trim() === "") {
                            setSelectedAnswer([]);
                          } else {
                            setSelectedAnswer([e.target.value]);
                          }
                        }}
                        disabled={
                          currentQuestion.value === "Нямам предпочитания"
                        }
                        required
                      />
                      <div className="flex items-center text-white">
                        <label className="flex items-center ml-2 cursor-pointer text-secondary dark:text-white hover:text-secondary">
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={
                              currentQuestion.value === "Нямам предпочитания"
                            }
                            onChange={() => {
                              const newValue =
                                currentQuestion.value === "Нямам предпочитания"
                                  ? ""
                                  : "Нямам предпочитания";
                              currentQuestion.setter(newValue);
                              setSelectedAnswer(
                                newValue === "" ? [] : [newValue]
                              );
                            }}
                          />
                          <span className="ml-2">Нямам предпочитания</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`grid gap-4 ${
                    (currentQuestion.options?.length ?? 0) > 6
                      ? "grid-cols-2 md:grid-cols-5"
                      : "grid-cols-1"
                  }`}
                >
                  {currentQuestion.options?.map(
                    (option: any, index: number) => {
                      if (
                        Array.isArray(currentQuestion.options) &&
                        currentQuestion.options.every(isGenreOption)
                      ) {
                        return (
                          <div
                            key={index}
                            onClick={() =>
                              handleAnswerClick(
                                currentQuestion.setter,
                                option.bg,
                                setGenres,
                                currentQuestion,
                                selectedAnswer,
                                setSelectedAnswer
                              )
                            }
                            className={`${
                              selectedAnswer &&
                              selectedAnswer.includes(option.bg)
                                ? "selected-answer transform scale-105"
                                : "question hover:bg-secondary hover:text-white"
                            } bg-opacity-70 p-6 text-white rounded-lg glow-effect transition-all duration-300 cursor-pointer flex justify-center items-center text-center`}
                          >
                            {option.bg}
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={index}
                            onClick={() =>
                              handleAnswerClick(
                                currentQuestion.setter,
                                option,
                                setGenres,
                                currentQuestion,
                                selectedAnswer,
                                setSelectedAnswer
                              )
                            }
                            className={`${
                              selectedAnswer && selectedAnswer.includes(option)
                                ? "selected-answer transform scale-105"
                                : "question hover:bg-secondary hover:text-white"
                            } bg-opacity-70 p-6 text-white rounded-lg glow-effect transition-all duration-300 cursor-pointer ${
                              currentQuestion.options === moodOptions
                                ? "flex flex-col"
                                : "flex"
                            } justify-center items-center text-center`}
                          >
                            {currentQuestion.options === moodOptions ? (
                              <>
                                <span>{option.split(" ")[0]}</span>
                                <span className="text-lg">
                                  {option.split(" ").slice(-1)}
                                </span>{" "}
                              </>
                            ) : (
                              <>{option}</>
                            )}
                          </div>
                        );
                      }
                    }
                  )}
                </div>
              )}
              <div>
                <div
                  onClick={handleClick}
                  className={`next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 flex justify-center items-center transition-all duration-300 ease-in-out transform ${
                    (selectedAnswer && selectedAnswer.length > 0) ||
                    (currentQuestion.isInput &&
                      typeof currentQuestion.value === "string" &&
                      currentQuestion.value.trim() !== "")
                      ? "opacity-100 pointer-events-auto cursor-pointer hover:scale-105"
                      : "opacity-50 pointer-events-none cursor-not-allowed"
                  }`}
                >
                  {currentQuestionIndex === totalQuestions - 1
                    ? "Изпрати"
                    : "Следващ въпрос"}
                </div>
                {/* Modal Component */}
                {isModalOpen && alreadyHasRecommendations && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                      <ConfirmationModal
                        setNotification={setNotification}
                        setIsModalOpen={setIsModalOpen}
                        setLoading={setLoading}
                        setSubmitted={setSubmitted}
                        handleSubmit={handleSubmit}
                        setRecommendationList={setRecommendationList}
                        setRecommendationsAnalysis={setRecommendationsAnalysis}
                        setBookmarkedMovies={setBookmarkedMovies}
                        setSubmitCount={setSubmitCount}
                        moviesSeriesUserPreferences={
                          moviesSeriesUserPreferences
                        }
                        token={token}
                        submitCount={submitCount}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};
