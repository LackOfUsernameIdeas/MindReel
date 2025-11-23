import { useEffect, useRef, useState } from "react";
import type React from "react";
import type { BrainData } from "@/container/types_common";
import AnimatedValue from "../animatedValue/AnimatedValue";
import Infobox from "../infobox/infobox";

interface BrainActivityCardProps {
  data: BrainData | null;
  handleInfoButtonClick: () => void;
}

const BrainActivityCard: React.FC<BrainActivityCardProps> = ({
  data,
  handleInfoButtonClick
}) => {
  const prevValidData = useRef<BrainData | null>(null);

  // Състояние за следене на стойностите и техните анимационни ключове
  const [currentAttention, setCurrentAttention] = useState<number>(0);
  const [attentionKey, setAttentionKey] = useState<number>(0);
  const [currentMeditation, setCurrentMeditation] = useState<number>(0);
  const [meditationKey, setMeditationKey] = useState<number>(0);
  const [brainWaveValues, setBrainWaveValues] = useState<
    Record<string, { value: number; key: number }>
  >({});
  const [hasEverHadValidData, setHasEverHadValidData] =
    useState<boolean>(false);

  // Конфигурация на мозъчните вълни с цветове и ключове
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

  // Актуализиране на стойностите с управление на анимационните ключове
  useEffect(() => {
    if (!data) return;

    // Проверка дали attention и meditation са валидни (не са нули)
    const isValidAttentionMeditation =
      data.attention !== 0 || data.meditation !== 0;

    // Ако има валидни данни за първи път, маркираме че са се появили
    if (isValidAttentionMeditation && !hasEverHadValidData) {
      setHasEverHadValidData(true);
    }

    // Актуализиране на стойността за Attention (само ако не е 0)
    const newAttention = Math.round(Number(data.attention) || 0);
    if (newAttention !== 0 && newAttention !== currentAttention) {
      setCurrentAttention(newAttention);
      setAttentionKey((prev) => prev + 1);
    }

    // Актуализиране на стойността за Meditation (само ако не е 0)
    const newMeditation = Math.round(Number(data.meditation) || 0);
    if (newMeditation !== 0 && newMeditation !== currentMeditation) {
      setCurrentMeditation(newMeditation);
      setMeditationKey((prev) => prev + 1);
    }

    // Актуализиране на стойностите за мозъчните вълни
    const newBrainWaveValues = brainWaveConfig.reduce((acc, wave) => {
      const newValue = Math.round(Number(data[wave.key]) || 0);
      const existingValue = brainWaveValues[wave.key]?.value;

      if (newValue !== existingValue) {
        acc[wave.key] = {
          value: newValue,
          key: (brainWaveValues[wave.key]?.key || 0) + 1
        };
      } else {
        acc[wave.key] = brainWaveValues[wave.key];
      }

      return acc;
    }, {} as Record<string, { value: number; key: number }>);

    setBrainWaveValues(newBrainWaveValues);
  }, [data]);

  // Проверка за валидни данни
  const shouldKeepPreviousData =
    data && brainWaveConfig.every(({ key }) => data[key] === 0);

  if (!shouldKeepPreviousData && data) {
    prevValidData.current = data;
  }

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-black dark:bg-opacity-30 rounded-xl p-4 shadow-md dark:shadow-lg dark:backdrop-blur-sm border border-gray-200 dark:border-transparent">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <div className="flex items-center gap-2">
          <i className="text-xl text-primary ti ti-brain" />
          <span className="leading-none">
            Вашата мозъчна активност в реално време
          </span>
          <Infobox onClick={handleInfoButtonClick} />
        </div>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Рендерира Attention и Meditation само ако е имало валидни стойности поне веднъж */}
        {hasEverHadValidData && (
          <div className="bg-gray-50 dark:bg-black dark:bg-opacity-30 rounded-lg p-3 border border-gray-200 dark:border-transparent">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Attention
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e5e7eb"
                      className="dark:stroke-[#374151]"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeDasharray={`${2.83 * (currentAttention || 0)} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute text-lg font-semibold">
                    <AnimatedValue
                      key={attentionKey}
                      value={currentAttention}
                      color="#f59e0b"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Meditation
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e5e7eb"
                      className="dark:stroke-[#374151]"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#0ea5e9"
                      strokeWidth="8"
                      strokeDasharray={`${2.83 * (currentMeditation || 0)} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute text-lg font-semibold">
                    <AnimatedValue
                      key={meditationKey}
                      value={currentMeditation}
                      color="#0ea5e9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`bg-gray-50 dark:bg-black dark:bg-opacity-30 rounded-lg p-3 flex flex-col h-full border border-gray-200 dark:border-transparent ${
            !hasEverHadValidData ? "md:col-span-2" : ""
          }`}
        >
          <div>
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <i className="mr-1 text-xl text-primary ti ti-wave-sine" />
              <span>Мозъчни вълни</span>
            </h4>
          </div>
          <div className="flex-grow"></div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-1">
            {brainWaveConfig.map((wave) => (
              <div key={wave.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate mr-1">
                  {wave.title}
                </span>
                <AnimatedValue
                  small
                  key={brainWaveValues[wave.key]?.key || 0}
                  value={brainWaveValues[wave.key]?.value || 0}
                  color={wave.color}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainActivityCard;
