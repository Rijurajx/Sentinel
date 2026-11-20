"use client";

import { useState, useMemo } from "react";
import {
  InvestigationItem,
  SupplierItem,
  EvidenceItem,
  EntityItem,
  InvoiceItem,
  InboxAlertItem,
  ReviewItem,
  DossierItem,
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
  CreditCard,
  Radio,
  Scan,
  Bell,
  Lock,
} from "lucide-react";

interface ContextualMiddlePaneProps {
  activeView: string;
  investigations: InvestigationItem[];
  suppliers: SupplierItem[];
  evidenceList: EvidenceItem[];
  entities: EntityItem[];
  invoices?: InvoiceItem[];
  alerts?: InboxAlertItem[];
  reviews?: ReviewItem[];
  dossiers?: DossierItem[];
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
  selectedAlertId?: string;
  onSelectAlert?: (id: string) => void;
  selectedReviewId?: string;
  onSelectReview?: (id: string) => void;
  selectedDossierId?: string;
  onSelectDossier?: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenQuickCreate?: (tab?: "investigation" | "supplier" | "invoice" | "upload" | "entity") => void;
  onToggleRead?: (domain: string, id: string, forceReadState?: boolean) => void;
  onToggleSnooze?: (domain: string, id: string) => void;
}

export function ContextualMiddlePane({
  activeView,
  investigations,
  suppliers,
  evidenceList,
  entities,
  invoices = [],
  alerts = [],
  reviews = [],
  dossiers = [],
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
  selectedAlertId,
  onSelectAlert,
  selectedReviewId,
  onSelectReview,
  selectedDossierId,
  onSelectDossier,
  isCollapsed,
  onToggleCollapse,
  onOpenQuickCreate,
  onToggleRead,
  onToggleSnooze,
}: ContextualMiddlePaneProps) {
  const [filterTab, setFilterTab] = useState<"all" | "unreviewed" | "snoozed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (isCollapsed) {
    return null;
  }

  // 1. Helper: Domain-aware Snooze state checker
  const checkIsSnoozed = (item: any, domain: string): boolean => {
    if (item.isSnoozed === true) return true;
    if (item.isSnoozed === false) return false;
    if (domain === "inbox") return item.status === "Dismissed";
    if (domain === "investigations") return item.status === "Monitoring" || item.status === "Resolved";
    if (domain === "finguard") return item.status === "Approved" || item.status === "Rejected";
    if (domain === "reports") return item.status === "Archived";
    if (domain === "invoices") return item.status === "Cleared";
    return false;
  };

  // 2. Helper: Domain-aware Unread / Action-Required checker
  const checkIsUnread = (item: any, domain: string): boolean => {
    if (checkIsSnoozed(item, domain)) return false;
    if (item.isRead === true) return false;
    if (item.isRead === false) return true;
    if (domain === "inbox") return item.status === "Action Required";
    if (domain === "investigations")
      return item.status === "Under Review" || item.status === "Blocked" || item.riskLevel === "Critical";
    if (domain === "finguard") return item.status === "Pending Dual-Auth" || item.riskTier === "Critical";
    if (domain === "reports") return item.status === "Active Brief";
    if (domain === "suppliers")
      return item.status === "Discrepancy Detected" || item.status === "Under Review" || item.riskLevel === "Critical";
    if (domain === "invoices")
      return item.status === "Payment Held" || item.status === "Discrepancy" || item.status === "Under Review";
    if (domain === "evidence" || domain === "scamshield") return item.status === "Flagged" || item.status === "Extracted";
    if (domain === "graph") return item.riskLevel === "Critical" || item.riskLevel === "High";
    return false;
  };

  // 3. Domain Title
  const getTitle = () => {
    switch (activeView) {
      case "inbox":
        return "Alert Feed (Inbox)";
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
        return "Reviews (Dual-Auth)";
      default:
        return "Inbox";
    }
  };

  // 4. Live Counter Computations for current view
  const domainCounts = useMemo(() => {
    let all = 0;
    let unread = 0;
    let snoozed = 0;

    if (activeView === "inbox") {
      all = alerts.length;
      unread = alerts.filter((a) => checkIsUnread(a, "inbox")).length;
      snoozed = alerts.filter((a) => checkIsSnoozed(a, "inbox")).length;
    } else if (activeView === "investigations") {
      all = investigations.length;
      unread = investigations.filter((i) => checkIsUnread(i, "investigations")).length;
      snoozed = investigations.filter((i) => checkIsSnoozed(i, "investigations")).length;
    } else if (activeView === "finguard") {
      all = reviews.length;
      unread = reviews.filter((r) => checkIsUnread(r, "finguard")).length;
      snoozed = reviews.filter((r) => checkIsSnoozed(r, "finguard")).length;
    } else if (activeView === "reports") {
      all = dossiers.length;
      unread = dossiers.filter((d) => checkIsUnread(d, "reports")).length;
      snoozed = dossiers.filter((d) => checkIsSnoozed(d, "reports")).length;
    } else if (activeView === "suppliers") {
      all = suppliers.length;
      unread = suppliers.filter((s) => checkIsUnread(s, "suppliers")).length;
      snoozed = suppliers.filter((s) => checkIsSnoozed(s, "suppliers")).length;
    } else if (activeView === "invoices") {
      all = invoices.length;
      unread = invoices.filter((inv) => checkIsUnread(inv, "invoices")).length;
      snoozed = invoices.filter((inv) => checkIsSnoozed(inv, "invoices")).length;
    } else if (activeView === "evidence" || activeView === "scamshield") {
      all = evidenceList.length;
      unread = evidenceList.filter((e) => checkIsUnread(e, "evidence")).length;
      snoozed = evidenceList.filter((e) => checkIsSnoozed(e, "evidence")).length;
    } else if (activeView === "graph") {
      all = entities.length;
      unread = entities.filter((ent) => checkIsUnread(ent, "graph")).length;
      snoozed = entities.filter((ent) => checkIsSnoozed(ent, "graph")).length;
    } else if (activeView === "command") {
      all = 4;
      unread = (investigations.some((i) => i.riskLevel === "Critical") || invoices.some((inv) => inv.status === "Payment Held")) ? 1 : 0;
      snoozed = 0;
    }

    return { all, unread, snoozed };
  }, [activeView, alerts, investigations, reviews, dossiers, suppliers, invoices, evidenceList, entities]);

  // 5. Filtered Lists for Each Domain
  const filteredAlerts = alerts.filter((alrt) => {
    const matches =
      alrt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alrt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alrt.affectedEntity.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matches) return false;
    if (filterTab === "unreviewed") return checkIsUnread(alrt, "inbox");
    if (filterTab === "snoozed") return checkIsSnoozed(alrt, "inbox");
    return true;
  });

  const filteredInvestigations = investigations.filter((item) => {
    const matches =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetEntity.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matches) return false;
    if (filterTab === "unreviewed") return checkIsUnread(item, "investigations");
    if (filterTab === "snoozed") return checkIsSnoozed(item, "investigations");
    return true;
  });

  const filteredReviews = reviews.filter((rev) => {
    const matches =
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.targetSupplier.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matches) return false;
    if (filterTab === "unreviewed") return checkIsUnread(rev, "finguard");
    if (filterTab === "snoozed") return checkIsSnoozed(rev, "finguard");
    return true;
  });

  const filteredDossiers = dossiers.filter((dos) => {
    const matches =
      dos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dos.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dos.targetSyndicate.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matches) return false;
    if (filterTab === "unreviewed") return checkIsUnread(dos, "reports");
    if (filterTab === "snoozed") return checkIsSnoozed(dos, "reports");
    return true;
  });

  const filteredSuppliers = suppliers.filter((s) => {
    const matches =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.accountNumber.includes(searchQuery) ||
      s.ifsc.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matches) return false;
    if (filterTab === "unreviewed") return checkIsUnread(s, "suppliers");
    if (filterTab === "snoozed") return checkIsSnoozed(s, "suppliers");
    return true;
  });

  const filteredEvidence = evidenceList.filter((e) => {
    const matches =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.threatCategory && e.threatCategory.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matches) return false;
    if (filterTab === "unreviewed") return checkIsUnread(e, "evidence");
    if (filterTab === "snoozed") return checkIsSnoozed(e, "evidence");
    return true;
  });

  const filteredInvoices = invoices.filter((i) => {
    const matches =
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.payeeAccount.includes(searchQuery);
    if (!matches) return false;
    if (filterTab === "unreviewed") return checkIsUnread(i, "invoices");
    if (filterTab === "snoozed") return checkIsSnoozed(i, "invoices");
    return true;
  });

  const filteredEntities = entities.filter((ent) => {
    const matches =
      ent.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ent.type.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matches) return false;
    if (filterTab === "unreviewed") return checkIsUnread(ent, "graph");
    if (filterTab === "snoozed") return checkIsSnoozed(ent, "graph");
    return true;
  });

  // Telemetry channels for Pulse
  const telemetryChannels = [
    {
      id: "chan-perimeter",
      name: "Defense Perimeter",
      status: "ONLINE",
      statusColor: "#4ebe82",
      icon: Radio,
      metric: "Real-time stream",
      isUnread: investigations.some((i) => i.riskLevel === "Critical"),
    },
    {
      id: "chan-finguard",
      name: "FinGuard Latency",
      status: "0.2ms",
      statusColor: "#5e6ad2",
      icon: Activity,
      metric: "Deterministic verification",
      isUnread: false,
    },
    {
      id: "chan-scamshield",
      name: "ScamShield Sensor",
      status: "READY",
      statusColor: "#f0b96d",
      icon: Scan,
      metric: "Multimodal extraction",
      isUnread: evidenceList.some((e) => e.status === "Flagged"),
    },
    {
      id: "chan-trustgraph",
      name: "TrustGraph Mesh",
      status: "ACTIVE",
      statusColor: "#4ebe82",
      icon: GitFork,
      metric: "Provenance entity radar",
      isUnread: entities.some((ent) => ent.riskLevel === "Critical"),
    },
  ];

  const filteredChannels = telemetryChannels.filter((c) => {
    if (filterTab === "unreviewed") return c.isUnread;
    if (filterTab === "snoozed") return false;
    return true;
  });

  // Displayed items count
  const getDisplayedCount = () => {
    if (activeView === "inbox") return filteredAlerts.length;
    if (activeView === "finguard") return filteredReviews.length;
    if (activeView === "reports") return filteredDossiers.length;
    if (activeView === "suppliers") return filteredSuppliers.length;
    if (activeView === "evidence" || activeView === "scamshield") return filteredEvidence.length;
    if (activeView === "invoices") return filteredInvoices.length;
    if (activeView === "graph") return filteredEntities.length;
    if (activeView === "command") return filteredChannels.length;
    return filteredInvestigations.length;
  };

  // Reusable Empty State renderer
  const renderEmptyState = (allEmptyTitle: string, allEmptySub: string, quickActionType?: "supplier" | "invoice" | "upload" | "entity" | "investigation") => {
    if (filterTab === "unreviewed") {
      return (
        <div className="py-16 px-4 text-center space-y-1.5 text-xs text-[#8a8f98]">
          <CheckCircle2 className="w-5 h-5 text-[#4ebe82] mx-auto opacity-80" />
          <div className="font-medium text-[#f7f8f8]">All Caught Up</div>
          <div className="text-[11px] text-[#62666d]">No unread items requiring immediate action.</div>
        </div>
      );
    }
    if (filterTab === "snoozed") {
      return (
        <div className="py-16 px-4 text-center space-y-1.5 text-xs text-[#8a8f98]">
          <Clock className="w-5 h-5 text-[#8a8f98] mx-auto opacity-60" />
          <div className="font-medium text-[#f7f8f8]">No Snoozed Records</div>
          <div className="text-[11px] text-[#62666d]">Hover over any record and click the clock icon to snooze it.</div>
        </div>
      );
    }
    return (
      <div className="py-16 px-4 text-center space-y-3">
        <div className="space-y-1">
          <div className="text-xs font-medium text-[#f7f8f8]">{allEmptyTitle}</div>
          <div className="text-[11px] text-[#8a8f98]">{allEmptySub}</div>
        </div>
        {quickActionType && onOpenQuickCreate && (
          <button
            type="button"
            onClick={() => onOpenQuickCreate(quickActionType)}
            className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="w-80 sm:w-88 h-screen bg-[#08090a] border-r border-white/[0.08] flex flex-col shrink-0 select-none z-20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* Top Header & Search Bar */}
      <div className="p-3 border-b border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-[#f7f8f8]">{getTitle()}</h2>
            <span className="text-[10px] font-mono text-[#8a8f98] bg-white/[0.04] px-1.5 py-0.2 rounded">
              {getDisplayedCount()}
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
                  else if (activeView === "invoices") onOpenQuickCreate("invoice");
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

        {/* Filter Pills with real live numbers */}
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              filterTab === "all"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.02]"
            }`}
          >
            <span>All</span>
            <span
              className={`text-[10px] font-mono px-1 rounded ${
                filterTab === "all"
                  ? "bg-white/10 text-white font-semibold"
                  : "bg-white/[0.04] text-[#8a8f98]"
              }`}
            >
              {domainCounts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("unreviewed")}
            className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              filterTab === "unreviewed"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.02]"
            }`}
          >
            <span>Unread</span>
            <span
              className={`text-[10px] font-mono px-1 rounded ${
                domainCounts.unread > 0
                  ? "bg-[#5e6ad2]/20 text-[#828fff] border border-[#5e6ad2]/30 font-semibold"
                  : filterTab === "unreviewed"
                  ? "bg-white/10 text-white"
                  : "bg-white/[0.04] text-[#8a8f98]"
              }`}
            >
              {domainCounts.unread}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("snoozed")}
            className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              filterTab === "snoozed"
                ? "bg-white/[0.08] text-white"
                : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.02]"
            }`}
          >
            <span>Snoozed</span>
            <span
              className={`text-[10px] font-mono px-1 rounded ${
                filterTab === "snoozed"
                  ? "bg-white/10 text-white font-semibold"
                  : "bg-white/[0.04] text-[#8a8f98]"
              }`}
            >
              {domainCounts.snoozed}
            </span>
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
        {/* 1. Inbox Alerts View */}
        {activeView === "inbox" && (
          <>
            {filteredAlerts.map((alrt) => {
              const isSelected = selectedAlertId === alrt.id;
              const isCritical = alrt.severity === "Critical" || alrt.severity === "High";
              const isUnread = checkIsUnread(alrt, "inbox");
              const isSnoozed = checkIsSnoozed(alrt, "inbox");

              return (
                <div
                  key={alrt.id}
                  onClick={() => {
                    onSelectAlert?.(alrt.id);
                    onToggleRead?.("inbox", alrt.id, true);
                  }}
                  className={`p-2.5 rounded-lg flex items-start justify-between cursor-pointer transition-colors group relative ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="relative mt-0.5 shrink-0">
                      <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[10px] font-medium text-[#8a8f98]">
                        <Bell className="w-3 h-3 text-[#5e6ad2]" />
                      </div>
                      {isCritical && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#eb5757] ring-2 ring-[#08090a]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] shrink-0" title="Unread" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? "text-[#f7f8f8]" : isUnread ? "text-white font-semibold" : "text-[#d0d3d8]"
                          }`}
                        >
                          {alrt.id} {alrt.title}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-0.5 text-[11px] text-[#8a8f98]">
                        <span className="truncate">
                          {alrt.source} • {alrt.affectedEntity}
                        </span>
                        <span className="font-mono text-[10px] text-[#62666d] shrink-0">
                          {alrt.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Actions: Snooze & Read Toggle */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSnooze?.("inbox", alrt.id);
                      }}
                      title={isSnoozed ? "Unsnooze alert" : "Snooze alert"}
                      className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                    >
                      <Clock className={`w-3.5 h-3.5 ${isSnoozed ? "text-[#f0b96d]" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRead?.("inbox", alrt.id);
                      }}
                      title={isUnread ? "Mark as read" : "Mark as unread"}
                      className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                    >
                      {isUnread ? (
                        <Circle className="w-3.5 h-3.5 text-[#5e6ad2]" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredAlerts.length === 0 && renderEmptyState("Inbox Zero", "No perimeter alerts pending triage.")}
          </>
        )}

        {/* 2. My Issues (Investigations) View */}
        {activeView === "investigations" && (
          <>
            {filteredInvestigations.map((item) => {
              const isSelected = selectedInvestigationId === item.id;
              const isUnread = checkIsUnread(item, "investigations");
              const isSnoozed = checkIsSnoozed(item, "investigations");

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectInvestigation(item.id);
                    onToggleRead?.("investigations", item.id, true);
                  }}
                  className={`p-2.5 rounded-lg flex items-start justify-between cursor-pointer transition-colors group relative ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
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

                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] shrink-0" title="Unread" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? "text-[#f7f8f8]" : isUnread ? "text-white font-semibold" : "text-[#d0d3d8]"
                          }`}
                        >
                          {item.id} {item.title}
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

                  {/* Hover Actions: Snooze & Read Toggle */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSnooze?.("investigations", item.id);
                      }}
                      title={isSnoozed ? "Unsnooze investigation" : "Snooze investigation"}
                      className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                    >
                      <Clock className={`w-3.5 h-3.5 ${isSnoozed ? "text-[#f0b96d]" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRead?.("investigations", item.id);
                      }}
                      title={isUnread ? "Mark as read" : "Mark as unread"}
                      className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                    >
                      {isUnread ? (
                        <Circle className="w-3.5 h-3.5 text-[#5e6ad2]" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredInvestigations.length === 0 && renderEmptyState("No Cases Found", "Create a threat investigation to track suspicious entities.", "investigation")}
          </>
        )}

        {/* 3. Reviews (Dual-Auth Queue) View */}
        {activeView === "finguard" && (
          <>
            {filteredReviews.map((rev) => {
              const isSelected = selectedReviewId === rev.id;
              const isApproved = rev.status === "Approved";
              const isRejected = rev.status === "Rejected";
              const isUnread = checkIsUnread(rev, "finguard");
              const isSnoozed = checkIsSnoozed(rev, "finguard");

              return (
                <div
                  key={rev.id}
                  onClick={() => {
                    onSelectReview?.(rev.id);
                    onToggleRead?.("finguard", rev.id, true);
                  }}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors group relative ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Lock
                      className={`w-4 h-4 shrink-0 ${
                        isApproved ? "text-[#4ebe82]" : isRejected ? "text-[#eb5757]" : "text-[#f0b96d]"
                      }`}
                    />
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] shrink-0" title="Unread" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? "text-white" : isUnread ? "text-white font-semibold" : "text-[#f7f8f8]"
                          }`}
                        >
                          {rev.id} • {rev.targetSupplier}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono truncate">
                        {rev.amount} • {rev.requesterName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                        isApproved
                          ? "bg-[#4ebe82]/10 text-[#4ebe82] border border-[#4ebe82]/20"
                          : isRejected
                          ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                          : "bg-[#f0b96d]/10 text-[#f0b96d] border border-[#f0b96d]/20"
                      }`}
                    >
                      {rev.status === "Pending Dual-Auth" ? "Sign-off" : rev.status}
                    </span>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSnooze?.("finguard", rev.id);
                        }}
                        title={isSnoozed ? "Unsnooze review" : "Snooze review"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        <Clock className={`w-3.5 h-3.5 ${isSnoozed ? "text-[#f0b96d]" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead?.("finguard", rev.id);
                        }}
                        title={isUnread ? "Mark as read" : "Mark as unread"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        {isUnread ? (
                          <Circle className="w-3.5 h-3.5 text-[#5e6ad2]" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredReviews.length === 0 && renderEmptyState("Queue Clear", "No payment release holds pending dual authorization.")}
          </>
        )}

        {/* 4. Intelligence Dossiers View */}
        {activeView === "reports" && (
          <>
            {filteredDossiers.map((dos) => {
              const isSelected = selectedDossierId === dos.id;
              const isUnread = checkIsUnread(dos, "reports");
              const isSnoozed = checkIsSnoozed(dos, "reports");

              return (
                <div
                  key={dos.id}
                  onClick={() => {
                    onSelectDossier?.(dos.id);
                    onToggleRead?.("reports", dos.id, true);
                  }}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors group relative ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-[#5e6ad2] shrink-0" />
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] shrink-0" title="Unread" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? "text-white" : isUnread ? "text-white font-semibold" : "text-[#f7f8f8]"
                          }`}
                        >
                          {dos.id} • {dos.targetSyndicate}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono truncate">
                        Score: {dos.threatScore}/100 • Loss Prevented: {dos.preventedLoss}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-[#8a8f98] shrink-0">
                      {dos.status}
                    </span>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSnooze?.("reports", dos.id);
                        }}
                        title={isSnoozed ? "Unsnooze dossier" : "Snooze dossier"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        <Clock className={`w-3.5 h-3.5 ${isSnoozed ? "text-[#f0b96d]" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead?.("reports", dos.id);
                        }}
                        title={isUnread ? "Mark as read" : "Mark as unread"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        {isUnread ? (
                          <Circle className="w-3.5 h-3.5 text-[#5e6ad2]" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredDossiers.length === 0 && renderEmptyState("No Dossiers Filed", "Executive threat briefs compile automatically from resolved cases.")}
          </>
        )}

        {/* 5. Suppliers View */}
        {activeView === "suppliers" && (
          <>
            {filteredSuppliers.map((sup) => {
              const isSelected = selectedSupplierId === sup.id;
              const isMule = sup.status === "Discrepancy Detected" || sup.riskLevel === "Critical";
              const isUnread = checkIsUnread(sup, "suppliers");
              const isSnoozed = checkIsSnoozed(sup, "suppliers");

              return (
                <div
                  key={sup.id}
                  onClick={() => {
                    onSelectSupplier?.(sup.id);
                    onToggleRead?.("suppliers", sup.id, true);
                  }}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors group relative ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Building2
                      className={`w-4 h-4 shrink-0 ${
                        isMule ? "text-[#eb5757]" : "text-[#8a8f98]"
                      }`}
                    />
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] shrink-0" title="Unread" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? "text-white" : isUnread ? "text-white font-semibold" : "text-[#f7f8f8]"
                          }`}
                        >
                          {sup.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono truncate">
                        {sup.bankBranch} • {sup.accountNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                        isMule
                          ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                          : "bg-white/[0.04] text-[#8a8f98]"
                      }`}
                    >
                      {sup.status}
                    </span>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSnooze?.("suppliers", sup.id);
                        }}
                        title={isSnoozed ? "Unsnooze supplier" : "Snooze supplier"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        <Clock className={`w-3.5 h-3.5 ${isSnoozed ? "text-[#f0b96d]" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead?.("suppliers", sup.id);
                        }}
                        title={isUnread ? "Mark as read" : "Mark as unread"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        {isUnread ? (
                          <Circle className="w-3.5 h-3.5 text-[#5e6ad2]" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredSuppliers.length > 0 && onOpenQuickCreate && filterTab === "all" && (
              <button
                type="button"
                onClick={() => onOpenQuickCreate("supplier")}
                className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-xs text-[#8a8f98] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>+ Add Another Supplier</span>
              </button>
            )}

            {filteredSuppliers.length === 0 && renderEmptyState("No Suppliers Registered", "Add verified vendor bank records for FinGuard comparison.", "supplier")}
          </>
        )}

        {/* 6. Evidence Vault / ScamShield Ingestion */}
        {(activeView === "evidence" || activeView === "scamshield") && (
          <>
            {filteredEvidence.map((ev) => {
              const isSelected = selectedEvidenceId === ev.id;
              const isFlagged = ev.status === "Flagged" || ev.severity === "Critical";
              const isUnread = checkIsUnread(ev, "evidence");
              const isSnoozed = checkIsSnoozed(ev, "evidence");

              return (
                <div
                  key={ev.id}
                  onClick={() => {
                    onSelectEvidence?.(ev.id);
                    onToggleRead?.("evidence", ev.id, true);
                  }}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors group relative ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <FileText
                      className={`w-4 h-4 shrink-0 ${
                        isFlagged ? "text-[#eb5757]" : "text-[#8a8f98]"
                      }`}
                    />
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] shrink-0" title="Unread" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? "text-white" : isUnread ? "text-white font-semibold" : "text-[#f7f8f8]"
                          }`}
                        >
                          {ev.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono truncate">
                        {ev.fileSize} • {ev.associatedInvestigationId}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                        isFlagged
                          ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                          : "bg-white/[0.04] text-[#8a8f98]"
                      }`}
                    >
                      {ev.status}
                    </span>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSnooze?.("evidence", ev.id);
                        }}
                        title={isSnoozed ? "Unsnooze file" : "Snooze file"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        <Clock className={`w-3.5 h-3.5 ${isSnoozed ? "text-[#f0b96d]" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead?.("evidence", ev.id);
                        }}
                        title={isUnread ? "Mark as read" : "Mark as unread"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        {isUnread ? (
                          <Circle className="w-3.5 h-3.5 text-[#5e6ad2]" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredEvidence.length > 0 && onOpenQuickCreate && filterTab === "all" && (
              <button
                type="button"
                onClick={() => onOpenQuickCreate("upload")}
                className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-xs text-[#8a8f98] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>+ Upload Another Evidence</span>
              </button>
            )}

            {filteredEvidence.length === 0 && renderEmptyState("Evidence Vault Empty", "Ingest invoices, email threads, or screenshots to analyze.", "upload")}
          </>
        )}

        {/* 7. Invoices View */}
        {activeView === "invoices" && (
          <>
            {filteredInvoices.map((inv) => {
              const isSelected = selectedInvoiceId === inv.id;
              const isMismatch = inv.status === "Payment Held" || inv.status === "Discrepancy";
              const isUnread = checkIsUnread(inv, "invoices");
              const isSnoozed = checkIsSnoozed(inv, "invoices");

              return (
                <div
                  key={inv.id}
                  onClick={() => {
                    onSelectInvoice?.(inv.id);
                    onToggleRead?.("invoices", inv.id, true);
                  }}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors group relative ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <CreditCard
                      className={`w-4 h-4 shrink-0 ${
                        isMismatch ? "text-[#eb5757]" : "text-[#8a8f98]"
                      }`}
                    />
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] shrink-0" title="Unread" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? "text-white" : isUnread ? "text-white font-semibold" : "text-[#f7f8f8]"
                          }`}
                        >
                          {inv.id} • {inv.vendorName}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono truncate">
                        {inv.amount} • {inv.dueDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                        isMismatch
                          ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                          : "bg-[#4ebe82]/10 text-[#4ebe82] border border-[#4ebe82]/20"
                      }`}
                    >
                      {inv.status}
                    </span>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSnooze?.("invoices", inv.id);
                        }}
                        title={isSnoozed ? "Unsnooze invoice" : "Snooze invoice"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        <Clock className={`w-3.5 h-3.5 ${isSnoozed ? "text-[#f0b96d]" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead?.("invoices", inv.id);
                        }}
                        title={isUnread ? "Mark as read" : "Mark as unread"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        {isUnread ? (
                          <Circle className="w-3.5 h-3.5 text-[#5e6ad2]" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredInvoices.length > 0 && onOpenQuickCreate && filterTab === "all" && (
              <button
                type="button"
                onClick={() => onOpenQuickCreate("invoice")}
                className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-xs text-[#8a8f98] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>+ Ingest New Invoice</span>
              </button>
            )}

            {filteredInvoices.length === 0 && renderEmptyState("No Invoices Ingested", "Ingest invoices for dual-auth FinGuard clearance.", "invoice")}
          </>
        )}

        {/* 8. TrustGraph Entities View */}
        {activeView === "graph" && (
          <>
            {filteredEntities.map((ent) => {
              const isSelected = selectedEntityId === ent.id;
              const isUnread = checkIsUnread(ent, "graph");
              const isSnoozed = checkIsSnoozed(ent, "graph");

              return (
                <div
                  key={ent.id}
                  onClick={() => {
                    onSelectEntity?.(ent.id);
                    onToggleRead?.("graph", ent.id, true);
                  }}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors group relative ${
                    isSelected
                      ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/[0.03] text-[#8a8f98]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <GitFork className="w-4 h-4 text-[#8a8f98] shrink-0" />
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] shrink-0" title="Unread" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? "text-white" : isUnread ? "text-white font-semibold" : "text-[#f7f8f8]"
                          }`}
                        >
                          {ent.value}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono">
                        {ent.type} • {ent.incidentCount} incidents
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-[#8a8f98]">
                      {ent.riskLevel}
                    </span>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSnooze?.("graph", ent.id);
                        }}
                        title={isSnoozed ? "Unsnooze entity" : "Snooze entity"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        <Clock className={`w-3.5 h-3.5 ${isSnoozed ? "text-[#f0b96d]" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead?.("graph", ent.id);
                        }}
                        title={isUnread ? "Mark as read" : "Mark as unread"}
                        className="p-1 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white transition-colors"
                      >
                        {isUnread ? (
                          <Circle className="w-3.5 h-3.5 text-[#5e6ad2]" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ebe82]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredEntities.length > 0 && onOpenQuickCreate && filterTab === "all" && (
              <button
                type="button"
                onClick={() => onOpenQuickCreate("entity")}
                className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-xs text-[#8a8f98] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>+ Add Forensic Entity</span>
              </button>
            )}

            {filteredEntities.length === 0 && renderEmptyState("No Entities Tracked", "Track domains, accounts, and phone numbers in TrustGraph.", "entity")}
          </>
        )}

        {/* 9. Pulse Telemetry Channels */}
        {activeView === "command" && (
          <div className="space-y-1 p-1">
            {filteredChannels.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#8a8f98] hover:text-white flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: c.statusColor }} />
                    <div>
                      <div className="text-xs font-medium text-white flex items-center gap-1.5">
                        {c.isUnread && <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]" />}
                        <span>{c.name}</span>
                      </div>
                      <div className="text-[10px] text-[#8a8f98]">{c.metric}</div>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${c.statusColor}15`, color: c.statusColor }}
                  >
                    {c.status}
                  </span>
                </div>
              );
            })}
            {filteredChannels.length === 0 && renderEmptyState("Pulse Telemetry Quiet", "All telemetry channels operating within nominal baselines.")}
          </div>
        )}
      </div>
    </section>
  );
}
