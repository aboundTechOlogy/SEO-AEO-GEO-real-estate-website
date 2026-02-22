import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Andrew Whalen | South Florida Luxury Real Estate",
  description: "Terms of use for iamandrewwhalen.com",
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert prose-neutral">
        <h1 className="font-playfair text-4xl mb-8">Terms of Use</h1>
        <p className="text-neutral-400 text-sm mb-8">
          Last updated: February 17, 2026
        </p>

        <div className="space-y-8 text-neutral-300 leading-relaxed text-sm">
          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Acceptance of Terms
            </h2>
            <p>
              By accessing and using iamandrewwhalen.com (&quot;Site&quot;), you accept and agree to be
              bound by these Terms of Use. If you do not agree to these terms, please do not use
              this Site. We reserve the right to modify these terms at any time, and your continued
              use of the Site constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Real Estate Licensing
            </h2>
            <p>
              Andrew Whalen is a licensed real estate agent in the State of Florida, affiliated
              with LoKation Real Estate, located at 1900 N Bayshore Dr, Suite 120, Miami, FL 33132.
              All real estate services are provided through LoKation Real Estate.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              MLS Data &amp; Listing Information
            </h2>
            <p>
              The real estate listing data displayed on this Site is provided in part by the
              Miami Association of Realtors and the Southeast Florida MLS (SEFMLS) through
              the Bridge Interactive data platform. Use of this data is subject to the following:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-400 mt-3">
              <li>
                Listing information is provided for consumers&apos; personal, non-commercial use
                and may not be used for any purpose other than to identify prospective properties
                consumers may be interested in purchasing.
              </li>
              <li>
                All listing data is deemed reliable but is not guaranteed accurate by
                MIAMI REALTORS® or the MLS.
              </li>
              <li>
                Properties are subject to prior sale, change, withdrawal, or cancellation
                without notice.
              </li>
              <li>
                Listing information is updated periodically but may not reflect the most
                current status of a property.
              </li>
              <li>
                The compilation of listings and each individual listing are
                © 2023–{new Date().getFullYear()} Miami Association of Realtors®. All Rights Reserved.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              No Guarantees or Warranties
            </h2>
            <p>
              The information on this Site is provided &quot;as is&quot; without any representations
              or warranties, express or implied. Andrew Whalen and LoKation Real Estate make no
              representations or warranties regarding the accuracy, completeness, or reliability
              of any information on this Site, including but not limited to property details,
              pricing, availability, square footage, and neighborhood data.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Intellectual Property
            </h2>
            <p>
              All content on this Site — including text, images, graphics, logos, design elements,
              and software — is the property of Andrew Whalen or its respective content providers
              and is protected by United States and international copyright, trademark, and other
              intellectual property laws. You may not reproduce, distribute, modify, or create
              derivative works from any content on this Site without express written permission.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              User Conduct
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-neutral-400 mt-3">
              <li>
                Use this Site for any unlawful purpose or in violation of any applicable laws
              </li>
              <li>
                Scrape, harvest, or collect data from this Site through automated means
                (bots, crawlers, spiders) without express written permission
              </li>
              <li>
                Reproduce, redistribute, or commercially exploit MLS listing data obtained
                from this Site
              </li>
              <li>
                Attempt to interfere with the proper functioning of this Site
              </li>
              <li>
                Impersonate any person or entity, or misrepresent your affiliation with
                any person or entity
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Third-Party Links
            </h2>
            <p>
              This Site may contain links to third-party websites. These links are provided for
              your convenience only. We do not endorse or assume responsibility for the content,
              privacy policies, or practices of any third-party websites.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Andrew Whalen and LoKation Real Estate
              shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of this Site, including but not limited
              to reliance on any information provided on this Site.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Governing Law
            </h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance with the
              laws of the State of Florida, without regard to its conflict of law provisions.
              Any disputes arising under these terms shall be subject to the exclusive
              jurisdiction of the courts located in Miami-Dade County, Florida.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Contact Information
            </h2>
            <p>
              If you have questions about these Terms of Use, please contact:
            </p>
            <div className="mt-2 text-neutral-400">
              <p>Andrew Whalen</p>
              <p>LoKation Real Estate</p>
              <p>1900 N Bayshore Dr, Suite 120</p>
              <p>Miami, FL 33132</p>
              <p>andrew@iamandrewwhalen.com</p>
              <p>(305) 455-9744</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
