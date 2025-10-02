import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import chroma from "chroma-js";
import { TopGenres } from "../moviesSeriesIndividualStats-types";

// Преобразува RGB цвят в HEX формат
const rgbToHex = (rgb: string): string => {
  const result = rgb.match(/\d+/g);
  if (!result || result.length !== 3) {
    throw new Error("Невалиден RGB формат на цвета");
  }

  return `#${result
    .map((x) => parseInt(x).toString(16).padStart(2, "0"))
    .join("")}`;
};

// Обновява основния цвят на базата на CSS променливи
const updatePrimaryColor = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const primary = rootStyles.getPropertyValue("--primary").trim();
  const primaryWithCommas = primary.split(" ").join(",");
  return rgbToHex(primaryWithCommas);
};

interface CategorybarProps {
  data: TopGenres; // Данни за топ жанровете, които ще бъдат визуализирани
}

interface State {
  series: { name: string; data: number[] }[]; // Серия от данни за графиката
  options: any; // Опции за конфигуриране на графиката
}

export class Categorybar extends Component<CategorybarProps, State> {
  observer: MutationObserver | null = null; // Наблюдател за следене на промени в цветовете

  constructor(props: CategorybarProps) {
    super(props);

    // Трансформиране на данните за използване в графиката
    const { categories, values } = this.transformData(props.data);

    // Инициализиране на състоянието
    this.state = {
      series: [
        {
          name: "Top Genres", // Име на серията
          data: values // Стойности на жанровете
        }
      ],
      options: this.generateOptions(categories, values) // Генериране на конфигурация за графиката
    };
  }

  componentDidUpdate(prevProps: CategorybarProps) {
    // Проверка дали данните са се променили
    if (prevProps.data !== this.props.data) {
      this.updateChart(); // Обновяване на графиката
    }
  }

  componentDidMount() {
    // Създаване на наблюдател за проследяване на промени в цветовете
    this.observer = new MutationObserver(() => {
      this.updateChartColors();
    });

    // Наблюдение на промени в атрибута "class" на <html> елемента
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    // Спиране на наблюдателя при унищожаване на компонента
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  transformData(data: TopGenres) {
    // Трансформиране на входните данни в категории и стойности
    const categories = data.map((genre) => genre.genre_bg); // Извличане на имената на жанровете
    const values = data.map((genre) => genre.count); // Извличане на броя им
    return { categories, values };
  }

  generateOptions(categories: string[], _values: number[]) {
    // Генериране на цветова скала
    const primaryHex = updatePrimaryColor();
    const colorScale = chroma
      .scale([
        chroma(primaryHex).hex(),
        chroma(primaryHex).saturate(2).darken(2).hex()
      ])
      .mode("lab")
      .domain([0, categories.length - 1])
      .colors(categories.length);

    // Връщане на конфигурация за графиката
    return {
      chart: {
        toolbar: { show: false },
        height: 320,
        type: "bar",
        events: {
          mounted: (chart: any) => {
            chart.windowResizeHandler(); // Автоматично преоразмеряване при промяна на прозореца
          }
        }
      },
      grid: { borderColor: "#f2f5f7" },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: { position: "top" }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}`,
        offsetY: -20,
        style: {
          fontFamily: "GoodTiming",
          fontSize: "0.8rem",
          colors: ["#8c9097"]
        }
      },
      colors: colorScale,
      xaxis: {
        categories,
        position: "top",
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: false }
      },
      yaxis: { labels: { show: false } },
      tooltip: {
        theme: "dark",
        style: {
          fontFamily: "GoodTiming",
          fontSize: "0.8rem"
        },
        y: {
          title: {
            formatter: (_val: any) => {
              return "Брой:";
            }
          }
        }
      },
      legend: { show: false }
    };
  }

  updateChart() {
    // Обновяване на графиката при промяна на данните
    const { categories, values } = this.transformData(this.props.data);
    this.setState({
      series: [{ name: "Top Genres", data: values }],
      options: this.generateOptions(categories, values)
    });
  }

  updateChartColors() {
    // Обновяване на цветовете на графиката
    const { categories } = this.transformData(this.props.data);
    const primaryHex = updatePrimaryColor();
    const colorScale = chroma
      .scale([
        chroma(primaryHex).hex(),
        chroma(primaryHex).saturate(2).darken(2).hex()
      ])
      .mode("lab")
      .domain([0, categories.length - 1])
      .colors(categories.length);

    this.setState((prevState) => ({
      options: { ...prevState.options, colors: colorScale }
    }));
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="bar"
        height={350}
      />
    );
  }
}
