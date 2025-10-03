import { FC } from "react";
import { AIAnalysisDashboardProps } from "../aiAnalysator-types";
import MainMetricsWidget from "./MainMetricsWidget";
import Widget from "../../../components/common/widget/widget";

const AIAnalysisDashboard: FC<AIAnalysisDashboardProps> = ({
  precisionData,
  recallData,
  f1ScoreData
}) => {
  return (
    <div className="bg-bodybg p-6 rounded-xl shadow-lg space-y-4 mt-[-0.5rem]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <MainMetricsWidget
          icon={<i className="ti ti-percentage-60 text-2xl"></i>}
          title="Precision"
          value={`${precisionData.precision_percentage.toFixed(2)}%`}
          description={`${precisionData.relevant_recommendations_count} от общо ${precisionData.total_recommendations_count} препоръки, които сте направили, са релевантни`}
          progress={precisionData.precision_percentage}
        />
        <MainMetricsWidget
          icon={<i className="ti ti-percentage-40 text-2xl"></i>}
          title="Recall (Честота на подходящи предложени препоръки - TPR)"
          value={`${recallData.recall_percentage.toFixed(2)}%`}
          description={`${recallData.relevant_user_recommendations_count} от общо ${recallData.relevant_platform_recommendations_count} релевантни препоръки в системата са отправени към Вас`}
          progress={recallData.recall_percentage}
        />
        <MainMetricsWidget
          icon={<i className="ti ti-percentage-70 text-2xl"></i>}
          title="F1 Score"
          value={`${f1ScoreData.f1_score_percentage.toFixed(2)}%`}
          description="Баланс между Precision и Recall"
          progress={f1ScoreData.f1_score_percentage}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Widget
          icon={<i className="ti ti-list-numbers text-3xl" />}
          title={`Брой на генерирани от Вас препоръки\n(TP + FP)`}
          value={precisionData.total_recommendations_count}
          help
        />
        <Widget
          icon={<i className="ti ti-copy-check text-3xl" />}
          title={`Брой на релевантни препоръки сред вашите генерирани (TP)`}
          value={precisionData.relevant_recommendations_count}
          help
        />
        <Widget
          icon={<i className="ti ti-database text-3xl" />}
          title={`Общ брой препоръки в платформата\n(TP + TN + FP + FN)`}
          value={recallData.total_platform_recommendations_count}
          help
        />
        <Widget
          icon={<i className="ti ti-checkbox text-3xl" />}
          title={`Брой на релевантни за Вас препоръки в платформата\n(TP + FN)`}
          value={recallData.relevant_platform_recommendations_count}
          help
        />
      </div>
    </div>
  );
};

export default AIAnalysisDashboard;
