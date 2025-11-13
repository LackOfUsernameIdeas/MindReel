import img0 from "@/assets/images/steps/0.jpg";
import img1_1 from "@/assets/images/steps/1.1.png";
import img1_2 from "@/assets/images/steps/1.2.png";
import img1_3 from "@/assets/images/steps/1.3.png";
import img1_4 from "@/assets/images/steps/1.4.png";
import img2 from "@/assets/images/steps/2.jpg";
import img3_1 from "@/assets/images/steps/3.1.png";
import img3_2 from "@/assets/images/steps/3.2.png";
import img3_3 from "@/assets/images/steps/3.3.png";
import img3_4 from "@/assets/images/steps/3.4.png";
import img4_1 from "@/assets/images/steps/4.1.png";
import img4_2 from "@/assets/images/steps/4.2.png";
import img5 from "@/assets/images/steps/5.png";
import img6_1 from "@/assets/images/steps/6.1.png";
import img6_2 from "@/assets/images/steps/6.2.png";
import img6_3 from "@/assets/images/steps/6.3.png";
import { Step } from "./types_common";

/**
 * Мапинг на възможните опции за предпочитания.
 *
 * @type {Array<string>}
 */
export const preferenceOptions: Record<
  "moviesSeries" | "books" | "music",
  string[]
> = {
  moviesSeries: [
    "Стандартно попълване - препоръките се дават на база предпочитанията на потребителя за жанрове, време за гледане...",
    "Мозъчен анализ - препоръките се дават на база анализ от устройство за измерване на мозъчни вълни",
    "VR сцена - потапяне в киноизкуството чрез препоръчване на филми и сериали в реалистична VR среда"
  ],
  books: [
    "Стандартно попълване - препоръките се дават на база предпочитанията на потребителя за жанрове, автори, произход..."
  ],
  music: [
    "Стандартно попълване - препоръките се дават на база предпочитанията на потребителя за жанрове, изпълнители, темпо..."
  ]
};

/**
 * Мапинг на имената за категориите на жанровете.
 *
 * @type {Array<{en: string, bg: string}>}
 */
export const moviesSeriesGenreOptions: Array<{ en: string; bg: string }> = [
  { en: "Action", bg: "Екшън" },
  { en: "Adventure", bg: "Приключенски" },
  { en: "Animation", bg: "Анимация" },
  { en: "Biography", bg: "Биография" },
  { en: "Comedy", bg: "Комедия" },
  { en: "Reality-TV", bg: "Реалити предавания" },
  { en: "Crime", bg: "Криминален" },
  { en: "Documentary", bg: "Документален" },
  { en: "Drama", bg: "Драма" },
  { en: "Family", bg: "Семейни" },
  { en: "Fantasy", bg: "Фентъзи" },
  { en: "Film-Noir", bg: "Филм-ноар" },
  { en: "History", bg: "Исторически" },
  { en: "Horror", bg: "Ужаси" },
  { en: "Musical", bg: "Мюзикъл" },
  { en: "Mystery", bg: "Мистерия" },
  { en: "Romance", bg: "Романтичен" },
  { en: "Sci-Fi", bg: "Научна фантастика" },
  { en: "Sport", bg: "Спортен" },
  { en: "Thriller", bg: "Трилър" },
  { en: "War", bg: "Военен" },
  { en: "Western", bg: "Уестърн" }
];

/**
 * Мапинг на имената за категориите на жанровете на книги.
 *
 * @type {Array<{en: string, bg: string}>}
 */
