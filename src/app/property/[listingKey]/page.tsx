import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";
import {
  AmenitiesSection,
  BASIC_INFO_ICON_MAP,
  DetailSection,
  EstPaymentLink,
  LocationSection,
  PropertyMediaTabs,
  SimilarListingsSection,
} from "@/components/PropertyDetailPanel";
import { fetchIdxSearch, getProperty } from "@/lib/bridge";
import {
  buildIdxDetailSections,
  buildIdxLegalDisclosure,
  calculatePricePerSqft,
  extractListingKeyFromSlug,
  formatAddress,
  formatCurrency,
  generatePropertySlug,
  getListingPhotos,
} from "@/lib/property-utils";

interface Props {
  params: Promise<{ listingKey: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { listingKey: slugOrKey } = await params;
  const actualKey = extractListingKeyFromSlug(slugOrKey);
  const property = await getProperty(actualKey);

  if (!property) {
    return {
      title: "Property Not Found | Andrew Whalen",
      description: "The requested property listing could not be found.",
    };
  }

  const address = formatAddress(property);
  const photos = getListingPhotos(property);
  const price = property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice;
  const slug = generatePropertySlug(property);
  const canonicalUrl = `https://iamandrewwhalen.com/property/${slug}/`;

  return {
    title: `${address} | ${formatCurrency(price)} | Andrew Whalen`,
    description:
      property.PublicRemarks?.slice(0, 160) ||
      `${address} in ${property.City}, ${property.StateOrProvince} ${property.PostalCode}.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${address} | Andrew Whalen`,
      description:
        property.PublicRemarks?.slice(0, 160) ||
        `${address} in ${property.City}, ${property.StateOrProvince} ${property.PostalCode}.`,
      type: "website",
      url: canonicalUrl,
      images: photos[0]?.MediaURL
        ? [{ url: photos[0].MediaURL, alt: address }]
        : undefined,
    },
  };
}


function StatMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-[15px] py-[10px] text-center uppercase text-gray-500">
      <p className="text-[17px] lg:text-[24px] leading-none font-semibold text-[#1a1a1a]">{value}</p>
      <p className="mt-[3px] text-[11px] lg:text-[12px] leading-none">{label}</p>
    </div>
  );
}

function estimateMonthlyPayment(price: number | null | undefined): string | null {
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return null;
  }

  const principal = price * 0.8;
  const monthlyRate = 0.065 / 12;
  const payments = 360;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
    (Math.pow(1 + monthlyRate, payments) - 1);

  if (!Number.isFinite(payment)) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(payment));
}

