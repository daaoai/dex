'use client';
import PositionsSection from '@/components/position/PositionSection';
import PositionsTable from '@/components/position/PositionsTable';
import TopPoolsSidebar from '@/components/pools/TopPoolsSidebar';
import { usePositions } from '@/hooks/usePositions';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useChainId } from 'wagmi';
import { RootState } from '../../../store';
import { setPositions } from '../../../store/reducers/position';
import NoPositions from '@/components/position/NoPositionFound';
import RewardsSummary from '@/components/position/RewardSummary';

export default function PositionsPage() {
  const chainId = useChainId();
  const { fetchPositions } = usePositions(chainId);
  const { positions } = useSelector((state: RootState) => state.position, shallowEqual);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    inRange: true,
    outOfRange: true,
    closed: false,
  });

  const dispatch = useDispatch();

  const handleLoadPositions = async () => {
    if (positions.length > 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchedPositions = await fetchPositions();
    dispatch(setPositions(fetchedPositions));
    setLoading(false);
  };

  const filteredPositions = positions.filter((pos) => {
    // if (pos.closed) return filters.closed;
    if (pos.isInRange) return filters.inRange;
    return filters.outOfRange;
  });

  useEffect(() => {
    handleLoadPositions();
  }, []);

  return (
    <section className="flex flex-col gap-12 bg-black p-3 sm:px-20 min-h-screen">
      <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-20">
        <div className="flex flex-col gap-8 flex-1">
          <RewardsSummary />
          <PositionsSection filters={filters} setFilters={setFilters} />
          {loading ? (
            <PositionsTable positions={[]} loading={true} />
          ) : filteredPositions.length > 0 ? (
            <PositionsTable positions={filteredPositions} loading={false} />
          ) : (
            <NoPositions positions={[]} />
          )}
        </div>
        <div className="w-full lg:w-1/3">
          <TopPoolsSidebar />
        </div>
      </div>
    </section>
  );
}
