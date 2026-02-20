export interface Development {
  slug: string;
  name: string;
  location: string;
  priceFrom: string;
  units: string;
  status: "Pre-Construction" | "Under Construction" | "Recently Completed";
  completionYear: string;
  developer: string;
  description: string;
  county: "miami-dade" | "broward" | "palm-beach";
}

export const developments: Development[] = [
  {
    slug: "the-perigon",
    name: "The Perigon",
    location: "Miami Beach",
    priceFrom: "$3.7M",
    units: "73 Residences",
    status: "Pre-Construction",
    completionYear: "2027",
    developer: "Mast Capital",
    county: "miami-dade",
    description:
      "A boutique oceanfront tower on Millionaire's Row, designed by OMA with interiors by Tara Bernerd. One of the last undeveloped oceanfront parcels in Miami Beach.",
  },
  {
    slug: "the-standard-residences",
    name: "The Standard Residences",
    location: "Brickell",
    priceFrom: "$750K",
    units: "228 Residences",
    status: "Under Construction",
    completionYear: "2027",
    developer: "Midtown Development",
    county: "miami-dade",
    description:
      "The Standard's first branded residential tower, bringing its iconic hospitality DNA to Brickell's waterfront with wellness-focused amenities.",
  },
  {
    slug: "vida-residences",
    name: "Vida Residences",
    location: "Edgewater",
    priceFrom: "$640K",
    units: "400 Residences",
    status: "Under Construction",
    completionYear: "2026",
    developer: "NR Investments",
    county: "miami-dade",
    description:
      "A 400-unit bayfront tower in Edgewater with direct Biscayne Bay views, resort-style pool deck, and proximity to the Design District.",
  },
  {
    slug: "ella-miami-beach",
    name: "Ella",
    location: "Miami Beach",
    priceFrom: "$890K",
    units: "120 Residences",
    status: "Pre-Construction",
    completionYear: "2028",
    developer: "Two Roads Development",
    county: "miami-dade",
    description:
      "A mid-rise boutique development in North Beach offering spacious layouts and private outdoor terraces in a quieter pocket of Miami Beach.",
  },
  {
    slug: "72-park",
    name: "72 Park",
    location: "Miami Beach",
    priceFrom: "$1.3M",
    units: "202 Residences",
    status: "Recently Completed",
    completionYear: "2025",
    developer: "Aria Development",
    county: "miami-dade",
    description:
      "A recently delivered luxury tower on Collins Avenue in North Beach, featuring expansive layouts and a 2-acre park designed by West 8.",
  },
  {
    slug: "residences-1428-brickell",
    name: "The Residences at 1428 Brickell",
    location: "Brickell",
    priceFrom: "$1M",
    units: "189 Residences",
    status: "Under Construction",
    completionYear: "2027",
    developer: "Ytech",
    county: "miami-dade",
    description:
      "A supertall tower rising 70+ stories on Brickell Avenue, featuring interiors by Yoo Studio and panoramic bay views from every residence.",
  },
  {
    slug: "five-park-miami-beach",
    name: "Five Park Miami Beach",
    location: "Miami Beach",
    priceFrom: "$2.5M",
    units: "98 Residences",
    status: "Recently Completed",
    completionYear: "2025",
    developer: "Terra / GFO",
    county: "miami-dade",
    description:
      "Designed by Arquitectonica, this 48-story tower anchors the south end of Miami Beach with sweeping ocean and bay views and a canopy park by West 8.",
  },
  {
    slug: "aman-miami-beach",
    name: "Aman Miami Beach",
    location: "Miami Beach",
    priceFrom: "$5.5M",
    units: "23 Residences",
    status: "Pre-Construction",
    completionYear: "2028",
    developer: "Vlad Doronin / OKO Group",
    county: "miami-dade",
    description:
      "Aman's first branded residences in Florida — an ultra-exclusive oceanfront enclave with only 23 residences and full Aman resort services.",
  },
  {
    slug: "st-regis-sunny-isles",
    name: "St. Regis Sunny Isles",
    location: "Sunny Isles Beach",
    priceFrom: "$5M",
    units: "152 Residences",
    status: "Under Construction",
    completionYear: "2027",
    developer: "Fortune International",
    county: "miami-dade",
    description:
      "A 62-story oceanfront tower bringing the St. Regis brand to Sunny Isles Beach, with butler service, private beach, and marina access.",
  },
  {
    slug: "casa-bella",
    name: "Casa Bella by B&B Italia",
    location: "Edgewater",
    priceFrom: "$1.5M",
    units: "57 Residences",
    status: "Recently Completed",
    completionYear: "2024",
    developer: "Related Group",
    county: "miami-dade",
    description:
      "A boutique 57-unit tower in Edgewater fully furnished by B&B Italia — the first residential project from the iconic Italian furniture brand.",
  },
  {
    slug: "the-wave-fort-lauderdale",
    name: "The Wave on Bayshore",
    location: "Fort Lauderdale",
    priceFrom: "$900K",
    units: "75 Residences",
    status: "Pre-Construction",
    completionYear: "2027",
    developer: "Ocean Land Investments",
    county: "broward",
    description:
      "A boutique bayfront tower on the Fort Lauderdale Intracoastal, offering private boat docks and resort-style amenities.",
  },
  {
    slug: "south-flagler-house",
    name: "South Flagler House",
    location: "West Palm Beach",
    priceFrom: "$5M",
    units: "108 Residences",
    status: "Pre-Construction",
    completionYear: "2028",
    developer: "Related Ross",
    county: "palm-beach",
    description:
      "A landmark twin-tower development on the Intracoastal in West Palm Beach, delivering ultra-luxury residences with direct water views to Palm Beach island.",
  },
];
