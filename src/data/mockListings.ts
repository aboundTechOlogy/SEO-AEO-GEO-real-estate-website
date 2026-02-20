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
}

export const MOCK_EXCLUSIVE: ListingData[] = [
  { price: "$4,250,000", address: "1000 Brickell Plaza #5501", city: "Miami", state: "FL", zip: "33131", beds: 4, baths: 4, sqft: 3200, status: "New", href: "#" },
  { price: "$2,850,000", address: "900 Biscayne Blvd #4201", city: "Miami", state: "FL", zip: "33132", beds: 3, baths: 3, sqft: 2450, status: "", href: "#" },
  { price: "$7,500,000", address: "7412 Fisher Island Dr", city: "Miami Beach", state: "FL", zip: "33109", beds: 5, baths: 6, sqft: 5100, status: "New", href: "#" },
  { price: "$1,995,000", address: "2627 S Bayshore Dr #2401", city: "Coconut Grove", state: "FL", zip: "33133", beds: 3, baths: 3, sqft: 2100, status: "", href: "#" },
  { price: "$12,500,000", address: "6800 Indian Creek Dr", city: "Miami Beach", state: "FL", zip: "33141", beds: 7, baths: 8, sqft: 8500, status: "New", href: "#" },
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
  { price: "$1,650,000", address: "3470 E Coast Ave #H1402", city: "Miami", state: "FL", zip: "33137", beds: 3, baths: 2, sqft: 1900, href: "#" },
  { price: "$3,500,000", address: "10 Venetian Way #1702", city: "Miami Beach", state: "FL", zip: "33139", beds: 3, baths: 3.5, sqft: 2600, status: "Price Reduced", href: "#" },
  { price: "$825,000", address: "1060 Brickell Ave #2107", city: "Miami", state: "FL", zip: "33131", beds: 1, baths: 1, sqft: 850, href: "#" },
];
