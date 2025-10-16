import { MusicRecommendation } from "../../types_common";

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

// Обобщени данни за потребителя (например топ препоръки и жанрове)
export type DataType = {
  topRecommendationsListenlist: MusicRecommendation[]; // Топ препоръки в списък за слушане;
};

// Интерфейс за пропс на компонента за показване на избрана песен като alert
export interface RecommendationCardAlertProps {
  selectedItem: MusicRecommendation | null;
  onClose: () => void;
  setBookmarkedMusic: React.Dispatch<
    // Функция за обновяване на списъка с маркирани песни
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани песни
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedMusic: { [key: string]: MusicRecommendation };
}

// Интерфейс за пропс на таблицата за песни в listenlist
export interface MusicTableProps {
  data: MusicRecommendation[];
  setBookmarkedMusic: React.Dispatch<
    // Функция за обновяване на списъка с маркирани песни
    React.SetStateAction<{
      [key: string]: any; // Динамичен обект с маркирани песни
    }>
  >;
  setCurrentBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>; // Функция за задаване на текущия статус на маркиране
  setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>; // Функция за показване на известие
  bookmarkedMusic: { [key: string]: MusicRecommendation };
}

// Интерфейс за пропс на alert-а при натискане бутона за добавяне в listenlist
export interface BookmarkAlertProps {
  isBookmarked: boolean;
  onDismiss: () => void;
}

// Интерфейс за пропс на филтриращото меню
export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: MusicRecommendation[];
  setFilteredData: (data: MusicRecommendation[]) => void;
  setCurrentPage: (page: number) => void;
}
