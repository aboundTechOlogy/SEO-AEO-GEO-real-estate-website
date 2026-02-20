import { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildings } from "@/data/buildings";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return buildings.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const building = buildings.find((b) => b.slug === slug);
  if (!building) return {};
  return {
    title: `${building.name} | Andrew Whalen | South Florida Luxury Real Estate`,
    description: building.description,
    openGraph: {
      title: `${building.name} | Andrew Whalen`,
      description: building.description,
      type: "website",
      url: `https://iamandrewwhalen.com/luxury-condos/${building.slug}`,
    },
  };
}

export default async function BuildingDetailPage({ params }: Props) {
  const { slug } = await params;
  const building = buildings.find((b) => b.slug === slug);

  if (!building) notFound();

  const countyLabel = {
    "miami-dade": "Miami-Dade County",
    broward: "Broward County",
    "palm-beach": "Palm Beach County",
  }[building.county];

  const countyPath = {
    "miami-dade": "/luxury-condos/",
    broward: "/luxury-condos/broward/",
    "palm-beach": "/luxury-condos/palm-beach/",
  }[building.county];

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
              Luxury Condos &middot; {countyLabel}
            </p>
            <h1 className="font-playfair text-4xl md:text-5xl font-light text-white max-w-3xl">
              {building.name}
            </h1>
            <p className="text-neutral-300 text-lg mt-3">
              {building.neighborhood}
            </p>
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
              href="/luxury-condos/"
              className="hover:text-white transition-colors"
            >
              Luxury Condos
            </a>
            <span>/</span>
            <a href={countyPath} className="hover:text-white transition-colors">
              {countyLabel}
            </a>
            <span>/</span>
            <span className="text-neutral-300">{building.name}</span>
          </nav>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#0a0a0a] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Building image placeholder */}
          <div className="w-full aspect-video bg-gradient-to-br from-neutral-800 to-neutral-950 mb-12 flex items-center justify-center">
            <p className="text-neutral-600 text-sm uppercase tracking-widest">
              {building.name} — Photo Coming Soon
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: description */}
            <div className="lg:col-span-2">
              <h2 className="font-playfair text-3xl text-white mb-6">
                About {building.name}
              </h2>
              <p className="text-neutral-300 leading-relaxed text-lg mb-8">
                {building.description}
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Located in {building.neighborhood}, {countyLabel}, this
                landmark residential tower represents the pinnacle of South
                Florida luxury living. With {building.units} total residences
                across {building.floors} stories, {building.name} offers
                residents an unparalleled combination of design, amenities, and
                location.
              </p>
            </div>

            {/* Right: details */}
            <div>
              <div className="bg-neutral-900 border border-white/5 p-8">
                <h3 className="font-playfair text-xl text-white mb-6">
                  Building Details
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                      Location
                    </dt>
                    <dd className="text-white text-sm">
                      {building.neighborhood}, {countyLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                      Year Built
                    </dt>
                    <dd className="text-white text-sm">{building.yearBuilt}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                      Total Units
                    </dt>
                    <dd className="text-white text-sm">{building.units}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                      Stories
                    </dt>
                    <dd className="text-white text-sm">{building.floors}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                      Price Range
                    </dt>
                    <dd className="text-white text-sm">
                      Contact for current pricing
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 space-y-3">
                  <a
                    href="/search/"
                    className="block w-full text-center bg-white text-black py-3 text-sm uppercase tracking-wider font-medium hover:bg-neutral-200 transition-colors"
                  >
                    View Available Units
                  </a>
                  <a
                    href="/contact/"
                    className="block w-full text-center border border-white/30 text-white py-3 text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
                  >
                    Get Building Report
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="bg-neutral-900/30 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <a
            href={countyPath}
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-wider"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to {countyLabel} Luxury Condos
          </a>
        </div>
      </section>
    </>
  );
}
