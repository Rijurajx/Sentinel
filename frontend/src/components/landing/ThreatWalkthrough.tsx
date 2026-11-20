"use client";

import { useState } from "react";
import { FileUp, Cpu, GitFork, ShieldCheck, ArrowRight, Check } from "lucide-react";

export function ThreatWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: "01",
      title: "Inbound Ingestion",
      category: "GMAIL / EVIDENCE VAULT",
      summary: "Receives raw vendor communication across email threads or PDF invoices.",
      description:
        "An urgent email arrives from 'cfo-treasury@apex-logistics-urgent.net' requesting immediate wire clearance of $485,000 for server hardware under #INV-8891, threatening shipment cancellation.",
      telemetry: [
        { key: "Sender Domain", val: "apex-logistics-urgent.net (3 days old)" },
        { key: "Target Invoice", val: "INV-8891 ($485,000.00 USD)" },
        { key: "Auth Status", val: "SPF Softfail • Domain Mismatch" },
      ],
    },
    {
      step: "02",
      title: "Multimodal AI Extraction",
      category: "GEMINI 2.0 FLASH",
      summary: "Extracts structured financial entities, urgency cues, and channel diversions.",
      description:
        "Gemini 2.0 Flash parses the message into structured schemas. It extracts bank destination account 998877665544 and IFSC SBIN0000456, while detecting psychological pressure ('settle within 4 hours') and phone channel diversion.",
      telemetry: [
        { key: "Psychological Cues", val: "Severe urgency, statutory audit pressure" },
        { key: "Extracted Account", val: "998877665544" },
        { key: "Extracted IFSC", val: "SBIN0000456 (State Bank of India)" },
      ],
    },
    {
      step: "03",
      title: "Deterministic Bank Match",
      category: "FINGUARD CORE",
      summary: "Evaluates routing against corporate Master Vendor Profile with zero LLM math.",
      description:
        "FinGuard compares the extracted bank details against the verified supplier profile in the corporate master ledger. The account number and IFSC code differ completely from verified record 556677889900 (HDFC Bank). Mismatch triggers programmatic hard stop.",
      telemetry: [
        { key: "Master Account", val: "556677889900 (Verified HDFC Bank)" },
        { key: "Invoiced Account", val: "998877665544 (Unverified SBI Branch)" },
        { key: "Integrity Result", val: "COORDINATE_MISMATCH_DISCREPANCY" },
      ],
    },
    {
      step: "04",
      title: "Gateway Interception",
      category: "TRUSTGRAPH & DOSSIER",
      summary: "Places dual-authorization hold on ERP payment gateways and compiles CISO brief.",
      description:
        "SENTINEL automatically places an immediate disbursement hold on the vendor's payment gateway. TrustGraph correlates the mule account with historical cluster TC-948, and compiles an executive threat dossier with actionable verification steps.",
      telemetry: [
        { key: "Capital Protected", val: "$485,000.00" },
        { key: "Syndicate Link", val: "Crimson Typhoon / TC-948" },
        { key: "Gateway State", val: "Disbursement Frozen • Dual-Auth Required" },
      ],
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="scenario" className="py-24 sm:py-32 relative overflow-hidden border-t border-white/[0.06] bg-[#08090a]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="text-[11px] font-mono text-[#8a8f98] tracking-wider uppercase mb-3">
            Interception Lifecycle
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#f7f8f8] text-balance">
            How SENTINEL intercepts a <br />
            <span className="font-mono text-white">$485,000</span> wire reroute in real time
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8a8f98] max-w-xl text-balance">
            Step through the connected four-stage forensic pipeline protecting treasury disbursements.
          </p>
        </div>

        {/* Step Navigation Bar (Linear Style Horizontal Segmented Control) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {steps.map((st, idx) => (
            <button
              key={st.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeStep === idx
                  ? "bg-white/[0.08] border-white/20 text-white shadow-sm"
                  : "bg-[#0c0d10] border-white/[0.06] text-[#8a8f98] hover:text-white hover:border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-[#5e6ad2] font-semibold">{st.step}</span>
                <span className="text-[9px] font-mono text-[#62666d] uppercase">{st.category.split(" ")[0]}</span>
              </div>
              <div className="text-xs font-medium truncate">{st.title}</div>
            </button>
          ))}
        </div>

        {/* Active Stage Detailed Panel */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#5e6ad2] font-bold">{current.step}</span>
                <span className="text-white/20">/</span>
                <h3 className="text-lg font-medium text-white">{current.title}</h3>
              </div>
              <p className="text-xs text-[#8a8f98] mt-1">{current.summary}</p>
            </div>
            <div className="text-[11px] font-mono text-[#8a8f98] px-2.5 py-1 rounded bg-white/[0.02] border border-white/[0.06] shrink-0 self-start sm:self-auto">
              MODULE: {current.category}
            </div>
          </div>

          <p className="text-sm text-[#8a8f98] leading-relaxed">
            {current.description}
          </p>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {current.telemetry.map((t, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-white/[0.06] bg-[#08090a] font-mono text-xs space-y-1">
                <span className="text-[10px] text-[#62666d] block uppercase tracking-wide">{t.key}</span>
                <span className="text-white font-medium break-words">{t.val}</span>
              </div>
            ))}
          </div>

          {/* Bottom Next Action */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-[#62666d]">STAGE {activeStep + 1} OF 4</span>
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
              className="text-[#5e6ad2] hover:text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <span>{activeStep === steps.length - 1 ? "Start from Beginning" : "Next Stage"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
