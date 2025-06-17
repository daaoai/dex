import { AfterDrawData, ChartDataset } from "@/types/linegraph";
import { ChartData, ChartOptions, ChartTooltipItem } from "chart.js";
import { isArray } from "util";

export const chartOptions: ChartOptions = {
  legend: { display: false },
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          display: false,
          maxTicksLimit: 6,
          autoSkip: true,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
          drawBorder: true,
        },
        ticks: {
          display: false,
        },
      },
    ],
  },
  
  tooltips: {
    mode: 'index',
    intersect: false,
    backgroundColor: '#4c3645',
    bodyFontColor: 'rgba(255,255,255,0.6)',
    displayColors: false,
    callbacks: {
      label: (tooltipItem: ChartTooltipItem, data: ChartData) => {
        let label = '';
        if (isArray(data?.datasets))
          label = data?.datasets[tooltipItem.datasetIndex || 0].label || '';
        const value = tooltipItem.yLabel || '';
        return ` ${label} ${value} ${'USD'}`;
      },
    },
  },
  elements: {
    line: {
      borderWidth: 2,
    },
  },
  plugins: {
    crosshair: {
      line: {
        color: '#4B40EE',
        width: 1,
      },
      sync: {
        enabled: false,
      },
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
        speed: 1000000000,
        threshold: 10000000000,
      },
      zoom: {
        enabled: true,
        drag: false,
        mode: 'x',
        speed: 0.05,
      },
    },
  },
};

export const gradientPlugin = {
  beforeDatasetsDraw: (chart: Chart) => {
    if (!chart.ctx || !chart.chartArea) return;

    const { ctx, chartArea } = chart;
    const { top, bottom } = chartArea;

    chart.data.datasets?.forEach((dataset) => {
      const customDataset = dataset as ChartDataset;
      if (!customDataset.gradient || customDataset.lastHeight !== bottom) {
        const gradient = ctx.createLinearGradient(0, top, 0, bottom);
        customDataset.backgroundColor = gradient;
        customDataset.borderColor = '#ff38c7';
        customDataset.gradient = gradient;
        customDataset.lastHeight = bottom;
      }
    });

    chart.update();
  },
};

export const crosshairPlugin = {
  afterDraw: (chart: AfterDrawData) => {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const ctx = chart.ctx;
      const tooltip = chart.tooltip;
      const activePoint = tooltip._active[0];

      const x = activePoint.tooltipPosition().x;
      const y = activePoint.tooltipPosition().y;

      const xScale = chart.scales["x-axis-0"];
      const yScale = chart.scales["y-axis-0"];
      if (!xScale || !yScale) return;

      ctx.save();
      ctx.setLineDash([6, 6]);

      // Draw horizontal dashed line
      ctx.beginPath();
      ctx.moveTo(chart.chartArea.left, y);
      ctx.lineTo(chart.chartArea.right, y);
      ctx.strokeStyle = "#999999";
      ctx.stroke();

      // Draw vertical crosshair
      ctx.beginPath();
      ctx.moveTo(x, chart.chartArea.top);
      ctx.lineTo(x, chart.chartArea.bottom);
      ctx.strokeStyle = "#999999";
      ctx.stroke();
    }
  },
};