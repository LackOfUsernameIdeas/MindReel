import type React from "react";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import AnimatedValue from "../../animatedValue/AnimatedValue";

interface AttentionMeditationChartProps {
  attentionMeditation: {
    name: string;
    data: { x: string; y: number }[];
  }[];
}

const AttentionMeditationChart: React.FC<AttentionMeditationChartProps> = ({
  attentionMeditation
}) => {
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("artMenu") as "light" | "dark") || "light"
  );
  const [attentionValue, setAttentionValue] = useState<number>(0);
  const [meditationValue, setMeditationValue] = useState<number>(0);
  const [valueKey, setValueKey] = useState<number>(0);
  const [hasEverHadValidData, setHasEverHadValidData] =
    useState<boolean>(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const currentMode = localStorage.getItem("artMenu") as "light" | "dark";
      if (currentMode) setMode(currentMode);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (attentionMeditation[0]?.data.length > 0) {
      const newAttentionValue = Math.round(
        attentionMeditation[0].data[attentionMeditation[0].data.length - 1].y
      );
      const newMeditationValue = Math.round(
        attentionMeditation[1].data[attentionMeditation[1].data.length - 1].y
      );

      // Проверка дали има валидни данни (поне едно от двете не е 0)
      const isValidData = newAttentionValue !== 0 || newMeditationValue !== 0;

      // Ако има валидни данни за първи път, маркираме че са се появили
      if (isValidData && !hasEverHadValidData) {
        setHasEverHadValidData(true);
      }

      // Актуализираме стойностите само ако не са 0
      if (
        (newAttentionValue !== 0 && newAttentionValue !== attentionValue) ||
        (newMeditationValue !== 0 && newMeditationValue !== meditationValue)
      ) {
        if (newAttentionValue !== 0) {
          setAttentionValue(newAttentionValue);
        }
        if (newMeditationValue !== 0) {
          setMeditationValue(newMeditationValue);
        }
        setValueKey((prev) => prev + 1);
      }
    }
  }, [
    attentionMeditation,
    attentionValue,
    meditationValue,
    hasEverHadValidData
  ]);

  const attentionMeditationOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "attention-meditation-chart",
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      background: "transparent"
    },
    colors: ["#f59e0b", "#0ea5e9"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.2,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: "rgba(0, 0, 0, 0.1)",
      row: {
        colors: ["transparent"],
        opacity: 0.5
      },
      padding: {
        left: 10,
        right: 10
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 4
      }
    },
    xaxis: {
      type: "numeric",
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: "rgba(0, 0, 0, 0.7)",
          fontSize: "10px"
        },
        formatter: (value) => Math.round(value).toString()
      }
    },
    tooltip: {
      theme: "light",
      x: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -5,
      offsetX: -5,
      labels: {
        colors: "rgba(0, 0, 0, 0.9)"
      }
    }
  };

  // Create a function to get theme-specific options
  const getThemeOptions = (isDark: boolean): ApexCharts.ApexOptions => {
    return {
      ...attentionMeditationOptions,
      grid: {
        ...attentionMeditationOptions.grid,
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: isDark ? "dark" : "light",
          type: "vertical",
          shadeIntensity: isDark ? 0.3 : 0.2,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 100]
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          style: {
            colors: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
            fontSize: "10px"
          },
          formatter: (value) => Math.round(value).toString()
        }
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        x: {
          show: false
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -5,
        offsetX: -5,
        labels: {
          colors: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"
        }
      }
    };
  };

  // Не рендерира компонента докато не получи валидни данни поне веднъж
  if (!hasEverHadValidData) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-black dark:bg-opacity-30 rounded-lg p-3 h-full flex flex-col border border-gray-200 dark:border-transparent shadow-md dark:shadow-none">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Вашето менталното състояние
        </h3>
        <div className="flex space-x-3">
          <AnimatedValue
            key={`${valueKey}-attention`}
            value={attentionValue}
            color="#f59e0b"
          />
          <AnimatedValue
            key={`${valueKey}-meditation`}
            value={meditationValue}
            color="#0ea5e9"
          />
        </div>
      </div>
      <div className="flex-grow mb-2">
        <ApexCharts
          options={getThemeOptions(mode === "dark")}
          series={attentionMeditation}
          type="area"
          height="100%"
        />
      </div>
    </div>
  );
};

export default AttentionMeditationChart;
