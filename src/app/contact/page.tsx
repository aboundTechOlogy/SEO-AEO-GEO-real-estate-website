"use client";
import { useState } from "react";
import { Metadata } from "next";

// Note: Metadata can't be exported from "use client" components.
// This page uses a client component for the goal selector.
// Metadata is handled in a separate layout or parent.

const SOCIAL = [
  { href: "https://www.instagram.com/iamandrewwhalen/", label: "Instagram" },
  { href: "https://www.facebook.com/ImAndrewWhalen", label: "Facebook" },
  { href: "https://www.linkedin.com/in/iamandrewwhalen/", label: "LinkedIn" },
  { href: "https://x.com/iamandrewwhalen", label: "X" },
];

export default function ContactPage() {
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, goal }),
      });
      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <img src="/hero-miami.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/85" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-16">
          <div>
            <p className="text-neutral-400 text-sm uppercase tracking-[0.3em] mb-4">Andrew Whalen</p>
            <h1 className="font-playfair text-5xl md:text-6xl font-light text-white">Contact Us</h1>
          </div>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="bg-[#0a0a0a] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Form — left */}
            <div className="flex-1">
              <p className="text-neutral-500 text-sm uppercase tracking-[0.2em] mb-2">Andrew Whalen</p>
              <h2 className="font-playfair text-4xl md:text-5xl uppercase tracking-wider text-white mb-4">
                South Florida&apos;s Luxury Specialist
              </h2>
              <p className="text-neutral-500 text-sm uppercase tracking-wider mb-10">
                Contact Trusted Professionals
              </p>

              {/* Goal selector */}
              <div className="flex gap-3 mb-8">
                {["Buy", "Sell", "Invest"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g === goal ? "" : g)}
                    className={`px-5 py-2 text-sm uppercase tracking-wider border transition-all ${
                      goal === g
                        ? "border-white bg-white text-black"
                        : "border-white/30 text-white hover:border-white/60"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {status === "sent" ? (
                <div className="py-12 text-center">
                  <p className="font-playfair text-2xl text-white mb-2">Thank you.</p>
                  <p className="text-neutral-400">We&apos;ll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input name="firstName" placeholder="First Name *" required
                      className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors" />
                    <input name="lastName" placeholder="Last Name *" required
                      className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors" />
                  </div>
                  <input name="email" type="email" placeholder="Email Address *" required
                    className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors" />
                  <input name="phone" type="tel" placeholder="Phone Number"
                    className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors" />
                  <textarea name="message" placeholder="Message" rows={4}
                    className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors resize-none" />

                  <div className="flex items-start gap-3 pt-2">
                    <input type="checkbox" name="consent" required id="consent-contact" className="mt-1 accent-white" />
                    <label htmlFor="consent-contact" className="text-neutral-500 text-xs leading-relaxed">
                      I agree to be contacted by Andrew Whalen via call, email, and text.{" "}
                      <a href="/privacy/" className="underline hover:text-neutral-300">Privacy Policy</a>{" "}
                      and{" "}
                      <a href="/terms/" className="underline hover:text-neutral-300">Terms of Service</a>.
                    </label>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={status === "sending"}
                      className="border border-white/30 rounded-full px-10 py-3.5 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all disabled:opacity-50">
                      {status === "sending" ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                  {status === "error" && (
                    <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </div>

            {/* Contact info — right */}
            <div className="lg:w-[40%] space-y-10">
              <div>
                <h3 className="text-white text-xs uppercase tracking-widest mb-4">Office</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  LoKation Real Estate<br />
                  1900 N Bayshore Dr, Suite 120<br />
                  Miami, FL 33132
                </p>
              </div>

              <div>
                <h3 className="text-white text-xs uppercase tracking-widest mb-4">Direct</h3>
                <p className="text-neutral-400 text-sm">
                  <a href="tel:+13054206613" className="hover:text-white transition-colors">
                    (305) 420-6613
                  </a>
                </p>
                <p className="text-neutral-400 text-sm mt-1">
                  <a href="mailto:andrew@iamandrewwhalen.com" className="hover:text-white transition-colors">
                    andrew@iamandrewwhalen.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-white text-xs uppercase tracking-widest mb-4">Connect</h3>
                <div className="flex gap-4">
                  {SOCIAL.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="text-neutral-500 text-xs uppercase tracking-wider hover:text-white transition-colors">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="aspect-video bg-neutral-900 border border-white/5 flex items-center justify-center">
                <p className="text-neutral-600 text-sm uppercase tracking-wider">Map coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Andrew Whalen",
            url: "https://iamandrewwhalen.com/contact",
          }),
        }}
      />
    </>
  );
}
