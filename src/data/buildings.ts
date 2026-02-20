export interface Building {
  slug: string;
  name: string;
  neighborhood: string;
  yearBuilt: string;
  units: number;
  floors: number;
  description: string;
  county: "miami-dade" | "broward" | "palm-beach";
}

export const buildings: Building[] = [
  {
    slug: "porsche-design-tower",
    name: "Porsche Design Tower",
    neighborhood: "Sunny Isles Beach",
    yearBuilt: "2017",
    units: 132,
    floors: 60,
    county: "miami-dade",
    description:
      "The world's first Porsche-branded residential tower featuring patented car elevators that deliver vehicles directly to each residence's sky garage.",
  },
  {
    slug: "armani-casa",
    name: "Armani Casa",
    neighborhood: "Sunny Isles Beach",
    yearBuilt: "2019",
    units: 308,
    floors: 56,
    county: "miami-dade",
    description:
      "Designed by Giorgio Armani's interiors division, this oceanfront tower brings Italian fashion sensibility to South Florida luxury living.",
  },
  {
    slug: "jade-signature",
    name: "Jade Signature",
    neighborhood: "Sunny Isles Beach",
    yearBuilt: "2018",
    units: 192,
    floors: 57,
    county: "miami-dade",
    description:
      "Designed by Herzog & de Meuron with interiors by PYR, Jade Signature is an architectural statement on the Sunny Isles oceanfront.",
  },
  {
    slug: "faena-house",
    name: "Faena House",
    neighborhood: "Miami Beach",
    yearBuilt: "2015",
    units: 18,
    floors: 18,
    county: "miami-dade",
    description:
      "An ultra-exclusive 18-unit boutique tower designed by Foster + Partners in the heart of the Faena District on Collins Avenue.",
  },
  {
    slug: "one-thousand-museum",
    name: "One Thousand Museum",
    neighborhood: "Downtown Miami",
    yearBuilt: "2019",
    units: 83,
    floors: 62,
    county: "miami-dade",
    description:
      "The late Zaha Hadid's only residential tower in the Americas — a sculptural exoskeleton overlooking Museum Park and Biscayne Bay.",
  },
  {
    slug: "brickell-flatiron",
    name: "Brickell Flatiron",
    neighborhood: "Brickell",
    yearBuilt: "2019",
    units: 549,
    floors: 64,
    county: "miami-dade",
    description:
      "One of Brickell's tallest residential towers featuring Italian kitchens, rooftop pool, and panoramic views of Biscayne Bay and the city skyline.",
  },
  {
    slug: "missoni-baia",
    name: "Missoni Baia",
    neighborhood: "Edgewater",
    yearBuilt: "2023",
    units: 249,
    floors: 57,
    county: "miami-dade",
    description:
      "A bayfront tower with interiors inspired by the Missoni fashion house, featuring signature zigzag patterns and vibrant color palettes throughout.",
  },
  {
    slug: "turnberry-ocean-club",
    name: "Turnberry Ocean Club",
    neighborhood: "Sunny Isles Beach",
    yearBuilt: "2021",
    units: 154,
    floors: 52,
    county: "miami-dade",
    description:
      "A triple-sky-lobby oceanfront tower with three floors of amenities including the Sky Club on the 30th floor with panoramic Atlantic views.",
  },
  {
    slug: "symphony-fort-lauderdale",
    name: "Symphony Fort Lauderdale",
    neighborhood: "Downtown Fort Lauderdale",
    yearBuilt: "2018",
    units: 232,
    floors: 28,
    county: "broward",
    description:
      "A luxury high-rise in downtown Fort Lauderdale's arts and entertainment district, offering panoramic views of the New River and Intracoastal.",
  },
  {
    slug: "las-olas-grand",
    name: "Las Olas Grand",
    neighborhood: "Fort Lauderdale",
    yearBuilt: "2007",
    units: 244,
    floors: 42,
    county: "broward",
    description:
      "Twin-tower luxury residences on Las Olas Boulevard, Fort Lauderdale's iconic shopping and dining promenade, steps from the beach.",
  },
  {
    slug: "azure-palm-beach",
    name: "Azure",
    neighborhood: "West Palm Beach",
    yearBuilt: "2022",
    units: 160,
    floors: 25,
    county: "palm-beach",
    description:
      "A waterfront luxury tower on the Intracoastal in West Palm Beach, offering panoramic views across Lake Worth to Palm Beach island.",
  },
];
