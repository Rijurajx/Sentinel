"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PrimarySidebar } from "./PrimarySidebar";
import { ContextualMiddlePane } from "./ContextualMiddlePane";
import { MainWorkspace } from "./MainWorkspace";
import { SupplierWorkspace } from "./SupplierWorkspace";
import { EvidenceWorkspace } from "./EvidenceWorkspace";
import { InvoicesWorkspace } from "./InvoicesWorkspace";
import { PulseWorkspace } from "./PulseWorkspace";
import { ProfileSettingsPane } from "./ProfileSettingsPane";
import { CommandPalette } from "./CommandPalette";
import { QuickCreateModal } from "./QuickCreateModal";
import { useAuth } from "@/context/AuthContext";
import {
  InvestigationItem,
  SupplierItem,
  EvidenceItem,
  EntityItem,
  InvoiceItem,
} from "@/lib/dashboard-data";
import {
  subscribeInvestigations,
  subscribeSuppliers,
  subscribeEvidence,
  subscribeEntities,
  subscribeInvoices,
  addInvestigationDoc,
  addSupplierDoc,
  addEvidenceDoc,
  addEntityDoc,
} from "@/lib/firestoreService";

export function DashboardShell() {
  const router = useRouter();
  const { activeWorkspace, workspaces, profile, user, isLoading } = useAuth();
  const [activeView, setActiveView] = useState("inbox");

  // Route protection: Enforce onboarding for new accounts
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (!activeWorkspace && workspaces.length === 0) {
        router.push("/onboarding/workspace");
      }
    }
  }, [user, activeWorkspace, workspaces, isLoading, router]);

  // Real database-backed reactive states
  const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);

  const activeWsId = activeWorkspace?.id || "default-workspace";

  // Selected item IDs for each domain
  const [selectedInvestigationId, setSelectedInvestigationId] = useState<string>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isMiddleCollapsed, setIsMiddleCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickCreateTab, setQuickCreateTab] = useState<
    "investigation" | "supplier" | "upload" | "entity"
  >("investigation");
  const [isStarred, setIsStarred] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleOpenQuickCreate = (
    tab?: "investigation" | "supplier" | "upload" | "entity"
  ) => {
    if (tab) {
      setQuickCreateTab(tab);
    } else if (activeView === "suppliers") {
      setQuickCreateTab("supplier");
    } else if (activeView === "evidence" || activeView === "scamshield" || activeView === "invoices") {
      setQuickCreateTab("upload");
    } else if (activeView === "graph") {
      setQuickCreateTab("entity");
    } else {
      setQuickCreateTab("investigation");
    }
    setIsQuickCreateOpen(true);
  };

  // Keyboard shortcuts: 'C' opens quick create modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.key === "c" || e.key === "C") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        handleOpenQuickCreate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeView]);

  // Subscribe to real Firestore database collections for the active workspace
  useEffect(() => {
    if (!activeWsId) return;

    const unsubInv = subscribeInvestigations(activeWsId, (items) => {
      setInvestigations(items);
      if (items.length > 0) {
        setSelectedInvestigationId((prev) => {
          if (!prev || !items.some((i) => i.id === prev)) {
            return items[0].id;
          }
          return prev;
        });
      } else {
        setSelectedInvestigationId("");
      }
    });

    const unsubSup = subscribeSuppliers(activeWsId, (items) => {
      setSuppliers(items);
      if (items.length > 0) {
        setSelectedSupplierId((prev) => {
          if (!prev || !items.some((s) => s.id === prev)) {
            return items[0].id;
          }
          return prev;
        });
      }
    });

    const unsubEv = subscribeEvidence(activeWsId, (items) => {
      setEvidenceList(items);
      if (items.length > 0) {
        setSelectedEvidenceId((prev) => {
          if (!prev || !items.some((e) => e.id === prev)) {
            return items[0].id;
          }
          return prev;
        });
      }
    });

    const unsubEnt = subscribeEntities(activeWsId, (items) => {
      setEntities(items);
      if (items.length > 0) {
        setSelectedEntityId((prev) => {
          if (!prev || !items.some((e) => e.id === prev)) {
            return items[0].id;
          }
          return prev;
        });
      }
    });

    const unsubInvoices = subscribeInvoices(activeWsId, (items) => {
      setInvoices(items);
      if (items.length > 0) {
        setSelectedInvoiceId((prev) => {
          if (!prev || !items.some((inv) => inv.id === prev)) {
            return items[0].id;
          }
          return prev;
        });
      }
    });

    return () => {
      unsubInv();
      unsubSup();
      unsubEv();
      unsubEnt();
      unsubInvoices();
    };
  }, [activeWsId]);

  // Active current elements
  const currentInvestigation =
    investigations.find((i) => i.id === selectedInvestigationId) ||
    (investigations.length > 0 ? investigations[0] : null);

  const currentSupplier =
    suppliers.find((s) => s.id === selectedSupplierId) ||
    (suppliers.length > 0 ? suppliers[0] : null);

  const currentEvidence =
    evidenceList.find((e) => e.id === selectedEvidenceId) ||
    (evidenceList.length > 0 ? evidenceList[0] : null);

  const currentInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) ||
    (invoices.length > 0 ? invoices[0] : null);

  // Add Comment handler
  const handleAddComment = async (commentText: string) => {
    if (!currentInvestigation) return;
    const authorName = profile?.fullName || user?.displayName || "Analyst";
    const authorRole = profile?.roleTitle || "SecOps";

    const updatedInvestigation: InvestigationItem = {
      ...currentInvestigation,
      comments: [
        ...currentInvestigation.comments,
        {
          id: `c-${Date.now()}`,
          author: authorName,
          role: authorRole,
          content: commentText,
          time: "Just now",
        },
      ],
      activity: [
        {
          id: `act-${Date.now()}`,
          actor: authorName,
          action: `Added investigation note: "${commentText.slice(0, 40)}..."`,
          time: "Just now",
          type: "user" as const,
        },
        ...currentInvestigation.activity,
      ],
    };

    await addInvestigationDoc(activeWsId, updatedInvestigation);
  };

  // Quick Create Handlers
  const handleCreateInvestigation = async (
    title: string,
    targetEntity: string,
    amount: string
  ) => {
    const authorName = profile?.fullName || user?.displayName || "Lead Analyst";
    const authorRole = profile?.roleTitle || "SecOps";
    const newId = `INC-${Math.floor(100 + Math.random() * 900)}`;

    const newInv: InvestigationItem = {
      id: newId,
      title,
      description: `Active financial threat investigation opened for ${targetEntity}. Awaiting evidence ingestion & FinGuard bank verification check.`,
      category: "Inbox",
      status: "Under Review",
      riskScore: 70,
      riskLevel: "High",
      targetEntity,
      amount,
      detectedDate: "Just now",
      timeAgo: "Just now",
      assignee: {
        name: authorName,
        avatar: authorName.slice(0, 2).toUpperCase(),
        role: authorRole,
      },
      evidenceCount: 1,
      intelligence: {
        summary: `Investigation initialized for ${targetEntity}. Pending ScamShield parsing and cross-incident correlation check.`,
        indicators: [
          {
            label: "Investigation Initialized by Security Controller",
            confidence: 100,
            type: "warning",
            evidenceRef: "MANUAL-DISPATCH",
          },
        ],
        recommendedAction: "Upload supporting invoice PDF or vendor email to commence AI analysis.",
      },
      trustGraph: {
        nodes: [
          { id: "inv", label: newId, type: "incident", risk: "warning" },
          { id: "sup", label: targetEntity, type: "supplier", risk: "warning" },
        ],
        edges: [{ from: "inv", to: "sup", label: "INVESTIGATES", provenanceId: "MANUAL" }],
      },
      evidenceList: [
        {
          id: `ev-${Date.now()}`,
          filename: "Initial_Submission_Record.txt",
          type: "url",
          size: "2 KB",
          uploadedAt: "Just now",
          status: "Extracted",
        },
      ],
      activity: [
        {
          id: `act-${Date.now()}`,
          actor: authorName,
          action: `Created new investigation ${newId} for ${targetEntity}`,
          time: "Just now",
          type: "user",
        },
      ],
      comments: [],
    };

    await addInvestigationDoc(activeWsId, newInv);
    setSelectedInvestigationId(newId);
  };

  const handleCreateSupplier = async (supplier: SupplierItem) => {
    await addSupplierDoc(activeWsId, supplier);
    setSelectedSupplierId(supplier.id);
  };

  const handleCreateEvidence = async (evidence: EvidenceItem) => {
    await addEvidenceDoc(activeWsId, evidence);
    setSelectedEvidenceId(evidence.id);
  };

  const handleCreateEntity = async (entity: EntityItem) => {
    await addEntityDoc(activeWsId, entity);
    setSelectedEntityId(entity.id);
  };

  if (isLoading || (!activeWorkspace && workspaces.length === 0)) {
    return (
      <div className="h-screen w-screen bg-[#08090a] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#08090a] text-[#f7f8f8]">
      {/* 1. Left Sidebar — Global Navigation */}
      <PrimarySidebar
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          setIsEditingProfile(false);
          if (isMiddleCollapsed) setIsMiddleCollapsed(false);

          // Auto-focus first item of the selected view if none selected
          if (view === "suppliers" && suppliers.length > 0 && !selectedSupplierId) {
            setSelectedSupplierId(suppliers[0].id);
          } else if ((view === "evidence" || view === "scamshield") && evidenceList.length > 0 && !selectedEvidenceId) {
            setSelectedEvidenceId(evidenceList[0].id);
          } else if (view === "invoices" && invoices.length > 0 && !selectedInvoiceId) {
            setSelectedInvoiceId(invoices[0].id);
          } else if (view === "graph" && entities.length > 0 && !selectedEntityId) {
            setSelectedEntityId(entities[0].id);
          }
        }}
        isCollapsed={isLeftCollapsed}
        onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
        onOpenQuickCreate={() => handleOpenQuickCreate()}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfileSettings={() => setIsEditingProfile(true)}
      />

      {/* 2. Middle Pane — Contextual Intelligence Sub-Bar */}
      <ContextualMiddlePane
        activeView={activeView}
        investigations={investigations}
        suppliers={suppliers}
        evidenceList={evidenceList}
        entities={entities}
        invoices={invoices}
        selectedInvestigationId={selectedInvestigationId}
        onSelectInvestigation={(id) => {
          setSelectedInvestigationId(id);
          setIsEditingProfile(false);
        }}
        selectedSupplierId={selectedSupplierId}
        onSelectSupplier={(id) => {
          setSelectedSupplierId(id);
          setIsEditingProfile(false);
        }}
        selectedEvidenceId={selectedEvidenceId}
        onSelectEvidence={(id) => {
          setSelectedEvidenceId(id);
          setIsEditingProfile(false);
        }}
        selectedInvoiceId={selectedInvoiceId}
        onSelectInvoice={(id) => {
          setSelectedInvoiceId(id);
          setIsEditingProfile(false);
        }}
        selectedEntityId={selectedEntityId}
        onSelectEntity={(id) => {
          setSelectedEntityId(id);
          setIsEditingProfile(false);
        }}
        isCollapsed={isMiddleCollapsed}
        onToggleCollapse={() => setIsMiddleCollapsed(true)}
        onOpenQuickCreate={handleOpenQuickCreate}
      />

      {/* 3. Right Pane — Main Intelligence Workspace Switch */}
      {isEditingProfile ? (
        <ProfileSettingsPane onClose={() => setIsEditingProfile(false)} />
      ) : activeView === "suppliers" ? (
        <SupplierWorkspace
          supplier={currentSupplier}
          workspaceId={activeWsId}
          onOpenQuickCreate={handleOpenQuickCreate}
          onSupplierUpdated={(updated) => {
            setSuppliers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          }}
        />
      ) : activeView === "evidence" || activeView === "scamshield" ? (
        <EvidenceWorkspace
          evidence={currentEvidence}
          workspaceId={activeWsId}
          onOpenQuickCreate={handleOpenQuickCreate}
          onEvidenceUpdated={(updated) => {
            setEvidenceList((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
          }}
        />
      ) : activeView === "invoices" ? (
        <InvoicesWorkspace
          invoice={currentInvoice}
          workspaceId={activeWsId}
          onOpenQuickCreate={handleOpenQuickCreate}
          onInvoiceUpdated={(updated) => {
            setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));
          }}
        />
      ) : activeView === "command" ? (
        <PulseWorkspace
          investigations={investigations}
          suppliers={suppliers}
          evidenceList={evidenceList}
          invoices={invoices}
          onSelectView={(v) => setActiveView(v)}
        />
      ) : (
        <MainWorkspace
          investigation={currentInvestigation}
          workspaceName={activeWorkspace?.name || "Sentinel"}
          isMiddleCollapsed={isMiddleCollapsed}
          onRestoreMiddlePane={() => setIsMiddleCollapsed(false)}
          onAddComment={handleAddComment}
          onToggleStar={() => setIsStarred(!isStarred)}
          isStarred={isStarred}
          onOpenQuickCreate={() => handleOpenQuickCreate()}
          suppliers={suppliers}
          evidenceList={evidenceList}
          entities={entities}
          initialTab={activeView === "graph" ? "graph" : "overview"}
        />
      )}

      {/* Global Command Palette (⌘K) — Bound to Real Database Records */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        investigations={investigations}
        suppliers={suppliers}
        entities={entities}
        onSelectItem={(type, id) => {
          if (type === "investigation") {
            setSelectedInvestigationId(id);
            setActiveView("inbox");
          } else if (type === "supplier") {
            setSelectedSupplierId(id);
            setActiveView("suppliers");
          } else if (type === "entity") {
            setSelectedEntityId(id);
            setActiveView("graph");
          }
        }}
      />

      {/* Quick Create Modal — Full-Feature Record Creation */}
      <QuickCreateModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        initialAction={quickCreateTab}
        onCreateInvestigation={handleCreateInvestigation}
        onCreateSupplier={handleCreateSupplier}
        onCreateEvidence={handleCreateEvidence}
        onCreateEntity={handleCreateEntity}
      />
    </div>
  );
}
