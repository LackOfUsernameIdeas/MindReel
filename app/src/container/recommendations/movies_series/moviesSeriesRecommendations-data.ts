import { FilteredBrainData } from "@/container/types_common";
import { MoviesSeriesUserPreferences } from "./moviesSeriesRecommendations-types";

export const moodOptions = [
  "Развълнуван/-на 😄",
  "Любопитен/-на 🤔",
  "Тъжен/-на 😢",
  "Щастлив/-а 😊",
  "Спокоен/-йна 😌",
  "Разочарован/-на 😞",
  "Уморен/-на 😴",
  "Нервен/-на 😟",
  "Разгневен/-на 😠",
  "Стресиран/-на 😰",
  "Носталгичен/-на 😭",
  "Безразличен/-на 😐",
  "Оптимистичен/-на 😃",
  "Песимистичен/-на 😔",
  "Весел/-а 😁",
  "Смутен/-на 😳",
  "Озадачен/-на 🤨",
  "Разтревожен/-на 😧",
  "Вдъхновен/-на ✨"
];

export const timeAvailabilityOptions = [
  "1 час",
  "2 часа",
  "3 часа",
  "Нямам предпочитания"
];

export const ageOptions = [
  "Публикуван в последните 3 години",
  "Публикуван в последните 10 години",
  "Публикуван в последните 20 години",
  "Нямам предпочитания"
];

export const pacingOptions = [
  "Бавни, концентриращи се върху разкази на героите",
  "Бързи с много напрежение",
  "Нямам предпочитания"
];
export const depthOptions = [
  "Лесни за проследяване - релаксиращи",
  "Средни - с ясни сюжетни линии",
  "Трудни - с много истории и терминологии, характерни за филма/сериала",
  "Нямам предпочитания"
];

export const targetGroupOptions = [
  "Деца",
  "Тийнейджъри",
  "Възрастни",
  "Семейни",
  "Семейство и деца",
  "Възрастни над 65"
];

export const moviesSeriesStandardPreferencesPrompt = (
  userPreferences: MoviesSeriesUserPreferences
) => {
  const {
    recommendationType,
    genres,
    moods,
    timeAvailability,
    age,
    actors,
    directors,
    interests,
    countries,
    pacing,
    depth,
    targetGroup
  } = userPreferences;

  const typeText = recommendationType === "Филм" ? "филма" : "сериала";

  return {
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: `You are an AI that recommends movies and series based on user preferences. Provide a list of movies and series, based on what the user has chosen to watch (movie or series), that match the user's taste and preferences, formatted in Bulgarian, with detailed justifications.
          CRITICAL: You MUST return ONLY valid JSON that can be parsed by JavaScript JSON.parse().

          JSON FORMATTING RULES (MANDATORY):
          1. Use ONLY straight double quotes (") - never use curly quotes (" ")
          2. Always escape quotes inside string values: use \\" not "
          3. Never use single quotes (') in JSON
          4. No markdown code blocks (no \`\`\`json)
          5. No extra text before or after the JSON object
          6. Test your output would pass: JSON.parse(your_response)`
      },
      {
        role: "user",
        content: `Препоръчай ми 5 ${typeText} за гледане, които ЗАДЪЛЖИТЕЛНО да съвпадат с моите вкусове и предпочитания, а именно:
              Любими жанрове: ${genres.map((genre) => genre.bg)}.
              Емоционално състояние в този момент: ${moods}.
              Разполагаемо свободно време за гледане: ${timeAvailability}.
              Възрастта на ${typeText} задължително да бъде: ${age}
              Любими актьори: ${actors}.
              Любими филмови режисьори: ${directors}.
              Теми, които ме интересуват: ${interests}.
              Филмите/сериалите могат да бъдат от следните страни: ${countries}.
              Темпото (бързината) на филмите/сериалите предпочитам да бъде: ${pacing}.
              Предпочитам филмите/сериалите да са: ${depth}.
              Целевата група е: ${targetGroup}.
              Дай информация за всеки отделен филм/сериал по отделно защо той е подходящ за мен.
              Задължително искам имената на филмите/сериалите да бъдат абсолютно точно както са официално на български език – така, както са известни сред публиката в България.
              Не се допуска буквален превод на заглавията от английски, ако официалното българско заглавие се различава от буквалния превод.
              Не препоръчвай 18+ филми/сериали.
              Форматирай своя response във валиден JSON формат по този начин:
              {
                'Официално име на ${typeText} на английски, както е прието да бъде': {
                  'bgName': 'Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод',
                  'description': 'Описание на ${typeText}',
                  'reason': 'Защо този филм/сериал е подходящ за мен?'
                },
                'Официално име на ${typeText} на английски, както е прието да бъде': {
                  'bgName': 'Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод',
                  'description': 'Описание на ${typeText}',
                  'reason': 'Защо този филм/сериал е подходящ за мен?'
                },
                // ...additional movies
              }. КРИТИЧНО ВАЖНО ЗА КАВИЧКИТЕ:
              - Ако в текста има цитати или кавички, използвай \\" (escaped quotes)
              - Пример: "Филмът разказва за \\"надежда\\" и приятелство"
              - Пример: "Героят казва: \\"Get busy living\\" - силна фраза"
              - НИКОГА не използвай " или " (curly quotes)
              - НИКОГА не използвай ' (single quotes) в JSON`
      }
    ]
  };
};

