// Вида на уведомлението.
export type NotificationType = "success" | "error" | "warning";

// Интерфейс за уведомление, което съдържа съобщение и тип на уведомлението.
export interface NotificationState {
  message: string;
  type: NotificationType;
}

// Интерфейс за жанр с английско и българско име.
export interface Genre {
  en: string; // Английско име на жанра
  bg: string; // Българско име на жанра
}

// Интерфейс за рейтинг на филм с източник и стойност.
export interface Rating {
  Source: string; // Източник на рейтинга
  Value: string; // Стойност на рейтинга
}

// Интерфейс за филм с всички основни данни за филма или сериала.
export interface Recommendation {
  id?: string; // ID на филма или сериала
  user_id?: string; // ID на потребителя, свързан с филма или сериала
  imdbID: string; // IMDb идентификатор
  title: string; // Английско заглавие на филма или сериала
  bgName: string; // Българско заглавие на филма или сериала
  genre: string; // Жанрове на английски
  reason: string; // Причина за препоръката на филма или сериала
  youtubeTrailerUrl: string; // URL на YouTube трейлъра
  description: string; // Описание на филма или сериала
  year: string; // Година на издаване
  rated: string; // Възрастова оценка
  released: string; // Дата на излизане
  runtime: string; // Времетраене в минути
  runtimeGoogle: string; // Времетраене, директно от Гугъл
  producer: string; // Име на режисьора
  writer: string; // Име на сценариста
  artists: string; // Списък с актьори
  plot: string; // Сюжет на филма или сериала
  language: string; // Езици на филма или сериала
  country: string; // Страни, участващи в производството
  awards: string; // Награди, спечелени от филма или сериала
  poster: string; // URL на постера
  ratings: { Source: string; Value: string }[]; // Масив с рейтингови източници и стойности
  metascore: string; // Метаскор стойност
  imdbRating: string; // IMDb рейтинг
  imdbRatingGoogle: string; // IMDb рейтинг от Гугъл
  imdbVotes: string; // Брой IMDb гласове
  type: string; // Вид (например, филм)
  DVD: string; // Информация за DVD издание (ако е налично)
  boxOffice: string; // Приходи от бокс офиса
  production: string; // Продуцентско студио (ако е налично)
  website: string; // Официален уебсайт (ако е наличен)
  totalSeasons?: string | null; // Общо сезони (за сериали)
  date?: string; // Дата на въвеждане на данните
}

// Интерфейс за предпочитания на потребителя.
export interface MusicUserPreferences {
  genres: { en: string; bg: string }[]; // Жанрове на английски и български
  moods: string[]; // Настроения
  timeAvailability: string; // Наличност на време
  age: string; // Възраст
  artists: string; // Любими актьори
  producers: string; // Любими режисьори
  interests: string; // Интереси
  countries: string; // Предпочитани държави
  pacing: string; // Бързина на сюжетното действие
  depth: string; // Дълбочина на историята
  targetGroup: string; // Целева група
}

export type RecommendationsAnalysis = {
  relevantCount: number; // Броят на релевантните препоръки
  totalCount: number; // Общо броят на препоръките
  precisionValue: number; // Стойността на прецизността
  precisionPercentage: number; // Процентното изражение на прецизността
  relevantRecommendations: Analysis[]; // Списък с релевантни препоръки
};

// Пропс за компонентата Quiz, свързана с маркирането на филми.
export interface QuizProps {
  setBookmarkedMusic: React.Dispatch<
    // Функция за маркиране на филм
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани книги
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedMusic: { [key: string]: Recommendation }; // Списък с маркирани филми
}

// Пропс за компонентата Recommendations, отговорна за показване на препоръки.
export interface RecommendationsProps {
  recommendationList: Recommendation[]; // Списък с препоръчани филми
  setBookmarkedMusic: React.Dispatch<
    // Функция за маркиране на филм
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани книги
    }>
  >;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedMusic: { [key: string]: Recommendation }; // Списък с маркирани филми
}

