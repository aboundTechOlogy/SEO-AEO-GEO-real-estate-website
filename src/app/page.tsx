import { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import PropertySearch from "@/components/PropertySearch";
import ExclusiveListingsSection from "@/components/ExclusiveListingsSection";
// import ExclusiveVideos from "@/components/ExclusiveVideos";
import AnimatedTextBanner from "@/components/AnimatedTextBanner";
import AboutCover from "@/components/AboutCover";
import AboutDescription from "@/components/AboutDescription";
import NeighborhoodBlades from "@/components/NeighborhoodBlades";
import RecentlySoldSection from "@/components/RecentlySoldSection";
import TestimonialsSection from "@/components/TestimonialsSection";
// import PressSection from "@/components/PressSection";
// import InstagramFeed from "@/components/InstagramFeed";
import ContactFormSection from "@/components/ContactFormSection";

export const metadata: Metadata = {
  title: "Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "South Florida luxury real estate specialist. 1,300+ transactions, 21+ years experience across Miami-Dade, Broward, and Palm Beach counties.",
  openGraph: {
    title: "Andrew Whalen | South Florida Luxury Real Estate",
    description:
      "South Florida luxury real estate specialist serving Miami-Dade, Broward, and Palm Beach.",
    url: "https://iamandrewwhalen.com",
    siteName: "Andrew Whalen | LoKation Real Estate",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PropertySearch />
      <ExclusiveListingsSection />
      {/* <ExclusiveVideos /> */}
      <AnimatedTextBanner />
      <AboutCover />
      <AboutDescription />
      <NeighborhoodBlades />
      <RecentlySoldSection />
      <TestimonialsSection />
      {/* <PressSection /> */}
      {/* <InstagramFeed /> */}
      <ContactFormSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Andrew Whalen",
            description:
              "South Florida luxury real estate specialist with 1,300+ transactions across Miami-Dade, Broward, and Palm Beach counties.",
            url: "https://iamandrewwhalen.com",
            telephone: "+1-305-455-9744",
            address: {
              "@type": "PostalAddress",
              streetAddress: "1900 N Bayshore Dr, Suite 120",
              addressLocality: "Miami",
              addressRegion: "FL",
              postalCode: "33132",
              addressCountry: "US",
            },
            sameAs: [
              "https://www.instagram.com/iamandrewwhalen/",
              "https://www.tiktok.com/@iamandrewwhalen",
              "https://x.com/iamandrewwhalen",
              "https://www.facebook.com/ImAndrewWhalen",
              "https://www.youtube.com/@andrewwhalen11",
              "https://www.linkedin.com/in/iamandrewwhalen/",
            ],
            worksFor: {
              "@type": "RealEstateAgent",
              name: "LoKation Real Estate",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1900 N Bayshore Dr, Suite 120",
                addressLocality: "Miami",
                addressRegion: "FL",
                postalCode: "33132",
                addressCountry: "US",
              },
              telephone: "+1-305-455-9744",
            },
            areaServed: ["Miami-Dade County", "Broward County", "Palm Beach County"],
          }),
        }}
      />
    </>
  );
}
