import ExclusiveListings from "@/components/ExclusiveListings";
import { getRecentListings, propertyToCardListing } from "@/lib/bridge";

export default async function ExclusiveListingsSection() {
  const listings = await getRecentListings(8);
  const cards = listings.slice(0, 8).map((listing) => propertyToCardListing(listing));

  return <ExclusiveListings listings={cards} />;
}
