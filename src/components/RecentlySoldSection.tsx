import RecentlySold from "@/components/RecentlySold";
import { getSoldListings, propertyToCardListing } from "@/lib/bridge";

export default async function RecentlySoldSection() {
  const listings = await getSoldListings(8);
  const cards = listings.slice(0, 8).map((listing) => propertyToCardListing(listing, true));

  return <RecentlySold listings={cards} />;
}
