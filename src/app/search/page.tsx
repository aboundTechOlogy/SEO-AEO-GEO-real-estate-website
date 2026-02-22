import { Suspense } from "react";
import type { Metadata } from "next";
import SearchPageClient from "@/components/SearchPageClient";

export const metadata: Metadata = {
  title: "Search Properties | Andrew Whalen",
  description:
    "Search live property listings with filters for price, beds, baths, status, and map view.",
  openGraph: {
    title: "Search Properties | Andrew Whalen",
    description: "Search live property listings across the Bridge MLS test dataset.",
    type: "website",
    url: "https://iamandrewwhalen.com/search/",
  },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white min-h-screen flex items-center justify-center text-gray-600 text-sm uppercase tracking-[0.16em]">
          Loading search...
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
