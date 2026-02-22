export default function InterceptedPropertyLoading() {
  return (
    <div className="fixed inset-0 z-[150]">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1.5px]" />

      <aside className="absolute inset-0 sm:inset-x-4 sm:top-20 sm:bottom-4 lg:inset-x-[5vw] lg:top-24 lg:bottom-6 border-0 sm:border sm:border-black/15 bg-[#f5f5f5] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <div className="h-full overflow-y-auto">
          <div className="h-20 bg-white border-b border-gray-200 animate-pulse" />
          <div className="h-[42vh] min-h-[260px] bg-white border-b border-gray-200 animate-pulse" />
          <div className="h-14 bg-white border-b border-gray-200 animate-pulse" />

          <div className="p-4 space-y-4">
            <div className="h-24 bg-white border border-gray-200 animate-pulse" />
            <div className="h-36 bg-white border border-gray-200 animate-pulse" />
            <div className="h-52 bg-white border border-gray-200 animate-pulse" />
          </div>
        </div>
      </aside>
    </div>
  );
}
