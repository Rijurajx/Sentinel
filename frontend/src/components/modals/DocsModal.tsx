"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  BookOpen,
  Cpu,
  GitFork,
  ShieldCheck,
  Database,
  Terminal,
  Lock,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  FileCode2,
  Layers,
  Sparkles,
} from "lucide-react";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSection?: string;
}

export function DocsModal({ isOpen, onClose, defaultSection = "overview" }: DocsModalProps) {
  const [activeTab, setActiveTab] = useState(defaultSection);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!isOpen) return null;

  const docSections = [
    { id: "overview", label: "Architecture Overview", icon: Layers },
    { id: "scamshield", label: "Engine 01: ScamShield", icon: Cpu },
    { id: "trustgraph", label: "Engine 02: TrustGraph", icon: GitFork },
    { id: "finguard", label: "Engine 03: FinGuard Core", icon: ShieldCheck },
    { id: "schemas", label: "Database Schemas", icon: Database },
    { id: "api", label: "REST API Reference", icon: Terminal },
    { id: "security", label: "Zero-Trust Security", icon: Lock },
  ];

  const filteredSections = docSections.filter((s) =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="w-7 h-7 rounded-lg bg-[#5e6ad2]/15 border border-[#5e6ad2]/30 flex items-center justify-center text-[#5e6ad2]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide text-white flex items-center gap-2">
                <span>SENTINEL DOCUMENTATION</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#8a8f98] font-normal">
                  v2.0 PROD
                </span>
              </div>
              <div className="text-[10px] text-[#8a8f98]">
                Technical specifications, forensic engine logic &amp; API reference
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

        {/* Modal Main Body: Sidebar + Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar */}
          <div className="w-64 border-r border-white/[0.06] bg-[#090a0d] p-3 flex flex-col gap-3 shrink-0 hidden md:flex">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#62666d] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111318] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2]/50 transition-colors"
              />
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                      isActive
                        ? "bg-[#5e6ad2]/15 text-white font-medium border border-[#5e6ad2]/30"
                        : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#5e6ad2]" : "text-[#62666d]"}`} />
                      <span className="truncate">{sec.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3 h-3 text-[#5e6ad2]" />}
                  </button>
                );
              })}
            </nav>

            {/* Quick Links Footer */}
            <div className="pt-2 border-t border-white/[0.06] text-[11px] text-[#62666d] font-mono flex items-center justify-between">
              <span>ZERO-LLM MATH GATEWAY</span>
              <span className="text-[#4ebe82]">SECURE</span>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-[#0c0d10]">
            {/* 1. OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#5e6ad2] uppercase tracking-wider mb-1">
                    System Architecture
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Deterministic Threat Defense Architecture
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    SENTINEL is built on a 3-tier zero-trust architecture designed to detect, correlate, and freeze fraudulent supplier wire reroutes before capital clears the clearing gateway.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="text-xs font-semibold text-white mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#e06d53]" />
                      Presentation Layer
                    </div>
                    <p className="text-[11px] text-[#8a8f98] leading-relaxed">
                      Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, and interactive React Flow canvas.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="text-xs font-semibold text-white mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#74c69d]" />
                      Application Layer
                    </div>
                    <p className="text-[11px] text-[#8a8f98] leading-relaxed">
                      FastAPI Python core, Gemini 2.0 Flash multimodal OCR, NetworkX graph engine &amp; FinGuard ledger gateway.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="text-xs font-semibold text-white mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#f6c944]" />
                      Data Layer
                    </div>
                    <p className="text-[11px] text-[#8a8f98] leading-relaxed">
                      Cloud Firestore Database (`/investigations`, `/suppliers`), Firebase Storage &amp; external RBI IFSC registry.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    Architectural Invariants &amp; Guarantees
                  </h3>
                  <div className="space-y-2 text-xs text-[#8a8f98] leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="text-[#5e6ad2] font-mono font-bold">1.</span>
                      <span><strong className="text-white">Zero Model Hallucination in Financial Math:</strong> No generative LLM calculates whether an account is valid. FinGuard compares account hashes directly against approved records.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#5e6ad2] font-mono font-bold">2.</span>
                      <span><strong className="text-white">Relational Co-occurrence:</strong> Inbound entities are indexed against historical incidents to detect syndicate reuse across disparate corporate dockets.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#5e6ad2] font-mono font-bold">3.</span>
                      <span><strong className="text-white">Sub-Second Payment Interception:</strong> Inbound threads are evaluated prior to ERP automated disbursement clearance.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SCAMSHIELD */}
            {activeTab === "scamshield" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#ea4335] uppercase tracking-wider mb-1">
                    Forensic Engine 01
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    ScamShield &amp; Multimodal Email Radar
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Evaluates inbound RFC822 raw emails, supplier communications, and attached PDF/image invoices using Gemini 2.0 Flash to uncover fraudulent diversion techniques.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Key Forensic Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                      <div className="font-semibold text-white mb-1">RFC822 Header Authentication</div>
                      <p className="text-[#8a8f98] leading-relaxed">
                        Validates SPF, DKIM, and DMARC alignment. Uncovers display-name spoofing and newly registered lookalike domains (e.g. `apex-logistics-urgent.net` vs `apexlogistics.com`).
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                      <div className="font-semibold text-white mb-1">Multimodal Invoice Tampering Detection</div>
                      <p className="text-[#8a8f98] leading-relaxed">
                        Scans invoice PDFs for digital font anomalies, mismatched compression blocks around payment details, and pasted remittance instructions.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                      <div className="font-semibold text-white mb-1">Linguistic Urgency &amp; Coercion Analysis</div>
                      <p className="text-[#8a8f98] leading-relaxed">
                        Detects social engineering patterns: threats of supply chain shipment halts, demand for immediate wire settlement within 4 hours, and bypass of standard approval protocols.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                      <div className="font-semibold text-white mb-1">Real-Time IMAP Synchronization</div>
                      <p className="text-[#8a8f98] leading-relaxed">
                        Direct connection to `imap.gmail.com:993` with in-app user credentials for live mailbox monitoring without storing sensitive passwords in `.env`.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TRUSTGRAPH */}
            {activeTab === "trustgraph" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#5e6ad2] uppercase tracking-wider mb-1">
                    Forensic Engine 02
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    TrustGraph Relational Intelligence Mesh
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Fraud syndicates reuse mule bank accounts, phone numbers, and registrar email domains. TrustGraph maps multi-hop entity co-occurrences to uncover organized threat actor syndicates.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-3">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Graph Data Topology
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#8a8f98]">
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-[#5e6ad2] block text-[10px]">NODE TYPES</span>
                      <span className="text-white">Account, Vendor, Domain, Phone, Incident, ThreatActor</span>
                    </div>
                    <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-[#5e6ad2] block text-[10px]">EDGE RELATIONSHIPS</span>
                      <span className="text-white">CO_OCCURS_WITH, TRANSFERRED_TO, RESOLVES_TO, ASSOCIATED_WITH</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#8a8f98] leading-relaxed">
                  <p>
                    When an invoice is submitted with account <code className="text-[#f7f8f8] bg-white/[0.04] px-1 py-0.5 rounded">998877665544</code>, TrustGraph deterministically traverses graph edges up to 3 hops deep. If this account was previously tied to syndicate <strong>Crimson Typhoon (TC-948)</strong> or observed in another docket, the incident risk score jumps to <strong className="text-[#e77d79]">CRITICAL (98/100)</strong> with full provenance lineage.
                  </p>
                </div>
              </div>
            )}

            {/* 4. FINGUARD */}
            {activeTab === "finguard" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#4ebe82] uppercase tracking-wider mb-1">
                    Forensic Engine 03
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    FinGuard Deterministic Ledger Verification
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Zero model hallucination in financial routing. FinGuard enforces strict Python cryptographic checks against the verified supplier master catalog and official RBI/SWIFT banking registries.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <span className="text-[#8a8f98]">VERIFICATION PROTOCOL</span>
                    <span className="text-[#4ebe82]">DETERMINISTIC RULE GATE</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                      <span className="text-[#8a8f98]">1. Vendor Master Hash Diff</span>
                      <span className="text-white">SHA256(Account + IFSC + LegalName)</span>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                      <span className="text-[#8a8f98]">2. RBI IFSC Registry Query</span>
                      <span className="text-white">Validates Bank Branch, City &amp; Routing Code</span>
                    </div>
                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                      <span className="text-[#8a8f98]">3. Discrepancy Action</span>
                      <span className="text-[#e77d79] font-bold">AUTOMATED PAYMENT HOLD FREEZE</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#8a8f98] leading-relaxed">
                  If the invoice beneficiary differs from the supplier’s historical ledger by even one character, FinGuard immediately rejects automated clearance and halts the wire clearance process.
                </p>
              </div>
            )}

            {/* 5. SCHEMAS */}
            {activeTab === "schemas" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#f6c944] uppercase tracking-wider mb-1">
                    Cloud Firestore Schema
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Database Schema &amp; Storage Models
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Sentinel uses Cloud Firestore for real-time document sync and Firebase Storage for encrypted evidence files.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#5e6ad2] font-semibold">/investigations collection</span>
                      <span className="text-[10px] font-mono text-[#8a8f98]">Firestore Document</span>
                    </div>
                    <pre className="text-[11px] font-mono text-[#cbd5e1] p-3 rounded bg-black/40 overflow-x-auto">
{`{
  "id": "DOC-8891",
  "supplierName": "Apex Logistics Ltd.",
  "invoiceNumber": "INV-2024-9981",
  "amount": 485000.00,
  "currency": "USD",
  "threatScore": 94,
  "status": "DISBURSEMENT_FROZEN", // "PENDING" | "CLEARED" | "DISBURSEMENT_FROZEN"
  "routingSubmitted": {
    "accountNumber": "998877665544",
    "ifsc": "SBIN0000456",
    "bankName": "State Bank of India"
  },
  "finguardVerdict": "MISMATCH_DETECTED",
  "createdAt": "2024-11-20T08:14:00Z"
}`}
                    </pre>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#4ebe82] font-semibold">/suppliers collection</span>
                      <span className="text-[10px] font-mono text-[#8a8f98]">Master Catalog</span>
                    </div>
                    <pre className="text-[11px] font-mono text-[#cbd5e1] p-3 rounded bg-black/40 overflow-x-auto">
{`{
  "supplierId": "SUPP-0012",
  "legalName": "Apex Logistics Ltd.",
  "verifiedAccount": "112233445566",
  "verifiedIfsc": "HDFC0001234",
  "verifiedBank": "HDFC Bank",
  "officialDomains": ["apexlogistics.com"],
  "lastVerifiedAt": "2024-10-15T00:00:00Z"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* 6. API REFERENCE */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#5e6ad2] uppercase tracking-wider mb-1">
                    FastAPI Engine
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    REST API Endpoints Reference
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    FastAPI backend endpoints providing sub-second reasoning and verification.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Endpoint 1 */}
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#4ebe82]/15 text-[#4ebe82] font-mono text-xs font-bold">POST</span>
                      <code className="text-xs font-mono text-white">/api/verify-finguard</code>
                    </div>
                    <p className="text-xs text-[#8a8f98]">
                      Validates submitted invoice account number and IFSC against approved vendor records.
                    </p>
                    <pre className="text-[11px] font-mono text-[#cbd5e1] p-3 rounded bg-black/40 overflow-x-auto">
{`// Request Body
{
  "supplier_name": "Apex Logistics Ltd.",
  "submitted_account": "998877665544",
  "submitted_ifsc": "SBIN0000456",
  "invoice_amount": 485000.00
}

// Response (200 OK)
{
  "match": false,
  "status": "MISMATCH_DETECTED",
  "action": "PAYMENT_HOLD",
  "ledger_account_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "submitted_account_hash": "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"
}`}
                    </pre>
                  </div>

                  {/* Endpoint 2 */}
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090a0d] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#5e6ad2]/15 text-[#5e6ad2] font-mono text-xs font-bold">POST</span>
                      <code className="text-xs font-mono text-white">/api/gmail/sync</code>
                    </div>
                    <p className="text-xs text-[#8a8f98]">
                      Connects directly to user’s IMAP mailbox over port 993 to fetch unread emails and trigger threat triage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SECURITY */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono text-[#4ebe82] uppercase tracking-wider mb-1">
                    Compliance &amp; Governance
                  </div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    Zero-Trust Security Guarantees
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#8a8f98] leading-relaxed">
                    Designed for enterprise financial operations handling multi-million dollar supply chain transfers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1.5">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#5e6ad2]" />
                      Zero Data Retention for App Passwords
                    </div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      Gmail app passwords entered in the radar interface are transmitted via encrypted memory session and never written to `.env` or disk.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1.5">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#4ebe82]" />
                      Cryptographic Audit Trails
                    </div>
                    <p className="text-[#8a8f98] leading-relaxed">
                      Every payment hold event generates a tamper-evident SHA-256 hash log suitable for compliance, banking dispute resolutions, and CISO audit.
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

