import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Luxury real estate specialist serving Downtown Miami, Coconut Grove, Brickell, Miami Beach, Coral Gables, and South Florida's most prestigious neighborhoods.",
  openGraph: {
    title: "Andrew Whalen | South Florida Luxury Real Estate",
    description:
      "Your insider guide to Miami's luxury lifestyle and real estate.",
    type: "website",
    locale: "en_US",
    url: "https://iamandrewwhalen.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-neutral-950 text-white antialiased font-sans">
        <header className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-playfair text-xl tracking-wide">
              ANDREW WHALEN
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm tracking-wider uppercase text-neutral-400">
              <a href="/#neighborhoods" className="hover:text-white transition-colors">
                Neighborhoods
              </a>
              <a href="/#developments" className="hover:text-white transition-colors">
                New Developments
              </a>
              <a href="/#market" className="hover:text-white transition-colors">
                Market Insights
              </a>
              <a href="/#about" className="hover:text-white transition-colors">
                About
              </a>
              <a
                href="/#contact"
                className="px-5 py-2 bg-amber-600 text-white hover:bg-amber-500 transition-colors rounded-sm"
              >
                Contact
              </a>
            </div>
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-neutral-900 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-playfair text-lg mb-3">Andrew Whalen</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  South Florida luxury real estate specialist. Your insider to
                  Miami&apos;s most prestigious neighborhoods and lifestyle.
                </p>
              </div>
              <div>
                <h3 className="font-playfair text-lg mb-3">Neighborhoods</h3>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>Downtown Miami</li>
                  <li>Coconut Grove</li>
                  <li>Brickell</li>
                  <li>Miami Beach</li>
                  <li>Coral Gables</li>
                  <li>Key Biscayne</li>
                </ul>
              </div>
              <div>
                <h3 className="font-playfair text-lg mb-3">Contact</h3>
                <p className="text-sm text-neutral-400">
                  andrew@iamandrewwhalen.com
                </p>
              </div>
            </div>

            {/* MLS Compliance Footer — Required for Bridge API Approval */}
            <div className="border-t border-white/5 pt-8 text-xs text-neutral-500 space-y-3">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-semibold text-neutral-400">
                    LoKation Real Estate
                  </p>
                  <p>1900 N Bayshore Dr, Suite 120, Miami, FL 33132</p>
                  <p>Phone: (305) 420-6613</p>
                </div>
              </div>
              <p>
                The data relating to real estate for sale on this website comes
                in part from the participating associations of the Miami
                Association of Realtors and their multiple listing service. The
                information being provided is for consumers&apos; personal,
                non-commercial use and may not be used for any purpose other
                than to identify prospective properties consumers may be
                interested in purchasing. Powered by Bridge Interactive.
              </p>
              <p>
                © {new Date().getFullYear()} Andrew Whalen | LoKation Real
                Estate. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a
                  href="/privacy"
                  className="hover:text-neutral-300 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="hover:text-neutral-300 transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
