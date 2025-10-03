import { FC, useState } from "react";
import { MetricChartsProps } from "../aiAnalysator-types";
import { AverageMetricsTrend } from "./Charts";
import { Card } from "@/components/ui/card";
import { InfoboxModal } from "@/components/common/infobox/InfoboxModal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

const MetricCharts: FC<MetricChartsProps> = ({
  historicalMetrics,
  historicalUserMetrics
}) => {
  // State за отваряне/затваряне на InfoBox
  const [isModalOpenGlobal, setIsModalOpenGlobal] = useState<boolean>(false);
  const [isModalOpenUser, setIsModalOpenUser] = useState<boolean>(false);
  console.log(historicalMetrics, historicalUserMetrics);
  const handleInfoButtonClickGlobal = () => {
    setIsModalOpenGlobal((prev) => !prev);
  };
  const handleInfoButtonClickUser = () => {
    setIsModalOpenUser((prev) => !prev);
  };
  return (
    <div>
      <div className="bg-bodybg p-6 rounded-xl shadow-lg space-y-4 my-4">
        {/* Title Card */}
        <Card className="flex flex-col items-center text-center gap-4 bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl goodTiming text-defaulttextcolor dark:text-white/80">
            Средни стойности на precision, recall и f1 score през времето
          </h2>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title 1 */}
          <Card className="flex flex-col items-center text-center gap-4 bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl mx-auto w-full sm:row-start-1 sm:col-start-1">
            <h2 className="text-xl sm:text-2xl goodTiming text-defaulttextcolor dark:text-white/80">
              За всички потребители:
            </h2>
          </Card>

          {/* Chart 1 */}
          <div className="bg-white dark:bg-bodybg2 dark:text-white/80 p-6 rounded-lg shadow-md sm:row-start-2 sm:col-start-1">
            <AverageMetricsTrend
              seriesData={historicalMetrics || []}
              onClick={handleInfoButtonClickGlobal}
            />
          </div>

          {/* Title 2 */}
          <Card className="flex flex-col items-center text-center gap-4 bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl mx-auto w-full sm:row-start-1 sm:col-start-2">
            <h2 className="text-xl sm:text-2xl goodTiming text-defaulttextcolor dark:text-white/80">
              За Вас индивидуално:
            </h2>
          </Card>

          {/* Chart 2 */}
          <div className="bg-white dark:bg-bodybg2 dark:text-white/80 p-6 rounded-lg shadow-md sm:row-start-2 sm:col-start-2">
            <AverageMetricsTrend
              seriesData={historicalUserMetrics || []}
              onClick={handleInfoButtonClickUser}
            />
          </div>
        </div>
      </div>

      <InfoboxModal
        onClick={handleInfoButtonClickGlobal}
        isModalOpen={isModalOpenGlobal}
        title="Средни Стойности за Цялата Платформа"
        description={
          <>
            <p className="mb-4">
              Схемата демонстрира промяната на
              <span className="font-semibold"> общия Precision</span>,
              <span className="font-semibold">
                {" "}
                Precision за последното генериране
              </span>
              ,<span className="font-semibold"> общ Recall </span>и
              <span className="font-semibold"> общ F1 Score </span>
              през времето на база данни от
              <span className="font-semibold"> ЦЯЛАТА ПЛАТФОРМА </span>
              до конкретна дата. При преминаване с курсора върху графиката се
              показват данни за съответната средна стойност до конкретната дата
              на оста X. Изчисленията се актуализират с всеки нов запис като
              новите данни се
              <span className="font-semibold"> добавят към </span>
              предходните. Това означава, че стойностите за дадена дата се
              определят, като се изчисли{" "}
              <span className="font-semibold">средната стойност</span> от
              конкретната дата и от предходните такива{" "}
              <span className="font-semibold">взети заедно</span>. Тези
              стойности се изчисляват поотделно, по следния начин:
            </p>
            <Accordion type="single" collapsible className="space-y-4">
              {/* Platform Precision */}
              <AccordionItem value="precision-platform">
                <AccordionTrigger className="goodTiming">
                  ✅ Общ Precision
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Измерва каква част от препоръките в платформата, са{" "}
                    <span className="font-semibold">наистина </span> релевантни.
                    Високата стойност на{" "}
                    <span className="font-semibold">Precision</span> означава,
                    че когато системата препоръчва нещо, то вероятно ще бъде
                    подходящо.
                  </p>
                  <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                    <div className="flex items-center space-x-2 justify-center items-center">
                      <span className="font-semibold whitespace-nowrap">
                        Precision =
                      </span>
                      <div className="text-center">
                        <p className="text-primary text-sm">
                          всички РЕЛЕВАНТНИ препоръки правени някога НА
                          ПОТРЕБИТЕЛЯ (TP)
                        </p>
                        <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                        <p className="text-secondary text-sm">
                          всички препоръки, които някога са правени НА
                          ПОТРЕБИТЕЛЯ (TP + FP)
                        </p>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              {/* Recall */}
              <AccordionItem value="recall">
                <AccordionTrigger className="goodTiming">
                  🔍 Recall
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Измерва каква част от всички препоръки, които са определени
                    като релевантни, са в действителност били препоръчани на
                    <span className="font-semibold"> ПОТРЕБИТЕЛЯ</span>.
                    Високата стойност на Recall означава, че системата{" "}
                    <span className="font-semibold">НЕ </span> пропуска{" "}
                    <span className="font-semibold">важни (релевантни) </span>{" "}
                    препоръки, дори ако включва някои нерелевантни.
                  </p>
                  <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                    <div className="flex items-center space-x-2 justify-center items-center">
                      <span className="font-semibold whitespace-nowrap">
                        Recall =
                      </span>
                      <div className="text-center">
                        <p className="text-primary text-sm">
                          всички РЕЛЕВАНТНИ препоръки правени някога НА
                          ПОТРЕБИТЕЛЯ (TP)
                        </p>
                        <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                        <p className="text-secondary text-sm">
                          всички препоръки, които са РЕЛЕВАНТНИ на
                          потребителските предпочитания, измежду тези в цялата
                          система (TP + FN)
                        </p>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              {/* F1 Score */}
              <AccordionItem value="f1-score">
                <AccordionTrigger className="goodTiming">
                  ⚖️ F1 Score
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    <span className="font-semibold">Балансиран показател</span>,
                    който комбинира стойностите на
                    <span className="font-semibold"> Precision</span> и
                    <span className="font-semibold"> Recall</span>, показвайки
                    колко добре системата намира точния баланс между тях.
                    Високият <span className="font-semibold">F1 Score </span>
                    означава, че системата има добро представяне както по
                    отношение на{" "}
                    <span className="font-semibold">
                      точността на препоръките
                    </span>
                    , така и на{" "}
                    <span className="font-semibold">
                      покритието, спрямо всички възможности
                    </span>
                    .
                  </p>
                  <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                    <div className="flex items-center space-x-2 justify-center items-center">
                      <span className="font-semibold whitespace-nowrap">
                        F1 Score =
                      </span>
                      <div className="text-center">
                        <p className="text-primary text-sm">
                          2 x Precision x Recall
                        </p>
                        <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                        <p className="text-secondary text-sm">
                          Precision + Recall
                        </p>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        }
      />
      <InfoboxModal
        onClick={handleInfoButtonClickUser}
        isModalOpen={isModalOpenUser}
        title="Средни Стойности за Вас"
        description={
          <>
            <p className="mb-4">
              Схемата демонстрира промяната на
              <span className="font-semibold"> общия Precision</span>,
              <span className="font-semibold">
                {" "}
                Precision за последното генериране
              </span>
              ,<span className="font-semibold"> общ Recall </span>и
              <span className="font-semibold"> общ F1 Score </span>
              през времето на база
              <span className="font-semibold"> ВАШИТЕ ДАННИ </span>, като
              потребител, до конкретна дата. При преминаване с курсора върху
              графиката се показват данни за съответната средна стойност до
              конкретната дата на оста X. Изчисленията се актуализират с всеки
              нов запис като новите данни се
              <span className="font-semibold"> добавят към </span>
              предходните. Това означава, че стойностите за дадена дата се
              определят, като се изчисли{" "}
              <span className="font-semibold">средната стойност</span> от
              конкретната дата и от предходните такива{" "}
              <span className="font-semibold">взети заедно</span>. Тези
              стойности се изчисляват поотделно, по следния начин:
            </p>
            <Accordion type="single" collapsible className="space-y-4">
              {/* Platform Precision */}
              <AccordionItem value="precision-platform">
                <AccordionTrigger className="goodTiming">
                  ✅ Общ Precision
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Измерва каква част от препоръките, които сте направили, са{" "}
                    <span className="font-semibold">наистина </span> релевантни.
                    Високата стойност на{" "}
                    <span className="font-semibold">Precision</span> означава,
                    че когато системата препоръчва нещо, то вероятно ще бъде
                    подходящо за Вас.
                  </p>
                  <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                    <div className="flex items-center space-x-2 justify-center items-center">
                      <span className="font-semibold whitespace-nowrap">
                        Precision =
                      </span>
                      <div className="text-center">
                        <p className="text-primary text-sm">
                          всички ваши РЕЛЕВАНТНИ препоръки правени някога (TP)
                        </p>
                        <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                        <p className="text-secondary text-sm">
                          всички ваши препоръки, които някога са правени (TP +
                          FP)
                        </p>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              {/* Recall */}
              <AccordionItem value="recall">
                <AccordionTrigger className="goodTiming">
                  🔍 Recall
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Измерва каква част от всички препоръки, които са определени
                    като релевантни, са били препоръчани на{" "}
                    <span className="font-semibold">ВАС</span>. Високата
                    стойност на Recall означава, че системата{" "}
                    <span className="font-semibold">НЕ </span> пропуска{" "}
                    <span className="font-semibold">важни (релевантни) </span>{" "}
                    препоръки, дори ако включва някои нерелевантни.
                  </p>
                  <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                    <div className="flex items-center space-x-2 justify-center items-center">
                      <span className="font-semibold whitespace-nowrap">
                        Recall =
                      </span>
                      <div className="text-center">
                        <p className="text-primary text-sm">
                          всички ваши РЕЛЕВАНТНИ препоръки правени някога (TP)
                        </p>
                        <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                        <p className="text-secondary text-sm">
                          всички препоръки, които са РЕЛЕВАНТНИ на ВАШИТЕ
                          предпочитания, измежду тези в цялата система (TP + FN)
                        </p>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              {/* F1 Score */}
              <AccordionItem value="f1-score">
                <AccordionTrigger className="goodTiming">
                  ⚖️ F1 Score
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    <span className="font-semibold">Балансиран показател</span>,
                    който комбинира стойностите на
                    <span className="font-semibold"> Precision</span> и
                    <span className="font-semibold"> Recall</span>, показвайки
                    колко добре системата намира точния баланс между тях.
                    Високият <span className="font-semibold">F1 Score </span>
                    означава, че системата има добро представяне както по
                    отношение на{" "}
                    <span className="font-semibold">
                      точността на препоръките
                    </span>
                    , така и на{" "}
                    <span className="font-semibold">
                      покритието, спрямо всички възможности
                    </span>
                    .
                  </p>
                  <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                    <div className="flex items-center space-x-2 justify-center items-center">
                      <span className="font-semibold whitespace-nowrap">
                        F1 Score =
                      </span>
                      <div className="text-center">
                        <p className="text-primary text-sm">
                          2 x Precision x Recall
                        </p>
                        <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                        <p className="text-secondary text-sm">
                          Precision + Recall
                        </p>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        }
      />
    </div>
  );
};

export default MetricCharts;
