export default function InterceptedPropertyLoading() {
  return (
    <div className="fixed inset-0 z-[150]">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1.5px]" />

      <aside className="fixed inset-0 lg:inset-y-0 lg:left-1/2 lg:-translate-x-1/2 lg:w-[min(1200px,calc(100%-56px))] border-0 lg:border lg:border-black/15 bg-[#f5f5f5] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <div className="h-full overflow-y-auto overscroll-contain">
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
