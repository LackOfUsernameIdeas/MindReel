import { FC, Fragment, useEffect, useState, useMemo } from "react";
import {
  Category,
  DataType,
  FilteredTableData
} from "../moviesSeriesIndividualStats-types";
import { filterTableData } from "../helper_functions";
import {
  isActor,
  isDirector,
  isWriter
} from "../../../helper_functions_common";
import { useMediaQuery } from "react-responsive";
import { tableCategoryDisplayNames } from "../moviesSeriesIndividualStats-data";
import { Tooltip } from "react-tooltip";
import Pagination from "../../../../components/common/pagination/pagination";

interface ActorsDirectorsWritersTableProps {
  data: DataType;
  type: "recommendations" | "watchlist";
}

const ActorsDirectorsWritersTable: FC<ActorsDirectorsWritersTableProps> = ({
  data,
  type
}) => {
  const [recommendationCountSortCategory, setRecommendationCountSortCategory] =
    useState<Category>("Directors");
  const [sortType, setSortType] = useState<"recommendations" | "watchlist">(
    type === "recommendations" ? "recommendations" : "watchlist" // Default sortType based on prop type
  );

  const [filteredTableData, setFilteredTableData] = useState<FilteredTableData>(
    []
  );
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5;

  const totalItems = filteredTableData.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  useEffect(() => {
    const initialFilteredData =
      data[
        `sorted${recommendationCountSortCategory}By${
          sortType === "recommendations" ? "RecommendationCount" : "SavedCount"
        }`
      ];
    setFilteredTableData(initialFilteredData);
  }, [data, recommendationCountSortCategory, sortType]);

  const memoizedFilteredData = useMemo(
    () =>
      filterTableData(
        filteredTableData,
        recommendationCountSortCategory,
        currentTablePage,
        itemsPerTablePage
      ),
    [filteredTableData, recommendationCountSortCategory, currentTablePage]
  );

  const handleCategoryChange = (category: Category) => {
    setFilteredTableData(
      data[
        `sorted${category}By${
          sortType === "recommendations" ? "RecommendationCount" : "SavedCount"
        }`
      ]
    );
    setRecommendationCountSortCategory(category);
  };

  const handlePrevTablePage = () => {
    if (currentTablePage > 1) {
      setCurrentTablePage((prev) => prev - 1);
    }
  };

  const handleNextTablePage = () => {
    if (currentTablePage < totalTablePages) {
      setCurrentTablePage((prev) => prev + 1);
    }
  };

  const getCategoryName = (item: FilteredTableData[number]) => {
    if (isDirector(item)) return item.director_bg;
    if (isActor(item)) return item.actor_bg;
    if (isWriter(item)) return item.writer_bg;
    return "";
  };

  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });
  const is1399 = useMediaQuery({ query: "(max-width: 1399px)" });
  const is1630 = useMediaQuery({ query: "(max-width: 1630px)" });

  return (
    <Fragment>
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card sm:h-[27.75rem]">
          <div className="box-header justify-between">
            <div
              className={`box-title whitespace-nowrap overflow-hidden text-ellipsis opsilion ${
                is1399 ? "max-w-full" : is1630 ? "max-w-[15rem]" : "max-w-full"
              }`}
              data-tooltip-id="box-title-tooltip"
              data-tooltip-content={`Топ ${
                tableCategoryDisplayNames[
                  recommendationCountSortCategory as keyof typeof tableCategoryDisplayNames
                ]
              } ${
                type === "recommendations"
                  ? "по Брой  Препоръки"
                  : "в Списък За Гледане"
              }`}
            >
              Топ{" "}
              {
                tableCategoryDisplayNames[
                  recommendationCountSortCategory as keyof typeof tableCategoryDisplayNames
                ]
              }{" "}
              {type === "recommendations"
                ? "по Брой  Препоръки"
                : "в Списък За Гледане"}
            </div>
            <Tooltip id="box-title-tooltip" />
            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex rounded-md shadow-sm opsilion"
                role="group"
                aria-label="Sort By"
              >
                {["Directors", "Actors", "Writers"].map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 opsilion ${
                      category === recommendationCountSortCategory
                        ? "ti-btn-primary-full text-white"
                        : "text-primary dark:text-primary bg-secondary/40 dark:bg-secondary/20"
                    } ${
                      index === 0
                        ? "rounded-l-md"
                        : index === 2
                        ? "rounded-r-md"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange(category as Category)}
                  >
                    {
                      tableCategoryDisplayNames[
                        category as keyof typeof tableCategoryDisplayNames
                      ]
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="box-body">
            <div className="overflow-x-auto">
              <table
                key={recommendationCountSortCategory}
                className="table min-w-full whitespace-nowrap table-hover border table-bordered"
              >
                <thead>
                  <tr className="border border-inherit border-solid dark:border-defaultborder/10 opsilion dark:bg-black/40 bg-gray-500/15">
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] w-[40px]"
                    >
                      #
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      {
                        tableCategoryDisplayNames[
                          recommendationCountSortCategory as keyof typeof tableCategoryDisplayNames
                        ]
                      }
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      Брой{" "}
                      {type === "recommendations" ? "Препоръки" : "Запазвания"}
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      Просперитетен рейтинг
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      Среден IMDb рейтинг
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      Среден Rotten Tomatoes рейтинг
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      Среден Метаскор
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      Брой филми и сериали в платформата
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      Боксофис
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      Победи на награждавания
                    </th>
                    <th scope="col" className="!text-start !text-[0.85rem]">
                      Номинации за награди
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memoizedFilteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="border border-inherit border-solid hover:bg-gray-100 dark:border-defaultborder/10 dark:hover:bg-light"
                    >
                      <td className="opsilion dark:bg-black/40 bg-gray-500/15">
                        {(currentTablePage - 1) * 5 + index + 1}
                      </td>
                      <td>{getCategoryName(item)}</td>
                      <td>
                        {type === "recommendations"
                          ? item.recommendations_count
                          : item.saved_count}
                      </td>
                      <td>{item.prosperityScore}</td>
                      <td>{item.avg_imdb_rating}</td>
                      <td>{item.avg_rotten_tomatoes}</td>
                      <td>{item.avg_metascore}</td>
                      <td>{item.movie_series_count}</td>
                      <td>{item.total_box_office}</td>
                      <td>{item.total_wins}</td>
                      <td>{item.total_nominations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={`box-footer`}>
            <Pagination
              currentPage={currentTablePage}
              totalItems={totalItems}
              itemsPerPage={itemsPerTablePage}
              totalTablePages={totalTablePages}
              isSmallScreen={is1546}
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

export default ActorsDirectorsWritersTable;
