import { FC, Fragment, useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import Infobox from "@/components/common/infobox/infobox";
import { MusicRecommendation } from "@/container/types_common";
import RecommendationCardAlert from "./RecommendationCardAlert";
import FilterSidebar from "./FilterSidebar";
import { MusicTableProps } from "../listenlist-types";

const MusicTable: FC<MusicTableProps> = ({
  data,
  setBookmarkedMusic,
  setCurrentBookmarkStatus,
  setAlertVisible,
  bookmarkedMusic
}) => {
  const [selectedItem, setSelectedItem] = useState<MusicRecommendation | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSongClick = (item: MusicRecommendation) => setSelectedItem(item);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Функция за форматиране на артисти
  const formatArtists = (artists?: string): string => {
    if (!artists) return "N/A";
    if (Array.isArray(artists)) return artists.join(", ");
    return artists;
  };

  // Функция за форматиране на продължителността
  const formatDuration = (ms?: number | null): string => {
    if (!ms) return "N/A";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}м ${seconds}с`;
  };

  // Функция за форматиране на дата
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("bg-BG");
  };

  // Търсене в данните
  const searchData = filteredData.filter((item) => {
    const query = searchQuery.toLowerCase();

    // Търсене в заглавие
    if (item.title?.toLowerCase().includes(query)) return true;

    // Търсене в артисти
    if (Array.isArray(item.artists)) {
      if (item.artists.some((artist) => artist.toLowerCase().includes(query)))
        return true;
    } else if (typeof item.artists === "string") {
      if (item.artists.toLowerCase().includes(query)) return true;
    }

    // Търсене в албум
    if (item.albumTitle?.toLowerCase().includes(query)) return true;

    // Търсене в тип на продукция
    if (item.albumType?.toLowerCase().includes(query)) return true;

    // Търсене в година на излизане
    if (item.albumReleaseDateInSpotify?.includes(query)) return true;

    // Търсене в Spotify ID
    if (item.spotifyID?.toLowerCase().includes(query)) return true;

    return false;
  });

  const totalPages = Math.ceil(searchData.length / itemsPerPage);

  const currentData = searchData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleInfoButtonClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });

  return (
    <Fragment>
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        data={data}
        setFilteredData={setFilteredData}
        setCurrentPage={setCurrentPage}
      />
      <RecommendationCardAlert
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        setBookmarkedMusic={setBookmarkedMusic}
        setCurrentBookmarkStatus={setCurrentBookmarkStatus}
        setAlertVisible={setAlertVisible}
        bookmarkedMusic={bookmarkedMusic}
      />
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card">
          <div className="box-header justify-between flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <p className="box-title goodTiming !text-xl text-center sm:text-left">
                Списък за слушане
              </p>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <input
                  type="search"
                  className="form-control search-input w-full sm:w-auto"
                  id="input-search"
                  placeholder="Потърсете по име, артист, албум..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Infobox onClick={handleInfoButtonClick} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
              <div className="relative inline-block text-left w-full sm:w-auto">
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-between items-center w-full sm:w-auto px-3 py-1.5 text-sm font-medium bg-primary hover:bg-primary/75 text-white dark:text-white/80 rounded-md shadow-sm focus:bg-primary focus:text-white transition-all duration-300 ease-in-out"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                  >
                    {itemsPerPage} елемента на страница
                    <ChevronDownIcon
                      className={`w-5 h-5 ml-2 mr-1 transition-transform duration-300 ${
                        isSelectOpen ? "transform rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {isSelectOpen && (
                  <div className="origin-top-right absolute w-full sm:w-auto right-0 mt-2 rounded-md shadow-lg bg-white dark:bg-bodybg border border-primary z-10 animate-dropdown">
                    <div
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {[6, 12, 24, 36, 48].map((value) => (
                        <button
                          key={value}
                          className={`group flex items-center w-full px-4 py-2 text-sm bg-primary/10 ${
                            itemsPerPage === value
                              ? "text-white !bg-primary font-medium"
                              : "text-defaulttextcolor dark:text-white/80"
                          } hover:bg-primary/50 rounded-sm transition-all duration-300 ease-in-out`}
                          role="menuitem"
                          onClick={() => {
                            setItemsPerPage(value);
                            setIsSelectOpen(false);
                          }}
                        >
                          {value} елемента на страница
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <select
                  className="sr-only"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  aria-label="Изберете брой елемента на страница"
                >
                  <option value={6}>6 елемента на страница</option>
                  <option value={12}>12 елемента на страница</option>
                  <option value={24}>24 елемента на страница</option>
                  <option value={36}>36 елемента на страница</option>
                  <option value={48}>48 елемента на страница</option>
                </select>
              </div>
              <button
                className="inline-flex justify-between items-center w-full sm:w-auto px-3 py-1.5 text-sm font-medium bg-primary hover:bg-primary/75 text-white dark:text-white/80 rounded-md shadow-sm focus:bg-primary focus:text-white transition-all duration-300 ease-in-out"
                onClick={() => setIsFilterOpen(true)}
              >
                <i
                  className="bx bx-sort-up text-lg w-5 h-5 mr-2"
                  aria-hidden="true"
                ></i>
                Филтриране
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {currentData.map((item, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-bodybg2/50 shadow-lg rounded-lg p-4 cursor-pointer hover:bg-primary dark:hover:bg-primary transition duration-300 flex flex-col items-center"
                onClick={() => handleSongClick(item)}
              >
                <div className="w-full bg-white/50 dark:bg-bodybg2/50 dark:border-black/10 rounded-md shadow-lg dark:shadow-xl text-center mb-4 px-2 py-3">
                  <h5 className="goodTiming text-base md:text-lg text-defaulttextcolor dark:text-white/80 group-hover:text-white break-words overflow-wrap-anywhere transition duration-300">
                    {item.title}
                  </h5>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full min-w-0">
                  <img
                    src={item.albumCover || "/placeholder-album.png"}
                    alt={item.albumTitle || "Album cover"}
                    className="rounded-lg w-32 h-32 object-cover !shadow-lg flex-shrink-0"
                  />
                  <div className="flex flex-col items-start min-w-0 flex-1 space-y-1 w-full">
                    <span className="text-sm w-full overflow-hidden">
                      <span className="text-gray-600 font-medium group-hover:text-white transition duration-300">
                        Артист(и):
                      </span>{" "}
                      <span className="font-GoodTiming text-gray-900 dark:text-white group-hover:text-white transition duration-300 break-words">
                        {formatArtists(item.artists)}
                      </span>
                    </span>

                    <span className="text-sm w-full overflow-hidden">
                      <span className="text-gray-600 font-medium group-hover:text-white transition duration-300">
                        Албум:
                      </span>{" "}
                      <span className="font-GoodTiming text-gray-900 dark:text-white group-hover:text-white transition duration-300 break-words">
                        {item.albumTitle || "N/A"}
                      </span>
                    </span>

                    <span className="text-sm w-full overflow-hidden">
                      <span className="text-gray-600 font-medium group-hover:text-white transition duration-300">
                        Продължителност:
                      </span>{" "}
                      <span className="font-GoodTiming text-gray-900 dark:text-white group-hover:text-white transition duration-300">
                        {formatDuration(item.durationMs)}
                      </span>
                    </span>

                    <span className="text-sm w-full overflow-hidden">
                      <span className="text-gray-600 font-medium group-hover:text-white transition duration-300">
                        Популярност:
                      </span>{" "}
                      <span className="font-GoodTiming text-gray-900 dark:text-white group-hover:text-white transition duration-300">
                        {item.spotifyPopularity || "N/A"}
                      </span>
                    </span>

                    <span className="text-sm w-full overflow-hidden">
                      <span className="text-gray-600 font-medium group-hover:text-white transition duration-300">
                        Дата на издаване:
                      </span>{" "}
                      <span className="font-GoodTiming text-gray-900 dark:text-white group-hover:text-white transition duration-300">
                        {formatDate(item.albumReleaseDateInSpotify)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="box-footer flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-center">
              <span className="text-defaulttextcolor dark:text-white/80">
                Страница {currentPage} от {totalPages}
              </span>
              <div className="flex justify-center">
                <nav
                  aria-label="Page navigation"
                  className="pagination-style-4"
                >
                  <ul className="ti-pagination mb-0 gap-2 sm:gap-3">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="bg-primary/10 hover:bg-primary/50 border border-primary text-primary px-5 py-3 rounded-lg transition"
                        onClick={handlePreviousPage}
                        style={{
                          padding: is1546 ? "0.4rem 0.6rem" : "0.35rem 0.7rem",
                          fontSize: is1546 ? "0.75rem" : "0.85rem",
                          lineHeight: "1.4"
                        }}
                      >
                        Предишна
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(index + 1);
                          }}
                          style={{
                            padding: is1546
                              ? "0.4rem 0.6rem"
                              : "0.35rem 0.7rem",
                            fontSize: is1546 ? "0.75rem" : "0.85rem",
                            lineHeight: "1.4"
                          }}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="bg-primary/10 hover:bg-primary/50 border border-primary text-primary px-5 py-3 rounded-lg transition"
                        onClick={handleNextPage}
                        style={{
                          padding: is1546 ? "0.4rem 0.6rem" : "0.35rem 0.7rem",
                          fontSize: is1546 ? "0.75rem" : "0.85rem",
                          lineHeight: "1.4"
                        }}
                      >
                        Следваща
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      <InfoboxModal
        onClick={handleInfoButtonClick}
        isModalOpen={isModalOpen}
        title="Търсачка"
        description={
          <>
            <p>
              <span className="font-semibold">Търсачката</span> е инструмент,
              който Ви позволява да търсите за{" "}
              <span className="font-semibold">конкретни песни</span>, които сте
              запазили във вашия списък за слушане и искате да намерите. Тя
              взима въведения в нея текст и го сравнява със{" "}
              <span className="font-semibold">следните категории:</span>
            </p>
            <Accordion type="single" collapsible className="space-y-4 pt-5">
              <AccordionItem value="title">
                <AccordionTrigger>🎵 Заглавие</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсената от Вас песен, въвеждайки
                  заглавието ѝ.
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример:</strong> Bohemian Rhapsody
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="artist">
                <AccordionTrigger>🎤 Артист</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсената от Вас песен, въвеждайки име на
                  артист.
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример:</strong> Queen, The Beatles
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="album">
                <AccordionTrigger>💿 Албум</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсената от Вас песен, въвеждайки името на
                  албума.
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример:</strong> A Night at the Opera
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="year">
                <AccordionTrigger>📅 година на излизане</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсената от Вас песен, въвеждайки годината
                  на издаване.
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример:</strong> 1975, 2020
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="id">
                <AccordionTrigger>🔍 Spotify ID</AccordionTrigger>
                <AccordionContent>
                  Можете да намерите търсената от Вас песен, въвеждайки
                  уникалният ѝ Spotify идентификатор.
                  <ul className="list-disc pl-6 mt-4">
                    <li>
                      <strong>Пример:</strong> 3z8h0TU7ReDPLIbEnYhWZb
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        }
      />
    </Fragment>
  );
};

export default MusicTable;
