"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden border-t border-white/[0.06]">
      {/* Linear Ambient Violet Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.14),transparent_70%)] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="text-4xl sm:text-6xl font-medium tracking-[-0.035em] text-[#f7f8f8] leading-[1.08] text-balance">
          Stop paying invoices <br />
          <span className="linear-hero-text">on blind faith.</span>
        </h2>

        <p className="mt-6 text-base sm:text-lg text-[#8a8f98] max-w-xl leading-relaxed text-balance">
          Connect your threat intelligence directly into financial decision-making. Test SENTINEL with live evidence or step through the Asterion scenario.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
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
            <span>Review Asterion Scenario</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8a8f98]" />
          </Link>
        </div>

        <div className="mt-8 text-xs font-mono text-[#62666d]">
          HACKATHON BUILD • ZERO CONFIGURATION REQUIRED • LOCAL PERSISTENT STORE
        </div>
      </div>
    </section>
  );
}
