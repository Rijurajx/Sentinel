"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SentinelLogo } from "@/components/ui/SentinelLogo";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 linear-glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/">
          <SentinelLogo withWordmark className="w-5 h-5 text-white" />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-[#8a8f98]">
          <Link
            href="#features"
            className="hover:text-[#f7f8f8] transition-colors"
          >
            Features
          </Link>
          <Link
            href="#scamshield"
            className="hover:text-[#f7f8f8] transition-colors"
          >
            ScamShield
          </Link>
          <Link
            href="#trustgraph"
            className="hover:text-[#f7f8f8] transition-colors"
          >
            TrustGraph
          </Link>
          <Link
            href="#finguard"
            className="hover:text-[#f7f8f8] transition-colors"
          >
            FinGuard
          </Link>
          <Link
            href="#scenario"
            className="hover:text-[#f7f8f8] transition-colors"
          >
            Incident 8842
          </Link>
          <Link
            href="#security"
            className="hover:text-[#f7f8f8] transition-colors"
          >
            Security
          </Link>
        </nav>

        {/* Right Actions (Linear-Style Pill) */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-block text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#f7f8f8] text-[#08090a] hover:bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Sign up</span>
            <ChevronRight className="w-3 h-3 text-[#08090a]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
