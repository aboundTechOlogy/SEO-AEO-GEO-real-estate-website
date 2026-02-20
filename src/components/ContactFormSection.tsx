"use client";
import { useState } from "react";
import SectionHeader from "@/components/SectionHeader";

export default function ContactFormSection() {
  const [goal, setGoal] = useState<string>("");
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
    <section className="bg-[#0a0a0a] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Form — left */}
          <div className="flex-1">
            <SectionHeader
              subtitle="Andrew Whalen"
              title="South Florida's Luxury Specialist"
              align="left"
              className="mb-4"
            />
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
                  <div>
                    <label className="sr-only">First Name</label>
                    <input
                      name="firstName"
                      placeholder="First Name *"
                      required
                      className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="sr-only">Last Name</label>
                    <input
                      name="lastName"
                      placeholder="Last Name *"
                      required
                      className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  required
                  className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors"
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 focus:border-white/60 px-0 py-3 text-white placeholder-neutral-500 text-sm outline-none transition-colors resize-none"
                />

                <div className="flex items-start gap-3 pt-2">
                  <input type="checkbox" name="consent" required id="consent" className="mt-1 accent-white" />
                  <label htmlFor="consent" className="text-neutral-500 text-xs leading-relaxed">
                    I agree to be contacted by Andrew Whalen via call, email, and text.{" "}
                    <a href="/privacy/" className="underline hover:text-neutral-300">Privacy Policy</a>{" "}
                    and{" "}
                    <a href="/terms/" className="underline hover:text-neutral-300">Terms of Service</a>.
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="border border-white/30 rounded-full px-10 py-3.5 text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    {status === "sending" ? "Sending..." : "Send Message"}
                  </button>
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </div>

          {/* Decorative right column — desktop only */}
          <div className="hidden lg:block lg:w-[45%] relative min-h-[500px] bg-neutral-900">
            {/* TODO: Replace with video background */}
            {/*
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="/contact-bg.mp4" type="video/mp4" />
            </video>
            */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
              <img src="/w-icon-logo.png" alt="" className="w-32 opacity-5 select-none pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
