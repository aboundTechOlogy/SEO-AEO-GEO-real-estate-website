import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import NavDropdown from "@/components/NavDropdown";
import MobileMenu from "@/components/MobileMenu";
import MegaMenu from "@/components/MegaMenu";
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
  { label: "New Construction", href: "/new-construction/", dividerBefore: true },
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
        <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-sm">
          <nav className="w-full px-10 py-4 flex items-center">
            {/* Left: Primary Nav Links */}
            <div className="hidden lg:flex items-center gap-10 shrink-0">
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
            </div>

            {/* Logo Lockup — centered on desktop, left-aligned on mobile */}
            <div className="flex-1 lg:flex lg:justify-center">
              <a href="/" className="flex items-center gap-2 md:gap-3 shrink-0">
                <img
                  src="/w-icon-logo.png"
                  alt="W"
                  className="h-7 md:h-8 w-auto"
                />
                <img
                  src="/aw-name-logo.png"
                  alt="Andrew Whalen"
                  className="h-3 md:h-3.5 w-auto"
                />
                <span className="w-px h-5 md:h-6 bg-white/30 mx-1 md:mx-2" />
                <img
                  src="/lokation-logo.png"
                  alt="LoKation"
                  className="hidden sm:block h-2 md:h-2.5 w-auto brightness-0 invert opacity-80"
                />
              </a>
            </div>

            {/* Right: Secondary Nav + Actions */}
            <div className="hidden lg:flex items-center gap-7 shrink-0">
              <a href="/about/" className="text-[13px] uppercase tracking-[0.12em] text-white hover:text-neutral-300 transition-colors whitespace-nowrap">
                About Us
              </a>
              <a href="/blog/" className="text-[13px] uppercase tracking-[0.12em] text-white hover:text-neutral-300 transition-colors">
                Insights
              </a>
              <a
                href="/contact/"
                className="border border-white/50 rounded-full px-6 py-2 text-[13px] uppercase tracking-[0.12em] text-white hover:bg-white/10 transition-all whitespace-nowrap"
              >
                Contact Us
              </a>
              {/* Login icon — circle outline around person, matching Carroll */}
              <a href="/login/" className="text-white hover:text-neutral-300 transition-colors" aria-label="Sign in">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                  <circle cx="12" cy="12" r="10.5" />
                  <path d="M17 19c0-2.2-2.2-3.5-5-3.5S7 16.8 7 19" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
              </a>
              {/* Hamburger — visible on desktop, opens mega menu slide-out */}
              <MegaMenu />
            </div>

            {/* Mobile nav: logo left, login + hamburger right */}
            <div className="flex lg:hidden items-center gap-4 ml-auto">
              <a href="/login/" className="text-white" aria-label="Sign in">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                  <circle cx="12" cy="12" r="10.5" />
                  <path d="M17 19c0-2.2-2.2-3.5-5-3.5S7 16.8 7 19" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
              </a>
              <MobileMenu />
            </div>
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-neutral-900 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Footer Header */}
            <div className="mb-12">
              <h2 className="font-playfair text-2xl mb-2">Andrew Whalen</h2>
              <p className="text-sm text-neutral-500">South Florida Luxury Real Estate</p>
              <div className="flex gap-5 mt-4">
                {/* Instagram */}
                <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="TikTok">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52V6.69h-1z"/>
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="X">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

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
                  <li><a href="/login/" className="hover:text-white transition-colors">Sign In</a></li>
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
