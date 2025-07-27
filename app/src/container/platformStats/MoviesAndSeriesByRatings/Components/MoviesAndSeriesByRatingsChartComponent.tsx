import { FC, Fragment, useMemo, useState } from "react";
import { MoviesAndSeriesByRatingsChart } from "../../Charts";
import { MoviesAndSeriesByRatingsDataType } from "../../platformStats-types";
import { handleMoviesAndSeriesSortCategory } from "../../helper_functions";
import { moviesAndSeriesCategoryDisplayNames } from "../../platformStats-data";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

interface MoviesAndSeriesByRatingsComponentProps {
  data: MoviesAndSeriesByRatingsDataType;
}

const MoviesAndSeriesByRatingsComponent: FC<
  MoviesAndSeriesByRatingsComponentProps
> = ({ data }) => {
  const [moviesAndSeriesSortCategory, setMoviesAndSeriesSortCategory] =
    useState("IMDb"); // Категория за сортиране (IMDb, Metascore, RottenTomatoes)

  // Меморизиране на данните за сериите за графиката на филмите
  const seriesDataForMoviesAndSeriesByRatingsChart = useMemo(() => {
    return moviesAndSeriesSortCategory === "IMDb"
      ? data.sortedMoviesAndSeriesByIMDbRating
      : moviesAndSeriesSortCategory === "Metascore"
      ? data.sortedMoviesAndSeriesByMetascore
      : data.sortedMoviesAndSeriesByRottenTomatoesRating;
  }, [moviesAndSeriesSortCategory, data]);

  return (
    <Fragment>
      <div className="xl:col-span-6 col-span-12">
        <div className="flex flex-col md:flex-row gap-8 box p-6 rounded-lg shadow-lg dark:text-gray-300 text-[#333335] justify-center items-stretch">
          {/* Лява част */}
          <Card className="bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed md:w-1/2 mx-auto flex-grow flex items-center justify-center">
            <h2 className="text-lg text-defaulttextcolor dark:text-white/80">
              В тази страница можете да видите класация на филмите и сериалите
              по техния{" "}
              <span className="font-bold text-primary">
                IMDb, Rotten Tomatoes или Метаскор рейтинг
              </span>
              !
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

              {/* Rotten tomatoes */}
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
            </Accordion>
          </div>
        </div>
        <div className="box custom-box">
          <div className="custom-box-header justify-between">
            <div className={`box-title opsilion`}>
              {`Топ 10 филми и сериали по ${
                moviesAndSeriesCategoryDisplayNames[
                  moviesAndSeriesSortCategory as keyof typeof moviesAndSeriesCategoryDisplayNames
                ]
              }`}
            </div>
            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex rounded-md shadow-sm"
                role="group"
                aria-label="Sort By"
              >
                {["IMDb", "Metascore", "RottenTomatoes"].map(
                  (category, index) => (
                    <button
                      key={category}
                      type="button"
                      className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 opsilion ${
                        category === moviesAndSeriesSortCategory
                          ? "ti-btn-primary-full text-white"
                          : "text-primary dark:text-primary bg-secondary/40 dark:bg-secondary/20"
                      } ${
                        index === 0
                          ? "rounded-l-md"
                          : index === 2
                          ? "rounded-r-md"
                          : ""
                      }`}
                      onClick={() =>
                        handleMoviesAndSeriesSortCategory(
                          category,
                          setMoviesAndSeriesSortCategory
                        )
                      }
                    >
                      {
                        moviesAndSeriesCategoryDisplayNames[
                          category as keyof typeof moviesAndSeriesCategoryDisplayNames
                        ]
                      }
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="box-body h-[21.75rem] mb-5">
            <div id="bar-basic">
              <MoviesAndSeriesByRatingsChart
                seriesData={seriesDataForMoviesAndSeriesByRatingsChart}
                category={moviesAndSeriesSortCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesAndSeriesByRatingsComponent;
