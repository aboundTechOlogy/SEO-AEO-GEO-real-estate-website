import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Andrew Whalen | South Florida Luxury Real Estate",
  description: "Privacy policy for iamandrewwhalen.com",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto prose prose-invert prose-neutral">
        <div className="gold-line mb-8" />
        <h1 className="font-playfair text-4xl mb-8">Privacy Policy</h1>
        <p className="text-neutral-400 text-sm mb-8">
          Last updated: February 17, 2026
        </p>

        <div className="space-y-8 text-neutral-300 leading-relaxed text-sm">
          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Information We Collect
            </h2>
            <p>
              When you visit iamandrewwhalen.com, we may collect certain
              information automatically, including your IP address, browser type,
              referring site, pages visited, and the date and time of your visit.
              If you contact us through forms on this site, we collect the
              information you provide, such as your name, email address, phone
              number, and message content.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 mt-2">
              <li>Respond to your inquiries about properties and services</li>
              <li>Provide you with real estate market information and updates</li>
              <li>Improve our website and the services we offer</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              We Do Not Sell Your Data
            </h2>
            <p>
              <strong className="text-white">
                We do not sell, trade, or otherwise transfer your personally
                identifiable information to outside parties.
              </strong>{" "}
              This does not include trusted third parties who assist us in
              operating our website or servicing you, so long as those parties
              agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              MLS Data Usage
            </h2>
            <p>
              Real estate listing data displayed on this website is provided
              through the participating associations of the Miami Association of
              Realtors and their Multiple Listing Service (MLS). This data is
              intended for consumers&apos; personal, non-commercial use and may
              not be used for any purpose other than to identify prospective
              properties consumers may be interested in purchasing. The data is
              deemed reliable but is not guaranteed accurate by the MLS.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Cookies and Tracking
            </h2>
            <p>
              We may use cookies and similar tracking technologies to enhance
              your experience on our website. You can choose to disable cookies
              through your browser settings, though this may affect certain
              features of the site.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Third-Party Services
            </h2>
            <p>
              We may use third-party services such as analytics providers and
              marketing platforms. These services may collect information about
              your use of our website in accordance with their own privacy
              policies.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Your Rights
            </h2>
            <p>
              You have the right to request access to, correction of, or
              deletion of your personal information. To exercise these rights,
              please contact us at andrew@iamandrewwhalen.com.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Contact Information
            </h2>
            <p>
              If you have questions about this privacy policy, please contact:
            </p>
            <div className="mt-2 text-neutral-400">
              <p>Andrew Whalen</p>
              <p>LoKation Real Estate</p>
              <p>1900 N Bayshore Dr, Suite 120</p>
              <p>Miami, FL 33132</p>
              <p>andrew@iamandrewwhalen.com</p>
              <p>(305) 420-6613</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
