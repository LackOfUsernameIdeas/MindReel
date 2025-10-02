import { FC, useState, useEffect } from "react";
import { X } from "lucide-react";
import { moviesSeriesGenreOptions } from "../../../data_common";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { FilterSidebarProps } from "../watchlist-types";
import { handleApplyFilters } from "../helper_functions";

const FilterSidebar: FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  listData,
  data,
  nameMappings,
  setCurrentPage,
  setFilteredData
}) => {
  // Държи избраните стойности за всеки от филтрите
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedRuntime, setSelectedRuntime] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedActor, setSelectedActor] = useState<string[]>([]);
  const [selectedDirector, setSelectedDirector] = useState<string[]>([]);
  const [selectedWriter, setSelectedWriter] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [selectedImdbRating, setSelectedImdbRating] = useState<string[]>([]);
  const [selectedMetascore, setSelectedMetascore] = useState<string[]>([]);
  const [selectedBoxOffice, setSelectedBoxOffice] = useState<string[]>([]);

  // Функция, която проверява дали стринг е латиница
  const isLatin = (str: string) => /[a-zA-Z]/.test(str);

  // Функция за подреждане на стрингове
  const sortNames = (a: string, b: string) => {
    const isALatin = isLatin(a);
    const isBLatin = isLatin(b);

    if (isALatin === isBLatin) {
      return a.localeCompare(b);
    }

    return isALatin ? 1 : -1;
  };

  // Подреждане на актьорите по азбучен ред
  const sortedActors = listData.actor.sort(sortNames);
  // Подреждане на режисьорите по азбучен ред
  const sortedDirectors = listData.director.sort(sortNames);
  // Подреждане на сценаристите по азбучен ред
  const sortedWriters = listData.writer.sort(sortNames);
  // Подреждане на езиците по азбучен ред
  const sortedLanguages = listData.language.sort(sortNames);

  // Забранява скролването на страницата, когато страничната лента е отворена
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Функция за почистване, която премахва класа при демонтиране на компонента
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Нулира всички филтри
  const handleResetFilters = () => {
    setSelectedGenres([]);
    setSelectedRuntime([]);
    setSelectedType([]);
    setSelectedActor([]);
    setSelectedDirector([]);
    setSelectedWriter([]);
    setSelectedLanguage([]);
    setSelectedYear([]);
    setSelectedImdbRating([]);
    setSelectedMetascore([]);
    setSelectedBoxOffice([]);

    // Прилага нулираните филтри веднага
    handleApplyFilters(
      {
        genres: [],
        runtime: [],
        type: [],
        actor: [],
        director: [],
        writer: [],
        language: [],
        year: [],
        imdbRating: [],
        metascore: [],
        boxOffice: []
      },
      nameMappings,
      data,
      setFilteredData,
      setCurrentPage
    );
  };

  // Функции за промяна на избраните стойности за всеки филтър
  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleRuntimeChange = (runtime: string) => {
    setSelectedRuntime((prev) =>
      prev.includes(runtime)
        ? prev.filter((r) => r !== runtime)
        : [...prev, runtime]
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleYearChange = (year: string) => {
    setSelectedYear((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };
  const handleActorChange = (actor: string) => {
    setSelectedActor((prev) =>
      prev.includes(actor) ? prev.filter((a) => a !== actor) : [...prev, actor]
    );
  };
  const handleDirectorChange = (director: string) => {
    setSelectedDirector((prev) =>
      prev.includes(director)
        ? prev.filter((d) => d !== director)
        : [...prev, director]
    );
  };
  const handleWriterChange = (selectedWriter: string) => {
    setSelectedWriter((prev) =>
      prev.includes(selectedWriter)
        ? prev.filter((w) => w !== selectedWriter)
        : [...prev, selectedWriter]
    );
  };
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };
  const handleImdbRatingChange = (imdbRating: string) => {
    setSelectedImdbRating((prev) =>
      prev.includes(imdbRating)
        ? prev.filter((l) => l !== imdbRating)
        : [...prev, imdbRating]
    );
  };
  const handleMetascoreChange = (metascore: string) => {
    setSelectedMetascore((prev) =>
      prev.includes(metascore)
        ? prev.filter((l) => l !== metascore)
        : [...prev, metascore]
    );
  };
  const handleBoxOfficeChange = (boxOffice: string) => {
    setSelectedBoxOffice((prev) =>
      prev.includes(boxOffice)
        ? prev.filter((l) => l !== boxOffice)
        : [...prev, boxOffice]
    );
  };

  // Прилага избраните филтри и затваря страничната лента
  const applyFilters = () => {
    handleApplyFilters(
      {
        genres: selectedGenres,
        runtime: selectedRuntime,
        type: selectedType,
        actor: selectedActor,
        director: selectedDirector,
        writer: selectedWriter,
        language: selectedLanguage,
        year: selectedYear,
        imdbRating: selectedImdbRating,
        metascore: selectedMetascore,
        boxOffice: selectedBoxOffice
      },
      nameMappings,
      data,
      setFilteredData,
      setCurrentPage
    );
    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-bodybg dark:bg-bodybg shadow-lg transition-transform transform ${
        isOpen ? "translate-x-0" : "translate-x-[40rem]"
      } z-50 p-4 overflow-y-auto`}
    >
      <button
        className="absolute top-4 right-4 dark:text-white hover:text-black"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <h3 className="text-lg font-bold goodTiming mb-4">Филтриране</h3>
      <div className="space-y-4">
        {/* Филтрация за жанр */}
        <Accordion type="single" collapsible>
          <AccordionItem value="genre">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Жанр
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {moviesSeriesGenreOptions
                  .sort((a, b) => a.bg.localeCompare(b.bg))
                  .map(({ bg }) => (
                    <div key={bg} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(bg)}
                        onChange={() => handleGenreChange(bg)}
                        className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                      <span className="goodTiming text-sm">{bg}</span>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за продължителност */}
        <Accordion type="single" collapsible>
          <AccordionItem value="runtime">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Продължителност
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {[
                  "Под 60 минути",
                  "60 до 120 минути",
                  "120 до 180 минути",
                  "Повече от 180 минути"
                ].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRuntime.includes(option)}
                      onChange={() => handleRuntimeChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за вид */}
        <Accordion type="single" collapsible>
          <AccordionItem value="type">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Вид
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {["Филм", "Сериал"].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedType.includes(option)}
                      onChange={() => handleTypeChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за актьори */}
        <Accordion type="single" collapsible>
          <AccordionItem value="actor">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Актьори
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {sortedActors.map((actor) => (
                  <div key={actor} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedActor.includes(actor)}
                      onChange={() => handleActorChange(actor)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{actor}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за режисьори */}
        <Accordion type="single" collapsible>
          <AccordionItem value="director">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Режисьори
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {sortedDirectors.map((director) => (
                  <div key={director} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDirector.includes(director)}
                      onChange={() => handleDirectorChange(director)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{director}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за сценаристи */}
        <Accordion type="single" collapsible>
          <AccordionItem value="writer">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Сценаристи
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {sortedWriters.map((writer) => (
                  <div key={writer} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedWriter.includes(writer)}
                      onChange={() => handleWriterChange(writer)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{writer}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за езици */}
        <Accordion type="single" collapsible>
          <AccordionItem value="language">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Езици
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {sortedLanguages.map((language) => (
                  <div key={language} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedLanguage.includes(language)}
                      onChange={() => handleLanguageChange(language)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{language}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за IMDb Рейтинг */}
        <Accordion type="single" collapsible>
          <AccordionItem value="imdbRating">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Imdb Рейтинг
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {[
                  "Под 5.0",
                  "5.0 до 7.0",
                  "7.0 до 8.5",
                  "8.5 до 9.5",
                  "Над 9.5"
                ].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedImdbRating.includes(option)}
                      onChange={() => handleImdbRatingChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за метаскор */}
        <Accordion type="single" collapsible>
          <AccordionItem value="metascore">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Метаскор
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {["Под 35", "35 до 50", "50 до 75", "75 до 95", "Над 95"].map(
                  (option) => (
                    <div key={option} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedMetascore.includes(option)}
                        onChange={() => handleMetascoreChange(option)}
                        className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                      <span className="goodTiming text-sm">{option}</span>
                    </div>
                  )
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за боксофис */}
        <Accordion type="single" collapsible>
          <AccordionItem value="boxOffice">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Боксофис
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {[
                  "Без приходи",
                  "Под 50 млн.",
                  "50 до 150 млн.",
                  "150 до 300 млн.",
                  "Над 300 млн."
                ].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBoxOffice.includes(option)}
                      onChange={() => handleBoxOfficeChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за година на излизане */}
        <Accordion type="single" collapsible>
          <AccordionItem value="year">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Година на излизане
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {[
                  "Преди 2000",
                  "2000 до 2010",
                  "2010 до 2020",
                  "След 2020"
                ].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedYear.includes(option)}
                      onChange={() => handleYearChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Бутони за прилагане и нулиране на филтрация */}
        <div className="flex flex-col gap-2">
          <button
            className="bg-gray-400 hover:bg-gray-400/75 text-gray-800 px-4 py-2 rounded-md transition w-full"
            onClick={handleResetFilters}
          >
            Нулиране на филтрите
          </button>
          <button
            className="bg-primary hover:bg-primary/75 text-white px-4 py-2 rounded-md transition w-full"
            onClick={applyFilters}
          >
            Приложи
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
