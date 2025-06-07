'use client';

import Link from 'next/link';
import Text from '../ui/Text';
import DropdownFilter from './PositionDropdownFilter';

interface Props {
  filters: {
    inRange: boolean;
    outOfRange: boolean;
    closed: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<Props['filters']>>;
}

const PositionsSection = ({ filters, setFilters }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-4">
        <Text type="h3" className="text-xl text-white font-semibold">
          Your Positions
        </Text>
        <div className="flex gap-2 items-center">
          <Link href="/positions/create" className="bg-white  text-black px-4 py-2 rounded">
            + New
          </Link>
          <DropdownFilter filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </div>
  );
};
export default PositionsSection;
