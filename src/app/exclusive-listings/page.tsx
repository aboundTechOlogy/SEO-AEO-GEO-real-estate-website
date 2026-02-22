import { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import { MOCK_EXCLUSIVE } from "@/data/mockListings";

export const metadata: Metadata = {
  title: "Exclusive Listings | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "View Andrew Whalen's exclusive luxury property listings in Miami, Fort Lauderdale, and Palm Beach. Handpicked South Florida luxury homes and condos.",
  openGraph: {
    title: "Exclusive Listings | Andrew Whalen",
    description:
      "Andrew Whalen's exclusive luxury property listings across South Florida.",
    type: "website",
    url: "https://iamandrewwhalen.com/exclusive-listings",
  },
};

export default function ExclusiveListingsPage() {
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
              Exclusive Listings
            </h1>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-10">
            {MOCK_EXCLUSIVE.length} Exclusive Properties
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_EXCLUSIVE.map((listing, i) => (
              <PropertyCard key={i} {...listing} theme="light" />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-neutral-500 text-sm mb-6">
              Looking for something specific?
            </p>
            <a
              href="/contact/"
              className="inline-block bg-[#1a1a1a] rounded-full px-10 py-4 text-sm uppercase tracking-wider text-white hover:bg-[#333333] transition-colors"
            >
              Contact Andrew
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
