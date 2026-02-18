import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import NavDropdown from "@/components/NavDropdown";
import MobileMenu from "@/components/MobileMenu";
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

const CONDO_NEIGHBORHOODS = [
  { label: "Brickell", href: "/luxury-condos/brickell/" },
  { label: "Miami Beach", href: "/luxury-condos/miami-beach/" },
  { label: "Coconut Grove", href: "/luxury-condos/coconut-grove/" },
  { label: "Coral Gables", href: "/luxury-condos/coral-gables/" },
  { label: "Sunny Isles", href: "/luxury-condos/sunny-isles/" },
  { label: "Edgewater", href: "/luxury-condos/edgewater/" },
];

const NEIGHBORHOOD_GUIDES = [
  { label: "Brickell", href: "/neighborhoods/brickell/" },
  { label: "Miami Beach", href: "/neighborhoods/miami-beach/" },
  { label: "Coconut Grove", href: "/neighborhoods/coconut-grove/" },
  { label: "Coral Gables", href: "/neighborhoods/coral-gables/" },
  { label: "Key Biscayne", href: "/neighborhoods/key-biscayne/" },
  { label: "Downtown Miami", href: "/neighborhoods/downtown-miami/" },
  { label: "Edgewater", href: "/neighborhoods/edgewater/" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-neutral-950 text-white antialiased font-sans">
        <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Left: Logo */}
            <a href="/" className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-light tracking-[0.35em] uppercase" style={{ fontFamily: 'var(--font-inter)' }}>
                AW
              </span>
              <span className="w-px h-5 bg-white/20" />
              <span className="text-sm font-light tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-inter)' }}>
                Andrew Whalen
              </span>
            </a>

            {/* Center: Nav Links */}
            <div className="hidden md:flex items-center gap-7 text-sm tracking-wider uppercase">
              <NavDropdown
                label="Luxury Condos"
                items={CONDO_NEIGHBORHOODS}
                allLabel="All Buildings"
                allHref="/luxury-condos/"
              />
              <NavDropdown
                label="Neighborhoods"
                items={NEIGHBORHOOD_GUIDES}
                allLabel="All Neighborhoods"
                allHref="/neighborhoods/"
              />
              <a href="/new-construction/" className="text-neutral-400 hover:text-white transition-colors">
                New Construction
              </a>
              <a href="/about/" className="text-neutral-400 hover:text-white transition-colors">
                About
              </a>
              <a href="/contact/" className="text-neutral-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>

            {/* Right: Search + LoKation + Mobile */}
            <div className="flex items-center gap-4 shrink-0">
              <a href="/search/" className="hidden md:block text-neutral-400 hover:text-white transition-colors" aria-label="Search">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </a>
              <span className="hidden md:block w-px h-5 bg-white/10" />
              <img
                src="/lokation-logo-white.png"
                alt="LoKation Real Estate"
                className="hidden md:block h-5 w-auto opacity-60"
              />
              <MobileMenu />
            </div>
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-neutral-900 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-16">
            {/* 4-Column Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4">Explore</h3>
                <ul className="text-sm text-neutral-400 space-y-2">
                  <li><a href="/luxury-condos/" className="hover:text-white transition-colors">Luxury Condos</a></li>
                  <li><a href="/new-construction/" className="hover:text-white transition-colors">New Construction</a></li>
                  <li><a href="/search/" className="hover:text-white transition-colors">Search Properties</a></li>
                  <li><a href="/blog/" className="hover:text-white transition-colors">Market Insights</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4">Neighborhoods</h3>
                <ul className="text-sm text-neutral-400 space-y-2">
                  <li><a href="/neighborhoods/brickell/" className="hover:text-white transition-colors">Brickell</a></li>
                  <li><a href="/neighborhoods/miami-beach/" className="hover:text-white transition-colors">Miami Beach</a></li>
                  <li><a href="/neighborhoods/coconut-grove/" className="hover:text-white transition-colors">Coconut Grove</a></li>
                  <li><a href="/neighborhoods/coral-gables/" className="hover:text-white transition-colors">Coral Gables</a></li>
                  <li><a href="/neighborhoods/key-biscayne/" className="hover:text-white transition-colors">Key Biscayne</a></li>
                  <li><a href="/neighborhoods/downtown-miami/" className="hover:text-white transition-colors">Downtown Miami</a></li>
                  <li><a href="/neighborhoods/edgewater/" className="hover:text-white transition-colors">Edgewater</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4">Company</h3>
                <ul className="text-sm text-neutral-400 space-y-2">
                  <li><a href="/about/" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="/contact/" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="/blog/" className="hover:text-white transition-colors">Insights</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-4">Legal</h3>
                <ul className="text-sm text-neutral-400 space-y-2">
                  <li><a href="/privacy/" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms/" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="/dmca/" className="hover:text-white transition-colors">DMCA</a></li>
                </ul>
              </div>
            </div>

            {/* MLS Compliance Footer — Required for Bridge API / Miami MLS Approval */}
            <div className="border-t border-white/5 pt-8 text-xs text-neutral-500 space-y-3">
              {/* NAPW — Broker Name, Address, Phone */}
              <div className="flex items-start gap-4">
                <img
                  src="/lokation-logo-white.png"
                  alt="LoKation Real Estate"
                  className="h-8 w-auto opacity-80"
                />
                <div>
                  <p>1900 N Bayshore Dr, Suite 120, Miami, FL 33132</p>
                  <p>Phone: (305) 420-6613</p>
                </div>
              </div>

              {/* SEFMLS Copyright — Exact language required by Schedule A §10 and Schedule C §3 */}
              <p>
                Copyright Southeast Florida MLS a/k/a SEFMLS ©{" "}
                {new Date().getFullYear()}. Accuracy of listing information is
                not guaranteed. Listing information is provided for personal
                consumer, non-commercial use, solely to identify potential
                properties for potential purchase. All other use is strictly
                prohibited and may be a violation of federal and state law.
              </p>

              {/* MLS Disclaimer — Required by IDX agreement */}
              <p>
                The data relating to real estate for sale on this website comes
                in part from the participating associations of the Miami
                Association of Realtors and their multiple listing service. The
                information being provided is for consumers&apos; personal,
                non-commercial use and may not be used for any purpose other
                than to identify prospective properties consumers may be
                interested in purchasing. Powered by Bridge Interactive.
              </p>

              {/* Data Reliability Notice — Schedule C §2 */}
              <p>
                MLS data is deemed reliable but is not guaranteed accurate by
                MIAMI REALTORS®.
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
                  href="/dmca"
                  className="hover:text-neutral-300 transition-colors"
                >
                  DMCA
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
