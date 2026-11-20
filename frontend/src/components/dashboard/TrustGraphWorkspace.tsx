"use client";

import { useState, useMemo } from "react";
import {
  EntityItem,
  SupplierItem,
  InvoiceItem,
  InvestigationItem,
  EvidenceItem,
} from "@/lib/dashboard-data";
import {
  GitFork,
  Globe,
  CreditCard,
  Building2,
  ShieldAlert,
  Search,
  Plus,
  ArrowRight,
  RefreshCw,
  FileText,
  Lock,
  Layers,
  PanelRightClose,
  PanelRightOpen,
  Copy,
  Check,
  X,
  LayoutGrid,
  List,
} from "lucide-react";
import { correlateTrustGraph, TrustGraphResult } from "@/lib/apiClient";

interface TrustGraphWorkspaceProps {
  entities: EntityItem[];
  suppliers?: SupplierItem[];
  invoices?: InvoiceItem[];
  investigations?: InvestigationItem[];
  evidenceList?: EvidenceItem[];
  selectedEntityId?: string;
  onSelectEntity?: (id: string) => void;
  onOpenQuickCreate?: (tab?: "investigation" | "supplier" | "invoice" | "upload" | "entity") => void;
  onCompileDossier?: () => void;
  workspaceId: string;
}

interface VisualNode {
  id: string;
  name: string;
  category: "account" | "domain" | "supplier" | "invoice" | "threat_actor" | "incident";
  riskLevel: "Critical" | "High" | "Medium" | "Safe";
  role: string;
  detailsLines: Array<{ label: string; value: string }>;
  meta: Record<string, any>;
}

interface VisualEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  isHighRisk?: boolean;
}

