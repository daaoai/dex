'use client';

import Link from 'next/link';
import Text from '../ui/Text';
import DropdownFilter from './PositionDropdownFilter';
import { positionsSectionContent } from '@/content/positionContent';

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
        <Text type="h3" className="text-lg text-white font-normal text-primary-9">
          {positionsSectionContent.title}
        </Text>
        <div className="flex gap-2 items-center">
          <Link href="/positions/create" className="bg-white  text-black px-3 py-1 rounded">
            {positionsSectionContent.new}
          </Link>
          <DropdownFilter filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </div>
  );
};
export default PositionsSection;
