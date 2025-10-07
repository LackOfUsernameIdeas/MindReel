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

// Интерфейс за рейтинг на книга с източник и стойност.
export interface Rating {
  Source: string; // Източник на рейтинга
  Value: string; // Стойност на рейтинга
}

// Интерфейс за книга с всички основни данни за книгата.
export interface Recommendation {
  id: string; // ID на книгата
  user_id: string; // ID на потребителя, свързан с книгата
  google_books_id: string; // Google Books идентификатор
  goodreads_id: string; // Goodreads идентификатор
  title_en: string; // Английско заглавие на книгата
  title_bg: string; // Българско заглавие на книгата
  real_edition_title: string; // Реално заглавие на изданието
  author: string | Promise<string>; // Име на автора (може да е обещание)
  publisher: string; // Издателство
  genre_en: string | Promise<string>; // Жанрове на английски (може да е обещание)
  genre_bg: string | Promise<string>; // Жанрове на български (може да е обещание)
  description: string | Promise<string>; // Описание на книгата (може да е обещание)
  language: string | Promise<string>; // Езици на книгата (може да е обещание)
  origin: string; // Страна на произход
  literary_awards: string; // Награди на книгата
  setting: string; // Мястото, в което се развива сюжета
  characters: string; // Героите в сюжета
  series: string; // Поредица
  date_of_first_issue: string; // Дата на първо издание
  date_of_issue: string; // Дата на издаване
  goodreads_rating: number; // Goodreads рейтинг
  goodreads_ratings_count: number; // Брой гласове в Goodreads
  goodreads_reviews_count: number; // Брой ревюта в Goodreads
  reason: string; // Причина за препоръката
  adaptations: string; // Адаптации на книгата
  ISBN_10: string; // ISBN-10
  ISBN_13: string; // ISBN-13
  page_count: string; // Брой страници
  book_format: string; // Вид на книгата (тип корица, е-книги)
  imageLink: string; // Линк към изображение на книгата
  source: string; // Източник (напр. Google Books)
}

// Enum за видовете книги
export enum BookFormat {
  "Paperback" = "Мека корица",
  "Hardcover" = "Твърда корица",
  "ebook" = "Е-книга",
  "Kindle Edition" = "Kindle е-книга"
}
// Интерфейс за предпочитания на потребителя.
export interface BooksUserPreferences {
  genres: { en: string; bg: string }[]; // Жанрове на английски и български
  moods: string[]; // Настроения
  authors: string; // Любими актьори
  origin: string; // Предпочитани държави
  pacing: string; // Пейсинг
  depth: string; // Дълбочина на историята
  targetGroup: string; // Целева група
  interests: string; // Интереси
}

// Пропс за компонентата Quiz, свързана с маркирането на книги.
export interface QuizProps {
  setBookmarkedBooks: React.Dispatch<
    // Функция за обновяване на списъка с маркирани книги
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани книги
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedBooks: { [key: string]: Recommendation }; // Списък с маркирани книги
}

// Пропс за компонентата Recommendations, отговорна за показване на препоръки.
export interface RecommendationsProps {
  recommendationList: Recommendation[]; // Списък с препоръчани книги
  setBookmarkedBooks: React.Dispatch<
    // Функция за обновяване на списъка с маркирани книги
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани книги
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedBooks: { [key: string]: Recommendation }; // Списък с маркирани книги
}

// Пропс за компонентата RecommendationCard, която показва информация за книга.
export interface RecommendationCardProps {
  recommendationList: Recommendation[]; // Списък с препоръчани книги
  currentIndex: number; // Текущ индекс на книга
  isExpanded: boolean; // Флаг дали картата е разширена
  openModal: () => void; // Функция за отваряне на модала
  setBookmarkedBooks: React.Dispatch<
    // Функция за обновяване на списъка с маркирани книги
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани книги
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedBooks: { [key: string]: Recommendation }; // Списък с маркирани книги
}

// Пропс за компонентата PlotModal, показваща сюжетната линия на книга.
export interface PlotModalProps {
  recommendationList: Recommendation[]; // Списък с препоръчани книги
  currentIndex: number; // Текущ индекс на книга
  closeModal: () => void; // Функция за затваряне на модала
}

// Пропс за компонентата QuizQuestion, която съдържа въпросите и опции.
export interface QuizQuestionProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за зареждане
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на състоянието за изпращане
  submitted: boolean; // Състоянието за изпращане
  showViewRecommendations: boolean; // Флаг за показване на препоръките
  alreadyHasRecommendations: boolean; // Флаг за проверка дали вече има препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>; // Функция за задаване на списък с препоръки
  setBookmarkedBooks: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >; // Функция за актуализиране на маркираните книги
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
    setBookmarkedBooks: React.Dispatch<
      React.SetStateAction<{
        [key: string]: any;
      }>
    >,
    token: string | null,
    submitCount: number,
    booksUserPreferences: BooksUserPreferences
  ) => Promise<void>;

  // Функция за задаване на броя на изпратените заявки
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>;

  // Функция за задаване на списък с препоръки
  setRecommendationList: React.Dispatch<React.SetStateAction<any[]>>;

  // Функция за задаване на списък с любими книги
  setBookmarkedBooks: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;

  // Предпочитания на потребителя
  booksUserPreferences: BooksUserPreferences;

  // Токен за автентикация на потребителя
  token: string | null;

  // Броят на изпратените заявки
  submitCount: number;
}

// Интерфейс за идентификаторите на ISBN
export interface IndustryIdentifier {
  // Тип на идентификатора, може да бъде ISBN_10 или ISBN_13
  type: "ISBN_10" | "ISBN_13";
  // Стойност на идентификатора (самият ISBN номер)
  identifier: string;
}
