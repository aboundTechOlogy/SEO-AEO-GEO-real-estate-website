import { Metadata } from "next";
import { neighborhoods } from "@/data/neighborhoods";
import PropertyMap from "@/components/PropertyMap";

export const metadata: Metadata = {
  title: "Broward County Neighborhoods | Andrew Whalen",
  description:
    "Explore Broward County neighborhoods — Fort Lauderdale, Hollywood, Pompano Beach, Hallandale Beach, Parkland, Weston, and more. Andrew Whalen, South Florida luxury real estate.",
  openGraph: {
    title: "Broward County Neighborhoods | Andrew Whalen",
    description:
      "Broward County neighborhoods with Andrew Whalen, South Florida luxury real estate specialist.",
    type: "website",
    url: "https://iamandrewwhalen.com/neighborhoods/broward",
  },
};

export default function BrowardNeighborhoodsPage() {
  const browardNeighborhoods = neighborhoods.filter(
    (n) => n.county === "broward"
  );

  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <img
          src="/hero-miami.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/85" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <div>
            <p className="text-neutral-400 text-sm uppercase tracking-[0.3em] mb-4">
              Andrew Whalen
            </p>
            <h1 className="font-playfair text-5xl md:text-6xl font-light text-white">
              Broward County
            </h1>
            <p className="text-neutral-300 text-lg mt-3">Neighborhoods</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span>/</span>
            <a
              href="/neighborhoods/"
              className="hover:text-white transition-colors"
            >
              Neighborhoods
            </a>
            <span>/</span>
            <span className="text-neutral-300">Broward County</span>
          </nav>
        </div>
      </section>

      {/* Split panel */}
      <section className="bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Map panel — desktop left */}
            <div className="hidden lg:block lg:w-[40%] min-h-[600px] bg-neutral-900 border-r border-white/5 sticky top-32 self-start h-[calc(100vh-8rem)] p-4">
              <PropertyMap center={{ lat: 26.1224, lng: -80.1373 }} zoom={10} className="h-full" interactive={true} />
            </div>

            {/* Neighborhood grid — right */}
            <div className="lg:w-[60%] px-6 py-12">
              <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-8">
                {browardNeighborhoods.length} Neighborhoods in Broward County
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {browardNeighborhoods.map((n) => (
                  <a
                    key={n.slug}
                    href={`/neighborhoods/${n.slug}/`}
                    className="group relative bg-neutral-900 border border-white/5 hover:border-white/20 transition-all p-6"
                  >
                    <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-950 mb-4 flex items-center justify-center">
                      <span className="text-neutral-700 text-xs uppercase tracking-widest">
                        {n.name}
                      </span>
                    </div>
                    <h3 className="font-playfair text-xl text-white mb-1">
                      {n.name}
                    </h3>
                    <p className="text-neutral-500 text-xs uppercase tracking-wider mb-4">
                      {n.tagline}
                    </p>
                    <div className="flex gap-2">
                      {n.propertyTypes.map((t) => (
                        <span
                          key={t}
                          className="bg-neutral-800 px-3 py-1 text-xs uppercase tracking-wider text-neutral-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
