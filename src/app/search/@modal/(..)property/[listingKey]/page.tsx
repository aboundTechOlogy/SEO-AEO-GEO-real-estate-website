import PropertyDetailPanel from "@/components/PropertyDetailPanel";
import { getProperty } from "@/lib/bridge";

interface Props {
  params: Promise<{ listingKey: string }>;
}

export default async function InterceptedPropertyPage({ params }: Props) {
  const { listingKey } = await params;
  const property = await getProperty(listingKey);

  return <PropertyDetailPanel property={property} listingKey={listingKey} />;
}
