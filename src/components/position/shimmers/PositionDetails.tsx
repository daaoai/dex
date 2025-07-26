import { Shimmer } from '@/components/ui/Shimmer';

// Shimmer skeleton for position details
export const PositionDetailsSkeleton = () => {
  return (
    <div className="p-6 text-white min-h-screen bg-grey-5">
      {/* Back button skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Shimmer width="w-4" height="h-4" />
        <Shimmer width="w-32" height="h-4" />
      </div>

      {/* Header section skeleton */}
      <div className="flex justify-between border-b border-stroke-2 pb-4 mt-4">
        <div className="flex items-center mt-4">
          <div className="flex gap-6 items-center">
            {/* Pool icon skeleton */}
            <div className="flex">
              <Shimmer width="w-8" height="h-8" className="rounded-full" />
              <Shimmer width="w-8" height="h-8" className="rounded-full -ml-2" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Shimmer width="w-32" height="h-6" />
                <div className="flex gap-1">
                  <Shimmer width="w-8" height="h-6" className="rounded-l" />
                  <Shimmer width="w-12" height="h-6" className="rounded-r" />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <Shimmer width="w-2" height="h-2" className="rounded-full" />
                  <Shimmer width="w-20" height="h-4" />
                </div>
                <Shimmer width="w-24" height="h-4" className="ml-2 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex mt-6 gap-2">
          <Shimmer width="w-24" height="h-10" className="rounded" />
          <Shimmer width="w-28" height="h-10" className="rounded" />
          <Shimmer width="w-24" height="h-10" className="rounded" />
        </div>
      </div>

      {/* Price display skeleton */}
      <div className="mt-6">
        <Shimmer width="w-64" height="h-8" />
      </div>

      {/* Main content skeleton */}
      <div className="flex gap-4 w-full items-start">
        {/* Chart skeleton */}
        <div className="mt-4 rounded-lg h-[300px] flex-1 bg-background p-4">
          <Shimmer width="w-full" height="h-full" className="rounded-lg" />
        </div>

        {/* Right sidebar skeleton */}
        <div className="flex flex-col gap-6 mt-4 w-2/5">
          {/* Price range skeleton */}
          <div className="p-4 rounded-lg bg-background-8">
            <Shimmer width="w-24" height="h-5" className="mb-4" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Shimmer width="w-16" height="h-4" className="mb-2" />
                <Shimmer width="w-20" height="h-6" />
                <Shimmer width="w-24" height="h-4" className="mt-1" />
              </div>
              <div>
                <Shimmer width="w-16" height="h-4" className="mb-2" />
                <Shimmer width="w-20" height="h-6" />
                <Shimmer width="w-24" height="h-4" className="mt-1" />
              </div>
              <div>
                <Shimmer width="w-20" height="h-4" className="mb-2" />
                <Shimmer width="w-20" height="h-6" />
                <Shimmer width="w-24" height="h-4" className="mt-1" />
              </div>
            </div>
          </div>

          {/* Position skeleton */}
          <div className="p-4 rounded-lg bg-background-8">
            <Shimmer width="w-16" height="h-5" className="mb-4" />

            <div className="flex gap-2 text-sm mt-4">
              <Shimmer width="w-5" height="h-5" className="rounded-full" />
              <Shimmer width="w-32" height="h-4" className="mt-0.5" />
            </div>
            <div className="flex gap-2 text-sm mt-4">
              <Shimmer width="w-5" height="h-5" className="rounded-full" />
              <Shimmer width="w-32" height="h-4" />
            </div>
          </div>

          {/* Fees earned skeleton */}
          <div className="p-4 rounded-lg bg-background-8">
            <Shimmer width="w-24" height="h-5" className="mb-4" />

            <div className="flex gap-2 text-sm mt-4">
              <Shimmer width="w-5" height="h-5" className="rounded-full" />
              <Shimmer width="w-32" height="h-4" className="mt-0.5" />
            </div>
            <div className="flex gap-2 text-sm mt-4">
              <Shimmer width="w-5" height="h-5" className="rounded-full" />
              <Shimmer width="w-32" height="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
