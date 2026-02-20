import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Policy | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Digital Millennium Copyright Act (DMCA) policy and takedown procedures for iamandrewwhalen.com",
};

export default function DMCAPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-playfair text-4xl mb-8">DMCA Policy</h1>
        <p className="text-neutral-400 text-sm mb-8">
          Last updated: February 17, 2026
        </p>

        <div className="space-y-8 text-neutral-300 leading-relaxed text-sm">
          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Copyright Compliance
            </h2>
            <p>
              iamandrewwhalen.com respects the intellectual property rights of
              others and complies with the Digital Millennium Copyright Act
              (DMCA). We respond to clear notices of alleged copyright
              infringement in accordance with the DMCA and other applicable
              intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Reporting Copyright Infringement
            </h2>
            <p className="mb-3">
              If you believe that content on this website infringes your
              copyright, please submit a written notification containing the
              following information:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-neutral-400">
              <li>
                A physical or electronic signature of the copyright owner or a
                person authorized to act on their behalf
              </li>
              <li>
                Identification of the copyrighted work claimed to have been
                infringed
              </li>
              <li>
                Identification of the material that is claimed to be infringing,
                including the URL or other specific location on the website
              </li>
              <li>
                Your contact information, including name, address, telephone
                number, and email address
              </li>
              <li>
                A statement that you have a good faith belief that the use of
                the material is not authorized by the copyright owner, its
                agent, or the law
              </li>
              <li>
                A statement, made under penalty of perjury, that the
                information in the notification is accurate, and that you are
                the copyright owner or are authorized to act on behalf of the
                copyright owner
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Designated Agent
            </h2>
            <p className="mb-3">
              DMCA takedown notices should be sent to our designated agent:
            </p>
            <div className="bg-white/[0.03] border border-white/5 rounded-sm p-4 text-neutral-400">
              <p className="font-semibold text-neutral-300">Andrew Whalen</p>
              <p>LoKation Real Estate</p>
              <p>1900 N Bayshore Dr, Suite 120</p>
              <p>Miami, FL 33132</p>
              <p>Email: andrew@iamandrewwhalen.com</p>
              <p>Phone: (305) 420-6613</p>
            </div>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Takedown Procedure
            </h2>
            <p>
              Upon receipt of a valid DMCA takedown notice, we will promptly
              remove or disable access to the allegedly infringing material. We
              will also notify the MIAMI Association of REALTORS® in writing
              within twenty-four (24) hours of receipt by forwarding a complete
              copy of the takedown request to the appropriate parties, as
              required by our MLS data license agreement.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Counter-Notification
            </h2>
            <p>
              If you believe that material you posted was removed or disabled by
              mistake or misidentification, you may file a counter-notification
              with our designated agent containing the following:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-neutral-400 mt-3">
              <li>Your physical or electronic signature</li>
              <li>
                Identification of the material that has been removed or
                disabled, and the location at which it appeared before removal
              </li>
              <li>
                A statement under penalty of perjury that you have a good faith
                belief that the material was removed or disabled as a result of
                mistake or misidentification
              </li>
              <li>
                Your name, address, and telephone number, and a statement that
                you consent to the jurisdiction of the federal court in your
                district (or Miami-Dade County, Florida, if you are outside the
                United States)
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              Repeat Infringers
            </h2>
            <p>
              In accordance with the DMCA, we will terminate, in appropriate
              circumstances, the accounts or access of users who are repeat
              infringers.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-white mb-3">
              MLS Data Copyright
            </h2>
            <p>
              Copyright Southeast Florida MLS a/k/a SEFMLS ©{" "}
              {new Date().getFullYear()}. Real estate listing data displayed on
              this website is the copyrighted property of the Southeast Florida
              Multiple Listing Service and the Miami Association of REALTORS®.
              All rights reserved.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
