"use client";

import { useState } from "react";

const GOALS = ["Buy", "Sell", "Sell & Buy", "Invest"] as const;

export default function ContactForm() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      goal: selectedGoal,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };
    console.log("Contact form submission:", data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-8 border border-white/10 bg-white/[0.02] rounded-sm text-center">
        <p className="font-playfair text-2xl mb-3">Thanks!</p>
        <p className="text-neutral-400">I&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Goal Selection */}
      <div>
        <label className="block text-sm text-neutral-500 uppercase tracking-wider mb-3">
          What&apos;s your goal?
        </label>
        <div className="flex flex-wrap gap-3">
          {GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => setSelectedGoal(selectedGoal === goal ? null : goal)}
              className={`px-5 py-2 text-sm uppercase tracking-wider border transition-all ${
                selectedGoal === goal
                  ? "border-amber-600 bg-amber-600/10 text-amber-500"
                  : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm text-neutral-500 uppercase tracking-wider mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm text-neutral-500 uppercase tracking-wider mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
          placeholder="your@email.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm text-neutral-500 uppercase tracking-wider mb-2">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
          placeholder="(305) 555-0000"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm text-neutral-500 uppercase tracking-wider mb-2">
          What can I help with?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
          placeholder="Tell me about your real estate goals..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-sm uppercase tracking-wider transition-colors"
      >
        Let&apos;s Talk
      </button>
    </form>
  );
}
