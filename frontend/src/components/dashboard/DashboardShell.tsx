"use client";

import { useState, useEffect, useMemo } from "react";
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
import { TrustGraphWorkspace } from "./TrustGraphWorkspace";
import { GmailRadarWorkspace } from "./GmailRadarWorkspace";
import { ProfileSettingsPane } from "./ProfileSettingsPane";
import { CommandPalette } from "./CommandPalette";
import { QuickCreateModal } from "./QuickCreateModal";
import { useAuth } from "@/context/AuthContext";
import { generateIncidentDossier, GmailScannedEmail } from "@/lib/apiClient";
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
  addInvoiceDoc,
  addInboxAlertDoc,
  addReviewDoc,
  addDossierDoc,
  updateInvestigationDoc,
  updateSupplierDoc,
  updateEvidenceDoc,
  updateEntityDoc,
  updateInvoiceDoc,
  updateInboxAlertDoc,
  updateReviewDoc,
  updateDossierDoc,
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
    "investigation" | "supplier" | "invoice" | "upload" | "entity"
  >("investigation");
  const [isStarred, setIsStarred] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleOpenQuickCreate = (
    tab?: "investigation" | "supplier" | "invoice" | "upload" | "entity"
  ) => {
    if (tab) {
      setQuickCreateTab(tab);
    } else if (activeView === "suppliers") {
      setQuickCreateTab("supplier");
    } else if (activeView === "invoices") {
      setQuickCreateTab("invoice");
    } else if (activeView === "evidence" || activeView === "scamshield") {
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

  const handleCreateInvoice = async (
    invoice: InvoiceItem,
    alert?: InboxAlertItem,
    review?: ReviewItem
  ) => {
    await addInvoiceDoc(activeWsId, invoice);
    setSelectedInvoiceId(invoice.id);
    if (alert) {
      await addInboxAlertDoc(activeWsId, alert);
    }
    if (review) {
      await addReviewDoc(activeWsId, review);
    }
    setActiveView("invoices");
  };

  const handleAlertToInvestigation = (alert: InboxAlertItem) => {
    handleCreateInvestigation(
      `Investigate Alert: ${alert.title}`,
      alert.affectedEntity,
      alert.amount || "$485,000.00"
    );
  };

  const handleCompileDossier = async (customInv?: InvestigationItem) => {
    const inv = customInv || currentInvestigation;
    const sup = currentSupplier || (suppliers.length > 0 ? suppliers[0] : null);
    const invc = currentInvoice || (invoices.length > 0 ? invoices[0] : null);

    const investigationId = inv?.id || invc?.id || `INC-${Math.floor(100 + Math.random() * 900)}`;
    const supplierName = inv?.targetEntity || invc?.vendorName || sup?.name || "Asterion Supplies Pvt Ltd";
    const accountNumber = invc?.payeeAccount || sup?.accountNumber || "999988887777";
    const ifsc = invc?.payeeIfsc || sup?.ifsc || "DEMO0002222";
    const amount = inv?.amount || invc?.amount || "$485,000.00";

    const dossierId = `DOS-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const apiResult = await generateIncidentDossier({
        investigation_id: investigationId,
        supplier_name: supplierName,
        account_number: accountNumber,
        ifsc_or_iban: ifsc,
        evidence_text: inv?.description || invc?.discrepancyNote || `Urgent payment diversion identified for ${supplierName}. Bank verification mismatch on IFSC ${ifsc}.`,
      });

      const newDossier: DossierItem = {
        id: dossierId,
        title: inv
          ? `Executive Threat Dossier: ${inv.title}`
          : invc
          ? `Executive Fraud Interception Dossier: ${invc.id} (${invc.vendorName})`
          : `Unified Threat Dossier: ${supplierName} Fraud Interception`,
        classification: "RESTRICTED // TREASURY FRAUD INTEL",
        generatedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        associatedIncidentId: investigationId,
        targetSyndicate: (apiResult.graph_topology as any)?.syndicate_name || "Crimson Typhoon / Scattered Spider TC-948",
        preventedLoss: amount,
        threatScore: apiResult.overall_threat_score || 94,
        executiveSummary: apiResult.executive_summary || `Consolidated forensic analysis confirmed active payment interception targeting ${supplierName}. FinGuard intercepted banking diversion (mule routing), and ScamShield AI flagged urgent social engineering. Outgoing wire blocked.`,
        provenanceEntitiesCount: 5,
        status: "Active Brief",
        actionableRecommendations: apiResult.actionable_remediation && apiResult.actionable_remediation.length > 0
          ? apiResult.actionable_remediation
          : [
              "Freeze all pending wire/ACH disbursements to unverified beneficiary accounts.",
              "Conduct out-of-band biometric/voice verification with authorized supplier executive.",
              "Report destination mule account and IFSC routing code to Reserve Bank / Law Enforcement portal.",
              "Lock down vendor payment routing in FinGuard master ledger pending dual authorization.",
            ],
        isRead: false,
      };

      await addDossierDoc(activeWsId, newDossier);
      setSelectedDossierId(dossierId);
      setActiveView("reports");
    } catch (err) {
      console.warn("Error compiling dossier:", err);
    }
  };

  const handleQuarantineThreat = async (threatData: {
    email: GmailScannedEmail;
    invoice?: InvoiceItem;
    alert?: InboxAlertItem;
    evidence?: EvidenceItem;
  }) => {
    if (threatData.alert) {
      await addInboxAlertDoc(activeWsId, threatData.alert);
    }
    if (threatData.evidence) {
      await addEvidenceDoc(activeWsId, threatData.evidence);
    }
    if (threatData.invoice) {
      await addInvoiceDoc(activeWsId, threatData.invoice);
    }
  };

  // Domain-wide Snooze toggler
  const handleToggleSnooze = (domain: string, id: string) => {
    if (domain === "inbox") {
      setAlerts((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          const updated = { ...a, isSnoozed: !a.isSnoozed };
          updateInboxAlertDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "investigations") {
      setInvestigations((prev) =>
        prev.map((i) => {
          if (i.id !== id) return i;
          const updated = { ...i, isSnoozed: !i.isSnoozed };
          updateInvestigationDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "finguard") {
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const updated = { ...r, isSnoozed: !r.isSnoozed };
          updateReviewDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "suppliers") {
      setSuppliers((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const updated = { ...s, isSnoozed: !s.isSnoozed };
          updateSupplierDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "invoices") {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== id) return inv;
          const updated = { ...inv, isSnoozed: !inv.isSnoozed };
          updateInvoiceDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "evidence" || domain === "scamshield") {
      setEvidenceList((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          const updated = { ...e, isSnoozed: !e.isSnoozed };
          updateEvidenceDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "graph") {
      setEntities((prev) =>
        prev.map((ent) => {
          if (ent.id !== id) return ent;
          const updated = { ...ent, isSnoozed: !ent.isSnoozed };
          updateEntityDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "reports") {
      setDossiers((prev) =>
        prev.map((d) => {
          if (d.id !== id) return d;
          const updated = { ...d, isSnoozed: !d.isSnoozed };
          updateDossierDoc(activeWsId, updated);
          return updated;
        })
      );
    }
  };

  // Domain-wide Read state toggler
  const handleToggleRead = (domain: string, id: string, forceReadState?: boolean) => {
    if (domain === "inbox") {
      setAlerts((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          const newRead = forceReadState !== undefined ? forceReadState : !(a.isRead ?? (a.status !== "Action Required"));
          const updated = { ...a, isRead: newRead };
          updateInboxAlertDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "investigations") {
      setInvestigations((prev) =>
        prev.map((i) => {
          if (i.id !== id) return i;
          const newRead = forceReadState !== undefined ? forceReadState : !(i.isRead ?? (i.status !== "Under Review" && i.status !== "Blocked"));
          const updated = { ...i, isRead: newRead };
          updateInvestigationDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "finguard") {
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const newRead = forceReadState !== undefined ? forceReadState : !(r.isRead ?? (r.status !== "Pending Dual-Auth"));
          const updated = { ...r, isRead: newRead };
          updateReviewDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "suppliers") {
      setSuppliers((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const newRead = forceReadState !== undefined ? forceReadState : !(s.isRead ?? (s.status === "Verified"));
          const updated = { ...s, isRead: newRead };
          updateSupplierDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "invoices") {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== id) return inv;
          const newRead = forceReadState !== undefined ? forceReadState : !(inv.isRead ?? (inv.status === "Cleared"));
          const updated = { ...inv, isRead: newRead };
          updateInvoiceDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "evidence" || domain === "scamshield") {
      setEvidenceList((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          const newRead = forceReadState !== undefined ? forceReadState : !(e.isRead ?? (e.status === "Verified"));
          const updated = { ...e, isRead: newRead };
          updateEvidenceDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "graph") {
      setEntities((prev) =>
        prev.map((ent) => {
          if (ent.id !== id) return ent;
          const newRead = forceReadState !== undefined ? forceReadState : !(ent.isRead ?? (ent.riskLevel === "Verified"));
          const updated = { ...ent, isRead: newRead };
          updateEntityDoc(activeWsId, updated);
          return updated;
        })
      );
    } else if (domain === "reports") {
      setDossiers((prev) =>
        prev.map((d) => {
          if (d.id !== id) return d;
          const newRead = forceReadState !== undefined ? forceReadState : !(d.isRead ?? (d.status !== "Active Brief"));
          const updated = { ...d, isRead: newRead };
          updateDossierDoc(activeWsId, updated);
          return updated;
        })
      );
    }
  };

  // Real-time Sidebar Notification Badges
  const sidebarBadges: Record<string, string | number> = useMemo(() => {
    const unreadAlerts = alerts.filter(
      (a) => a.isSnoozed !== true && (a.isRead === false || a.status === "Action Required")
    ).length;
    const unreadInvs = investigations.filter(
      (i) => i.isSnoozed !== true && (i.isRead === false || i.status === "Under Review" || i.status === "Blocked")
    ).length;
    const pendingReviews = reviews.filter(
      (r) => r.isSnoozed !== true && (r.isRead === false || r.status === "Pending Dual-Auth")
    ).length;
    const alertSuppliers = suppliers.filter(
      (s) => s.isSnoozed !== true && (s.isRead === false || s.status === "Discrepancy Detected" || s.riskLevel === "Critical")
    ).length;
    const alertInvoices = invoices.filter(
      (inv) => inv.isSnoozed !== true && (inv.isRead === false || inv.status === "Payment Held" || inv.status === "Discrepancy")
    ).length;
    const alertEvidence = evidenceList.filter(
      (e) => e.isSnoozed !== true && (e.isRead === false || e.status === "Flagged")
    ).length;
    const alertEntities = entities.filter(
      (ent) => ent.isSnoozed !== true && (ent.isRead === false || ent.riskLevel === "Critical")
    ).length;
    const activeDossiers = dossiers.filter(
      (d) => d.isSnoozed !== true && (d.isRead === false || d.status === "Active Brief")
    ).length;

    return {
      command: (unreadAlerts > 0 || unreadInvs > 0 || alertInvoices > 0) ? "Active" : "",
      inbox: unreadAlerts || "",
      investigations: unreadInvs || "",
      finguard: pendingReviews || "",
      suppliers: alertSuppliers || "",
      invoices: alertInvoices || "",
      evidence: alertEvidence || "",
      scamshield: alertEvidence || "",
      graph: alertEntities || "",
      reports: activeDossiers || "",
    };
  }, [alerts, investigations, reviews, suppliers, invoices, evidenceList, entities, dossiers]);

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
        badges={sidebarBadges}
        onSelectView={(view) => {
          setActiveView(view);
          setIsEditingProfile(false);
          // Auto-collapse middle pane for full-width views (graph, pulse, gmail radar)
          if (view === "graph" || view === "command" || view === "scamshield") {
            setIsMiddleCollapsed(true);
          } else {
            setIsMiddleCollapsed(false);
          }

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
          handleToggleRead("investigations", id, true);
          setIsEditingProfile(false);
        }}
        selectedSupplierId={selectedSupplierId}
        onSelectSupplier={(id) => {
          setSelectedSupplierId(id);
          handleToggleRead("suppliers", id, true);
          setIsEditingProfile(false);
        }}
        selectedEvidenceId={selectedEvidenceId}
        onSelectEvidence={(id) => {
          setSelectedEvidenceId(id);
          handleToggleRead("evidence", id, true);
          setIsEditingProfile(false);
        }}
        selectedInvoiceId={selectedInvoiceId}
        onSelectInvoice={(id) => {
          setSelectedInvoiceId(id);
          handleToggleRead("invoices", id, true);
          setIsEditingProfile(false);
        }}
        selectedEntityId={selectedEntityId}
        onSelectEntity={(id) => {
          setSelectedEntityId(id);
          handleToggleRead("graph", id, true);
          setIsEditingProfile(false);
        }}
        selectedAlertId={selectedAlertId}
        onSelectAlert={(id) => {
          setSelectedAlertId(id);
          handleToggleRead("inbox", id, true);
          setIsEditingProfile(false);
        }}
        selectedReviewId={selectedReviewId}
        onSelectReview={(id) => {
          setSelectedReviewId(id);
          handleToggleRead("finguard", id, true);
          setIsEditingProfile(false);
        }}
        selectedDossierId={selectedDossierId}
        onSelectDossier={(id) => {
          setSelectedDossierId(id);
          handleToggleRead("reports", id, true);
          setIsEditingProfile(false);
        }}
        isCollapsed={isMiddleCollapsed}
        onToggleCollapse={() => setIsMiddleCollapsed(true)}
        onOpenQuickCreate={handleOpenQuickCreate}
        onCompileDossier={handleCompileDossier}
        onToggleRead={handleToggleRead}
        onToggleSnooze={handleToggleSnooze}
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
          onCompileDossier={handleCompileDossier}
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
      ) : activeView === "scamshield" ? (
        <GmailRadarWorkspace
          workspaceId={activeWsId}
          onQuarantineThreat={handleQuarantineThreat}
          onSelectView={(v) => setActiveView(v)}
        />
      ) : activeView === "evidence" ? (
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
          suppliers={suppliers}
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
      ) : activeView === "graph" ? (
        <TrustGraphWorkspace
          entities={entities}
          suppliers={suppliers}
          invoices={invoices}
          investigations={investigations}
          evidenceList={evidenceList}
          selectedEntityId={selectedEntityId}
          onSelectEntity={(id) => {
            setSelectedEntityId(id);
            handleToggleRead("graph", id, true);
            setIsEditingProfile(false);
          }}
          onOpenQuickCreate={handleOpenQuickCreate}
          onCompileDossier={handleCompileDossier}
          workspaceId={activeWsId}
          isMiddleCollapsed={isMiddleCollapsed}
          onToggleMiddlePane={() => setIsMiddleCollapsed(!isMiddleCollapsed)}
        />
      ) : (
        /* Default: "investigations" */
        <MainWorkspace
          investigation={currentInvestigation}
          workspaceName={activeWorkspace?.name || "Sentinel"}
          isMiddleCollapsed={isMiddleCollapsed}
          onRestoreMiddlePane={() => setIsMiddleCollapsed(false)}
          onAddComment={handleAddComment}
          onToggleStar={() => setIsStarred(!isStarred)}
          isStarred={isStarred}
          onOpenQuickCreate={() => handleOpenQuickCreate()}
          onCompileDossier={handleCompileDossier}
          suppliers={suppliers}
          evidenceList={evidenceList}
          entities={entities}
          initialTab="overview"
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
        onCreateInvoice={handleCreateInvoice}
        suppliers={suppliers}
      />
    </div>
  );
}
