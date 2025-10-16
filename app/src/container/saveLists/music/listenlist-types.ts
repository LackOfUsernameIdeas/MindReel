import { MusicRecommendation } from "../../types_common";

// Пропси за модала, показващ сюжета на филма/сериала
export interface PlotAndDescriptionModalProps {
  isOpen: boolean; // Статус на модала (отворен/затворен)
  onClose: () => void; // Функция за затваряне на модала
  modalData: string | undefined; // Сюжет на филма/сериала
  modalType: "description" | "plot"; // Флаг за проверка дали е подаден сюжет или описание
}

// Основни данни за филм
export interface MovieData {
  title_en: string; // Заглавие на филма на английски
  poster: string; // URL на постера
  boxOffice: number | string; // Приходи от бокс офис
  imdbRating: number; // Рейтинг в IMDb
  metascore: number; // Metascore рейтинг
  rottenTomatoes: number; // Рейтинг в Rotten Tomatoes
  type?: "movie" | "series"; // Тип на филма (филм или сериал)
  title_bg: string; // Заглавие на филма на български
  genre_bg: string; // Жанр на български
  runtime: string; // Времетраене
  year: string; // Година на излизане
}

// Данни за препоръки на филми/сериали
export interface RecommendationData extends MovieData {
  id: number; // Идентификатор на препоръката
  imdbID: string; // IMDb идентификатор
  awards: string; // Награди, спечелени от филма
  recommendations: number; // Брой препоръки
  oscar_wins: string; // Спечелени Оскари
  oscar_nominations: string; // Номинации за Оскар
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
}

// Изчисляване на просперитет на филми/сериали
export interface MovieProsperityData {
  imdbID: string; // IMDb идентификатор на филма/сериала
  title_en: string; // Заглавие на английски
  title_bg: string; // Заглавие на български
  type: string; // Тип на филма (филм или сериал)
  imdbRating: string; // Рейтинг в IMDb
  metascore: string; // Metascore рейтинг
  total_box_office: string; // Приходи от бокс офис
  rotten_tomatoes: string; // Рейтинг в Rotten Tomatoes
  total_recommendations: number; // Общо препоръки
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
  prosperityScore: number; // Индекс на просперитет
  genre_en: string; // Жанр на английски
  genre_bg: string; // Жанр на български
}

// Тип за данни за топ жанровете
export type TopGenres = {
  genre_en: string;
  genre_bg: string;
  count: number;
}[];

// Обобщени данни за потребителя (например топ препоръки и жанрове)
export type DataType = {
  topRecommendationsListenlist: MusicRecommendation[]; // Топ препоръки в списък за слушане;
};

// Категории роли (актьори, режисьори, писатели)
export type Category = "Actors" | "Directors" | "Writers"; // Роли: Актьори, Режисьори, Писатели

// Формат на рейтингите
export type Rating = {
  Source: string;
  Value: string;
};

// Интерфейс за пропс на компонента за показване на избран филм/сериал като alert
export interface RecommendationCardAlertProps {
  selectedItem: MusicRecommendation | null;
  onClose: () => void;
  setBookmarkedMovies: React.Dispatch<
    // Функция за обновяване на списъка с маркирани филми/сериали
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани филми/сериали
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedMovies: { [key: string]: MusicRecommendation };
}

// Интерфейс за пропс на таблицата за филми/сериали в listenlist
export interface MoviesAndSeriesTableProps {
  data: MusicRecommendation[];
  type: "recommendations" | "listenlist";
  setBookmarkedMovies: React.Dispatch<
    // Функция за обновяване на списъка с маркирани филми/сериали
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани филми/сериали
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedMovies: { [key: string]: MusicRecommendation };
}

// Интерфейс за пропс на alert-а при натискане бутона за добавяне в listenlist
export interface BookmarkAlertProps {
  isBookmarked: boolean;
  onDismiss: () => void;
}

// Интерфейс за пропс на филтриращото меню
export interface FilterSidebarProps {
  isOpen: boolean; // Дали менюто е отворено
  onClose: () => void; // Функция за затваряне на менюто
  data: MusicRecommendation[]; // Данни за книгите/сериалите
  setFilteredData: React.Dispatch<React.SetStateAction<MusicRecommendation[]>>; // Функция за задаване на филтрираните книги/сериали
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>; // Функция за задаване на текуща страница
  listData: ListData;
  nameMappings: NameMappings;
}

// Интерфейс за мапинг (от английски на български и обратно) на езиците и имената на лицата, играещи роля в създаването на даден филм/сериал
export interface NameMappings {
  actors: Map<string, string>; // Имена на актьори
  directors: Map<string, string>; // Имена на режисьори
  writers: Map<string, string>; // Имена на сценаристи
  languages: Map<string, string>; // Имена на езици
}

// Интерфейс за езиците и имената на лицата, играещи роля в създаването на даден филм/сериал, преведени на български.
export interface ListData {
  actor: string[]; // Филтър по актьори
  director: string[]; // Филтър по режисьори
  writer: string[]; // Филтър по сценаристи
  language: string[]; // Филтър по език
}