export default async function PropertyDetailPage({ params }: Props) {
  const { listingKey: slugOrKey } = await params;
  const actualKey = extractListingKeyFromSlug(slugOrKey);
  const property = await getProperty(actualKey);

  if (!property) {
    notFound();
  }

  // 301 redirect raw listingKey URLs → canonical slug URL
  const slug = generatePropertySlug(property);
  if (slugOrKey !== slug) {
    permanentRedirect(`/property/${slug}/`);
  }

  const photos = getListingPhotos(property);
  const address = formatAddress(property);
  const price = property.StandardStatus === "Closed" ? property.ClosePrice || property.ListPrice : property.ListPrice;
  const estimatedPayment = estimateMonthlyPayment(price);
  const pricePerSqft = calculatePricePerSqft(price, property.LivingArea);
  const bathsCount =
    property.BathroomsTotalInteger ??
    (property.BathroomsFull || property.BathroomsHalf
      ? Number((property.BathroomsFull + property.BathroomsHalf * 0.5).toFixed(1))
      : 0);
  const halfBathValue = property.BathroomsHalf ? String(property.BathroomsHalf) : "--";
  const details = buildIdxDetailSections(property);
  const legal = buildIdxLegalDisclosure(property);

  const lat = property.Latitude;
  const lng = property.Longitude;
  const similarListings = await fetchIdxSearch({
    status: "Active",
    top: 8,
    skip: 0,
    orderby: "ListPrice desc",
    q: property.City || undefined,
  });

  const featureGroups = [
    { label: "Amenities", values: details.amenities },
    { label: "Interior Features", values: property.InteriorFeatures?.filter(Boolean) || [] },
    { label: "Exterior Features", values: property.ExteriorFeatures?.filter(Boolean) || [] },
    { label: "Appliances", values: property.Appliances?.filter(Boolean) || [] },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: address,
    description: property.PublicRemarks || `${address} listing details`,
    url: `https://iamandrewwhalen.com/property/${slug}/`,
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
    amenityFeature: featureGroups
      .filter((group) => group.values.length > 0)
      .map((group) => ({
        "@type": "LocationFeatureSpecification",
        name: group.label,
        value: group.values.join(", "),
      })),
  };

  return (
    <>
      <div className="h-[50px] lg:h-[82px] min-[1440px]:h-[90px]" />

      <div className="bg-[#f5f5f5]">
        <div className="border-b border-black/10 bg-white">
          <div className="max-w-[1200px] mx-auto px-[15px] py-[15px]">
            <h1 className="text-[20px] lg:text-[24px] leading-[1.1] font-semibold text-[#1a1a1a]">{address}</h1>
            <p className="text-[13px] lg:text-[15px] text-gray-600 mt-1">
              {property.City}, {property.StateOrProvince} {property.PostalCode}
            </p>
          </div>
        </div>

        <div className="border-b border-black/10 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <PropertyMediaTabs photos={photos} address={address} latitude={lat} longitude={lng} virtualTourUrl={property.VirtualTourURLUnbranded} singleHero />
          </div>
        </div>

        {/* Action bar — Save / Share / Phone / Contact (sticky, matches Carroll) */}
        <div className="sticky top-[50px] lg:top-[82px] min-[1440px]:top-[90px] z-20 border-b border-black/10 bg-white">
          <div className="max-w-[1200px] mx-auto grid grid-cols-4 h-[45px]">
            <button type="button" className="border-r border-gray-200 text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-[13px]" aria-label="Save">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
              <span className="hidden sm:inline">Save</span>
            </button>
            <button type="button" className="border-r border-gray-200 text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-[13px]" aria-label="Share">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
              <span className="hidden sm:inline">Share</span>
            </button>
            <a href="tel:+13054559744" className="border-r border-gray-200 text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-[13px]" aria-label="Call">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
              <span className="hidden sm:inline">(305) 455-9744</span>
            </a>
            <a href="mailto:Andrew@IamAndrewWhalen.com" className="text-[#1a1a1a] hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-[13px]" aria-label="Email">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
              <span className="hidden sm:inline">Request Info</span>
            </a>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto">
          <div className="grid items-start lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="min-w-0 border-r-0 lg:border-r lg:border-gray-200">
              {/* Price + Stats */}
              <div className="border-b border-gray-200 bg-white">
                <div className="flex items-end justify-between gap-4 px-[15px] py-[15px] border-b border-gray-200">
                  <p className="text-[22px] font-semibold leading-none text-[#1a1a1a]">{formatCurrency(price)}</p>
                  <div className="text-right">
                    <p className="text-[13px] text-gray-500">Est. Payment</p>
                    <p className="text-[13px] leading-none">
                      {estimatedPayment ? <EstPaymentLink label={`${estimatedPayment}/mo`} listPrice={price} /> : "--"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 divide-x divide-gray-200">
                  <StatMetric label="Beds" value={String(property.BedroomsTotal || 0)} />
                  <StatMetric label="Baths" value={String(bathsCount || 0)} />
                  <div className="hidden sm:block"><StatMetric label="Half Bath" value={halfBathValue} /></div>
                  <StatMetric label="Sq.Ft" value={property.LivingArea ? property.LivingArea.toLocaleString() : "-"} />
                  <StatMetric label="$/SqFt" value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "-"} />
                </div>
              </div>

              {/* Basic Information FIRST (matches Carroll) */}
              <DetailSection title="Basic Information" rows={details.basicInformationRows} iconMap={BASIC_INFO_ICON_MAP} />

              {/* Description AFTER Basic Info */}
              <section className="bg-white border-b border-gray-200">
                <div className="bg-[#f5f5f5] border-y border-gray-200 px-[15px] py-[10px]">
                  <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a]">Description</h3>
                </div>
                <div className="px-[15px] py-[12px]">
                  <p className="text-[14px] leading-[1.6] text-gray-700">{details.description}</p>
                </div>
              </section>

              <AmenitiesSection amenities={details.amenities} />
              <DetailSection title="Exterior Features" rows={details.exteriorFeatureRows} />
              <DetailSection title="Interior Features" rows={details.interiorFeatureRows} />
              <DetailSection title="Property Features" rows={details.propertyFeatureRows} />
              <LocationSection
                latitude={lat}
                longitude={lng}
                address={address}
                addressShort={[property.StreetNumber, property.StreetName].filter(Boolean).join(" ") || address}
                addressLong={`${property.City || ""}, ${property.StateOrProvince || ""} ${property.PostalCode || ""}`}
              />
              <SimilarListingsSection listingKey={actualKey} city={property.City} listings={similarListings} />

              <section className="bg-[#f5f5f5] border-b border-gray-200 px-[15px] py-[20px] text-[11px] text-gray-500 leading-[1.6] space-y-2">
                {legal.courtesyLine && <p>{legal.courtesyLine}</p>}
                <p>{legal.disclaimer}</p>
              </section>
            </div>

            <aside className="hidden lg:block p-[15px] self-start">
              <div className="border border-gray-200 bg-white p-[15px] space-y-[15px] sticky top-[82px]">
                <div className="flex items-center gap-3">
                  <img src="/andrew-headshot.png" alt="Andrew Whalen" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="text-[#1a1a1a] font-semibold leading-none">Andrew Whalen</p>
                    <p className="text-gray-600 text-sm">LoKation Real Estate</p>
                    <a href="tel:+13054559744" className="text-sm text-[#1a1a1a] hover:underline">
                      (305) 455-9744
                    </a>
                  </div>
                </div>
                <PropertyInquiryForm listingKey={property.ListingKey} address={address} theme="light" />
              </div>
            </aside>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </>
  );
}
