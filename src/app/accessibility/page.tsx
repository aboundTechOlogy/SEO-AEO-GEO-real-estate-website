import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Andrew Whalen is committed to digital accessibility for all users. Learn about our accessibility standards and how to request assistance.",
  openGraph: {
    title: "Accessibility | Andrew Whalen",
    description: "Accessibility statement for iamandrewwhalen.com.",
    type: "website",
    url: "https://iamandrewwhalen.com/accessibility",
  },
};

export default function AccessibilityPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <img
          src="/hero-miami.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/85" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <div>
            <p className="text-neutral-400 text-sm uppercase tracking-[0.3em] mb-4">
              Andrew Whalen
            </p>
            <h1 className="font-playfair text-5xl md:text-6xl font-light text-white">
              Accessibility
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#0a0a0a] py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none">
            <h2 className="font-playfair text-3xl text-white mb-6">
              Our Commitment to Accessibility
            </h2>
            <p className="text-neutral-300 leading-relaxed mb-6">
              Andrew Whalen is committed to ensuring digital accessibility for
              people with disabilities. We continually improve the user
              experience for everyone and apply the relevant accessibility
              standards to ensure we provide equal access to all of our users.
            </p>

            <h3 className="font-playfair text-2xl text-white mt-10 mb-4">
              Standards
            </h3>
            <p className="text-neutral-300 leading-relaxed mb-6">
              We aim to conform to the Web Content Accessibility Guidelines
              (WCAG) 2.1 Level AA. These guidelines explain how to make web
              content more accessible to people with disabilities. Conformance
              with these guidelines helps make the web more user-friendly for
              everyone.
            </p>

            <h3 className="font-playfair text-2xl text-white mt-10 mb-4">
              Known Limitations
            </h3>
            <p className="text-neutral-300 leading-relaxed mb-6">
              While we strive to adhere to the accepted guidelines and
              standards for accessibility and usability, it is not always
              possible to do so in all areas of the website. We are continually
              seeking out solutions that will bring all areas of the site up to
              the same level of overall web accessibility.
            </p>

            <h3 className="font-playfair text-2xl text-white mt-10 mb-4">
              Contact Us
            </h3>
            <p className="text-neutral-300 leading-relaxed mb-6">
              If you experience any difficulty in accessing any part of this
              website, or if you have suggestions on how we can improve
              accessibility, please contact Andrew directly:
            </p>

            <div className="bg-neutral-900 border border-white/5 p-8 mt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:andrew@iamandrewwhalen.com"
                    className="text-white hover:text-neutral-300 transition-colors"
                  >
                    andrew@iamandrewwhalen.com
                  </a>
                </div>
                <div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+13054559744"
                    className="text-white hover:text-neutral-300 transition-colors"
                  >
                    (305) 455-9744
                  </a>
                </div>
                <div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                    Response Time
                  </p>
                  <p className="text-neutral-300 text-sm">
                    We will respond to accessibility requests within 2 business
                    days.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <a
                href="/contact/"
                className="inline-block border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
              >
                Contact Andrew
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
