import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
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
    const totalItems = seriesData.length;

    return (
      <div className="relative h-full flex flex-col">
        <div className="absolute top-2 right-2 z-10">
          <Infobox onClick={this.props.onClick} />
        </div>

        <div className="flex-1 min-h-0">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="line"
            height={280}
            width="100%"
          />
        </div>

        {showPagination && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between text-xs">
              <div className="text-defaulttextcolor dark:text-defaulttextcolor/70 text-[0.6rem]">
                <b>{currentPage * itemsPerPage + 1}</b>-
                <b>{Math.min((currentPage + 1) * itemsPerPage, totalItems)}</b>{" "}
                от <b>{totalItems}</b>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={this.handlePrevPage}
                  disabled={currentPage === 0}
                  className="px-2 py-1 text-[0.6rem] border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  ‹
                </button>

                <span className="px-2 py-1 text-[0.6rem] bg-gray-100 dark:bg-gray-700 rounded">
                  {currentPage + 1}/{totalPages}
                </span>

                <button
                  onClick={this.handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="px-2 py-1 text-[0.6rem] border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
