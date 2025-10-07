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

// Интерфейс за песен с всички основни данни за нея.
export interface Recommendation {
  id?: string; // ID на препоръката
  user_id?: string; // ID на потребителя
  title: string; // Заглавие на песента
  artists: string[]; // Артисти
  description: string; // Описание на песента
  reason: string; // Причина за препоръката
  durationMs?: number | null; // Продължителност в милисекунди
  albumTitle?: string | null; // Име на албума
  albumType?: string | null; // Тип на албума (single, album и т.н.)
  albumCover?: string | null; // URL към корицата на албума
  albumTotalTracks?: number | null; // Брой песни в албума
  albumReleaseDateInSpotify?: string | null; // Дата на издаване
  spotifyID?: string | null; // Spotify ID
  spotifyUrl?: string | null; // Spotify линк
  spotifyPopularity?: number | null; // Популярност в Spotify
  youtubeMusicVideoID?: string | null; // YouTube ID
  youtubeMusicVideoUrl?: string | null; // YouTube линк
  youtubeMusicVideoViews?: number | null; // Брой гледания
  youtubeMusicVideoLikes?: number | null; // Брой харесвания
  youtubeMusicVideoComments?: number | null; // Брой коментари
  date?: string; // Дата на запис на препоръката
}

// Интерфейс за предпочитания на потребителя.
export interface MusicUserPreferences {
  genres: { en: string; bg: string }[]; // Жанрове на английски и български
  moods: string[]; // Настроения
  age: string; // Възраст
  artists: string; // Любими изпълнители
  producers: string; // Любими продуценти
  interests: string; // Интереси
  countries: string; // Предпочитани държави
  pacing: string; // Бързина на сюжетното действие
  depth: string; // Дълбочина на историята
  targetGroup: string; // Целева група
}

// Пропс за компонентата Recommendations, отговорна за показване на препоръки.
export interface RecommendationsProps {
  recommendationList: Recommendation[]; // Списък с препоръчани песни
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

// Пропс за компонентата RecommendationCard, която показва информация за песен.
export interface RecommendationCardProps {
  recommendationList: Recommendation[]; // Списък с препоръчани песни
  currentIndex: number; // Текущ индекс на песента
  isExpanded: boolean; // Флаг дали картата е разширена
}

// Пропс за компонентата QuizQuestion, която съдържа въпросите и опции.
export interface QuizQuestionProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за зареждане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за изпращане
  submitted: boolean; // Състоянието за изпращане
  showViewRecommendations: boolean; // Флаг за показване на препоръките
  alreadyHasRecommendations: boolean; // Флаг за проверка дали вече има препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>; // Функция за задаване на списък с препоръки
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
    token: string | null,
    submitCount: number,
    musicUserPreferences: MusicUserPreferences
  ) => Promise<void>;

  // Функция за задаване на броя на изпратените заявки
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>;

  // Функция за задаване на списък с препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>;

  // Предпочитания на потребителя
  musicUserPreferences: MusicUserPreferences;

  // Токен за автентикация на потребителя
  token: string | null;

  // Броят на изпратените заявки
  submitCount: number;
}
