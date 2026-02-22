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
    description:
      "We will notify you when a new listing that matches your search criteria hits the market.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    title: "Save your favorite listings",
    description: "Save unlimited listings on our site for easy access when you return.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m12 21-1.35-1.24C5.4 14.86 2 11.8 2 8a4 4 0 0 1 7-2.65A4 4 0 0 1 16 8c0 3.8-3.4 6.86-8.65 11.76L6 21h6Z" />
      </svg>
    ),
  },
  {
    title: "Share properties with friends",
    description: "Easily share your favorite properties with your friends and family via email.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12a3.5 3.5 0 1 0-3.3 2.5M15.5 7a3.5 3.5 0 1 0 0 0m0 10a3.5 3.5 0 1 0 0 0M8.2 10.8l7-3.7m-7 6 7 3.8" />
      </svg>
    ),
  },
  {
    title: "View property history",
    description: "View property history and keep track of listings you have recently viewed.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 1 1-2.6-6.4M21 4v5h-5" />
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

  const title = useMemo(() => (mode === "login" ? "Welcome Back" : "Register for a personalized experience"), [mode]);

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

  const inputClass =
    "w-full h-[55px] rounded-[4px] border border-neutral-200 bg-white px-4 text-[16px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none";

  return createPortal(
    <div
      className="fixed inset-0 z-[300] bg-black/82 backdrop-blur-[2px] overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Authentication modal"
    >
      <div className="min-h-screen w-full flex items-start md:items-center justify-center">
        <div className="relative w-full md:max-w-[810px]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-30 w-11 h-11 rounded-full border border-white/30 md:border-neutral-300 bg-transparent md:bg-white text-white md:text-neutral-700 hover:bg-white/10 md:hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col-reverse md:flex-row md:border md:border-black/15 md:bg-white">
            <aside className="w-full md:w-[410px] px-4 pb-10 pt-8 md:px-8 md:py-8 text-white md:text-neutral-900 md:bg-[#f4f5f9] md:border-r md:border-black/10 border-t border-dashed border-white/25 md:border-t-0">
              <h2 className="text-[22px] md:text-[18px] leading-tight font-semibold mb-5">Why Create An Account?</h2>

              <ul className="space-y-5">
                {BENEFITS.map((item) => (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <span className="w-11 h-11 rounded-full bg-white/90 md:bg-[#d9dfed] text-neutral-900 flex items-center justify-center shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-[16px] leading-tight font-semibold">{item.title}</p>
                      <p className="text-[14px] leading-relaxed mt-1 text-white/90 md:text-neutral-700">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="w-full md:w-[400px] px-4 pt-16 pb-8 md:px-8 md:py-8 text-white md:text-neutral-900">
              <h3 className="text-[20px] leading-none font-semibold mb-2">{title}</h3>

              {mode === "login" ? (
                <p className="text-[14px] text-white/90 md:text-neutral-700 mb-5">
                  Not registered yet?{" "}
                  <button
                    type="button"
                    className="font-semibold text-[#80a5ff] hover:underline"
                    onClick={() => setMode("register")}
                  >
                    Register now
                  </button>
                </p>
              ) : (
                <p className="text-[14px] text-white/90 md:text-neutral-700 mb-5">
                  Already registered?{" "}
                  <button
                    type="button"
                    className="font-semibold text-[#80a5ff] hover:underline"
                    onClick={() => setMode("login")}
                  >
                    Log in
                  </button>
                </p>
              )}

              <form onSubmit={mode === "login" ? handleLoginSubmit : handleRegisterSubmit} className="space-y-2.5">
                {mode === "register" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="First Name"
                      className={inputClass}
                      required
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder="Last Name"
                      className={inputClass}
                      required
                    />
                  </div>
                )}

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter email"
                  className={inputClass}
                  required
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  className={inputClass}
                  required
                  minLength={6}
                />

                {error && <p className="text-sm text-red-300 md:text-red-600 pt-1">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[55px] rounded-[4px] bg-[#cd1414] text-white text-[14px] leading-none font-semibold hover:bg-[#ec2424] transition-colors disabled:opacity-60"
                >
                  {loading ? "Please wait..." : mode === "login" ? "Continue with email" : "Create account"}
                </button>
              </form>

              <div className="relative my-4 text-center">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-white/35 md:border-neutral-300" />
                <span className="relative inline-flex w-8 h-8 items-center justify-center rounded-full bg-neutral-500 text-white text-sm">
                  or
                </span>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full h-[55px] rounded-[4px] bg-[#3C5A99] border border-[#3C5A99] text-white text-[14px] leading-none font-semibold hover:bg-[#2e487f] transition-colors"
                >
                  Login with Facebook
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-[55px] rounded-[4px] bg-white border border-neutral-300 text-neutral-700 text-[14px] leading-none font-semibold hover:bg-neutral-100 transition-colors"
                >
                  Login with Google
                </button>
              </div>

              <p className="text-center mt-3 text-[14px] text-white md:text-neutral-700">
                Forgot your password?{" "}
                <button
                  type="button"
                  onClick={() => setError("Password reset is not configured yet.")}
                  className="font-semibold text-[#80a5ff] hover:underline"
                >
                  Reset now
                </button>
              </p>

              <div className="mt-7 text-center text-[13px] text-white/90 md:text-neutral-600 leading-relaxed">
                <p>
                  In agreement with our{" "}
                  <a href="/terms-and-conditions/" target="_blank" rel="noreferrer" className="underline hover:no-underline">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="/terms-and-conditions/#atospp-privacy"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:no-underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
