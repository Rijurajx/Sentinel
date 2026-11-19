"use client";

import { useState } from "react";
import { FileUp, Cpu, GitFork, ShieldBan, FileCheck, CheckCircle2 } from "lucide-react";

export function ThreatWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Step 1 — Evidence Submission",
      subtitle: "Ingestion of suspicious invoice and message text",
      icon: FileUp,
      status: "INGESTED",
      badgeColor: "text-[#5ed6c0] bg-[#5ed6c0]/10 border-[#5ed6c0]/20",
      description:
        "Asterion Technologies receives an urgent PDF invoice from 'Asterion Supplies Pvt Ltd' demanding immediate settlement of $485,000 for server hardware, threatening delivery cancellations.",
      details: [
        { label: "File", val: "INV-2024-8842.pdf" },
        { label: "Sender", val: "billing@asterion-supplies-billing.com" },
        { label: "Claimed Amount", val: "$485,000.00 USD" },
      ],
    },
    {
      title: "Step 2 — ScamShield Analysis",
      subtitle: "Gemini multimodal structured entity extraction",
      icon: Cpu,
      status: "ANALYZED",
      badgeColor: "text-[#5ed6c0] bg-[#5ed6c0]/10 border-[#5ed6c0]/20",
      description:
        "Gemini extracts all entities into structured Pydantic models. It detects psychological pressure cues ('immediate release required') and extracts bank account 9999 8888 7777 and IFSC DEMO0002222.",
      details: [
        { label: "Urgency Metric", val: "Severe (High-pressure tone)" },
        { label: "Extracted Account", val: "999988887777" },
        { label: "Extracted IFSC", val: "DEMO0002222" },
      ],
    },
    {
      title: "Step 3 — TrustGraph Correlation",
      subtitle: "Deterministic historical entity cross-referencing",
      icon: GitFork,
      status: "CONNECTED",
      badgeColor: "text-[#5e6ad2] bg-[#5e6ad2]/10 border-[#5e6ad2]/20",
      description:
        "The Python graph engine normalizes extracted entities and queries stored incident records. It discovers that domain asterion-supplies-billing.com was flagged in historical phishing incident #104, and the contact phone was seen in incident #089.",
      details: [
        { label: "Domain Match", val: "Incident #104 (Phishing Campaign)" },
        { label: "Phone Match", val: "Incident #089 (Vendor Impersonation)" },
        { label: "Provenance", val: "100% Traceable Evidence IDs" },
      ],
    },
    {
      title: "Step 4 — FinGuard Verification",
      subtitle: "Deterministic bank account and IFSC verification",
      icon: ShieldBan,
      status: "BLOCKED",
      badgeColor: "text-[#eb5757] bg-[#eb5757]/10 border-[#eb5757]/20",
      description:
        "FinGuard compares the extracted bank details against the verified Asterion Supplies profile in the supplier registry. The account numbers and IFSC codes differ completely. Zero LLM hallucination—instant programmatic flag.",
      details: [
        { label: "Registered IFSC", val: "DEMO0001111 (HDFC Bandra West)" },
        { label: "Submitted IFSC", val: "DEMO0002222 (Axis Connaught Place)" },
        { label: "Verdict", val: "CRITICAL MISMATCH — DO NOT DISBURSE" },
      ],
    },
    {
      title: "Step 5 — Unified Intelligence",
      subtitle: "Consolidated executive report with actionable advice",
      icon: FileCheck,
      status: "SECURED",
      badgeColor: "text-[#4ebe82] bg-[#4ebe82]/10 border-[#4ebe82]/20",
      description:
        "SENTINEL generates an evidence-backed intelligence dossier linking the phishing cues, network graph provenance, and financial discrepancy into a definitive executive risk explanation with next steps.",
      details: [
        { label: "Risk Score", val: "94 / 100 (Critical Fraud Risk)" },
        { label: "Saved Capital", val: "$485,000.00" },
        { label: "Protocol", val: "Place payment hold; verify out-of-band" },
      ],
    },
  ];

  return (
    <section id="scenario" className="py-24 sm:py-32 relative overflow-hidden border-t border-white/[0.06] bg-[#090a0d]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[#5e6ad2] text-xs font-mono font-medium tracking-wider uppercase mb-3">
            Investigation Walkthrough
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.03em] text-[#f7f8f8] text-balance">
            How SENTINEL intercepts a <br />
            <span className="text-[#eb5757] font-mono">$485,000</span> vendor impersonation attack
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#8a8f98] max-w-xl text-balance">
            Step through the connected investigation workflow demonstrated in our test suite.
          </p>
        </div>

        {/* Linear Step Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStep === idx;
            return (
              <button
                key={step.title}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between ${
                  isCurrent
                    ? "bg-white/[0.05] border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                    : "bg-white/[0.015] border-white/[0.06] hover:bg-white/[0.03] text-[#8a8f98]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? "text-white" : "text-[#62666d]"}`} />
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${step.badgeColor}`}>
                    {step.status}
                  </span>
                </div>
                <div className="text-xs font-medium text-[#f7f8f8] truncate">
                  {`0${idx + 1}. ` + step.title.split(" — ")[1]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <div className="linear-card rounded-2xl p-6 sm:p-10 border border-white/[0.08] bg-[#0c0d11]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Step Explanation (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#5e6ad2] font-medium">PHASE {activeStep + 1} OF {steps.length}</span>
                <span className="text-[#62666d]">•</span>
                <span className="text-[#8a8f98]">{steps[activeStep].subtitle}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-medium text-[#f7f8f8] tracking-tight">
                {steps[activeStep].title}
              </h3>

              <p className="text-sm text-[#8a8f98] leading-relaxed">
                {steps[activeStep].description}
              </p>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="px-4 py-2 rounded-lg bg-[#f7f8f8] text-[#08090a] text-xs font-medium hover:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                >
                  {activeStep === steps.length - 1 ? "Restart Walkthrough" : "Next Step →"}
                </button>
                <span className="text-xs font-mono text-[#62666d]">
                  Click tabs above or navigate
                </span>
              </div>
            </div>

            {/* Step Evidence Metadata Box (5 Cols) */}
            <div className="lg:col-span-5 rounded-xl border border-white/[0.08] bg-[#08090a] p-5 font-mono text-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06] text-[#8a8f98]">
                <span>EVIDENCE TELEMETRY</span>
                <span className="text-[#4ebe82] flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                </span>
              </div>

              <div className="space-y-2.5">
                {steps[activeStep].details.map((detail) => (
                  <div key={detail.label} className="flex justify-between items-start gap-4">
                    <span className="text-[#62666d] text-[11px] shrink-0">{detail.label}:</span>
                    <span className="text-[#d0d3d8] text-right font-medium text-[11px] break-all">
                      {detail.val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#62666d]">
                Audit Provenance: <span className="text-[#5e6ad2]">SHA256:7f83b165...4b29</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