export const googleBooksGenreOptions: Array<{ en: string; bg: string }> = [
  { en: "Action & Adventure", bg: "Екшън и приключения" },
  { en: "Anthology", bg: "Антология" },
  { en: "Art", bg: "Изкуство" },
  { en: "Audiobook", bg: "Аудиокнига" },
  { en: "Biographies", bg: "Биографии" },
  { en: "Childrens", bg: "Детски книги" },
  { en: "Classics", bg: "Класика" },
  { en: "Comics", bg: "Комикси" },
  { en: "Contemporary", bg: "Съвременна литература" },
  { en: "Cookbooks", bg: "Готварски книги" },
  { en: "Crime", bg: "Криминален" },
  { en: "Drama", bg: "Драма" },
  { en: "Fantasy", bg: "Фентъзи" },
  { en: "Historical", bg: "Исторически" },
  { en: "Historical Fiction", bg: "Историческа фикция" },
  { en: "Horror", bg: "Ужаси" },
  { en: "Humor", bg: "Хумор" },
  { en: "Literary Fiction", bg: "Литературна фикция" },
  { en: "Memoir", bg: "Мемоари" },
  { en: "Mindfulness", bg: "Майндфулнес" },
  { en: "Mystery", bg: "Мистерия" },
  { en: "Non-fiction", bg: "Нехудожествена литература" },
  { en: "Philosophy", bg: "Философия" },
  { en: "Poetry", bg: "Поезия" },
  { en: "Romance", bg: "Романтика" },
  { en: "Science", bg: "Наука" },
  { en: "Science Fiction", bg: "Научна фантастика" },
  { en: "Self Help", bg: "Самопомощ" },
  { en: "Short Stories", bg: "Кратки разкази" },
  { en: "Suspense", bg: "Напрежение" },
  { en: "Thriller", bg: "Трилър" },
  { en: "Young Adult", bg: "Младежка литература" }
];

/**
 * Мапинг на имената за категориите на жанровете на Goodreads.
 *
 * @type {Array<{en: string, bg: string}>}
 */
export const goodreadsGenreOptions: Array<{ en: string; bg: string }> = [
  { en: "Art", bg: "Изкуство" },
  { en: "Biography", bg: "Биография" },
  { en: "Business", bg: "Бизнес" },
  { en: "Children's", bg: "Детски книги" },
  { en: "Christian", bg: "Християнска литература" },
  { en: "Classics", bg: "Класика" },
  { en: "Comics", bg: "Комикси" },
  { en: "Contemporary", bg: "Съвременна литература" },
  { en: "Cookbooks", bg: "Готварски книги" },
  { en: "Crime", bg: "Криминален" },
  { en: "Fantasy", bg: "Фентъзи" },
  { en: "Fiction", bg: "Художествена литература" },
  { en: "Horror", bg: "Ужаси" },
  { en: "Humor and Comedy", bg: "Хумор и комедия" },
  { en: "Manga", bg: "Манга" },
  { en: "Music", bg: "Музика" },
  { en: "Mystery", bg: "Мистерия" },
  { en: "Nonfiction", bg: "Нехудожествена литература" },
  { en: "Paranormal", bg: "Паранормално" },
  { en: "Poetry", bg: "Поезия" },
  { en: "Psychology", bg: "Психология" },
  { en: "Religion", bg: "Религия" },
  { en: "Romance", bg: "Романтика" },
  { en: "Science", bg: "Наука" },
  { en: "Science Fiction", bg: "Научна фантастика" },
  { en: "Self Help", bg: "Самопомощ" },
  { en: "Suspense", bg: "Напрежение" },
  { en: "Spirituality", bg: "Духовност" },
  { en: "Sports", bg: "Спорт" },
  { en: "Thriller", bg: "Трилър" },
  { en: "Travel", bg: "Пътешествия" },
  { en: "Young Adult", bg: "Младежка литература" }
];

/**
 * Мапинг на имената за категориите на музикалните жанрове.
 *
 * @type {Array<{en: string, bg: string}>}
 */
