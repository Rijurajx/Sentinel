"use client";

import { useState } from "react";
import {
  InvestigationItem,
  SupplierItem,
  EvidenceItem,
  EntityItem,
} from "@/lib/dashboard-data";
import {
  Search,
  CheckCircle2,
  PanelLeftClose,
  Building2,
  FileText,
  GitFork,
  Circle,
  Clock,
} from "lucide-react";

interface ContextualMiddlePaneProps {
  activeView: string;
  investigations: InvestigationItem[];
  suppliers: SupplierItem[];
  evidenceList: EvidenceItem[];
  entities: EntityItem[];
  selectedInvestigationId: string;
  onSelectInvestigation: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenQuickCreate?: () => void;
}

export function ContextualMiddlePane({
  activeView,
  investigations,
  suppliers,
  evidenceList,
  entities,
  selectedInvestigationId,
  onSelectInvestigation,
  isCollapsed,
  onToggleCollapse,
  onOpenQuickCreate,
}: ContextualMiddlePaneProps) {
  const [filterTab, setFilterTab] = useState<"all" | "unreviewed" | "snoozed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (isCollapsed) {
    return null;
  }

  // Determine Title based on activeView
  const getTitle = () => {
    switch (activeView) {
      case "inbox":
        return "Inbox";
      case "investigations":
        return "My issues";
      case "command":
        return "Pulse Telemetry";
      case "evidence":
        return "Evidence Vault";
      case "graph":
        return "TrustGraph";
      case "suppliers":
        return "Suppliers";
      case "invoices":
        return "Invoices";
      case "scamshield":
        return "ScamShield Ingestion";
      case "reports":
        return "Dossiers";
      case "finguard":
        return "Reviews";
      default:
        return "Inbox";
    }
  };

  // Filter investigations cleanly
  const filteredInvestigations = investigations.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetEntity.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === "unreviewed") return item.status === "Under Review" || item.status === "Blocked";
    if (filterTab === "snoozed") return item.status === "Monitoring";
    return true;
  });

  return (
    <section className="w-80 sm:w-88 h-screen bg-[#08090a] border-r border-white/[0.08] flex flex-col shrink-0 select-none z-20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* Top Header & Search Bar (Linear Reference Exact Layout) */}
      <div className="p-3 border-b border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-[#f7f8f8]">{getTitle()}</h2>
            <span className="text-[10px] font-mono text-[#8a8f98] bg-white/[0.04] px-1.5 py-0.2 rounded">
              {activeView === "suppliers"
                ? suppliers.length
                : activeView === "evidence"
                ? evidenceList.length
                : activeView === "graph"
                ? entities.length
                : filteredInvestigations.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            title="Collapse panel"
            className="w-6 h-6 rounded flex items-center justify-center text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.04] transition-colors"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Linear Minimal Filter Pills */}
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              filterTab === "all"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.02]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("unreviewed")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              filterTab === "unreviewed"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.02]"
            }`}
          >
            Unread
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("snoozed")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              filterTab === "snoozed"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.02]"
            }`}
          >
            Snoozed
          </button>
        </div>

        {/* Search Inside List */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#62666d] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded-md bg-white/[0.02] border border-white/[0.06] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* Dynamic List Content — Linear Breathing Room & Quiet Aesthetics */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {/* Investigations / Inbox Views */}
        {(activeView === "inbox" ||
          activeView === "investigations" ||
          activeView === "finguard" ||
          activeView === "scamshield" ||
          activeView === "reports" ||
          activeView === "command") &&
          filteredInvestigations.map((item) => {
            const isSelected = selectedInvestigationId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectInvestigation(item.id)}
                className={`p-2.5 rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-white/[0.08] text-white shadow-sm"
                    : "hover:bg-white/[0.03] text-[#8a8f98]"
                }`}
              >
                {/* Left Subtle Avatar with Minimal Status Dot */}
                <div className="relative mt-0.5 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[10px] font-medium text-[#8a8f98]">
                    {item.assignee.avatar}
                  </div>
                  {/* Subtle 6px Priority Signal (Only where necessary) */}
                  {item.riskLevel === "Critical" && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#eb5757] ring-2 ring-[#08090a]" />
                  )}
                  {item.riskLevel === "High" && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#f0b96d] ring-2 ring-[#08090a]" />
                  )}
                  {item.status === "Resolved" && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#4ebe82] ring-2 ring-[#08090a]" />
                  )}
                </div>

                {/* Content: Clean, uncluttered 2-line layout */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-medium truncate ${
                        isSelected ? "text-[#f7f8f8]" : "text-[#d0d3d8]"
                      }`}
                    >
                      {item.id} {item.title}
                    </span>
                    {/* Status circle matching screenshot */}
                    <span className="shrink-0 text-[#62666d]">
                      {item.status === "Resolved" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 stroke-[1.5]" />
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-0.5 text-[11px] text-[#8a8f98]">
                    <span className="truncate">
                      {item.targetEntity} • {item.description}
                    </span>
                    <span className="font-mono text-[10px] text-[#62666d] shrink-0">
                      {item.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

        {filteredInvestigations.length === 0 &&
          (activeView === "inbox" || activeView === "investigations" || activeView === "command" || activeView === "finguard") && (
            <div className="py-16 px-4 text-center space-y-1.5 text-xs text-[#8a8f98]">
              <div className="font-medium text-[#f7f8f8]">No alerts in this workspace</div>
              <div className="text-[11px] text-[#62666d]">
                This is a fresh workspace. Create an investigation or load demo cases.
              </div>
            </div>
          )}

        {/* Suppliers View */}
        {activeView === "suppliers" && (
          <>
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Building2 className="w-4 h-4 text-[#8a8f98] shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-medium text-[#f7f8f8] truncate">
                      {sup.name}
                    </div>
                    <div className="text-[10px] text-[#8a8f98] font-mono">
                      {sup.bankBranch} • {sup.accountNumber}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-[#8a8f98]">
                  {sup.status}
                </span>
              </div>
            ))}
            {suppliers.length === 0 && (
              <div className="py-16 px-4 text-center space-y-3">
                <Building2 className="w-6 h-6 text-[#62666d] mx-auto" />
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#f7f8f8]">No suppliers registered</div>
                  <div className="text-[11px] text-[#8a8f98]">
                    Add verified supplier bank records for FinGuard comparison
                  </div>
                </div>
                {onOpenQuickCreate && (
                  <button
                    type="button"
                    onClick={onOpenQuickCreate}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white text-white hover:text-black text-xs font-medium transition-colors"
                  >
                    + Add Supplier
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Evidence Vault View */}
        {activeView === "evidence" && (
          <>
            {evidenceList.map((ev) => (
              <div
                key={ev.id}
                className="p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-[#8a8f98] shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-medium text-[#f7f8f8] truncate">
                      {ev.title}
                    </div>
                    <div className="text-[10px] text-[#8a8f98] font-mono">
                      {ev.fileSize} • {ev.associatedInvestigationId}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-[#8a8f98]">
                  {ev.status}
                </span>
              </div>
            ))}
            {evidenceList.length === 0 && (
              <div className="py-16 px-4 text-center space-y-3">
                <FileText className="w-6 h-6 text-[#62666d] mx-auto" />
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#f7f8f8]">Evidence vault is empty</div>
                  <div className="text-[11px] text-[#8a8f98]">
                    Ingest invoices, email threads, or screenshots to analyze
                  </div>
                </div>
                {onOpenQuickCreate && (
                  <button
                    type="button"
                    onClick={onOpenQuickCreate}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white text-white hover:text-black text-xs font-medium transition-colors"
                  >
                    + Upload Evidence
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Entities View */}
        {activeView === "graph" && (
          <>
            {entities.map((ent) => (
              <div
                key={ent.id}
                className="p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GitFork className="w-4 h-4 text-[#8a8f98] shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-medium text-[#f7f8f8] truncate">
                      {ent.value}
                    </div>
                    <div className="text-[10px] text-[#8a8f98] font-mono">
                      {ent.type} • {ent.incidentCount} incidents
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-[#8a8f98]">
                  {ent.riskLevel}
                </span>
              </div>
            ))}
            {entities.length === 0 && (
              <div className="py-16 px-4 text-center space-y-3">
                <GitFork className="w-6 h-6 text-[#62666d] mx-auto" />
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#f7f8f8]">No entities tracked</div>
                  <div className="text-[11px] text-[#8a8f98]">
                    Track domains, accounts, and phone numbers in TrustGraph
                  </div>
                </div>
                {onOpenQuickCreate && (
                  <button
                    type="button"
                    onClick={onOpenQuickCreate}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white text-white hover:text-black text-xs font-medium transition-colors"
                  >
                    + Add Entity
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
