"use client";

import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-14 sm:pt-40 sm:pb-20 overflow-hidden">
      {/* Linear Ambient Indigo Backlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(94,106,210,0.14),rgba(8,9,10,0)_70%)] pointer-events-none -z-10" />

      {/* Hairline Grid Mask */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 radial-mask pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Hero Display Headline (Linear Exact Sizing & Balanced Tracking) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em] text-[#f7f8f8] leading-[1.05] max-w-4xl text-balance">
          Purpose-built financial threat intelligence & protection.
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-[#8a8f98] max-w-2xl leading-relaxed text-balance font-normal">
          Intercept unauthorized supplier bank reroutes, BEC wire diversions, and fraudulent invoice dockets before capital moves. Powered by deterministic ledger verification and multimodal AI forensics.
        </p>

        {/* Action Controls */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-[#f7f8f8] text-[#08090a] hover:bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Open Sentinel Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#08090a]" />
          </Link>

          <a
            href="#interactive-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium border border-white/10 bg-white/[0.02] text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.05] hover:border-white/20 transition-all font-mono"
          >
            <Terminal className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span>Explore Interactive Demo ↓</span>
          </a>
        </div>

        {/* Sub-hero Keyboard Hint */}
        <div className="mt-8 flex items-center gap-2 text-[11px] font-mono text-[#62666d]">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded border border-white/[0.12] bg-white/[0.03] text-[#8a8f98] text-[10px]">
            ⌘K
          </kbd>
          <span>in dashboard for instant entity triage</span>
        </div>
      </div>
    </section>
  );
}
