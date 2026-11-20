"use client";

import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden border-t border-white/[0.06] bg-[#08090a]">
      {/* Linear Ambient Subtle Indigo Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.12),transparent_70%)] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] text-[#f7f8f8] leading-[1.08] text-balance">
          Defend enterprise capital <br />
          <span className="text-[#8a8f98]">before the wire clears.</span>
        </h2>

        <p className="mt-5 text-sm sm:text-base text-[#8a8f98] max-w-xl leading-relaxed text-balance">
          Connect your accounts payable and security workflows directly into deterministic bank routing verification and multimodal AI threat reasoning.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
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
            <span>Try Interactive Sandbox ↑</span>
          </a>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] text-[10px] font-mono text-[#62666d] flex flex-wrap items-center justify-center gap-4">
          <span>ZERO-LLM BANKING LOGIC</span>
          <span>•</span>
          <span>GEMINI 2.0 FLASH REASONING</span>
          <span>•</span>
          <span>TRUSTGRAPH PROVENANCE MESH</span>
        </div>
      </div>
    </section>
  );
}
