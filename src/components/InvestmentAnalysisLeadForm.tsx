"use client";

import { FormEvent, useState } from "react";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const INVESTMENT_TYPES = [
  "Long-Term Rental",
  "Short-Term Rental",
  "Fix & Flip",
  "Buy & Hold",
  "New Construction",
];

const BUDGET_RANGES = ["$500K-$1M", "$1M-$2M", "$2M-$5M", "$5M-$10M", "$10M+"];

export default function InvestmentAnalysisLeadForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/investment-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">First Name *</span>
          <input
            name="firstName"
            required
            className="w-full bg-black/30 border border-white/15 px-4 py-3 text-white placeholder-neutral-500 focus:border-white/40 outline-none transition-colors"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Last Name *</span>
          <input
            name="lastName"
            required
            className="w-full bg-black/30 border border-white/15 px-4 py-3 text-white placeholder-neutral-500 focus:border-white/40 outline-none transition-colors"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Email *</span>
          <input
            name="email"
            type="email"
            required
            className="w-full bg-black/30 border border-white/15 px-4 py-3 text-white placeholder-neutral-500 focus:border-white/40 outline-none transition-colors"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Phone *</span>
          <input
            name="phone"
            type="tel"
            required
            className="w-full bg-black/30 border border-white/15 px-4 py-3 text-white placeholder-neutral-500 focus:border-white/40 outline-none transition-colors"
          />
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Property Address or Area of Interest *</span>
        <input
          name="targetProperty"
          required
          className="w-full bg-black/30 border border-white/15 px-4 py-3 text-white placeholder-neutral-500 focus:border-white/40 outline-none transition-colors"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Investment Type</span>
          <select
            name="investmentType"
            defaultValue=""
            className="w-full bg-black/30 border border-white/15 px-4 py-3 text-white focus:border-white/40 outline-none transition-colors"
          >
            <option value="" disabled>
              Select investment type
            </option>
            {INVESTMENT_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Budget Range</span>
          <select
            name="budgetRange"
            defaultValue=""
            className="w-full bg-black/30 border border-white/15 px-4 py-3 text-white focus:border-white/40 outline-none transition-colors"
          >
            <option value="" disabled>
              Select budget range
            </option>
            {BUDGET_RANGES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2 block">
        <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Additional Comments</span>
        <textarea
          name="comments"
          rows={4}
          className="w-full bg-black/30 border border-white/15 px-4 py-3 text-white placeholder-neutral-500 focus:border-white/40 outline-none transition-colors resize-y"
        />
      </label>

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white px-8 py-3.5 text-sm uppercase tracking-wider transition-colors"
        >
          {status === "submitting" ? "Submitting..." : "Request My Analysis"}
        </button>
      </div>

      {status === "success" && (
        <p className="text-sm text-emerald-300" role="status">
          Thank you. Your request has been received.
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-300" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
