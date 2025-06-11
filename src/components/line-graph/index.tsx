/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { LineGraph } from './line-graph';

interface Tab {
  id: string | number;
  duration: number;
}

interface LineGraphViewProps {
  tokenName?: string;
  setTokenState: any;
  tokenState: any;
  tabs: Tab[];
  activeTabId: string | number;
  chartRef: any;
}

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
        <div className="text-orange-500 mt-11 flex justify-center">Line Graph unavailable</div>
      )}

      <div className="relative">
        <LineGraph
          duration={duration}
          tokenName={tokenName}
          setTokenState={setTokenState}
          loading={loading}
          setLoading={setLoading}
          vsCurrency={fiatCurrency}
          chartRef={chartRef}
        />
      </div>
    </div>
  );
};
