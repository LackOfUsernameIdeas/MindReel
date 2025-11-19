import { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Navbar2 from "./sidemenu";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import OtherStatsWidgetCardsComponents from "./components/OtherStatsWidgetCardsComponents";
import { DataType } from "./landing-types";
import { fetchData } from "./helper_functions";
import AIStatsWidgetCardsComponent from "./components/AIStatsWidgetCardsComponents";
import { getAverageMetrics } from "../helper_functions_common";
import logo from "../../assets/images/brand-logos/logo_large.svg";
import logoDark from "../../assets/images/brand-logos/logo_large_dark.svg";
import BookAdaptations from "./components/BookAdaptations";
import MusicStats from "./components/MusicStats";

const Landing: FC<{}> = () => {
  // Състояние за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    usersCount: [], // Броя на потребителите
    topGenres: [], // Топ жанрове
    totalAwards: [], // Общо награди
    averageBoxOfficeAndScores: [], // Среден боксофис и оценки
    averagePrecisionPercentage: "", // Средна прецизност в проценти
    averagePrecisionLastRoundPercentage: "", // Средна прецизност за последния кръг в проценти
    averageRecallPercentage: "", // Среден Recall в проценти
    averageF1ScorePercentage: "", // Среден F1 резултат в проценти
    booksAdaptationsCount: { movies: 0, series: 0, all: 0 }, // Брой адаптации на книги (филми и сериали)
    averageSpotifyPopularity: 0, // Средна популярност в Spotify
    averageYoutubeLikes: 0, // Среден брой харесвания в YouTube
    averageYoutubeViews: 0, // Среден брой гледания в YouTube
    averageYoutubeComments: 0 // Среден брой коментари в YouTube
  });

  // useEffect за извличане на данни, когато компонентът се зареди за първи път
  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      fetchData(setData); // Извличаме данни с помощта на функцията fetchData

      try {
        const averageMetrics = await getAverageMetrics(); // Изчакваме да получим данните
        setData((prevData) => ({
          ...prevData,
          averagePrecision: averageMetrics.average_precision, // Обновяваме с новите данни
          averagePrecisionPercentage:
            averageMetrics.average_precision_percentage,
          averagePrecisionLastRound:
            averageMetrics.average_precision_last_round,
          averagePrecisionLastRoundPercentage:
            averageMetrics.average_precision_last_round_percentage,
          averageRecall: averageMetrics.average_recall,
          averageRecallPercentage: averageMetrics.average_recall_percentage,
          averageF1Score: averageMetrics.average_f1_score,
          averageF1ScorePercentage: averageMetrics.average_f1_score_percentage
        }));
      } catch (error) {
        console.error("Error fetching average metrics:", error);
      }
    };

    fetchDataAndUpdate();
  }, []); // Празен масив - изпълнява се само веднъж при зареждане на компонента

  useEffect(() => {
    const rootDiv = document.getElementById("root");
    if (rootDiv) {
    }
    return () => {
      if (rootDiv) {
        rootDiv.className = "";
      }
    };
  }, []);

  // Функция за управление на залепващия елемент при скролиране
  const Topup = () => {
    // Ако скролът е по-голям от 30px и има елемент с клас "landing-body"
    if (window.scrollY > 30 && document.querySelector(".landing-body")) {
      const Scolls = document.querySelectorAll(".sticky");
      Scolls.forEach((e) => {
        // Добавя класа "sticky-pin" към всички елементи с клас "sticky"
        e.classList.add("sticky-pin");
      });
    } else {
      const Scolls = document.querySelectorAll(".sticky");
      Scolls.forEach((e) => {
        // Премахва класа "sticky-pin" от всички елементи с клас "sticky"
        e.classList.remove("sticky-pin");
      });
    }
  };

  // Добавя слушател за събитие за скролиране на прозореца
  window.addEventListener("scroll", Topup);
  console.log(data);

  return (
    <Fragment>
      <HelmetProvider>
        <Helmet>
          <body className="landing-body"></body>
        </Helmet>
      </HelmetProvider>
      <header className="app-header">
        <div className="main-header-container container-fluid">
          <div className="header-content-left">
            <div className="header-element">
              <div className="horizontal-logo">
                <a
                  href={`${import.meta.env.BASE_URL}app/home`}
                  className="header-logo"
                ></a>
              </div>
            </div>
          </div>

          <div className="header-content-right">
            <div className="header-element !items-center">
              <div className="min-[1400px]:hidden block goodTiming">
                <Link
                  to={`${import.meta.env.BASE_URL}signin`}
                  className="ti-btn ti-btn-primary-full !m-1"
                >
                  Вход
                </Link>
                <Link
                  to={`${import.meta.env.BASE_URL}signup`}
                  className="ti-btn ti-btn-secondary-full !m-1"
                >
                  Регистрация
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <aside className="app-sidebar sticky sticky-pin" id="sidebar">
        <div className="container-xl xl:!p-0">
          <div className="main-sidebar mx-0">
            <nav className="main-menu-container nav nav-pills flex-column sub-open">
              <div className="landing-logo-container my-auto hidden lg:block">
                <div className="responsive-logo"></div>
              </div>
              <div className="slide-left hidden" id="slide-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>{" "}
                </svg>
              </div>
              <Navbar2 />
              <div className="slide-right hidden" id="slide-right">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>{" "}
                </svg>
              </div>
              <div className="hidden min-[1400px]:flex space-x-2 rtl:space-x-reverse whitespace-nowrap antialiased">
                <Link
                  to={`${import.meta.env.BASE_URL}signin/`}
                  className="ti-btn ti-btn-primary-full m-0 px-6 py-2"
                >
                  Влезте в профила си
                </Link>
                <Link
                  to={`${import.meta.env.BASE_URL}signup/`}
                  className="ti-btn ti-btn-secondary-full m-0 px-6 py-2"
                >
                  Създаване на профил
                </Link>
              </div>
              <div className="header-element !items-center">
                <div className="min-[1400px]:hidden block goodTiming">
                  <Link
                    to={`${import.meta.env.BASE_URL}signin`}
                    className="ti-btn ti-btn-primary-full !m-1"
                  >
                    Вход
                  </Link>
                  <Link
                    to={`${import.meta.env.BASE_URL}signup`}
                    className="ti-btn ti-btn-secondary-full !m-1"
                  >
                    Регистрация
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </aside>
      <div className="main-content !p-0 landing-main dark:text-defaulttextcolor/70">
        <section className="section bg-light !pb-0 text-[0.813rem]" id="home">
          <div className="container flex justify-center items-center h-full">
            <div className="w-full max-w-4xl px-4 sm:px-8 md:px-12 lg:pr-16 lg:pl-0">
              {/* Лого за светъл режим */}
              <img
                src={logo}
                alt="Logo"
                className="dark:hidden w-full h-auto mb-[3rem] mt-[-0.5rem] mx-auto"
              />

              {/* Лого за тъмен режим */}
              <img
                src={logoDark}
                alt="Logo"
                className="hidden dark:block w-full h-auto mb-[3rem] mt-[-0.5rem] mx-auto"
              />
            </div>
          </div>
        </section>
        <section
          className="section bg-black/5 dark:!bg-black/10 text-defaulttextcolor"
          id="description"
        >
          <div className="container text-center">
            <div className="justify-center text-center mb-12">
              <div className="xl:col-span-6 col-span-12">
                <h3 className="font-semibold goodTiming !text-4xl mb-2">
                  Как работи Лента на ума (MindReel)?
                </h3>
                <span className="text-[#8c9097] dark:text-white/50 text-[0.9375rem] font-normal block">
                  Открийте най-добрите препоръки, с помощта на Изкуствен
                  Интелект, и станете свидетел на анализ на поведението му.
                  Вашето състояние ще бъде анализирано чрез биоелектрическата
                  активност на вашия мозък, свързана с различни емоционални и
                  физически състояния, за да получите максимално персонализирани
                  препоръки. Потопете се във VR изкуството, което Ви дава
                  възможност да изпитате истинско кино изживяване, гледайки
                  трейлърите на любимите Ви заглавия. Всичко това в три лесни
                  стъпки – регистрирайте се, следвайте внимателно инструкциите и
                  вижте вашите резултати!
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6 text-start">
              <div className="md:col-span-3 col-span-12">
                <div className="box bg-light border dark:border-defaultborder/10 flex flex-col h-full">
                  <div className="box-body rounded flex flex-col flex-grow">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-brain-circuit"
                          >
                            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                            <path d="M9 13a4.5 4.5 0 0 0 3-4" />
                            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                            <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                            <path d="M6 18a4 4 0 0 1-1.967-.516" />
                            <path d="M12 13h4" />
                            <path d="M12 18h6a2 2 0 0 1 2 2v1" />
                            <path d="M12 8h8" />
                            <path d="M16 8V5a2 2 0 0 1 2-2" />
                            <circle cx="16" cy="13" r=".5" />
                            <circle cx="18" cy="3" r=".5" />
                            <circle cx="20" cy="21" r=".5" />
                            <circle cx="20" cy="8" r=".5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold goodTiming text-[1.5rem] mb-4">
                      ЕЕГ анализ на мозъка
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Мозъкът притежава биоелектрическа активност, която се
                      изследва с ЕлектроЕнцефалоГрафия (ЕЕГ). Това е метод,
                      който разделя мозъчните вълни в категории и ги свързва с
                      различни емоционални и физически състояния. Разгледайте
                      състоянието си и препоръките на Изкуствения Интелект!
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1] mt-auto"
                      to={`${import.meta.env.BASE_URL}signin`}
                    >
                      Анализирайте вашия мозък
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 col-span-12">
                <div className="box bg-light border dark:border-defaultborder/10 flex flex-col h-full">
                  <div className="box-body rounded flex flex-col flex-grow">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-projector-icon lucide-projector"
                          >
                            <path d="M5 7 3 5" />
                            <path d="M9 6V3" />
                            <path d="m13 7 2-2" />
                            <circle cx="9" cy="13" r="3" />
                            <path d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17" />
                            <path d="M16 16h2" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold goodTiming text-[1.5rem] mb-4">
                      VR кино изживяване
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Влезте във VR сцена, която пресъздава истинска кино зала и
                      Ви позволява да гледате трейлъри като част от
                      изживяването.
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1] mt-auto"
                      to={`${import.meta.env.BASE_URL}signin`}
                    >
                      Започнете VR изживяване
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 col-span-12">
                <div className="box bg-light border dark:border-defaultborder/10 flex flex-col h-full">
                  <div className="box-body rounded flex flex-col flex-grow">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chart-column-increasing"
                          >
                            <path d="M13 17V9" />
                            <path d="M18 17V5" />
                            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                            <path d="M8 17v-3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold goodTiming text-[1.5rem] mb-4">
                      Анализ на препоръките
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Спрямо вашите индивидуални предпочитания и личностни
                      качества, приложението ще анализира поведението на
                      Изкуствения Интелект, с помощта на универсални и
                      потвърдени показатели за оценка на машинното обучение!
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1] mt-auto"
                      to={`${import.meta.env.BASE_URL}signin`}
                    >
                      Тествайте AI
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 col-span-12">
                <div className="box bg-light border dark:border-defaultborder/10 flex flex-col h-full">
                  <div className="box-body rounded flex flex-col flex-grow">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-film"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M7 3v18" />
                            <path d="M3 7.5h4" />
                            <path d="M3 12h18" />
                            <path d="M3 16.5h4" />
                            <path d="M17 3v18" />
                            <path d="M17 7.5h4" />
                            <path d="M17 16.5h4" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold goodTiming text-[1.5rem] mb-4">
                      Нови препоръки
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Съвместно с анализа, приложението също така ще ви насочи
                      към най-подходящите филми и сериали за гледане и книги за
                      четене. Направете първата крачка още сега!
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1] mt-auto"
                      to={`${import.meta.env.BASE_URL}signin`}
                    >
                      Рзгледайте нови препоръки
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section bg-light" id="aianalysis">
          <div className="container">
            <AIStatsWidgetCardsComponent data={data} />
            <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center mt-8">
              <h2 className="text-xl text-defaulttextcolor dark:text-white/80">
                За да придобиете по-ясна представа за значенията на тези
                показатели за оценка на машинното обучение, моля, разгледайте
                секцията с разяснения на термините по-надолу в страницата!
              </h2>
            </Card>
          </div>
        </section>
        <section
          className="section bg-white dark:bg-black/20 text-defaultsize text-defaulttextcolor"
          id="bookAdaptations"
        >
          <div className="container">
            <div className="justify-center text-center mb-12">
              <div className="xl:col-span-6 col-span-12">
                <h3 className="font-semibold  goodTiming !text-4xl mb-2">
                  Адаптации на книги
                </h3>
                <span className="text-[#8c9097] dark:text-white/50 text-[0.9375rem] font-normal block">
                  Вижте колко книги са адаптирани във филми и сериали
                </span>
              </div>
            </div>
            <BookAdaptations
              booksAdaptationsCount={data.booksAdaptationsCount}
            />
          </div>
        </section>
        <section
          className="section text-defaultsize text-defaulttextcolor"
          id="musicStats"
        >
          <div className="container">
            <div className="justify-center text-center mb-12">
              <div className="xl:col-span-6 col-span-12">
                <h3 className="font-semibold goodTiming !text-4xl mb-2">
                  Музикални статистики
                </h3>
                <span className="text-[#8c9097] dark:text-white/50 text-[0.9375rem] font-normal block">
                  Средна стойност на различни показатели на препоръчаните песни
                  в платформата
                </span>
              </div>
            </div>
            <MusicStats
              musicStatsData={{
                spotifyPopularity: data.averageSpotifyPopularity,
                youtubeViews: data.averageYoutubeViews,
                youtubeLikes: data.averageYoutubeLikes,
                youtubeComments: data.averageYoutubeComments
              }}
            />
          </div>
        </section>
        <section
          className="section scroll-mt-16 bg-primary text-defaultsize text-defaulttextcolor"
          id="accordion"
        >
          <div className="container text-center">
            <div className="text-sm">
              <Accordion type="single" collapsible className="space-y-4">
                {/* Relevance */}
                <AccordionItem value="relevance">
                  <AccordionTrigger className="goodTiming">
                    🎯 Релевантност
                  </AccordionTrigger>
                  <AccordionContent>
                    Свойство, което дадена препоръка може да притежава. Дали
                    даден филм или сериал е{" "}
                    <span className="font-semibold">релевантен </span> се
                    определя спрямо това дали неговите характеристики като{" "}
                    <span className="font-semibold">
                      жанр, емоционално състояние, разполагаемо време за гледане
                    </span>{" "}
                    и други се съобразяват с{" "}
                    <span className="font-semibold">ВАШИТЕ </span>последно
                    регистрирани индивидуални потребителски предпочитания.
                    Всичко това се случва с помощта на{" "}
                    <span className="font-semibold">
                      Алгоритъма за релевантност
                    </span>
                    , описан в следващата секция.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="concept">
                  <AccordionTrigger className="goodTiming">
                    🔍 Как работи алгоритъмът?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-10">
                      <span className="font-semibold">
                        Алгоритъмът за релевантност
                      </span>{" "}
                      е сърцето на препоръчителната система, който анализира{" "}
                      <span className="font-semibold">
                        последно регистрираните{" "}
                      </span>
                      предпочитания на потребителя и определя доколко даден филм
                      или сериал съвпада с неговите изисквания. Той използва
                      подход, включващ няколко критерия за оценка и изчислява
                      общ резултат.
                    </p>
                    <h2 className="text-2xl">Критериите са: </h2>
                    <ul className="space-y-4 mt-3">
                      <li>
                        <strong>✅ Предпочитани жанрове</strong> – Проверява се
                        дали жанровете на предложеното съдържание съвпадат с
                        тези, които потребителят харесва. Ако има съвпадение, то
                        се оценява с висока тежест.
                      </li>
                      <li>
                        <strong>✅ Тип съдържание (филм или сериал)</strong> –
                        Системата преобразува избора на потребителя в
                        стандартизиран формат (напр. "Филм" → "movie") и го
                        сравнява с типа на препоръчаното заглавие.
                      </li>
                      <li>
                        <strong>✅ Настроение на потребителя</strong> – В
                        зависимост от настроението, в което се намира
                        потребителят, се извършва съпоставяне с жанрове, които
                        типично се свързват с това усещане.
                      </li>
                      <li>
                        <strong>✅ Наличност на време</strong> – Алгоритъмът
                        оценява дали продължителността на филма или средната
                        продължителност на епизодите на сериала се вписват в
                        свободното време на потребителя, като използва разумен
                        толеранс за разлики от няколко минути.
                      </li>
                      <li>
                        <strong>✅ Година на издаване</strong> – Ако
                        потребителят има предпочитания за определен времеви
                        период (напр. „публикуван в последните 10 години“),
                        препоръките се филтрират според този критерий.
                      </li>
                      <li>
                        <strong>✅ Целева аудитория</strong> – Системата
                        сравнява таргетираната възрастова група на съдържанието
                        със заявените предпочитания на потребителя.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="calculation">
                  <AccordionTrigger className="goodTiming">
                    🎯 Как се изчислява крайният резултат?
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4">
                      <li>
                        Всеки критерий има индивидуален принос към крайния
                        резултат, като по-важните фактори (като жанр) получават
                        по-голяма брой точки при съвпадение. Системата изчислява
                        сборна оценка, която показва до каква степен филмът или
                        сериалът е релевантен за потребителя.
                      </li>
                      <li>
                        <strong>
                          {" "}
                          📌 Ако резултатът премине прагът от 5 точки,
                          препоръката се счита за подходяща и се предлага на
                          потребителя.
                        </strong>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Platform Precision */}
                <AccordionItem value="precision-platform">
                  <AccordionTrigger className="goodTiming">
                    ✅ Общ Precision
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Измерва каква част от препоръките, които сте направили, са{" "}
                      <span className="font-semibold">наистина </span>{" "}
                      релевантни. Високата стойност на{" "}
                      <span className="font-semibold">Precision</span> означава,
                      че когато системата препоръчва нещо, то вероятно ще бъде
                      подходящо за Вас.
                    </p>
                    <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                      <div className="flex items-center space-x-2 justify-center items-center">
                        <span className="font-semibold">Precision =</span>
                        <div className="text-center">
                          <p className="text-primary text-sm">
                            всички ваши РЕЛЕВАНТНИ препоръки правени някога (TP)
                          </p>
                          <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                          <p className="text-secondary text-sm">
                            всички ваши препоръки, които някога са правени (TP +
                            FP)
                          </p>
                        </div>
                      </div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                {/* User Specific Precision */}
                <AccordionItem value="precision-user">
                  <AccordionTrigger className="goodTiming">
                    ✅ Precision за последното генериране
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Измерва каква част от последните Ви препоръки, са{" "}
                      <span className="font-semibold">наистина </span>{" "}
                      релевантни. Високата стойност на{" "}
                      <span className="font-semibold">Precision</span> означава,
                      че когато системата препоръчва нещо, то вероятно ще бъде
                      подходящо за Вас.
                    </p>
                    <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                      <div className="flex items-center space-x-2 justify-center items-center">
                        <span className="font-semibold">Precision =</span>
                        <div className="text-center">
                          <p className="text-primary text-sm">
                            всички ваши РЕЛЕВАНТНИ препоръки от последното
                            генериране (TP)
                          </p>
                          <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                          <p className="text-secondary text-sm">
                            всички ваши препоръки от последното генериране (TP +
                            FP)
                          </p>
                        </div>
                      </div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                {/* Recall */}
                <AccordionItem value="recall">
                  <AccordionTrigger className="goodTiming">
                    🔍 Recall
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Измерва каква част от всички препоръки, които са
                      определени като релевантни, са били препоръчани на{" "}
                      <span className="font-semibold">ВАС</span>. Високата
                      стойност на Recall означава, че системата{" "}
                      <span className="font-semibold">НЕ </span> пропуска{" "}
                      <span className="font-semibold">важни (релевантни) </span>{" "}
                      препоръки, дори ако включва някои нерелевантни.
                    </p>
                    <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                      <div className="flex items-center space-x-2 justify-center items-center">
                        <span className="font-semibold">Recall =</span>
                        <div className="text-center">
                          <p className="text-primary text-sm">
                            всички ваши РЕЛЕВАНТНИ препоръки правени някога (TP)
                          </p>
                          <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                          <p className="text-secondary text-sm">
                            всички препоръки, които са РЕЛЕВАНТНИ на ВАШИТЕ
                            предпочитания, измежду тези в цялата система (TP +
                            FN)
                          </p>
                        </div>
                      </div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                {/* F1 Score */}
                <AccordionItem value="f1-score">
                  <AccordionTrigger className="goodTiming">
                    ⚖️ F1 Score
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      <span className="font-semibold">
                        Балансиран показател
                      </span>
                      , който комбинира стойностите на{" "}
                      <span className="font-semibold">Precision</span> и{" "}
                      <span className="font-semibold">Recall</span>, показвайки
                      колко добре системата намира точния баланс между тях.
                      Високият <span className="font-semibold">F1 Score</span>{" "}
                      означава, че системата има добро представяне както по
                      отношение на{" "}
                      <span className="font-semibold">
                        точността на препоръките
                      </span>
                      , така и на
                      <span className="font-semibold">
                        покритието спрямо всички възможности
                      </span>
                      .
                    </p>
                    <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                      <div className="flex items-center space-x-2 justify-center items-center">
                        <span className="font-semibold">F1 Score =</span>
                        <div className="text-center">
                          <p className="text-primary text-sm">
                            2 x Precision x Recall
                          </p>
                          <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                          <p className="text-secondary text-sm">
                            Precision + Recall
                          </p>
                        </div>
                      </div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        <section
          className="section text-defaultsize text-defaulttextcolor mb-[15rem]"
          id="additionalStats"
        >
          <div className="container">
            <div className="gap-6 mb-[3rem] justify-center text-center">
              <h3 className="font-semibold goodTiming !text-4xl mb-2">
                Други главни статистики:
              </h3>
            </div>
            <div className="grid grid-cols-12 gap-x-6 justify-center">
              <OtherStatsWidgetCardsComponents data={data} />
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default Landing;
