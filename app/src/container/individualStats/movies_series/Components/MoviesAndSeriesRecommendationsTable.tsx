import { FC, Fragment, useEffect, useState, useMemo, useCallback } from "react";
import {
  MoviesAndSeriesRecommendationsTableProps,
  Rating
} from "../moviesSeriesIndividualStats-types";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import RecommendationCardAlert from "./RecommendationCardAlert";
import Pagination from "../../../../components/common/pagination/pagination";
import { MovieSeriesRecommendation } from "../../../types_common";

const MoviesAndSeriesRecommendationsTable: FC<
  MoviesAndSeriesRecommendationsTableProps
> = ({
  data,
  type,
  bookmarkedMovies,
  setBookmarkedMovies,
  setCurrentBookmarkStatus,
  setAlertVisible
}) => {
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5;
  const [sortBy, setSortBy] = useState<
    keyof MovieSeriesRecommendation | "default"
  >("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<MovieSeriesRecommendation | null>(null);

  const [filteredTableData, setFilteredTableData] =
    useState<MovieSeriesRecommendation[]>(data);

  useEffect(() => {
    setFilteredTableData(data || []);
  }, [data]);

  const sortOptions = useMemo(() => {
    const options = [
      { label: "Просперитет", value: "prosperityScore" },
      { label: "Боксофис", value: "boxOffice" }
    ];

    if (type === "recommendations") {
      options.unshift({ label: "Брой Препоръки", value: "recommendations" });
    }

    return options;
  }, [type]);

  const sortTitles: Record<string, string> = {
    recommendations: "Най-Често Препоръчваните Филми и Сериали За Мен",
    prosperityScore: "Филми и Сериали По Просперитет",
    boxOffice: "Най-Печеливши Филми и Сериали"
  };

  const sortedData = useMemo(() => {
    const filteredByTypeData = ["boxOffice", "prosperityScore"].includes(sortBy)
      ? filteredTableData.filter((item) => item.type === "movie")
      : filteredTableData;

    if (sortBy === "default") {
      return filteredByTypeData;
    }

    return [...filteredByTypeData].sort((a, b) => {
      const parseNumber = (value: any) => {
        // Extract numeric value from formatted strings (e.g., "1,000,000" -> 1000000)
        if (typeof value === "string") {
          return parseFloat(value.replace(/,/g, ""));
        }
        return value || 0; // Fallback for null or undefined
      };

      const extractNumericValue = (
        value: string | number | Rating[]
      ): number => {
        if (typeof value === "string") {
          // Clean up the string and parse as a float
          return parseFloat(value.replace(/[^\d.-]/g, ""));
        } else if (typeof value === "number") {
          // Return the number directly
          return value;
        } else if (Array.isArray(value)) {
          // Handle Rating[] case (return 0 or a calculated value based on your needs)
          return 0; // Default value or implement a custom logic
        }
        return 0; // Fallback value for unexpected cases
      };

      const valueA = extractNumericValue(a[sortBy as keyof typeof a]);
      const valueB = extractNumericValue(b[sortBy as keyof typeof b]);

      console.log("a[sortBy as keyof typeof a]", a[sortBy as keyof typeof a]);
      console.log("b[sortBy as keyof typeof b]", b[sortBy as keyof typeof b]);

      if (valueA === valueB) return 0;

      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [filteredTableData, sortBy, sortOrder]);

  const totalItems = sortedData.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  const paginatedData = useMemo(() => {
    const start = (currentTablePage - 1) * itemsPerTablePage;
    return sortedData.slice(start, start + itemsPerTablePage);
  }, [sortedData, currentTablePage]);

  const handlePrevTablePage = useCallback(() => {
    if (currentTablePage > 1) setCurrentTablePage((prev) => prev - 1);
  }, [currentTablePage]);

  const handleNextTablePage = useCallback(() => {
    if (currentTablePage < totalTablePages)
      setCurrentTablePage((prev) => prev + 1);
  }, [currentTablePage, totalTablePages]);

  const is1399 = useMediaQuery({ query: "(max-width: 1399px)" });
  const is1557 = useMediaQuery({ query: "(max-width: 1557px)" });

  const toggleSortMenu = () => setIsSortMenuOpen((prev) => !prev);

  const handleSortOptionSelect = useCallback(
    (value: keyof MovieSeriesRecommendation) => {
      setSortBy(value);
      setIsSortMenuOpen(false);
    },
    []
  );

  const getTranslatedType = (type: string) =>
    type === "movie" ? "филм" : type === "series" ? "сериал" : type;

  const handleRowClick = (item: MovieSeriesRecommendation) =>
    setSelectedItem(item);

  return (
    <Fragment>
      <RecommendationCardAlert
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        setBookmarkedMovies={setBookmarkedMovies}
        setCurrentBookmarkStatus={setCurrentBookmarkStatus}
        setAlertVisible={setAlertVisible}
        bookmarkedMovies={bookmarkedMovies}
      />
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card sm:h-[27.75rem]">
          <div className="box-header justify-between">
            <div
              className={`box-title whitespace-nowrap overflow-hidden text-ellipsis goodTiming ${
                is1399 ? "max-w-full" : "max-w-[20rem]"
              }`}
              data-tooltip-id="box-title-tooltip"
              data-tooltip-content={
                type == "watchlist"
                  ? "Списък За Гледане"
                  : sortBy === "default"
                  ? "Най-Често Препоръчваните Филми и Сериали За Мен"
                  : sortTitles[sortBy]
              }
            >
              {type == "watchlist"
                ? "Списък За Гледане"
                : sortBy === "default"
                ? "Най-Често Препоръчваните Филми и Сериали За Мен"
                : sortTitles[sortBy]}
            </div>
            <Tooltip id="box-title-tooltip" />
            <div className="relative flex items-center space-x-2">
              <div className="hs-dropdown ti-dropdown">
                <Link
                  to="#"
                  className={`flex items-center goodTiming ${
                    is1557
                      ? "px-2.5 py-1 text-[0.75rem]"
                      : "px-3 py-1 text-[0.85rem]"
                  } font-medium text-primary border border-primary rounded-sm hover:bg-primary/10 transition-all`}
                  onClick={toggleSortMenu}
                  aria-expanded={isSortMenuOpen ? "true" : "false"}
                >
                  <span className={`${sortBy === "default" ? "" : "hidden"}`}>
                    Сортирай по
                  </span>
                  <span
                    className={`${
                      sortBy === "default" ? "hidden" : ""
                    } text-sm`}
                  >
                    {sortOptions.find((option) => option.value === sortBy)
                      ?.label || "Сортирай по"}
                  </span>
                  <i
                    className={`ri-arrow-${
                      isSortMenuOpen ? "up" : "down"
                    }-s-line ${!is1557 && "ml-1"} text-base`}
                  ></i>
                </Link>
                <ul
                  className={`hs-dropdown-menu ti-dropdown-menu ${
                    isSortMenuOpen ? "block" : "hidden"
                  }`}
                  role="menu"
                >
                  {sortOptions.map(({ label, value }) => (
                    <li key={value}>
                      <Link
                        onClick={() =>
                          handleSortOptionSelect(
                            value as keyof MovieSeriesRecommendation
                          )
                        }
                        className={`ti-dropdown-item ${
                          sortBy === value ? "active" : ""
                        } goodTiming`}
                        to="#"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="px-3 py-1.5 text-[0.85rem] bg-primary text-white border border-primary rounded-sm text-base font-medium hover:bg-primary/10 transition-all flex items-center justify-center"
                onClick={() => {
                  if (sortBy === "default") {
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                    setSortBy("prosperityScore");
                  } else {
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }
                }}
              >
                {sortOrder === "asc" ? (
                  <i className="bx bx-sort-up text-lg"></i>
                ) : (
                  <i className="bx bx-sort-down text-lg"></i>
                )}
              </button>
            </div>
          </div>
          <div className="box-body">
            <div className="overflow-x-auto">
              <table className="table min-w-full whitespace-nowrap table-hover border table-bordered no-hover-text">
                <thead>
                  <tr className="border border-inherit border-solid dark:border-defaultborder/10 goodTiming dark:bg-black/40 bg-gray-500/15">
                    <th>#</th>
                    <th>Заглавие</th>
                    <th>Тип</th>
                    {type === "recommendations" && <th>Брой Препоръки</th>}
                    <th>Просперитет</th>
                    <th>Боксофис</th>
                    <th>Оскар Победи</th>
                    <th>Оскар Номинации</th>
                    <th>Общо Победи</th>
                    <th>Общо Номинации</th>
                    <th>IMDb Рейтинг</th>
                    <th>Metascore</th>
                  </tr>
                </thead>
                <tbody className="no-hover-text">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className="border border-inherit border-solid hover:bg-primary/70 dark:border-defaultborder/10 dark:hover:bg-primary/50 cursor-pointer hover:text-white"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="goodTiming dark:bg-black/40 bg-gray-500/15">
                        {(currentTablePage - 1) * itemsPerTablePage + index + 1}
                      </td>
                      <td>{item.title_bg}</td>
                      <td>{getTranslatedType(item.type)}</td>
                      {type == "recommendations" &&
                        "recommendations" in item && (
                          <td>{item.recommendations}</td>
                        )}
                      <td>{item.prosperityScore}</td>
                      <td>{item.boxOffice}</td>
                      <td>{item.oscar_wins}</td>
                      <td>{item.oscar_nominations}</td>
                      <td>{item.total_wins}</td>
                      <td>{item.total_nominations}</td>
                      <td>{item.imdbRating}</td>
                      <td>{item.metascore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="box-footer">
            <Pagination
              currentPage={currentTablePage}
              totalItems={totalItems}
              itemsPerPage={itemsPerTablePage}
              totalTablePages={totalTablePages}
              isSmallScreen={is1557}
              handlePrevPage={handlePrevTablePage}
              handleNextPage={handleNextTablePage}
              setCurrentPage={setCurrentTablePage}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesAndSeriesRecommendationsTable;
