import { NextRequest, NextResponse } from "next/server";
import { getProperty } from "@/lib/bridge";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ listingKey: string }> }
) {
  const { listingKey } = await params;

  if (!listingKey) {
    return NextResponse.json({ error: "Missing listingKey" }, { status: 400 });
  }

  const property = await getProperty(listingKey);

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  return NextResponse.json(property);
}
