import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press & Media | Andrew Whalen | South Florida Luxury Real Estate",
  description:
    "Press coverage and media appearances featuring Andrew Whalen, South Florida's luxury real estate specialist.",
  openGraph: {
    title: "Press & Media | Andrew Whalen",
    description: "Press coverage featuring Andrew Whalen.",
    type: "website",
    url: "https://iamandrewwhalen.com/press",
  },
};

export default function PressPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <img src="/hero-miami.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/85" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <div>
            <p className="text-neutral-400 text-sm uppercase tracking-[0.3em] mb-4">Andrew Whalen</p>
            <h1 className="font-playfair text-5xl md:text-6xl font-light text-white">Press &amp; Media</h1>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="bg-[#0a0a0a] py-32 px-6 text-center">
        <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-6">Coming Soon</p>
        <h2 className="font-playfair text-3xl text-white mb-6">Press coverage is being compiled.</h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-10">
          For media inquiries, please contact Andrew directly.
        </p>
        <a
          href="/contact/"
          className="inline-block border border-white/30 rounded-full px-8 py-3 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all"
        >
          Media Inquiries
        </a>
      </section>
    </>
  );
}
