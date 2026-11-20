"use client";

import { useState } from "react";
import { EvidenceItem } from "@/lib/dashboard-data";
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Download,
  ExternalLink,
  Eye,
  Sparkles,
  Lock,
  Plus,
  Loader2,
  CheckCircle2,
  FileCode,
  Tag,
  Hash,
  ZoomIn,
} from "lucide-react";
import { analyzeThreatEvidence } from "@/lib/apiClient";
import { updateEvidenceDoc } from "@/lib/firestoreService";

interface EvidenceWorkspaceProps {
  evidence: EvidenceItem | null;
  workspaceId: string;
  onOpenQuickCreate?: (tab?: "investigation" | "supplier" | "upload" | "entity") => void;
  onEvidenceUpdated?: (updated: EvidenceItem) => void;
}

export function EvidenceWorkspace({
  evidence,
  workspaceId,
  onOpenQuickCreate,
  onEvidenceUpdated,
}: EvidenceWorkspaceProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeZoom, setActiveZoom] = useState(false);

  if (!evidence) {
    return (
      <main className="flex-1 h-screen bg-[#08090a] flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#8a8f98]">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-white">No Evidence Selected</h2>
            <p className="text-xs text-[#8a8f98]">
              Select a file from the evidence vault or upload an invoice PDF / screenshot to commence multimodal analysis.
            </p>
          </div>
          {onOpenQuickCreate && (
            <button
              type="button"
              onClick={() => onOpenQuickCreate("upload")}
              className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          )}
        </div>
      </main>
    );
  }

  const isFlagged = evidence.status === "Flagged" || evidence.severity === "Critical";
  const isImage =
    evidence.type === "Screenshot" ||
    evidence.mimeType?.startsWith("image/") ||
    evidence.title.endsWith(".png") ||
    evidence.title.endsWith(".jpg") ||
    evidence.title.endsWith(".jpeg");

  const isPdf =
    evidence.type === "Invoice PDF" ||
    evidence.mimeType === "application/pdf" ||
    evidence.title.endsWith(".pdf");

  // Re-run ScamShield Live Analysis
  const handleLiveReanalyze = async () => {
    setIsAnalyzing(true);
    try {
      const sampleText = `${evidence.title} - ${evidence.threatSummary || "Urgent vendor wire transfer instruction"}`;
      const res = await analyzeThreatEvidence({
        content: sampleText,
        evidence_type: evidence.type,
        file_data: evidence.fileData,
        file_name: evidence.title,
        mime_type: evidence.mimeType || (isPdf ? "application/pdf" : "image/png"),
      });

      const updatedEvidence: EvidenceItem = {
        ...evidence,
        threatCategory: res.threat_category || evidence.threatCategory || "Invoice Diversion",
        severity: res.severity || evidence.severity || "Critical",
        threatSummary: res.summary || evidence.threatSummary,
        status: res.severity === "CRITICAL" || res.severity === "HIGH" ? "Flagged" : "Verified",
        urgencyTriggers: res.urgency_indicators?.length > 0 ? res.urgency_indicators : evidence.urgencyTriggers,
        coercionTactics: res.coercion_tactics?.length > 0 ? res.coercion_tactics : evidence.coercionTactics,
        extractedEntities:
          res.extracted_entities && res.extracted_entities.length > 0
            ? res.extracted_entities.map((e) => ({
                type: e.type,
                value: e.name,
                role: `Confidence: ${Math.round(e.confidence * 100)}%`,
              }))
            : evidence.extractedEntities,
      };

      await updateEvidenceDoc(workspaceId, updatedEvidence);
      if (onEvidenceUpdated) onEvidenceUpdated(updatedEvidence);
    } catch (err) {
      console.error("Live analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleStatus = async (newStatus: "Flagged" | "Verified" | "Extracted") => {
    const updated = { ...evidence, status: newStatus };
    await updateEvidenceDoc(workspaceId, updated);
    if (onEvidenceUpdated) onEvidenceUpdated(updated);
  };

  // Demo file source URLs
  const demoImageSrc = evidence.fileData || "/demo/Executive_Impersonation_Wire_Screenshot.png";
  const demoPdfSrc = evidence.fileData || "/demo/Urgent_Apex_Logistics_Invoice_INV-8891.pdf";

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-y-auto flex flex-col z-10 select-text transition-all duration-300">
      {/* Top Header Bar */}
      <div className="h-12 px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                isFlagged ? "bg-[#eb5757]" : "bg-[#4ebe82]"
              }`}
            />
            <span className="font-mono text-xs text-[#8a8f98] font-medium">
              {evidence.id}
            </span>
          </div>
          <span className="text-white/20">/</span>
          <span className="text-xs font-semibold text-white truncate max-w-md">
            {evidence.title}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${
              isFlagged
                ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                : "bg-[#4ebe82]/10 text-[#4ebe82] border border-[#4ebe82]/20"
            }`}
          >
            {evidence.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLiveReanalyze}
            disabled={isAnalyzing}
            className="px-2.5 py-1 rounded bg-[#5e6ad2] hover:bg-[#6f7be8] disabled:opacity-50 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm shadow-[#5e6ad2]/20"
          >
            {isAnalyzing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isAnalyzing ? "Analyzing Multimodal..." : "Re-Analyze with ScamShield"}</span>
          </button>

          {isFlagged ? (
            <button
              type="button"
              onClick={() => handleToggleStatus("Verified")}
              className="px-2.5 py-1 rounded border border-white/10 hover:border-white/20 text-[#8a8f98] hover:text-white text-xs transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
              <span>Mark Verified</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleToggleStatus("Flagged")}
              className="px-2.5 py-1 rounded border border-[#eb5757]/30 text-[#eb5757] hover:bg-[#eb5757]/10 text-xs transition-colors flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Flag Anomalous</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Analysis Body */}
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Threat Summary Banner */}
        {isFlagged && (
          <div className="p-4 rounded-xl border border-[#eb5757]/30 bg-[#eb5757]/[0.04] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#eb5757]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>SCAMSHIELD ADVISORY — CRITICAL THREAT DETECTED IN EVIDENCE</span>
            </div>
            <p className="text-xs text-[#d0d3d8] leading-relaxed">
              {evidence.threatSummary ||
                "This document exhibits high-confidence indicators of unauthorized payment coordinate substitution or executive coercion tactics. Enforce immediate verification before releasing capital."}
            </p>
          </div>
        )}

        {/* 2-Column Split: Document Visual Lab (Left) & ScamShield Forensics (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Document Container (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#8a8f98]" />
                  <span className="text-xs font-medium text-[#f7f8f8]">Document Preview</span>
                  <span className="text-[10px] font-mono text-[#8a8f98] bg-white/[0.04] px-1.5 py-0.5 rounded">
                    {evidence.fileSize} • {evidence.type}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isImage && (
                    <button
                      type="button"
                      onClick={() => setActiveZoom(!activeZoom)}
                      className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition-colors"
                      title="Toggle Zoom"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <a
                    href={isPdf ? demoPdfSrc : demoImageSrc}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Open File</span>
                  </a>
                </div>
              </div>

              {/* Document Rendering Frame */}
              <div className="p-4 bg-[#08090a] min-h-[420px] flex items-center justify-center">
                {isImage ? (
                  <div className={`relative transition-all duration-200 ${activeZoom ? "scale-110" : ""}`}>
                    <img
                      src={demoImageSrc}
                      alt={evidence.title}
                      className="max-h-[520px] w-auto rounded-lg border border-white/10 shadow-2xl object-contain mx-auto"
                    />
                  </div>
                ) : isPdf ? (
                  <div className="w-full space-y-4">
                    <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center text-[#5e6ad2]">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-white">{evidence.title}</div>
                        <div className="text-xs text-[#8a8f98] font-mono">
                          Portable Document Format (PDF) • {evidence.fileSize}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={demoPdfSrc}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View PDF Document in New Tab</span>
                        </a>
                      </div>
                    </div>

                    {/* Cryptographic Hash Proof */}
                    <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.01] space-y-1.5 font-mono text-[11px]">
                      <div className="text-[#8a8f98] text-[10px] uppercase tracking-wider">
                        Cryptographic Ingestion Stamp
                      </div>
                      <div className="text-[#62666d] flex items-center justify-between">
                        <span>SHA-256 Hash:</span>
                        <span className="text-[#d0d3d8]">9f8a2b...4e1c8d</span>
                      </div>
                      <div className="text-[#62666d] flex items-center justify-between">
                        <span>OCR Engine:</span>
                        <span className="text-[#4ebe82]">Gemini 2.5 Multimodal Parser (99.4% confidence)</span>
                      </div>
                      <div className="text-[#62666d] flex items-center justify-between">
                        <span>Associated Case:</span>
                        <span className="text-[#5e6ad2]">{evidence.associatedInvestigationId}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full font-mono text-xs text-[#d0d3d8] space-y-2 p-4 bg-white/[0.02] rounded-lg border border-white/[0.08]">
                    <div className="text-[10px] text-[#8a8f98] uppercase">Email Security Headers</div>
                    <div>From: David Vance &lt;ceo-office@apex-logistics-urgent.com&gt;</div>
                    <div>To: Accounts Payable &lt;finance@sentinel-defense.corp&gt;</div>
                    <div>Subject: URGENT: Port Release Wire Transfer Clearance</div>
                    <div>DKIM-Status: FAIL (Domain not aligned)</div>
                    <div>SPF-Status: SOFTFAIL (Origin IP 185.220.101.4 not authorized)</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: ScamShield AI Intelligence Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* AI Classification Card */}
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5e6ad2]" />
                  <span>ScamShield Intelligence</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                    evidence.severity === "Critical"
                      ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                      : "bg-[#4ebe82]/10 text-[#4ebe82] border border-[#4ebe82]/20"
                  }`}
                >
                  {evidence.severity || "Critical"} Severity
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Threat Category</div>
                <div className="text-xs font-medium text-white">
                  {evidence.threatCategory || "Invoice Diversion / Vendor Account Substitution"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Executive Analysis</div>
                <p className="text-xs text-[#8a8f98] leading-relaxed">
                  {evidence.threatSummary ||
                    "ScamShield multimodal triage detected unauthorized payee modification and high-pressure language patterns matching BEC playbook."}
                </p>
              </div>
            </div>

            {/* Urgency & Coercion Indicators */}
            {evidence.urgencyTriggers && evidence.urgencyTriggers.length > 0 && (
              <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-4 space-y-2.5">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#f0b96d]" />
                  <span>Psychological Urgency Triggers</span>
                </div>
                <div className="space-y-1.5">
                  {evidence.urgencyTriggers.map((trig, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1.5 rounded-lg border border-[#f0b96d]/20 bg-[#f0b96d]/[0.04] text-[11px] text-[#f0b96d] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f0b96d] shrink-0" />
                      <span>{trig}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {evidence.coercionTactics && evidence.coercionTactics.length > 0 && (
              <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-4 space-y-2.5">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#eb5757]" />
                  <span>Coercion Tactics Detected</span>
                </div>
                <div className="space-y-1.5">
                  {evidence.coercionTactics.map((tac, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1.5 rounded-lg border border-[#eb5757]/20 bg-[#eb5757]/[0.04] text-[11px] text-[#eb5757] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#eb5757] shrink-0" />
                      <span>{tac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Forensic Entities */}
            {evidence.extractedEntities && evidence.extractedEntities.length > 0 && (
              <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-4 space-y-2.5">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#5e6ad2]" />
                  <span>Extracted Forensic Coordinates</span>
                </div>
                <div className="space-y-1.5">
                  {evidence.extractedEntities.map((ent, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="text-[10px] text-[#8a8f98] font-mono">{ent.type}</div>
                        <div className="font-mono text-white text-[11px]">{ent.value}</div>
                      </div>
                      <span className="text-[10px] font-mono text-[#8a8f98] bg-white/[0.04] px-1.5 py-0.5 rounded">
                        {ent.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
