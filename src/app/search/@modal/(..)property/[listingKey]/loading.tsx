export default function InterceptedPropertyLoading() {
  return (
    <div className="fixed inset-0 z-[150] overflow-hidden">
      <div className="fixed inset-0 bg-black/65 backdrop-blur-[1.5px]" />

      <aside className="relative w-full h-screen md:my-[15px] md:h-[calc(100vh-30px)] md:w-[calc(100%-50px)] min-[1300px]:w-[1200px] md:mx-auto border-0 md:border md:border-black/15 bg-[#f5f5f5] shadow-[0_24px_70px_rgba(0,0,0,0.45)] overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
        <div className="min-h-full bg-[#f5f5f5]">
          <div className="sticky top-0 z-30 h-[70px] bg-white border-b border-black/10 animate-pulse" />

          <div className="border-b border-black/10 bg-white">
            <div className="w-full aspect-video lg:aspect-auto lg:h-[450px] bg-gray-100 animate-pulse" />
          </div>

          <div className="h-[45px] bg-white border-b border-gray-200 animate-pulse lg:hidden" />

          <div className="bg-white border-b border-black/10">
            <div className="grid items-start lg:grid-cols-[minmax(0,1fr)_310px] min-[1300px]:grid-cols-[minmax(0,1fr)_350px]">
              <div className="min-w-0 border-r-0 lg:border-r lg:border-gray-200">
                <div className="h-[140px] bg-white border-b border-gray-200 animate-pulse" />
                <div className="h-[220px] bg-white border-b border-gray-200 animate-pulse" />
                <div className="h-[300px] bg-white border-b border-gray-200 animate-pulse" />
                <div className="h-[76px] bg-white border-b border-gray-200 animate-pulse" />
                <div className="h-[84px] bg-white animate-pulse" />
              </div>

              <aside className="hidden lg:block p-[15px]">
                <div className="border border-gray-200 bg-white p-[15px] space-y-[15px] sticky top-[82px]">
                  <div className="h-20 bg-gray-100 animate-pulse" />
                  <div className="h-64 bg-gray-100 animate-pulse" />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
