"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

interface PropertyInquiryFormProps {
  listingKey: string;
  address: string;
  theme?: "dark" | "light";
}

export default function PropertyInquiryForm({ listingKey, address, theme = "dark" }: PropertyInquiryFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [agreed, setAgreed] = useState(true);

  const inputClass =
    theme === "light"
      ? "w-full bg-white border border-gray-300 px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-500 focus:outline-none focus:border-gray-500"
      : "w-full bg-black/20 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40";

  const buttonClass =
    theme === "light"
      ? "w-full bg-[#1a1a1a] text-white py-3 text-sm font-medium hover:bg-black disabled:opacity-60 transition-colors"
      : "w-full rounded-full border border-white/30 text-white py-3 text-xs uppercase tracking-[0.14em] hover:bg-white/10 disabled:opacity-60 transition-colors";

  const successClass = theme === "light" ? "text-xs text-emerald-700" : "text-xs text-emerald-300";
  const errorClass = theme === "light" ? "text-xs text-red-700" : "text-xs text-red-300";
  const smallPrintClass = theme === "light" ? "text-[11px] leading-[1.4] text-gray-500" : "text-[11px] leading-[1.4] text-neutral-500";

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
      <input
        name="firstName"
        required
        placeholder="First Name*"
        className={inputClass}
      />

      <input
        name="lastName"
        required
        placeholder="Last Name*"
        className={inputClass}
      />

      <input
        name="email"
        type="email"
        required
        placeholder="Email*"
        className={inputClass}
      />

      <div className="flex">
        <div className={`flex items-center gap-1 px-3 border border-r-0 border-gray-300 ${theme === "light" ? "bg-white text-[#1a1a1a]" : "bg-black/20 text-white border-white/15"}`}>
          <span className="text-sm">🇺🇸</span>
          <svg className="w-3 h-3 opacity-50" viewBox="0 0 12 12" fill="currentColor"><path d="M3 5l3 3 3-3z" /></svg>
        </div>
        <input
          name="phone"
          type="tel"
          required
          placeholder="+1"
          className={inputClass}
        />
      </div>

      <textarea
        name="message"
        rows={3}
        defaultValue={`I am interested in ${address}`}
        className={`${inputClass} resize-y`}
      />

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 accent-gray-700"
        />
        <span className={smallPrintClass}>
          I agree to receive text messages from Andrew Whalen sent from{" "}
          <a href="tel:3054559744" className="underline">305-455-9744</a>.
          Message frequency varies for real estate services. Message and data rates may apply.
          Reply STOP at any time to end or unsubscribe. For assistance, reply HELP or contact
          support at:{" "}
          <a href="mailto:andrew@iamandrewwhalen.com" className="underline">andrew@iamandrewwhalen.com</a>.
        </span>
      </label>

      <button
        type="submit"
        disabled={state === "submitting" || !agreed}
        className={buttonClass}
      >
        {state === "submitting" ? "Submitting..." : "Request Information"}
      </button>

      {state === "success" && <p className={successClass}>Thanks. We will contact you shortly.</p>}
      {state === "error" && <p className={errorClass}>Something went wrong. Please try again.</p>}
    </form>
  );
}
