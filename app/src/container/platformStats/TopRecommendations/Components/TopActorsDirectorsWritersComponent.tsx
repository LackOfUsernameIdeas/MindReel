import { FC, Fragment, useState } from "react";
import {
  Category,
  TopRecommendationsDataType
} from "../../platformStats-types";
import { handleTopStatsSortCategory } from "../../helper_functions";
import { Treemap } from "../../Charts";
interface TopActorsDirectorsWritersComponentProps {
  data: TopRecommendationsDataType;
}

const TopActorsDirectorsWritersComponent: FC<
  TopActorsDirectorsWritersComponentProps
> = ({ data }) => {
  const [topStatsSortCategory, setTopStatsSortCategory] =
    useState<Category>("Actors");

  const tableCategoryDisplayNames: Record<Category, string> = {
    Directors: "Режисьори",
    Actors: "Актьори",
    Writers: "Сценаристи"
  };

  const getTreemapDataToUse = () => {
    switch (topStatsSortCategory) {
      case "Actors":
        return data.topActors;
      case "Directors":
        return data.topDirectors;
      case "Writers":
        return data.topWriters;
      default:
        return [];
    }
  };

  return (
    <Fragment>
      <div className="xl:col-span-6 col-span-12">
        <div className="box custom-box">
          <div className="box-header justify-between">
            <div className="box-title opsilion">
              Топ 10 най-препоръчвани{" "}
              {
                tableCategoryDisplayNames[
                  topStatsSortCategory as keyof typeof tableCategoryDisplayNames
                ]
              }
            </div>
            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex rounded-md shadow-sm"
                role="group"
                aria-label="Sort By"
              >
                {(["Actors", "Directors", "Writers"] as Category[]).map(
                  (category, index) => (
                    <button
                      key={category}
                      type="button"
                      className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 opsilion ${
                        category === topStatsSortCategory
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
                        handleTopStatsSortCategory(
                          category,
                          setTopStatsSortCategory
                        )
                      }
                    >
                      {
                        tableCategoryDisplayNames[
                          category as keyof typeof tableCategoryDisplayNames
                        ]
                      }
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="box-body flex justify-center items-center">
            <div id="treemap-basic" className="w-full">
              <Treemap
                data={getTreemapDataToUse()}
                role={topStatsSortCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TopActorsDirectorsWritersComponent;
