export default function Loading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
