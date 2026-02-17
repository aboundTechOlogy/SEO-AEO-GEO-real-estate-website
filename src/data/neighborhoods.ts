export interface NeighborhoodData {
  slug: string;
  name: string;
  tagline: string;
  heroDescription: string;
  overview: string;
  buyerProfile: string;
  lifestyle: string;
  priceRange: { low: string; high: string; median: string };
  stats: {
    medianPrice: string;
    avgDom: string;
    pricePerSqft: string;
    activeInventory: string;
  };
  faqs: { question: string; answer: string }[];
  highlights: string[];
  zipCodes: string[];
}

export const neighborhoods: NeighborhoodData[] = [
  {
    slug: "brickell",
    name: "Brickell",
    tagline: "Manhattan of the South",
    heroDescription:
      "Miami's financial district and one of the fastest-growing urban neighborhoods in the country. Brickell combines world-class dining, luxury high-rises, and walkable waterfront living.",
    overview:
      "Brickell has transformed from a quiet banking corridor into a vibrant, self-contained city within Miami. With over 30 residential towers built since 2010, it offers an urban lifestyle unlike anything else in South Florida. The neighborhood sits along Biscayne Bay, stretching from the Miami River south to Rickenbacker Causeway, with Brickell City Centre as its commercial and social anchor.",
    buyerProfile:
      "Young professionals, international investors, and executives seeking a walkable, cosmopolitan lifestyle. Many buyers are relocating from New York, Chicago, and São Paulo. Strong rental demand makes Brickell attractive to investors — occupancy rates consistently exceed 95%.",
    lifestyle:
      "Walk to Michelin-starred restaurants, boutique fitness studios, and waterfront parks. The Underline provides a 10-mile linear park for cycling and jogging. Nightlife ranges from rooftop lounges at SLS to intimate wine bars on Brickell Avenue. Brickell Key offers a quieter, island-feel alternative just minutes from the action.",
    priceRange: { low: "$400K", high: "$15M", median: "$750K" },
    stats: {
      medianPrice: "$750,000",
      avgDom: "58",
      pricePerSqft: "$620",
      activeInventory: "1,200+",
    },
    faqs: [
      {
        question: "Is Brickell a good investment in 2026?",
        answer:
          "Brickell remains one of Miami's strongest investment markets. With major employers like Citadel, Microsoft, and Blackstone establishing offices in the area, rental demand is robust. Median condo prices have appreciated 34% since 2021, and new developments continue to sell out in pre-construction. The combination of population growth, corporate relocations, and limited waterfront land supports continued appreciation.",
      },
      {
        question: "What is the average HOA fee in Brickell?",
        answer:
          "HOA fees in Brickell range from $0.50 to $1.50 per square foot per month, depending on the building and its amenities. A typical 1,200 sq ft condo pays between $600-$1,800/month. Luxury buildings with extensive amenities (pools, spas, concierge, valet) trend toward the higher end. Always factor HOA fees into your total monthly cost when comparing properties.",
      },
      {
        question: "What are the best buildings in Brickell?",
        answer:
          "Top-tier Brickell buildings include Brickell Flatiron (completed 2019, 64 stories), SLS Lux (designed by Yabu Pushelberg), Reach and Rise at Brickell City Centre, and the upcoming 830 Brickell (Miami's first supertall office tower with ground-floor retail). For waterfront living, Brickell Key offers Mandarin Oriental Residences and Asia Brickell Key.",
      },
      {
        question: "How walkable is Brickell?",
        answer:
          "Brickell is Miami's most walkable neighborhood with a Walk Score of 95. Brickell City Centre, Metromover stations, and The Underline linear park make car-free living practical. The free Metromover connects Brickell to Downtown and Omni in minutes. Most residents walk to restaurants, groceries (Publix at Mary Brickell Village), and fitness studios.",
      },
      {
        question: "What's the difference between Brickell and Downtown Miami?",
        answer:
          "Brickell is the residential and financial hub — think luxury condos, corporate offices, and upscale retail. Downtown is the cultural and governmental center — home to the Pérez Art Museum, Adrienne Arsht Center, and the courthouse district. Brickell tends to attract professionals and investors; Downtown attracts a more eclectic mix including artists and cultural institutions. Prices are generally 10-15% higher in Brickell.",
      },
    ],
    highlights: [
      "Walk Score: 95",
      "30+ luxury residential towers",
      "Brickell City Centre — 5.4M sq ft mixed-use",
      "Free Metromover transit",
      "The Underline — 10-mile linear park",
      "Mandarin Oriental on Brickell Key",
    ],
    zipCodes: ["33129", "33130", "33131"],
  },
  {
    slug: "coconut-grove",
    name: "Coconut Grove",
    tagline: "Bohemian Meets Bayfront",
    heroDescription:
      "Miami's oldest continuously inhabited neighborhood. Coconut Grove blends historic banyan-lined streets, waterfront estates, and a village atmosphere that feels worlds away from the high-rises of Brickell.",
    overview:
      "Founded in the 1800s, Coconut Grove is a lush, tree-canopied enclave on Biscayne Bay. It's home to Vizcaya Museum, the Barnacle Historic State Park, Coconut Grove Sailing Club, and some of Miami's most prestigious waterfront estates. The village center along Main Highway and Grand Avenue offers boutiques, cafés, and CocoWalk, a recently renovated open-air retail and office complex.",
    buyerProfile:
      "Families seeking top-rated schools (Ransom Everglades, Carrollton), established professionals wanting space and privacy, and buyers who value character over flash. Coconut Grove attracts people who could live anywhere in Miami but choose it for the lifestyle — sailing, cycling, outdoor dining under banyan trees.",
    lifestyle:
      "Sailing on Biscayne Bay, weekend farmers markets, outdoor dining at Peacock Park, and cycling along the waterfront. The Grove has a distinct artistic and intellectual character — home to writers, architects, and diplomats. The annual Coconut Grove Arts Festival is one of the nation's largest outdoor art events.",
    priceRange: { low: "$600K", high: "$65M", median: "$1.8M" },
    stats: {
      medianPrice: "$1,800,000",
      avgDom: "72",
      pricePerSqft: "$780",
      activeInventory: "280+",
    },
    faqs: [
      {
        question: "Why is Coconut Grove so expensive?",
        answer:
          "Coconut Grove's premium pricing reflects its unique combination of waterfront land, mature tree canopy, historic character, and top-rated schools. The neighborhood has strict zoning that limits density, preserving its village feel. Waterfront lots are among the most limited in Miami-Dade County, and many estates sit on the bay with private docks. Supply is inherently constrained — new development is mostly limited to the village core.",
      },
      {
        question: "What are the best schools in Coconut Grove?",
        answer:
          "Coconut Grove has some of South Florida's most prestigious schools. Ransom Everglades (private, grades 6-12) consistently ranks among the top high schools in the nation. Carrollton School of the Sacred Heart serves girls Pre-K through 12. For public options, Coconut Grove Elementary is A-rated. Many families also choose MAST Academy on Virginia Key, accessible via the Rickenbacker Causeway.",
      },
      {
        question: "Is Coconut Grove good for families?",
        answer:
          "Coconut Grove is one of Miami's best family neighborhoods. Tree-lined streets, parks (Peacock Park, David T. Kennedy Park), playgrounds, and the waterfront create a safe, walkable environment. Top schools within the neighborhood, combined with a village atmosphere and strong community events, make it ideal for families who want an urban address with a suburban feel.",
      },
      {
        question:
          "What's the difference between Coconut Grove and Coral Gables?",
        answer:
          "Both are established, leafy, and family-oriented, but they have distinct personalities. Coconut Grove is more bohemian and casual — think art festivals, sailboats, and outdoor cafés. Coral Gables is more manicured and Mediterranean — think uniform architecture, Miracle Mile shopping, and golf courses. Coconut Grove has waterfront bayfront estates; Coral Gables has the Biltmore and canal-front homes. Prices are comparable, but Grove waterfront commands a premium.",
      },
    ],
    highlights: [
      "Miami's oldest neighborhood (est. 1800s)",
      "Vizcaya Museum & Gardens",
      "Ransom Everglades — top-ranked private school",
      "CocoWalk — renovated retail/office village center",
      "Bayfront estates with private docks",
      "Annual Coconut Grove Arts Festival",
    ],
    zipCodes: ["33133"],
  },
  {
    slug: "miami-beach",
    name: "Miami Beach",
    tagline: "Iconic Oceanfront Living",
    heroDescription:
      "A barrier island city offering some of the world's most recognizable real estate. From the Art Deco Historic District to billionaire-row mansions on Star Island, Miami Beach is where luxury meets the Atlantic.",
    overview:
      "Miami Beach is its own city, stretching 7 miles along the Atlantic Ocean. It encompasses South Beach (the Art Deco entertainment district), Mid-Beach (residential towers along Collins Avenue), North Beach (a quieter, family-oriented stretch), and the ultra-exclusive islands — Star Island, Palm Island, Hibiscus Island, and the Venetian Islands. The luxury condo market here competes globally with Monaco, Dubai, and Hong Kong.",
    buyerProfile:
      "International ultra-high-net-worth buyers, entertainment and sports figures, investors seeking trophy assets, and seasonal residents maintaining a South Florida base. Cash purchases account for over 60% of transactions above $5M. Buyers from Latin America, Europe, and the Northeast U.S. dominate the market.",
    lifestyle:
      "World-class restaurants (Carbone, Joia Beach, Surf Club), iconic nightlife (LIV, E11EVEN Beach Day Club), Art Basel each December, and some of the most photographed beaches on Earth. Faena District and the new Aman Miami Beach are redefining ultra-luxury hospitality. The beach itself — 7 miles of white sand — remains the ultimate amenity.",
    priceRange: { low: "$300K", high: "$150M", median: "$950K" },
    stats: {
      medianPrice: "$950,000",
      avgDom: "82",
      pricePerSqft: "$850",
      activeInventory: "2,100+",
    },
    faqs: [
      {
        question: "Is Miami Beach a good investment?",
        answer:
          "Miami Beach offers strong long-term appreciation driven by limited barrier-island land, global demand, and no state income tax. However, insurance costs have risen significantly since 2022, and older buildings face milestone inspection and reserve requirements under Florida's SB 4-D. New construction and recently inspected buildings trade at premiums. The short-term rental market (Airbnb) is heavily regulated — verify zoning before purchasing as an investment.",
      },
      {
        question: "What are the most exclusive areas of Miami Beach?",
        answer:
          "Star Island, Fisher Island (accessible only by ferry), Indian Creek Island (known as 'Billionaire Bunker'), and the Venetian Islands represent the pinnacle of Miami Beach real estate. On the condo side, Faena House, Surf Club Four Seasons, and the upcoming Aman Residences are among the most exclusive addresses. Single-family waterfront homes on the islands regularly trade above $25M.",
      },
      {
        question: "How are flood insurance and hurricane risk in Miami Beach?",
        answer:
          "Flood insurance is required for most Miami Beach properties and costs $2,000-$15,000+ annually depending on elevation, building age, and flood zone. New construction is built to the latest Florida Building Code (one of the strictest in the nation) and typically has lower insurance costs. Sea level rise is a long-term consideration — the city has invested over $500M in stormwater infrastructure and road elevation. FEMA flood maps were updated in 2024.",
      },
      {
        question: "What is the condo market like in Miami Beach?",
        answer:
          "Miami Beach has one of the deepest luxury condo markets in the world. Inventory ranges from $300K studios in South Beach to $150M penthouses. The market has bifurcated: newer buildings (post-2015) with full reserves and passed milestone inspections trade briskly, while older buildings facing special assessments for structural repairs have softened. Always review the condo association's reserve study and milestone inspection status before purchasing.",
      },
    ],
    highlights: [
      "7 miles of Atlantic Ocean beachfront",
      "Art Deco Historic District — 960+ buildings",
      "Star Island & Fisher Island — ultra-exclusive enclaves",
      "Art Basel Miami Beach — global art event each December",
      "Faena District — luxury hospitality and residences",
      "No state income tax",
    ],
    zipCodes: ["33139", "33140", "33141", "33154"],
  },
  {
    slug: "coral-gables",
    name: "Coral Gables",
    tagline: "The City Beautiful",
    heroDescription:
      "A planned Mediterranean-revival city known for its tree-lined boulevards, the historic Biltmore Hotel, and some of South Florida's most prestigious single-family homes.",
    overview:
      "Coral Gables was founded in the 1920s by George Merrick with a unified vision of Mediterranean architecture, lush landscaping, and grand entryways. Today it's home to the University of Miami, the Biltmore Hotel, Miracle Mile shopping district, and Shops at Merrick Park. Strict architectural codes maintain the neighborhood's elegant character — no neon signs, no chain-link fences, and building styles must complement the Mediterranean theme.",
    buyerProfile:
      "Established families, University of Miami faculty, Latin American executives, and buyers seeking architectural character with suburban space. Coral Gables has one of the highest concentrations of consulates and international businesses in the U.S., attracting a sophisticated, globally-minded community.",
    lifestyle:
      "Golf at the Biltmore or Riviera Country Club, shopping on Miracle Mile, dining at Hillstone or Christy's, and Sunday mornings at the Venetian Pool (a national historic landmark carved from coral rock). The Granada Golf Course and numerous parks provide green space. Cultural attractions include the Coral Gables Museum and the University of Miami's Lowe Art Museum.",
    priceRange: { low: "$500K", high: "$45M", median: "$1.5M" },
    stats: {
      medianPrice: "$1,500,000",
      avgDom: "65",
      pricePerSqft: "$620",
      activeInventory: "450+",
    },
    faqs: [
      {
        question: "Why do people choose Coral Gables over Coconut Grove?",
        answer:
          "Coral Gables offers more structured elegance — Mediterranean architecture requirements, wider lots, and a planned city layout with grand boulevards. Buyers who prefer uniformity, golf course access, and a more traditional suburban feel choose the Gables. Those seeking bohemian character, waterfront sailing, and a more eclectic village atmosphere choose the Grove. Both are excellent for families with top schools.",
      },
      {
        question: "What are Coral Gables building codes like?",
        answer:
          "Coral Gables has some of the strictest aesthetic codes in South Florida. New construction and renovations must conform to Mediterranean, Colonial, or French architectural styles. There are regulations on exterior colors, roof materials, landscaping, fencing, and signage. While this limits design freedom, it preserves property values and neighborhood character. The Board of Architects reviews all exterior modifications.",
      },
      {
        question: "Is Coral Gables walkable?",
        answer:
          "The Miracle Mile / Downtown Coral Gables area is walkable with restaurants, shops, and offices within walking distance. However, most of residential Coral Gables is car-dependent — homes on large lots with winding streets require driving. The city has invested in pedestrian improvements and trolley service connecting Downtown Coral Gables to the Metrorail.",
      },
    ],
    highlights: [
      "The Biltmore Hotel — National Historic Landmark",
      "Venetian Pool — carved from coral rock, built 1924",
      "Strict Mediterranean architectural codes",
      "University of Miami campus",
      "Miracle Mile shopping district",
      "Shops at Merrick Park — luxury retail",
    ],
    zipCodes: ["33134", "33143", "33146"],
  },
  {
    slug: "key-biscayne",
    name: "Key Biscayne",
    tagline: "Island Paradise",
    heroDescription:
      "An exclusive barrier island accessible only via the Rickenbacker Causeway. Key Biscayne offers pristine beaches, national parkland, and a tight-knit community minutes from Downtown Miami.",
    overview:
      "Key Biscayne is a village of roughly 14,000 residents on a barrier island between Biscayne Bay and the Atlantic Ocean. Connected to the mainland by the Rickenbacker Causeway (toll bridge), it offers Crandon Park (public beach and tennis center), Bill Baggs Cape Florida State Park, and the historic Cape Florida Lighthouse. The island has a distinct small-town feel with its own village council, police, and schools.",
    buyerProfile:
      "Families seeking safety and community, Latin American buyers (particularly from Brazil, Argentina, and Venezuela), and professionals who want island living with quick access to Brickell and Downtown. The single-causeway access provides natural security. Many residents are second or third-generation Key Biscayne families.",
    lifestyle:
      "Beach days at Crandon Park, cycling the island loop, tennis at Crandon Park Tennis Center (former home of the Miami Open), kayaking in Biscayne Bay, and dining at the Ritz-Carlton Key Biscayne. The village has a strong community calendar with farmers markets, holiday events, and 4th of July celebrations that feel more like a small town than Miami.",
    priceRange: { low: "$500K", high: "$50M", median: "$1.6M" },
    stats: {
      medianPrice: "$1,600,000",
      avgDom: "88",
      pricePerSqft: "$720",
      activeInventory: "180+",
    },
    faqs: [
      {
        question: "Is Key Biscayne safe?",
        answer:
          "Key Biscayne is one of the safest communities in Miami-Dade County. The single-access Rickenbacker Causeway creates a natural barrier, and the village has its own police department with a strong community presence. Crime rates are significantly below Miami-Dade averages. The island's small size and tight-knit community contribute to a strong sense of security.",
      },
      {
        question: "What are the cons of living on Key Biscayne?",
        answer:
          "The Rickenbacker Causeway is the only road on and off the island, creating traffic bottlenecks during rush hour and hurricane evacuations. The causeway toll adds up ($1.75 each way or $1 with SunPass). Dining and shopping options are limited compared to mainland Miami — most residents drive to Brickell or Coral Gables for variety. Insurance costs are higher due to the barrier island location.",
      },
      {
        question: "How is the real estate market on Key Biscayne?",
        answer:
          "Key Biscayne is a supply-constrained market — the island is fully built out with no room for new development beyond replacing existing structures. This scarcity supports strong pricing. The market is roughly split between condos (Ocean Club, Grand Bay, Ritz-Carlton) and single-family homes. Waterfront homes with bay or ocean access command the highest premiums. International buyers, particularly from Latin America, remain active.",
      },
    ],
    highlights: [
      "Crandon Park — public beach and tennis center",
      "Bill Baggs Cape Florida State Park",
      "Ritz-Carlton Key Biscayne resort",
      "Single-causeway island access (natural security)",
      "Village government with own police",
      "Former home of the Miami Open tennis tournament",
    ],
    zipCodes: ["33149"],
  },
  {
    slug: "downtown-miami",
    name: "Downtown Miami",
    tagline: "The New Urban Core",
    heroDescription:
      "Miami's central business district is undergoing a dramatic transformation. New supertall towers, the Brightline station, and cultural institutions are reshaping Downtown into a true 24/7 urban center.",
    overview:
      "Downtown Miami stretches from the Miami River north to the Omni/Edgewater neighborhood, centered along Biscayne Boulevard. Anchored by the Pérez Art Museum (PAMM), Frost Museum of Science, Adrienne Arsht Center for the Performing Arts, and the Kaseya Center (home of the Miami Heat), Downtown is the cultural heart of the city. The Brightline high-speed rail station connects Downtown to Fort Lauderdale (30 min) and West Palm Beach (1 hr).",
    buyerProfile:
      "First-time luxury buyers, young professionals, and investors attracted to lower price points than Brickell with similar urban amenities. The Brightline connection has attracted commuters and bi-city professionals. International buyers seeking entry-level Miami investments also target Downtown.",
    lifestyle:
      "Miami Heat games at Kaseya Center, performances at the Arsht Center, museum walks at PAMM and Frost Science, and the growing Flagler Street dining scene. Bayfront Park hosts major events and festivals. The free Metromover connects Downtown to Brickell and Omni without a car.",
    priceRange: { low: "$250K", high: "$10M", median: "$520K" },
    stats: {
      medianPrice: "$520,000",
      avgDom: "65",
      pricePerSqft: "$480",
      activeInventory: "900+",
    },
    faqs: [
      {
        question: "Is Downtown Miami up and coming?",
        answer:
          "Downtown Miami is in the midst of its biggest transformation in decades. The completion of Miami Worldcenter (27 acres of mixed-use development), the Brightline station, and multiple supertall towers under construction are fundamentally changing the neighborhood. Corporate relocations (Citadel, Microsoft, Blackstone) are driving office and residential demand. While still grittier than Brickell, Downtown's trajectory is sharply upward.",
      },
      {
        question: "What's the difference between Downtown Miami and Brickell?",
        answer:
          "Downtown is Miami's cultural, governmental, and transit hub — home to museums, the performing arts center, and the Brightline station. Brickell is the financial and residential hub — sleeker, more polished, with luxury retail. Prices are 15-25% lower in Downtown. Both share the free Metromover. Downtown has more upside potential; Brickell is more established.",
      },
    ],
    highlights: [
      "Pérez Art Museum Miami (PAMM)",
      "Brightline high-speed rail station",
      "Miami Worldcenter — 27-acre mixed-use development",
      "Kaseya Center — home of the Miami Heat",
      "Adrienne Arsht Center for the Performing Arts",
      "Free Metromover transit connecting to Brickell",
    ],
    zipCodes: ["33128", "33130", "33132"],
  },
  {
    slug: "edgewater",
    name: "Edgewater",
    tagline: "Bayfront Rising",
    heroDescription:
      "One of Miami's fastest-transforming neighborhoods. Edgewater offers direct Biscayne Bay views, a wave of new luxury towers, and a prime location between Downtown, Wynwood, and the Design District — at prices still below Brickell.",
    overview:
      "Edgewater occupies a narrow strip along Biscayne Bay between Downtown Miami and the Julia Tuttle Causeway (I-195). Once a quiet residential area of older low-rise apartments, it has become a development hotspot with over a dozen luxury condo towers completed or under construction since 2020. Margaret Pace Park provides bayfront green space, and the neighborhood's central location offers easy access to Wynwood's galleries, the Design District's luxury retail, and Downtown's cultural institutions.",
    buyerProfile:
      "Young professionals priced out of Brickell but wanting bay views and urban access. Investors attracted by appreciation potential in a neighborhood still mid-transformation. International buyers seeking pre-construction opportunities. Artists and creative professionals drawn to the Wynwood/Design District adjacency. First-time luxury buyers who want waterfront living under $1M.",
    lifestyle:
      "Morning runs along Margaret Pace Park with Biscayne Bay views, weekend brunch at Wynwood restaurants a short walk away, paddleboarding from the bayfront, and easy access to the Design District's flagship stores (Louis Vuitton, Dior, Hermès). The Adrienne Arsht Center is at the southern edge. Multiple new restaurants and retail are opening at the ground level of new towers. The vibe is younger and more casual than Brickell — think athleisure over business casual.",
    priceRange: { low: "$350K", high: "$8M", median: "$620K" },
    stats: {
      medianPrice: "$620,000",
      avgDom: "55",
      pricePerSqft: "$550",
      activeInventory: "650+",
    },
    faqs: [
      {
        question: "Is Edgewater a good investment in 2026?",
        answer:
          "Edgewater is arguably Miami's best value-to-upside ratio right now. Prices remain 15-25% below comparable Brickell units, yet the neighborhood shares the same bay views and is closer to Wynwood and the Design District. Multiple new luxury towers (Missoni Baia, Elysee, Aria Reserve) have delivered, establishing a higher price floor. Pre-construction projects continue to sell well. The neighborhood is still mid-transformation, which means appreciation potential remains as amenities and retail fill in.",
      },
      {
        question: "What are the best buildings in Edgewater?",
        answer:
          "Top Edgewater buildings include Aria Reserve (two 60-story towers, the tallest waterfront residential twin towers in the U.S.), Missoni Baia (57 stories, interiors by the Italian fashion house), Elysee (57 stories, boutique with only 100 units), and Biscayne Beach (a completed luxury tower with resort-style amenities). For value, older renovated buildings like 1800 Biscayne Plaza offer lower price points with bay views.",
      },
      {
        question: "What's the difference between Edgewater and Brickell?",
        answer:
          "Edgewater is more residential and emerging — fewer restaurants and retail at street level, but direct bay views and newer construction. Brickell is more established with dense retail (Brickell City Centre), corporate offices, and nightlife. Edgewater prices are 15-25% lower for comparable units. Edgewater is better positioned for Wynwood and the Design District; Brickell is better for the financial district and Coral Gables. Edgewater feels quieter and less congested.",
      },
      {
        question: "Is Edgewater walkable?",
        answer:
          "Edgewater is becoming more walkable as new developments add ground-floor retail, but it's not yet at Brickell's level. Margaret Pace Park and the bayfront are excellent for walking and cycling. Biscayne Boulevard provides a commercial corridor. However, some blocks between towers are still undeveloped. The neighborhood is very bikeable and well-connected by rideshare. The Metromover doesn't reach Edgewater, but it's a short ride to Downtown stations.",
      },
      {
        question: "What is the new construction pipeline in Edgewater?",
        answer:
          "Edgewater has one of the most active new construction pipelines in Miami. Major recent and upcoming projects include Aria Reserve (completed 2024, 782 units across two towers), Casa Bella by B&B Italia (completed 2024), Lofty Brickell (under construction), and multiple pre-construction projects along Biscayne Boulevard. The pipeline suggests continued densification and a maturing neighborhood with more amenities.",
      },
    ],
    highlights: [
      "Direct Biscayne Bay views at 15-25% below Brickell prices",
      "Aria Reserve — tallest waterfront twin towers in the U.S.",
      "Missoni Baia — luxury interiors by Italian fashion house",
      "Margaret Pace Park — bayfront green space",
      "Walking distance to Wynwood and Design District",
      "Active new construction pipeline",
    ],
    zipCodes: ["33137", "33132"],
  },
];

export function getNeighborhoodBySlug(
  slug: string
): NeighborhoodData | undefined {
  return neighborhoods.find((n) => n.slug === slug);
}
