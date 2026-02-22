import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  neighborhoods,
  getNeighborhoodBySlug,
} from "@/data/neighborhoods";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return neighborhoods.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = getNeighborhoodBySlug(slug);
  if (!n) return {};

  return {
    title: `${n.name} Real Estate | Luxury Homes & Condos | Andrew Whalen`,
    description: n.heroDescription,
    openGraph: {
      title: `${n.name} — ${n.tagline} | Andrew Whalen`,
      description: n.heroDescription,
    },
  };
}

export default async function NeighborhoodPage({ params }: Props) {
  const { slug } = await params;
  const n = getNeighborhoodBySlug(slug);
  if (!n) notFound();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-neutral-500 text-sm uppercase tracking-wider mb-3">
            Neighborhood Guide
          </p>
          <h1 className="font-playfair text-5xl md:text-6xl mb-3">
            {n.name}
          </h1>
          <p className="font-playfair text-xl text-gray-600 italic mb-6">
            {n.tagline}
          </p>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            {n.heroDescription}
          </p>
        </div>
      </section>

      {/* Market Stats */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-3xl mb-8">
            Market Snapshot
          </h2>
          {/* Stats Table — HTML table for GEO statistical density */}
          <table className="w-full text-sm border-collapse mb-6">
            <caption className="sr-only">
              {n.name} real estate market statistics
            </caption>
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-3 text-gray-500 font-normal">Metric</th>
                <th className="py-3 text-gray-500 font-normal text-right">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-200">
                <td className="py-3">Median Price</td>
                <td className="py-3 text-right font-medium text-[#1a1a1a]">
                  {n.stats.medianPrice}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3">Avg Days on Market</td>
                <td className="py-3 text-right">{n.stats.avgDom}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3">Price per Sq Ft</td>
                <td className="py-3 text-right">{n.stats.pricePerSqft}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3">Active Inventory</td>
                <td className="py-3 text-right">
                  {n.stats.activeInventory}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3">Price Range</td>
                <td className="py-3 text-right">
                  {n.priceRange.low} – {n.priceRange.high}
                </td>
              </tr>
              <tr>
                <td className="py-3">Zip Codes</td>
                <td className="py-3 text-right">{n.zipCodes.join(", ")}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-neutral-600">
            Statistics are approximate and based on recent market activity.
            Contact Andrew for current data.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-playfair text-3xl mb-4">Overview</h2>
            <p className="text-gray-600 leading-relaxed">{n.overview}</p>
          </div>
          <div>
            <h2 className="font-playfair text-3xl mb-4">Lifestyle</h2>
            <p className="text-gray-600 leading-relaxed">{n.lifestyle}</p>
          </div>
        </div>
      </section>

      {/* Buyer Profile */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-3xl mb-4">
            Who Buys in {n.name}?
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            {n.buyerProfile}
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-3xl mb-8">Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {n.highlights.map((h) => (
              <div
                key={h}
                className="p-4 border border-gray-200 bg-white shadow-sm rounded-sm"
              >
                <p className="text-gray-700 text-sm">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — FAQPage schema for AEO */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-3xl mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl">
            {n.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-[#1a1a1a] font-medium mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-3xl mb-4">
            Explore {n.name}
          </h2>
          <p className="text-gray-600 mb-8">
            Ready to find your home in {n.name}? Whether you&apos;re buying,
            investing, or just exploring — I can help you navigate this market.
          </p>
          <a
            href={`mailto:andrew@iamandrewwhalen.com?subject=Interested in ${n.name} Real Estate`}
            className="inline-block px-8 py-3 bg-[#1a1a1a] hover:bg-[#333333] text-white transition-colors rounded-sm tracking-wider uppercase text-sm"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* FAQPage JSON-LD — AEO: targets Google AI Overviews + voice search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: n.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* Place JSON-LD — GEO: helps generative engines understand location context */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            name: n.name,
            description: n.overview,
            address: {
              "@type": "PostalAddress",
              addressLocality: n.name,
              addressRegion: "FL",
              addressCountry: "US",
              postalCode: n.zipCodes[0],
            },
            containedInPlace: {
              "@type": "City",
              name: "Miami",
              address: {
                "@type": "PostalAddress",
                addressRegion: "FL",
                addressCountry: "US",
              },
            },
          }),
        }}
      />
    </div>
  );
}
