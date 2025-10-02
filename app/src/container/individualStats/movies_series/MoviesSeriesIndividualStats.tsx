import { FC, Fragment, useEffect, useState } from "react";
import { DataType } from "./moviesSeriesIndividualStats-types";
import { fetchData } from "./helper_functions";
import {
  checkRecommendationExistsInWatchlist,
  validateToken
} from "../../helper_functions_common";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Notification from "../../../components/common/notification/Notification";
import { NotificationState } from "../../types_common";
import ActorsDirectorsWritersTable from "./Components/ActorsDirectorsWritersTable";
import MoviesAndSeriesRecommendationsTable from "./Components/MoviesAndSeriesRecommendationsTable";
import GenresBarChart from "./Components/GenresBarChart";
import CountWidgets from "./Components/CountWidgets";
import BookmarkAlert from "./Components/BookmarkAlert";
import ErrorCard from "../../../components/common/error/error";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";

interface IndividualStatsProps {}

const IndividualStats: FC<IndividualStatsProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    topRecommendations: {
      recommendationsCount: {
        movies: 0,
        series: 0
      },
      recommendations: []
    }, // Топ препоръки
    topRecommendationsWatchlist: {
      savedCount: {
        movies: 0,
        series: 0
      },
      watchlist: []
    }, // Запазени филми/сериали в списък за гледане
    topGenres: [], // Топ жанрове
    topGenresWatchlist: [], // Топ запазени жанрове
    sortedDirectorsByRecommendationCount: [], // Режисьори, сортирани по просперитет
    sortedActorsByRecommendationCount: [], // Актьори, сортирани по просперитет
    sortedWritersByRecommendationCount: [], // Сценаристи, сортирани по просперитет
    sortedDirectorsBySavedCount: [], // Режисьори, сортирани по просперитет
    sortedActorsBySavedCount: [], // Актьори, сортирани по просперитет
    sortedWritersBySavedCount: [] // Сценаристи, сортирани по просперитет
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  ); // Състояние за показване на известия (например съобщения за грешки, успехи или предупреждения)
  const [bookmarkedMovies, setBookmarkedMovies] = useState<{
    [key: string]: any;
  }>({});
  const [alertVisible, setAlertVisible] = useState(false); // To control alert visibility
  const [currentBookmarkStatus, setCurrentBookmarkStatus] = useState(false); // Track current bookmark status

  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNotificationClose = () => {
    // Функция за затваряне на известията
    if (notification?.type === "error") {
      // Ако известието е от тип "грешка", пренасочване към страницата за вход
      navigate("/signin");
    }
    setNotification(null); // Зануляване на известието
  };

  useEffect(() => {
    validateToken(setNotification); // Стартиране на проверката на токена при първоначално зареждане на компонента

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Вземане на токен от localStorage или sessionStorage

    if (token) {
      setLoading(true);
      fetchData(token, setData, setLoading); // Извличане на данни с помощта на fetchData функцията
      console.log("fetching"); // Лог за следене на извличането на данни
    }
  }, []);

  useEffect(() => {
    const loadBookmarkStatus = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (token) {
        const updatedBookmarks: { [key: string]: any } = {};
        if (data.topRecommendationsWatchlist.watchlist) {
          for (const movie of data.topRecommendationsWatchlist.watchlist) {
            try {
              const isBookmarked = await checkRecommendationExistsInWatchlist(
                movie.imdbID,
                token
              );
              if (isBookmarked) {
                updatedBookmarks[movie.imdbID] = movie;
              }
            } catch (error) {
              console.error("Error checking watchlist status:", error);
            }
          }
        }
        setBookmarkedMovies(updatedBookmarks);
      }
    };

    loadBookmarkStatus();
  }, [data.topRecommendationsWatchlist.watchlist]);

  if (loading) {
    return (
      <FadeInWrapper loadingTimeout={30000}>
        <div></div>
      </FadeInWrapper>
    );
  }

  if (
    !data.topRecommendations.recommendations ||
    data.topRecommendations.recommendations.length === 0 ||
    !data.topGenres.length ||
    !data.sortedDirectorsByRecommendationCount.length ||
    !data.sortedActorsByRecommendationCount.length ||
    !data.sortedWritersByRecommendationCount.length
  ) {
    return (
      <>
        <ErrorCard
          message="🔍 За да можете да разгледате Вашите индивидуални статистики, моля, първо генерирайте филми или сериали. 
        Това ще ни позволи да съберем необходимите данни и да Ви предоставим 
        подробен анализ 📊 на вашата активност в платформата. ⚙️"
          redirectUrl={`${
            import.meta.env.BASE_URL
          }app/recommendations/movies_series`}
          redirectText="Генерирайте нови препоръки за филми/сериали"
        />
        <div className="mb-[15rem]"></div>
      </>
    );
  }

  const handleDismiss = () => {
    setAlertVisible(false);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <FadeInWrapper>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      {alertVisible && (
        <BookmarkAlert
          isBookmarked={currentBookmarkStatus}
          onDismiss={handleDismiss}
        />
      )}
      <Fragment>
        <div className="grid grid-cols-12 gap-6 my-[1.5rem]">
          <div className="xl:col-span-12 col-span-12">
            <div
              className="accordion accordionicon-left accordions-items-separate"
              id="accordioniconLeft"
            >
              <div
                className="hs-accordion-group"
                data-hs-accordion-always-open=""
              >
                <div
                  className="hs-accordion accordion-item overflow-hidden active"
                  id="hs-basic-with-title-and-arrow-stretched-heading-one"
                >
                  <button
                    className="hs-accordion-toggle accordion-button hs-accordion-active:text-primary hs-accordion-active:pb-3 group py-0 inline-flex items-center justify-between gap-x-3 w-full font-semibold goodTiming text-start transition hover:text-secondary dark:hs-accordion-active:text-primary dark:hover:text-secondary"
                    aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-one"
                    type="button"
                  >
                    Моите Топ Препоръки - Статистики
                    <svg
                      className="hs-accordion-active:hidden hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary block w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <svg
                      className="hs-accordion-active:block hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary hidden w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div
                    id="hs-basic-with-title-and-arrow-stretched-collapse-one"
                    className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                    aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-one"
                  >
                    <div className="text-center !text-lg box p-6 flex flex-col mt-5 ml-5 mr-5">
                      <p className="leading-relaxed">
                        В тази секция, можете да се натъкнете на информация за
                        това кои са най-успешните{" "}
                        <span className="font-bold text-primary">
                          актьори, режисьори, сценаристи
                        </span>
                        , според авторската мерна единица -{" "}
                        <span className="font-bold text-primary">
                          „Просперитетен рейтинг“
                        </span>
                        <span
                          className="text-gray-500 cursor-pointer hover:text-primary/80 transition-all duration-150"
                          onClick={handleModalToggle}
                        >
                          {" <<Натиснете тук, за да научите повече>> "}
                        </span>
                        , сред най-често{" "}
                        <span className="font-bold text-primary">
                          препоръчваните
                        </span>{" "}
                        филми и сериали{" "}
                        <span className="font-bold text-primary">
                          специално за вас
                        </span>
                        . Също така, можете да видите кои са най-често
                        препоръчваните ви жанрове и колко на{" "}
                        <span className="font-bold text-primary">
                          брой филми и сериали
                        </span>{" "}
                        са били препоръчвани на вас някога!
                      </p>
                    </div>

                    <div className="grid grid-cols-12 gap-x-6 mt-5 ml-5 mr-5">
                      <div className="xxl:col-span-6 col-span-12">
                        <MoviesAndSeriesRecommendationsTable
                          type="recommendations"
                          data={data.topRecommendations.recommendations}
                          setBookmarkedMovies={setBookmarkedMovies}
                          setCurrentBookmarkStatus={setCurrentBookmarkStatus}
                          setAlertVisible={setAlertVisible}
                          bookmarkedMovies={bookmarkedMovies}
                        />
                      </div>
                      <div className="xxl:col-span-6 col-span-12">
                        <ActorsDirectorsWritersTable
                          data={data}
                          type="recommendations"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-x-6 ml-5 mr-5">
                      <div className="xxl:col-span-6 col-span-12">
                        <GenresBarChart
                          type="recommendations"
                          data={data.topGenres}
                        />
                      </div>
                      <div className="xxl:col-span-6 col-span-12">
                        <CountWidgets
                          type="recommendations"
                          recommendationsCount={
                            data.topRecommendations.recommendationsCount
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {data.topRecommendationsWatchlist.watchlist ||
                data.topGenresWatchlist.length ||
                data.sortedDirectorsBySavedCount.length ||
                data.sortedActorsBySavedCount.length ||
                data.sortedWritersBySavedCount.length ? (
                  <div
                    className="hs-accordion accordion-item overflow-hidden"
                    id="hs-basic-with-title-and-arrow-stretched-heading-two"
                  >
                    <button
                      className="hs-accordion-toggle accordion-button hs-accordion-active:text-primary hs-accordion-active:pb-3 group py-0 inline-flex items-center justify-between gap-x-3 w-full font-semibold goodTiming text-start transition hover:text-secondary dark:hs-accordion-active:text-primary dark:hover:text-secondary"
                      aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-two"
                      type="button"
                    >
                      Моята Колекция за Гледане - Статистики
                      <svg
                        className="hs-accordion-active:hidden hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary block w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <svg
                        className="hs-accordion-active:block hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary hidden w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <div
                      id="hs-basic-with-title-and-arrow-stretched-collapse-two"
                      className="hs-accordion-content accordion-body hidden w-full overflow-hidden transition-[height] duration-300"
                      aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-two"
                    >
                      <div className="text-center !text-lg box p-6 flex flex-col mt-3 ml-5 mr-5">
                        <p className="leading-relaxed">
                          В тази секци, можете да се натъкнете на информация за
                          това кои са най-успешните{" "}
                          <span className="font-bold text-primary">
                            актьори, режисьори, сценаристи
                          </span>
                          , според авторската мерна единица -{" "}
                          <span className="font-bold text-primary">
                            „Просперитетен рейтинг“
                          </span>
                          <span
                            className="text-gray-500 cursor-pointer hover:text-primary/80 transition-all duration-150"
                            onClick={handleModalToggle}
                          >
                            {" <<Натиснете тук, за да научите повече>> "}
                          </span>
                          , сред вашите{" "}
                          <span className="font-bold text-primary">
                            запазвани
                          </span>{" "}
                          препоръки в списъка ви за гледане. Също така, можете
                          да видите кои са{" "}
                          <span className="font-bold text-primary">
                            ВАШИТЕ топ жанрове
                          </span>{" "}
                          и колко на{" "}
                          <span className="font-bold text-primary">
                            брой филми и сериали
                          </span>{" "}
                          сте запазили!
                        </p>
                      </div>
                      <div className="grid grid-cols-12 gap-x-6 mt-5 ml-5 mr-5">
                        <ActorsDirectorsWritersTable
                          data={data}
                          type="watchlist"
                        />
                      </div>
                      <div className="grid grid-cols-12 gap-x-6 ml-5 mr-5">
                        <div className="xxl:col-span-6 col-span-12">
                          <GenresBarChart
                            type="watchlist"
                            data={data.topGenresWatchlist}
                          />
                        </div>
                        <div className="xxl:col-span-6 col-span-12">
                          <CountWidgets
                            type="watchlist"
                            recommendationsCount={
                              data.topRecommendationsWatchlist.savedCount
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <InfoboxModal
          onClick={handleModalToggle}
          isModalOpen={isModalOpen}
          title="Просперитетен рейтинг"
          description={
            <>
              <ul>
                <li>
                  <strong>Просперитетът</strong> се получава като се изчисли
                  сборът на стойностите на няколко критерии.
                </li>
                <br />
                <li>
                  За всеки критерий се задава определено процентно отношение,
                  което отразява неговата важност спрямо останалите:
                </li>
                <br />
                <ul className="coollist pl-5">
                  <li>30% за спечелени награди</li>
                  <li>25% за номинации</li>
                  <li>15% за приходите от боксофис</li>
                  <li>10% за Метаскор</li>
                  <li>10% за IMDb рейтинг</li>
                  <li>10% за Rotten Tomatoes рейтинг</li>
                </ul>
              </ul>
            </>
          }
        />
      </Fragment>
    </FadeInWrapper>
  );
};

export default IndividualStats;
