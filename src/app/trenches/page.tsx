import TickerBar from '@/components/trenches/Tickerbar';
import TradingDashboard from '@/components/trenches/TradingDashboard';

const Trenches = () => {
  return (
    <div className="min-h-screen bg-background-7 text-white">
      <TickerBar />
      <TradingDashboard />
    </div>
  );
};

export default Trenches;
