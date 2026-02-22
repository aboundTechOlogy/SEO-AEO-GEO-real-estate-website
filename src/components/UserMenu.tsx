"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import AuthModal from "@/components/AuthModal";

interface UserMenuProps {
  mobile?: boolean;
}

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase() || "U";
    }
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }

  if (email?.trim()) {
    return email.trim()[0]?.toUpperCase() || "U";
  }

  return "U";
}

export default function UserMenu({ mobile = false }: UserMenuProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = Boolean(user);
  const initials = useMemo(
    () => getInitials(user?.name, user?.email),
    [user?.email, user?.name]
  );

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  async function handleSignOut() {
    setMenuOpen(false);
    await signOut({ redirect: false });
    router.refresh();
  }

  const buttonBase = mobile
    ? "w-6 h-6 text-white"
    : "w-[30px] h-[30px] text-white hover:text-neutral-300 transition-colors";

  if (status === "loading") {
    return (
      <span className={`${mobile ? "w-6 h-6" : "w-[30px] h-[30px]"} rounded-full bg-white/20 animate-pulse`} />
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {!isAuthenticated ? (
        <>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={buttonBase}
            aria-label="Sign in"
          >
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10.5" />
              <path d="M17 19c0-2.2-2.2-3.5-5-3.5S7 16.8 7 19" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
          </button>

          <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`flex items-center justify-center rounded-full border border-white/40 bg-white/10 text-white font-semibold ${
              mobile ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm"
            }`}
            aria-label="Open user menu"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User avatar"}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-md border border-white/10 bg-neutral-900 shadow-xl p-1 z-[120] ${
                mobile ? "top-full" : "top-full"
              }`}
            >
              <a
                href="/account/"
                className="block px-3 py-2 text-sm text-neutral-200 hover:bg-white/10 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                My Account
              </a>
              <a
                href="/saved-listings/"
                className="block px-3 py-2 text-sm text-neutral-200 hover:bg-white/10 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Saved Listings
              </a>
              <a
                href="/saved-searches/"
                className="block px-3 py-2 text-sm text-neutral-200 hover:bg-white/10 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                Saved Searches
              </a>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-neutral-200 hover:bg-white/10 rounded-md"
              >
                Sign Out
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
