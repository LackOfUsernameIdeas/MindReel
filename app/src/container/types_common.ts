// Интерфейс за въпрос с възможности и стойности.
export interface Question {
    question: string; // Текст на въпроса
    options?: string[] | { en: string; bg: string }[]; // Падащо меню или множествен избор
    isMultipleChoice?: boolean; // Флаг за множествен избор
    isInput?: boolean; // Флаг за въпрос, изискващ текстов вход
    value: any; // Стойност на отговора
    setter: React.Dispatch<React.SetStateAction<any>>; // Сетър за стойността на отговора
    placeholder?: string; // Плейсхолдър за въпроси с текстов вход
    description?: string; // Допълнително описание на въпроса
}

// Интерфейс за стъпки за свързване на Mindwave устройство.
export interface Step {
    step: string;
    description: string;
    images: string[];
    fileName?: string;
}

// Вида на уведомлението.
export type NotificationType = "success" | "error" | "warning";

// Интерфейс за уведомление, което съдържа съобщение и тип на уведомлението.
export interface NotificationState {
    message: string;
    type: NotificationType;
}

// Общи данни за режисьори, актьори и писатели
export interface CommonData {
    avg_imdb_rating: number; // Среден рейтинг в IMDb
    avg_metascore: number; // Среден Metascore
    total_box_office: string; // Общо приходи от бокс офис
    avg_rotten_tomatoes: string; // Среден рейтинг в Rotten Tomatoes
    total_wins: string; // Общо спечелени награди
    total_nominations: string; // Общо номинации
    prosperityScore: number; // Индекс на просперитет
    movie_series_count: number; // Брой филми и сериали
    total_recommendations: number; // Общо препоръки
    recommendations_count?: number; // Брой препоръки за конкретен елемент
    saved_count?: number; // Брой пъти запазвано
}

// Данни за режисьори, включително общи данни
export interface DirectorData extends CommonData {
    director_en: string; // Име на режисьора на английски
    director_bg: string; // Име на режисьора на български
}

// Данни за актьори, включително общи данни
export interface ActorData extends CommonData {
    actor_en: string; // Име на актьора на английски
    actor_bg: string; // Име на актьора на български
}

// Данни за писатели, включително общи данни
export interface WriterData extends CommonData {
    writer_en: string; // Име на писателя на английски
    writer_bg: string; // Име на писателя на български
}

