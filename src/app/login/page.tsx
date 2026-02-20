"use client";

import { Metadata } from "next";
import { FormEvent } from "react";

function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  console.log("Login form submitted — auth not yet implemented");
}

export default function LoginPage() {
  return (
    <>
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="font-playfair text-4xl mb-4">Sign In</h1>
          <p className="text-neutral-400 mb-10">
            Account features coming soon — save searches, favorite listings, and
            get email alerts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider text-neutral-500 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-neutral-600 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-wider text-neutral-500 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-neutral-600 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white transition-colors rounded-sm tracking-wider uppercase text-sm"
            >
              Sign In
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
