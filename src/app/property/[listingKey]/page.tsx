import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";
import { getProperty } from "@/lib/bridge";
import { calculatePricePerSqft, formatAddress, formatCurrency, getListingPhotos } from "@/lib/property-utils";

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

/* ── helpers ── */

function fmtArr(arr: string[] | undefined | null): string | null {
  if (!arr || arr.length === 0) return null;
  return arr.join(", ");
}

function fmtSqft(val: number | null | undefined): string | null {
  if (typeof val !== "number" || !Number.isFinite(val) || val <= 0) return null;
  return `${val.toLocaleString()} Sq.Ft`;
}

function fmtAcres(val: number | null | undefined): string | null {
  if (typeof val !== "number" || !Number.isFinite(val) || val <= 0) return null;
  return `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} Acres`;
}

function fmtDate(val: string | null | undefined): string | null {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type DetailPair = [string, string];

function collectRows(pairs: [string, string | null | undefined][]): DetailPair[] {
  return pairs.filter((p): p is [string, string] => p[1] != null && p[1] !== "");
}

function estimateMonthlyPayment(price: number | null | undefined): string | null {
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) return null;
  const principal = price * 0.8;
  const monthlyRate = 0.065 / 12;
  const payments = 360;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
    (Math.pow(1 + monthlyRate, payments) - 1);
  if (!Number.isFinite(payment)) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.round(payment));
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 bg-white px-[15px] py-[10px]">
      <p className="text-[13px] text-gray-500 mb-1">{label}</p>
      <p className="text-[14px] text-[#1a1a1a] leading-[1.35]">{value}</p>
    </div>
  );
}

function DetailSection({ title, rows }: { title: string; rows: DetailPair[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="bg-white border-b border-gray-200 px-[15px] py-[20px]">
      <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[15px]">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-2">
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}

function StatMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-[15px] py-[10px] text-center uppercase text-gray-500">
      <p className="text-[17px] lg:text-[24px] leading-none font-semibold text-[#1a1a1a]">{value}</p>
      <p className="mt-[3px] text-[11px] lg:text-[12px] leading-none">{label}</p>
    </div>
  );
}

