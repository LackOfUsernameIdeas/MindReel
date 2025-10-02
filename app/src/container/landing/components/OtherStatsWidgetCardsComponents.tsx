import { FC, Fragment, useEffect, useState } from "react";
import { DataType } from "../landing-types";
import { handleDropdownClick } from "../helper_functions";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import {
  averagesInfo,
  awardsInfo,
  getAveragesOptions,
  getAwardOptions
} from "../landing-data";
import Infobox from "@/components/common/infobox/infobox";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";

// Дефиниране на типа за пропсвете, предавани на този компонент
interface WidgetCardsComponentProps {
  data: DataType;
}

// Основен функционален компонент
const WidgetCardsComponent: FC<WidgetCardsComponentProps> = ({ data }) => {
  // Състояния за управление на показваните имена и стойности за средни и награди
  const [displayedNameAverages, setDisplayedNameAverages] =
    useState("Среден Боксофис"); // По подразбиране име за показване на средни
  const [displayedValueAverages, setDisplayedValueAverages] =
    useState<number>(0); // По подразбиране стойност за средни

  const [displayedNameAwards, setDisplayedNameAwards] = useState(
    "Общ брой спечелени награди"
  ); // По подразбиране име за показване на награди
  const [displayedValueAwards, setDisplayedValueAwards] = useState<number>(0); // По подразбиране стойност за награди

  // Състояния за управление на отворените падащи менюта
  const [isAveragesMenuOpen, setIsAveragesMenuOpen] = useState(false);
  const [isAwardsMenuOpen, setIsAwardsMenuOpen] = useState(false);

  // Състояния за управление на отворените информационни полета
  const [isAveragesModalOpen, setIsAveragesModalOpen] =
    useState<boolean>(false);
  const [isAwardsModalOpen, setIsAwardsModalOpen] = useState<boolean>(false);

  // Ефект за инициализиране на показваните стойности от данните
  useEffect(() => {
    if (
      data.totalAwards.length > 0 && //  Подсигурява данните за наградите
      data.averageBoxOfficeAndScores.length > 0 // Подсигурява данните за средните стойности
    ) {
      setDisplayedValueAwards(data.totalAwards[0].total_awards_wins);
      // Задайте началната стойност за наградите
      setDisplayedValueAverages(
        data.averageBoxOfficeAndScores[0].average_box_office
      );
      // Задайте началната стойност за средните
    }
  }, [data]); // Масив на зависимости, който осигурява изпълнението при промяна на `data`

  // Превключва падащото меню за наградите
  const toggleAwardsMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Предотвратете стандартното поведение на линка
    setIsAwardsMenuOpen((prev) => !prev); // Превключете състоянието
  };

  // Превключва падащото меню за средните статистики
  const toggleAveragesMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Предотвратете стандартното поведение на линка
    setIsAveragesMenuOpen((prev) => !prev); // Превключете състоянието
  };

  // Превключва информационното поле за средните статистики
  const handleAveragesInfoButtonClick = () => {
    setIsAveragesModalOpen((prev) => !prev);
  };

  // Превключва информационното поле за наградите
  const handleAwardsInfoButtonClick = () => {
    setIsAwardsModalOpen((prev) => !prev);
  };

  // Генерира опции за падащото меню за наградите
  const awardOptions = getAwardOptions(data);
  // Генерира опции за падащото меню за средните
  const averagesOptions = getAveragesOptions(data);

  // Медийни заявки за отзивчив дизайн
  const is1856 = useMediaQuery({ query: "(max-width: 1856px)" });
  const is1532 = useMediaQuery({ query: "(max-width: 1532px)" });
  const is1966 = useMediaQuery({ query: "(max-width: 1966px)" });

  return (
    <Fragment>
      {/* Карта 1: Общ брой потребители */}
      <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
        <div className="landing-box custom-box">
          <div className="box-body h-[5.5rem]">
            <div className="flex items-center justify-between">
              {/* Лява секция, показваща общия брой потребители */}
              <div className="flex-grow">
                <p
                  className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                    is1856 && "text-xs"
                  } goodTiming`}
                >
                  Общ брой потребители {/* "Total Users" label */}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-[${is1856 ? "1.25rem" : "1.125rem"}]`}>
                    {data.usersCount?.[0]?.user_count || 0}{" "}
                    {/* Показва общия брой потребители или 0 */}
                  </span>
                </div>
              </div>
              {/* Дясна секция, показваща икона */}
              <div>
                <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                  <i
                    className={`bi bi-person text-primary text-[${
                      is1856 ? "1rem" : "0.875rem"
                    }]`}
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Карта 2: Най-препоръчван жанр */}
      <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
        <div className="landing-box custom-box">
          <div className="box-body h-[5.5rem]">
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <p
                  className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                    is1856 && "text-xs"
                  } goodTiming`}
                >
                  Най-препоръчван жанр {/* "Top Recommended Genre" label */}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-[${is1856 ? "1.25rem" : "1.125rem"}]`}>
                    {data.topGenres[0]?.genre_bg}{" "}
                    {/* Показва най-препоръчвания жанр на български */}
                  </span>
                </div>
              </div>
              <div>
                <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                  <i
                    className={`bi bi-film text-primary text-[${
                      is1856 ? "1rem" : "0.875rem"
                    }]`}
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Карта 3: Среден боксофис */}
      <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
        <div className="landing-box custom-box">
          <div className="box-body h-[5.5rem]">
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <div className="flex flex-wrap items-start">
                  <div
                    className={`flex items-center space-x-${is1856 ? 2 : 1}`}
                  >
                    <p
                      className={`mb-0 text-[#8c9097] dark:text-white/50 truncate overflow-hidden max-w-[130px] whitespace-nowrap text-xs goodTiming`}
                    >
                      {displayedNameAverages}
                    </p>
                    <div className="hs-dropdown ti-dropdown">
                      <Link
                        to="#"
                        className={`flex items-center ${
                          is1856
                            ? "px-1 py-0.5 text-[0.70rem]"
                            : "px-0.5 py-0.25 text-[0.70rem]"
                        } font-medium text-primary border border-primary rounded-sm hover:bg-primary/10 transition-all max-h-[1.125rem]`}
                        onClick={toggleAveragesMenu}
                        aria-expanded={isAveragesMenuOpen ? "true" : "false"}
                      >
                        <i
                          className={`ri-arrow-${
                            isAveragesMenuOpen ? "up" : "down"
                          }-s-line text-sm`}
                        ></i>
                      </Link>
                      <ul
                        className={`hs-dropdown-menu ti-dropdown-menu ${
                          isAveragesMenuOpen ? "block" : "hidden"
                        }`}
                        role="menu"
                      >
                        {averagesOptions.map(({ label, value }) => (
                          <li key={label}>
                            <Link
                              onClick={() =>
                                handleDropdownClick(
                                  setDisplayedNameAverages,
                                  setDisplayedValueAverages,
                                  label,
                                  value
                                )
                              }
                              className={`ti-dropdown-item ${
                                displayedNameAverages === label ? "active" : ""
                              } ${
                                displayedNameAverages === label
                                  ? "disabled"
                                  : ""
                              }`}
                              to="#"
                            >
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <span className={`text-[${is1856 ? "1.25rem" : "1.125rem"}]`}>
                    <div className="flex flex-wrap">
                      {displayedValueAverages}
                    </div>
                  </span>
                  <Infobox
                    onClick={handleAveragesInfoButtonClick}
                    width={17}
                    height={17}
                  />
                  <InfoboxModal
                    onClick={handleAveragesInfoButtonClick}
                    isModalOpen={isAveragesModalOpen}
                    title={
                      <>
                        <span>{`Избрана статистика: `}</span>
                        <span className="underline">
                          {displayedNameAverages}
                        </span>
                      </>
                    }
                    description={
                      (averagesInfo as { [key: string]: string })[
                        displayedNameAverages
                      ]
                    }
                  />
                </div>
              </div>
              <div>
                <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                  <i
                    className={`bi bi-${
                      displayedNameAverages == "Среден Боксофис"
                        ? "ticket-perforated"
                        : "bi bi-clipboard-data"
                    } text-[${is1856 ? "1rem" : "0.875rem"}] text-primary`}
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Карта 4: Награди */}
      <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
        <div className="landing-box custom-box">
          <div className="box-body h-[5.5rem]">
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <div className={`flex items-center space-x-${is1966 ? 2 : 1}`}>
                  <p
                    className={`mb-0 text-[#8c9097] dark:text-white/50 truncate overflow-hidden max-w-[130px] whitespace-nowrap text-xs text-ellipsis goodTiming`}
                  >
                    {displayedNameAwards}
                  </p>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      to="#"
                      className={`flex items-center ${
                        is1856
                          ? "px-1 py-0.5 text-[0.70rem]"
                          : "px-0.5 py-0.25 text-[0.70rem]"
                      } font-medium text-primary border border-primary rounded-sm hover:bg-primary/10 transition-all max-h-[1.125rem]`}
                      onClick={toggleAwardsMenu}
                      aria-expanded={isAwardsMenuOpen ? "true" : "false"}
                    >
                      <i
                        className={`ri-arrow-${
                          isAwardsMenuOpen ? "up" : "down"
                        }-s-line text-sm`}
                      ></i>
                    </Link>
                    <ul
                      className={`hs-dropdown-menu ti-dropdown-menu ${
                        isAwardsMenuOpen ? "block" : "hidden"
                      } z-50`}
                      role="menu"
                    >
                      {awardOptions.map(({ label, value }) => (
                        <li key={label}>
                          <Link
                            onClick={() =>
                              handleDropdownClick(
                                setDisplayedNameAwards,
                                setDisplayedValueAwards,
                                label,
                                value
                              )
                            }
                            className={`ti-dropdown-item ${
                              displayedNameAwards === label ? "active" : ""
                            } ${
                              displayedNameAwards === label ? "disabled" : ""
                            }`}
                            to="#"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <span className={`text-[${is1966 ? "1.25rem" : "1.125rem"}]`}>
                    {displayedValueAwards}
                  </span>
                  <Infobox
                    onClick={handleAwardsInfoButtonClick}
                    width={17}
                    height={17}
                  />
                  <InfoboxModal
                    onClick={handleAwardsInfoButtonClick}
                    isModalOpen={isAwardsModalOpen}
                    title={
                      <>
                        <span>{`Избрана статистика: `}</span>
                        <span className="underline">{displayedNameAwards}</span>
                      </>
                    }
                    description={
                      (awardsInfo as { [key: string]: string })[
                        displayedNameAwards
                      ]
                    }
                  />
                </div>
              </div>
              <div>
                <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                  <i
                    className={`bi bi-trophy text-[${
                      is1966 ? "1rem" : "0.875rem"
                    }] text-primary`}
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WidgetCardsComponent;
