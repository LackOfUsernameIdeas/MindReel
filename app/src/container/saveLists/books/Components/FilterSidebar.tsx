import { FC, useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  googleBooksGenreOptions,
  goodreadsGenreOptions
} from "../../../data_common";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { FilterSidebarProps } from "../readlist-types";
import { handleApplyFilters, processGenres } from "../helper_functions";

const FilterSidebar: FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  listData,
  data,
  setCurrentPage,
  setFilteredData
}) => {
  // Държи избраните стойности за всеки от филтрите
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // Избрани жанрове
  const [selectedPages, setSelectedPages] = useState<string[]>([]); // Филтър по брой страници
  const [selectedAuthor, setSelectedAuthor] = useState<string[]>([]); // Филтър по автор
  const [selectedPublisher, setSelectedPublisher] = useState<string[]>([]); // Филтър по издател
  const [selectedGoodreadsRating, setSelectedGoodreadsRating] = useState<
    string[]
  >([]); // Филтър по рейтинг в Goodreads
  const [selectedYear, setSelectedYear] = useState<string[]>([]); // Филтър по година

  // Подреждане на авторите по азбучен ред
  const sortedAuthors = listData.authors.sort((a, b) => a.localeCompare(b));
  // Подреждане на издателите по азбучен ред
  const sortedPublishers = listData.publishers.sort((a, b) =>
    a.localeCompare(b)
  );

  // Създаване на уникален списък с жанрове от Goodreads и Google Books
  const goodreadsGenresSet = new Set(
    goodreadsGenreOptions.map((genre) => genre.bg)
  );

  const uniqueGoogleBooksGenres = googleBooksGenreOptions.filter(
    (genre) => !goodreadsGenresSet.has(genre.bg)
  );

  // Combine the goodreads and Google Books genres
  const updatedGenreOptions = [
    ...processGenres(goodreadsGenreOptions),
    ...processGenres(uniqueGoogleBooksGenres)
  ].sort((a, b) => a.bg.localeCompare(b.bg)); // Sort genres by name

  console.log(updatedGenreOptions);

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
    setSelectedPages([]);
    setSelectedAuthor([]);
    setSelectedPublisher([]);
    setSelectedGoodreadsRating([]);
    setSelectedYear([]);

    // Прилага нулираните филтри веднага
    handleApplyFilters(
      {
        genres: [],
        pages: [],
        author: [],
        publisher: [],
        goodreadsRatings: [],
        year: []
      },
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
  const handlePagesChange = (pages: string) => {
    setSelectedPages((prev) =>
      prev.includes(pages) ? prev.filter((p) => p !== pages) : [...prev, pages]
    );
  };
  const handleAuthorChange = (author: string) => {
    setSelectedAuthor((prev) =>
      prev.includes(author)
        ? prev.filter((t) => t !== author)
        : [...prev, author]
    );
  };
  const handleYearChange = (year: string) => {
    setSelectedYear((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };
  const handlePublisherChange = (publisher: string) => {
    setSelectedPublisher((prev) =>
      prev.includes(publisher)
        ? prev.filter((y) => y !== publisher)
        : [...prev, publisher]
    );
  };
  const handleGoodreadsRatingChange = (goodreadsRating: string) => {
    setSelectedGoodreadsRating((prev) =>
      prev.includes(goodreadsRating)
        ? prev.filter((y) => y !== goodreadsRating)
        : [...prev, goodreadsRating]
    );
  };

  // Прилага избраните филтри и затваря страничната лента
  const applyFilters = () => {
    handleApplyFilters(
      {
        genres: selectedGenres,
        pages: selectedPages,
        author: selectedAuthor,
        publisher: selectedPublisher,
        goodreadsRatings: selectedGoodreadsRating,
        year: selectedYear
      },
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
                <div className="mt-2 space-y-2">
                  {updatedGenreOptions.map(({ bg }) => (
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
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за страници */}
        <Accordion type="single" collapsible>
          <AccordionItem value="pages">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Страници
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {[
                  "Под 100 страници",
                  "100 до 200 страници",
                  "200 до 300 страници",
                  "300 до 400 страници",
                  "400 до 500 страници",
                  "Повече от 500 страници"
                ].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPages.includes(option)}
                      onChange={() => handlePagesChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за автори */}
        <Accordion type="single" collapsible>
          <AccordionItem value="author">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Автори
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {sortedAuthors.map((author) => (
                  <div key={author} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAuthor.includes(author)}
                      onChange={() => handleAuthorChange(author)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{author}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за издатели */}
        <Accordion type="single" collapsible>
          <AccordionItem value="publisher">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Издатели
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {sortedPublishers.map((publisher) => (
                  <div key={publisher} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPublisher.includes(publisher)}
                      onChange={() => handlePublisherChange(publisher)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{publisher}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за рейтинг в Goodreads */}
        <Accordion type="single" collapsible>
          <AccordionItem value="goodreadsRating">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Рейтинг в Goodreads
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {[
                  "Под 3.0",
                  "3.0 до 3.5",
                  "3.5 до 4.0",
                  "4.0 до 4.5",
                  "Над 4.5"
                ].map((option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedGoodreadsRating.includes(option)}
                      onChange={() => handleGoodreadsRatingChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="goodTiming text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Филтрация за година на писане */}
        <Accordion type="single" collapsible>
          <AccordionItem value="year">
            <AccordionTrigger className="goodTiming text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md">
              Година на писане
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              <div className="mt-2 space-y-2">
                {[
                  "Преди 1900",
                  "1900 до 1950",
                  "1950 до 1980",
                  "1980 до 2000",
                  "2000 до 2010",
                  "След 2010"
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

        {/* Вутони за прилагане и нулиране на филтрация */}
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
