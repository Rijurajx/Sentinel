"use client";

import { useState } from "react";
import {
  InvestigationItem,
  SupplierItem,
  EvidenceItem,
  EntityItem,
  InvoiceItem,
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
  Plus,
  Activity,
  AlertTriangle,
  CreditCard,
  Radio,
  Scan,
} from "lucide-react";

interface ContextualMiddlePaneProps {
  activeView: string;
  investigations: InvestigationItem[];
  suppliers: SupplierItem[];
  evidenceList: EvidenceItem[];
  entities: EntityItem[];
  invoices?: InvoiceItem[];
  selectedInvestigationId: string;
  onSelectInvestigation: (id: string) => void;
  selectedSupplierId?: string;
  onSelectSupplier?: (id: string) => void;
  selectedEvidenceId?: string;
  onSelectEvidence?: (id: string) => void;
  selectedInvoiceId?: string;
  onSelectInvoice?: (id: string) => void;
  selectedEntityId?: string;
  onSelectEntity?: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenQuickCreate?: (tab?: "investigation" | "supplier" | "upload" | "entity") => void;
}

export function ContextualMiddlePane({
  activeView,
  investigations,
  suppliers,
  evidenceList,
  entities,
  invoices = [],
  selectedInvestigationId,
  onSelectInvestigation,
  selectedSupplierId,
  onSelectSupplier,
  selectedEvidenceId,
  onSelectEvidence,
  selectedInvoiceId,
  onSelectInvoice,
  selectedEntityId,
  onSelectEntity,
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
        return "Intelligence Dossiers";
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

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.accountNumber.includes(searchQuery) ||
    s.ifsc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter evidence
  const filteredEvidence = evidenceList.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.threatCategory && e.threatCategory.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter invoices
  const filteredInvoices = invoices.filter((i) =>
    i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.payeeAccount.includes(searchQuery)
  );

  // Filter entities
  const filteredEntities = entities.filter((ent) =>
    ent.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ent.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCount = () => {
    if (activeView === "suppliers") return filteredSuppliers.length;
    if (activeView === "evidence" || activeView === "scamshield") return filteredEvidence.length;
    if (activeView === "invoices") return filteredInvoices.length;
    if (activeView === "graph") return filteredEntities.length;
    if (activeView === "command") return 4;
    return filteredInvestigations.length;
  };

  return (
    <section className="w-80 sm:w-88 h-screen bg-[#08090a] border-r border-white/[0.08] flex flex-col shrink-0 select-none z-20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* Top Header & Search Bar */}
      <div className="p-3 border-b border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-[#f7f8f8]">{getTitle()}</h2>
            <span className="text-[10px] font-mono text-[#8a8f98] bg-white/[0.04] px-1.5 py-0.2 rounded">
              {getCount()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenQuickCreate && (
              <button
                type="button"
                onClick={() => {
                  if (activeView === "suppliers") onOpenQuickCreate("supplier");
                  else if (activeView === "evidence" || activeView === "scamshield") onOpenQuickCreate("upload");
                  else if (activeView === "graph") onOpenQuickCreate("entity");
                  else if (activeView === "invoices") onOpenQuickCreate("upload");
                  else onOpenQuickCreate("investigation");
                }}
                className="px-2 py-0.5 rounded bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-[11px] font-medium flex items-center gap-1 transition-colors shadow-sm shadow-[#5e6ad2]/20"
              >
                <Plus className="w-3 h-3" />
                <span>
                  {activeView === "suppliers"
                    ? "Add Supplier"
                    : activeView === "evidence" || activeView === "scamshield"
                    ? "Upload"
                    : activeView === "invoices"
                    ? "Ingest"
                    : activeView === "graph"
                    ? "Add Entity"
                    : "New Case"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleCollapse}
              title="Collapse panel"
              className="w-6 h-6 rounded flex items-center justify-center text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.04] transition-colors"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
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

        {/* Search Input */}
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

      {/* Dynamic List Content */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {/* 1. Investigations / Inbox Views */}
        {(activeView === "inbox" ||
          activeView === "investigations" ||
          activeView === "finguard" ||
          activeView === "reports") &&
          filteredInvestigations.map((item) => {
            const isSelected = selectedInvestigationId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectInvestigation(item.id)}
                className={`p-2.5 rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                    : "hover:bg-white/[0.03] text-[#8a8f98]"
                }`}
              >
                <div className="relative mt-0.5 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[10px] font-medium text-[#8a8f98]">
                    {item.assignee.avatar}
                  </div>
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-medium truncate ${
                        isSelected ? "text-[#f7f8f8]" : "text-[#d0d3d8]"
                      }`}
                    >
                      {item.id} {item.title}
                    </span>
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

        {/* 2. Suppliers View */}
        {activeView === "suppliers" && (
          <>
            {filteredSuppliers.map((sup) => {
              const isSelected = selectedSupplierId === sup.id;
              const isMule = sup.status === "Discrepancy Detected" || sup.riskLevel === "Critical";
              return (
                <div
                  key={sup.id}
                  onClick={() => onSelectSupplier?.(sup.id)}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Building2
                      className={`w-4 h-4 shrink-0 ${
                        isMule ? "text-[#eb5757]" : "text-[#8a8f98]"
                      }`}
                    />
                    <div className="truncate">
                      <div
                        className={`text-xs font-medium truncate ${
                          isSelected ? "text-white" : "text-[#f7f8f8]"
                        }`}
                      >
                        {sup.name}
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono truncate">
                        {sup.bankBranch} • {sup.accountNumber}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                      isMule
                        ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                        : "bg-white/[0.04] text-[#8a8f98]"
                    }`}
                  >
                    {sup.status}
                  </span>
                </div>
              );
            })}

            {filteredSuppliers.length > 0 && onOpenQuickCreate && (
              <button
                type="button"
                onClick={() => onOpenQuickCreate("supplier")}
                className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-xs text-[#8a8f98] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>+ Add Another Supplier</span>
              </button>
            )}

            {filteredSuppliers.length === 0 && (
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
                    onClick={() => onOpenQuickCreate("supplier")}
                    className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors"
                  >
                    + Add Supplier
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* 3. Evidence Vault / ScamShield Ingestion */}
        {(activeView === "evidence" || activeView === "scamshield") && (
          <>
            {filteredEvidence.map((ev) => {
              const isSelected = selectedEvidenceId === ev.id;
              const isFlagged = ev.status === "Flagged" || ev.severity === "Critical";
              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvidence?.(ev.id)}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText
                      className={`w-4 h-4 shrink-0 ${
                        isFlagged ? "text-[#eb5757]" : "text-[#8a8f98]"
                      }`}
                    />
                    <div className="truncate">
                      <div
                        className={`text-xs font-medium truncate ${
                          isSelected ? "text-white" : "text-[#f7f8f8]"
                        }`}
                      >
                        {ev.title}
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono truncate">
                        {ev.fileSize} • {ev.associatedInvestigationId}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                      isFlagged
                        ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                        : "bg-white/[0.04] text-[#8a8f98]"
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              );
            })}

            {filteredEvidence.length > 0 && onOpenQuickCreate && (
              <button
                type="button"
                onClick={() => onOpenQuickCreate("upload")}
                className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-xs text-[#8a8f98] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>+ Upload Another Evidence</span>
              </button>
            )}

            {filteredEvidence.length === 0 && (
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
                    onClick={() => onOpenQuickCreate("upload")}
                    className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors"
                  >
                    + Upload Evidence
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* 4. Invoices View */}
        {activeView === "invoices" && (
          <>
            {filteredInvoices.map((inv) => {
              const isSelected = selectedInvoiceId === inv.id;
              const isMismatch = inv.status === "Payment Held" || inv.status === "Discrepancy";
              return (
                <div
                  key={inv.id}
                  onClick={() => onSelectInvoice?.(inv.id)}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CreditCard
                      className={`w-4 h-4 shrink-0 ${
                        isMismatch ? "text-[#eb5757]" : "text-[#8a8f98]"
                      }`}
                    />
                    <div className="truncate">
                      <div
                        className={`text-xs font-medium truncate ${
                          isSelected ? "text-white" : "text-[#f7f8f8]"
                        }`}
                      >
                        {inv.id} • {inv.vendorName}
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono truncate">
                        {inv.amount} • {inv.dueDate}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                      isMismatch
                        ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                        : "bg-[#4ebe82]/10 text-[#4ebe82] border border-[#4ebe82]/20"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              );
            })}

            {filteredInvoices.length > 0 && onOpenQuickCreate && (
              <button
                type="button"
                onClick={() => onOpenQuickCreate("upload")}
                className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-xs text-[#8a8f98] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>+ Ingest New Invoice</span>
              </button>
            )}

            {filteredInvoices.length === 0 && (
              <div className="py-16 px-4 text-center space-y-3">
                <CreditCard className="w-6 h-6 text-[#62666d] mx-auto" />
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#f7f8f8]">No invoices ingested</div>
                  <div className="text-[11px] text-[#8a8f98]">
                    Ingest invoices for dual-auth FinGuard clearance
                  </div>
                </div>
                {onOpenQuickCreate && (
                  <button
                    type="button"
                    onClick={() => onOpenQuickCreate("upload")}
                    className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors"
                  >
                    + Ingest Invoice
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* 5. TrustGraph Entities View */}
        {activeView === "graph" && (
          <>
            {filteredEntities.map((ent) => {
              const isSelected = selectedEntityId === ent.id;
              return (
                <div
                  key={ent.id}
                  onClick={() => onSelectEntity?.(ent.id)}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GitFork className="w-4 h-4 text-[#8a8f98] shrink-0" />
                    <div className="truncate">
                      <div
                        className={`text-xs font-medium truncate ${
                          isSelected ? "text-white" : "text-[#f7f8f8]"
                        }`}
                      >
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
              );
            })}

            {filteredEntities.length > 0 && onOpenQuickCreate && (
              <button
                type="button"
                onClick={() => onOpenQuickCreate("entity")}
                className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-xs text-[#8a8f98] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>+ Add Forensic Entity</span>
              </button>
            )}

            {filteredEntities.length === 0 && (
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
                    onClick={() => onOpenQuickCreate("entity")}
                    className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors"
                  >
                    + Add Entity
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* 6. Pulse Telemetry Channels */}
        {activeView === "command" && (
          <div className="space-y-1 p-1">
            <div className="p-2.5 rounded-lg bg-white/[0.08] text-white flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#4ebe82] animate-pulse" />
                <div className="text-xs font-medium">Defense Perimeter</div>
              </div>
              <span className="text-[10px] font-mono text-[#4ebe82] bg-[#4ebe82]/10 px-1.5 py-0.5 rounded">
                ONLINE
              </span>
            </div>
            <div className="p-2.5 rounded-lg hover:bg-white/[0.03] text-[#8a8f98] flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5e6ad2]" />
                <div className="text-xs font-medium">FinGuard Latency</div>
              </div>
              <span className="text-[10px] font-mono text-[#8a8f98]">0.2ms</span>
            </div>
            <div className="p-2.5 rounded-lg hover:bg-white/[0.03] text-[#8a8f98] flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-[#f0b96d]" />
                <div className="text-xs font-medium">ScamShield Sensor</div>
              </div>
              <span className="text-[10px] font-mono text-[#4ebe82]">READY</span>
            </div>
            <div className="p-2.5 rounded-lg hover:bg-white/[0.03] text-[#8a8f98] flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-[#8a8f98]" />
                <div className="text-xs font-medium">TrustGraph Mesh</div>
              </div>
              <span className="text-[10px] font-mono text-[#4ebe82]">ACTIVE</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
