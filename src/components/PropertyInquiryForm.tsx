"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

interface PropertyInquiryFormProps {
  listingKey: string;
  address: string;
}

export default function PropertyInquiryForm({ listingKey, address }: PropertyInquiryFormProps) {
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          listingKey,
          listingAddress: address,
          source: "property-detail",
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input
          name="firstName"
          required
          placeholder="First Name *"
          className="w-full bg-black/20 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
        />
        <input
          name="lastName"
          required
          placeholder="Last Name *"
          className="w-full bg-black/20 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
        />
      </div>

      <input
        name="email"
        type="email"
        required
        placeholder="Email *"
        className="w-full bg-black/20 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
      />

      <input
        name="phone"
        type="tel"
        required
        placeholder="Phone *"
        className="w-full bg-black/20 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
      />

      <textarea
        name="message"
        rows={4}
        defaultValue={`I am interested in ${address}`}
        className="w-full bg-black/20 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 resize-y"
      />

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white py-3 text-xs uppercase tracking-[0.14em] transition-colors"
      >
        {state === "submitting" ? "Submitting..." : "Request Information"}
      </button>

      {state === "success" && <p className="text-xs text-emerald-300">Thanks. We will contact you shortly.</p>}
      {state === "error" && <p className="text-xs text-red-300">Something went wrong. Please try again.</p>}
    </form>
  );
}