/* ── page ── */

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

  const remarks = property.PublicRemarks || "No description provided.";
  const lat = property.Latitude;
  const lng = property.Longitude;
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) > 0 && Math.abs(lng) > 0;

  const basicInfoRows = collectRows([
    ["Property Type", property.PropertyType || null],
    ["Sub Type", property.PropertySubType || null],
    ["Status", property.StandardStatus || null],
    ["Year Built", property.YearBuilt ? String(property.YearBuilt) : null],
    ["Living Area", fmtSqft(property.LivingArea)],
    ["Lot Size", fmtSqft(property.LotSizeSquareFeet) || fmtSqft(property.LotSizeArea)],
    ["Lot Acres", fmtAcres(property.LotSizeAcres)],
    ["Stories", property.StoriesTotal ? String(property.StoriesTotal) : null],
    ["Subdivision", property.SubdivisionName],
    ["Building", property.BuildingName],
    ["County", property.CountyOrParish],
    ["Architectural Style", fmtArr(property.ArchitecturalStyle)],
    ["Construction", fmtArr(property.ConstructionMaterials)],
    ["Garage Spaces", property.GarageSpaces ? String(property.GarageSpaces) : null],
    ["Attached Garage", property.AttachedGarageYN ? "Yes" : null],
    ["Days on Market", property.DaysOnMarket != null ? String(property.DaysOnMarket) : null],
    ["List Date", fmtDate(property.ListingContractDate || null)],
    ["Original List Price", property.OriginalListPrice ? formatCurrency(property.OriginalListPrice) : null],
    ["Close Date", fmtDate(property.CloseDate)],
    ["Close Price", property.ClosePrice ? formatCurrency(property.ClosePrice) : null],
    ["Association Fee", property.AssociationFee ? `${formatCurrency(property.AssociationFee)}${property.AssociationFeeFrequency ? ` / ${property.AssociationFeeFrequency}` : ""}` : null],
    ["Direction Faces", property.DirectionFaces],
  ]);

  const exteriorRows = collectRows([
    ["Exterior Features", fmtArr(property.ExteriorFeatures)],
    ["Roof", fmtArr(property.Roof)],
    ["Pool Features", fmtArr(property.PoolFeatures)],
    ["Pool", property.PoolPrivateYN ? "Private Pool" : null],
    ["Patio / Porch", fmtArr(property.PatioAndPorchFeatures)],
    ["Lot Features", fmtArr(property.LotFeatures)],
    ["View", fmtArr(property.View)],
    ["Waterfront", property.WaterfrontYN ? "Yes" : null],
    ["Water Source", fmtArr(property.WaterSource)],
    ["Sewer", fmtArr(property.Sewer)],
  ]);

  const interiorRows = collectRows([
    ["Interior Features", fmtArr(property.InteriorFeatures)],
    ["Appliances", fmtArr(property.Appliances)],
    ["Flooring", fmtArr(property.Flooring)],
    ["Cooling", fmtArr(property.Cooling)],
    ["Heating", fmtArr(property.Heating)],
    ["Levels", fmtArr(property.Levels)],
  ]);

  const propertyFeaturesRows = collectRows([
    ["Parking", fmtArr(property.ParkingFeatures)],
    ["Building Features", fmtArr(property.BuildingFeatures)],
    ["Community Features", fmtArr(property.CommunityFeatures)],
    ["Pets Allowed", fmtArr(property.PetsAllowed)],
    ["Listing Terms", fmtArr(property.ListingTerms)],
    ["Possession", fmtArr(property.Possession)],
    ["Occupant Type", property.OccupantType],
  ]);

  const taxRows = collectRows([
    ["Tax Annual Amount", property.TaxAnnualAmount ? formatCurrency(property.TaxAnnualAmount) : null],
    ["Tax Year", property.TaxYear ? String(property.TaxYear) : null],
    ["Tax Legal Description", property.TaxLegalDescription],
  ]);

  const featureGroups = [
    { label: "Interior Features", values: property.InteriorFeatures?.filter(Boolean) || [] },
    { label: "Exterior Features", values: property.ExteriorFeatures?.filter(Boolean) || [] },
    { label: "Appliances", values: property.Appliances?.filter(Boolean) || [] },
    { label: "Parking", values: property.ParkingFeatures?.filter(Boolean) || [] },
    { label: "Building Features", values: property.BuildingFeatures?.filter(Boolean) || [] },
  ];

  // JSON-LD structured data - constructed from trusted server-side data only
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
      .filter((g) => g.values.length > 0)
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
        {/* 1. Header/address */}
        <div className="border-b border-black/10 bg-white">
          <div className="max-w-[1200px] mx-auto px-[15px] py-[15px]">
            <h1 className="text-[20px] lg:text-[24px] leading-[1.1] font-semibold text-[#1a1a1a]">{address}</h1>
            <p className="text-[13px] lg:text-[15px] text-gray-600 mt-1">
              {property.City}, {property.StateOrProvince} {property.PostalCode}
            </p>
          </div>
        </div>

        {/* 2. Media/gallery */}
        <div className="border-b border-black/10 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <PropertyGallery photos={photos} address={address} />
          </div>
        </div>

        {/* 3–13. Content grid with sidebar */}
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="min-w-0 border-r-0 lg:border-r lg:border-gray-200">
              {/* 3. Price/stats */}
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

              {/* 4. Description */}
              <section className="bg-white border-b border-gray-200 px-[15px] py-[20px]">
                <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[10px]">Description</h3>
                <p className="text-[14px] leading-[1.6] text-gray-700">{remarks}</p>
              </section>

              {/* 5. Basic Information */}
              <DetailSection title="Basic Information" rows={basicInfoRows} />

              {/* 6. Exterior Features */}
              <DetailSection title="Exterior Features" rows={exteriorRows} />

              {/* 7. Interior Features */}
              <DetailSection title="Interior Features" rows={interiorRows} />

              {/* 8. Property Features */}
              <DetailSection title="Property Features" rows={propertyFeaturesRows} />

              {/* 9. Tax Information */}
              {taxRows.length > 0 && <DetailSection title="Tax Information" rows={taxRows} />}
            </div>

            {/* Agent sidebar (desktop) */}
            <aside className="hidden lg:block p-[15px]">
              <div className="border border-gray-200 bg-white p-[15px] space-y-[15px] sticky top-[100px]">
                <div className="flex items-center gap-3">
                  <img src="/andrew-headshot.png" alt="Andrew Whalen" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="text-[#1a1a1a] font-semibold leading-none">Andrew Whalen</p>
                    <p className="text-gray-600 text-sm">LoKation Real Estate</p>
                    <a href="tel:+13054559744" className="text-sm text-[#1a1a1a] hover:underline">(305) 455-9744</a>
                  </div>
                </div>
                <PropertyInquiryForm listingKey={property.ListingKey} address={address} theme="light" />
              </div>
            </aside>
          </div>
        </div>

        {/* 10. Location map — full-width */}
        {hasCoords && (
          <section className="bg-white border-b border-black/10">
            <div className="max-w-[1200px] mx-auto px-[15px] py-[20px]">
              <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[15px]">Location</h3>
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full aspect-[2/1] bg-gray-100 rounded-lg overflow-hidden group"
              >
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=800x400&scale=2&markers=color:red%7C${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}`}
                  alt={`Map of ${address}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full text-sm font-medium text-[#1a1a1a] shadow">
                    Open in Google Maps
                  </span>
                </div>
              </a>
            </div>
          </section>
        )}

        {/* 11. Similar Properties */}
        <section className="bg-white border-b border-black/10">
          <div className="max-w-[1200px] mx-auto px-[15px] py-[20px]">
            <h3 className="text-[18px] font-bold leading-none text-[#1a1a1a] mb-[10px]">Similar Properties</h3>
            <p className="text-[14px] text-gray-500 mb-[15px]">
              Explore more properties in {property.City || "this area"}.
            </p>
            <a
              href={`/search?q=${encodeURIComponent(property.City || "")}`}
              className="inline-flex items-center justify-center border border-gray-300 text-[#1a1a1a] px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.12em] hover:bg-gray-100 transition-colors"
            >
              View Similar Listings
            </a>
          </div>
        </section>

        {/* 13. Legal / Courtesy — full-width bottom */}
        <div className="max-w-[1200px] mx-auto px-[15px] py-[20px] text-[11px] text-gray-500 leading-[1.6] space-y-2">
          {(property.ListOfficeName || property.ListAgentFullName) && (
            <p>
              Courtesy of{property.ListAgentFullName ? ` ${property.ListAgentFullName}` : ""}
              {property.ListOfficeName ? `, ${property.ListOfficeName}` : ""}
              {property.ListOfficePhone ? ` (${property.ListOfficePhone})` : ""}
            </p>
          )}
          <p>
            The multiple listing information is provided by the Miami Association of Realtors from a copyrighted
            compilation of listings. All information is deemed reliable but not guaranteed.
          </p>
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
