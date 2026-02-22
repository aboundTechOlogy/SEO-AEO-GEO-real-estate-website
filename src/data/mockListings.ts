export interface ListingData {
  image?: string;
  price: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  status?: string;
  href: string;
  isSold?: boolean;
  listDate?: string; // ISO date string for relative time badges
  photoCount?: number;
}

export const MOCK_EXCLUSIVE: ListingData[] = [
  { price: "$4,250,000", address: "1000 Brickell Plaza #5501", city: "Miami", state: "FL", zip: "33131", beds: 4, baths: 4, sqft: 3200, status: "New", listDate: new Date(Date.now() - 2 * 3600000).toISOString(), photoCount: 43, href: "/property/P_69179ef9b7bb783d6039ab66/" },
  { price: "$2,850,000", address: "900 Biscayne Blvd #4201", city: "Miami", state: "FL", zip: "33132", beds: 3, baths: 3, sqft: 2450, listDate: new Date(Date.now() - 18 * 3600000).toISOString(), photoCount: 35, href: "/property/P_69179ef9b7bb783d6039abce/" },
  { price: "$7,500,000", address: "7412 Fisher Island Dr", city: "Miami Beach", state: "FL", zip: "33109", beds: 5, baths: 6, sqft: 5100, status: "New", listDate: new Date(Date.now() - 5 * 3600000).toISOString(), photoCount: 52, href: "/property/P_69179ef9b7bb783d6039ab70/" },
  { price: "$1,995,000", address: "2627 S Bayshore Dr #2401", city: "Coconut Grove", state: "FL", zip: "33133", beds: 3, baths: 3, sqft: 2100, listDate: new Date(Date.now() - 3 * 86400000).toISOString(), photoCount: 28, href: "/property/P_69179ef9b7bb783d6039ab78/" },
  { price: "$12,500,000", address: "6800 Indian Creek Dr", city: "Miami Beach", state: "FL", zip: "33141", beds: 7, baths: 8, sqft: 8500, status: "New", listDate: new Date(Date.now() - 1 * 3600000).toISOString(), photoCount: 67, href: "/property/P_69179ef9b7bb783d6039abad/" },
];

export const MOCK_SOLD: ListingData[] = [
  { price: "$3,100,000", address: "800 S Pointe Dr #1803", city: "Miami Beach", state: "FL", zip: "33139", beds: 3, baths: 3, sqft: 2800, isSold: true, href: "#" },
  { price: "$1,450,000", address: "1643 Brickell Ave #3204", city: "Miami", state: "FL", zip: "33129", beds: 2, baths: 2, sqft: 1650, isSold: true, href: "#" },
  { price: "$5,800,000", address: "300 S Biscayne Blvd PH", city: "Miami", state: "FL", zip: "33131", beds: 4, baths: 5, sqft: 4200, isSold: true, href: "#" },
  { price: "$875,000", address: "480 NE 31st St #1802", city: "Miami", state: "FL", zip: "33137", beds: 2, baths: 2, sqft: 1200, isSold: true, href: "#" },
  { price: "$9,200,000", address: "2000 S Ocean Dr PH", city: "Hallandale Beach", state: "FL", zip: "33009", beds: 4, baths: 4, sqft: 3800, isSold: true, href: "#" },
];

