"use client";

import { useState } from "react";
import { DossierItem } from "@/lib/dashboard-data";
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  Printer,
  Download,
  Share2,
  ExternalLink,
  Lock,
  GitFork,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
} from "lucide-react";
import { updateDossierDoc } from "@/lib/firestoreService";

interface DossierWorkspaceProps {
  dossier: DossierItem | null;
  workspaceId: string;
  onDossierUpdated?: (updated: DossierItem) => void;
}

export function DossierWorkspace({
  dossier,
  workspaceId,
  onDossierUpdated,
}: DossierWorkspaceProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!dossier) {
    return (
      <main className="flex-1 h-screen bg-[#08090a] flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#8a8f98]">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-white">No Intelligence Dossier Selected</h2>
            <p className="text-xs text-[#8a8f98]">
              Select an executive threat intelligence dossier from the repository on the left.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-y-auto flex flex-col z-10 select-text transition-all duration-300 print:bg-white print:text-black">
      {/* Top Header Bar */}
      <div className="h-12 px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20 print:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#5e6ad2]" />
            <span className="font-mono text-xs text-[#8a8f98] font-medium">
              {dossier.id}
            </span>
          </div>
          <span className="text-white/20">/</span>
          <span className="text-xs font-semibold text-white truncate max-w-md">
            {dossier.title}
          </span>
          <span className="text-[10px] font-mono text-[#f0b96d] bg-[#f0b96d]/10 border border-[#f0b96d]/20 px-2 py-0.5 rounded shrink-0">
            {dossier.classification}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-2.5 py-1 rounded border border-white/10 hover:border-white/20 text-[#8a8f98] hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print</span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-2.5 py-1 rounded bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? "Link Copied!" : "Share Dossier"}</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Document */}
      <div className="p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Dossier Header Title Block */}
        <div className="border-b border-white/[0.08] pb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#8a8f98] tracking-widest uppercase">
              Sentinel Unified Threat Intelligence Dossier
            </span>
            <span className="font-mono text-[10px] text-[#8a8f98]">
              Docket: {dossier.associatedIncidentId} • Generated: {dossier.generatedDate}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-white leading-tight">
            {dossier.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-[#8a8f98]">
            <span>Syndicate Cluster: <strong className="text-white">{dossier.targetSyndicate}</strong></span>
            <span>•</span>
            <span>Classification: <strong className="text-[#f0b96d]">{dossier.classification}</strong></span>
          </div>
        </div>

        {/* Executive Threat Score & Financial Impact Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Consolidated Threat Score</div>
            <div className="text-2xl font-bold font-mono text-[#eb5757]">
              {dossier.threatScore} / 100
            </div>
            <div className="text-[11px] text-[#eb5757]">Critical Syndicate Risk</div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Capital Protected / Loss Prevented</div>
            <div className="text-2xl font-bold font-mono text-[#4ebe82]">
              {dossier.preventedLoss}
            </div>
            <div className="text-[11px] text-[#4ebe82]">Zero Outflow Realized</div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Correlated Entities Tracked</div>
            <div className="text-2xl font-bold font-mono text-[#5e6ad2]">
              {dossier.provenanceEntitiesCount} Coordinates
            </div>
            <div className="text-[11px] text-[#8a8f98]">Cross-incident topology</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#5e6ad2]" />
            <span>1. Executive Summary & Attack Timeline</span>
          </div>
          <p className="text-xs text-[#d0d3d8] leading-relaxed">
            {dossier.executiveSummary}
          </p>
        </div>

        {/* Syndicate Infrastructure Provenance */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <GitFork className="w-4 h-4 text-[#4ebe82]" />
            <span>2. Cross-Incident Provenance & Entity Correlation</span>
          </div>
          <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-2 text-xs">
            <div className="text-[#8a8f98]">
              Sentinel TrustGraph deterministic traversal linked this attempt with active infrastructure observed across 2 previous vendor impersonations within the last 6 months.
            </div>
            <div className="font-mono text-[11px] text-[#8a8f98] space-y-1 pt-1">
              <div>• Destination Mule Account: 998877665544 (Flagged across FinGuard mesh)</div>
              <div>• Clearing Routing Code: FAKEX009999 (Non-conforming checksum)</div>
              <div>• Ingress Channel: Lookalike Domain apex-logistics-urgent.com</div>
            </div>
          </div>
        </div>

        {/* Actionable Remediation & Law Enforcement Checklist */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4 text-[#f0b96d]" />
            <span>3. Remediation Directives & Regulatory Filings</span>
          </div>
          <div className="space-y-2">
            {dossier.actionableRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] flex items-center gap-3 text-xs text-[#d0d3d8]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#4ebe82] shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
