import { FC, Fragment, useEffect, useState, useMemo } from "react";
import {
  Category,
  ActorsDirectorsWritersTableDataType,
  FilteredTableData
} from "../../platformStats-types";
import { filterTableData } from "../../helper_functions";
import {
  isActor,
  isDirector,
  isWriter
} from "../../../helper_functions_common";
import { useMediaQuery } from "react-responsive";
import { tableCategoryDisplayNames } from "../../platformStats-data";
import Pagination from "../../../../components/common/pagination/pagination";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

interface ActorsDirectorsWritersTableComponentProps {
  data: ActorsDirectorsWritersTableDataType;
}

const ActorsDirectorsWritersTableComponent: FC<
  ActorsDirectorsWritersTableComponentProps
> = ({ data }) => {
  const [prosperitySortCategory, setProsperitySortCategory] =
    useState<Category>("Directors");

  const [filteredTableData, setFilteredTableData] = useState<FilteredTableData>(
    []
  );
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5;

  const totalItems = filteredTableData.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  // Следи за промени в `data` и актуализира филтрираните данни в таблицата съответно
  useEffect(() => {
    const initialFilteredData =
      data[`sorted${prosperitySortCategory}ByProsperity`];
    setFilteredTableData(initialFilteredData);
  }, [data, prosperitySortCategory]);

  // Използва useMemo за запаметяване на изчисляването на филтрираните данни
  const memoizedFilteredData = useMemo(
    () =>
      filterTableData(
        filteredTableData,
        prosperitySortCategory,
        currentTablePage,
        itemsPerTablePage
      ),
    [filteredTableData, prosperitySortCategory, currentTablePage]
  );

  const handleCategoryChange = (category: Category) => {
    // Превключва филтрираните данни в зависимост от избраната категория
    setFilteredTableData(data[`sorted${category}ByProsperity`]);
    setProsperitySortCategory(category);
  };

  // Обработка на логиката за предишна страница
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

  return (
    <Fragment>
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="flex flex-col md:flex-row gap-8 box p-6 rounded-lg shadow-lg dark:text-gray-300 text-[#333335] justify-center items-stretch">
          {/* Лява част */}
          <Card className="bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed md:w-1/2 mx-auto flex items-center justify-center">
            <h2 className="text-sm text-defaulttextcolor dark:text-white/80">
              Тук може да видите класация на режисьори, актьори и сценаристи
              според техния{" "}
              <span className="font-bold text-primary">
                просперитетен рейтинг
              </span>
              . Всеки от тях е оценен на база няколко критерия:
              <ul className="text-left coollist pl-7 pt-5">
                <li>
                  Среден{" "}
                  <span className="font-bold text-primary">IMDb рейтинг</span>{" "}
                  на филмите
                </li>
                <li>
                  Среден{" "}
                  <span className="font-bold text-primary">
                    Rotten Tomatoes рейтинг
                  </span>
                </li>
                <li>
                  Среден{" "}
                  <span className="font-bold text-primary">Metascore</span>
                </li>
                <li>
                  Общо приходи от{" "}
                  <span className="font-bold text-primary">боксофиса</span>
                </li>
                <li>
                  <span className="font-bold text-primary">Брой</span> филми,
                  препоръчвани в платформата
                </li>
                <li>
                  <span className="font-bold text-primary">Брой</span> пъти, в
                  които са препоръчвани техни филми
                </li>
                <li>
                  Спечелени{" "}
                  <span className="font-bold text-primary">награди</span>
                </li>
                <li>
                  <span className="font-bold text-primary">Номинации</span> за
                  награди
                </li>
              </ul>
            </h2>
          </Card>

          {/* Дясна част*/}
          <div className="md:w-1/2 text-sm]">
            <Accordion type="single" collapsible className="space-y-4">
              {/* IMDb */}
              <AccordionItem value="imdb">
                <AccordionTrigger className="opsilion">
                  🎬 IMDb рейтинг
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  Средна оценка, която даден филм получава от потребителите на
                  <span className="font-semibold"> IMDb</span>. Оценките варират
                  от <span className="font-semibold">1 до 10</span> и отразяват
                  популярността и качеството на филма.
                </AccordionContent>
              </AccordionItem>

              {/* Rotten tomatoes */}
              <AccordionItem value="rotten">
                <AccordionTrigger className="opsilion">
                  🍅 Среден Rotten Tomatoes рейтинг
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  <span className="font-semibold">Rotten Tomatoes</span> е
                  платформа, показваща процента на положителните рецензии от
                  критици <span className="font-semibold"> (Tomatometer)</span>{" "}
                  - това е процентът, който виждате като рейтинг, или от зрители
                  <span className="font-semibold"> (Audience Score)</span>.
                  Средният рейтинг е различна метрика – той представлява
                  средната оценка{" "}
                  <span className="font-semibold">(от 0 до 10)</span> на всички
                  на всички рецензии, което дава представа не само за това колко
                  хора са харесали даден филм, но и колко силно са го харесали.
                </AccordionContent>
              </AccordionItem>

              {/* Metascore */}
              <AccordionItem value="metascore">
                <AccordionTrigger className="opsilion">
                  💡 Среден Metascore рейтинг
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  <span className="font-semibold">Metascore</span> е оценка от
                  платформата <span className="font-semibold">Metacritic</span>,
                  която събира рецензии от критици и ги преобразува в обща
                  числова стойност{" "}
                  <span className="font-semibold">(от 0 до 100)</span>.{" "}
                  <span className="font-semibold">
                    Средният Metascore рейтинг
                  </span>{" "}
                  е усреднената стойност на тези оценки за даден/и филм/и.
                </AccordionContent>
              </AccordionItem>

              {/*Боксофис*/}
              <AccordionItem value="boxoffice">
                <AccordionTrigger className="opsilion">
                  💰 Боксофис
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  Общата сума на приходите от продажба на билети в киносалоните.
                  Измерва се в{" "}
                  <span className="font-semibold">
                    милиони или милиарди долари
                  </span>{" "}
                  и е ключов показател за търговския успех на филма.
                </AccordionContent>
              </AccordionItem>

              {/* Просперитет */}
              <AccordionItem value="prosperity">
                <AccordionTrigger className="opsilion">
                  🎉 Просперитетен рейтинг
                </AccordionTrigger>
                <AccordionContent className="px-5 py-3 space-y-3">
                  <p>
                    <strong className="text-lg">Просперитетът </strong>
                    се получава като се изчисли сборът на стойностите на няколко
                    критерии. За всеки критерий се задава определено процентно
                    отношение, което отразява неговата важност спрямо
                    останалите:
                  </p>
                  <ul className="list-disc coollist pl-6 pt-3 space-y-1">
                    <li>
                      <strong>30%</strong> за спечелени награди
                    </li>
                    <li>
                      <strong>25%</strong> за номинации
                    </li>
                    <li>
                      <strong>15%</strong> за приходите от боксофис
                    </li>
                    <li>
                      <strong>10%</strong> за Метаскор
                    </li>
                    <li>
                      <strong>10%</strong> за IMDb рейтинг
                    </li>
                    <li>
                      <strong>10%</strong> за Rotten Tomatoes рейтинг
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="box custom-card h-[27.75rem]">
          <div className="box-header justify-between">
            <div className="box-title opsilion">
              {
                tableCategoryDisplayNames[
                  prosperitySortCategory as keyof typeof tableCategoryDisplayNames
                ]
              }{" "}
              по Просперитет
            </div>
            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex rounded-md shadow-sm"
                role="group"
                aria-label="Sort By"
              >
                {["Directors", "Actors", "Writers"].map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 opsilion ${
                      category === prosperitySortCategory
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
                key={prosperitySortCategory}
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
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
                      {
                        tableCategoryDisplayNames[
                          prosperitySortCategory as keyof typeof tableCategoryDisplayNames
                        ]
                      }
                    </th>
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
                      Просперитетен рейтинг
                    </th>
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
                      Среден IMDb рейтинг
                    </th>
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
                      Среден Rotten Tomatoes рейтинг
                    </th>
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
                      Среден Метаскор
                    </th>
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
                      Боксофис
                    </th>
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
                      Брой филми в платформата
                    </th>
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
                      Общо препоръки
                    </th>
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
                      Победи на награждавания
                    </th>
                    <th
                      scope="col"
                      className="!text-start !text-[0.85rem] opsilion"
                    >
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
                      <td>{item.prosperityScore}</td>
                      <td>{item.avg_imdb_rating}</td>
                      <td>{item.avg_rotten_tomatoes}</td>
                      <td>{item.avg_metascore}</td>
                      <td>{item.total_box_office}</td>
                      <td>{item.movie_count}</td>
                      <td>{item.total_recommendations}</td>
                      <td>{item.total_wins}</td>
                      <td>{item.total_nominations}</td>
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

export default ActorsDirectorsWritersTableComponent;
