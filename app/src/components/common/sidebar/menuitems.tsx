export const MENUITEMS = [
  {
    menutitle: "ОСНОВНИ СТРАНИЦИ"
  },
  {
    path: `${import.meta.env.BASE_URL}app/recommendations`,
    icon: <i className="side-menu__icon bx bx-movie-play"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "Нови Препоръки",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2",
    children: [
      {
        path: `${import.meta.env.BASE_URL}app/recommendations/movies_series`,
        icon: <i className="side-sub-menu__icon ti ti-movie"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "ЗА ГЛЕДАНЕ"
      },
      {
        path: `${import.meta.env.BASE_URL}app/recommendations/books`,
        icon: <i className="side-sub-menu__icon ti ti-book"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "ЗА ЧЕТЕНЕ"
      }
    ]
  },
  {
    path: `${import.meta.env.BASE_URL}app/aiAnalysator`,
    icon: <i className="side-menu__icon ti ti-report-analytics"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "AI Анализатор",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  },
  {
    icon: <i className="side-menu__icon ti ti-list-details"></i>,
    type: "sub",
    Name: "",
    active: false,
    selected: false,
    title: "СПИСЪЦИ",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2",
    children: [
      {
        path: `${import.meta.env.BASE_URL}app/saveLists/movies_series`,
        icon: <i className="side-sub-menu__icon ti ti-movie"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "ЗА ГЛЕДАНЕ"
      },
      {
        path: `${import.meta.env.BASE_URL}app/saveLists/books`,
        icon: <i className="side-sub-menu__icon ti ti-book"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "ЗА ЧЕТЕНЕ"
      }
    ]
  },
  {
    menutitle: "СТАТИСТИКИ"
  },
  {
    icon: <i className="side-menu__icon bx bx-line-chart"></i>,
    type: "sub",
    Name: "",
    active: false,
    selected: false,
    title: "Общи Статистики",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2",
    children: [
      {
        path: `${
          import.meta.env.BASE_URL
        }app/platformStats/moviesByProsperityBubbleChart`,
        icon: <i className="side-sub-menu__icon bx bx-movie"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Най-успешни филми"
      },
      {
        path: `${
          import.meta.env.BASE_URL
        }app/platformStats/actorsDirectorsWritersTable`,
        icon: <i className="side-sub-menu__icon bx bx-user"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Творци"
      },
      {
        path: `${
          import.meta.env.BASE_URL
        }app/platformStats/genrePopularityOverTime`,
        icon: <i className="side-sub-menu__icon bx bx-category"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Жанрове"
      },
      {
        path: `${import.meta.env.BASE_URL}app/platformStats/topRecommendations`,
        icon: <i className="side-sub-menu__icon bx bx-star"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Топ препоръки"
      },
      {
        path: `${
          import.meta.env.BASE_URL
        }app/platformStats/moviesAndSeriesByRatings`,
        icon: <i className="side-sub-menu__icon bx bxs-star-half"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Заглавия по оценки"
      },
      {
        path: `${import.meta.env.BASE_URL}app/platformStats/topCountries`,
        icon: <i className="side-sub-menu__icon bx bx-world"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Топ държави"
      }
    ]
  },
  {
    path: `${import.meta.env.BASE_URL}app/individualStats/movies_series`,
    icon: <i className="side-menu__icon bx bx-bar-chart-alt-2"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "Индивидуални Статистики",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  },
  {
    menutitle: "КОНТАКТ"
  },
  {
    path: `${import.meta.env.BASE_URL}app/contact`,
    icon: <i className="side-menu__icon bx bx-envelope"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "За Контакт",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  }
];
