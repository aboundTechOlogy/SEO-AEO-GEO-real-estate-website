import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Testimonials | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Read what clients say about working with Andrew Whalen. 1,300+ transactions and 21+ years serving South Florida's luxury real estate market.",
  openGraph: {
    title: "Client Testimonials | Andrew Whalen",
    description: "Read what clients say about working with Andrew Whalen.",
    type: "website",
    url: "https://iamandrewwhalen.com/testimonials",
  },
};

const TESTIMONIALS = [
  {
    quote: "Andrew was an absolute pleasure to work with. His knowledge of the Miami market is unmatched. He helped us close on our dream home in Brickell in under 30 days — well below asking price.",
    name: "Michael & Jennifer R.",
    role: "Buyers — Brickell",
    rating: 5,
  },
  {
    quote: "I've worked with many agents across South Florida. Andrew is in a different category. His data-driven approach and negotiation skills helped us sell our Coconut Grove estate for 12% above asking.",
    name: "Carlos M.",
    role: "Seller — Coconut Grove",
    rating: 5,
  },
  {
    quote: "Andrew's expertise in new construction is exceptional. He guided us through the pre-construction process for our Edgewater unit from deposit to closing — flawlessly. We've already made significant gains.",
    name: "Sarah & David L.",
    role: "Investors — Edgewater",
    rating: 5,
  },
  {
    quote: "From the first call, I knew Andrew was different. He took the time to understand exactly what we needed, showed us only the right properties, and negotiated a deal that exceeded our expectations.",
    name: "Alexandra V.",
    role: "Buyer — Miami Beach",
    rating: 5,
  },
  {
    quote: "Andrew helped us sell our Coral Gables home and find our next property simultaneously — coordinating both closings perfectly. His professionalism and market knowledge are truly exceptional.",
    name: "Robert & Patricia H.",
    role: "Sellers & Buyers — Coral Gables",
    rating: 5,
  },
  {
    quote: "As an international buyer, I needed an agent I could trust completely. Andrew's communication, expertise, and attention to detail made the entire process smooth. I'm now the proud owner of a stunning Fisher Island condo.",
    name: "Marcus B.",
    role: "International Buyer — Fisher Island",
    rating: 5,
  },
  {
    quote: "Andrew's market analysis was spot-on. He priced our Aventura unit perfectly, and we had multiple offers within the first week. Closed in 45 days with zero issues. Truly a professional.",
    name: "Diana & James K.",
    role: "Sellers — Aventura",
    rating: 5,
  },
  {
    quote: "We relocated from New York and Andrew made the entire process seamless. He understood our needs immediately and found us the perfect Brickell condo. His knowledge of the luxury market is exceptional.",
    name: "Thomas & Elena W.",
    role: "Relocating Buyers — Brickell",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <img src="/hero-miami.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/85" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <div>
            <p className="text-neutral-400 text-sm uppercase tracking-[0.3em] mb-4">Andrew Whalen</p>
            <h1 className="font-playfair text-5xl md:text-6xl font-light text-white">Testimonials</h1>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-[#0a0a0a] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="relative bg-neutral-900/50 border border-white/5 p-8 lg:p-10"
              >
                <span
                  className="font-playfair text-[100px] leading-none text-white/5 absolute top-0 left-6 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <div className="relative">
                  <StarRating count={t.rating} />
                  <p className="font-playfair italic text-base text-neutral-300 leading-relaxed mt-4 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-neutral-500 text-sm mb-6">Ready to start your own success story?</p>
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
