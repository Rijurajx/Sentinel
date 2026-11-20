"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Compass,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Mail,
  FileUp,
  Cpu,
  GitFork,
  ShieldCheck,
  FileText,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStep?: string;
}

export function GuideModal({ isOpen, onClose, defaultStep = "quickstart" }: GuideModalProps) {
  const [activeStep, setActiveStep] = useState(defaultStep);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const guideSteps = [
    { id: "quickstart", label: "1. Quickstart & Onboarding", icon: Compass },
    { id: "gmail-setup", label: "2. Connect Live Gmail Radar", icon: Mail },
    { id: "upload-evidence", label: "3. Ingesting Invoices & Proofs", icon: FileUp },
    { id: "tri-pane", label: "4. Tri-Pane Cockpit Navigation", icon: Cpu },
    { id: "enforcement", label: "5. Freezing Payment Wires", icon: ShieldCheck },
    { id: "dossier", label: "6. Exporting CISO Dossiers", icon: FileText },
    { id: "faq", label: "7. FAQ & Troubleshooting", icon: HelpCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Dialog Container */}
      <div
        className="w-full max-w-5xl h-[88vh] max-h-[850px] rounded-2xl border border-white/[0.08] bg-[#0c0d10] text-[#f7f8f8] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="h-14 px-6 border-b border-white/[0.06] bg-[#0e1015] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4ebe82]/15 border border-[#4ebe82]/30 flex items-center justify-center text-[#4ebe82]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide text-white flex items-center gap-2">
                <span>SENTINEL OPERATOR GUIDE</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#8a8f98] font-normal">
                  STEP-BY-STEP
                </span>
              </div>
              <div className="text-[10px] text-[#8a8f98]">
                Interactive walkthrough for finance controllers and security teams
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <kbd className="hidden sm:inline-block font-mono text-[10px] text-[#62666d] px-1.5 py-0.5 rounded border border-white/[0.08] bg-white/[0.02]">
              ESC to close
            </kbd>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Step Navigation Sidebar */}
          <div className="w-64 border-r border-white/[0.06] bg-[#090a0d] p-3 flex flex-col gap-3 shrink-0 hidden md:flex">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] px-3 pt-1">
              OPERATOR WORKFLOW
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {guideSteps.map((step) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors text-left ${
                      isActive
                        ? "bg-[#4ebe82]/15 text-white font-medium border border-[#4ebe82]/30"
                        : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#4ebe82]" : "text-[#62666d]"}`} />
                      <span className="truncate">{step.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3 h-3 text-[#4ebe82]" />}
                  </button>
                );
              })}
            </nav>

            <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-[11px] text-[#8a8f98] space-y-1">
              <div className="font-semibold text-white">Need Live Help?</div>
              <p className="text-[10px] leading-relaxed text-[#62666d]">
                Press <code className="text-white bg-white/[0.05] px-1 rounded">⌘K</code> in dashboard anytime for quick triage shortcuts.
              </p>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#0c0d10]">
            {/* STEP 1: QUICKSTART */}
            {activeStep === "quickstart" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#4ebe82] uppercase tracking-wider mb-1">
                    Step 01
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Quickstart &amp; Account Setup
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Get up and running with SENTINEL in under two minutes to secure incoming supplier payments.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <span className="w-5 h-5 rounded-full bg-[#4ebe82]/15 text-[#4ebe82] flex items-center justify-center font-mono text-[11px]">1</span>
                      <span>Sign In via OAuth or Email</span>
                    </div>
                    <p className="text-xs text-[#8a8f98] pl-7 leading-relaxed">
                      Click <strong>Log In</strong> on the top navigation. Sign in with your corporate Google Account via 1-click OAuth, or enter your email credentials. Your session is securely maintained by Firebase Authentication.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <span className="w-5 h-5 rounded-full bg-[#4ebe82]/15 text-[#4ebe82] flex items-center justify-center font-mono text-[11px]">2</span>
                      <span>Select or Create Workspace</span>
                    </div>
                    <p className="text-xs text-[#8a8f98] pl-7 leading-relaxed">
                      Choose your organization’s active workspace. All supplier master catalogs, investigation dockets, and audit trails are isolated by multi-tenant workspace partitions in Cloud Firestore.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <span className="w-5 h-5 rounded-full bg-[#4ebe82]/15 text-[#4ebe82] flex items-center justify-center font-mono text-[11px]">3</span>
                      <span>Access Tri-Pane Investigation Dashboard</span>
                    </div>
                    <p className="text-xs text-[#8a8f98] pl-7 leading-relaxed">
                      Once authenticated, you enter the Sentinel Dashboard. The interface gives you instant access to incoming threats, TrustGraph syndicate mapping, and FinGuard banking verification.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStep("gmail-setup")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f7f8f8] text-[#08090a] hover:bg-white text-xs font-medium transition-colors"
                >
                  <span>Next: Connect Live Gmail Radar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* STEP 2: GMAIL SETUP */}
            {activeStep === "gmail-setup" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#ea4335] uppercase tracking-wider mb-1">
                    Step 02
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Connecting Live Gmail Threat Radar
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Sentinel connects directly to your corporate inbox via encrypted IMAP (port 993) to continuously monitor supplier invoice emails in real-time.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Zero `.env` In-App Security</strong>
                    You do NOT need to hardcode passwords in `.env`. You can enter and update your Gmail address and 16-character App Password directly in the radar interface with encrypted memory sessions.
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-2">
                    <div className="font-semibold text-white">How to generate a Gmail App Password:</div>
                    <ol className="list-decimal pl-5 space-y-1.5 text-[#8a8f98] leading-relaxed">
                      <li>Go to your Google Account (<a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-[#5e6ad2] hover:underline">myaccount.google.com/security</a>).</li>
                      <li>Ensure <strong>2-Step Verification</strong> is enabled.</li>
                      <li>Search for <strong>App Passwords</strong> in the security settings search bar.</li>
                      <li>Create a new password labeled <code className="text-white bg-white/[0.06] px-1 rounded">Sentinel Radar</code>.</li>
                      <li>Copy the 16-character password (e.g. <code className="text-white bg-white/[0.06] px-1 rounded">abcd efgh ijkl mnop</code>).</li>
                      <li>Paste your Gmail &amp; App Password into the **Gmail Radar** configuration inputs in Sentinel.</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-2">
                    <div className="font-semibold text-white">Ensure IMAP is Enabled in Gmail:</div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      In Gmail settings (<code className="text-white">Settings &rarr; Forwarding and POP/IMAP</code>), verify that <strong>Enable IMAP</strong> is checked. Click <strong>Save Changes</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStep("upload-evidence")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f7f8f8] text-[#08090a] hover:bg-white text-xs font-medium transition-colors"
                >
                  <span>Next: Ingesting Invoices &amp; Proofs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* STEP 3: UPLOAD EVIDENCE */}
            {activeStep === "upload-evidence" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#5e6ad2] uppercase tracking-wider mb-1">
                    Step 03
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Ingesting Invoices &amp; Evidence Files
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Analyze ad-hoc vendor invoices, receipts, and email threads on demand.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-2">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <FileUp className="w-4 h-4 text-[#5e6ad2]" />
                      Supported Formats
                    </div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      Upload PDF invoices, scanned billing receipts (`.png`, `.jpg`), or raw RFC822 email files (`.eml`).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-2">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#4ebe82]" />
                      Sub-Second Processing
                    </div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      Gemini 2.0 Flash extracts all key fields and runs cryptographic hashing against the supplier master catalog in under 2 seconds.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: TRI-PANE COCKPIT */}
            {activeStep === "tri-pane" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#5e6ad2] uppercase tracking-wider mb-1">
                    Step 04
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Tri-Pane Cockpit Navigation
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    How to inspect and triage flagged incidents across Sentinel’s three coordinated views.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                    <div className="font-semibold text-white mb-1">1. Left Stream (Threat Dockets Queue)</div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      Lists all inbound threats sorted by severity (Critical &gt; High &gt; Cleared). Shows vendor name, claimed amount, and threat badge.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                    <div className="font-semibold text-white mb-1">2. Middle Sub-Bar (Contextual Telemetry)</div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      Displays vendor metadata, timestamp, extraction confidence, and raw email security headers (SPF, DKIM, DMARC verdicts).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                    <div className="font-semibold text-white mb-1">3. Right Active Workbench</div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      Switch between three dedicated operational tabs:
                    </p>
                    <ul className="list-disc pl-5 mt-1.5 space-y-1 text-[#8a8f98]">
                      <li><strong className="text-white">FinGuard Review:</strong> Side-by-side ledger diff showing submitted vs. verified routing codes.</li>
                      <li><strong className="text-white">TrustGraph Canvas:</strong> Interactive node graph exposing multi-hop mule account syndicates.</li>
                      <li><strong className="text-white">ScamShield Proof:</strong> Visual invoice viewer with bounding boxes highlighting altered text.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: ENFORCEMENT */}
            {activeStep === "enforcement" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#e77d79] uppercase tracking-wider mb-1">
                    Step 05
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Freezing Fraudulent Payment Wires
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Halting unauthorized wire clearance before funds exit corporate bank accounts.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-200/90 leading-relaxed space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#e77d79]" />
                    How to Trigger an Immediate Payment Freeze
                  </div>
                  <p className="text-[#8a8f98]">
                    When FinGuard detects an altered bank account number or invalid IFSC, click the red <strong>Freeze Disbursement</strong> button.
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-[#8a8f98]">
                    <li>Sentinel immediately sets the incident status to <code className="text-[#e77d79]">DISBURSEMENT_FROZEN</code> in Firestore.</li>
                    <li>Halts automated ERP wire clearance to the fraudulent account.</li>
                    <li>Indexes the rogue bank account and lookalike domain into the TrustGraph knowledge base to protect future transactions.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* STEP 6: DOSSIER */}
            {activeStep === "dossier" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#5e6ad2] uppercase tracking-wider mb-1">
                    Step 06
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Exporting CISO Executive Incident Dossiers
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Generating professional forensic briefs for legal, compliance, and law enforcement escalation.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-3 text-xs">
                  <div className="font-semibold text-white">What is included in the Executive Dossier:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#8a8f98]">
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">✔ Executive Threat Summary</div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">✔ Total Capital Protected (\$USD)</div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">✔ Side-by-Side Ledger Routing Diff</div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">✔ TrustGraph Syndicate Provenance Map</div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">✔ RFC822 Email Authentication Audit</div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">✔ Remediation &amp; Law Enforcement Plan</div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: FAQ */}
            {activeStep === "faq" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#4ebe82] uppercase tracking-wider mb-1">
                    Step 07
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Frequently Asked Questions (FAQ)
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Common questions from finance analysts, developers, and hackathon judges.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-1.5">
                    <div className="font-semibold text-white">Q: How does Sentinel distinguish legitimate bank changes from fraud?</div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      Legitimate vendor banking changes require out-of-band verification and master vendor record updates. If an inbound invoice unilaterally changes remittance details without prior approval, Sentinel flags the discrepancy and holds payment until manual verification is complete.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-1.5">
                    <div className="font-semibold text-white">Q: Can an attacker fool the AI by changing fonts cleanly?</div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      No. Even if visual font changes are seamless, FinGuard's deterministic SHA-256 hash check and TrustGraph relational lookup compare the extracted account number against the approved vendor ledger. The routing mismatch is caught programmatically.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-1.5">
                    <div className="font-semibold text-white">Q: Are corporate email credentials stored on your servers?</div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      No. Gmail radar sessions use encrypted in-memory app password authentication and do not persist passwords to disk or `.env` files.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

