import { FC, Fragment } from "react";
import { TopGenres } from "../moviesSeriesIndividualStats-types";
import { Categorybar } from "./Charts";

interface GenresBarChartProps {
  data: TopGenres;
  type: "recommendations" | "watchlist";
}

const GenresBarChart: FC<GenresBarChartProps> = ({ data, type }) => {
  return (
    <Fragment>
      <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
        <div className="box custom-card h-[27.75rem]">
          <div className="box-header justify-between">
            <div className="box-title goodTiming">
              {type == "recommendations"
                ? "Моите Топ Препоръчвани Жанрове"
                : "Моите Топ Запазвани Жанрове"}
            </div>
          </div>
          <div className="box-body">
            <Categorybar data={data} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GenresBarChart;
