import Link from 'next/link';
import Text from './Text';

export default function PositionsSection() {
  return (
    <div className="space-y-4">
      {/* <div className="bg-black-50 border-2 border-dark-black-100 rounded-lg p-4 flex justify-between items-center">
        <div>
          <Text type="p" className="font-semibold text-white">
            Welcome to your positions
          </Text>
          <Text type="p" className="text-white">
            Connect your wallet to view your current positions.
          </Text>
        </div>
      </div> */}
      <div className="flex flex-col items-start gap-4">
        <Text type="h3" className="text-xl text-white font-semibold">
          Your Positions
        </Text>
        <div>
          <Link href="/positions/create" className="bg-white  text-black px-4 py-2 rounded">
            + New
          </Link>
        </div>
      </div>
    </div>
  );
}
