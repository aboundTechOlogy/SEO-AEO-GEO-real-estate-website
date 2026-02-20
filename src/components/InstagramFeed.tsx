import SectionHeader from "@/components/SectionHeader";

export default function InstagramFeed() {
  return (
    <section className="bg-neutral-900 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Instagram profile header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center flex-shrink-0">
            <img src="/w-icon-logo.png" alt="" className="w-8 h-8 opacity-60" />
          </div>
          <div>
            <p className="text-white font-medium">@iamandrewwhalen</p>
            <p className="text-neutral-500 text-sm mt-0.5">South Florida Luxury Real Estate · LoKation Real Estate</p>
          </div>
          <a
            href="https://www.instagram.com/iamandrewwhalen/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto border border-white/30 rounded-full px-6 py-2 text-xs uppercase tracking-wider text-white hover:bg-white/10 transition-all"
          >
            Follow
          </a>
        </div>

        <SectionHeader
          subtitle="Andrew Whalen"
          title="On Instagram"
          align="left"
          className="mb-8"
        />

        {/* 4-column placeholder grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <a
              key={i}
              href="https://www.instagram.com/iamandrewwhalen/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square bg-gradient-to-br from-neutral-800 to-neutral-950 group overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.instagram.com/iamandrewwhalen/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