export const moviesSeriesBrainAnalysisPrompt = (
  brainWaveData: FilteredBrainData[]
) => {
  const brainWaveString = JSON.stringify(brainWaveData, null, 2);

  return {
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `You are an AI therapist that recommends movies and series based on data from the 'NeuroSky MindWave Mobile 2: EEG Sensor'. The device provides insights into the user's brain activity, cognitive state and emotional levels by measuring EEG power spectrums (Delta, Theta, low and high Alpha, low and high Beta, low and high Gamma) and using data from EEG algorithms - Attention and Meditation.\n\n=== EEG KNOWLEDGE BASE ===\n\nBRAINWAVE FREQUENCIES AND THEIR MEANINGS:\n\nDelta δ (0-4Hz) - Най-ниска мозъчна активност:\n- Високи стойности: Изключително отпуснато състояние или сън\n- Мозъкът намалява съзнанието за физическия свят\n- Терапия: Ако прекалено високи → препоръчай стимулиращо съдържание\n\nTheta θ (4-7Hz) - Ниска до умерена активност:\n- Високи стойности: Отпускане, креативност, интуиция, въображение\n- Свързани с вътрешна концентрация, медитация, духовно осъзнаване\n- Състояние между будност и сън (хипнагонично)\n- Терапия: Ако прекалено високи → препоръчай ангажиращо съдържание за фокус\n\nAlpha α (8-12Hz) - Умерена активност:\n- Високи стойности: Спокойствие, уравновесеност, добро настроение\n- Умствена координация и съзнателност\n- Low Alpha (8-10Hz): Преходни състояния, лека разсеяност\n- High Alpha (10-12Hz): Оптимална релаксирана концентрация, когнитивна ефективност\n- Терапия: Ако ниски → препоръчай успокояващо, медитативно съдържание\n\nBeta β (12-30Hz) - Висока активност:\n- Високи стойности: Съсредоточеност, активно мислене, решаване на задачи\n- Логическо мислене, критичен анализ, когнитивна обработка\n- Low Beta (12-15Hz): Спокойна концентрация, устойчива бдителност (SMR ритъм)\n- Mid Beta (15-18Hz): Активно мислене, обработка на информация\n- High Beta (18-30Hz): ПРЕКОМЕРНА активност, стрес, тревожност, нервност\n- Терапия: Ако прекалено високи → ЗАДЪЛЖИТЕЛНО препоръчай успокояващо съдържание\n\nGamma γ (30+ Hz) - Интензивна активност:\n- Високи стойности: Изключителна съсредоточеност, бърза обработка, вземане на решения\n- Синхронизация между мозъчни региони\n- Low Gamma (30-40Hz): Добра концентрация, ефективна обработка, памет\n- High Gamma (40+Hz): ПРЕКОМЕРНА невронна активност, свръхвъзбуда, тревожност, когнитивно претоварване, стрес\n- Терапия: Ако прекалено високи → ЗАДЪЛЖИТЕЛНО препоръчай заземяващо, спокойно съдържание\n\nNEUROSKY ALGORITHMS:\n\nAttention (0-100):\n- Високи стойности (70-100): Силна концентрация върху задача\n- Ниски стойности (0-40): Разсеяност, липса на фокус\n- Терапия: Ако ниски → препоръчай ангажиращо, структурирано съдържание\n\nMeditation (0-100):\n- Високи стойности (70-100): Спокойствие, отпускане, баланс\n- Ниски стойности (0-40): Напрежение, стрес, неспокойствие\n- Терапия: Ако ниски → препоръчай успокояващо, хармонизиращо съдържание\n\n=== YOUR TASK ===\n\nAnalyze the EEG data, identify the dominant pattern, then recommend 5 movies/series that will THERAPEUTICALLY REBALANCE the user's mental state.\n\nDIVERSITY REQUIREMENTS:\n- All 5 must be DIFFERENT genres\n- At least 3 different countries\n- Multiple decades represented\n- Maximum 1 mainstream title\n- Vary therapeutic approaches\n\nRANDOMIZATION: Use specific numeric values in EEG data to explore different cinema traditions. Avoid obvious recommendations.\n\nYOU MUST RESPOND ONLY IN NATURAL BULGARIAN LANGUAGE. Avoid English loanwords and direct translations of English phrases. Use authentic Bulgarian terminology.\n\n
          CRITICAL: You MUST return ONLY valid JSON that can be parsed by JavaScript JSON.parse().

          JSON FORMATTING RULES (MANDATORY):
          1. Use ONLY straight double quotes (") - never use curly quotes (" ")
          2. Always escape quotes inside string values with backslash: \\"
          3. Never use single quotes (') in JSON
          4. No markdown code blocks (no \`\`\`json)
          5. No extra text before or after the JSON object`
      },
      {
        role: "user",
        content: `Анализирай внимателно следните данни за мозъчни вълни: ${brainWaveString}.\n\nСЪС ТЕРАПЕВТИЧНА ЦЕЛ - препоръчай ми 5 филма или сериала, които:\n1. НЕ само съответстват на текущото ми състояние, а го ПОДОБРЯВАТ и БАЛАНСИРАТ\n2. Действат като \"лекарство\" за установените дисбаланси или стресови състояния в EEG данните\n3. Са максимално РАЗНООБРАЗНИ по жанр, произход, епоха и терапевтичен подход\n\nЗа ВСЕКИ филм/сериал предостави В \"reason\" ПОЛЕТО:\n\nСТРУКТУРА НА ОБЯСНЕНИЕТО (задължителна):\n\n1. ДИАГНОЗА (2-3 изречения):\n   - Какво показва твоят EEG анализ за моето текущо състояние?\n   - Посочи КОНКРЕТНИ стойности (напр. \"Beta 45,000\", \"Attention 35\", \"Meditation 80\")\n   - Какъв е установеният проблем/дисбаланс? (стрес, умора, разсеяност и т.н.)\n\n2. ТЕРАПЕВТИЧЕН ЕФЕКТ (2-3 изречения):\n   - Какво ТОЧНО ще направи този филм/сериал за моето състояние?\n   - Как ще помогне за балансиране/подобряване?\n   - Какви мозъчни вълни/процеси ще стимулира или успокои?\n\n3. СЪОТВЕТСТВИЕ ПРЕПОРЪКА-МОЗЪК (2-3 изречения):\n   - Как темпото, настроението и визуалният стил на продукцията постигат този ефект?\n   - Защо ТОЗИ конкретен филм е подходящ (а не друг от същия жанр)?\n\nПРИМЕР ЗА ДОБРО ОБЯСНЕНИЕ (ПИШИ САМО НА ЧИСТ БЪЛГАРСКИ):\n\"Анализът показва повишен Beta (48,200 при 15:32:45) и нисък Alpha (15,300), комбинирани с Meditation под 40 в повечето моменти - типични признаци на ментално претоварване и безпокойство. Този филм действа като визуална медитация - спокойното му темпо и дълги кадри естествено понижават Beta активността и стимулират Alpha вълните, което води до отпускане. Съзерцателният разказ позволява на мозъка да излезе от аналитичния режим и да влезе в по-спокойно състояние, което директно коригира установения дисбаланс.\"\n\nВАЖНО - ЕЗИКОВИ ИЗИСКВАНИЯ:\n- Пиши САМО на български език с естествена българска терминология\n- НЕ използвай английски думи като: arousal, fluctuations и др.\n- Избягвай директни преводи на английски фрази\n\nИЗИСКВАНИЯ ЗА ИМЕНАТА:\n- Задължително използвай официалните български заглавия, както са известни в България\n- Не прави буквален превод, ако има установено българско име\n- Не препоръчвай 18+ продукции\n\nФОРМАТ:\nФорматирай отговора във валиден JSON с тази структура (използвай само двойни кавички):\n{\n  \"Официално английско заглавие\": {\n    \"bgName\": \"Официално българско заглавие\",\n    \"description\": \"Кратко описание на продукцията (2-3 изречения)\",\n    \"reason\": \"Структурирано обяснение следвайки 3-те задължителни части: ДИАГНОЗА, ТЕРАПЕВТИЧЕН ЕФЕКТ, СЪОТВЕТСТВИЕ ПРЕПОРЪКА-МОЗЪК. Използвай конкретни числа от EEG данните. ПИШИ САМО НА ЧИСТ БЪЛГАРСКИ ЕЗИК.\"\n  }\n}\n\nУвери се, че:\n- Няма излишен текст извън JSON структурата\n- \"reason\" полето следва точно зададената структура с 3-те части\n- ЦЕЛИЯТ ТЕКСТ Е НА ЧИСТ БЪЛГАРСКИ БЕЗ ЧУЖДИЦИ.
          КРИТИЧНО ВАЖНО ЗА КАВИЧКИТЕ В ОТГОВОРА:
          - Когато цитираш стойности или използваш кавички в текста, ВИНАГИ ги escape-вай: \\"
          - Пример: "Beta 45,000 показва \\"прекомерна\\" активност"
          - Пример: "Филмът е описан като \\"визуална поезия\\" от критиците"
          - НИКОГА не използвай curly quotes (" ")
        `
      }
    ]
  };
};

