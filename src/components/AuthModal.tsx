"use client";

import type { FormEvent, MouseEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type AuthMode = "login" | "register";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

interface BenefitItem {
  title: string;
  description: string;
  icon: ReactNode;
}

const BENEFITS: BenefitItem[] = [
  {
    title: "Get new alerts",
    description: "We'll notify you when a listing matches your search criteria.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75v-.7V9a6 6 0 1 0-12 0v.05.7a8.967 8.967 0 0 1-2.312 6.022 23.848 23.848 0 0 0 5.454 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
  },
  {
    title: "Save favorite listings",
    description: "Save listings for easy access when you return.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Share properties with friends",
    description: "Share your favorites with family via email.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186L15.783 6.25m-8.566 7.5 8.566 4.657m0 0a2.25 2.25 0 1 0 1.934-3.861 2.25 2.25 0 0 0-1.934 3.86zm0-12.158a2.25 2.25 0 1 0 1.934-3.861 2.25 2.25 0 0 0-1.934 3.86z" />
      </svg>
    ),
  },
  {
    title: "View property history",
    description: "Keep track of listings you've recently viewed.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m5-2a9 9 0 1 1-3.133-6.838M15 3h6v6" />
      </svg>
    ),
  },
];

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");
  }, [mode, open]);

  const title = useMemo(() => (mode === "login" ? "Sign In" : "Create Account"), [mode]);

  if (!mounted || !open) {
    return null;
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      onClose();
      router.refresh();
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (!name) {
        setError("Please enter your name.");
        return;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(payload.error || "Unable to create your account.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        setError("Account created, but automatic sign-in failed. Please sign in manually.");
        setMode("login");
        return;
      }

      onClose();
      router.refresh();
    } catch {
      setError("Unable to create your account right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    try {
      await signIn("google");
    } catch {
      setError("Google sign-in is unavailable right now.");
      setLoading(false);
    }
  }

  function handleFacebookLogin() {
    setError("Facebook login will be enabled after app setup.");
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Authentication modal"
    >
      <div className="relative w-full max-w-[860px] bg-white rounded-xl shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 text-neutral-400 hover:text-neutral-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-[1fr_1.1fr]">
          <aside className="hidden md:block bg-neutral-50 border-r border-neutral-200 px-8 py-10">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Why Create An Account?</h2>
            <p className="text-sm text-neutral-600 mb-8">
              Save time and stay ahead of the market with your personalized account.
            </p>

            <ul className="space-y-6">
              {BENEFITS.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full bg-white border border-neutral-200 text-neutral-700 flex items-center justify-center mt-0.5">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                    <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          <section className="px-6 py-8 md:px-8 md:py-10">
            <h3 className="text-2xl font-semibold text-neutral-900 mb-1">{title}</h3>
            <p className="text-sm text-neutral-600 mb-6">
              {mode === "login"
                ? "Access saved listings and saved searches."
                : "Create your account to save listings and searches."}
            </p>

            <form
              onSubmit={mode === "login" ? handleLoginSubmit : handleRegisterSubmit}
              className="space-y-3"
            >
              {mode === "register" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="First name"
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                    required
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Last name"
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                    required
                  />
                </div>
              )}

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                required
              />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                required
                minLength={6}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#1a1a1a] text-white text-sm font-medium py-2.5 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Please wait..." : mode === "login" ? "Continue with email" : "Create Account"}
              </button>
            </form>

            <div className="relative my-5">
              <div className="border-t border-neutral-200" />
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs uppercase tracking-wide text-neutral-500">
                or
              </span>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                <span className="font-semibold text-[#DB4437]">G</span>
                Login with Google
              </button>

              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full rounded-md bg-[#1877F2] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#1466d1] transition-colors flex items-center justify-center gap-2"
              >
                <span className="font-semibold">f</span>
                Login with Facebook
              </button>
            </div>

            <div className="mt-5 text-sm text-neutral-600">
              <button
                type="button"
                onClick={() => setError("Password reset is not configured yet.")}
                className="text-[#1a1a1a] hover:text-black underline underline-offset-2"
              >
                Forgot password? Reset now
              </button>
            </div>

            <div className="mt-3 text-sm text-neutral-600">
              {mode === "login" ? (
                <p>
                  Not registered yet?{" "}
                  <button
                    type="button"
                    className="text-[#1a1a1a] hover:text-black underline underline-offset-2"
                    onClick={() => setMode("register")}
                  >
                    Register now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-[#1a1a1a] hover:text-black underline underline-offset-2"
                    onClick={() => setMode("login")}
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
