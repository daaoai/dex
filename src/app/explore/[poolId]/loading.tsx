export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
