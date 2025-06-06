'use client';
import PositionsSection from '@/components/PositionSection';
import PositionsTable from '@/components/PositionsTable';
import RewardsSummary from '@/components/RewardSummary';
import TopPoolsSidebar from '@/components/TopPoolsSidebar';
import { usePositions } from '@/hooks/usePositions';
import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useChainId } from 'wagmi';
import { RootState } from '../../../store';
import { setPositions } from '../../../store/reducers/position';

export default function PositionsPage() {
  const chainId = useChainId();
  const { fetchPositions } = usePositions(chainId);
  const { positions } = useSelector((state: RootState) => state.position, shallowEqual);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  const handleLoadPositions = async () => {
    setLoading(true);
    const positions = await fetchPositions();
    dispatch(setPositions(positions));
    setLoading(false);
  };

  useEffect(() => {
    handleLoadPositions();
  }, []);

  return (
    <section className="flex flex-col gap-12 bg-background-3 p-6 px-20 min-h-screen">
      <div className="flex w-full gap-20">
        <div className="flex flex-col gap-8 flex-1">
          <RewardsSummary />
          <PositionsSection />
          <PositionsTable positions={positions} loading={loading} />
        </div>
        <div className="w-2/5">
          <TopPoolsSidebar />
        </div>
      </div>
      <div className="w-full"></div>
    </section>
  );
}
