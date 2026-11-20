"use client";

import { Check, X, Shield, Binary, GitFork, Cpu } from "lucide-react";

export function SecuritySpecs() {
  const comparison = [
    {
      capability: "Supplier Bank Routing Verification",
      traditional: "Manual callback or unverified PDF invoice review",
      sentinel: "Deterministic zero-LLM match against Master Vendor Profile",
    },
    {
      capability: "BEC & Channel Diversion Detection",
      traditional: "Basic keyword spam filters (easily bypassed)",
      sentinel: "Gemini 2.0 Flash reasoning over RFC822 headers & urgency cues",
    },
    {
      capability: "Historical Mule Account Correlation",
      traditional: "Isolated ERP silos with no cross-incident memory",
      sentinel: "TrustGraph relational provenance traversing past incidents",
    },
    {
      capability: "Decision Latency & Gateway Action",
      traditional: "Hours or days of manual accounting triage",
      sentinel: "Sub-second automated payment hold on disreputable wires",
    },
    {
      capability: "Cryptographic Evidence Provenance",
      traditional: "Scattered emails and unlinked screenshots",
      sentinel: "Immutable evidence IDs linking every claim to source bytes",
    },
  ];

  return (
    <section id="security" className="py-24 sm:py-32 relative overflow-hidden border-t border-white/[0.06] bg-[#0c0d10]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="text-[11px] font-mono text-[#8a8f98] tracking-wider uppercase mb-3">
            System Rigor
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#f7f8f8] text-balance">
            Engineered for high-assurance treasury defense.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8a8f98] max-w-xl text-balance">
            Why enterprise finance controllers and security engineers choose deterministic controls over black-box AI tools.
          </p>
        </div>

        {/* Linear Style Comparison Table */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#08090a] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 border-b border-white/[0.08] bg-white/[0.01] text-xs font-mono text-[#8a8f98]">
            <div className="md:col-span-4 uppercase tracking-wider">Capability</div>
            <div className="md:col-span-4 uppercase tracking-wider hidden md:block">Traditional AP / Spam Tools</div>
            <div className="md:col-span-4 uppercase tracking-wider text-[#5e6ad2] hidden md:block">SENTINEL Defense Engine</div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {comparison.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 text-xs gap-2 md:gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="md:col-span-4 font-medium text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                  <span>{row.capability}</span>
                </div>
                <div className="md:col-span-4 text-[#8a8f98] text-[11px] sm:text-xs">
                  <span className="md:hidden text-[#62666d] font-mono text-[10px] block">Legacy: </span>
                  {row.traditional}
                </div>
                <div className="md:col-span-4 text-[#d0d3d8] text-[11px] sm:text-xs font-mono flex items-start gap-1.5">
                  <span className="md:hidden text-[#5e6ad2] text-[10px] block">Sentinel: </span>
                  <Check className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0 mt-0.5" />
                  <span>{row.sentinel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 font-mono text-xs">
          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#08090a] space-y-2">
            <div className="text-[10px] text-[#8a8f98] uppercase">01 / DETERMINISTIC LOGIC</div>
            <div className="text-white font-medium text-xs">Zero Model Hallucination</div>
            <p className="text-[#8a8f98] text-[11px] font-sans leading-relaxed">
              Disbursement verification executes via programmatic hashing. No AI guesses bank accounts.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#08090a] space-y-2">
            <div className="text-[10px] text-[#8a8f98] uppercase">02 / GRAPH PROVENANCE</div>
            <div className="text-white font-medium text-xs">Immutable Audit Trace</div>
            <p className="text-[#8a8f98] text-[11px] font-sans leading-relaxed">
              Every coordinate link preserves evidence document hashes, timestamps, and confidence telemetry.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#08090a] space-y-2">
            <div className="text-[10px] text-[#8a8f98] uppercase">03 / MULTIMODAL REASONING</div>
            <div className="text-white font-medium text-xs">Gemini 2.0 Flash Extraction</div>
            <p className="text-[#8a8f98] text-[11px] font-sans leading-relaxed">
              High-speed structured entity parsing across messy PDFs, scanned receipts, and email streams.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