export const musicGenreOptions: Array<{ en: string; bg: string }> = [
  { en: "pop", bg: "Поп" },
  { en: "k-pop", bg: "Кей-Поп" },
  { en: "j-pop", bg: "Джей-Поп" },
  { en: "rock", bg: "Рок" },
  { en: "metal", bg: "Метъл" },
  { en: "punk", bg: "Пънк" },
  { en: "indie", bg: "Инди" },
  { en: "rap", bg: "Рап" },
  { en: "hip-hop", bg: "Хип-хоп" },
  { en: "trap", bg: "Трап" },
  { en: "r&b", bg: "R&B" },
  { en: "soul", bg: "Соул" },
  { en: "funk", bg: "Фънк" },
  { en: "dance", bg: "Денс" },
  { en: "disco", bg: "Диско" },
  { en: "dancehall", bg: "Дансхол" },
  { en: "reggaeton", bg: "Регетон" },
  { en: "afrobeat", bg: "Афробийт" },
  { en: "latin", bg: "Латино" },
  { en: "reggae", bg: "Реге" },
  { en: "country", bg: "Кънтри" },
  { en: "world", bg: "Световна" },
  { en: "jazz", bg: "Джаз" },
  { en: "blues", bg: "Блус" },
  { en: "gospel", bg: "Госпъл" },
  { en: "classical", bg: "Класическа" },
  { en: "instrumental", bg: "Инструментална" },
  { en: "soundtrack", bg: "Филмова музика (Саундтрак)" },
  { en: "house", bg: "Хаус" }
];

// Стъпки за успешно съставяне на мозъчен анализ
export const steps: Step[] = [
  {
    step: "0. Въведение",
    description:
      "За да започнете мозъчния анализ, трябва да се сдобиете с устройството NeuroSky MindWave Mobile 2. Следвайте следващите стъпки, за да го използвате успешно.",
    images: [img0]
  },
  {
    step: "1. Сваляне на ThinkGear програмата - mwm2.neurosky.com",
    description:
      "Оттам избирате от опциите за изтегляне, спрямо вашата операционната система. След това разархивирате сваления файл и стартирате ThinkGear Connector - зелената иконка. Трябва да се появи долу вдясно иконка, наподобяваща мозък.",
    images: [img1_1, img1_2, img1_3, img1_4]
  },
  {
    step: "2. Пускане на устройството",
    description: "Излиза синя светлина, когато е пуснато.",
    images: [img2]
  },
  {
    step: "3. Свързване на устройството",
    description:
      "Трябва вашият компютър да поддържа Bluetooth (или да имате Bluetooth Adapter). Пускате го от настройките и натискате на опцията за добавяне на ново устройство. Свързвате се към MindWave Mobile (изчаквате, докато не видите иконката със СЛУШАЛКИ).",
    images: [img3_1, img3_2, img3_3, img3_4]
  },
  {
    step: "4. Конфигуриране на COM порт",
    description:
      "След успешно свързване, отивате на More Bluetooth options и оттам в раздела COM ports. Трябва да видите на кой от тях е свързано устройството и ако не е, да добавите порт към него. Интересува ни OUTGOING порта. Той се обозначава с COM и съответната цифра (в примера от снимките, това е COM4). След като идентифицирате правилния порт, отивате и го пишете (пример: „COM4“) в ThinkGear Connector приложението на показаното поле.",
    images: [img4_1, img4_2]
  },
  {
    step: "5. Сваляне на програмата за свързване с MindReel",
    description:
      "След сваляне на архива го разархивирате и отваряте. Трябва да виждате .exe файла за свързване.",
    images: [img5],
    fileName: "mindreel_brain_analysis.zip"
  },
  {
    step: "6. Същинско свързване",
    description:
      "Ако първо сте пуснали ThinkGear Connector, след което сте включили устройството, след което Bluetooth на вашия компютър и най-накрая нашата програмата и видите, че иконката на ThinkGear долу вдясно е в синьо и пише, че има връзка с устройството и също така ви излезе прозореца за започване на сесията, значи успешно сте свързали устройството. **Ако все пак не излиза в command prompt-а съобщението за успешно свързване и не се появява прозореца на програмата, но въпреки това ThinkGear посочва, че има връзка, опитайте да рестартирате.**",
    images: [img6_1, img6_2, img6_3]
  }
];
