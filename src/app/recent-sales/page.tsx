import { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import { getSoldListings, propertyToCardListing } from "@/lib/bridge";

export const metadata: Metadata = {
  title: "Recently Sold | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "View Andrew Whalen's recently sold luxury properties across South Florida — Miami, Fort Lauderdale, and Palm Beach. Proven track record of luxury market results.",
  openGraph: {
    title: "Recently Sold | Andrew Whalen",
    description:
      "Andrew Whalen's recently sold luxury properties across South Florida.",
    type: "website",
    url: "https://iamandrewwhalen.com/recent-sales",
  },
};

export default async function RecentSalesPage() {
  const listings = await getSoldListings(24);
  const cards = listings.map((listing) => propertyToCardListing(listing, true));

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
              Recently Sold
            </h1>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-10">
            {cards.length} Recently Sold Properties
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((listing) => (
              <PropertyCard key={listing.href} {...listing} isSold={true} theme="light" />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-neutral-500 text-sm mb-6">
              Ready to achieve results like these?
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
