import React, { useEffect, useState } from 'react';
import { LineGraph } from './line-graph';
import Text from '../ui/Text';
import { LineGraphViewProps } from '@/types/linegraph';
import { Line } from 'react-chartjs-2';

export const LineGraphView: React.FC<LineGraphViewProps> = ({
  tokenName,
  setTokenState,
  tokenState,
  tabs,
  activeTabId,
  chartRef,
}) => {
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const fiatCurrency = 'usd';

  useEffect(() => {
    if (!tabs || tabs.length === 0) return;

    const active = tabs.find((tab) => String(tab.id) === String(activeTabId));
    setDuration(active?.duration ?? tabs[0].duration);
  }, [activeTabId, tabs]);
  return (
    <div className="w-full h-full">
      {!loading && !tokenState?.diff && (
        <Text type="p" className="text-rose mt-11 flex justify-center">
          Line Graph unavailable
        </Text>
      )}

      <div className="relative">
        <LineGraph
          duration={duration}
          tokenName={tokenName}
          setTokenState={setTokenState}
          loading={loading}
          setLoading={setLoading}
          vsCurrency={fiatCurrency}
          chartRef={chartRef ?? React.createRef<Line | null>()}
        />
      </div>
    </div>
  );
};
