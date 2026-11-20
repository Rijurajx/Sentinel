"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Inbox,
  GitFork,
  ShieldCheck,
  Mail,
  Search,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  CreditCard,
  ShieldAlert,
  Terminal,
  RefreshCw,
  Copy,
  Check,
  CheckCheck,
} from "lucide-react";

type ActiveTab = "graph" | "finguard" | "gmail" | "inbox" | "pulse";

export function HeroInterfaceMock() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("graph");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-acme-mule");
  const [graphFilter, setGraphFilter] = useState<string>("all");
  const [finguardStatus, setFinguardStatus] = useState<"pending" | "blocked" | "approved">("pending");
  const [quarantinedEmails, setQuarantinedEmails] = useState<Set<string>>(new Set());
  const [selectedGmailId, setSelectedGmailId] = useState<string>("gmail-1");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  // Mock Graph Nodes
  const nodes = [
    {
      id: "node-apex-safe",
      name: "Apex Logistics International",
      category: "supplier",
      risk: "Safe",
      role: "Verified Beneficiary",
      account: "918273645102",
      ifsc: "HDFC0000060",
      branch: "Scheduled Commercial Branch",
      volume: "$1,450,000.00",
    },
    {
      id: "node-acme-mule",
      name: "Acme Industrial Urgent Diversions",
      category: "supplier",
      risk: "Critical",
      role: "⚠️ Payment Diversion Attempt",
      account: "998877665544",
      ifsc: "SBIN0000456",
      branch: "Unverified Clearing Branch",
      volume: "$485,000.00 (Held)",
    },
    {
      id: "node-inv-8891",
      name: "INV-8891 ($485,000.00)",
      category: "invoice",
      risk: "Critical",
      role: "🚨 Payment Held (Routing Mismatch)",
      account: "998877665544",
      ifsc: "SBIN0000456",
      branch: "State Bank of India",
      volume: "Due in 4 Hours",
    },
    {
      id: "node-cluster-crimson",
      name: "Crimson Typhoon / TC-948",
      category: "threat_actor",
      risk: "Critical",
      role: "Active BEC Crime Cluster",
      account: "Linked 4 Target Accounts",
      ifsc: "Multi-Hop Clearing",
      branch: "Scattered Spider Sub-Cluster",
      volume: "$4,200,000.00 Observed",
    },
  ];

  const filteredNodes = nodes.filter((n) => {
    if (graphFilter === "all") return true;
    return n.category === graphFilter;
  });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];

  // Mock Emails for Gmail Radar Tab
  const emails = [
    {
      id: "gmail-1",
      sender: "cfo-treasury@apex-logistics-urgent.net",
      senderName: "David Sterling (Apex Logistics CFO)",
      subject: "URGENT: Revised Wire Instructions for $485,000 Order #INV-8891",
      snippet: "Due to ongoing fiscal year-end regulatory audits, please remit invoice #INV-8891 immediately to our secondary treasury account...",
      date: "Today, 11:42 AM",
      isFraud: true,
      classification: "FRAUDULENT / BEC ATTACK",
      severity: "CRITICAL",
      confidence: 0.94,
      account: "998877665544",
      ifsc: "SBIN0000456",
      triggers: ["Statutory audit coercion", "Immediate wire reroute", "4-hour deadline", "Altered bank destination"],
      spfDkim: "FAIL (Lookalike domain registered 3 days ago)",
    },
    {
      id: "gmail-2",
      sender: "billing@acme-industrial.com",
      senderName: "Acme Industrial Technologies Ltd",
      subject: "Monthly Maintenance & Retainer Statement #INV-2026-092",
      snippet: "Attached please find our regular monthly billing statement for the current service period. Standard Net-30 payment terms apply...",
      date: "Today, 09:15 AM",
      isFraud: false,
      classification: "VERIFIED LEGITIMATE",
      severity: "LOW",
      confidence: 0.98,
      account: "556677889900",
      ifsc: "HDFC0001234",
      triggers: [],
      spfDkim: "PASS (Domain cryptographic dkim=pass)",
    },
  ];

  const selectedEmail = emails.find((e) => e.id === selectedGmailId) || emails[0];

  return (
    <section id="interactive-demo" className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-24">
      {/* Outer macOS Window Frame */}
      <div className="relative rounded-xl border border-white/[0.08] bg-[#0c0d11] shadow-[0_24px_70px_-15px_rgba(0,0,0,0.95),inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden">
        {/* Window Chrome Titlebar */}
        <div className="h-11 px-4 border-b border-white/[0.08] bg-[#08090a] flex items-center justify-between text-xs select-none">
          {/* Traffic Lights + Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#8a8f98]">
              <span className="text-white font-medium">sentinel-defense</span>
              <span className="text-white/30">/</span>
              <span className="text-[#d0d3d8]">workspace-alpha</span>
            </div>
          </div>

          {/* Search Hint / Quick Command Input */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[#8a8f98] text-[11px] font-mono">
            <Search className="w-3 h-3 text-[#62666d]" />
            <span>Search coordinates, IFSC, or vendors...</span>
            <kbd className="px-1.5 py-0.2 rounded border border-white/10 bg-white/[0.03] text-[9px] text-white/50">
              ⌘K
            </kbd>
          </div>

          {/* Interactive Badge */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#5e6ad2] bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] animate-pulse" />
            <span>Live Interactive Replica</span>
          </div>
        </div>

        {/* Inner App Workspace Grid */}
        <div className="flex h-[520px] overflow-hidden">
          {/* 1. App Primary Sidebar */}
          <aside className="w-48 sm:w-56 border-r border-white/[0.08] bg-[#08090a] flex flex-col justify-between p-3 select-none shrink-0">
            <div className="space-y-4">
              {/* Workspace Badge */}
              <div className="flex items-center justify-between px-2 py-1 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-4 h-4 rounded bg-[#5e6ad2]/20 border border-[#5e6ad2]/30 flex items-center justify-center font-mono text-[9px] text-[#5e6ad2] font-bold">
                    S
                  </div>
                  <span className="text-xs font-semibold text-white truncate">Sentinel Treasury</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
              </div>

              {/* Navigation Items */}
              <div className="space-y-0.5 text-xs font-medium">
                <div className="text-[10px] font-mono text-[#62666d] px-2 py-1 uppercase tracking-wider">
                  Modules
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("graph")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left ${
                    activeTab === "graph"
                      ? "bg-white/[0.08] text-white"
                      : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <GitFork className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    <span className="truncate">TrustGraph</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8a8f98]">6</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("finguard")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left ${
                    activeTab === "finguard"
                      ? "bg-white/[0.08] text-white"
                      : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#eb5757]" />
                    <span className="truncate">FinGuard Reviews</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#eb5757] bg-[#eb5757]/10 px-1.5 rounded">
                    1 Held
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("gmail")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left ${
                    activeTab === "gmail"
                      ? "bg-white/[0.08] text-white"
                      : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-[#ea4335]" />
                    <span className="truncate">Gmail Radar</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#f0b96d] bg-[#f0b96d]/10 px-1.5 rounded">
                    Live
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("inbox")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left ${
                    activeTab === "inbox"
                      ? "bg-white/[0.08] text-white"
                      : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Inbox className="w-3.5 h-3.5 text-[#8a8f98]" />
                    <span className="truncate">Alert Feed</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8a8f98]">2</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("pulse")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left ${
                    activeTab === "pulse"
                      ? "bg-white/[0.08] text-white"
                      : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Activity className="w-3.5 h-3.5 text-[#4ebe82]" />
                    <span className="truncate">Pulse Telemetry</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
                </button>
              </div>
            </div>

            {/* Bottom Status Tag */}
            <div className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[11px] font-mono space-y-1">
              <div className="text-[#62666d] text-[10px]">VERIFICATION ENGINE</div>
              <div className="text-white font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
                <span>Deterministic Mode</span>
              </div>
            </div>
          </aside>

          {/* 2. Main Content Area */}
          <main className="flex-1 flex flex-col bg-[#08090a] overflow-hidden">
            {/* View 1: TrustGraph Tab */}
            {activeTab === "graph" && (
              <div className="flex-1 flex overflow-hidden">
                {/* Graph Center Pane */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Sub-header Filter Strip */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
                    <div>
                      <div className="font-semibold text-white uppercase text-[11px] tracking-wider">
                        Relational Provenance Map
                      </div>
                      <div className="text-[11px] text-[#8a8f98]">
                        Click any coordinate to inspect historical routing & syndicate linkages.
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[
                        { id: "all", label: "All" },
                        { id: "supplier", label: "Suppliers" },
                        { id: "invoice", label: "Invoices" },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setGraphFilter(f.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                            graphFilter === f.id
                              ? "bg-white/[0.08] text-white"
                              : "text-[#8a8f98] hover:text-white"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2-Column Responsive Card Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {filteredNodes.map((n) => {
                      const isSelected = selectedNode.id === n.id;
                      const isCrit = n.risk === "Critical";

                      return (
                        <div
                          key={n.id}
                          onClick={() => setSelectedNodeId(n.id)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-2.5 ${
                            isSelected
                              ? "bg-[#5e6ad2]/[0.08] border-[#5e6ad2] ring-1 ring-[#5e6ad2]/40"
                              : "bg-[#0e1015] border-white/[0.06] hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono text-[#8a8f98] uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/[0.04]">
                              {n.category}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                isCrit
                                  ? "bg-[#eb5757]/10 text-[#eb5757] border-[#eb5757]/20"
                                  : "bg-[#4ebe82]/10 text-[#4ebe82] border-[#4ebe82]/20"
                              }`}
                            >
                              {n.risk}
                            </span>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-white truncate">{n.name}</div>
                            <div
                              className={`text-[11px] font-mono truncate ${
                                isCrit ? "text-[#eb5757]" : "text-[#4ebe82]"
                              }`}
                            >
                              {n.role}
                            </div>
                          </div>

                          <div className="p-2 rounded bg-black/40 border border-white/[0.04] text-[10px] font-mono space-y-1 text-[#8a8f98]">
                            <div className="flex justify-between">
                              <span className="text-[#62666d]">Account:</span>
                              <span className="text-white truncate max-w-[120px]">{n.account}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#62666d]">Routing/IFSC:</span>
                              <span className="text-white">{n.ifsc}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Edges Strip */}
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="text-[10px] font-mono text-[#8a8f98] uppercase mb-2">
                      Active Traversal Edges
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono">
                      <div className="p-2 rounded bg-[#0e1015] border border-white/[0.06] flex items-center justify-between">
                        <span className="text-white">Acme Industrial Urgent Diversions</span>
                        <span className="text-[#62666d]">→</span>
                        <span className="text-[#8a8f98]">INV-8891 ($485,000.00)</span>
                        <span className="text-[10px] text-[#eb5757] bg-[#eb5757]/10 px-1.5 py-0.5 rounded">
                          ISSUES_INVOICE
                        </span>
                      </div>
                      <div className="p-2 rounded bg-[#0e1015] border border-white/[0.06] flex items-center justify-between">
                        <span className="text-white">INV-8891</span>
                        <span className="text-[#62666d]">→</span>
                        <span className="text-[#8a8f98]">Crimson Typhoon / TC-948</span>
                        <span className="text-[10px] text-[#eb5757] bg-[#eb5757]/10 px-1.5 py-0.5 rounded">
                          CO_OCCURS_MULE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Entity Inspector */}
                <aside className="w-64 sm:w-72 border-l border-white/[0.08] bg-[#0c0d10] p-4 space-y-4 overflow-y-auto shrink-0 text-xs">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="font-semibold text-white uppercase text-[10px] tracking-wider">
                      Entity Inspector
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        selectedNode.risk === "Critical"
                          ? "bg-[#eb5757]/15 text-[#eb5757] border-[#eb5757]/30"
                          : "bg-[#4ebe82]/15 text-[#4ebe82] border-[#4ebe82]/30"
                      }`}
                    >
                      {selectedNode.risk}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Selected Node</div>
                    <div className="text-sm font-semibold text-white break-words">{selectedNode.name}</div>
                    <div className="text-[11px] font-mono text-[#5e6ad2]">{selectedNode.role}</div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-white/[0.06] bg-black/40 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#62666d]">Account:</span>
                      <span className="text-white">{selectedNode.account}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#62666d]">Routing Code:</span>
                      <span className="text-white">{selectedNode.ifsc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#62666d]">Branch:</span>
                      <span className="text-white truncate max-w-[120px]">{selectedNode.branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#62666d]">Exposure:</span>
                      <span className="text-white">{selectedNode.volume}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => alert(`Coordinate ${selectedNode.name} added to FinGuard automated blocklist.`)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-[#eb5757]/10 hover:bg-[#eb5757]/20 text-[#eb5757] text-xs font-medium border border-[#eb5757]/30 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Block in FinGuard Gateway</span>
                    </button>
                  </div>
                </aside>
              </div>
            )}

            {/* View 2: FinGuard Tab */}
            {activeTab === "finguard" && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Dual-Authorization Disbursement Review</h3>
                    <p className="text-xs text-[#8a8f98]">Deterministic bank verification comparison against Master Vendor Profile</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20">
                    Routing Discrepancy Detected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Verified Master Profile */}
                  <div className="p-4 rounded-xl border border-[#4ebe82]/30 bg-[#4ebe82]/[0.03] space-y-2.5">
                    <div className="flex items-center justify-between text-[#4ebe82] text-[10px] uppercase font-bold">
                      <span>✓ Verified Corporate Master Ledger</span>
                      <span>Ground Truth</span>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-[#8a8f98]">
                      <div>Vendor: <span className="text-white font-medium">Acme Industrial Technologies Ltd</span></div>
                      <div>Bank Account: <span className="text-white font-medium">556677889900</span></div>
                      <div>IFSC Code: <span className="text-white font-medium">HDFC0001234 (HDFC Bandra West)</span></div>
                      <div>Status: <span className="text-[#4ebe82]">Verified Beneficiary</span></div>
                    </div>
                  </div>

                  {/* Altered Invoice Request */}
                  <div className="p-4 rounded-xl border border-[#eb5757]/30 bg-[#eb5757]/[0.03] space-y-2.5">
                    <div className="flex items-center justify-between text-[#eb5757] text-[10px] uppercase font-bold">
                      <span>⚠️ Invoice #INV-8891 Request</span>
                      <span>Mismatch</span>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-[#8a8f98]">
                      <div>Payee Name: <span className="text-white font-medium">Acme Industrial Urgent Diversions</span></div>
                      <div>Bank Account: <span className="text-[#eb5757] font-bold">998877665544 (Altered!)</span></div>
                      <div>IFSC Code: <span className="text-[#eb5757] font-bold">SBIN0000456 (SBI Connaught Place)</span></div>
                      <div>Disbursement: <span className="text-white font-medium">$485,000.00 USD</span></div>
                    </div>
                  </div>
                </div>

                {/* Remediation Actions */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0c0d10] flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-white">Automated Protection Gate</div>
                    <div className="text-[11px] text-[#8a8f98]">
                      {finguardStatus === "blocked"
                        ? "Disbursement blocked. Mule account locked across all treasury gateways."
                        : "FinGuard has suspended wire clearance until out-of-band callback confirmation."}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setFinguardStatus("blocked")}
                      className="px-3 py-1.5 rounded-lg bg-[#eb5757] hover:bg-[#ff6b6b] text-white text-xs font-medium transition-colors"
                    >
                      {finguardStatus === "blocked" ? "Disbursement Blocked ✓" : "Reject & Freeze Account"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Gmail Radar Tab */}
            {activeTab === "gmail" && (
              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs">
                    <div className="font-semibold text-white text-[11px] uppercase tracking-wider">
                      Live Inbound Email Radar
                    </div>
                    <div className="text-[10px] font-mono text-[#5e6ad2]">Gemini 2.0 Flash Reasoning</div>
                  </div>

                  {emails.map((em) => {
                    const isQuarantined = quarantinedEmails.has(em.id);
                    const isSelected = selectedGmailId === em.id;

                    return (
                      <div
                        key={em.id}
                        onClick={() => setSelectedGmailId(em.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? "bg-[#5e6ad2]/[0.08] border-[#5e6ad2]"
                            : "bg-[#0e1015] border-white/[0.06] hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white truncate max-w-[240px]">
                            {em.senderName}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              em.isFraud
                                ? "bg-[#eb5757]/10 text-[#eb5757] border-[#eb5757]/20"
                                : "bg-[#4ebe82]/10 text-[#4ebe82] border-[#4ebe82]/20"
                            }`}
                          >
                            {em.classification}
                          </span>
                        </div>

                        <div className="text-xs text-[#d0d3d8] font-medium">{em.subject}</div>
                        <p className="text-[11px] text-[#8a8f98] line-clamp-1">{em.snippet}</p>

                        <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] font-mono text-[#8a8f98]">
                          <span>SPF/DKIM: {em.spfDkim.slice(0, 15)}...</span>
                          {em.isFraud && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuarantinedEmails((prev) => new Set(prev).add(em.id));
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                                isQuarantined
                                  ? "bg-[#4ebe82]/20 text-[#4ebe82] border border-[#4ebe82]/30"
                                  : "bg-[#eb5757] text-white hover:bg-[#ff6b6b]"
                              }`}
                            >
                              {isQuarantined ? "Quarantined in FinGuard ✓" : "Quarantine & Hold"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right RFC822 Side Panel */}
                <aside className="w-64 sm:w-72 border-l border-white/[0.08] bg-[#0c0d10] p-4 space-y-3.5 overflow-y-auto shrink-0 text-xs font-mono">
                  <div className="text-[10px] text-[#8a8f98] uppercase font-bold border-b border-white/[0.06] pb-2">
                    RFC822 Threat Breakdown
                  </div>
                  <div>
                    <div className="text-[#62666d] text-[10px]">Verdict Summary:</div>
                    <div className="text-white text-[11px] mt-0.5 font-sans leading-normal">
                      {selectedEmail.isFraud
                        ? "High-confidence BEC wire reroute. Threat actor creates urgency around statutory audit to divert disbursement to an unverified State Bank of India account."
                        : "Verified legitimate supplier statement matching historical billing coordinates."}
                    </div>
                  </div>

                  {selectedEmail.triggers.length > 0 && (
                    <div>
                      <div className="text-[#62666d] text-[10px] mb-1">Urgency Indicators:</div>
                      <div className="space-y-1">
                        {selectedEmail.triggers.map((t, idx) => (
                          <div key={idx} className="p-1 rounded bg-[#eb5757]/10 text-[#eb5757] text-[10px]">
                            • {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 rounded bg-black/40 border border-white/[0.06] space-y-1 text-[10px]">
                    <div className="text-[#62666d]">Target Beneficiary:</div>
                    <div className="text-white">{selectedEmail.account}</div>
                    <div className="text-[#62666d]">Routing Code:</div>
                    <div className="text-white">{selectedEmail.ifsc}</div>
                  </div>
                </aside>
              </div>
            )}

            {/* View 4: Inbox Tab */}
            {activeTab === "inbox" && (
              <div className="flex-1 p-5 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs">
                  <h3 className="font-semibold text-white">Treasury Alert Queue</h3>
                  <span className="text-[10px] font-mono text-[#8a8f98]">2 Action Items</span>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0e1015] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">ALRT-914: Wire Diversion on Order #INV-8891</span>
                    <span className="text-[10px] font-mono text-[#eb5757] bg-[#eb5757]/10 px-2 py-0.5 rounded">Critical</span>
                  </div>
                  <p className="text-xs text-[#8a8f98]">
                    Inbound email from cfo-treasury@apex-logistics-urgent.net attempting to re-route $485,000 disbursement.
                  </p>
                  <div className="text-[10px] font-mono text-[#5e6ad2]">FinGuard auto-hold placed on disbursement gateway.</div>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0e1015] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">ALRT-802: Lookalike Domain Registration Detected</span>
                    <span className="text-[10px] font-mono text-[#f0b96d] bg-[#f0b96d]/10 px-2 py-0.5 rounded">High</span>
                  </div>
                  <p className="text-xs text-[#8a8f98]">
                    Domain apex-logistics-urgent.net registered 3 days ago. Linked to TC-948 BEC crime cluster in TrustGraph.
                  </p>
                </div>
              </div>
            )}

            {/* View 5: Pulse Tab */}
            {activeTab === "pulse" && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <div className="border-b border-white/[0.06] pb-3">
                  <h3 className="text-sm font-semibold text-white">Active Defense Perimeter Telemetry</h3>
                  <p className="text-xs text-[#8a8f98]">Deterministic system health, throughput, and verification latencies</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0e1015]">
                    <div className="text-[10px] text-[#62666d]">PREVENTED OUTFLOW</div>
                    <div className="text-lg font-bold text-white mt-1">$485,000.00</div>
                    <div className="text-[10px] text-[#4ebe82]">Zero Loss</div>
                  </div>
                  <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0e1015]">
                    <div className="text-[10px] text-[#62666d]">FINGUARD LATENCY</div>
                    <div className="text-lg font-bold text-white mt-1">0.18 ms</div>
                    <div className="text-[10px] text-[#5e6ad2]">Deterministic</div>
                  </div>
                  <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0e1015]">
                    <div className="text-[10px] text-[#62666d]">TRUSTGRAPH MESH</div>
                    <div className="text-lg font-bold text-white mt-1">6 Nodes</div>
                    <div className="text-[10px] text-[#4ebe82]">100% Provenance</div>
                  </div>
                  <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0e1015]">
                    <div className="text-[10px] text-[#62666d]">AI REASONING</div>
                    <div className="text-lg font-bold text-white mt-1">Gemini 2.0</div>
                    <div className="text-[10px] text-[#5e6ad2]">Multimodal</div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Interactive Bottom Bar */}
        <div className="h-10 px-4 border-t border-white/[0.08] bg-[#08090a] flex items-center justify-between text-xs text-[#8a8f98]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
            <span className="text-[11px] font-mono">Click sidebar modules & cards to test real-time state transitions</span>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-white hover:text-[#5e6ad2] transition-colors font-medium"
          >
            <span>Launch Full Sentinel Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
