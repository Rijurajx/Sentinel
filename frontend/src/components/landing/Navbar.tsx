"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SentinelLogo } from "@/components/ui/SentinelLogo";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/[0.06] bg-[#08090a]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2">
          <SentinelLogo withWordmark className="w-4 h-4 text-white" />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#8a8f98]">
          <Link
            href="#interactive-demo"
            className="hover:text-white transition-colors"
          >
            Interactive Demo
          </Link>
          <Link
            href="#features"
            className="hover:text-white transition-colors"
          >
            Architecture
          </Link>
          <Link
            href="#scenario"
            className="hover:text-white transition-colors"
          >
            Interception Lifecycle
          </Link>
          <Link
            href="#security"
            className="hover:text-white transition-colors"
          >
            Rigor & Specs
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-block text-xs text-[#8a8f98] hover:text-white transition-colors font-medium"
          >
            Log in
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#f7f8f8] text-[#08090a] hover:bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.7)] transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Open Dashboard</span>
            <ChevronRight className="w-3 h-3 text-[#08090a]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
