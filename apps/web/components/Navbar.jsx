"use client";

import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="relative z-20 flex items-center justify-between px-6 md:px-10 py-6">
      <Link href="/" className="flex items-center gap-2.5">
        <Logo size={30} />
        <span className="font-display text-lg font-medium tracking-tight">SwiftPay</span>
      </Link>

      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm text-muted hover:text-white transition-colors px-3 py-2"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors px-3 py-2"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className="text-sm text-muted hover:text-white transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 text-sm font-medium bg-white text-ink rounded-full px-4 py-2 hover:bg-flow-soft transition-colors"
            >
              Get started
              <ArrowUpRight size={15} />
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