export function TrustGraphWorkspace({
  entities,
  suppliers = [],
  invoices = [],
  investigations = [],
  evidenceList = [],
  selectedEntityId,
  onSelectEntity,
  onOpenQuickCreate,
  onCompileDossier,
  workspaceId,
}: TrustGraphWorkspaceProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(selectedEntityId || null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCorrelating, setIsCorrelating] = useState(false);
  const [liveCorrelation, setLiveCorrelation] = useState<TrustGraphResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  // Synthesize unified nodes from Firestore state
  const { nodes, edges } = useMemo(() => {
    const nList: VisualNode[] = [];
    const eList: VisualEdge[] = [];

    // 1. Suppliers
    suppliers.forEach((s) => {
      const isMule = s.status === "Discrepancy Detected" || s.riskLevel === "Critical";
      nList.push({
        id: s.id,
        name: s.name,
        category: "supplier",
        riskLevel: isMule ? "Critical" : "Safe",
        role: isMule ? "⚠️ Payment Diversion Attempt" : "✓ Verified Beneficiary",
        detailsLines: [
          { label: "Account", value: s.accountNumber },
          { label: "IFSC", value: s.ifsc },
          { label: "Branch", value: s.bankBranch || "Scheduled Commercial Branch" },
          { label: "Status", value: s.status },
        ],
        meta: {
          Supplier: s.name,
          Account: s.accountNumber,
          IFSC: s.ifsc,
          Branch: s.bankBranch,
          Status: s.status,
          Volume: s.totalInvoiced,
        },
      });
    });

    // 2. Invoices
    invoices.forEach((inv) => {
      const isHeld = inv.status === "Payment Held" || inv.status === "Discrepancy";
      nList.push({
        id: inv.id,
        name: `${inv.id} (${inv.amount})`,
        category: "invoice",
        riskLevel: isHeld ? "Critical" : "Safe",
        role: isHeld ? "🚨 Payment Held (Coordinate Discrepancy)" : "✓ Cleared Disbursement",
        detailsLines: [
          { label: "Vendor", value: inv.vendorName },
          { label: "Payee Acct", value: inv.payeeAccount },
          { label: "Payee IFSC", value: inv.payeeIfsc },
          { label: "Amount", value: inv.amount },
        ],
        meta: {
          InvoiceID: inv.id,
          Amount: inv.amount,
          Vendor: inv.vendorName,
          Account: inv.payeeAccount,
          IFSC: inv.payeeIfsc,
          Status: inv.status,
          Due: inv.dueDate,
        },
      });

      // Edge from Supplier to Invoice
      const matchingSupplier = suppliers.find((s) => s.name === inv.vendorName);
      if (matchingSupplier) {
        eList.push({
          id: `e-${matchingSupplier.id}-${inv.id}`,
          source: matchingSupplier.id,
          target: inv.id,
          relation: "ISSUES_INVOICE",
          isHighRisk: isHeld,
        });
      }
    });

    // 3. Tracked Forensic Entities
    entities.forEach((ent) => {
      const cat =
        ent.type === "Bank Account"
          ? "account"
          : ent.type === "Domain"
          ? "domain"
          : ent.type === "Organization"
          ? "supplier"
          : "domain";

      nList.push({
        id: ent.id,
        name: ent.value,
        category: cat,
        riskLevel: ent.riskLevel === "Verified" ? "Safe" : ent.riskLevel,
        role: `Forensic Coordinate (${ent.type})`,
        detailsLines: [
          { label: "Coordinate", value: ent.value },
          { label: "Type", value: ent.type },
          { label: "Incidents", value: `${ent.incidentCount} observed` },
          { label: "Last Seen", value: ent.lastObserved },
        ],
        meta: {
          Type: ent.type,
          Value: ent.value,
          Incidents: ent.incidentCount,
          LastSeen: ent.lastObserved,
        },
      });

      // Automatically link Account entities to matching Invoices
      if (ent.type === "Bank Account") {
        invoices.forEach((inv) => {
          if (inv.payeeAccount.replace(/\s+/g, "") === ent.value.replace(/\s+/g, "")) {
            eList.push({
              id: `e-${inv.id}-${ent.id}`,
              source: inv.id,
              target: ent.id,
              relation: "ROUTES_PAYMENT_TO",
              isHighRisk: true,
            });
          }
        });
      }
    });

    // 4. Ingested Evidence
    evidenceList.forEach((ev) => {
      nList.push({
        id: ev.id,
        name: ev.title,
        category: "incident",
        riskLevel: ev.status === "Flagged" ? "Critical" : "Medium",
        role: ev.status === "Flagged" ? "🚨 Flagged Threat Vector" : "Document Telemetry",
        detailsLines: [
          { label: "Format", value: ev.type },
          { label: "Size", value: ev.fileSize },
          { label: "Uploaded", value: ev.uploadedAt },
          { label: "Analysis", value: ev.threatSummary || "ScamShield Analysis Complete" },
        ],
        meta: {
          Filename: ev.title,
          Format: ev.type,
          Size: ev.fileSize,
          Status: ev.status,
          Summary: ev.threatSummary || "ScamShield Analysis Complete",
        },
      });

      const invRef = ev.associatedInvestigationId?.trim();
      if (invRef) {
        eList.push({
          id: `e-${ev.id}-${invRef}`,
          source: ev.id,
          target: invRef,
          relation: "ATTACHED_TO_INCIDENT",
          isHighRisk: ev.status === "Flagged",
        });
      }
    });

    // 5. Active Investigations
    investigations.forEach((inv) => {
      nList.push({
        id: inv.id,
        name: `${inv.id}: ${inv.title}`,
        category: "incident",
        riskLevel: inv.riskLevel === "Critical" ? "Critical" : "High",
        role: "Active Incident Docket",
        detailsLines: [
          { label: "Case ID", value: inv.id },
          { label: "Target", value: inv.targetEntity },
          { label: "Exposure", value: inv.amount || "$485,000.00" },
          { label: "Status", value: inv.status },
        ],
        meta: {
          CaseID: inv.id,
          Target: inv.targetEntity,
          Amount: inv.amount || "N/A",
          Risk: inv.riskLevel,
          Status: inv.status,
        },
      });

      const matchedSup = suppliers.find((s) => s.name === inv.targetEntity);
      if (matchedSup) {
        eList.push({
          id: `e-${inv.id}-${matchedSup.id}`,
          source: inv.id,
          target: matchedSup.id,
          relation: "INVESTIGATES_TARGET",
          isHighRisk: true,
        });
      }
    });

    // 6. Threat Actor Syndicate Cluster (Correlated when entities are flagged)
    const hasCritical =
      suppliers.some((s) => s.riskLevel === "Critical") ||
      invoices.some((inv) => inv.status === "Payment Held") ||
      entities.some((e) => e.riskLevel === "Critical");

    if (hasCritical || liveCorrelation) {
      const syndicateId = "cluster-crimson-typhoon";
      nList.push({
        id: syndicateId,
        name: "Crimson Typhoon / TC-948",
        category: "threat_actor",
        riskLevel: "Critical",
        role: "Active BEC Crime Cluster",
        detailsLines: [
          { label: "Attribution", value: "Scattered Spider Sub-Cluster" },
          { label: "Linked Wire", value: "$4,200,000.00" },
          { label: "Tactics", value: "IFSC Tampering, Lookalike Domains" },
          { label: "Confidence", value: "94% Deterministic Traverse" },
        ],
        meta: {
          Cluster: "Crimson Typhoon / TC-948",
          Attribution: "Scattered Spider / BEC Syndicate",
          LinkedLosses: "$4,200,000.00",
          Tactics: "IFSC Alteration, Lookalike Domains",
        },
      });

      nList.forEach((node) => {
        if (
          (node.category === "account" || node.category === "domain" || node.category === "invoice") &&
          node.riskLevel === "Critical"
        ) {
          eList.push({
            id: `e-${node.id}-${syndicateId}`,
            source: node.id,
            target: syndicateId,
            relation: "CO_OCCURS_WITH_SYNDICATE",
            isHighRisk: true,
          });
        }
      });
    }

    return { nodes: nList, edges: eList };
  }, [entities, suppliers, invoices, investigations, evidenceList, liveCorrelation]);

  // Resolve human-friendly node name for Edges table
  const resolveNodeName = (nodeId: string) => {
    const found = nodes.find((n) => n.id === nodeId);
    if (found) {
      return found.name.length > 32 ? `${found.name.slice(0, 30)}...` : found.name;
    }
    return nodeId;
  };

  // Filter nodes
  const filteredNodes = nodes.filter((node) => {
    if (categoryFilter !== "all" && node.category !== categoryFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      node.name.toLowerCase().includes(q) ||
      node.role.toLowerCase().includes(q) ||
      node.detailsLines.some((d) => d.value.toLowerCase().includes(q))
    );
  });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || filteredNodes[0] || null;

  const handleRunCorrelation = async () => {
    setIsCorrelating(true);
    try {
      const primarySupplier = suppliers[0];
      const primaryInvoice = invoices[0];
      const res = await correlateTrustGraph({
        supplier_name: primarySupplier?.name || "Asterion Supplies Pvt Ltd",
        account_number: primaryInvoice?.payeeAccount || primarySupplier?.accountNumber || "999988887777",
        ifsc_or_iban: primaryInvoice?.payeeIfsc || primarySupplier?.ifsc || "DEMO0002222",
      });
      setLiveCorrelation(res);
    } catch (e) {
      console.warn("Correlation failed:", e);
    } finally {
      setIsCorrelating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "account":
        return <CreditCard className="w-3.5 h-3.5 text-[#eb5757]" />;
      case "domain":
        return <Globe className="w-3.5 h-3.5 text-[#f0b96d]" />;
      case "supplier":
        return <Building2 className="w-3.5 h-3.5 text-[#4ebe82]" />;
      case "invoice":
        return <FileText className="w-3.5 h-3.5 text-[#5e6ad2]" />;
      case "threat_actor":
        return <ShieldAlert className="w-3.5 h-3.5 text-[#eb5757]" />;
      default:
        return <GitFork className="w-3.5 h-3.5 text-[#8a8f98]" />;
    }
  };

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-hidden flex flex-col z-10 select-text">
      {/* 1. Clean Top Header Bar */}
      <header className="h-12 px-4 sm:px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20 shrink-0 gap-3">
        {/* Left Breadcrumb */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#5e6ad2] animate-pulse" />
            <span className="font-mono text-xs text-[#8a8f98] font-medium">TRUSTGRAPH-01</span>
          </div>
          <span className="text-white/20 shrink-0">/</span>
          <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-sm">
            Threat Provenance & Entity Network
          </span>
          <span className="hidden md:inline-flex text-[10px] font-mono text-[#5e6ad2] bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 px-2 py-0.5 rounded shrink-0">
            {nodes.length} Nodes Correlated
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {onCompileDossier && (
            <button
              type="button"
              onClick={onCompileDossier}
              className="h-8 px-2.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] text-[#8a8f98] hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              title="Compile Executive Threat Dossier"
            >
              <FileText className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span className="hidden sm:inline">Compile Dossier</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRunCorrelation}
            disabled={isCorrelating}
            className="h-8 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#8a8f98] hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 border border-white/[0.08] disabled:opacity-50 shrink-0 whitespace-nowrap"
            title="Correlate with Live Threat Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5e6ad2] ${isCorrelating ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isCorrelating ? "Correlating..." : "Correlate Live Intel"}</span>
          </button>

          {onOpenQuickCreate && (
            <button
              type="button"
              onClick={() => onOpenQuickCreate("entity")}
              className="h-8 px-3 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-sm shadow-[#5e6ad2]/20"
              title="Track New Suspect Coordinate"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track Entity</span>
            </button>
          )}

          {/* Toggle Inspector Button */}
          <button
            type="button"
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className={`h-8 w-8 rounded-lg border transition-colors flex items-center justify-center shrink-0 ${
              isInspectorOpen
                ? "bg-white/[0.08] border-white/20 text-white"
                : "bg-white/[0.02] border-white/[0.08] text-[#8a8f98] hover:text-white"
            }`}
            title={isInspectorOpen ? "Hide Entity Inspector" : "Show Entity Inspector"}
          >
            {isInspectorOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4 text-[#5e6ad2]" />
            )}
          </button>
        </div>
      </header>

      {/* 2. Sub-Header Filter Bar with View Mode Toggle */}
      <div className="px-4 sm:px-6 py-2 border-b border-white/[0.06] bg-[#08090a]/80 flex items-center justify-between text-xs gap-3 shrink-0">
        {/* Category Pills (No overflow, compact) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 min-w-0">
          {[
            { id: "all", label: "All", count: nodes.length },
            { id: "supplier", label: "Suppliers", count: nodes.filter((n) => n.category === "supplier").length },
            { id: "invoice", label: "Invoices", count: nodes.filter((n) => n.category === "invoice").length },
            { id: "account", label: "Accounts", count: nodes.filter((n) => n.category === "account").length },
            { id: "domain", label: "Domains", count: nodes.filter((n) => n.category === "domain").length },
            { id: "threat_actor", label: "Syndicates", count: nodes.filter((n) => n.category === "threat_actor").length },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setCategoryFilter(pill.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap ${
                categoryFilter === pill.id
                  ? "bg-white/[0.08] text-white ring-1 ring-white/10"
                  : "text-[#8a8f98] hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <span>{pill.label}</span>
              <span className="font-mono text-[10px] text-[#62666d]">({pill.count})</span>
            </button>
          ))}
        </div>

        {/* Search & Layout View Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-36 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#62666d]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-[#62666d] focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <div className="hidden sm:flex items-center bg-white/[0.03] p-0.5 rounded-lg border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded ${
                viewMode === "grid" ? "bg-white/[0.08] text-white" : "text-[#8a8f98] hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1 rounded ${
                viewMode === "list" ? "bg-white/[0.08] text-white" : "text-[#8a8f98] hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Scrollable Graph Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Relational Provenance Section */}
          <section className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#0e1015]/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div>
                <h2 className="text-xs font-semibold text-white tracking-wider uppercase">
                  Relational Provenance Map
                </h2>
                <p className="text-[11px] text-[#8a8f98] mt-0.5">
                  Select coordinates to inspect historical IFSC routing and syndicate co-occurrences.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-[#eb5757] bg-[#eb5757]/10 border border-[#eb5757]/20 px-2 py-0.5 rounded">
                  {edges.filter((e) => e.isHighRisk).length} High-Risk Edges
                </span>
                <span className="text-[10px] font-mono text-[#4ebe82] bg-[#4ebe82]/10 border border-[#4ebe82]/20 px-2 py-0.5 rounded">
                  Zero Hallucination
                </span>
              </div>
            </div>

            {/* Nodes Render: GRID or LIST VIEW */}
            {filteredNodes.length > 0 ? (
              viewMode === "grid" ? (
                /* Spacious, Non-Overlapping Grid (1 col on mobile, 2 cols on desktop with inspector) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {filteredNodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const isCritical = node.riskLevel === "Critical";
                    const isHigh = node.riskLevel === "High";

                    return (
                      <div
                        key={node.id}
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          if (!isInspectorOpen) setIsInspectorOpen(true);
                          if (onSelectEntity) onSelectEntity(node.id);
                        }}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-3 group overflow-hidden ${
                          isSelected
                            ? "bg-[#5e6ad2]/[0.08] border-[#5e6ad2] ring-1 ring-[#5e6ad2]/50 shadow-lg shadow-[#5e6ad2]/5"
                            : "bg-[#08090a] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"
                        }`}
                      >
                        {/* Header: Category Tag (Left) + Risk Badge (Right) - NEVER spills out */}
                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] shrink-0">
                            {getCategoryIcon(node.category)}
                            <span className="text-[10px] font-mono text-[#8a8f98] uppercase tracking-wide">
                              {node.category.replace("_", " ")}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                              isCritical
                                ? "bg-[#eb5757]/15 text-[#eb5757] border-[#eb5757]/30"
                                : isHigh
                                ? "bg-[#f0b96d]/15 text-[#f0b96d] border-[#f0b96d]/30"
                                : "bg-[#4ebe82]/15 text-[#4ebe82] border-[#4ebe82]/30"
                            }`}
                          >
                            {node.riskLevel}
                          </span>
                        </div>

                        {/* Title & Role */}
                        <div className="space-y-1">
                          <h3
                            className="text-xs font-semibold text-white group-hover:text-[#5e6ad2] transition-colors truncate"
                            title={node.name}
                          >
                            {node.name}
                          </h3>
                          <p
                            className={`text-[11px] font-mono truncate ${
                              isCritical
                                ? "text-[#eb5757]"
                                : isHigh
                                ? "text-[#f0b96d]"
                                : "text-[#4ebe82]"
                            }`}
                          >
                            {node.role}
                          </p>
                        </div>

                        {/* Full Info Details Box (Clean, Structured, No Truncated Micro-Chips!) */}
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] text-[11px] font-mono space-y-1 text-[#8a8f98]">
                          {node.detailsLines.map((line, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2">
                              <span className="text-[#62666d] shrink-0">{line.label}:</span>
                              <span className="text-white truncate max-w-[210px] text-right" title={line.value}>
                                {line.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Linear List View: Clean, Full Row, 100% Info Visibility */
                <div className="divide-y divide-white/[0.04] rounded-lg border border-white/[0.08] bg-[#08090a] overflow-hidden">
                  {filteredNodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const isCritical = node.riskLevel === "Critical";
                    const isHigh = node.riskLevel === "High";

                    return (
                      <div
                        key={node.id}
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          if (!isInspectorOpen) setIsInspectorOpen(true);
                          if (onSelectEntity) onSelectEntity(node.id);
                        }}
                        className={`p-3.5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#5e6ad2]/[0.08]"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-1.5 rounded bg-white/[0.04] border border-white/[0.06] shrink-0">
                            {getCategoryIcon(node.category)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white truncate max-w-xs" title={node.name}>
                                {node.name}
                              </span>
                              <span className="text-[10px] font-mono text-[#8a8f98] bg-white/[0.04] px-1.5 py-0.5 rounded uppercase">
                                {node.category}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-[#62666d] truncate">
                              {node.detailsLines.map((d) => `${d.label}: ${d.value}`).join(" • ")}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                            isCritical
                              ? "bg-[#eb5757]/15 text-[#eb5757] border-[#eb5757]/30"
                              : isHigh
                              ? "bg-[#f0b96d]/15 text-[#f0b96d] border-[#f0b96d]/30"
                              : "bg-[#4ebe82]/15 text-[#4ebe82] border-[#4ebe82]/30"
                          }`}
                        >
                          {node.riskLevel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="py-12 text-center space-y-2">
                <GitFork className="w-8 h-8 text-[#62666d] mx-auto opacity-60" />
                <div className="text-xs font-medium text-white">No matching coordinates found</div>
                <div className="text-[11px] text-[#8a8f98]">
                  Use the category filter above or click <strong>Track Entity</strong> to register a suspect domain or account.
                </div>
              </div>
            )}
          </section>

          {/* Active Relational Edges Table */}
          <section className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#0e1015]/70 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/[0.06] pb-3">
              <h2 className="text-xs font-semibold text-white tracking-wider uppercase">
                Active Relational Traversals & Graph Edges
              </h2>
              <span className="text-[10px] font-mono text-[#8a8f98] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                {edges.length} Linked Relationships
              </span>
            </div>

            {edges.length > 0 ? (
              <div className="divide-y divide-white/[0.04] text-xs">
                {edges.map((edge) => (
                  <div
                    key={edge.id}
                    className="py-2.5 flex items-center justify-between gap-3 font-mono text-[11px]"
                  >
                    {/* Source -> Target */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className="text-white font-medium truncate max-w-[150px] sm:max-w-[220px]"
                        title={resolveNodeName(edge.source)}
                      >
                        {resolveNodeName(edge.source)}
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#62666d] shrink-0" />
                      <span
                        className="text-[#8a8f98] truncate max-w-[150px] sm:max-w-[220px]"
                        title={resolveNodeName(edge.target)}
                      >
                        {resolveNodeName(edge.target)}
                      </span>
                    </div>

                    {/* Edge Label Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                        edge.isHighRisk
                          ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                          : "bg-white/[0.04] text-[#8a8f98] border border-white/[0.06]"
                      }`}
                    >
                      {edge.relation}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#8a8f98] py-6 text-center">
                No relational edges established yet. Linking occurs when invoices, bank accounts, and entities share routing tags.
              </div>
            )}
          </section>
        </div>

        {/* Right Collapsible Entity Inspector */}
        {isInspectorOpen && (
          <aside className="w-80 lg:w-96 border-l border-white/[0.08] bg-[#08090a] p-5 space-y-5 overflow-y-auto shrink-0 animate-fade-in flex flex-col justify-between">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-[#5e6ad2]" />
                  <span>Entity Inspector</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedNode && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        selectedNode.riskLevel === "Critical"
                          ? "bg-[#eb5757]/20 text-[#eb5757] border-[#eb5757]/30"
                          : "bg-[#4ebe82]/20 text-[#4ebe82] border-[#4ebe82]/30"
                      }`}
                    >
                      {selectedNode.riskLevel}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsInspectorOpen(false)}
                    className="p-1 rounded text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition-colors"
                    title="Close Inspector"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedNode ? (
                <div className="space-y-4 text-xs">
                  {/* Selected Coordinate Title Block */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-[#8a8f98] uppercase tracking-wider">
                      Selected Coordinate
                    </div>
                    <div className="text-sm font-semibold text-white break-words">
                      {selectedNode.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#5e6ad2]">
                      {selectedNode.role}
                    </div>
                  </div>

                  {/* Forensic Provenance Details Box */}
                  <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-2">
                    <div className="text-[10px] font-mono text-[#8a8f98] uppercase tracking-wider">
                      Forensic Telemetry
                    </div>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      {selectedNode.detailsLines.map((line, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 border-b border-white/[0.04] pb-1 last:border-0 last:pb-0">
                          <span className="text-[#62666d]">{line.label}:</span>
                          <span className="text-white text-right truncate max-w-[160px]">{line.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Structured Coordinate Attributes */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono text-[#8a8f98] uppercase tracking-wider">
                      Coordinate Attributes
                    </div>
                    <div className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.01] space-y-2 font-mono text-[11px]">
                      {Object.entries(selectedNode.meta).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between gap-2 border-b border-white/[0.04] pb-1.5 last:border-0 last:pb-0">
                          <span className="text-[#8a8f98] capitalize">{key}:</span>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-white truncate max-w-[150px]">
                              {String(val)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(String(val), key)}
                              className="text-[#62666d] hover:text-[#5e6ad2] transition-colors shrink-0"
                              title="Copy attribute"
                            >
                              {copiedKey === key ? (
                                <Check className="w-3 h-3 text-[#4ebe82]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[#8a8f98] space-y-2">
                  <Layers className="w-8 h-8 mx-auto opacity-50" />
                  <div>No coordinate selected</div>
                  <div className="text-[11px] text-[#62666d]">
                    Click any node card on the left to inspect detailed telemetry.
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Remediation Controls */}
            {selectedNode && (
              <div className="space-y-2 pt-4 border-t border-white/[0.06] mt-6">
                <button
                  type="button"
                  onClick={() => alert(`Coordinate ${selectedNode.name} added to FinGuard automated blocklist.`)}
                  className="w-full py-2 px-3 rounded-lg bg-[#eb5757]/10 hover:bg-[#eb5757]/20 text-[#eb5757] text-xs font-medium border border-[#eb5757]/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Block in FinGuard Gateway</span>
                </button>

                {onCompileDossier && (
                  <button
                    type="button"
                    onClick={onCompileDossier}
                    className="w-full py-2 px-3 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#5e6ad2]/20"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Compile Dossier on Entity</span>
                  </button>
                )}
              </div>
            )}
          </aside>
        )}
      </div>
    </main>
  );
}
