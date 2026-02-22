import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  // TODO: Route to GHL CRM
  console.log("Market Analysis Request:", data);
  return NextResponse.json({ success: true, message: "Request received" });
}
