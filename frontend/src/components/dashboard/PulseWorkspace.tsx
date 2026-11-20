"use client";

import { useState } from "react";
import {
  InvestigationItem,
  SupplierItem,
  EvidenceItem,
  InvoiceItem,
} from "@/lib/dashboard-data";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Database,
  Radio,
  Server,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  GitFork,
  Building2,
  FileText,
  DollarSign,
} from "lucide-react";

interface PulseWorkspaceProps {
  investigations: InvestigationItem[];
  suppliers: SupplierItem[];
  evidenceList: EvidenceItem[];
  invoices: InvoiceItem[];
  onSelectView?: (view: string) => void;
}

export function PulseWorkspace({
  investigations,
  suppliers,
  evidenceList,
  invoices,
  onSelectView,
}: PulseWorkspaceProps) {
  const [pulseFilter, setPulseFilter] = useState<"all" | "alerts" | "engine">("all");

  const blockedCount = investigations.filter((i) => i.status === "Blocked" || i.riskLevel === "Critical").length;
  const supplierDiscrepancyCount = suppliers.filter((s) => s.status === "Discrepancy Detected").length;
  const invoiceHeldCount = invoices.filter((inv) => inv.status === "Payment Held" || inv.status === "Discrepancy").length;

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-y-auto flex flex-col z-10 select-text transition-all duration-300">
      {/* Top Header Bar */}
      <div className="h-12 px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ebe82] animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wide">
              Pulse Telemetry
            </span>
          </div>
          <span className="text-white/20">/</span>
          <span className="text-xs text-[#8a8f98] font-mono">
            Active Financial Defense Perimeter
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#4ebe82] bg-[#4ebe82]/10 border border-[#4ebe82]/20 px-2 py-0.5 rounded flex items-center gap-1.5">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>REAL-TIME SENSORS ONLINE</span>
          </span>
        </div>
      </div>

      {/* Main Pulse Grid */}
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Core Protection KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase flex items-center justify-between">
              <span>Capital Protected</span>
              <DollarSign className="w-3.5 h-3.5 text-[#4ebe82]" />
            </div>
            <div className="text-2xl font-semibold text-white font-mono">$485,000.00</div>
            <div className="text-[11px] text-[#4ebe82] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>0 Fraudulent Outflows Released</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase flex items-center justify-between">
              <span>Intercepted Wires</span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#eb5757]" />
            </div>
            <div className="text-2xl font-semibold text-white font-mono">
              {blockedCount + invoiceHeldCount}
            </div>
            <div className="text-[11px] text-[#eb5757]">
              <span>Payment holds enforced by FinGuard</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase flex items-center justify-between">
              <span>FinGuard Latency</span>
              <Cpu className="w-3.5 h-3.5 text-[#5e6ad2]" />
            </div>
            <div className="text-2xl font-semibold text-white font-mono">0.2ms</div>
            <div className="text-[11px] text-[#8a8f98]">
              <span>Deterministic zero-hallucination engine</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase flex items-center justify-between">
              <span>Registered Suppliers</span>
              <Building2 className="w-3.5 h-3.5 text-[#8a8f98]" />
            </div>
            <div className="text-2xl font-semibold text-white font-mono">
              {suppliers.length}
            </div>
            <div className="text-[11px] text-[#8a8f98]">
              <span>{supplierDiscrepancyCount} under forensic review</span>
            </div>
          </div>
        </div>

        {/* Sentinel Subsystems Perimeter Grid */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#8a8f98]" />
              <span className="text-xs font-semibold text-white">Sentinel Perimeter Subsystems</span>
            </div>
            <span className="text-[10px] font-mono text-[#4ebe82] bg-white/[0.04] px-2 py-0.5 rounded">
              ALL SERVICES NOMINAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
                  <span>FinGuard Bank Verification Mesh</span>
                </div>
                <div className="text-[11px] text-[#8a8f98]">
                  RBI IFSC registry loaded (142,000+ branch records active)
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#4ebe82] bg-[#4ebe82]/10 px-2 py-0.5 rounded">
                100% OK
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
                  <span>ScamShield Multimodal Vision</span>
                </div>
                <div className="text-[11px] text-[#8a8f98]">
                  Gemini 2.5 Flash API active with prompt injection guardrails
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#4ebe82] bg-[#4ebe82]/10 px-2 py-0.5 rounded">
                CONNECTED
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
                  <span>TrustGraph Topology Engine</span>
                </div>
                <div className="text-[11px] text-[#8a8f98]">
                  Graph correlation engine tracking multi-incident infrastructure
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#4ebe82] bg-[#4ebe82]/10 px-2 py-0.5 rounded">
                SYNCHRONIZED
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
                  <span>Cloud Firestore Reactive Stream</span>
                </div>
                <div className="text-[11px] text-[#8a8f98]">
                  Real-time encrypted mesh listeners for instant UI state propagation
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#4ebe82] bg-[#4ebe82]/10 px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Live Forensic Threat Stream */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#8a8f98]" />
              <span className="text-xs font-semibold text-white">Live Threat Detection Stream</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setPulseFilter("all")}
                className={`px-2 py-0.5 rounded ${pulseFilter === "all" ? "bg-white/[0.08] text-white" : "text-[#8a8f98]"}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPulseFilter("alerts")}
                className={`px-2 py-0.5 rounded ${pulseFilter === "alerts" ? "bg-white/[0.08] text-white" : "text-[#8a8f98]"}`}
              >
                Discrepancies
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      inv.status === "Payment Held" || inv.status === "Discrepancy"
                        ? "bg-[#eb5757]"
                        : "bg-[#4ebe82]"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-medium text-white flex items-center gap-2">
                      <span className="font-mono text-[#5e6ad2]">{inv.id}</span>
                      <span>{inv.vendorName}</span>
                    </div>
                    <div className="text-[11px] text-[#8a8f98]">
                      {inv.discrepancyNote || "Cleared for automated settlement disbursement."}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-medium text-white">{inv.amount}</div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      inv.status === "Payment Held" || inv.status === "Discrepancy"
                        ? "text-[#eb5757] bg-[#eb5757]/10"
                        : "text-[#4ebe82] bg-[#4ebe82]/10"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

