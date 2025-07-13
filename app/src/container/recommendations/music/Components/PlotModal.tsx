import { FC, useEffect, useState } from "react";
import { PlotModalProps } from "../musicRecommendations-types";
import { translate } from "@/container/helper_functions_common";

export const PlotModal: FC<PlotModalProps> = ({
  recommendationList,
  currentIndex,
  closeModal,
  modalType
}) => {
  const movie = recommendationList[currentIndex];

  const [translatedPlot, setTranslatedPlot] = useState<string>(""); // Преведеното описание на сюжета

  // useEffect за превод на сюжета на филма/сериала
  useEffect(() => {
    async function fetchPlotTranslation() {
      const translated = await translate(movie.plot);
      setTranslatedPlot(translated);
    }

    fetchPlotTranslation();
  }, [movie.plot]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-70 z-40"></div>
      <div className="modal">
        <h2 className="text-lg font-semibold">
          {modalType === "description" ? "Пълно описание" : "Пълен сюжет"}
        </h2>
        <p className="text-sm">
          {modalType === "description" ? movie.description : translatedPlot}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-secondary transform transition-transform duration-200 hover:scale-105"
          >
            Затвори
          </button>
        </div>
      </div>
    </div>
  );
};
