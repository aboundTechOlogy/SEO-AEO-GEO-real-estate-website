import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";
import {
  AmenitiesSection,
  BASIC_INFO_ICON_MAP,
  DetailSection,
  LocationSection,
  PropertyMediaTabs,
  SimilarListingsSection,
} from "@/components/PropertyDetailPanel";
import { fetchIdxSearch, getProperty } from "@/lib/bridge";
import {
  buildIdxDetailSections,
  buildIdxLegalDisclosure,
  calculatePricePerSqft,
  formatAddress,
  formatCurrency,
  getListingPhotos,
} from "@/lib/property-utils";

interface Props {
  params: Promise<{ listingKey: string }>;
}

export const revalidate = 3600;

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
  const { listingKey } = await params;
  const property = await getProperty(listingKey);

  if (!property) {
    notFound();
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
            <PropertyMediaTabs photos={photos} address={address} latitude={lat} longitude={lng} />
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto">
          <div className="grid items-start lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="min-w-0 border-r-0 lg:border-r lg:border-gray-200">
              <div className="border-b border-gray-200 bg-white">
                <div className="flex items-end justify-between gap-4 px-[15px] py-[15px] border-b border-gray-200">
                  <p className="text-[22px] font-semibold leading-none text-[#1a1a1a]">{formatCurrency(price)}</p>
                  <div className="text-right">
                    <p className="text-[13px] text-gray-500">Est. Payment</p>
                    <p className="text-[13px] font-semibold leading-none text-[#1a1a1a]">
                      {estimatedPayment ? `${estimatedPayment}/mo` : "--"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-gray-200">
                  <StatMetric label="Beds" value={String(property.BedroomsTotal || 0)} />
                  <StatMetric label="Baths" value={String(bathsCount || 0)} />
                  <StatMetric label="Half Bath" value={halfBathValue} />
                  <StatMetric label="Sq.Ft" value={property.LivingArea ? property.LivingArea.toLocaleString() : "-"} />
                  <StatMetric label="$/SqFt" value={pricePerSqft ? `$${pricePerSqft.toLocaleString()}` : "-"} />
                </div>
              </div>

              <section className="bg-white border-b border-gray-200">
                <div className="bg-[#f5f5f5] border-y border-gray-200 px-[15px] py-[10px]">
                  <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a]">Description</h3>
                </div>
                <div className="px-[15px] py-[12px]">
                  <p className="text-[14px] leading-[1.6] text-gray-700">{details.description}</p>
                </div>
              </section>

              <DetailSection title="Basic Information" rows={details.basicInformationRows} iconMap={BASIC_INFO_ICON_MAP} />
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
              <SimilarListingsSection listingKey={listingKey} city={property.City} listings={similarListings} />

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
