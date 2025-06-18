import { Dispatch, SetStateAction } from 'react';
import { Line } from 'react-chartjs-2';

export interface Tab {
  id: string | number;
  duration: number;
}

export interface LineGraphViewProps {
  tokenName?: string;
  setTokenState: Dispatch<SetStateAction<TokenState>>;
  tokenState: TokenState;
  tabs: Tab[];
  activeTabId: string | number;
  chartRef?: React.RefObject<Line>;
}

export interface LineGraphProps {
  duration: number;
  tokenName?: string;
  setTokenState: React.Dispatch<React.SetStateAction<TokenState>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  vsCurrency: string;
  chartRef: React.RefObject<Line | null>;
}

export interface PriceData {
  timestamp: number;
  price: number;
}

export interface TokenState {
  percentageDiff?: number;
  diff?: number;
  time?: string;
  type?: 'positive' | 'negative';
}

export interface CachedPrices {
  newPrices: PriceData[];
  updatedAt: string;
}

// chart options

export interface ChartDataset {
  label?: string;
  data?: number[];
  backgroundColor?: string | CanvasGradient;
  borderColor?: string;
  gradient?: CanvasGradient;
  lastHeight?: number;
}

export interface AfterDrawData {
  ctx: CanvasRenderingContext2D;
  chartArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  tooltip: {
    _active: { tooltipPosition: () => { x: number; y: number } }[];
  };
  scales: {
    [key: string]: {
      left: number;
      right: number;
      top: number;
      bottom: number;
      ticks: {
        display: boolean;
        maxTicksLimit?: number;
        autoSkip?: boolean;
      };
    };
  };
}

// chart types
export type ChartDataPoint = {
  time: number;
  value: number;
};

export type ChartAPI = {
  updateData: (newData: ChartDataPoint[]) => void;
};

export interface ZoomableChart extends Chart {
  resetZoom: () => void;
}
