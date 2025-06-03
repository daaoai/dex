const PositionRecordShimmer = () => (
  <div className="bg-grey-3 rounded-xl p-4 shadow-md animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-700 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="w-32 h-4 bg-gray-700 rounded" />
        <div className="w-20 h-3 bg-gray-700 rounded" />
      </div>
      <div className="ml-auto w-14 h-5 bg-gray-700 rounded" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="w-16 h-3 bg-gray-700 rounded mb-1" />
          <div className="w-20 h-4 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  </div>
);
export default PositionRecordShimmer;
