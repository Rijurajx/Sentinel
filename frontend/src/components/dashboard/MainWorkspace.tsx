"use client";

import { useState, useMemo, useEffect } from "react";
import {
  InvestigationItem,
  SupplierItem,
  EvidenceItem,
  EntityItem,
} from "@/lib/dashboard-data";
import { SentinelLogo } from "@/components/ui/SentinelLogo";
import {
  Star,
  MoreHorizontal,
  Link as LinkIcon,
  Bell,
  Sparkles,
  GitFork,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
  ArrowUp,
  ExternalLink,
  ShieldAlert,
  PanelLeftOpen,
  CreditCard,
  Building2,
  Plus,
  Scan,
  Database,
  Loader2,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { analyzeThreatEvidence, ScamShieldResult } from "@/lib/apiClient";

interface MainWorkspaceProps {
  investigation?: InvestigationItem | null;
  workspaceName?: string;
  isMiddleCollapsed: boolean;
  onRestoreMiddlePane: () => void;
  onAddComment: (comment: string) => void;
  onToggleStar?: () => void;
  isStarred?: boolean;
  onLoadDemoTelemetry?: () => void;
  onOpenQuickCreate?: (tab?: "investigation" | "supplier" | "invoice" | "upload" | "entity") => void;
  suppliers?: SupplierItem[];
  evidenceList?: EvidenceItem[];
  entities?: EntityItem[];
  initialTab?: "overview" | "graph" | "evidence" | "finguard";
}

export function MainWorkspace({
  investigation,
  workspaceName = "Sentinel Workspace",
  isMiddleCollapsed,
  onRestoreMiddlePane,
  onAddComment,
  onToggleStar,
  isStarred = false,
  onLoadDemoTelemetry,
  onOpenQuickCreate,
  suppliers = [],
  evidenceList = [],
  entities = [],
  initialTab,
}: MainWorkspaceProps) {
  const [commentText, setCommentText] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "graph" | "evidence" | "finguard">(
    initialTab || "overview"
  );

  // Sync activeTab if initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [activeGraphNode, setActiveGraphNode] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<ScamShieldResult | null>(null);

  // Dynamically compute the unified threat graph from real workspace entities
  const computedGraphNodes = useMemo(() => {
    if (!investigation) return [];
    const nodes: Array<{
      id: string;
      label: string;
      type: string;
      risk: "danger" | "warning" | "safe";
      roleBadge: string;
      details: string;
    }> = [
      {
        id: investigation.id,
        label: `${investigation.id} — ${investigation.title}`,
        type: "incident",
        risk: investigation.riskLevel === "Critical" ? "danger" : "warning",
        roleBadge: "Incident Core",
        details: `Target: ${investigation.targetEntity} • Exposure: ${investigation.amount} • Status: ${investigation.status}`,
      },
    ];

    // Add Suppliers
    suppliers.forEach((s) => {
      const isMule = s.status === "Discrepancy Detected" || s.riskLevel === "Critical";
      nodes.push({
        id: s.id,
        label: s.name,
        type: isMule ? "mule_account" : "supplier",
        risk: isMule ? "danger" : "safe",
        roleBadge: isMule ? "⚠️ Payment Diversion Attempt" : "✓ Verified Beneficiary",
        details: `Account: ${s.accountNumber} • IFSC: ${s.ifsc} • Bank Branch: ${s.bankBranch}`,
      });
    });

    // Add Evidence
    evidenceList.forEach((e) => {
      nodes.push({
        id: e.id,
        label: e.title,
        type: "evidence",
        risk: e.status === "Flagged" ? "danger" : "warning",
        roleBadge: e.status === "Flagged" ? "🚨 Flagged Threat Vector" : "Evidence Document",
        details: `Type: ${e.type} • Size: ${e.fileSize} • Status: ${e.status}`,
      });
    });

    // Add Entities
    entities.forEach((ent) => {
      nodes.push({
        id: ent.id,
        label: ent.value,
        type: ent.type,
        risk: ent.riskLevel === "Critical" ? "danger" : ent.riskLevel === "High" ? "warning" : "safe",
        roleBadge: `Entity (${ent.type})`,
        details: `Risk: ${ent.riskLevel} • ${ent.incidentCount} incidents observed`,
      });
    });

    return nodes;
  }, [investigation, suppliers, evidenceList, entities]);

  const handleRunLiveTriage = async () => {
    if (!investigation) return;
    setIsAnalyzing(true);
    try {
      const supplierContext = suppliers.length > 0
        ? `Registered Suppliers: ${suppliers.map((s) => `${s.name} (Account: ${s.accountNumber}, IFSC: ${s.ifsc}, Status: ${s.status}, Risk: ${s.riskLevel})`).join("; ")}.`
        : "";
      const evidenceContext = evidenceList.length > 0
        ? `Attached Evidence Files: ${evidenceList.map((e) => `${e.title} [Status: ${e.status}]`).join("; ")}.`
        : "";

      const res = await analyzeThreatEvidence({
        content: `${investigation.title}. ${investigation.description}. Target: ${investigation.targetEntity}. Exposure: ${investigation.amount}. ${supplierContext} ${evidenceContext}`,
        evidence_type: "email",
      });
      setLiveAnalysis(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText("");
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Blank Workspace State
  if (!investigation) {
    return (
      <main className="flex-1 h-screen bg-[#08090a] overflow-y-auto flex flex-col items-center justify-center p-8 select-none">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <SentinelLogo className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-medium tracking-tight text-[#f7f8f8]">
              Welcome to {workspaceName}
            </h2>
            <p className="text-xs text-[#8a8f98] leading-relaxed">
              Your financial defense perimeter is live. This workspace is currently blank and ready for investigation data.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2 text-left">
            <button
              type="button"
              onClick={() => onOpenQuickCreate?.()}
              className="p-3.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-[#5e6ad2]" />
                <div>
                  <div className="text-xs font-medium text-[#f7f8f8]">Create New Case</div>
                  <div className="text-[10px] text-[#8a8f98]">Initialize an investigation record manually</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#8a8f98] group-hover:text-white">C</span>
            </button>

            {onLoadDemoTelemetry && (
              <button
                type="button"
                onClick={onLoadDemoTelemetry}
                className="p-3.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-[#4ebe82]" />
                  <div>
                    <div className="text-xs font-medium text-[#f7f8f8]">Load Asterion Demo Telemetry</div>
                    <div className="text-[10px] text-[#8a8f98]">Pre-seed phishing invoice, IFSC mismatch & TrustGraph</div>
                  </div>
                </div>
                <span className="text-[11px] text-[#4ebe82] font-mono">1-Click</span>
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-y-auto flex flex-col z-10 select-text transition-all duration-300">
      {/* Top Header Bar (Linear Reference Layout) */}
      <div className="h-12 px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20">
        {/* Left: Status Icon + ID + Title Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {isMiddleCollapsed && (
            <button
              type="button"
              onClick={onRestoreMiddlePane}
              title="Expand list panel"
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.06] transition-colors mr-1 shrink-0"
            >
              <PanelLeftOpen className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {investigation.riskLevel === "Critical" ? (
              <span className="w-2 h-2 rounded-full bg-[#eb5757]" />
            ) : investigation.riskLevel === "High" ? (
              <span className="w-2 h-2 rounded-full bg-[#f0b96d]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#4ebe82]" />
            )}
            <span className="font-mono text-xs text-[#8a8f98] font-medium">
              {investigation.id}
            </span>
          </div>

          <span className="text-xs text-[#f7f8f8] truncate max-w-sm font-medium">
            {investigation.title}
          </span>

          <button
            type="button"
            onClick={onToggleStar}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
              isStarred ? "text-[#f0b96d]" : "text-[#62666d] hover:text-[#8a8f98]"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-[#f0b96d]" : ""}`} />
          </button>

          <button
            type="button"
            className="w-6 h-6 rounded flex items-center justify-center text-[#62666d] hover:text-[#8a8f98] transition-colors"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Action Icons (Linear Reference) */}
        <div className="flex items-center gap-2 text-[#8a8f98] text-xs">
          {onOpenQuickCreate && (
            <button
              type="button"
              onClick={() => onOpenQuickCreate()}
              className="px-2.5 py-1 rounded-md bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm shadow-[#5e6ad2]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Record</span>
              <span className="text-[10px] opacity-75 font-mono ml-0.5">C</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            title={copiedLink ? "Copied!" : "Copy link"}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            {copiedLink ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
            ) : (
              <LinkIcon className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            title="Subscribe to alerts"
            className="w-7 h-7 rounded-md flex items-center justify-center hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area — Calm, Airy, Breathing Room */}
      <div className="max-w-3xl w-full mx-auto px-6 py-10 space-y-8 flex-1">
        {/* Title & Natural Description (Exact Linear Visual Density) */}
        <div className="space-y-3">
          <h1 className="text-2xl font-medium text-[#f7f8f8] tracking-tight">
            {investigation.title}
          </h1>
          <p className="text-sm text-[#8a8f98] leading-relaxed">
            {investigation.description}
          </p>

          {/* Minimalist Tabs: Quiet Segmented Switcher for Calm Navigation */}
          <div className="flex items-center gap-1 pt-3 border-b border-white/[0.06] text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-[1px] ${
                activeTab === "overview"
                  ? "border-white text-[#f7f8f8]"
                  : "border-transparent text-[#8a8f98] hover:text-[#d0d3d8]"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("graph")}
              className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-[1px] flex items-center gap-1.5 ${
                activeTab === "graph"
                  ? "border-white text-[#f7f8f8]"
                  : "border-transparent text-[#8a8f98] hover:text-[#d0d3d8]"
              }`}
            >
              <span>TrustGraph</span>
              <span className="text-[10px] font-mono text-[#62666d]">({computedGraphNodes.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("evidence")}
              className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-[1px] flex items-center gap-1.5 ${
                activeTab === "evidence"
                  ? "border-white text-[#f7f8f8]"
                  : "border-transparent text-[#8a8f98] hover:text-[#d0d3d8]"
              }`}
            >
              <span>Evidence</span>
              <span className="text-[10px] font-mono text-[#62666d]">({evidenceList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("finguard")}
              className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-[1px] flex items-center gap-1.5 ${
                activeTab === "finguard"
                  ? "border-white text-[#f7f8f8]"
                  : "border-transparent text-[#8a8f98] hover:text-[#d0d3d8]"
              }`}
            >
              <span>FinGuard Check</span>
              <span className="text-[10px] font-mono text-[#62666d]">({suppliers.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW — EXACT CALM LINEAR INTERFACE */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* The Signature Quiet "Triage Intelligence" Card */}
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.015] p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-[#f7f8f8]">
                  <Sparkles className="w-3.5 h-3.5 text-[#5e6ad2]" />
                  <span>Triage Intelligence</span>
                </div>
                <button
                  type="button"
                  onClick={handleRunLiveTriage}
                  disabled={isAnalyzing}
                  className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-[#8a8f98] hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-[#5e6ad2]" />
                      <span>Analyzing with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-[#5e6ad2]" />
                      <span>Run Live AI Triage</span>
                    </>
                  )}
                </button>
              </div>

              {/* Suggestions Row */}
              <div className="flex items-start sm:items-center gap-4 text-xs">
                <span className="w-20 text-[#8a8f98] text-[11px] shrink-0">Suggestions</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.05] text-[#d0d3d8] text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]" />
                    <span>{liveAnalysis ? liveAnalysis.model_used : "Gemini Flash"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.05] text-[#d0d3d8] text-[11px]">
                    <span>{liveAnalysis ? liveAnalysis.threat_category : "BEC Anomaly"}</span>
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] ${
                    liveAnalysis?.severity === "CRITICAL"
                      ? "bg-[#eb5757]/10 text-[#eb5757]"
                      : "bg-[#f0b96d]/10 text-[#f0b96d]"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{liveAnalysis ? `${liveAnalysis.severity} Severity` : "Risk Alert ✓"}</span>
                  </span>
                </div>
              </div>

              {liveAnalysis && (
                <div className="text-[11px] text-[#8a8f98] bg-white/[0.02] p-2.5 rounded border border-white/[0.06] space-y-1.5">
                  <div className="text-white font-medium">{liveAnalysis.summary}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#62666d]">Triggers:</span>
                    <span className="text-[#d0d3d8]">{liveAnalysis.urgency_indicators.join(", ") || "None"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#62666d]">Remediation:</span>
                    <span className="text-[#82c9a7]">{liveAnalysis.recommended_action}</span>
                  </div>
                </div>
              )}

              {/* Duplicate / Correlation Row */}
              {investigation.intelligence.relatedIncidentId && (
                <div className="flex items-start sm:items-center gap-4 text-xs">
                  <span className="w-20 text-[#8a8f98] text-[11px] shrink-0">Duplicate</span>
                  <div className="flex items-center gap-2 text-[11px] text-[#8a8f98]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f0b96d]" />
                    <span className="font-mono text-[#f7f8f8]">{investigation.intelligence.relatedIncidentId}</span>
                    <span className="truncate">{investigation.intelligence.relatedIncidentTitle}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Linear Activity Timeline (Clean, Spacious, Muted) */}
            <div className="space-y-4 pt-2">
              <div className="text-xs font-medium text-[#f7f8f8]">Activity</div>
              <div className="space-y-3.5 text-xs text-[#8a8f98]">
                {investigation.activity?.length > 0 ? (
                  investigation.activity.map((act) => (
                    <div key={act.id} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[#d0d3d8]">{act.actor}</span>
                        <span className="truncate">{act.action}</span>
                        <span className="text-[#62666d] text-[11px] shrink-0">· {act.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#62666d]">No recorded activity yet.</div>
                )}
              </div>
            </div>

            {/* Comments List (If Any) */}
            {investigation.comments.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                <div className="text-xs font-medium text-[#f7f8f8]">Comments</div>
                <div className="space-y-3">
                  {investigation.comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-[#f7f8f8]">{c.author}</span>
                        <span className="text-[#62666d]">{c.time}</span>
                      </div>
                      <p className="text-[#8a8f98] leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leave a Comment Box (Exact Linear Bottom Input) */}
            <form onSubmit={handleSubmitComment} className="pt-2">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 focus-within:border-white/20 transition-colors">
                <textarea
                  rows={2}
                  placeholder="Leave a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#f7f8f8] placeholder-[#62666d] resize-none focus:outline-none"
                />
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[#8a8f98]">
                  <button
                    type="button"
                    className="w-6 h-6 rounded flex items-center justify-center hover:text-white transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="w-6 h-6 rounded-full bg-white/[0.08] hover:bg-white text-white hover:text-black flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-white/[0.08] disabled:hover:text-white"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: TRUSTGRAPH (DEDICATED DYNAMIC CANVAS) */}
        {activeTab === "graph" && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#f7f8f8]">
                    Dynamic Forensic Entity Network
                  </span>
                  <p className="text-[11px] text-[#8a8f98] mt-0.5">
                    Real-time cross-correlation of registered beneficiaries, diversion attempts, and evidence
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#8a8f98] bg-white/[0.04] px-2 py-0.5 rounded">
                  {computedGraphNodes.length} NODES CORRELATED
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 py-8 min-h-[160px] border border-white/[0.04] rounded-lg bg-black/20 p-4">
                {computedGraphNodes.length > 0 ? (
                  computedGraphNodes.map((node) => {
                    const isSelected = activeGraphNode === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setActiveGraphNode(isSelected ? null : node.id)}
                        className={`px-3 py-2 rounded-lg border text-xs font-mono transition-all flex flex-col items-start gap-1 text-left ${
                          node.risk === "danger"
                            ? "bg-[#eb5757]/10 border-[#eb5757]/30 text-[#eb5757] hover:border-[#eb5757]"
                            : node.risk === "warning"
                            ? "bg-[#f0b96d]/10 border-[#f0b96d]/30 text-[#f0b96d] hover:border-[#f0b96d]"
                            : "bg-[#4ebe82]/10 border-[#4ebe82]/30 text-[#4ebe82] hover:border-[#4ebe82]"
                        } ${isSelected ? "ring-2 ring-white" : ""}`}
                      >
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-current" />
                          <span className="text-white text-xs">{node.label}</span>
                        </div>
                        <span className="text-[10px] opacity-80">{node.roleBadge}</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-[#8a8f98]">
                    No entities correlated to this incident yet. Use Quick Create to track entities.
                  </div>
                )}
              </div>

              {activeGraphNode && (
                (() => {
                  const node = computedGraphNodes.find((n) => n.id === activeGraphNode);
                  if (!node) return null;
                  return (
                    <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs space-y-1 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{node.label}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            node.risk === "danger"
                              ? "bg-[#eb5757]/20 text-[#eb5757]"
                              : node.risk === "warning"
                              ? "bg-[#f0b96d]/20 text-[#f0b96d]"
                              : "bg-[#4ebe82]/20 text-[#4ebe82]"
                          }`}
                        >
                          {node.roleBadge}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#8a8f98]">{node.details}</div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EVIDENCE FILES */}
        {activeTab === "evidence" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#f7f8f8]">
                  Multimodal Evidence Repository
                </span>
                <p className="text-[11px] text-[#8a8f98]">
                  Ingested invoice PDFs, payment screenshots, and email telemetry analyzed by ScamShield
                </p>
              </div>
              {onOpenQuickCreate && (
                <button
                  type="button"
                  onClick={() => onOpenQuickCreate("upload")}
                  className="px-2.5 py-1 rounded bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload File / PDF</span>
                </button>
              )}
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.015] divide-y divide-white/[0.04]">
              {evidenceList.length > 0 ? (
                evidenceList.map((ev) => (
                  <div key={ev.id} className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        {ev.fileData && ev.fileData.startsWith("data:image") ? (
                          <img
                            src={ev.fileData}
                            alt="preview"
                            className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                            {ev.type === "Invoice PDF" ? (
                              <FileText className="w-5 h-5 text-[#f0b96d]" />
                            ) : ev.type === "Screenshot" ? (
                              <Scan className="w-5 h-5 text-[#5e6ad2]" />
                            ) : (
                              <FileText className="w-5 h-5 text-[#8a8f98]" />
                            )}
                          </div>
                        )}
                        <div className="truncate">
                          <span className="font-medium text-[#f7f8f8] block truncate">{ev.title}</span>
                          <span className="text-[11px] text-[#8a8f98] font-mono">
                            {ev.type} • {ev.fileSize} • Uploaded {ev.uploadedAt}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                          ev.status === "Flagged"
                            ? "bg-[#eb5757]/15 text-[#eb5757] border border-[#eb5757]/30"
                            : "bg-[#4ebe82]/15 text-[#4ebe82] border border-[#4ebe82]/30"
                        }`}
                      >
                        {ev.status === "Flagged" ? "🚨 THREAT FLAGGED" : "✓ EXTRACTED & CLEAN"}
                      </span>
                    </div>

                    {ev.threatSummary && (
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.06] text-[11px] text-[#8a8f98] font-mono flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-medium">ScamShield Intel: </span>
                          <span>{ev.threatSummary}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-10 text-center space-y-3 text-xs text-[#8a8f98]">
                  <UploadCloud className="w-8 h-8 text-[#62666d] mx-auto" />
                  <div className="space-y-1">
                    <div className="font-medium text-white">No evidence files attached yet</div>
                    <div className="text-[11px]">Upload invoice PDFs, screenshots, or email text to initiate multimodal AI scanning.</div>
                  </div>
                  {onOpenQuickCreate && (
                    <button
                      type="button"
                      onClick={() => onOpenQuickCreate("upload")}
                      className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Evidence File</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: FINGUARD AUDIT */}
        {activeTab === "finguard" && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium text-[#f7f8f8]">
                  <CreditCard className="w-4 h-4 text-[#5e6ad2]" />
                  <span>Deterministic FinGuard Supplier Master Verification</span>
                </div>
                <span className="text-[10px] font-mono text-[#4ebe82] bg-[#4ebe82]/10 px-2 py-0.5 rounded">
                  Deterministic v2.4-strict (Zero LLM Hallucination)
                </span>
              </div>
              <p className="text-[#8a8f98] leading-relaxed">
                FinGuard verifies registered suppliers against RBI clearing databases & ISO IBAN checksums to catch unauthorized payment diversion attempts before treasury settlement.
              </p>

              {suppliers.length > 0 ? (
                <div className="space-y-3">
                  {suppliers.map((s) => {
                    const isMule = s.status === "Discrepancy Detected" || s.riskLevel === "Critical";
                    return (
                      <div
                        key={s.id}
                        className={`p-3.5 rounded-lg border font-mono text-xs space-y-2 ${
                          isMule
                            ? "bg-[#eb5757]/05 border-[#eb5757]/30 text-[#f7f8f8]"
                            : "bg-white/[0.02] border-white/[0.08] text-[#f7f8f8]"
                        }`}
                      >
                        <div className="flex items-center justify-between font-sans">
                          <div className="flex items-center gap-2">
                            <Building2 className={`w-4 h-4 ${isMule ? "text-[#eb5757]" : "text-[#4ebe82]"}`} />
                            <span className="font-semibold text-white">{s.name}</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              isMule ? "bg-[#eb5757]/20 text-[#eb5757]" : "bg-[#4ebe82]/20 text-[#4ebe82]"
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8a8f98] pt-1 border-t border-white/[0.04]">
                          <div>
                            Account: <span className="text-white">{s.accountNumber}</span>
                          </div>
                          <div>
                            IFSC / Routing: <span className={isMule ? "text-[#eb5757]" : "text-[#4ebe82]"}>{s.ifsc}</span>
                          </div>
                          <div>
                            Branch: <span className="text-white">{s.bankBranch}</span>
                          </div>
                          <div>
                            Total Invoiced: <span className="text-white">{s.totalInvoiced}</span>
                          </div>
                        </div>

                        {isMule && (
                          <div className="p-2 rounded bg-[#eb5757]/15 border border-[#eb5757]/30 text-[11px] text-[#eb5757] flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>🚨 HIGH RISK DIVERSION ALERT: Unauthorized routing discrepancy. Dual-authorization payment freeze recommended.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#8a8f98]">
                  No suppliers registered in this workspace yet. Add suppliers using the "+ Add Supplier" button.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
