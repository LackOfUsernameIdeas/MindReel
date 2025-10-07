import type React from "react";
import type { BrainData } from "@/container/types_common";
import BrainWaveChart from "./charts/BrainWaveChart";
import AttentionMeditationChart from "./charts/AttentionMediationChart";
import BrainActivityCard from "./BrainActivityCard";
import { useEffect, useRef, useState } from "react";

interface BrainAnalysisTrackStatsProps {
  handleRecommendationsSubmit: (brainData: BrainData[]) => void;
  transmissionComplete: boolean;
  chartData: BrainData | null;
  seriesData: BrainData[];
  attentionMeditation: {
    name: string;
    data: { x: string; y: number }[];
  }[];
  handleInfoButtonClick: () => void;
}

const BrainAnalysisTrackStats: React.FC<BrainAnalysisTrackStatsProps> = ({
  handleRecommendationsSubmit,
  transmissionComplete,
  chartData,
  seriesData,
  attentionMeditation,
  handleInfoButtonClick
}) => {
  const termsCardRef = useRef<HTMLButtonElement>(null);
  const [flash, setFlash] = useState(false);
  const [lastValidData, setLastValidData] = useState<BrainData | null>(null);
  const [displayData, setDisplayData] = useState<BrainData | null>(null);

  // Конфигурация на мозъчните вълни с цветове
  const brainWaveConfig: Array<{
    key: keyof BrainData;
    title: string;
    color: string;
  }> = [
    { key: "delta", title: "Delta", color: "#8884d8" },
    { key: "theta", title: "Theta", color: "#82ca9d" },
    { key: "lowAlpha", title: "Low Alpha", color: "#ffc658" },
    { key: "highAlpha", title: "High Alpha", color: "#ff8042" },
    { key: "lowBeta", title: "Low Beta", color: "#0088FE" },
    { key: "highBeta", title: "High Beta", color: "#00C49F" },
    { key: "lowGamma", title: "Low Gamma", color: "#FFBB28" },
    { key: "highGamma", title: "High Gamma", color: "#FF8042" }
  ];

  // Проверява дали данните са валидни (не всички нули)
  const isValidData = (data: BrainData | null): boolean => {
    if (!data) return false;
    return (
      data.delta !== 0 ||
      data.theta !== 0 ||
      data.lowAlpha !== 0 ||
      data.highAlpha !== 0 ||
      data.lowBeta !== 0 ||
      data.highBeta !== 0 ||
      data.lowGamma !== 0 ||
      data.highGamma !== 0 ||
      data.attention !== 0 ||
      data.meditation !== 0
    );
  };

  // Актуализира displayData само когато получи валидни данни
  useEffect(() => {
    if (chartData && isValidData(chartData)) {
      setLastValidData(chartData);
      setDisplayData(chartData);
    } else if (lastValidData) {
      // Запазва предишните валидни данни ако текущите са нули
      setDisplayData(lastValidData);
    }
  }, [chartData, lastValidData]);

  // Обработва натискането на бутона за генериране на препоръки
  const handleSubmitClick = () => {
    if (!transmissionComplete || seriesData.length === 0) return;
    handleRecommendationsSubmit(seriesData);
  };

  // Превърта изгледа до бутона и добавя мигащ ефект
  const handleScroll = () => {
    if (termsCardRef.current) {
      termsCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      setFlash(true);
      setTimeout(() => setFlash(false), 1000);
    }
  };

  // Изпълнява handleScroll при завършване на предаването на данни
  useEffect(() => {
    if (transmissionComplete) {
      handleScroll();
    }
  }, [transmissionComplete]);

  return (
    <div className="rounded-lg p-4 transition-all duration-300">
      <div className="relative mx-auto">
        {displayData && (
          <div className="space-y-4">
            <BrainActivityCard
              data={displayData}
              handleInfoButtonClick={handleInfoButtonClick}
            />
            <div className="space-y-4">
              <AttentionMeditationChart
                attentionMeditation={attentionMeditation}
              />
              {/* Показване на първите 4 вида мозъчни вълни */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {brainWaveConfig.slice(0, 4).map((wave) => (
                  <div key={wave.key}>
                    <BrainWaveChart
                      title={wave.title}
                      brainWaveKey={wave.key}
                      seriesData={seriesData}
                      color={wave.color}
                    />
                  </div>
                ))}
              </div>
              {/* Показване на останалите видове мозъчни вълни */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {brainWaveConfig.slice(4).map((wave) => (
                  <div key={wave.key}>
                    <BrainWaveChart
                      title={wave.title}
                      brainWaveKey={wave.key}
                      seriesData={seriesData}
                      color={wave.color}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Бутон за генериране на препоръки */}
      {transmissionComplete && (
        <div className="flex justify-center mt-6">
          <button
            ref={termsCardRef}
            onClick={handleSubmitClick}
            className={`next glow-next text-white font-bold rounded-lg px-6 py-3 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md ${
              flash ? "flash-bounce" : ""
            }`}
          >
            Генерирайте препоръки!
          </button>
        </div>
      )}
    </div>
  );
};

export default BrainAnalysisTrackStats;