export const MOCK_SEARCH: ListingData[] = [
  ...MOCK_EXCLUSIVE,
  { price: "$1,650,000", address: "3470 E Coast Ave #H1402", city: "Miami", state: "FL", zip: "33137", beds: 3, baths: 2, sqft: 1900, href: "/property/P_69179ef9b7bb783d6039abc2/" },
  { price: "$3,500,000", address: "10 Venetian Way #1702", city: "Miami Beach", state: "FL", zip: "33139", beds: 3, baths: 3.5, sqft: 2600, status: "Price Reduced", href: "/property/P_69179ef9b7bb783d6039abf1/" },
  { price: "$825,000", address: "1060 Brickell Ave #2107", city: "Miami", state: "FL", zip: "33131", beds: 1, baths: 1, sqft: 850, href: "/property/P_69179ef9b7bb783d6039abd7/" },
  { price: "$5,900,000", address: "3315 Collins Ave #PH-A", city: "Miami Beach", state: "FL", zip: "33140", beds: 4, baths: 5, sqft: 4200, status: "New", href: "/property/P_69179ef9b7bb783d6039abdf/" },
  { price: "$2,100,000", address: "1500 Bay Rd #1428S", city: "Miami Beach", state: "FL", zip: "33139", beds: 3, baths: 3, sqft: 2350, href: "/property/P_69179ef9b7bb783d6039ac0f/" },
  { price: "$1,275,000", address: "801 S Pointe Dr #401", city: "Miami Beach", state: "FL", zip: "33139", beds: 2, baths: 2, sqft: 1450, href: "/property/P_69179ef9b7bb783d6039abe7/" },
  { price: "$8,750,000", address: "5959 Collins Ave #PH-1", city: "Miami Beach", state: "FL", zip: "33140", beds: 5, baths: 5.5, sqft: 5800, status: "New", href: "/property/P_69179ef9b7bb783d6039abb8/" },
  { price: "$3,200,000", address: "2000 N Bayshore Dr #1801", city: "Miami", state: "FL", zip: "33137", beds: 3, baths: 3.5, sqft: 2700, href: "/property/P_69179ef9b7bb783d6039ab83/" },
  { price: "$975,000", address: "1830 S Ocean Dr #2208", city: "Hallandale Beach", state: "FL", zip: "33009", beds: 2, baths: 2, sqft: 1250, href: "/property/P_69179ef9b7bb783d6039ab5b/" },
  { price: "$4,500,000", address: "19575 Collins Ave #42", city: "Sunny Isles Beach", state: "FL", zip: "33160", beds: 3, baths: 4.5, sqft: 3100, status: "Price Reduced", href: "/property/P_69179ef9b7bb783d6039aba3/" },
  { price: "$1,450,000", address: "333 Las Olas Way #3010", city: "Fort Lauderdale", state: "FL", zip: "33301", beds: 2, baths: 2.5, sqft: 1800, href: "/property/P_69179ef9b7bb783d6039ab8d/" },
  { price: "$6,200,000", address: "2200 N Ocean Blvd #PH-1", city: "Fort Lauderdale", state: "FL", zip: "33305", beds: 4, baths: 4, sqft: 4500, status: "New", href: "/property/P_69179ef9b7bb783d6039ab98/" },
  { price: "$2,750,000", address: "400 Alton Rd #2811", city: "Miami Beach", state: "FL", zip: "33139", beds: 3, baths: 3, sqft: 2200, href: "/property/P_69179ef9b7bb783d6039abfb/" },
  { price: "$1,100,000", address: "3000 Holiday Dr #606", city: "Fort Lauderdale", state: "FL", zip: "33316", beds: 2, baths: 2, sqft: 1350, href: "/property/P_69179ef9b7bb783d6039ac05/" },
  { price: "$15,000,000", address: "7000 Island Blvd #PH-2", city: "Aventura", state: "FL", zip: "33160", beds: 6, baths: 7, sqft: 7200, status: "New", href: "/property/P_69179ef9b7bb783d6039ac1a/" },
  { price: "$895,000", address: "110 Washington Ave #1812", city: "Miami Beach", state: "FL", zip: "33139", beds: 1, baths: 1.5, sqft: 980, href: "/property/P_69179ef9b7bb783d6039ac26/" },
  { price: "$3,850,000", address: "1 N Fort Lauderdale Beach Blvd #2102", city: "Fort Lauderdale", state: "FL", zip: "33304", beds: 3, baths: 3.5, sqft: 2900, href: "/property/P_69179ef9b7bb783d6039ac31/" },
  { price: "$2,400,000", address: "9705 Collins Ave #1405N", city: "Bal Harbour", state: "FL", zip: "33154", beds: 3, baths: 3, sqft: 2500, href: "/property/P_69179ef9b7bb783d6039ac3b/" },
  { price: "$1,800,000", address: "701 N Fort Lauderdale Blvd #PH5", city: "Fort Lauderdale", state: "FL", zip: "33304", beds: 3, baths: 2.5, sqft: 2100, status: "Price Reduced", href: "/property/P_69179ef9b7bb783d6039ac43/" },
];
