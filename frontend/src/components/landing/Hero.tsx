"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Linear Ambient Violet Backlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(94,106,210,0.18),rgba(8,9,10,0)_75%)] pointer-events-none -z-10" />

      {/* Subtle Grid Backdrop */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 radial-mask pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Linear Capsule Announcement Pill */}
        <Link
          href="#scenario"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 text-xs text-[#8a8f98] hover:text-[#f7f8f8] transition-all duration-200 mb-8 group shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
          <span className="text-[#5e6ad2] font-medium font-mono text-[11px] px-1.5 py-0.2 rounded bg-[#5e6ad2]/15">
            2026.11
          </span>
          <span className="text-[#d0d3d8]">Introducing Cross-Incident Entity Correlation</span>
          <ChevronRight className="w-3 h-3 text-[#8a8f98] transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Hero Display Headline (Linear Exact Sizing & Gradient) */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-[-0.035em] text-[#f7f8f8] leading-[1.02] max-w-4xl text-balance">
          <span className="linear-hero-text">SENTINEL is a better way</span>
          <br />
          <span className="bg-gradient-to-r from-[#f7f8f8] via-[#e2e4e9] to-[#8a8f98] bg-clip-text text-transparent">
            to defend the money.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-7 text-lg sm:text-xl text-[#8a8f98] max-w-2xl leading-relaxed text-balance font-normal">
          Meet the new standard for modern fraud protection. Streamline unstructured evidence analysis, uncover hidden entity networks, and intercept unauthorized supplier payment requests before funds move.
        </p>

        {/* Button Group (Linear Button Styles) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#f7f8f8] text-[#08090a] hover:bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <span>Start investigating</span>
            <ArrowRight className="w-4 h-4 text-[#08090a]" />
          </Link>

          <Link
            href="#scenario"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-white/10 bg-white/[0.03] text-[#d0d3d8] hover:text-[#f7f8f8] hover:bg-white/[0.06] hover:border-white/20 transition-all"
          >
            <span>Introducing FinGuard 2.0</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8a8f98]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