export const moviesSeriesBrainAnalysisPrompt2 = (
  brainWaveData: FilteredBrainData[]
) => {
  const brainWaveString = JSON.stringify(brainWaveData, null, 2);

  return {
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `You are an AI therapist that recommends movies and series based on data from the 'NeuroSky MindWave Mobile 2: EEG Sensor'. The device provides insights into the user's brain activity, cognitive state and emotional levels by measuring EEG power spectrums (Delta, Theta, low and high Alpha, low and high Beta, low and high Gamma) and using data from EEG algorithms - Attention and Meditation.\n\n=== EEG KNOWLEDGE BASE ===\n\nBRAINWAVE FREQUENCIES AND THEIR MEANINGS:\n\nDelta δ (0-4Hz) - Най-ниска мозъчна активност:\n- Високи стойности: Изключително отпуснато състояние или сън\n- Мозъкът намалява съзнанието за физическия свят\n- Терапия: Ако прекалено високи → препоръчай стимулиращо съдържание\n\nTheta θ (4-7Hz) - Ниска до умерена активност:\n- Високи стойности: Отпускане, креативност, интуиция, въображение\n- Свързани с вътрешна концентрация, медитация, духовно осъзнаване\n- Състояние между будност и сън (хипнагонично)\n- Терапия: Ако прекалено високи → препоръчай ангажиращо съдържание за фокус\n\nAlpha α (8-12Hz) - Умерена активност:\n- Високи стойности: Спокойствие, уравновесеност, добро настроение\n- Умствена координация и съзнателност\n- Low Alpha (8-10Hz): Преходни състояния, лека разсеяност\n- High Alpha (10-12Hz): Оптимална релаксирана концентрация, когнитивна ефективност\n- Терапия: Ако ниски → препоръчай успокояващо, медитативно съдържание\n\nBeta β (12-30Hz) - Висока активност:\n- Високи стойности: Съсредоточеност, активно мислене, решаване на задачи\n- Логическо мислене, критичен анализ, когнитивна обработка\n- Low Beta (12-15Hz): Спокойна концентрация, устойчива бдителност (SMR ритъм)\n- Mid Beta (15-18Hz): Активно мислене, обработка на информация\n- High Beta (18-30Hz): ПРЕКОМЕРНА активност, стрес, тревожност, нервност\n- Терапия: Ако прекалено високи → ЗАДЪЛЖИТЕЛНО препоръчай успокояващо съдържание\n\nGamma γ (30+ Hz) - Интензивна активност:\n- Високи стойности: Изключителна съсредоточеност, бърза обработка, вземане на решения\n- Синхронизация между мозъчни региони\n- Low Gamma (30-40Hz): Добра концентрация, ефективна обработка, памет\n- High Gamma (40+Hz): ПРЕКОМЕРНА невронна активност, свръхвъзбуда, тревожност, когнитивно претоварване, стрес\n- Терапия: Ако прекалено високи → ЗАДЪЛЖИТЕЛНО препоръчай заземяващо, спокойно съдържание\n\nNEUROSKY ALGORITHMS:\n\nAttention (0-100):\n- Високи стойности (70-100): Силна концентрация върху задача\n- Ниски стойности (0-40): Разсеяност, липса на фокус\n- Терапия: Ако ниски → препоръчай ангажиращо, структурирано съдържание\n\nMeditation (0-100):\n- Високи стойности (70-100): Спокойствие, отпускане, баланс\n- Ниски стойности (0-40): Напрежение, стрес, неспокойствие\n- Терапия: Ако ниски → препоръчай успокояващо, хармонизиращо съдържание\n\n=== YOUR TASK ===\n\nAnalyze the EEG data, identify the dominant pattern, then recommend 5 movies/series that will THERAPEUTICALLY REBALANCE the user's mental state.\n\nDIVERSITY REQUIREMENTS:\n- All 5 must be DIFFERENT genres\n- At least 3 different countries\n- Multiple decades represented\n- Maximum 1 mainstream title\n- Vary therapeutic approaches\n\nAVOID OVER-RECOMMENDATION: These titles have been frequently recommended and should ONLY be suggested if they are exceptionally well-matched to unique EEG patterns:\n- Отвътре навън / Inside Out\n- Планетата Земя II / Planet Earth II\n- Амели / Amelie\n- Дървото на живота / The Tree of Life\n- Моят съсед Тоторо / My Neighbor Totor\n- Патерсън / Paterson\n- Ида / Ida\n- Двойният живот на Вероник / The Double Life of Véronique\n- In the Mood for Love\n- The Lunchbox\n\nRANDOMIZATION: Use specific numeric values in EEG data to explore different cinema traditions. Avoid obvious recommendations.\n\nYOU MUST RESPOND ONLY IN NATURAL BULGARIAN LANGUAGE. Avoid English loanwords and direct translations of English phrases. Use authentic Bulgarian terminology.\n\n
          CRITICAL: You MUST return ONLY valid JSON that can be parsed by JavaScript JSON.parse().

          JSON FORMATTING RULES (MANDATORY):
          1. Use ONLY straight double quotes (") - never use curly quotes (" ")
          2. Always escape quotes inside string values with backslash: \\"
          3. Never use single quotes (') in JSON
          4. No markdown code blocks (no \`\`\`json)
          5. No extra text before or after the JSON object`
      },
      {
        role: "user",
        content: `Анализирай внимателно следните данни за мозъчни вълни: ${brainWaveString}.\n\nСЪС ТЕРАПЕВТИЧНА ЦЕЛ - препоръчай ми 5 филма или сериала, които:\n1. НЕ само съответстват на текущото ми състояние, а го ПОДОБРЯВАТ и БАЛАНСИРАТ\n2. Действат като \"лекарство\" за установените дисбаланси или стресови състояния в EEG данните\n3. Са максимално РАЗНООБРАЗНИ по жанр, произход, епоха и терапевтичен подход\n\nЗа ВСЕКИ филм/сериал предостави В \"reason\" ПОЛЕТО:\n\nСТРУКТУРА НА ОБЯСНЕНИЕТО (задължителна):\n\n1. ДИАГНОЗА (2-3 изречения):\n   - Какво показва твоят EEG анализ за моето текущо състояние?\n   - Посочи КОНКРЕТНИ стойности (напр. \"Beta 45,000\", \"Attention 35\", \"Meditation 80\")\n   - Какъв е установеният проблем/дисбаланс? (стрес, умора, разсеяност и т.н.)\n\n2. ТЕРАПЕВТИЧЕН ЕФЕКТ (2-3 изречения):\n   - Какво ТОЧНО ще направи този филм/сериал за моето състояние?\n   - Как ще помогне за балансиране/подобряване?\n   - Какви мозъчни вълни/процеси ще стимулира или успокои?\n\n3. СЪОТВЕТСТВИЕ ПРЕПОРЪКА-МОЗЪК (2-3 изречения):\n   - Как темпото, настроението и визуалният стил на продукцията постигат този ефект?\n   - Защо ТОЗИ конкретен филм е подходящ (а не друг от същия жанр)?\n\nПРИМЕР ЗА ДОБРО ОБЯСНЕНИЕ (ПИШИ САМО НА ЧИСТ БЪЛГАРСКИ):\n\"Анализът показва повишен Beta (48,200 при 15:32:45) и нисък Alpha (15,300), комбинирани с Meditation под 40 в повечето моменти - типични признаци на ментално претоварване и безпокойство. Този филм действа като визуална медитация - спокойното му темпо и дълги кадри естествено понижават Beta активността и стимулират Alpha вълните, което води до отпускане. Съзерцателният разказ позволява на мозъка да излезе от аналитичния режим и да влезе в по-спокойно състояние, което директно коригира установения дисбаланс.\"\n\nВАЖНО - ЕЗИКОВИ ИЗИСКВАНИЯ:\n- Пиши САМО на български език с естествена българска терминология\n- НЕ използвай английски думи като: arousal, fluctuations и др.\n- Избягвай директни преводи на английски фрази\n\nИЗИСКВАНИЯ ЗА ИМЕНАТА:\n- Задължително използвай официалните български заглавия, както са известни в България\n- Не прави буквален превод, ако има установено българско име\n- Не препоръчвай 18+ продукции\n\nФОРМАТ:\nФорматирай отговора във валиден JSON с тази структура (използвай само двойни кавички):\n{\n  \"Официално английско заглавие\": {\n    \"bgName\": \"Официално българско заглавие\",\n    \"description\": \"Кратко описание на продукцията (2-3 изречения)\",\n    \"reason\": \"Структурирано обяснение следвайки 3-те задължителни части: ДИАГНОЗА, ТЕРАПЕВТИЧЕН ЕФЕКТ, СЪОТВЕТСТВИЕ ПРЕПОРЪКА-МОЗЪК. Използвай конкретни числа от EEG данните. ПИШИ САМО НА ЧИСТ БЪЛГАРСКИ ЕЗИК.\"\n  }\n}\n\nУвери се, че:\n- Няма излишен текст извън JSON структурата\n- \"reason\" полето следва точно зададената структура с 3-те части\n- ЦЕЛИЯТ ТЕКСТ Е НА ЧИСТ БЪЛГАРСКИ БЕЗ ЧУЖДИЦИ.
          КРИТИЧНО ВАЖНО ЗА КАВИЧКИТЕ В ОТГОВОРА:
          - Когато цитираш стойности или използваш кавички в текста, ВИНАГИ ги escape-вай: \\"
          - Пример: "Beta 45,000 показва \\"прекомерна\\" активност"
          - Пример: "Филмът е описан като \\"визуална поезия\\" от критиците"
          - НИКОГА не използвай curly quotes (" ")
        `
      }
    ]
  };
};
