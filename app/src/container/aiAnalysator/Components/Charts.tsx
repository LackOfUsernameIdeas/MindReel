import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Infobox from "@/components/common/infobox/infobox";

// Интерфейс за свойствата на компонента
interface AverageMetricsTrendProps {
  seriesData: {
    record_date: string;
    average_precision_percentage: string;
    average_recall_percentage: string;
    average_f1_score_percentage: string;
  }[];
  onClick: () => void;
}

// Интерфейс за състоянието на компонента
interface AverageMetricsTrendState {
  options: ApexOptions;
  series: ApexOptions["series"];
  currentPage: number;
  itemsPerPage: number;
}

// Компонент за визуализация на метриките
export class AverageMetricsTrend extends Component<
  AverageMetricsTrendProps,
  AverageMetricsTrendState
> {
  constructor(props: AverageMetricsTrendProps) {
    super(props);
    this.state = {
      options: this.getUpdatedOptions(),
      series: this.transformData(
        this.getPaginatedData(props.seriesData, 0, 10)
      ),
      currentPage: 0,
      itemsPerPage: 12
    };
  }

  // Проверява дали има промяна в props и обновява данните
  componentDidUpdate(prevProps: AverageMetricsTrendProps) {
    if (prevProps.seriesData !== this.props.seriesData) {
      const paginatedData = this.getPaginatedData(
        this.props.seriesData,
        this.state.currentPage,
        this.state.itemsPerPage
      );
      this.setState({
        series: this.transformData(paginatedData)
      });
    }
  }

  // Връща част от данните според страницата
  getPaginatedData(
    data: AverageMetricsTrendProps["seriesData"],
    page: number,
    itemsPerPage: number
  ) {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Обработва преминаването към следваща страница
  handleNextPage = () => {
    const { currentPage, itemsPerPage } = this.state;
    const totalPages = Math.ceil(this.props.seriesData.length / itemsPerPage);

    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      const paginatedData = this.getPaginatedData(
        this.props.seriesData,
        newPage,
        itemsPerPage
      );

      this.setState({
        currentPage: newPage,
        series: this.transformData(paginatedData)
      });
    }
  };

  // Обработва преминаването към предишна страница
  handlePrevPage = () => {
    const { currentPage, itemsPerPage } = this.state;

    if (currentPage > 0) {
      const newPage = currentPage - 1;
      const paginatedData = this.getPaginatedData(
        this.props.seriesData,
        newPage,
        itemsPerPage
      );

      this.setState({
        currentPage: newPage,
        series: this.transformData(paginatedData)
      });
    }
  };

  // Трансформира входните данни във формат подходящ за ApexCharts
  transformData(data: AverageMetricsTrendProps["seriesData"]) {
    return [
      {
        name: "Precision (%)",
        data: data.map((entry) => ({
          x: entry.record_date,
          y: Number.parseFloat(entry.average_precision_percentage)
        }))
      },
      {
        name: "Recall (%)",
        data: data.map((entry) => ({
          x: entry.record_date,
          y: Number.parseFloat(entry.average_recall_percentage)
        }))
      },
      {
        name: "F1 Score (%)",
        data: data.map((entry) => ({
          x: entry.record_date,
          y: Number.parseFloat(entry.average_f1_score_percentage)
        }))
      }
    ];
  }

  // Опции за графиката
  getUpdatedOptions(): ApexOptions {
    return {
      chart: {
        type: "line",
        toolbar: { show: false }
      },
      stroke: {
        curve: "smooth",
        width: 2
      },
      markers: {
        size: 4
      },
      colors: ["#FF4560", "#00E396", "#008FFB"],
      xaxis: {
        type: "category",
        labels: { show: true }
      },
      yaxis: {
        labels: { show: true }
      },
      tooltip: {
        theme: "dark",
        custom: ({ seriesIndex, dataPointIndex, w }) => {
          const seriesName = w.config.series[seriesIndex].name;
          const value = w.config.series[seriesIndex].data[dataPointIndex].y;
          return `
            <div style="padding: 1rem;">
              <div class="opsilion" style="font-weight: bold;">${seriesName}</div>
              <div class="font-Equilibrist" style="font-family: 'Equilibrist', sans-serif;">${value}%</div>
            </div>
          `;
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        floating: false,
        fontSize: "12rem",
        labels: {
          useSeriesColors: true
        }
      }
    };
  }

  render() {
    const { currentPage, itemsPerPage } = this.state;
    const { seriesData } = this.props;
    const totalPages = Math.ceil(seriesData.length / itemsPerPage);
    const showPagination = seriesData.length > itemsPerPage;

    const startIndex = currentPage * itemsPerPage + 1;
    const endIndex = Math.min(
      (currentPage + 1) * itemsPerPage,
      seriesData.length
    );

    return (
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <Infobox onClick={this.props.onClick} />
        </div>

        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={350}
          width="100%"
        />

        {showPagination && (
          <div className="flex items-center justify-between mt-4 px-4">
            <button
              onClick={this.handlePrevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Showing {startIndex} to {endIndex} of {seriesData.length}{" "}
                entries
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage + 1} of {totalPages}
              </span>
            </div>

            <button
              onClick={this.handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }
}
