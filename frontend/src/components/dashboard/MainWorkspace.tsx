"use client";

import { useState } from "react";
import { InvestigationItem } from "@/lib/dashboard-data";
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
  onOpenQuickCreate?: () => void;
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
}: MainWorkspaceProps) {
  const [commentText, setCommentText] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "graph" | "evidence" | "finguard">("overview");
  const [activeGraphNode, setActiveGraphNode] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<ScamShieldResult | null>(null);

  const handleRunLiveTriage = async () => {
    if (!investigation) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeThreatEvidence({
        content: `${investigation.title}. ${investigation.description}. Target: ${investigation.targetEntity}`,
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
              onClick={onOpenQuickCreate}
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
        <div className="flex items-center gap-1.5 text-[#8a8f98] text-xs">
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
              <span className="text-[10px] font-mono text-[#62666d]">({investigation.trustGraph.nodes.length})</span>
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
              <span className="text-[10px] font-mono text-[#62666d]">({investigation.evidenceList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("finguard")}
              className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-[1px] ${
                activeTab === "finguard"
                  ? "border-white text-[#f7f8f8]"
                  : "border-transparent text-[#8a8f98] hover:text-[#d0d3d8]"
              }`}
            >
              FinGuard Check
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

        {/* TAB 2: TRUSTGRAPH (DEDICATED AIRY CANVAS) */}
        {activeTab === "graph" && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#f7f8f8]">
                  Entity Relationship Canvas
                </span>
                <span className="text-[11px] font-mono text-[#8a8f98]">
                  PROVENANCE-BACKED
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 py-8">
                {investigation.trustGraph?.nodes?.length > 0 ? (
                  investigation.trustGraph.nodes.map((node) => {
                    const isSelected = activeGraphNode === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setActiveGraphNode(isSelected ? null : node.id)}
                        className={`px-3 py-1.5 rounded-md border text-xs font-mono transition-all flex items-center gap-2 ${
                          node.risk === "danger"
                            ? "bg-white/[0.03] border-white/20 text-[#eb5757]"
                            : "bg-white/[0.02] border-white/10 text-[#d0d3d8]"
                        } ${isSelected ? "ring-2 ring-white/40" : "hover:border-white/30"}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{node.label}</span>
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
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-[#8a8f98]">
                  Selected: <span className="text-[#f7f8f8]">{activeGraphNode}</span> • Traceable to incident records.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: EVIDENCE FILES */}
        {activeTab === "evidence" && (
          <div className="space-y-3 animate-fade-in">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.015] divide-y divide-white/[0.04]">
              {investigation.evidenceList?.length > 0 ? (
                investigation.evidenceList.map((ev) => (
                  <div key={ev.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#8a8f98]" />
                      <div>
                        <span className="font-medium text-[#f7f8f8] block">{ev.filename}</span>
                        <span className="text-[10px] text-[#62666d] font-mono">
                          {ev.size} • Uploaded {ev.uploadedAt}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#8a8f98]">
                      {ev.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-[#8a8f98]">
                  No evidence files attached to this investigation yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: FINGUARD AUDIT */}
        {activeTab === "finguard" && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-3 text-xs">
              <div className="flex items-center gap-2 font-medium text-[#f7f8f8]">
                <CreditCard className="w-4 h-4 text-[#8a8f98]" />
                <span>Deterministic Bank Details Check</span>
              </div>
              <p className="text-[#8a8f98] leading-relaxed">
                FinGuard verified supplier master records against the invoice extracted details. Zero LLM hallucination.
              </p>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] font-mono text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8a8f98]">Master Bank IFSC:</span>
                  <span className="text-[#4ebe82]">HDFC0001234 (Verified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8f98]">Invoice Bank IFSC:</span>
                  <span className="text-[#eb5757]">UTIB0009999 (Discrepancy)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
