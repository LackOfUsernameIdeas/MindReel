import { FC } from "react";
import { LucideCircleHelp } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Badge } from "@/components/ui/badge";
import { MetricFormula } from "./MetricFormula";
import MetricStat from "./MetricStat";
import { metricConfig } from "../aiAnalysator-data";
import { MetricDetailsProps } from "../aiAnalysator-types";

const MetricDetails: FC<MetricDetailsProps> = ({
  data,
  activeMetric,
  handleHelpClick
}) => {
  return (
    <div className="rounded-lg p-4 bg-white dark:bg-bodybg2 shadow-md">
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <Badge variant="default" className="goodTiming text-white">
            {activeMetric === "fpr"
              ? metricConfig.fpr.title
              : activeMetric === "fnr"
              ? metricConfig.fnr.title
              : activeMetric === "accuracy"
              ? metricConfig.accuracy.title
              : metricConfig.specificity.title}
          </Badge>
          <h3 className="goodTiming text-defaulttextcolor dark:text-white/80">
            Подробна информация
          </h3>
        </div>
        <div className="bg-white dark:bg-bodybg2 rounded-md p-4">
          <div className="grid gap-3">
            {activeMetric === "fpr" && (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                  <MetricFormula
                    formula={
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <div>FPR</div>
                        <div>=</div>
                        <div className="flex flex-col items-center">
                          <div className="px-2">FP</div>
                          <div className="border-t border-foreground px-2">
                            FP + TN
                          </div>
                        </div>
                      </div>
                    }
                  />
                  <LucideCircleHelp
                    strokeWidth={3}
                    className="dark:text-defaulttextcolor/85 cursor-pointer text-bold transition-transform duration-200 hover:scale-110 rounded-full z-10"
                    onClick={handleHelpClick}
                  />
                </div>
                <MetricStat
                  value={data[0].irrelevant_user_recommendations_count}
                  total={data[0].irrelevant_platform_recommendations_count}
                />
                <MetricStat
                  label="(FP) -> Брой нерелевантни ЗА ВАС препоръки, които са отправени към вас:"
                  value={data[0].irrelevant_user_recommendations_count}
                />
                <MetricStat
                  label="(FP + TN) -> Брой нерелевантни ЗА ВАС препоръки в платформата - отправени и неотправени към вас:"
                  value={data[0].irrelevant_platform_recommendations_count}
                />
              </>
            )}

            {activeMetric === "specificity" && (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                  <MetricFormula
                    formula={
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <div>Specificity</div>
                        <div>=</div>
                        <div className="flex flex-col items-center">
                          <div className="px-2">TN</div>
                          <div className="border-t border-foreground px-2">
                            TN + FP
                          </div>
                        </div>
                      </div>
                    }
                  />
                  <LucideCircleHelp
                    strokeWidth={3}
                    className="dark:text-defaulttextcolor/85 cursor-pointer text-bold transition-transform duration-200 hover:scale-110 rounded-full z-10"
                    onClick={handleHelpClick}
                  />
                </div>
                <MetricStat
                  value={data[2].irrelevant_non_given_recommendations_count}
                  total={data[2].irrelevant_platform_recommendations_count}
                />
                <MetricStat
                  label="(TN) -> Брой нерелевантни ЗА ВАС препоръки, които НЕ са отправени към вас:"
                  value={data[2].irrelevant_non_given_recommendations_count}
                />
                <MetricStat
                  label="(TN + FP) -> Брой нерелевантни ЗА ВАС препоръки в платформата - отправени и неотправени към вас:"
                  value={data[2].irrelevant_platform_recommendations_count}
                />
              </>
            )}

            {activeMetric === "fnr" && (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                  <MetricFormula
                    formula={
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <div>FNR</div>
                        <div>=</div>
                        <div className="flex flex-col items-center">
                          <div className="px-2">FN</div>
                          <div className="border-t border-foreground px-2">
                            FN + TP
                          </div>
                        </div>
                      </div>
                    }
                  />
                  <LucideCircleHelp
                    strokeWidth={3}
                    className="dark:text-defaulttextcolor/85 cursor-pointer text-bold transition-transform duration-200 hover:scale-110 rounded-full z-10"
                    onClick={handleHelpClick}
                  />
                </div>
                <MetricStat
                  value={data[1].relevant_non_given_recommendations_count}
                  total={data[1].relevant_platform_recommendations_count}
                />
                <MetricStat
                  label="(FN) -> Брой релевантни ЗА ВАС препоръки, които НЕ са отправени към вас:"
                  value={data[1].relevant_non_given_recommendations_count}
                />
                <MetricStat
                  label="(FN + TP) -> Брой релевантни ЗА ВАС препоръки в платформата - отправени и неотправени към вас:"
                  value={data[1].relevant_platform_recommendations_count}
                />
              </>
            )}

            {activeMetric === "accuracy" && (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                  <MetricFormula
                    formula={
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <div>Accuracy</div>
                        <div>=</div>
                        <div className="flex flex-col items-center">
                          <div className="px-2">TP + TN</div>
                          <div className="border-t border-foreground px-2">
                            TP + TN + FP + FN
                          </div>
                        </div>
                      </div>
                    }
                  />
                  <LucideCircleHelp
                    strokeWidth={3}
                    className="dark:text-defaulttextcolor/85 cursor-pointer text-bold transition-transform duration-200 hover:scale-110 rounded-full z-10"
                    onClick={handleHelpClick}
                  />
                </div>
                <MetricStat
                  value={
                    (data[3]?.relevant_user_recommendations_count || 0) +
                    (data[3]?.irrelevant_non_given_recommendations_count || 0)
                  }
                  total={data[3].total_platform_recommendations_count}
                />
                <MetricStat
                  label="(TP) -> Брой релевантни ЗА ВАС препоръки, които са отправени към вас:"
                  value={data[3].relevant_user_recommendations_count}
                />
                <MetricStat
                  label="(TN) -> Брой нерелевантни ЗА ВАС препоръки, които НЕ са отправени към вас:"
                  value={data[3].irrelevant_non_given_recommendations_count}
                />
                <MetricStat
                  label="(TP + TN + FP + FN) -> Общ брой препоръки в платформата:"
                  value={data[3].total_platform_recommendations_count}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricDetails;
