"use client";

import { Scan, Network, ShieldCheck, ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

export function BentoCapabilities() {
  return (
    <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(94,106,210,0.08),transparent_70%)] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header (Linear Style) */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[#5e6ad2] text-xs font-mono font-medium tracking-wider uppercase mb-3">
            Core Architecture
          </span>

          <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.03em] text-[#f7f8f8] text-balance">
            Three distinct systems. <br />
            <span className="linear-hero-text">Zero room for error.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#8a8f98] max-w-xl text-balance">
            Threat indicators shouldn’t be checked in silos. SENTINEL connects ingestion, network correlation, and banking verification into a unified defense pipeline.
          </p>
        </div>

        {/* Linear Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: ScamShield — DETECT (Span 7) */}
          <div
            id="scamshield"
            className="lg:col-span-7 linear-card rounded-2xl p-8 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono tracking-wider text-[#5ed6c0] font-semibold flex items-center gap-2">
                  <Scan className="w-4 h-4" />
                  SCAMSHIELD // DETECT
                </span>
                <span className="text-[11px] font-mono text-[#8a8f98] px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.02]">
                  GEMINI MULTIMODAL
                </span>
              </div>

              <h3 className="text-2xl font-medium text-[#f7f8f8] tracking-tight mb-3">
                Evidence extraction without data loss
              </h3>
              <p className="text-sm text-[#8a8f98] leading-relaxed mb-6">
                Upload raw PDF invoices, forwarded email threads, or screenshots. Gemini extracts structured organizations, accounts, IFSC routing codes, and analyzes psychological pressure cues and subtle typos.
              </p>
            </div>

            {/* Embedded Micro-UI: Extracted Entities Scanner */}
            <div className="rounded-xl border border-white/[0.08] bg-[#08090a] p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-[#8a8f98] pb-2 border-b border-white/[0.06]">
                <span>EXTRACTED ENTITY TELEMETRY</span>
                <span className="text-[#5ed6c0]">CONFIDENCE: 98.4%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[#62666d] block text-[10px]">PAYEE SENDER</span>
                  <span className="text-[#f7f8f8] font-medium">invoice@asterion-supplies-billing.com</span>
                </div>
                <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[#62666d] block text-[10px]">EXTRACTED BANK</span>
                  <span className="text-[#eb5757] font-medium">ACC: 9999 8888 7777</span>
                </div>
                <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[#62666d] block text-[10px]">IFSC ROUTING</span>
                  <span className="text-[#eb5757] font-medium">DEMO0002222 (New)</span>
                </div>
                <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[#62666d] block text-[10px]">INVOICE TOTAL</span>
                  <span className="text-[#f7f8f8] font-medium">$485,000.00 USD</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-[#f0b96d]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f0b96d]" />
                <span>Detected high urgency phrasing (&quot;Immediate settlement required to release shipments&quot;)</span>
              </div>
            </div>
          </div>

          {/* Card 2: TrustGraph — INVESTIGATE (Span 5) */}
          <div
            id="trustgraph"
            className="lg:col-span-5 linear-card rounded-2xl p-8 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono tracking-wider text-[#5e6ad2] font-semibold flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  TRUSTGRAPH // INVESTIGATE
                </span>
                <span className="text-[11px] font-mono text-[#5e6ad2] px-2 py-0.5 rounded border border-[#5e6ad2]/20 bg-[#5e6ad2]/10">
                  PROVENANCE GRAPH
                </span>
              </div>

              <h3 className="text-2xl font-medium text-[#f7f8f8] tracking-tight mb-3">
                Uncover hidden relationships
              </h3>
              <p className="text-sm text-[#8a8f98] leading-relaxed mb-6">
                Isolated identifiers become investigative leads. TrustGraph matches normalized entities against historical records with strict provenance—no LLM hallucinations.
              </p>
            </div>

            {/* Embedded Micro-UI: Interactive Node Link Visual */}
            <div className="rounded-xl border border-white/[0.08] bg-[#08090a] p-4 font-mono text-xs space-y-3">
              <div className="text-[11px] text-[#8a8f98] pb-2 border-b border-white/[0.06]">
                HISTORICAL CORRELATIONS (2 MATCHES)
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded bg-white/[0.02] border border-[#f0b96d]/20 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[#f0b96d] font-medium block">DOMAIN CORRELATION</span>
                    <span className="text-[#d0d3d8]">asterion-supplies-billing.com</span>
                  </div>
                  <span className="text-[#f0b96d] text-[10px] px-1.5 py-0.5 rounded bg-[#f0b96d]/15">
                    INCIDENT #104
                  </span>
                </div>

                <div className="p-2.5 rounded bg-white/[0.02] border border-[#f0b96d]/20 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[#f0b96d] font-medium block">PHONE REUSE</span>
                    <span className="text-[#d0d3d8]">+91 98765 43210</span>
                  </div>
                  <span className="text-[#f0b96d] text-[10px] px-1.5 py-0.5 rounded bg-[#f0b96d]/15">
                    INCIDENT #089
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-[#62666d] pt-1">
                Every edge cites supporting document IDs and observation timestamps.
              </div>
            </div>
          </div>

          {/* Card 3: FinGuard — PROTECT (Span 12) */}
          <div
            id="finguard"
            className="lg:col-span-12 linear-card rounded-2xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 group"
          >
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#4ebe82] font-semibold mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>FINGUARD // PROTECT</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-medium text-[#f7f8f8] tracking-tight mb-4">
                Zero-hallucination payment protection
              </h3>
              <p className="text-sm text-[#8a8f98] leading-relaxed mb-6">
                AI extracts the data, but deterministic Python algorithms verify the money. FinGuard compares extracted payee bank accounts and IFSC codes against your trusted supplier registry with 100% mathematical precision.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8a8f98]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#4ebe82]" />
                  <span>Exact String Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#4ebe82]" />
                  <span>Duplicate Invoice Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#4ebe82]" />
                  <span>Zero LLM Routing Equality</span>
                </div>
              </div>
            </div>

            {/* Reconciliation Diff Badge Graphic */}
            <div className="w-full lg:w-96 rounded-xl border border-[#eb5757]/30 bg-[#08090a] p-5 font-mono text-xs space-y-3 shrink-0 shadow-[0_0_25px_rgba(235,87,87,0.08)]">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-[11px] text-[#eb5757] font-semibold">RECONCILIATION RESULT</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eb5757]/20 text-[#eb5757] font-bold">
                  PAYMENT BLOCKED
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between items-center text-[#4ebe82]">
                  <span>REGISTERED IFSC:</span>
                  <span className="font-bold">DEMO0001111</span>
                </div>
                <div className="flex justify-between items-center text-[#eb5757]">
                  <span>INCOMING IFSC:</span>
                  <span className="font-bold">DEMO0002222 ⚠️</span>
                </div>
                <div className="h-[1px] bg-white/[0.06] my-1" />
                <div className="text-[10px] text-[#8a8f98] leading-tight">
                  Discrepancy: Extracted routing points to an unauthorized branch in Connaught Place rather than Bandra West.
                </div>
              </div>

              <Link
                href="/investigations/new"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-[#f7f8f8] text-[11px] border border-white/[0.08] transition-colors"
              >
                <span>Run Verification Test</span>
                <ArrowRight className="w-3 h-3 text-[#5e6ad2]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
