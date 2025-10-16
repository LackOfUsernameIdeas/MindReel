import { FC, Fragment, useEffect, useState } from "react";
import { DataType } from "./listenlist-types";
import { fetchData } from "./helper_functions";
import {
  checkRecommendationExistsInListenlist,
  validateToken
} from "../../helper_functions_common";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Notification from "../../../components/common/notification/Notification";
import { NotificationState } from "../../types_common";
import MusicTable from "./Components/MusicTable";
import BookmarkAlert from "./Components/BookmarkAlert";
import ErrorCard from "../../../components/common/error/error";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const Listenlist: FC = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    topRecommendationsListenlist: [] // Запазени песни в списък за слушане
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  ); // Състояние за показване на известия (например съобщения за грешки, успехи или предупреждения)
  const [bookmarkedMusic, setBookmarkedMusic] = useState<{
    [key: string]: any;
  }>({});
  const [alertVisible, setAlertVisible] = useState(false); // To control alert visibility
  const [currentBookmarkStatus, setCurrentBookmarkStatus] = useState(false); // Track current bookmark status

  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
        if (data.topRecommendationsListenlist) {
          for (const song of data.topRecommendationsListenlist) {
            try {
              const isBookmarked = await checkRecommendationExistsInListenlist(
                song.spotifyID ?? "",
                token
              );
              if (isBookmarked) {
                updatedBookmarks[song.spotifyID ?? ""] = song;
              }
            } catch (error) {
              console.error("Error checking listenlist status:", error);
            }
          }
        }
        setBookmarkedMusic(updatedBookmarks);
      }
    };

    loadBookmarkStatus();
  }, [data.topRecommendationsListenlist]);

  if (loading) {
    return (
      <FadeInWrapper loadingTimeout={30000}>
        <div></div>
      </FadeInWrapper>
    );
  }

  console.log("data: ", data);

  if (
    !data.topRecommendationsListenlist ||
    data.topRecommendationsListenlist.length === 0
  ) {
    return (
      <>
        <ErrorCard
          message="🔍 За да можете да разгледате Вашия списък за слушане, моля, първо генерирайте песни и ги добавете в списъка! 📋"
          redirectUrl={`${import.meta.env.BASE_URL}app/recommendations/music`}
          redirectText="Генерирайте нови препоръки за песни"
        />
        <div className="mb-[15rem]"></div>
      </>
    );
  }

  const handleDismiss = () => {
    setAlertVisible(false);
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
        <div className="mt-[1.5rem]">
          <div className="text-center !text-lg box p-6 flex flex-col md:flex-row gap-6 justify-center items-stretch">
            <Card className="bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed md:w-1/2 mx-auto flex-grow flex items-center justify-center">
              <h2 className="text-lg font-GoodTiming text-defaulttextcolor dark:text-white/80">
                В тази страница можете да разгледате подробна информация за
                добавените от Вас филми и сериали в{" "}
                <span className="font-bold text-primary">
                  списъка ви за гледане
                </span>
                !
              </h2>
            </Card>
            <div className="md:w-1/2 text-sm">
              <Accordion type="single" collapsible className="space-y-4">
                {/* Spotify популярност */}
                <AccordionItem value="spotify-popularity">
                  <AccordionTrigger className="goodTiming">
                    🎵 Spotify популярност
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <span className="font-semibold">Spotify популярност</span> е
                    числена оценка от платформата{" "}
                    <span className="font-semibold">Spotify</span>, която
                    отразява колко често се слуша дадена песен или албум.
                    Измерва се по скала{" "}
                    <span className="font-semibold">(от 0 до 100)</span>, като
                    по-високата стойност показва по-голяма популярност и
                    активност на слушателите.
                  </AccordionContent>
                </AccordionItem>

                {/* Тип продукция */}
                <AccordionItem value="album-type">
                  <AccordionTrigger className="goodTiming">
                    💿 Тип продукция
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    Категоризацията на музикалното издание според броя песни и
                    формата. Основните типове включват:{" "}
                    <span className="font-semibold">сингъл</span> (1-3 песни),{" "}
                    <span className="font-semibold">EP</span> (4-6 песни),{" "}
                    <span className="font-semibold">албум</span> (7+ песни) и{" "}
                    <span className="font-semibold">компилация</span> (сборни
                    албуми). Типът албум влияе на начина, по който се възприема
                    и промотира музиката.
                  </AccordionContent>
                </AccordionItem>

                {/* YouTube ангажираност */}
                <AccordionItem value="youtube-engagement">
                  <AccordionTrigger className="goodTiming">
                    📺 YouTube ангажираност
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    Мерките за взаимодействие на потребителите с музикалното
                    видео на <span className="font-semibold">YouTube</span>.
                    Включват{" "}
                    <span className="font-semibold">харесвания (лайкове)</span>{" "}
                    и <span className="font-semibold">коментари</span>, които
                    показват не само популярността, но и активността на феновете
                    и тяхната емоционална връзка с музиката. По-високата
                    ангажираност често корелира с по-силното културно влияние.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <MusicTable
            data={data.topRecommendationsListenlist}
            setBookmarkedMusic={setBookmarkedMusic}
            setCurrentBookmarkStatus={setCurrentBookmarkStatus}
            setAlertVisible={setAlertVisible}
            bookmarkedMusic={bookmarkedMusic}
          />
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default Listenlist;
