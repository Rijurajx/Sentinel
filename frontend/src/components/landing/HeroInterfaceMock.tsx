"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  GitFork,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { SentinelLogo } from "@/components/ui/SentinelLogo";

export function HeroInterfaceMock() {
  const [selectedIncident, setSelectedIncident] = useState<number | null>(0);

  const incidents = [
    {
      id: "AST-104",
      title: "Mismatched payee bank routing detected (IFSC DEMO0002222 != DEMO0001111)",
      category: "FinGuard",
      categoryColor: "text-[#eb5757] bg-[#eb5757]/10 border-[#eb5757]/20",
      status: "Payment Blocked",
      statusColor: "text-[#eb5757]",
      amount: "$485,000.00",
      target: "Asterion Supplies",
      date: "2m ago",
      priority: "Urgent",
      priorityIcon: AlertTriangle,
      priorityColor: "text-[#eb5757]",
      details:
        "FinGuard zero-LLM comparison identified that the invoice payee account differs from the verified supplier registry. Automatic disbursement suspended.",
    },
    {
      id: "AST-103",
      title: "Sender domain asterion-supplies-billing.com matched historical campaign",
      category: "TrustGraph",
      categoryColor: "text-[#5e6ad2] bg-[#5e6ad2]/10 border-[#5e6ad2]/20",
      status: "Correlated (2 Incidents)",
      statusColor: "text-[#f0b96d]",
      amount: "Flagged Lead",
      target: "Incident #104",
      date: "5m ago",
      priority: "High",
      priorityIcon: GitFork,
      priorityColor: "text-[#f0b96d]",
      details:
        "The domain used on the invoice was observed in a 2023 phishing campaign. Traceable provenance edge recorded in graph store.",
    },
    {
      id: "AST-102",
      title: "Contact telephone +91 98765 43210 linked to past vendor compromise",
      category: "TrustGraph",
      categoryColor: "text-[#5e6ad2] bg-[#5e6ad2]/10 border-[#5e6ad2]/20",
      status: "Linked Evidence",
      statusColor: "text-[#f0b96d]",
      amount: "Entity Trace",
      target: "Incident #089",
      date: "12m ago",
      priority: "Medium",
      priorityIcon: AlertCircle,
      priorityColor: "text-[#f0b96d]",
      details:
        "Exact phone number match against stored normalized entity database. Provenance ID: EV-2023-089-PH.",
    },
    {
      id: "AST-101",
      title: "Invoice #INV-2024-8842 parsed via Gemini Multimodal Extraction",
      category: "ScamShield",
      categoryColor: "text-[#5ed6c0] bg-[#5ed6c0]/10 border-[#5ed6c0]/20",
      status: "Complete",
      statusColor: "text-[#4ebe82]",
      amount: "$485,000.00",
      target: "Asterion Tech",
      date: "15m ago",
      priority: "Normal",
      priorityIcon: CheckCircle2,
      priorityColor: "text-[#4ebe82]",
      details:
        "Structured entities, line items, and psychological urgency cues extracted with 98.4% model confidence score.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 mb-24">
      {/* Linear Framed Window Container */}
      <div className="relative rounded-xl border border-white/[0.08] bg-[#0c0d11] shadow-[0_24px_70px_-15px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden">
        {/* Window Top Navigation / Breadcrumbs Bar */}
        <div className="h-12 px-4 border-b border-white/[0.08] bg-[#090a0d] flex items-center justify-between text-xs text-[#8a8f98]">
          {/* Breadcrumb Left */}
          <div className="flex items-center gap-2">
            <SentinelLogo className="w-3.5 h-3.5 text-white" />
            <span className="text-[#f7f8f8] font-medium">Investigate</span>
            <span>/</span>
            <span>Active Incidents</span>
            <span>/</span>
            <span className="text-[#d0d3d8] font-mono text-[11px] bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
              CASE-AST-8842
            </span>
          </div>

          {/* Quick Filter & Command Bar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[#8a8f98] text-[11px]">
              <Search className="w-3 h-3" />
              <span>Search incidents, entities, IFSC...</span>
              <span className="linear-kbd ml-2">⌘K</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#8a8f98]">
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Filter</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#8a8f98]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Display</span>
            </div>
          </div>
        </div>

        {/* Linear Issue-List Style Table */}
        <div className="divide-y divide-white/[0.05] text-xs">
          {incidents.map((incident, idx) => {
            const PriorityIcon = incident.priorityIcon;
            const isSelected = selectedIncident === idx;
            return (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(idx)}
                className={`px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isSelected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Left: Priority, ID, Title */}
                <div className="flex items-start md:items-center gap-3 min-w-0 flex-1">
                  <div className="mt-0.5 md:mt-0">
                    <PriorityIcon className={`w-3.5 h-3.5 ${incident.priorityColor}`} />
                  </div>

                  <span className="font-mono text-[11px] text-[#8a8f98] shrink-0">
                    {incident.id}
                  </span>

                  <span className="text-[#f7f8f8] font-medium truncate">
                    {incident.title}
                  </span>
                </div>

                {/* Right: Module Pill, Status, Target, Amount */}
                <div className="flex items-center gap-3 text-[11px] shrink-0 font-mono text-[#8a8f98]">
                  <span className={`px-2 py-0.5 rounded border text-[10px] ${incident.categoryColor}`}>
                    {incident.category}
                  </span>

                  <span className={incident.statusColor}>
                    {incident.status}
                  </span>

                  <span className="hidden lg:inline text-[#d0d3d8]">
                    {incident.amount}
                  </span>

                  <span className="hidden sm:inline text-[#62666d]">
                    {incident.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Incident Drawer / Preview Panel */}
        {selectedIncident !== null && (
          <div className="p-5 border-t border-white/[0.08] bg-[#090a0d] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#5e6ad2] font-mono font-medium">
                  {incidents[selectedIncident].id} TELEMETRY:
                </span>
                <span className="text-[#f7f8f8] font-medium">
                  {incidents[selectedIncident].title}
                </span>
              </div>
              <p className="text-[#8a8f98] text-[11px] leading-relaxed max-w-3xl">
                {incidents[selectedIncident].details}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="linear-kbd">Space</span>
              <span className="text-[#8a8f98] text-[11px]">to inspect evidence</span>
            </div>
          </div>
        )}

        {/* Window Bottom Bar (Linear Shortcuts & Controls) */}
        <div className="h-9 px-4 border-t border-white/[0.06] bg-[#08090a] flex items-center justify-between text-[11px] text-[#62666d]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="linear-kbd">C</span>
              <span>New investigation</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="linear-kbd">G</span>
              <span className="linear-kbd">I</span>
              <span>Open TrustGraph</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="linear-kbd">G</span>
              <span className="linear-kbd">F</span>
              <span>Open FinGuard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82]" />
            <span className="text-[#8a8f98] font-mono text-[10px]">ALL VERIFICATION ENGINES SYNCED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
