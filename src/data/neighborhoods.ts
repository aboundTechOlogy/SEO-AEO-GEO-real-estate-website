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
  hasGuidePage?: boolean;
  propertyTypes: ("HOMES" | "CONDOS")[];
  county: "miami-dade" | "broward" | "palm-beach";
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
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
    hasGuidePage: true,
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
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
    hasGuidePage: true,
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
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
    hasGuidePage: true,
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
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
    hasGuidePage: true,
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
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
    hasGuidePage: true,
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
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
    hasGuidePage: true,
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
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
    hasGuidePage: true,
  },
  {
    slug: "aventura",
    name: "Aventura",
    tagline: "Luxury Meets Convenience",
    heroDescription:
      "A master-planned city in northeast Miami-Dade known for Aventura Mall, top-rated schools, and a growing collection of luxury waterfront towers along the Intracoastal.",
    overview:
      "Aventura is a city of roughly 40,000 residents centered around Aventura Mall — one of the largest and highest-grossing shopping centers in the U.S. The city offers a mix of luxury high-rise condos along the Intracoastal Waterway, single-family gated communities, and newer mixed-use developments. Its location between Miami Beach and Fort Lauderdale provides easy access to both cities.",
    buyerProfile:
      "Families seeking top-rated public schools (Aventura City of Excellence), retirees wanting walkable luxury living, and international buyers — particularly from Latin America and Europe — attracted to the Aventura Mall lifestyle and proximity to Sunny Isles Beach.",
    lifestyle:
      "Shopping at Aventura Mall (300+ stores), dining along Biscayne Boulevard, walking and cycling the Aventura Circle trail, and quick access to Sunny Isles and Bal Harbour beaches. The Aventura Arts & Cultural Center hosts performances and events year-round.",
    priceRange: { low: "$300K", high: "$8M", median: "$580K" },
    stats: {
      medianPrice: "$580,000",
      avgDom: "70",
      pricePerSqft: "$450",
      activeInventory: "800+",
    },
    faqs: [],
    highlights: [
      "Aventura Mall — one of the largest in the U.S.",
      "Top-rated public schools",
      "Intracoastal Waterway living",
      "Aventura Circle — 3-mile walking/cycling trail",
      "Between Miami Beach and Fort Lauderdale",
      "Growing luxury condo market",
    ],
    zipCodes: ["33160", "33180"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "sunny-isles",
    name: "Sunny Isles Beach",
    tagline: "Florida's Riviera",
    heroDescription:
      "A barrier island city on the Atlantic Ocean known for its collection of ultra-luxury branded residences — from Porsche Design Tower to the Ritz-Carlton and the upcoming St. Regis.",
    overview:
      "Sunny Isles Beach is a narrow barrier island between the Atlantic Ocean and the Intracoastal Waterway, located north of Bal Harbour and south of Golden Beach. Once a mid-century motel strip, it has been completely transformed by a wave of ultra-luxury condo towers. The skyline now features some of the most architecturally striking buildings in South Florida, including Porsche Design Tower (with car elevators), Turnberry Ocean Club, and the Ritz-Carlton Residences.",
    buyerProfile:
      "International ultra-high-net-worth buyers — particularly from Russia, Latin America, and the Middle East — seeking branded luxury residences with full-service amenities. Investors looking for appreciation in a supply-constrained oceanfront market. Seasonal residents maintaining a South Florida winter base.",
    lifestyle:
      "Oceanfront living with resort-level amenities in every building. The beach is the centerpiece — wide, clean, and less crowded than Miami Beach. Dining options are growing rapidly. Bal Harbour Shops is minutes away for luxury retail. The Intracoastal provides boating and yacht access.",
    priceRange: { low: "$400K", high: "$35M", median: "$850K" },
    stats: {
      medianPrice: "$850,000",
      avgDom: "78",
      pricePerSqft: "$700",
      activeInventory: "600+",
    },
    faqs: [],
    highlights: [
      "Porsche Design Tower — car elevators to your unit",
      "Turnberry Ocean Club — 54-story oceanfront",
      "St. Regis Residences — under construction",
      "Wide Atlantic Ocean beaches",
      "Minutes from Bal Harbour Shops",
      "Branded luxury residences corridor",
    ],
    zipCodes: ["33160"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "south-of-fifth",
    name: "South of Fifth",
    tagline: "Miami Beach's Most Exclusive Enclave",
    heroDescription:
      "The southernmost tip of Miami Beach, South of Fifth (SoFi) is a quiet, ultra-luxury residential enclave surrounded by ocean, bay, and South Pointe Park — widely considered the most desirable address on Miami Beach.",
    overview:
      "South of Fifth occupies the area south of Fifth Street on Miami Beach, a small neighborhood of roughly 20 square blocks. It offers a rare combination: oceanfront living, Biscayne Bay views, South Pointe Park, and a walkable village feel with world-class restaurants (Joe's Stone Crab, Juvia, Prime Italian). The neighborhood is predominantly residential with strict zoning that keeps it quieter than the rest of South Beach.",
    buyerProfile:
      "Ultra-high-net-worth buyers seeking trophy addresses. Many residents are seasonal, splitting time between SoFi and New York, London, or São Paulo. Cash purchases dominate above $5M. The neighborhood attracts buyers who want South Beach proximity without the noise.",
    lifestyle:
      "South Pointe Park for morning walks with cruise ship views, Joe's Stone Crab for dinner, and some of the best sunrises and sunsets in Miami. The beach is pristine and less crowded than mid-Beach. Government Cut provides a front-row seat to mega-yachts and cruise ships. The vibe is sophisticated and understated.",
    priceRange: { low: "$800K", high: "$60M", median: "$2.2M" },
    stats: {
      medianPrice: "$2,200,000",
      avgDom: "95",
      pricePerSqft: "$1,200",
      activeInventory: "120+",
    },
    faqs: [],
    highlights: [
      "South Pointe Park — bayfront and oceanfront",
      "Joe's Stone Crab & world-class dining",
      "Quiet residential enclave on South Beach",
      "Continuum, Apogee, Glass — ultra-luxury towers",
      "Government Cut views",
      "Walk Score: 90+",
    ],
    zipCodes: ["33139"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "bal-harbour",
    name: "Bal Harbour",
    tagline: "Oceanfront Elegance",
    heroDescription:
      "An exclusive oceanfront village known for Bal Harbour Shops and some of South Florida's most prestigious residential addresses. Just 0.3 square miles of pure luxury.",
    overview:
      "Bal Harbour is a tiny, affluent village on the northern tip of Miami Beach's barrier island. Despite its small size, it punches well above its weight in luxury real estate and retail. Bal Harbour Shops — an open-air luxury mall featuring Chanel, Gucci, and Prada — is the village's commercial anchor. The residential market is split between grand oceanfront condos (The St. Regis, Oceana, Ritz-Carlton) and a small number of single-family homes along the bay.",
    buyerProfile:
      "International ultra-high-net-worth buyers seeking a quiet, exclusive oceanfront address. Many residents are seasonal, with primary homes in New York, Toronto, or South America. The village has a significant Jewish community and is home to several synagogues.",
    lifestyle:
      "Shopping at Bal Harbour Shops, beach days on pristine sand, dining at Carpaccio or Makoto, and a quiet residential atmosphere that feels separate from the energy of Miami Beach. Haulover Park is adjacent for boating and outdoor activities.",
    priceRange: { low: "$500K", high: "$40M", median: "$1.8M" },
    stats: {
      medianPrice: "$1,800,000",
      avgDom: "90",
      pricePerSqft: "$900",
      activeInventory: "150+",
    },
    faqs: [],
    highlights: [
      "Bal Harbour Shops — premier luxury retail",
      "Pristine oceanfront beaches",
      "The St. Regis, Oceana, Ritz-Carlton residences",
      "Exclusive 0.3 sq mi village",
      "Adjacent to Haulover Park",
      "Quiet residential atmosphere",
    ],
    zipCodes: ["33154"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "surfside",
    name: "Surfside",
    tagline: "Small-Town Beach Living",
    heroDescription:
      "A charming beachside town of just one square mile, nestled between Bal Harbour and Miami Beach. Surfside offers a family-friendly atmosphere with direct ocean access and a walkable downtown.",
    overview:
      "Surfside is a small, tight-knit oceanfront community between Bal Harbour (to the north) and Miami Beach (to the south). The town has a walkable downtown along Harding Avenue with local shops, restaurants, and cafés. The beach is wide and uncrowded. The Four Seasons Surf Club, a landmark hotel and residential complex, anchors the luxury market. The community has undergone significant transformation following the Champlain Towers tragedy, with new safety standards reshaping the condo market.",
    buyerProfile:
      "Families seeking a quiet beach town with good schools, Orthodox Jewish community members, and buyers who want oceanfront living without the intensity of Miami Beach. International buyers from Latin America and Canada are also active.",
    lifestyle:
      "Morning beach walks, cycling along Collins Avenue, family dinners on Harding Avenue, and a genuine small-town community feel. The Four Seasons Surf Club provides world-class dining and spa access. Bal Harbour Shops is walking distance for luxury retail.",
    priceRange: { low: "$400K", high: "$25M", median: "$950K" },
    stats: {
      medianPrice: "$950,000",
      avgDom: "75",
      pricePerSqft: "$750",
      activeInventory: "100+",
    },
    faqs: [],
    highlights: [
      "Four Seasons Surf Club — landmark hotel and residences",
      "Wide, uncrowded Atlantic Ocean beach",
      "Walkable Harding Avenue downtown",
      "Family-friendly community",
      "Walking distance to Bal Harbour Shops",
      "Just 1 square mile — intimate scale",
    ],
    zipCodes: ["33154"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "wynwood-midtown",
    name: "Wynwood / Midtown",
    tagline: "Art, Culture & Urban Energy",
    heroDescription:
      "Miami's creative epicenter. Wynwood and Midtown offer a dynamic blend of street art, galleries, restaurants, and a growing residential scene that attracts creative professionals and investors alike.",
    overview:
      "Wynwood transformed from a warehouse district into one of America's most vibrant arts neighborhoods. The Wynwood Walls — a curated outdoor museum of street art — put the area on the global map. Today, Wynwood and adjacent Midtown offer galleries, breweries, restaurants, boutiques, and a growing number of residential developments. Midtown provides a more residential, mixed-use environment with shops and dining at Midtown Miami and the Design District nearby.",
    buyerProfile:
      "Creative professionals, tech workers, young entrepreneurs, and investors betting on continued appreciation. Wynwood attracts buyers who value culture and walkability over waterfront views. Midtown draws residents wanting urban convenience at prices below Brickell and Edgewater.",
    lifestyle:
      "Gallery walks during Art Walk (second Saturday of each month), craft cocktails at Wynwood bars, weekend brunch at one of dozens of restaurants, and browsing the Design District's luxury flagships. The neighborhood is one of Miami's most walkable and bikeable.",
    priceRange: { low: "$350K", high: "$5M", median: "$550K" },
    stats: {
      medianPrice: "$550,000",
      avgDom: "60",
      pricePerSqft: "$520",
      activeInventory: "350+",
    },
    faqs: [],
    highlights: [
      "Wynwood Walls — world-famous street art",
      "Art Walk — monthly gallery event",
      "Design District — luxury retail and dining",
      "Growing residential development pipeline",
      "One of Miami's most walkable neighborhoods",
      "Thriving restaurant and bar scene",
    ],
    zipCodes: ["33127", "33137"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "fisher-island",
    name: "Fisher Island",
    tagline: "Accessible Only by Ferry",
    heroDescription:
      "The most exclusive residential community in Miami — a private island accessible only by ferry or yacht, with the highest per-capita income of any zip code in the United States.",
    overview:
      "Fisher Island is a 216-acre private island in Biscayne Bay, accessible only by private ferry from the MacArthur Causeway terminal. Originally the winter estate of the Vanderbilt family, it's now a members-only residential community with a championship golf course, private beach club, deep-water marina, spa, and multiple restaurants. The island has roughly 750 residences ranging from condos to lavish estates.",
    buyerProfile:
      "Ultra-high-net-worth individuals and families seeking total privacy and security. Residents include CEOs, hedge fund managers, retired athletes, and international billionaires. The community is gated with its own security force — visitors must be pre-approved. Membership in the Fisher Island Club is required.",
    lifestyle:
      "Private beach on the southern tip with views of the Port of Miami and South Beach, 9-hole championship golf course, world-class tennis courts, deep-water marina for mega-yachts, multiple restaurants and bars, a full-service spa, and a private K-8 school. The island operates like a self-contained luxury resort.",
    priceRange: { low: "$2M", high: "$90M", median: "$6.5M" },
    stats: {
      medianPrice: "$6,500,000",
      avgDom: "120",
      pricePerSqft: "$1,500",
      activeInventory: "40+",
    },
    faqs: [],
    highlights: [
      "Private ferry-only access",
      "Highest per-capita income zip code in the U.S.",
      "Championship golf course",
      "Deep-water marina",
      "Former Vanderbilt estate",
      "Private beach club and K-8 school",
    ],
    zipCodes: ["33109"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },

  /* ── New Miami-Dade Neighborhoods (matching Chad Carroll's coverage) ── */

  {
    slug: "bay-harbor",
    name: "Bay Harbor Islands",
    tagline: "Island Charm, Central Location",
    heroDescription: "A pair of man-made islands between Bal Harbour and Surfside, offering a quiet residential atmosphere with easy access to the beach and Bal Harbour Shops.",
    overview: "Bay Harbor Islands is a small, family-friendly community of two islands connected by bridges in northeast Miami-Dade. Known for its walkable downtown, top-rated Ruth K. Broad Bay Harbor K-8 Center, and proximity to Bal Harbour Shops and the beach.",
    buyerProfile: "Families seeking top schools and a quiet island lifestyle, buyers priced out of Bal Harbour and Surfside, and investors seeking value in a prime location.",
    lifestyle: "Walking to Bal Harbour Shops, cycling across the islands, top-rated schools, and a genuine small-town feel surrounded by water.",
    priceRange: { low: "$300K", high: "$10M", median: "$650K" },
    stats: { medianPrice: "$650,000", avgDom: "65", pricePerSqft: "$550", activeInventory: "120+" },
    faqs: [],
    highlights: ["Top-rated K-8 school", "Walking distance to Bal Harbour Shops", "Quiet island community", "Waterfront living"],
    zipCodes: ["33154"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "belle-meade",
    name: "Belle Meade",
    tagline: "Historic Bayfront Enclave",
    heroDescription: "A small, historic neighborhood on Biscayne Bay between the Upper East Side and Miami Shores, known for its mid-century homes and waterfront lots.",
    overview: "Belle Meade is a gated neighborhood of roughly 175 homes on Biscayne Bay. Established in the 1940s, it features a mix of original mid-century and newly built luxury homes on large lots with mature tropical landscaping.",
    buyerProfile: "Families and professionals seeking a private, gated bayfront community with larger lots and a neighborhood feel.",
    lifestyle: "Bayfront living with private community access, proximity to the Design District, and a quiet residential atmosphere.",
    priceRange: { low: "$800K", high: "$15M", median: "$2.5M" },
    stats: { medianPrice: "$2,500,000", avgDom: "85", pricePerSqft: "$650", activeInventory: "15+" },
    faqs: [],
    highlights: ["Gated bayfront community", "~175 homes", "Large lots with mature landscaping", "Minutes to Design District"],
    zipCodes: ["33137"],
    propertyTypes: ["HOMES"],
    county: "miami-dade",
  },
  {
    slug: "brickell-key",
    name: "Brickell Key",
    tagline: "Island Living in the City",
    heroDescription: "A private island in Biscayne Bay connected to Brickell by a single bridge, offering a resort-like atmosphere with panoramic water views and the Mandarin Oriental.",
    overview: "Brickell Key is a 44-acre man-made island just off the Brickell shoreline. Home to the Mandarin Oriental Miami, several luxury condo towers, and a waterfront jogging path with downtown skyline views. The single-bridge access provides security and exclusivity.",
    buyerProfile: "Professionals and families wanting island tranquility minutes from Brickell's urban core. International buyers seeking a prestigious address with hotel-level amenities.",
    lifestyle: "Morning jogs around the island perimeter, Mandarin Oriental spa and dining, kayaking in Biscayne Bay, and a short walk to Brickell City Centre.",
    priceRange: { low: "$400K", high: "$12M", median: "$900K" },
    stats: { medianPrice: "$900,000", avgDom: "70", pricePerSqft: "$650", activeInventory: "80+" },
    faqs: [],
    highlights: ["Mandarin Oriental Miami", "Single-bridge island access", "Panoramic bay and skyline views", "Waterfront jogging path"],
    zipCodes: ["33131"],
    propertyTypes: ["CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "buena-vista",
    name: "Buena Vista",
    tagline: "Design District Adjacent",
    heroDescription: "A historic neighborhood directly adjacent to the Miami Design District, experiencing rapid transformation while maintaining its early 20th-century architectural character.",
    overview: "Buena Vista is one of Miami's oldest neighborhoods, with historic homes dating to the early 1900s. Its location next to the Design District has driven significant appreciation and new development.",
    buyerProfile: "Creative professionals, investors, and buyers who value historic architecture with proximity to luxury retail and galleries.",
    lifestyle: "Walking to the Design District's flagship stores and galleries, historic home living, and a rapidly improving restaurant scene.",
    priceRange: { low: "$400K", high: "$5M", median: "$850K" },
    stats: { medianPrice: "$850,000", avgDom: "60", pricePerSqft: "$550", activeInventory: "50+" },
    faqs: [],
    highlights: ["Adjacent to Miami Design District", "Historic early 1900s homes", "Rapid appreciation", "Walkable to galleries and dining"],
    zipCodes: ["33137"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "eastern-shores",
    name: "Eastern Shores",
    tagline: "Waterfront Community in North Bay Village",
    heroDescription: "A residential enclave in North Bay Village offering waterfront homes and condos with Biscayne Bay access between Miami Beach and the mainland.",
    overview: "Eastern Shores is a waterfront community within North Bay Village, situated on islands in Biscayne Bay. It offers a mix of single-family homes and condos, many with private docks and direct bay access.",
    buyerProfile: "Boating enthusiasts, families seeking waterfront living at accessible prices, and buyers wanting proximity to both Miami Beach and the mainland.",
    lifestyle: "Boating and water sports on Biscayne Bay, quick access to Miami Beach via the 79th Street Causeway, and a quiet residential community.",
    priceRange: { low: "$350K", high: "$5M", median: "$750K" },
    stats: { medianPrice: "$750,000", avgDom: "70", pricePerSqft: "$480", activeInventory: "60+" },
    faqs: [],
    highlights: ["Direct Biscayne Bay access", "Private docks available", "Between Miami Beach and mainland", "Boating lifestyle"],
    zipCodes: ["33141"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "el-portal",
    name: "El Portal",
    tagline: "Village of Trees",
    heroDescription: "A tiny, tree-canopied village in northeast Miami-Dade known for its lush tropical landscaping, historic homes, and strong community identity.",
    overview: "El Portal is one of Miami-Dade's smallest municipalities — just 0.6 square miles. Known as the 'Village of Trees,' it has a distinct small-town character with a mix of mid-century and newly built homes under a dense tropical canopy.",
    buyerProfile: "Buyers seeking a quiet village atmosphere with character, proximity to the Design District and Upper East Side, and more affordable single-family homes.",
    lifestyle: "Tree-lined streets, community events, proximity to the Design District and Little River arts scene.",
    priceRange: { low: "$400K", high: "$2M", median: "$700K" },
    stats: { medianPrice: "$700,000", avgDom: "55", pricePerSqft: "$450", activeInventory: "20+" },
    faqs: [],
    highlights: ["'Village of Trees' — lush canopy", "0.6 square miles", "Strong community identity", "Near Design District"],
    zipCodes: ["33138"],
    propertyTypes: ["HOMES"],
    county: "miami-dade",
  },
  {
    slug: "gables-by-the-sea",
    name: "Gables by the Sea",
    tagline: "Waterfront Coral Gables Living",
    heroDescription: "An exclusive gated waterfront community in south Coral Gables with deep-water canal access to Biscayne Bay.",
    overview: "Gables by the Sea is a private, gated community in south Coral Gables featuring luxury homes on deep-water canals with ocean access. The community offers boat docks, a private marina, and lush tropical landscaping.",
    buyerProfile: "Boating families seeking gated waterfront living in Coral Gables, buyers wanting ocean access via canal, and those valuing privacy and security.",
    lifestyle: "Boating from your backyard to Biscayne Bay, gated security, Coral Gables schools, and a tight-knit residential community.",
    priceRange: { low: "$1.5M", high: "$10M", median: "$3.5M" },
    stats: { medianPrice: "$3,500,000", avgDom: "90", pricePerSqft: "$700", activeInventory: "10+" },
    faqs: [],
    highlights: ["Gated waterfront community", "Deep-water canal access to bay", "Private marina", "Coral Gables address"],
    zipCodes: ["33156"],
    propertyTypes: ["HOMES"],
    county: "miami-dade",
  },
  {
    slug: "glenvar-heights",
    name: "Glenvar Heights",
    tagline: "Spacious Suburban Living",
    heroDescription: "An unincorporated community in southwest Miami-Dade offering large lots, mature trees, and a family-oriented suburban lifestyle.",
    overview: "Glenvar Heights is a residential community west of Coral Gables known for spacious properties, excellent schools, and a quiet suburban atmosphere. Large lots and mature tropical landscaping define the neighborhood.",
    buyerProfile: "Families seeking space, good schools, and a suburban lifestyle with easy access to Coral Gables and Dadeland.",
    lifestyle: "Spacious yards, family-oriented community, proximity to Dadeland Mall and Coral Gables, top-rated schools.",
    priceRange: { low: "$500K", high: "$3M", median: "$900K" },
    stats: { medianPrice: "$900,000", avgDom: "60", pricePerSqft: "$400", activeInventory: "40+" },
    faqs: [],
    highlights: ["Large lots", "Top-rated schools", "Mature tropical landscaping", "Near Dadeland and Coral Gables"],
    zipCodes: ["33143"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "golden-beach",
    name: "Golden Beach",
    tagline: "Ultra-Private Oceanfront",
    heroDescription: "One of South Florida's most exclusive oceanfront communities — a private, gated town of just 370 homes with its own police force and direct beach access.",
    overview: "Golden Beach is an ultra-exclusive residential town between Sunny Isles and Hallandale Beach. With approximately 370 single-family homes, private beach access, its own police department, and no commercial properties, it offers unmatched privacy and exclusivity on the ocean.",
    buyerProfile: "Ultra-high-net-worth families seeking privacy, oceanfront living, and small-town exclusivity. Many residents are business leaders and international buyers.",
    lifestyle: "Private beach access, total privacy, own police force, and an intimate community of roughly 370 families on the ocean.",
    priceRange: { low: "$5M", high: "$50M", median: "$12M" },
    stats: { medianPrice: "$12,000,000", avgDom: "120", pricePerSqft: "$1,200", activeInventory: "15+" },
    faqs: [],
    highlights: ["~370 single-family homes", "Private oceanfront beach", "Own police department", "No commercial properties", "Gated town"],
    zipCodes: ["33160"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "high-pines",
    name: "High Pines",
    tagline: "Family-Friendly South Miami",
    heroDescription: "A leafy, family-oriented neighborhood in south Miami-Dade known for excellent schools, tree-lined streets, and a strong community feel.",
    overview: "High Pines is a desirable residential neighborhood between Coral Gables and South Miami. Known for its A-rated schools, walkable streets, and family-oriented atmosphere, it offers charming single-family homes under a dense tree canopy.",
    buyerProfile: "Families with school-age children, professionals seeking a walkable neighborhood near Coral Gables, and buyers valuing community and character.",
    lifestyle: "Walking to top-rated schools, family-friendly community events, proximity to Sunset Place and South Miami dining.",
    priceRange: { low: "$600K", high: "$3M", median: "$1.1M" },
    stats: { medianPrice: "$1,100,000", avgDom: "55", pricePerSqft: "$500", activeInventory: "25+" },
    faqs: [],
    highlights: ["A-rated schools", "Tree-lined streets", "Strong community feel", "Between Coral Gables and South Miami"],
    zipCodes: ["33156"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "keystone",
    name: "Keystone Point",
    tagline: "Waterfront Living, Mainland Convenience",
    heroDescription: "A waterfront residential community in North Miami with deep-water canal access, no bridges to the bay, and a mix of mid-century and new construction homes.",
    overview: "Keystone Point is a sought-after waterfront neighborhood in North Miami offering homes on deep-water canals with no-bridge access to Biscayne Bay. The community features a mix of original mid-century homes and modern new construction.",
    buyerProfile: "Boating enthusiasts seeking no-bridge bay access, families wanting waterfront living at lower prices than Miami Beach, and buyers building new on waterfront lots.",
    lifestyle: "Boating from your dock to the bay with no bridges, waterfront living, and easy access to Aventura and North Miami Beach.",
    priceRange: { low: "$600K", high: "$5M", median: "$1.5M" },
    stats: { medianPrice: "$1,500,000", avgDom: "75", pricePerSqft: "$550", activeInventory: "30+" },
    faqs: [],
    highlights: ["No-bridge access to Biscayne Bay", "Deep-water canals", "Mix of mid-century and new construction", "North Miami waterfront"],
    zipCodes: ["33181"],
    propertyTypes: ["HOMES"],
    county: "miami-dade",
  },
  {
    slug: "la-gorce",
    name: "La Gorce",
    tagline: "Prestigious Miami Beach Enclave",
    heroDescription: "An exclusive neighborhood on Miami Beach centered around the historic La Gorce Country Club, featuring grand waterfront estates on wide canals.",
    overview: "La Gorce is one of Miami Beach's most prestigious residential enclaves, built around the La Gorce Country Club (est. 1927). The neighborhood features grand homes on wide Biscayne Bay canals with private docks, mature landscaping, and a quiet atmosphere.",
    buyerProfile: "Affluent families and executives seeking large waterfront homes on Miami Beach with country club access and privacy.",
    lifestyle: "Golf at La Gorce Country Club, boating from private docks, waterfront entertaining, and a quiet retreat on Miami Beach.",
    priceRange: { low: "$3M", high: "$30M", median: "$8M" },
    stats: { medianPrice: "$8,000,000", avgDom: "100", pricePerSqft: "$1,000", activeInventory: "10+" },
    faqs: [],
    highlights: ["La Gorce Country Club (est. 1927)", "Grand waterfront estates", "Wide Biscayne Bay canals", "Private docks"],
    zipCodes: ["33140"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "miami",
    name: "Miami",
    tagline: "The Magic City",
    heroDescription: "Greater Miami encompasses diverse neighborhoods from urban high-rises to suburban communities, all united by tropical living and a global cultural identity.",
    overview: "The City of Miami is the urban core of Miami-Dade County, encompassing neighborhoods from Brickell and Downtown to Little Havana, Overtown, and beyond. As the gateway to Latin America and the Caribbean, Miami is one of the most international cities in the world.",
    buyerProfile: "A diverse buyer pool from first-time buyers to ultra-luxury seekers, international investors, and corporate relocations.",
    lifestyle: "A global city offering world-class dining, arts and culture, nightlife, beaches, and year-round tropical weather.",
    priceRange: { low: "$200K", high: "$150M", median: "$600K" },
    stats: { medianPrice: "$600,000", avgDom: "65", pricePerSqft: "$500", activeInventory: "5,000+" },
    faqs: [],
    highlights: ["Gateway to Latin America", "No state income tax", "Year-round tropical weather", "Global cultural hub"],
    zipCodes: ["33125", "33126", "33127", "33128", "33129", "33130", "33131", "33132", "33133", "33134", "33135", "33136", "33137", "33138"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "miami-shores",
    name: "Miami Shores",
    tagline: "Village of Charm",
    heroDescription: "A charming, tree-lined village in northeast Miami-Dade known for its historic homes, bayfront parks, and the Miami Shores Country Club.",
    overview: "Miami Shores is a small village of roughly 10,000 residents known for its well-maintained historic homes, walkable downtown along NE 2nd Avenue, bayfront parks, and the Miami Shores Country Club. Barry University is located here.",
    buyerProfile: "Families seeking a village atmosphere with character, buyers wanting historic homes at accessible prices, and professionals commuting to Downtown or the Design District.",
    lifestyle: "Village living with a walkable downtown, bayfront parks, country club golf, and a strong community calendar.",
    priceRange: { low: "$400K", high: "$3M", median: "$750K" },
    stats: { medianPrice: "$750,000", avgDom: "55", pricePerSqft: "$420", activeInventory: "40+" },
    faqs: [],
    highlights: ["Tree-lined streets", "Miami Shores Country Club", "Walkable downtown on NE 2nd Ave", "Bayfront parks"],
    zipCodes: ["33138", "33150"],
    propertyTypes: ["HOMES"],
    county: "miami-dade",
  },
  {
    slug: "midtown-miami",
    name: "Midtown Miami",
    tagline: "Urban Living, Central Location",
    heroDescription: "A walkable, mixed-use neighborhood between Wynwood and Edgewater offering modern condos, shops, and restaurants in the heart of Miami's creative corridor.",
    overview: "Midtown Miami is a modern, master-planned mixed-use development anchored by Midtown Miami shops and restaurants. Located between Wynwood and Edgewater, it provides a walkable urban lifestyle with easy access to the Design District.",
    buyerProfile: "Young professionals, creatives, and investors seeking modern urban living at prices below Brickell and Edgewater.",
    lifestyle: "Walking to Wynwood galleries and Design District shops, urban dining and nightlife, and a vibrant creative community.",
    priceRange: { low: "$300K", high: "$3M", median: "$500K" },
    stats: { medianPrice: "$500,000", avgDom: "55", pricePerSqft: "$480", activeInventory: "200+" },
    faqs: [],
    highlights: ["Walkable mixed-use neighborhood", "Between Wynwood and Edgewater", "Near Design District", "Modern condo towers"],
    zipCodes: ["33137"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "morningside",
    name: "Morningside",
    tagline: "Historic Bayfront District",
    heroDescription: "One of Miami's most beautiful historic neighborhoods, Morningside features 1920s Mediterranean Revival homes along Biscayne Bay in the Upper East Side.",
    overview: "Morningside is a historic residential neighborhood on Biscayne Bay in Miami's Upper East Side. Designated as a historic district, it features Mediterranean Revival and Art Deco homes from the 1920s-30s on large bayfront lots with mature tropical landscaping.",
    buyerProfile: "Architecture enthusiasts, families seeking historic bayfront homes, and buyers who value historic district protections and character.",
    lifestyle: "Historic home living on Biscayne Bay, Morningside Park, proximity to the Design District, and a strong historic preservation community.",
    priceRange: { low: "$800K", high: "$10M", median: "$2M" },
    stats: { medianPrice: "$2,000,000", avgDom: "80", pricePerSqft: "$600", activeInventory: "15+" },
    faqs: [],
    highlights: ["Historic district designation", "1920s Mediterranean Revival homes", "Bayfront lots", "Morningside Park"],
    zipCodes: ["33137"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "normandy",
    name: "Normandy Isles",
    tagline: "Affordable Miami Beach Island Living",
    heroDescription: "A residential neighborhood on the western islands of Miami Beach offering waterfront living and a historic golf course at prices below the beach barrier island.",
    overview: "Normandy Isles is a residential area on the western side of Miami Beach, centered around the Normandy Shores Golf Club. It offers a quieter, more affordable alternative to the oceanfront strips while still carrying a Miami Beach address.",
    buyerProfile: "Buyers seeking a Miami Beach address at lower price points, golfers, and families wanting a quieter island lifestyle.",
    lifestyle: "Golf at Normandy Shores, waterfront living on Biscayne Bay, quiet residential streets, and easy access to both beaches and the mainland.",
    priceRange: { low: "$300K", high: "$5M", median: "$600K" },
    stats: { medianPrice: "$600,000", avgDom: "65", pricePerSqft: "$450", activeInventory: "80+" },
    faqs: [],
    highlights: ["Normandy Shores Golf Club", "Miami Beach address at lower prices", "Biscayne Bay waterfront", "Quiet residential atmosphere"],
    zipCodes: ["33141"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "pinecrest",
    name: "Pinecrest",
    tagline: "South Florida's Premier Family Village",
    heroDescription: "An affluent village in south Miami-Dade renowned for its top-rated schools, sprawling estate lots, lush landscaping, and family-oriented lifestyle.",
    overview: "Pinecrest is a village of roughly 20,000 residents known for having some of the best public and private schools in Florida. Large lots (many over half an acre), mature tropical landscaping, and a strong community identity define this premier family neighborhood. Pinecrest Gardens is a botanical garden and cultural center.",
    buyerProfile: "Families prioritizing top-rated schools, buyers seeking large estate lots, and professionals wanting a prestigious suburban address.",
    lifestyle: "Top-rated schools, Pinecrest Gardens botanical garden, large private estates, farmers market, and a strong family community.",
    priceRange: { low: "$700K", high: "$15M", median: "$1.8M" },
    stats: { medianPrice: "$1,800,000", avgDom: "70", pricePerSqft: "$500", activeInventory: "80+" },
    faqs: [],
    highlights: ["Top-rated schools (Pinecrest Elementary, Gulliver Prep)", "Large estate lots", "Pinecrest Gardens", "Weekly farmers market"],
    zipCodes: ["33156", "33157"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "pinecrest-by-the-sea",
    name: "Pinecrest by the Sea",
    tagline: "Coastal Elegance in South Dade",
    heroDescription: "A small, exclusive waterfront community near Pinecrest offering private, estate-style homes with access to Biscayne Bay.",
    overview: "Pinecrest by the Sea is a small, exclusive residential enclave near Pinecrest offering waterfront homes on Biscayne Bay. The community combines the Pinecrest school district advantages with waterfront living.",
    buyerProfile: "Families wanting Pinecrest schools with waterfront living, and boating enthusiasts seeking bay access in south Miami-Dade.",
    lifestyle: "Waterfront estate living, Pinecrest schools, boating access to Biscayne Bay, and proximity to Pinecrest village amenities.",
    priceRange: { low: "$1.5M", high: "$8M", median: "$3M" },
    stats: { medianPrice: "$3,000,000", avgDom: "85", pricePerSqft: "$600", activeInventory: "5+" },
    faqs: [],
    highlights: ["Waterfront estates", "Pinecrest school district", "Biscayne Bay access", "Exclusive enclave"],
    zipCodes: ["33157"],
    propertyTypes: ["HOMES"],
    county: "miami-dade",
  },
  {
    slug: "sans-souci",
    name: "Sans Souci",
    tagline: "Waterfront North Miami Living",
    heroDescription: "A waterfront neighborhood in North Miami offering homes on Biscayne Bay canals with proximity to Aventura and Miami Beach.",
    overview: "Sans Souci is a residential neighborhood in North Miami situated along Biscayne Bay. The community offers waterfront homes on canals with bay access, a mix of original and new construction, and proximity to both Aventura and Miami Beach.",
    buyerProfile: "Waterfront buyers seeking value compared to Miami Beach, boating families, and investors looking at North Miami's growth trajectory.",
    lifestyle: "Waterfront living, boating, proximity to Aventura Mall and Oleta River State Park.",
    priceRange: { low: "$500K", high: "$4M", median: "$1M" },
    stats: { medianPrice: "$1,000,000", avgDom: "70", pricePerSqft: "$480", activeInventory: "25+" },
    faqs: [],
    highlights: ["Biscayne Bay canal homes", "Bay access for boating", "Near Aventura and Oleta River State Park", "Growing North Miami market"],
    zipCodes: ["33181"],
    propertyTypes: ["HOMES"],
    county: "miami-dade",
  },
  {
    slug: "south-miami",
    name: "South Miami",
    tagline: "Hometown Feel, Central Location",
    heroDescription: "A charming city within Miami-Dade offering a walkable downtown, top schools, and a family-oriented atmosphere near the University of Miami.",
    overview: "South Miami is a small city of roughly 13,000 residents known for its walkable downtown along Sunset Drive, proximity to the University of Miami, and family-friendly atmosphere. The Shops at Sunset Place and local restaurants anchor the commercial core.",
    buyerProfile: "Families, UM faculty and staff, and buyers seeking a walkable, community-oriented lifestyle at more accessible prices than Coral Gables.",
    lifestyle: "Walkable downtown, local dining on Sunset Drive, proximity to University of Miami, and a genuine small-city community feel.",
    priceRange: { low: "$400K", high: "$3M", median: "$750K" },
    stats: { medianPrice: "$750,000", avgDom: "55", pricePerSqft: "$420", activeInventory: "35+" },
    faqs: [],
    highlights: ["Walkable Sunset Drive downtown", "Near University of Miami", "Family-friendly atmosphere", "Accessible prices"],
    zipCodes: ["33143"],
    propertyTypes: ["HOMES"],
    county: "miami-dade",
  },
  {
    slug: "sunset-harbor",
    name: "Sunset Harbour",
    tagline: "Miami Beach's Fitness & Wellness Hub",
    heroDescription: "A trendy neighborhood on the western bayfront side of South Beach, known for its fitness studios, wellness culture, and waterfront dining.",
    overview: "Sunset Harbour is a small but vibrant neighborhood on the west side of South Beach along Biscayne Bay. It's become Miami Beach's fitness and wellness hub with boutique studios (SoulCycle, Barry's), healthy dining, and a laid-back waterfront vibe distinct from the Ocean Drive scene.",
    buyerProfile: "Health-conscious professionals, creatives, and buyers seeking a quieter South Beach lifestyle with bay views and sunset exposure.",
    lifestyle: "Boutique fitness studios, waterfront dining, sunset views over Biscayne Bay, and a laid-back alternative to Ocean Drive nightlife.",
    priceRange: { low: "$400K", high: "$8M", median: "$1.2M" },
    stats: { medianPrice: "$1,200,000", avgDom: "65", pricePerSqft: "$850", activeInventory: "50+" },
    faqs: [],
    highlights: ["Miami Beach fitness and wellness hub", "Bayfront sunset views", "SoulCycle, Barry's, and more", "Waterfront dining"],
    zipCodes: ["33139"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "sunset-island",
    name: "Sunset Islands",
    tagline: "Private Island Living on Miami Beach",
    heroDescription: "Four exclusive residential islands on the west side of Miami Beach offering grand waterfront estates with Biscayne Bay views and private docks.",
    overview: "The Sunset Islands are four private residential islands (Sunset Islands I-IV) on the western bayfront side of Miami Beach. Connected by bridges to the mainland of Miami Beach, they offer large waterfront lots, grand estates, and a level of privacy and exclusivity comparable to Star Island and the Venetian Islands.",
    buyerProfile: "Ultra-affluent families and individuals seeking private island estate living on Miami Beach with bay views and private docks.",
    lifestyle: "Waterfront estate living, private docks, Biscayne Bay boating, sunset views, and proximity to Lincoln Road and South Beach.",
    priceRange: { low: "$5M", high: "$40M", median: "$12M" },
    stats: { medianPrice: "$12,000,000", avgDom: "110", pricePerSqft: "$1,100", activeInventory: "10+" },
    faqs: [],
    highlights: ["Four private residential islands", "Grand waterfront estates", "Private docks on Biscayne Bay", "Near Lincoln Road"],
    zipCodes: ["33139"],
    propertyTypes: ["HOMES"],
    county: "miami-dade",
  },
  {
    slug: "the-roads",
    name: "The Roads",
    tagline: "Brickell's Residential Neighbor",
    heroDescription: "A quiet, tree-lined residential neighborhood just south of Brickell offering charming homes on winding streets — one of Miami's best-kept secrets.",
    overview: "The Roads is a residential neighborhood immediately south of Brickell, named for its winding, tree-lined streets (in contrast to Miami's typical grid pattern). The area offers a mix of historic homes, new construction, and small apartment buildings within walking distance of Brickell's restaurants and shops.",
    buyerProfile: "Professionals working in Brickell seeking a quieter residential neighborhood, families wanting walkability to urban amenities, and investors developing new construction.",
    lifestyle: "Tree-lined walks, proximity to Brickell dining and nightlife, Vizcaya Museum nearby, and a genuine neighborhood feel.",
    priceRange: { low: "$500K", high: "$5M", median: "$1M" },
    stats: { medianPrice: "$1,000,000", avgDom: "60", pricePerSqft: "$520", activeInventory: "35+" },
    faqs: [],
    highlights: ["Winding tree-lined streets", "Walking distance to Brickell", "Near Vizcaya Museum", "Mix of historic and new construction"],
    zipCodes: ["33129"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "upper-east-side",
    name: "Upper East Side",
    tagline: "Historic Bayfront Character",
    heroDescription: "A collection of historic bayfront neighborhoods along Biscayne Boulevard offering mid-century homes, waterfront parks, and a rapidly evolving dining and arts scene.",
    overview: "Miami's Upper East Side encompasses several historic neighborhoods along Biscayne Bay and Biscayne Boulevard, including Morningside, Belle Meade, and Bay Point. The area features mid-century modern homes, bayfront parks, and a growing restaurant scene along Biscayne Boulevard. Its proximity to the Design District and Wynwood has driven significant appreciation.",
    buyerProfile: "Architecture enthusiasts, creatives, families seeking bayfront living with character, and investors betting on continued Upper East Side appreciation.",
    lifestyle: "Bayfront parks, mid-century home living, growing restaurant scene on Biscayne Boulevard, proximity to Design District and Wynwood.",
    priceRange: { low: "$400K", high: "$10M", median: "$900K" },
    stats: { medianPrice: "$900,000", avgDom: "65", pricePerSqft: "$520", activeInventory: "60+" },
    faqs: [],
    highlights: ["Historic bayfront neighborhoods", "Mid-century modern architecture", "Near Design District and Wynwood", "Biscayne Boulevard dining"],
    zipCodes: ["33137", "33138"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
  {
    slug: "venetian-islands",
    name: "Venetian Islands",
    tagline: "Chain of Exclusive Islands",
    heroDescription: "A chain of six man-made islands connected by the Venetian Causeway between Miami Beach and the mainland, offering some of the most coveted residential addresses in South Florida.",
    overview: "The Venetian Islands are a chain of six islands — Biscayne, San Marco, San Marino, Di Lido, Belle, and Rivo Alto — connected by the historic Venetian Causeway. These exclusive residential islands offer waterfront homes with Biscayne Bay views, private docks, and a unique island lifestyle with easy access to both South Beach and Downtown Miami.",
    buyerProfile: "Ultra-high-net-worth buyers, celebrities, and executives seeking trophy island properties with water views in both directions, private docking, and exclusivity.",
    lifestyle: "Island living on Biscayne Bay, cycling the Venetian Causeway, private docks and boating, and a connected-yet-separate lifestyle between Miami Beach and Downtown.",
    priceRange: { low: "$2M", high: "$50M", median: "$7M" },
    stats: { medianPrice: "$7,000,000", avgDom: "100", pricePerSqft: "$1,000", activeInventory: "15+" },
    faqs: [],
    highlights: ["Six exclusive islands", "Historic Venetian Causeway", "Biscayne Bay views both sides", "Private docks", "Between South Beach and Downtown"],
    zipCodes: ["33139"],
    propertyTypes: ["HOMES", "CONDOS"],
    county: "miami-dade",
  },
];

export function getNeighborhoodBySlug(
  slug: string
): NeighborhoodData | undefined {
  return neighborhoods.find((n) => n.slug === slug);
}
