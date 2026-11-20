"use client";

import { useState } from "react";
import { InboxAlertItem } from "@/lib/dashboard-data";
import {
  Bell,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Lock,
  ArrowRight,
  Code2,
  Clock,
  ExternalLink,
  Plus,
  Loader2,
  Zap,
} from "lucide-react";
import { updateInboxAlertDoc } from "@/lib/firestoreService";

interface InboxWorkspaceProps {
  alert: InboxAlertItem | null;
  workspaceId: string;
  onConvertToInvestigation?: (alert: InboxAlertItem) => void;
  onAlertUpdated?: (updated: InboxAlertItem) => void;
}

export function InboxWorkspace({
  alert,
  workspaceId,
  onConvertToInvestigation,
  onAlertUpdated,
}: InboxWorkspaceProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!alert) {
    return (
      <main className="flex-1 h-screen bg-[#08090a] flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#8a8f98]">
            <Bell className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-white">No Notification Selected</h2>
            <p className="text-xs text-[#8a8f98]">
              Select an alert from your security feed on the left to triage incoming perimeter anomalies.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const isCritical = alert.severity === "Critical" || alert.severity === "High";

  const handleDismiss = async () => {
    const updated: InboxAlertItem = {
      ...alert,
      status: "Dismissed",
    };
    await updateInboxAlertDoc(workspaceId, updated);
    if (onAlertUpdated) onAlertUpdated(updated);
  };

  const handleInvestigate = () => {
    if (onConvertToInvestigation) {
      onConvertToInvestigation(alert);
    }
  };

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-y-auto flex flex-col z-10 select-text transition-all duration-300">
      {/* Top Header Bar */}
      <div className="h-12 px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                isCritical ? "bg-[#eb5757]" : "bg-[#5e6ad2]"
              }`}
            />
            <span className="font-mono text-xs text-[#8a8f98] font-medium">
              {alert.id}
            </span>
          </div>
          <span className="text-white/20">/</span>
          <span className="text-xs font-semibold text-white truncate max-w-md">
            {alert.title}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium shrink-0 ${
              isCritical
                ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                : "bg-white/[0.04] text-[#8a8f98]"
            }`}
          >
            {alert.source}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInvestigate}
            className="px-2.5 py-1 rounded bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm shadow-[#5e6ad2]/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Convert to Investigation</span>
          </button>

          {alert.status !== "Dismissed" && (
            <button
              type="button"
              onClick={handleDismiss}
              className="px-2.5 py-1 rounded border border-white/10 hover:border-white/20 text-[#8a8f98] hover:text-white text-xs transition-colors"
            >
              Mark Handled
            </button>
          )}
        </div>
      </div>

      {/* Main Alert Body */}
      <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* Severity Banner */}
        <div
          className={`p-4 rounded-xl border space-y-2 ${
            isCritical
              ? "border-[#eb5757]/30 bg-[#eb5757]/[0.04]"
              : "border-white/[0.08] bg-white/[0.02]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#eb5757]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>PERIMETER ALERT: {alert.source.toUpperCase()} INTERCEPT</span>
            </div>
            <span className="text-[10px] font-mono text-[#8a8f98]">{alert.timestamp}</span>
          </div>
          <p className="text-xs text-[#d0d3d8] leading-relaxed">
            {alert.summary}
          </p>
        </div>

        {/* Quick Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Target Entity</div>
            <div className="text-xs font-medium text-white truncate">{alert.affectedEntity}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Exposure Amount</div>
            <div className="text-xs font-mono font-medium text-[#eb5757]">
              {alert.amount || "N/A (Telemetry Feed)"}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Current Triage Status</div>
            <div className="text-xs font-medium text-[#f0b96d]">{alert.status}</div>
          </div>
        </div>

        {/* Actionable Playbook Recommendation */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <CheckCircle2 className="w-4 h-4 text-[#4ebe82]" />
            <span>Recommended Response Playbook</span>
          </div>
          <div className="p-3 rounded-lg border border-[#4ebe82]/20 bg-[#4ebe82]/[0.03] text-xs text-[#d0d3d8] leading-relaxed">
            {alert.recommendedAction}
          </div>
        </div>

        {/* Raw Ingestion Payload Inspector */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#8a8f98]" />
              <span className="text-xs font-medium text-white">Ingestion Raw Event Telemetry</span>
            </div>
            <span className="text-[10px] font-mono text-[#8a8f98]">JSON PAYLOAD</span>
          </div>
          <pre className="p-4 bg-[#08090a] font-mono text-[11px] text-[#4ebe82] overflow-x-auto leading-relaxed">
            {JSON.stringify(JSON.parse(alert.payloadSnippet || "{}"), null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
