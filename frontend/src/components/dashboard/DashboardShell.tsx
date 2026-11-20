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
import { InboxWorkspace } from "./InboxWorkspace";
import { ReviewWorkspace } from "./ReviewWorkspace";
import { DossierWorkspace } from "./DossierWorkspace";
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
  InboxAlertItem,
  ReviewItem,
  DossierItem,
} from "@/lib/dashboard-data";
import {
  subscribeInvestigations,
  subscribeSuppliers,
  subscribeEvidence,
  subscribeEntities,
  subscribeInvoices,
  subscribeInboxAlerts,
  subscribeReviews,
  subscribeDossiers,
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
  const [alerts, setAlerts] = useState<InboxAlertItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [dossiers, setDossiers] = useState<DossierItem[]>([]);

  const activeWsId = activeWorkspace?.id || "default-workspace";

  // Selected item IDs for each domain
  const [selectedInvestigationId, setSelectedInvestigationId] = useState<string>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [selectedAlertId, setSelectedAlertId] = useState<string>("");
  const [selectedReviewId, setSelectedReviewId] = useState<string>("");
  const [selectedDossierId, setSelectedDossierId] = useState<string>("");

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
        setSelectedSupplierId((prev) => (!prev || !items.some((s) => s.id === prev) ? items[0].id : prev));
      }
    });

    const unsubEv = subscribeEvidence(activeWsId, (items) => {
      setEvidenceList(items);
      if (items.length > 0) {
        setSelectedEvidenceId((prev) => (!prev || !items.some((e) => e.id === prev) ? items[0].id : prev));
      }
    });

    const unsubEnt = subscribeEntities(activeWsId, (items) => {
      setEntities(items);
      if (items.length > 0) {
        setSelectedEntityId((prev) => (!prev || !items.some((e) => e.id === prev) ? items[0].id : prev));
      }
    });

    const unsubInvoices = subscribeInvoices(activeWsId, (items) => {
      setInvoices(items);
      if (items.length > 0) {
        setSelectedInvoiceId((prev) => (!prev || !items.some((inv) => inv.id === prev) ? items[0].id : prev));
      }
    });

    const unsubAlerts = subscribeInboxAlerts(activeWsId, (items) => {
      setAlerts(items);
      if (items.length > 0) {
        setSelectedAlertId((prev) => (!prev || !items.some((a) => a.id === prev) ? items[0].id : prev));
      }
    });

    const unsubReviews = subscribeReviews(activeWsId, (items) => {
      setReviews(items);
      if (items.length > 0) {
        setSelectedReviewId((prev) => (!prev || !items.some((r) => r.id === prev) ? items[0].id : prev));
      }
    });

    const unsubDossiers = subscribeDossiers(activeWsId, (items) => {
      setDossiers(items);
      if (items.length > 0) {
        setSelectedDossierId((prev) => (!prev || !items.some((d) => d.id === prev) ? items[0].id : prev));
      }
    });

    return () => {
      unsubInv();
      unsubSup();
      unsubEv();
      unsubEnt();
      unsubInvoices();
      unsubAlerts();
      unsubReviews();
      unsubDossiers();
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

  const currentAlert =
    alerts.find((a) => a.id === selectedAlertId) ||
    (alerts.length > 0 ? alerts[0] : null);

  const currentReview =
    reviews.find((r) => r.id === selectedReviewId) ||
    (reviews.length > 0 ? reviews[0] : null);

  const currentDossier =
    dossiers.find((d) => d.id === selectedDossierId) ||
    (dossiers.length > 0 ? dossiers[0] : null);

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
    setActiveView("investigations");
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

  const handleAlertToInvestigation = (alert: InboxAlertItem) => {
    handleCreateInvestigation(
      `Investigate Alert: ${alert.title}`,
      alert.affectedEntity,
      alert.amount || "$485,000.00"
    );
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
          } else if (view === "inbox" && alerts.length > 0 && !selectedAlertId) {
            setSelectedAlertId(alerts[0].id);
          } else if (view === "finguard" && reviews.length > 0 && !selectedReviewId) {
            setSelectedReviewId(reviews[0].id);
          } else if (view === "reports" && dossiers.length > 0 && !selectedDossierId) {
            setSelectedDossierId(dossiers[0].id);
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
        alerts={alerts}
        reviews={reviews}
        dossiers={dossiers}
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
        selectedAlertId={selectedAlertId}
        onSelectAlert={(id) => {
          setSelectedAlertId(id);
          setIsEditingProfile(false);
        }}
        selectedReviewId={selectedReviewId}
        onSelectReview={(id) => {
          setSelectedReviewId(id);
          setIsEditingProfile(false);
        }}
        selectedDossierId={selectedDossierId}
        onSelectDossier={(id) => {
          setSelectedDossierId(id);
          setIsEditingProfile(false);
        }}
        isCollapsed={isMiddleCollapsed}
        onToggleCollapse={() => setIsMiddleCollapsed(true)}
        onOpenQuickCreate={handleOpenQuickCreate}
      />

      {/* 3. Right Pane — Dedicated Intelligence Workspace Engine */}
      {isEditingProfile ? (
        <ProfileSettingsPane onClose={() => setIsEditingProfile(false)} />
      ) : activeView === "inbox" ? (
        <InboxWorkspace
          alert={currentAlert}
          workspaceId={activeWsId}
          onConvertToInvestigation={handleAlertToInvestigation}
          onAlertUpdated={(updated) => {
            setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
          }}
        />
      ) : activeView === "finguard" ? (
        <ReviewWorkspace
          review={currentReview}
          workspaceId={activeWsId}
          onReviewUpdated={(updated) => {
            setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
          }}
        />
      ) : activeView === "reports" ? (
        <DossierWorkspace
          dossier={currentDossier}
          workspaceId={activeWsId}
          onDossierUpdated={(updated) => {
            setDossiers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
          }}
        />
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
        /* Default: "investigations" (My issues) and "graph" */
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
            setActiveView("investigations");
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
