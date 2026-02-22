export default function InterceptedPropertyLoading() {
  return (
    <div className="fixed inset-0 z-[150]">
      <div className="absolute inset-0 bg-black/60" />
      <aside className="absolute inset-y-0 right-0 w-full sm:max-w-[600px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl">
        <div className="h-full overflow-y-auto px-5 py-6 space-y-4">
          <div className="h-8 w-40 bg-white/10 animate-pulse rounded" />
          <div className="h-[300px] bg-white/10 animate-pulse rounded" />
          <div className="h-10 w-56 bg-white/10 animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 bg-white/10 animate-pulse rounded" />
            <div className="h-16 bg-white/10 animate-pulse rounded" />
            <div className="h-16 bg-white/10 animate-pulse rounded" />
            <div className="h-16 bg-white/10 animate-pulse rounded" />
          </div>
          <div className="h-24 bg-white/10 animate-pulse rounded" />
          <div className="h-40 bg-white/10 animate-pulse rounded" />
        </div>
      </aside>
    </div>
  );
}
