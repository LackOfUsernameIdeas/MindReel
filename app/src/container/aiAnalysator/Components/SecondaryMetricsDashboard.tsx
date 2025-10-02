import { useState, useRef, useEffect, FC } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SecondaryMetricsWidget from "./SecondaryMetricsWidget";
import { metricConfig } from "../aiAnalysator-data";
import { SecondaryMetricsDashboardProps } from "../aiAnalysator-types";
import MetricDetails from "./MetricDetails";

const SecondaryMetricsDashboard: FC<SecondaryMetricsDashboardProps> = ({
  data
}) => {
  const [activeMetric, setActiveMetric] = useState<string>("fpr");
  const termsCardRef = useRef<HTMLDivElement>(null);
  const [flash, setFlash] = useState(false);

  const handleHelpClick = () => {
    if (termsCardRef.current) {
      termsCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      setFlash(true);
      setTimeout(() => setFlash(false), 1000);
    }
  };

  useEffect(() => {
    const handleExternalScroll = () => {
      handleHelpClick();
    };

    window.addEventListener("scrollToTerms", handleExternalScroll);
    return () => {
      window.removeEventListener("scrollToTerms", handleExternalScroll);
    };
  }, []);

  return (
    <Card className="w-full bg-bodybg dark:bg-bodybg shadow-none border-0">
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold text-defaulttextcolor dark:text-white/80 flex items-center goodTiming">
            Метрики за препоръки
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-4 mb-4 gap-4">
          <SecondaryMetricsWidget
            title={metricConfig.fpr.title}
            value={data[0].fpr_percentage}
            description={metricConfig.fpr.description}
            modalText={metricConfig.fpr.tooltip}
            onClick={() => setActiveMetric("fpr")}
            isActive={activeMetric === "fpr"}
          />

          <SecondaryMetricsWidget
            title={metricConfig.specificity.title}
            value={data[2].specificity_percentage}
            description={metricConfig.specificity.description}
            modalText={metricConfig.specificity.tooltip}
            onClick={() => setActiveMetric("specificity")}
            isActive={activeMetric === "specificity"}
          />

          <SecondaryMetricsWidget
            title={metricConfig.fnr.title}
            value={data[1].fnr_percentage}
            description={metricConfig.fnr.description}
            modalText={metricConfig.fnr.tooltip}
            onClick={() => setActiveMetric("fnr")}
            isActive={activeMetric === "fnr"}
          />

          <SecondaryMetricsWidget
            title={metricConfig.accuracy.title}
            value={data[3].accuracy_percentage}
            description={metricConfig.accuracy.description}
            modalText={metricConfig.accuracy.tooltip}
            onClick={() => setActiveMetric("accuracy")}
            isActive={activeMetric === "accuracy"}
          />
        </div>

        <MetricDetails
          data={data}
          activeMetric={activeMetric}
          handleHelpClick={handleHelpClick}
        />

        <div
          ref={termsCardRef}
          className={`mt-4 p-5 bg-white dark:bg-bodybg2 rounded-xl shadow-lg ${
            flash ? "animate-flash" : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <p className="goodTiming text-xl font-bold text-defaulttextcolor dark:text-white/80">
              ВИДОВЕ ПРЕДПОЛОЖЕНИЯ НА ИЗКУСТВЕНИЯ ИНТЕЛЕКТ
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3">
            {[
              {
                label: "TP",
                description: "Подходящи предложени препоръки"
              },
              {
                label: "FN",
                description: "Подходящи пропуснати препоръки"
              },
              {
                label: "FP",
                description: "Неподходящи предложени препоръки"
              },
              {
                label: "TN",
                description: "Неподходящи пропуснати препоръки"
              }
            ].map(({ label, description }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex pt-1 pl-1 h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary shadow">
                  {label}
                </div>
                <span className="text-[14px] text-defaulttextcolor dark:text-white/80 leading-tight">
                  {description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecondaryMetricsDashboard;
