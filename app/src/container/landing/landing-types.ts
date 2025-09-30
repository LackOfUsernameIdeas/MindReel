// Данни за потребителите
export type UsersCountData = {
  user_count: number; // Брой потребители
};

// Данни за брой на адаптациите
export type Adaptations = {
  movies: number; // Брой адаптации за филми
  series: number; // Брой адаптации за сериали
  all: number; // Общ брой адаптации
};

// Обобщени данни за платформата (топ препоръки, жанрове и др.)
export type DataType = {
  usersCount: UsersCountData[]; // Брой потребители
  topGenres: any[]; // Топ жанрове
  totalAwards: any[]; // Общо награди
  averageBoxOfficeAndScores: any[]; // Средни стойности за бокс офис и рейтинги
  averagePrecisionPercentage: string; // Средна прецизност в проценти
  averagePrecisionLastRoundPercentage: string; // Средна прецизност за последния кръг в проценти
  averageRecallPercentage: string; // Среден Recall в проценти
  averageF1ScorePercentage: string; // Среден F1 резултат в проценти
  booksAdaptationsCount: Adaptations; // Брой адаптации на книги (филми и сериали)
  averageSpotifyPopularity: number; // Средна популярност в Spotify
  averageYoutubeLikes: number; // Среден брой харесвания в YouTube
  averageYoutubeViews: number; // Среден брой гледания в YouTube
  averageYoutubeComments: number; // Среден брой коментари в YouTube
};

export interface UserData {
  id: number; // Идентификатор на потребителя
  first_name: string; // Първо име
  last_name: string; // Фамилно име
  email: string; // Имейл адрес
}
