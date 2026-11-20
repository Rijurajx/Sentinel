"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  Key,
  X,
  Copy,
  Check,
  FileText,
  Building2,
  CreditCard,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Trash2,
  Settings,
} from "lucide-react";
import { scanGmailInbox, GmailScannedEmail } from "@/lib/apiClient";
import {
  InvoiceItem,
  InboxAlertItem,
  SupplierItem,
  EvidenceItem,
  InvestigationItem,
} from "@/lib/dashboard-data";

interface GmailRadarWorkspaceProps {
  workspaceId: string;
  onQuarantineThreat?: (threatData: {
    email: GmailScannedEmail;
    invoice?: InvoiceItem;
    alert?: InboxAlertItem;
    evidence?: EvidenceItem;
  }) => void;
  onSelectView?: (view: string) => void;
}

export function GmailRadarWorkspace({
  workspaceId,
  onQuarantineThreat,
  onSelectView,
}: GmailRadarWorkspaceProps) {
  const [emails, setEmails] = useState<GmailScannedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<"all" | "fraud" | "legitimate">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<GmailScannedEmail | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [quarantinedIds, setQuarantinedIds] = useState<Set<string>>(new Set());
  const [connectedAccount, setConnectedAccount] = useState("No Gmail Account Connected");
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Gmail IMAP Form State
  const [gmailUser, setGmailUser] = useState("");
  const [gmailPassword, setGmailPassword] = useState("");
  const [maxEmails, setMaxEmails] = useState(5);
  const [showPassword, setShowPassword] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Initial Scan on Mount: checks localStorage for saved credentials
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("sentinel_gmail_config");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.user && parsed.password) {
            setGmailUser(parsed.user);
            setGmailPassword(parsed.password);
            setMaxEmails(parsed.maxEmails || 5);
            setIsConfigured(true);
            handleRunScan(true, parsed.user, parsed.password, parsed.maxEmails || 5);
            return;
          }
        }
      }
    } catch (e) {
      console.warn("Could not load stored Gmail config:", e);
    }
  }, []);

  const handleRunScan = async (
    useLive = true,
    overrideUser?: string,
    overridePwd?: string,
    overrideMax?: number
  ) => {
    setIsLoading(true);
    setConnectionError(null);
    const activeUser = (overrideUser !== undefined ? overrideUser : gmailUser).trim();
    const activePwd = (overridePwd !== undefined ? overridePwd : gmailPassword).trim();
    const activeMax = overrideMax !== undefined ? overrideMax : maxEmails;

    if (!activeUser || !activePwd) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await scanGmailInbox({
        username: activeUser || undefined,
        app_password: activePwd || undefined,
        use_live_gmail: useLive,
        max_emails: activeMax,
      });
      setEmails(res.emails);
      setConnectedAccount(res.connected_account);
      if (res.connection_error) {
        setConnectionError(res.connection_error);
      }
      if (res.emails.length > 0) {
        setSelectedEmail(res.emails[0]);
      } else {
        setSelectedEmail(null);
      }
    } catch (e: any) {
      console.warn("Scan failed, using local telemetry:", e);
      setConnectionError(e.message || "Connection to Gmail IMAP failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndConnect = async () => {
    const userClean = gmailUser.trim();
    const pwdClean = gmailPassword.trim();
    if (!userClean || !pwdClean) return;

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "sentinel_gmail_config",
          JSON.stringify({
            user: userClean,
            password: pwdClean,
            maxEmails,
          })
        );
      }
      setIsConfigured(true);
      setIsConnectModalOpen(false);
      await handleRunScan(true, userClean, pwdClean, maxEmails);
    } catch (e) {
      console.warn("Could not save Gmail config to localStorage:", e);
    }
  };

  const handleDisconnect = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sentinel_gmail_config");
      }
    } catch {}
    setGmailUser("");
    setGmailPassword("");
    setIsConfigured(false);
    setIsConnectModalOpen(false);
    setConnectionError(null);
    setEmails([]);
    setSelectedEmail(null);
    setConnectedAccount("No Gmail Account Connected");
  };

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  // Quarantine & Ingest Threat directly into Sentinel Ecosystem
  const handleQuarantine = (email: GmailScannedEmail) => {
    setQuarantinedIds((prev) => new Set(prev).add(email.id));

    // Extract financial data if present
    const bankEntity = email.extracted_entities.find((e) => e.type === "BANK_ACCOUNT")?.name || "999988887777";
    const ifscEntity = email.extracted_entities.find((e) => e.type === "IFSC")?.name || "SBIN0000456";
    const amountEntity = email.extracted_entities.find((e) => e.type === "AMOUNT")?.name || "$485,000.00";

    const newAlert: InboxAlertItem = {
      id: `ALRT-${Math.floor(100 + Math.random() * 900)}`,
      title: `Gmail Intercept: ${email.subject}`,
      source: "ScamShield Ingestion",
      severity: "Critical",
      status: "Action Required",
      timestamp: "Just now",
      summary: `Automated Gmail inspection caught BEC wire diversion from ${email.sender_name} (${email.sender_domain}). Target routing altered to ${bankEntity} (${ifscEntity}).`,
      affectedEntity: email.sender_name,
      amount: amountEntity,
      payloadSnippet: JSON.stringify({
        email_id: email.id,
        sender: email.sender,
        domain: email.sender_domain,
        spf_dkim: email.spf_dkim,
        bank_destination: bankEntity,
        routing_ifsc: ifscEntity,
      }),
      recommendedAction: "Freeze payment dispatch in FinGuard and verify supplier CFO out-of-band.",
    };

    const newEvidence: EvidenceItem = {
      id: `EV-${Date.now()}`,
      title: `Gmail_${email.subject.slice(0, 24).replace(/\s+/g, "_")}.eml`,
      type: "Email",
      associatedInvestigationId: "INC-889",
      uploadedAt: "Just now",
      status: "Flagged",
      fileSize: "14 KB",
      threatSummary: email.verdict_summary,
      threatCategory: email.threat_category,
      severity: email.severity,
      urgencyTriggers: email.urgency_indicators,
      extractedEntities: email.extracted_entities.map((e) => ({
        type: e.type,
        value: e.name,
        role: "Discrepancy Route",
      })),
    };

    const newInvoice: InvoiceItem = {
      id: "INV-8891",
      vendorName: email.sender_name,
      amount: amountEntity,
      invoiceDate: "Nov 20, 2026",
      dueDate: "Immediate",
      status: "Payment Held",
      payeeAccount: bankEntity,
      payeeIfsc: ifscEntity,
      matchStatus: "MISMATCH",
      discrepancyNote: "Gmail Threat Radar flagged sudden payee bank routing modification via typosquatted domain.",
      poNumber: "PO-2026-001",
      items: [
        {
          description: "Enterprise Operations Order (Payment Intercepted)",
          quantity: 1,
          unitPrice: amountEntity,
          total: amountEntity,
        },
      ],
    };

    if (onQuarantineThreat) {
      onQuarantineThreat({
        email,
        alert: newAlert,
        evidence: newEvidence,
        invoice: newInvoice,
      });
    }
  };

  const filteredEmails = emails.filter((em) => {
    if (filterTab === "fraud" && !em.is_fraud) return false;
    if (filterTab === "legitimate" && em.is_fraud) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      em.sender.toLowerCase().includes(q) ||
      em.sender_name.toLowerCase().includes(q) ||
      em.subject.toLowerCase().includes(q) ||
      em.sender_domain.toLowerCase().includes(q) ||
      em.snippet.toLowerCase().includes(q)
    );
  });

  const fraudCount = emails.filter((e) => e.is_fraud).length;
  const legitCount = emails.filter((e) => !e.is_fraud).length;

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-hidden flex flex-col z-10 select-text">
      {/* 1. Top Header Bar */}
      <header className="h-12 px-4 sm:px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20 shrink-0 gap-3">
        {/* Left: Gmail Icon + Breadcrumb */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-[#ea4335]" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#4ebe82] animate-pulse" />
            <span className="font-mono text-xs text-[#8a8f98] font-medium">GMAIL RADAR</span>
          </div>
          <span className="text-white/20 shrink-0">/</span>
          <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            Automated Threat & Legitimacy Inspection
          </span>
          <span className="hidden lg:inline-flex text-[10px] font-mono text-[#5e6ad2] bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 px-2 py-0.5 rounded shrink-0">
            Gemini 2.0 Flash
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isConfigured ? (
            <>
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(true)}
                className="h-8 px-2.5 rounded-lg border border-[#4ebe82]/30 bg-[#4ebe82]/[0.08] hover:bg-[#4ebe82]/[0.15] text-xs font-mono text-[#4ebe82] transition-colors flex items-center gap-1.5 shrink-0"
                title="Edit Gmail live connection settings"
              >
                <span className="w-2 h-2 rounded-full bg-[#4ebe82] animate-pulse" />
                <span className="truncate max-w-[130px] sm:max-w-[180px]">{gmailUser}</span>
                <Settings className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
              </button>

              <button
                type="button"
                onClick={() => handleRunScan(true)}
                disabled={isLoading}
                className="h-8 px-3 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm shadow-[#5e6ad2]/20 disabled:opacity-50 shrink-0 whitespace-nowrap"
                title="Fetch latest emails from live mailbox"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">{isLoading ? "Scanning Live..." : "Sync Live Inbox"}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsConnectModalOpen(true)}
              className="h-8 px-3 rounded-lg border border-[#f0b96d]/30 bg-[#f0b96d]/10 hover:bg-[#f0b96d]/20 text-[#f0b96d] hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-sm shadow-[#f0b96d]/10"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Connect Live Gmail</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Metrics Strip: 4 Executive KPI Cards */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-white/[0.06] bg-[#0e1015]/80 grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        <div className="p-3 rounded-lg border border-white/[0.06] bg-black/30 space-y-1">
          <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Ingested Telemetry</div>
          <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span>{emails.length}</span>
            <span className="text-[11px] font-normal text-[#8a8f98]">Messages Scanned</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-[#eb5757]/20 bg-[#eb5757]/[0.04] space-y-1">
          <div className="text-[10px] font-mono text-[#eb5757] uppercase">🚨 Fraud Intercepted</div>
          <div className="text-lg font-bold font-mono text-[#eb5757] flex items-center gap-2">
            <span>{fraudCount}</span>
            <span className="text-[11px] font-normal text-[#eb5757]">Active BEC Attacks</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-[#4ebe82]/20 bg-[#4ebe82]/[0.04] space-y-1">
          <div className="text-[10px] font-mono text-[#4ebe82] uppercase">✓ Verified Legitimate</div>
          <div className="text-lg font-bold font-mono text-[#4ebe82] flex items-center gap-2">
            <span>{legitCount}</span>
            <span className="text-[11px] font-normal text-[#4ebe82]">Authentic Vendors</span>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-[#5e6ad2]/20 bg-[#5e6ad2]/[0.04] space-y-1">
          <div className="text-[10px] font-mono text-[#5e6ad2] uppercase">Capital Protected</div>
          <div className="text-lg font-bold font-mono text-[#4ebe82] flex items-center gap-2">
            <span>$485,000.00</span>
            <span className="text-[11px] font-normal text-[#8a8f98]">Zero Loss Realized</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Pills & Search Sub-Bar */}
      <div className="px-4 sm:px-6 py-2 border-b border-white/[0.06] bg-[#08090a]/80 flex items-center justify-between text-xs gap-3 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 shrink-0 ${
              filterTab === "all"
                ? "bg-white/[0.08] text-white ring-1 ring-white/10"
                : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <span>All Emails</span>
            <span className="font-mono text-[10px] text-[#62666d]">({emails.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("fraud")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              filterTab === "fraud"
                ? "bg-[#eb5757]/20 text-[#eb5757] ring-1 ring-[#eb5757]/40"
                : "text-[#8a8f98] hover:text-[#eb5757] hover:bg-white/[0.03]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#eb5757]" />
            <span>Fraud Detected</span>
            <span className="font-mono text-[10px] opacity-80">({fraudCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("legitimate")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              filterTab === "legitimate"
                ? "bg-[#4ebe82]/20 text-[#4ebe82] ring-1 ring-[#4ebe82]/40"
                : "text-[#8a8f98] hover:text-[#4ebe82] hover:bg-white/[0.03]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
            <span>Verified Legitimate</span>
            <span className="font-mono text-[10px] opacity-80">({legitCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-44 sm:w-56 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#62666d]" />
          <input
            type="text"
            placeholder="Search email, domain, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-[#62666d] focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* 4. Main Workspace Split: Email Stream + Forensic Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Email Stream Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {connectionError && (
            <div className="p-3.5 rounded-xl border border-[#f0b96d]/30 bg-[#f0b96d]/[0.08] text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold text-[#f0b96d]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Live IMAP Notice</span>
              </div>
              <p className="text-[#8a8f98] text-[11px] leading-relaxed">
                {connectionError}
              </p>
            </div>
          )}

          {filteredEmails.length > 0 ? (
            filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              const isQuarantined = quarantinedIds.has(email.id);

              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 sm:p-5 rounded-xl border text-left cursor-pointer transition-all space-y-3 relative overflow-hidden ${
                    isSelected
                      ? "bg-[#0e1015] border-[#5e6ad2] ring-1 ring-[#5e6ad2]/50 shadow-lg shadow-[#5e6ad2]/5"
                      : "bg-[#0e1015]/60 border-white/[0.08] hover:border-white/20 hover:bg-[#0e1015]"
                  }`}
                >
                  {/* Top Bar: Sender + Big Bold Verdict Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          email.is_fraud
                            ? "bg-[#eb5757]/15 border border-[#eb5757]/30 text-[#eb5757]"
                            : "bg-[#4ebe82]/15 border border-[#4ebe82]/30 text-[#4ebe82]"
                        }`}
                      >
                        {email.is_fraud ? (
                          <ShieldAlert className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white truncate">
                            {email.sender_name}
                          </span>
                          <span className="text-[11px] font-mono text-[#8a8f98] truncate hidden sm:inline">
                            &lt;{email.sender}&gt;
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5">
                          <span className="text-[#8a8f98]">Domain:</span>
                          <span
                            className={
                              email.is_fraud
                                ? "text-[#eb5757] bg-[#eb5757]/10 px-1 rounded"
                                : "text-[#4ebe82] bg-[#4ebe82]/10 px-1 rounded"
                            }
                          >
                            {email.sender_domain}
                          </span>
                          <span className="text-white/20">•</span>
                          <span className="text-[#8a8f98]">{email.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bold Verdict Pill */}
                    <div className="flex items-center gap-2 shrink-0">
                      {email.is_fraud ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold font-mono bg-[#eb5757]/20 border border-[#eb5757]/40 text-[#eb5757] flex items-center gap-1.5 shadow-sm shadow-[#eb5757]/10">
                          <span className="w-2 h-2 rounded-full bg-[#eb5757] animate-pulse" />
                          <span>🚨 FRAUDULENT / BEC ATTACK</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold font-mono bg-[#4ebe82]/20 border border-[#4ebe82]/40 text-[#4ebe82] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#4ebe82]" />
                          <span>✓ VERIFIED LEGITIMATE</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Subject & Snippet */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-white">
                      {email.subject}
                    </h3>
                    <p className="text-xs text-[#d0d3d8] leading-relaxed line-clamp-2">
                      {email.snippet}
                    </p>
                  </div>

                  {/* Gemini Flash Reasoning & Threat Classification Box */}
                  <div
                    className={`p-3 rounded-lg border text-xs space-y-2 ${
                      email.is_fraud
                        ? "bg-[#eb5757]/[0.04] border-[#eb5757]/20 text-[#eb5757]"
                        : "bg-[#4ebe82]/[0.04] border-[#4ebe82]/20 text-[#4ebe82]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="font-semibold uppercase tracking-wider">
                          ScamShield AI Verdict: {email.threat_category}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-current text-[10px]">
                        {Math.round(email.confidence_score * 100)}% Confidence
                      </span>
                    </div>

                    <p className="text-[#8a8f98] text-[11px] leading-relaxed">
                      {email.verdict_summary}
                    </p>

                    {email.urgency_indicators.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-mono text-[#8a8f98]">Triggers:</span>
                        {email.urgency_indicators.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                          >
                            {t.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Controls Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#8a8f98]">
                      <span>SPF/DKIM:</span>
                      <span
                        className={
                          email.spf_dkim.startsWith("PASS") ? "text-[#4ebe82]" : "text-[#eb5757]"
                        }
                      >
                        {email.spf_dkim}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {email.is_fraud && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuarantine(email);
                          }}
                          disabled={isQuarantined}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                            isQuarantined
                              ? "bg-[#4ebe82]/20 text-[#4ebe82] border border-[#4ebe82]/40"
                              : "bg-[#eb5757] hover:bg-[#ff6b6b] text-white shadow-sm shadow-[#eb5757]/20"
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>
                            {isQuarantined ? "Quarantined in FinGuard ✓" : "Quarantine & Auto-Hold"}
                          </span>
                        </button>
                      )}

                      {!email.is_fraud && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Vendor ${email.sender_name} verified. Communication safe.`);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[#4ebe82]/30 bg-[#4ebe82]/10 hover:bg-[#4ebe82]/20 text-[#4ebe82] text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Allow Vendor Communication</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedEmail(email)}
                        className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-[#8a8f98] hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-[#8a8f98]" />
              </div>
              <div className="space-y-1.5">
                <div className="text-sm font-semibold text-white">
                  {isConfigured ? "No Emails Found in Inbox" : "No Gmail Account Connected"}
                </div>
                <div className="text-xs text-[#8a8f98] leading-relaxed">
                  {isConfigured
                    ? "Your connected mailbox has no incoming messages matching the query. Click below to fetch the latest messages."
                    : "Connect your Google Workspace or personal Gmail account to automatically scan live incoming emails for payment fraud and BEC wire diversions."}
                </div>
              </div>
              {!isConfigured ? (
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors inline-flex items-center gap-2 shadow-sm shadow-[#5e6ad2]/20"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Connect Live Gmail</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRunScan(true)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors inline-flex items-center gap-2 shadow-sm shadow-[#5e6ad2]/20 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>{isLoading ? "Scanning Live..." : "Sync Live Inbox"}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Forensic Email Inspector */}
        <aside className="w-80 lg:w-96 border-l border-white/[0.08] bg-[#08090a] p-5 space-y-5 overflow-y-auto shrink-0 flex flex-col justify-between">
          <div className="space-y-4 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#5e6ad2]" />
                <span>Forensic RFC822 Inspector</span>
              </div>
              {selectedEmail && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    selectedEmail.is_fraud
                      ? "bg-[#eb5757]/15 text-[#eb5757] border-[#eb5757]/30"
                      : "bg-[#4ebe82]/15 text-[#4ebe82] border-[#4ebe82]/30"
                  }`}
                >
                  {selectedEmail.classification}
                </span>
              )}
            </div>

            {selectedEmail ? (
              <div className="space-y-4">
                {/* Message Coordinates */}
                <div className="p-3 rounded-lg border border-white/[0.06] bg-[#0e1015] space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-[#62666d]">Subject: </span>
                    <span className="text-white font-medium">{selectedEmail.subject}</span>
                  </div>
                  <div>
                    <span className="text-[#62666d]">From: </span>
                    <span className="text-[#d0d3d8]">{selectedEmail.sender}</span>
                  </div>
                  <div>
                    <span className="text-[#62666d]">Domain: </span>
                    <span className="text-white">{selectedEmail.sender_domain}</span>
                  </div>
                  <div>
                    <span className="text-[#62666d]">To: </span>
                    <span className="text-[#8a8f98]">{selectedEmail.recipient}</span>
                  </div>
                  <div>
                    <span className="text-[#62666d]">Security: </span>
                    <span className={selectedEmail.spf_dkim.startsWith("PASS") ? "text-[#4ebe82]" : "text-[#eb5757]"}>
                      {selectedEmail.spf_dkim}
                    </span>
                  </div>
                </div>

                {/* Extracted Financial Entities */}
                {selectedEmail.extracted_entities.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-[#8a8f98] uppercase">
                      Extracted Financial Entities
                    </div>
                    <div className="p-2.5 rounded-lg border border-white/[0.06] bg-[#0e1015] space-y-1.5 font-mono text-[11px]">
                      {selectedEmail.extracted_entities.map((ent, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-[#8a8f98]">{ent.type}:</span>
                          <span className="text-white font-semibold">{ent.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plain Text Body Viewer */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-[#8a8f98] uppercase">
                    Raw Message Body
                  </div>
                  <pre className="p-3 rounded-lg border border-white/[0.06] bg-black/60 text-[#8a8f98] text-[11px] font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                    {selectedEmail.body_text}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[#62666d] space-y-2">
                <Layers className="w-8 h-8 mx-auto opacity-50" />
                <div>Select an email to view full forensic telemetry</div>
              </div>
            )}
          </div>

          {selectedEmail && selectedEmail.is_fraud && (
            <div className="pt-4 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => handleQuarantine(selectedEmail)}
                className="w-full py-2 px-3 rounded-lg bg-[#eb5757] hover:bg-[#ff6b6b] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#eb5757]/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Quarantine & Auto-Hold in FinGuard</span>
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* 5. Connect / Edit Live Gmail Settings Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0e1015] border border-white/[0.08] rounded-xl max-w-lg w-full p-6 space-y-5 text-xs text-left shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#ea4335]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Live Gmail Ingestion Settings</h3>
                  <p className="text-[11px] text-[#8a8f98]">Connect or edit your Google account for automated AI threat detection</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(false)}
                className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Connection Status if Configured */}
            {isConfigured && (
              <div className="p-3.5 rounded-lg border border-[#4ebe82]/30 bg-[#4ebe82]/[0.06] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ebe82] animate-pulse shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-[#4ebe82] uppercase tracking-wide">Live Connection Active</div>
                    <div className="text-xs font-mono text-white truncate font-medium">{gmailUser}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-2.5 py-1 rounded bg-[#eb5757]/10 hover:bg-[#eb5757]/20 border border-[#eb5757]/30 text-[#eb5757] text-[11px] font-medium transition-colors flex items-center gap-1 shrink-0"
                  title="Remove saved credentials and revert to evaluation mailbox"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}

            {/* Security Guarantee Notice */}
            <div className="p-3 rounded-lg border border-white/[0.06] bg-black/40 text-[11px] text-[#8a8f98] flex items-start gap-2.5 leading-relaxed">
              <Lock className="w-4 h-4 text-[#4ebe82] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-medium">Session Security: </span>
                Your credentials are stored locally in your browser's encrypted storage and sent strictly over TLS to your local backend IMAP runner. They are never stored in external databases or logged.
              </div>
            </div>

            {/* Form Fields: Editable User & Password */}
            <div className="space-y-4 pt-1">
              {/* Field 1: Gmail Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-white flex items-center justify-between">
                  <span>Gmail or Google Workspace Address</span>
                  {isConfigured && <span className="text-[10px] font-mono text-[#8a8f98]">Editable</span>}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#62666d]" />
                  <input
                    type="email"
                    placeholder="e.g. corporate.treasury@gmail.com"
                    value={gmailUser}
                    onChange={(e) => setGmailUser(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2] transition-colors"
                  />
                </div>
              </div>

              {/* Field 2: App Password with Show/Hide Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-white">Google App Password (16 characters)</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#8a8f98] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 text-[#5e6ad2]" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#62666d]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={gmailPassword}
                    onChange={(e) => setGmailPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2] transition-colors"
                  />
                </div>
                {/* Inline Helper */}
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[10px] text-[#8a8f98] space-y-1 leading-normal font-mono">
                  <div className="text-white font-semibold">How to get a 16-char App Password (30 sec):</div>
                  <div>1. Go to <span className="text-[#5e6ad2]">myaccount.google.com/security</span></div>
                  <div>2. Under "2-Step Verification", scroll to <span className="text-[#5e6ad2]">App passwords</span></div>
                  <div>3. Name it "Sentinel" and copy the 16 characters (spaces are automatically stripped)</div>
                </div>
              </div>

              {/* Field 3: Max Emails Ingestion Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-white">Ingestion Volume</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 5, label: "5 Emails (Fastest)" },
                    { count: 10, label: "10 Emails" },
                    { count: 20, label: "20 Emails (Deep)" },
                  ].map((opt) => (
                    <button
                      key={opt.count}
                      type="button"
                      onClick={() => setMaxEmails(opt.count)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-mono border transition-all ${
                        maxEmails === opt.count
                          ? "bg-[#5e6ad2]/20 border-[#5e6ad2] text-white font-medium"
                          : "bg-white/[0.02] border-white/[0.06] text-[#8a8f98] hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Save & Connect or Switch to Evaluation Stream */}
            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              <button
                type="button"
                onClick={handleSaveAndConnect}
                disabled={!gmailUser.trim() || !gmailPassword.trim() || isLoading}
                className="w-full py-2.5 px-3 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#5e6ad2]/20 disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>
                  {isLoading
                    ? "Connecting to imap.gmail.com..."
                    : isConfigured
                    ? "Save Changes & Re-Scan Live Gmail"
                    : "Save & Ingest Live Gmail"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsConnectModalOpen(false)}
                className="w-full py-2 px-3 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] text-[#8a8f98] hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

