import { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import { getRecentListings, propertyToCardListing } from "@/lib/bridge";

export const metadata: Metadata = {
  title: "Our Listings | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Browse luxury property listings across South Florida — Miami-Dade, Broward, and Palm Beach counties. Curated homes and condos from Andrew Whalen and LoKation Real Estate.",
  openGraph: {
    title: "Our Listings | Andrew Whalen",
    description:
      "Luxury property listings across South Florida from Andrew Whalen and LoKation Real Estate.",
    type: "website",
    url: "https://iamandrewwhalen.com/our-listings",
  },
};

export default async function OurListingsPage() {
  const listings = await getRecentListings(24);
  const cards = listings.map((listing) => propertyToCardListing(listing));

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
              Andrew Whalen | LoKation Real Estate
            </p>
            <h1 className="font-playfair text-5xl md:text-6xl font-light text-white">
              Our Listings
            </h1>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[#0a0a0a] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-10">
            {cards.length} Properties
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((listing) => (
              <PropertyCard key={listing.href} {...listing} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-neutral-500 text-sm mb-6">
              Looking for something specific?
            </p>
            <a
              href="/contact/"
              className="inline-block border border-white/30 rounded-full px-10 py-4 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
            >
              Contact Andrew
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