// Интерфейс за филм с всички основни данни за филма или сериала.
export interface MovieSeriesRecommendationBeforeSaving {
    id?: string; // ID на филма или сериала
    user_id?: string; // ID на потребителя, свързан с филма или сериала
    imdbID: string; // IMDb идентификатор
    title: string; // Английско заглавие на филма или сериала
    bgName: string; // Българско заглавие на филма или сериала
    genre: string; // Жанрове на английски
    reason: string; // Причина за препоръката на филма или сериала
    description: string; // Описание на филма или сериала
    year: string; // Година на издаване
    rated: string; // Възрастова оценка
    released: string; // Дата на излизане
    runtime: string; // Времетраене в минути
    runtimeGoogle: string; // Времетраене, директно от Гугъл
    director: string; // Име на режисьора
    writer: string; // Име на сценариста
    actors: string; // Списък с актьори
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

// Интерфейс за филм с всички основни данни за филма.
export interface MovieSeriesRecommendation {
    id: number; // Уникален идентификатор за записа в базата данни
    user_id: number; // Идентификатор на потребителя, който е направил препоръката
    imdbID: string; // Уникален идентификатор на филма/сериала от IMDb
    title_en: string; // Заглавие на филма/сериала на английски език
    title_bg: string; // Заглавие на филма/сериала на български език
    genre_en: string; // Жанрове на английски език (като низ)
    genre_bg: string; // Жанрове на български език (като низ)
    reason: string; // Причина за препоръката
    youtubeTrailerUrl: string; // URL на трейлъра в YouTube (ако е наличен)
    recommendations: string; // Препоръки, свързани със съдържанието
    description: string; // Описание на филма/сериала
    year: string; // Година на излизане
    rated: string; // Оценка за възрастово ограничение
    released: string; // Дата на излизане
    runtime: string; // Продължителност на филма/епизода
    director: string; // Режисьор на филма/сериала
    writer: string; // Сценарист на филма/сериала
    actors: string; // Актьори във филма/сериала
    plot: string; // Сюжет на филма/сериала
    language: string; // Език на филма/сериала
    country: string; // Страна на произход
    awards: string; // Награди, спечелени от филма/сериала
    poster: string; // URL на постера на филма/сериала
    ratings: string; // Рейтинги от различни източници (напр. IMDb, Rotten Tomatoes)
    metascore: string; // Metascore рейтинг на филма/сериала
    imdbRating: string; // IMDb рейтинг на филма/сериала
    imdbVotes: string; // Общ брой гласове в IMDb
    type: string; // Тип съдържание (напр. "movie", "series")
    DVD: string; // Дата на излизане на DVD (ако е налично)
    boxOffice: string; // Приходи от боксофиса
    production: string; // Продуцентска компания
    website: string; // Официален уебсайт на филма/сериала
    totalSeasons: string; // Общ брой сезони (ако е сериал)
    oscar_wins: string; // Брой спечелени Оскари
    oscar_nominations: string; // Брой номинации за Оскар
    total_wins: string; // Общо спечелени награди
    total_nominations: string; // Общо номинации за награди
    prosperityScore: number; // Индекс на популярност или успех на съдържанието
}

// Интерфейс за книга с всички основни данни за книгата.
export interface BookRecommendation {
    id: string; // ID на книгата
    user_id: string; // ID на потребителя, свързан с книгата
    google_books_id: string; // Google Books идентификатор
    goodreads_id: string; // Goodreads идентификатор
    title_en: string; // Английско заглавие на книгата
    title_bg: string; // Българско заглавие на книгата
    real_edition_title: string; // Реално заглавие на изданието
    author: string; // Име на автора (може да е обещание)
    publisher: string; // Издателство
    genre_en: string; // Жанрове на английски (може да е обещание)
    genre_bg: string; // Жанрове на български (може да е обещание)
    description: string; // Описание на книгата (може да е обещание)
    language: string; // Езици на книгата (може да е обещание)
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
    page_count: number; // Брой страници
    book_format: string; // Вид на книгата (тип корица, е-книги)
    imageLink: string; // Линк към изображение на книгата
    source: string; // Източник (напр. Google Books)
}

// Интерфейс за песен с всички основни данни за песента.
export interface MusicRecommendation {
    id?: string; // ID на препоръката
    user_id?: string; // ID на потребителя
    title: string; // Заглавие на песента
    artists: string; // Артисти
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

export type RecommendationsAnalysis = {
    relevantCount: number; // Броят на релевантните препоръки
    totalCount: number; // Общо броят на препоръките
    precisionValue: number; // Стойността на прецизността
    precisionPercentage: number; // Процентното изражение на прецизността
    relevantRecommendations: Analysis[]; // Списък с релевантни препоръки
};

export interface Analysis {
    imdbID: string; // Уникален идентификатор на филма/сериала в IMDb
    title_en: string; // Английско заглавие на филма/сериала
    title_bg: string; // Българско заглавие на филма/сериала
    isRelevant: boolean; // Дали препоръката е подходяща според критериите
    relevanceScore: number; // Общ резултат за релевантност
    criteriaScores: CriteriaScores; // Подробен резултат по отделни критерии
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

// Интерфейс за жанр с английско и българско име
export interface Genre {
    en: string; // Английско име на жанра
    bg: string; // Българско име на жанра
}

// Интерфейс за потребителските предпочитания за филми и сериали в базата данни
export interface MovieSeriesUserPreferencesAfterSaving {
    id: number; // Уникален идентификатор на предпочитанията
    user_id: number; // Идентификатор на потребителя, към когото се отнасят предпочитанията
    preferred_genres_en: string; // Предпочитани жанрове на английски език (разделени със запетая)
    preferred_genres_bg: string; // Предпочитани жанрове на български език (разделени със запетая)
    mood: string; // Настроение, което потребителят предпочита за гледане на филми/сериали
    timeAvailability: string; // Наличност на време за гледане (например: кратко, средно, дълго)
    preferred_age: string; // Предпочитана възрастова категория на съдържанието
    preferred_type: string; // Предпочитан тип съдържание (филм, сериал и др.)
    preferred_actors: string; // Предпочитани актьори (разделени със запетая)
    preferred_directors: string; // Предпочитани режисьори (разделени със запетая)
    preferred_countries: string; // Предпочитани държави за продукцията (разделени със запетая)
    preferred_pacing: string; // Предпочитан ритъм на филма/сериала (бърз, умерен и т.н.)
    preferred_depth: string; // Дълбочина на сюжета (повърхностен, среден, задълбочен)
    preferred_target_group: string; // Целева аудитория на съдържанието (възрастни, тийнейджъри и т.н.)
    interests: string; // Интереси на потребителя, свързани с тематиката на филмите/сериалите
    date: Date; // Дата на регистрация на тези предпочитания
}

// Интерфейс за филм с всички основни данни за филма или сериала.
export interface MovieSeriesRecommendationAfterSaving {
    id?: string; // ID на филма или сериала
    user_id?: string; // ID на потребителя, свързан с филма или сериала
    imdbID: string; // IMDb идентификатор
    title: string; // Английско заглавие на филма или сериала
    bgName: string; // Българско заглавие на филма или сериала
    genre: string; // Жанрове на английски
    reason: string; // Причина за препоръката на филма или сериала
    description: string; // Описание на филма или сериала
    year: string; // Година на издаване
    rated: string; // Възрастова оценка
    released: string; // Дата на излизане
    runtime: string; // Времетраене в минути
    runtimeGoogle: string; // Времетраене, директно от Гугъл
    director: string; // Име на режисьора
    writer: string; // Име на сценариста
    actors: string; // Списък с актьори
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

// Интерфейс за основните данни от мозъчната активност, включително внимание, медитация и мигане.
export interface BrainData {
    time: string; // Време на измерването във формат HH:MM:SS
    data_type: "headset_data"; // Тип на данните (в този случай фиксиран като headset_data)
    attention: number; // Стойност за внимание
    meditation: number; // Стойност за медитация
    blink_strength: number | null; // Сила на мигане, която може да бъде null
    raw_data: number[]; // raw информация за EEG
    delta: number; // Стойност за delta вълната
    theta: number; // Стойност за theta вълната
    lowAlpha: number; // Стойност за low-alpha вълната
    highAlpha: number; // Стойност за high-alpha вълната
    lowBeta: number; // Стойност за low-beta вълната
    highBeta: number; // Стойност за high-beta вълната
    lowGamma: number; // Стойност за low-gamma вълната
    highGamma: number; // Стойност за high-gamma вълната
}

export type FilteredBrainData = Omit<
    BrainData,
    "blink_strength" | "raw_data" | "data_type"
>; // BrainData без blink strength, raw data и data type

export interface DefaultVrComponentProps {
    position?: string;
    rotation?: string;
}