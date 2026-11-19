"use client";

import { Check, Binary, Database, Cpu, ShieldAlert } from "lucide-react";

export function SecuritySpecs() {
  const specs = [
    {
      icon: Binary,
      title: "Deterministic Financial Logic",
      description:
        "No LLM decides whether bank accounts match. Payee verification and duplicate invoice detection execute via strict Python boolean logic with 0% risk of model hallucination.",
    },
    {
      icon: Database,
      title: "Strict Evidence Provenance",
      description:
        "Every edge in the TrustGraph stores its supporting evidence ID, observation status, and timestamp. An investigative lead is never falsely represented as a verified fact.",
    },
    {
      icon: Cpu,
      title: "Multimodal Gemini Extraction",
      description:
        "Direct parsing of PDF invoices, scanned receipts, email threads, and screenshots into structured, validated Pydantic schemas.",
    },
    {
      icon: ShieldAlert,
      title: "Pre-Disbursement Interception",
      description:
        "Designed to sit between invoice approval and bank disbursement, alerting finance controllers before wire transfers or ACH clearances are initiated.",
    },
  ];

  return (
    <section id="security" className="py-24 sm:py-32 relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[#5e6ad2] text-xs font-mono font-medium tracking-wider uppercase mb-3">
            Forensic Rigor
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.03em] text-[#f7f8f8] text-balance">
            Engineered for precision. <br />
            <span className="linear-hero-text">Built without black-box shortcuts.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#8a8f98] max-w-xl text-balance">
            Why enterprise finance and cybersecurity teams trust SENTINEL for high-value transaction defense.
          </p>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.title}
                className="linear-card rounded-2xl p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white mb-6">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-medium text-[#f7f8f8] tracking-tight mb-2.5">
                    {spec.title}
                  </h3>
                  <p className="text-sm text-[#8a8f98] leading-relaxed">
                    {spec.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-mono text-[#4ebe82]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Enforced by Backend Repository Layer</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
