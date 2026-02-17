import { Metadata } from "next";
import { mockProperty, OUR_BROKERAGE } from "./mockData";

export const metadata: Metadata = {
  title: `${mockProperty.UnparsedAddress} | $${mockProperty.ListPrice.toLocaleString()} | Andrew Whalen`,
  description: mockProperty.PublicRemarks.slice(0, 160),
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyDetailPage() {
  const p = mockProperty;

  return (
    <div className="pt-20">
      {/* Property Header */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-amber-500 text-sm uppercase tracking-wider mb-2">
                {p.PropertySubType} · {p.City}
              </p>
              <h1 className="font-playfair text-4xl md:text-5xl mb-2">
                {p.StreetNumber} {p.StreetName} {p.StreetSuffix}
              </h1>
              <p className="text-neutral-400">
                Unit {p.UnitNumber}, {p.City}, {p.StateOrProvince}{" "}
                {p.PostalCode}
              </p>
            </div>
            <div className="text-right">
              <p className="font-playfair text-4xl text-amber-500">
                {formatPrice(p.ListPrice)}
              </p>
              <p className="text-sm text-neutral-500">
                {p.DaysOnMarket} days on market
              </p>
            </div>
          </div>

          {/* Brokerage Attribution — Required by Schedule A §9 for non-LoKation listings */}
          {p.ListOfficeName !== OUR_BROKERAGE && (
            <div className="mb-6 p-3 border border-white/5 bg-white/[0.02] rounded-sm text-sm text-neutral-300">
              This listing is courtesy of{" "}
              <span className="text-white font-medium">{p.ListOfficeName}</span>
              {p.ListOfficePhone && (
                <span className="text-neutral-400"> · {p.ListOfficePhone}</span>
              )}
            </div>
          )}

          {/* Image Gallery Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-12">
            {p.Media.map((m, i) => (
              <div
                key={i}
                className={`bg-neutral-800 rounded-sm flex items-center justify-center ${
                  i === 0 ? "col-span-2 row-span-2 h-80" : "h-38"
                }`}
              >
                <span className="text-neutral-600 text-xs text-center px-4">
                  {m.ShortDescription}
                </span>
              </div>
            ))}
          </div>

          {/* Property Details Grid */}
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Details */}
            <div className="md:col-span-2">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-10 pb-10 border-b border-white/5">
                {[
                  { label: "Bedrooms", value: p.BedroomsTotal },
                  { label: "Bathrooms", value: p.BathroomsTotalInteger },
                  {
                    label: "Sq Ft",
                    value: p.LivingArea.toLocaleString(),
                  },
                  { label: "Year Built", value: p.YearBuilt },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-playfair text-2xl text-amber-500">
                      {s.value}
                    </p>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-10">
                <h2 className="font-playfair text-2xl mb-4">Description</h2>
                <p className="text-neutral-300 leading-relaxed">
                  {p.PublicRemarks}
                </p>
              </div>

              {/* Property Details Table */}
              <div className="mb-10">
                <h2 className="font-playfair text-2xl mb-4">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  {[
                    ["Property Type", p.PropertySubType],
                    ["Style", p.ArchitecturalStyle?.join(", ")],
                    ["Flooring", p.Flooring?.join(", ")],
                    ["Parking", `${p.ParkingTotal} spaces`],
                    ["Cooling", p.Cooling?.join(", ")],
                    ["Heating", p.Heating?.join(", ")],
                    [
                      "HOA Fee",
                      `${formatPrice(p.AssociationFee)}/${p.AssociationFeeFrequency}`,
                    ],
                    ["Annual Tax", formatPrice(p.TaxAnnualAmount)],
                    ["MLS #", p.ListingKey],
                    ["Status", p.StandardStatus],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between py-2 border-b border-white/5"
                    >
                      <span className="text-neutral-500">{label}</span>
                      <span className="text-neutral-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar — Agent Card */}
            <div>
              <div className="sticky top-24 p-6 border border-white/5 bg-white/[0.02] rounded-sm">
                <h3 className="font-playfair text-xl mb-1">
                  {p.ListAgentFullName}
                </h3>
                <p className="text-sm text-neutral-500 mb-4">
                  {p.ListOfficeName}
                </p>
                <div className="space-y-2 text-sm text-neutral-400 mb-6">
                  <p>{p.ListAgentEmail}</p>
                  <p>{p.ListOfficePhone}</p>
                </div>
                <a
                  href={`mailto:${p.ListAgentEmail}?subject=Inquiry: ${p.UnparsedAddress}`}
                  className="block w-full text-center px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white transition-colors rounded-sm text-sm uppercase tracking-wider"
                >
                  Schedule a Viewing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RealEstateListing JSON-LD — Agent nested in Offer (per PRD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: p.UnparsedAddress,
            description: p.PublicRemarks,
            url: `https://iamandrewwhalen.com/listings/miami-beach/condos/1500-ocean-drive-unit-5`,
            datePosted: p.ListingContractDate,
            offers: {
              "@type": "Offer",
              price: p.ListPrice,
              priceCurrency: "USD",
              offeredBy: {
                "@type": "RealEstateAgent",
                name: p.ListAgentFullName,
                worksFor: {
                  "@type": "Organization",
                  name: p.ListOfficeName,
                },
              },
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: `${p.StreetNumber} ${p.StreetName} ${p.StreetSuffix}, Unit ${p.UnitNumber}`,
              addressLocality: p.City,
              addressRegion: p.StateOrProvince,
              postalCode: p.PostalCode,
              addressCountry: p.Country,
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: p.Latitude,
              longitude: p.Longitude,
            },
            numberOfRooms: p.BedroomsTotal,
            numberOfBathroomsTotal: p.BathroomsTotalInteger,
            floorSize: {
              "@type": "QuantitativeValue",
              value: p.LivingArea,
              unitCode: "FTK",
            },
          }),
        }}
      />
    </div>
  );
}