// Пропс за компонентата RecommendationCard, която показва информация за филм.
export interface RecommendationCardProps {
  recommendationList: Recommendation[]; // Списък с препоръчани филми
  currentIndex: number; // Текущ индекс на филма
  isExpanded: boolean; // Флаг дали картата е разширена
  openModal: (type: "description" | "plot") => void; // Функция за отваряне на модала
  setBookmarkedMusic: React.Dispatch<
    // Функция за маркиране на филм
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани книги
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedMusic: { [key: string]: Recommendation }; // Списък с маркирани филми
}

// Пропс за компонентата PlotModal, показваща сюжетната линия на филма.
export interface PlotModalProps {
  recommendationList: Recommendation[]; // Списък с препоръчани филми
  currentIndex: number; // Текущ индекс на филма
  closeModal: () => void; // Функция за затваряне на модала
  modalType: "description" | "plot"; // Флаг за проверка дали е подаден сюжет или описание
}

// Пропс за компонентата QuizQuestion, която съдържа въпросите и опции.
export interface QuizQuestionProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за зареждане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за изпращане
  submitted: boolean; // Състоянието за изпращане
  showViewRecommendations: boolean; // Флаг за показване на препоръките
  alreadyHasRecommendations: boolean; // Флаг за проверка дали вече има препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>; // Функция за задаване на списък с препоръки
  setBookmarkedMusic: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >; // Функция за актуализиране на маркираните филми
  setIsBrainAnalysisComplete: React.Dispatch<React.SetStateAction<boolean>>; // Функция за актуализиране състоянието на мозъчния анализ
  isBrainAnalysisComplete: boolean; // Състоянието на мозъчния анализ
  renderBrainAnalysis: boolean; // Флаг за управление на визуализирането на мозъчния анализ
  setRenderBrainAnalysis: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието на мозъчния анализ
}

// Пропс за компонентата ViewRecommendations, която показва резултатите от препоръките.
export interface ViewRecommendationsProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за зареждане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за изпращане
  setShowQuestion: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на показване на въпрос
}

// Интерфейс за пропсите на модала за потвърждение
export interface ConfirmationModalProps {
  // Функция за задаване на уведомления с тип и съобщение
  setNotification: React.Dispatch<
    React.SetStateAction<{
      message: string;
      type: "success" | "error" | "warning";
    } | null>
  >;
  // Функция за задаване на състоянието за зареждане
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // Функция за задаване на състоянието за изпращане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  // Функция за задаване на състоянието за отваряне на модала
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // Функция за обработка на изпращането на заявка
  handleSubmit: (
    setNotification: React.Dispatch<
      React.SetStateAction<{
        message: string;
        type: "success" | "error" | "warning";
      } | null>
    >,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
    setSubmitCount: React.Dispatch<React.SetStateAction<number>>,
    setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>,
    setBookmarkedMusic: React.Dispatch<
      React.SetStateAction<{
        [key: string]: any;
      }>
    >,
    token: string | null,
    submitCount: number,
    renderBrainAnalysis: boolean,
    musicUserPreferences: MusicUserPreferences
  ) => Promise<void>;

  // Функция за задаване на броя на изпратените заявки
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>;

  // Функция за задаване на списък с препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>;

  // Функция за задаване на списък с любими филми
  setBookmarkedMusic: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;

  // Предпочитания на потребителя
  musicUserPreferences: MusicUserPreferences;

  // Токен за автентикация на потребителя
  token: string | null;

  // Броят на изпратените заявки
  submitCount: number;
}

// Интерфейс за критериите на модала за оценяване
export interface CriteriaScores {
  genres: number; // жанровете
  type: number; // типа (филм/сериал)
  mood: number; // настроението
  timeAvailability: number; // наличното време за гледане
  preferredAge: number; // предпочитаната възраст (спрямо година на издаване)
  targetGroup: number; // целевата аудитория
}

export interface Analysis {
  imdbID: string; // Уникален идентификатор на филма/сериала в IMDb
  title_en: string; // Английско заглавие на филма/сериала
  title_bg: string; // Българско заглавие на филма/сериала
  isRelevant: boolean; // Дали препоръката е подходяща според критериите
  relevanceScore: number; // Общ резултат за релевантност
  criteriaScores: CriteriaScores; // Подробен резултат по отделни критерии
}
