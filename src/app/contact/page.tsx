import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Andrew Whalen | Miami Luxury Real Estate",
  description:
    "Get in touch with Andrew Whalen for luxury real estate in Miami. Buying, selling, investing — let's talk about your goals.",
  openGraph: {
    title: "Contact Andrew Whalen | Miami Luxury Real Estate",
    description:
      "Get in touch for luxury real estate in Miami. Buying, selling, investing.",
    type: "website",
    url: "https://iamandrewwhalen.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-16">
            {/* Form — 3 columns */}
            <div className="md:col-span-3">
              <div className="gold-line mb-6" />
              <h1 className="font-playfair text-4xl md:text-5xl font-light mb-4">
                Let&apos;s Talk
              </h1>
              <p className="text-neutral-400 mb-12 max-w-lg">
                Whether you&apos;re buying, selling, or investing — I&apos;m
                here to help.
              </p>
              <ContactForm />
            </div>

            {/* Right column — contact info */}
            <div className="md:col-span-2">
              <div className="sticky top-32 space-y-8">
                <div>
                  <h2 className="font-playfair text-2xl mb-1">Andrew Whalen</h2>
                  <p className="text-neutral-400 text-sm">
                    Realtor&reg; &middot; LoKation Real Estate
                  </p>
                </div>

                <div className="space-y-3 text-neutral-300">
                  <p>
                    <a
                      href="mailto:andrew@iamandrewwhalen.com"
                      className="hover:text-white transition-colors"
                    >
                      andrew@iamandrewwhalen.com
                    </a>
                  </p>
                  <p>
                    <a
                      href="tel:+13054206613"
                      className="hover:text-white transition-colors"
                    >
                      (305) 420-6613
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-neutral-500 uppercase tracking-wider mb-3">
                    Office
                  </h3>
                  <div className="text-neutral-400 text-sm leading-relaxed">
                    <p>1900 N Bayshore Dr, Suite 120</p>
                    <p>Miami, FL 33132</p>
                  </div>
                </div>

                <img
                  src="/lokation-logo-white.png"
                  alt="LoKation Real Estate"
                  className="h-8 w-auto opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD: Static hardcoded structured data for SEO */}
      <script
        type="application/ld+json"
        /* eslint-disable-next-line -- static trusted content, no user input */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Andrew Whalen",
            description:
              "Get in touch with Andrew Whalen for luxury real estate in Miami.",
            url: "https://iamandrewwhalen.com/contact",
            mainEntity: {
              "@type": "RealEstateAgent",
              name: "Andrew Whalen",
              telephone: "+1-305-420-6613",
              email: "andrew@iamandrewwhalen.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1900 N Bayshore Dr, Suite 120",
                addressLocality: "Miami",
                addressRegion: "FL",
                postalCode: "33132",
                addressCountry: "US",
              },
            },
          }),
        }}
      />
    </>
  );
}
