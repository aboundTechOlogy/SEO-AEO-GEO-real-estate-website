import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";
import PropertyMap from "@/components/PropertyMap";
import { getProperty } from "@/lib/bridge";
import { calculatePricePerSqft, formatAddress, formatCurrency, getListingPhotos } from "@/lib/property-utils";

interface Props {
  params: Promise<{ listingKey: string }>;
}

export const revalidate = 3600;

function arrayOrFallback(values: string[]): string[] {
  return values.filter(Boolean).length > 0 ? values : ["Not specified"];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { listingKey } = await params;
  const property = await getProperty(listingKey);

  if (!property) {
    return {
      title: "Property Not Found | Andrew Whalen",
      description: "The requested property listing could not be found.",
    };
  }

  const address = formatAddress(property);
  const photos = getListingPhotos(property);
  const price = property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice;

  return {
    title: `${address} | ${formatCurrency(price)} | Andrew Whalen`,
    description:
      property.PublicRemarks?.slice(0, 160) ||
      `${address} in ${property.City}, ${property.StateOrProvince} ${property.PostalCode}.`,
    openGraph: {
      title: `${address} | Andrew Whalen`,
      description:
        property.PublicRemarks?.slice(0, 160) ||
        `${address} in ${property.City}, ${property.StateOrProvince} ${property.PostalCode}.`,
      type: "website",
      url: `https://iamandrewwhalen.com/property/${property.ListingKey}/`,
      images: photos[0]?.MediaURL
        ? [
            {
              url: photos[0].MediaURL,
              alt: address,
            },
          ]
        : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { listingKey } = await params;
  const property = await getProperty(listingKey);

  if (!property) {
    notFound();
  }

  const photos = getListingPhotos(property);
  const address = formatAddress(property);
  const price = property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice;
  const original = property.OriginalListPrice;
  const priceDiffPercent =
    original && original > 0 && original !== price ? Math.round(((price - original) / original) * 1000) / 10 : null;
  const pricePerSqft = calculatePricePerSqft(price, property.LivingArea);

  const detailRows = [
    ["Property Type", property.PropertyType || "-"],
    ["Sub Type", property.PropertySubType || "-"],
    ["Year Built", property.YearBuilt?.toString() || "-"],
    ["Lot Size", property.LotSizeArea ? `${property.LotSizeArea.toLocaleString()} sq ft` : "-"],
    ["Living Area", property.LivingArea ? `${property.LivingArea.toLocaleString()} sq ft` : "-"],
    ["Garage Spaces", property.GarageSpaces?.toString() || "-"],
    [
      "Association Fee",
      property.AssociationFee ? `${formatCurrency(property.AssociationFee)} ${property.AssociationFeeFrequency || ""}`.trim() : "-",
    ],
    ["Days on Market", property.DaysOnMarket !== null ? property.DaysOnMarket.toString() : "-"],
  ];

  const featureGroups = [
    { label: "Interior Features", values: arrayOrFallback(property.InteriorFeatures) },
    { label: "Exterior Features", values: arrayOrFallback(property.ExteriorFeatures) },
    { label: "Appliances", values: arrayOrFallback(property.Appliances) },
    { label: "Cooling", values: arrayOrFallback(property.Cooling) },
    { label: "Heating", values: arrayOrFallback(property.Heating) },
    { label: "Parking", values: arrayOrFallback(property.ParkingFeatures) },
    { label: "Building Features", values: arrayOrFallback(property.BuildingFeatures) },
  ];

  const hasLongRemarks = (property.PublicRemarks || "").length > 520;
  const shortRemarks = (property.PublicRemarks || "").slice(0, 520);

  return (
    <>
      <div className="h-[50px] lg:h-[82px] min-[1440px]:h-[90px]" />

      <section className="bg-[#0a0a0a] px-6 py-10 md:py-12">
        <div className="max-w-7xl mx-auto space-y-7">
          <div>
            <p className="text-neutral-400 text-xs uppercase tracking-[0.2em] mb-2">{property.PropertySubType || "Listing"}</p>
            <h1 className="font-playfair text-3xl md:text-5xl text-white">{address}</h1>
            <p className="text-neutral-400 mt-2">
              {property.City}, {property.StateOrProvince} {property.PostalCode}
            </p>
          </div>

          <PropertyGallery photos={photos} address={address} />
        </div>
      </section>

      <section className="bg-neutral-900 border-y border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-end gap-8 md:gap-12">
          <div>
            <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mb-2">Price</p>
            <p className="font-playfair text-4xl text-white">{formatCurrency(price)}</p>
            {priceDiffPercent !== null && (
              <p className={`text-sm mt-2 ${priceDiffPercent < 0 ? "text-emerald-300" : "text-red-300"}`}>
                {priceDiffPercent > 0 ? "+" : ""}
                {priceDiffPercent}% vs original list
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-300">
            <span>{property.BedroomsTotal} Beds</span>
            <span className="text-neutral-600">|</span>
            <span>{property.BathroomsFull} Full Baths</span>
            <span className="text-neutral-600">|</span>
            <span>{property.BathroomsHalf} Half Bath</span>
            <span className="text-neutral-600">|</span>
            <span>{property.LivingArea ? `${property.LivingArea.toLocaleString()} Sq.Ft` : "Sq.Ft N/A"}</span>
            <span className="text-neutral-600">|</span>
            <span>{pricePerSqft ? `$${pricePerSqft.toLocaleString()}/Sq.Ft` : "$/Sq.Ft N/A"}</span>
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a] px-6 py-14 md:py-16">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.65fr_0.95fr] items-start">
          <div className="space-y-10">
            <div>
              <h2 className="font-playfair text-3xl text-white mb-4">Description</h2>
              {hasLongRemarks ? (
                <>
                  <p className="text-neutral-300 leading-relaxed">{shortRemarks}...</p>
                  <details className="mt-4 border border-white/10 p-4 bg-neutral-900/40">
                    <summary className="text-sm uppercase tracking-[0.12em] text-neutral-300 cursor-pointer">Read full description</summary>
                    <p className="text-neutral-300 leading-relaxed mt-4">{property.PublicRemarks}</p>
                  </details>
                </>
              ) : (
                <p className="text-neutral-300 leading-relaxed">{property.PublicRemarks || "No description provided."}</p>
              )}
            </div>

            <div>
              <h2 className="font-playfair text-3xl text-white mb-5">Property Details</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {detailRows.map(([label, value]) => (
                  <div key={label} className="border border-white/10 p-4 bg-neutral-900/40">
                    <p className="text-neutral-500 text-xs uppercase tracking-[0.12em] mb-2">{label}</p>
                    <p className="text-neutral-200 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-playfair text-3xl text-white mb-5">Features & Amenities</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {featureGroups.map((group) => (
                  <div key={group.label} className="border border-white/10 p-4 bg-neutral-900/30">
                    <p className="text-neutral-400 text-xs uppercase tracking-[0.12em] mb-3">{group.label}</p>
                    <ul className="space-y-2">
                      {group.values.map((value) => (
                        <li key={`${group.label}-${value}`} className="flex items-start gap-2 text-neutral-300 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-1.5 shrink-0" />
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-playfair text-3xl text-white mb-5">Location Map</h2>
              <PropertyMap
                center={{ lat: property.Latitude || 25.7617, lng: property.Longitude || -80.1918 }}
                zoom={16}
                interactive={true}
                markers={
                  property.Latitude && property.Longitude
                    ? [
                        {
                          lat: property.Latitude,
                          lng: property.Longitude,
                          price,
                          listingKey: property.ListingKey,
                        },
                      ]
                    : []
                }
                className="h-[340px]"
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <h2 className="font-playfair text-2xl text-white mb-3">MLS Compliance</h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-2">
                Listing Agent: {property.ListAgentFullName || "Not Provided"} | Listing Office: {property.ListOfficeName || "Not Provided"}
              </p>
              <p className="text-neutral-500 text-xs leading-relaxed">
                The multiple listing information is provided by the Miami Association of Realtors from a copyrighted compilation of listings.
                The information provided is for consumers' personal, noncommercial use and may not be used for any purpose other than to
                identify prospective properties consumers may be interested in purchasing. All properties are subject to prior sale or
                withdrawal. All information is deemed reliable but not guaranteed.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="bg-neutral-900 border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-4">
                <img src="/andrew-headshot.png" alt="Andrew Whalen" className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <p className="font-playfair text-2xl text-white leading-none">Andrew Whalen</p>
                  <p className="text-neutral-400 text-sm">LoKation Real Estate</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <a href="tel:+13054559744" className="block text-neutral-200 hover:text-white transition-colors">
                  (305) 455-9744
                </a>
                <a href="mailto:Andrew@IamAndrewWhalen.com" className="block text-neutral-200 hover:text-white transition-colors">
                  Andrew@IamAndrewWhalen.com
                </a>
              </div>

              <PropertyInquiryForm listingKey={property.ListingKey} address={address} />
            </div>
          </aside>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: address,
            description: property.PublicRemarks || `${address} listing details`,
            url: `https://iamandrewwhalen.com/property/${property.ListingKey}/`,
            datePosted: property.ListingContractDate || undefined,
            offers: {
              "@type": "Offer",
              price,
              priceCurrency: "USD",
              availability: property.StandardStatus === "Closed" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: address,
              addressLocality: property.City,
              addressRegion: property.StateOrProvince,
              postalCode: property.PostalCode,
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: property.Latitude,
              longitude: property.Longitude,
            },
            numberOfRooms: property.BedroomsTotal,
            numberOfBathroomsTotal: property.BathroomsTotalInteger,
            floorSize: {
              "@type": "QuantitativeValue",
              value: property.LivingArea,
              unitCode: "FTK",
            },
            amenityFeature: featureGroups.map((group) => ({
              "@type": "LocationFeatureSpecification",
              name: group.label,
              value: group.values.join(", "),
            })),
          }),
        }}
      />
    </>
  );
}
