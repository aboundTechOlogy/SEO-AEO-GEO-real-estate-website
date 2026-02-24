import { NextRequest, NextResponse } from "next/server";
import { fetchAutocomplete } from "@/lib/bridge";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const status = req.nextUrl.searchParams.get("status") || "Active";

  if (q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const suggestions = await fetchAutocomplete(q, status);
  return NextResponse.json(suggestions);
}
