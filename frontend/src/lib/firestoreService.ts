import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import {
  InvestigationItem,
  SupplierItem,
  EvidenceItem,
  EntityItem,
  InvoiceItem,
  InboxAlertItem,
  ReviewItem,
  DossierItem,
  INITIAL_INVOICES,
  INITIAL_EVIDENCE,
  INITIAL_SUPPLIERS,
  INITIAL_INVESTIGATIONS,
  INITIAL_ENTITIES,
  INITIAL_INBOX_ALERTS,
  INITIAL_REVIEWS,
  INITIAL_DOSSIERS,
} from "./dashboard-data";

// Helper to get or set local fallback cache
function getLocalCache<T>(key: string, defaultVal: T[]): T[] {
  if (typeof window === "undefined") return defaultVal;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalCache<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Local storage write error:", e);
  }
}

// Helper to sanitize documents before writing to Firestore (strips undefined fields)
function sanitizeDoc<T>(docData: T): Record<string, any> {
  return JSON.parse(JSON.stringify(docData));
}

/* =========================================================================
   1. INVESTIGATIONS SERVICE
========================================================================= */

export async function addInvestigationDoc(
  workspaceId: string,
  item: InvestigationItem
): Promise<void> {
  const localKey = `sentinel_${workspaceId}_investigations`;
  const existing = getLocalCache<InvestigationItem>(localKey, []);
  setLocalCache(localKey, [item, ...existing.filter((i) => i.id !== item.id)]);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "workspaces", workspaceId, "investigations", item.id), sanitizeDoc(item));
    } catch (e) {
      console.warn("Firestore write investigation error:", e);
    }
  }
}

export function subscribeInvestigations(
  workspaceId: string,
  onUpdate: (items: InvestigationItem[]) => void
): Unsubscribe | (() => void) {
  const localKey = `sentinel_${workspaceId}_investigations`;

  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, "workspaces", workspaceId, "investigations");
      return onSnapshot(
        q,
        (snapshot) => {
          const items: InvestigationItem[] = [];
          snapshot.forEach((d) => items.push(d.data() as InvestigationItem));
          setLocalCache(localKey, items);
          onUpdate(items);
        },
        (error) => {
          console.warn("Firestore snapshot error, falling back to local:", error);
          onUpdate(getLocalCache<InvestigationItem>(localKey, []));
        }
      );
    } catch (e) {
      console.warn("Firestore subscribe exception:", e);
    }
  }

  // Local fallback
  const cached = getLocalCache<InvestigationItem>(localKey, []);
  onUpdate(cached);
  return () => {};
}

/* =========================================================================
   2. SUPPLIERS SERVICE
========================================================================= */

export async function addSupplierDoc(
  workspaceId: string,
  supplier: SupplierItem
): Promise<void> {
  const localKey = `sentinel_${workspaceId}_suppliers`;
  const existing = getLocalCache<SupplierItem>(localKey, []);
  setLocalCache(localKey, [supplier, ...existing.filter((s) => s.id !== supplier.id)]);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "workspaces", workspaceId, "suppliers", supplier.id), sanitizeDoc(supplier));
    } catch (e) {
      console.warn("Firestore write supplier error:", e);
    }
  }
}

export function subscribeSuppliers(
  workspaceId: string,
  onUpdate: (items: SupplierItem[]) => void
): Unsubscribe | (() => void) {
  const localKey = `sentinel_${workspaceId}_suppliers`;

  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, "workspaces", workspaceId, "suppliers");
      return onSnapshot(
        q,
        (snapshot) => {
          const items: SupplierItem[] = [];
          snapshot.forEach((d) => items.push(d.data() as SupplierItem));
          setLocalCache(localKey, items);
          onUpdate(items);
        },
        (error) => {
          console.warn("Firestore suppliers snapshot error:", error);
          onUpdate(getLocalCache<SupplierItem>(localKey, []));
        }
      );
    } catch (e) {
      console.warn("Firestore subscribe exception:", e);
    }
  }

  const cached = getLocalCache<SupplierItem>(localKey, []);
  onUpdate(cached);
  return () => {};
}

/* =========================================================================
   3. EVIDENCE VAULT SERVICE
========================================================================= */

export async function addEvidenceDoc(
  workspaceId: string,
  evidence: EvidenceItem
): Promise<void> {
  const localKey = `sentinel_${workspaceId}_evidence`;
  const existing = getLocalCache<EvidenceItem>(localKey, []);
  setLocalCache(localKey, [evidence, ...existing.filter((e) => e.id !== evidence.id)]);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "workspaces", workspaceId, "evidence", evidence.id), sanitizeDoc(evidence));
    } catch (e) {
      console.warn("Firestore write evidence error:", e);
    }
  }
}

export function subscribeEvidence(
  workspaceId: string,
  onUpdate: (items: EvidenceItem[]) => void
): Unsubscribe | (() => void) {
  const localKey = `sentinel_${workspaceId}_evidence`;

  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, "workspaces", workspaceId, "evidence");
      return onSnapshot(
        q,
        (snapshot) => {
          const items: EvidenceItem[] = [];
          snapshot.forEach((d) => items.push(d.data() as EvidenceItem));
          setLocalCache(localKey, items);
          onUpdate(items);
        },
        (error) => {
          console.warn("Firestore evidence snapshot error:", error);
          onUpdate(getLocalCache<EvidenceItem>(localKey, []));
        }
      );
    } catch (e) {
      console.warn("Firestore subscribe exception:", e);
    }
  }

  const cached = getLocalCache<EvidenceItem>(localKey, []);
  onUpdate(cached);
  return () => {};
}

/* =========================================================================
   4. TRUSTGRAPH ENTITIES SERVICE
========================================================================= */

export async function addEntityDoc(
  workspaceId: string,
  entity: EntityItem
): Promise<void> {
  const localKey = `sentinel_${workspaceId}_entities`;
  const existing = getLocalCache<EntityItem>(localKey, []);
  setLocalCache(localKey, [entity, ...existing.filter((e) => e.id !== entity.id)]);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "workspaces", workspaceId, "entities", entity.id), sanitizeDoc(entity));
    } catch (e) {
      console.warn("Firestore write entity error:", e);
    }
  }
}

export function subscribeEntities(
  workspaceId: string,
  onUpdate: (items: EntityItem[]) => void
): Unsubscribe | (() => void) {
  const localKey = `sentinel_${workspaceId}_entities`;

  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, "workspaces", workspaceId, "entities");
      return onSnapshot(
        q,
        (snapshot) => {
          const items: EntityItem[] = [];
          snapshot.forEach((d) => items.push(d.data() as EntityItem));
          setLocalCache(localKey, items);
          onUpdate(items);
        },
        (error) => {
          console.warn("Firestore entities snapshot error:", error);
          onUpdate(getLocalCache<EntityItem>(localKey, []));
        }
      );
    } catch (e) {
      console.warn("Firestore subscribe exception:", e);
    }
  }

  const cached = getLocalCache<EntityItem>(localKey, []);
  onUpdate(cached);
  return () => {};
}

export async function updateInvestigationDoc(
  workspaceId: string,
  investigation: InvestigationItem
): Promise<void> {
  await addInvestigationDoc(workspaceId, investigation);
}

export async function updateSupplierDoc(
  workspaceId: string,
  supplier: SupplierItem
): Promise<void> {
  await addSupplierDoc(workspaceId, supplier);
}

export async function updateEvidenceDoc(
  workspaceId: string,
  evidence: EvidenceItem
): Promise<void> {
  await addEvidenceDoc(workspaceId, evidence);
}

export async function updateEntityDoc(
  workspaceId: string,
  entity: EntityItem
): Promise<void> {
  await addEntityDoc(workspaceId, entity);
}

/* =========================================================================
   5. INVOICES SERVICE
========================================================================= */

export async function addInvoiceDoc(
  workspaceId: string,
  invoice: InvoiceItem
): Promise<void> {
  const localKey = `sentinel_${workspaceId}_invoices`;
  const existing = getLocalCache<InvoiceItem>(localKey, []);
  setLocalCache(localKey, [invoice, ...existing.filter((i) => i.id !== invoice.id)]);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "workspaces", workspaceId, "invoices", invoice.id), sanitizeDoc(invoice));
    } catch (e) {
      console.warn("Firestore write invoice error:", e);
    }
  }
}

export async function updateInvoiceDoc(
  workspaceId: string,
  invoice: InvoiceItem
): Promise<void> {
  await addInvoiceDoc(workspaceId, invoice);
}

export function subscribeInvoices(
  workspaceId: string,
  onUpdate: (items: InvoiceItem[]) => void
): Unsubscribe | (() => void) {
  const localKey = `sentinel_${workspaceId}_invoices`;

  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, "workspaces", workspaceId, "invoices");
      return onSnapshot(
        q,
        (snapshot) => {
          const items: InvoiceItem[] = [];
          snapshot.forEach((d) => items.push(d.data() as InvoiceItem));
          setLocalCache(localKey, items);
          onUpdate(items);
        },
        (error) => {
          console.warn("Firestore invoices snapshot error:", error);
          onUpdate(getLocalCache<InvoiceItem>(localKey, []));
        }
      );
    } catch (e) {
      console.warn("Firestore subscribe exception:", e);
    }
  }

  const cached = getLocalCache<InvoiceItem>(localKey, []);
  onUpdate(cached);
  return () => {};
}

/* =========================================================================
   6. INBOX ALERTS SERVICE
========================================================================= */

export async function addInboxAlertDoc(
  workspaceId: string,
  alert: InboxAlertItem
): Promise<void> {
  const localKey = `sentinel_${workspaceId}_inbox_alerts`;
  const existing = getLocalCache<InboxAlertItem>(localKey, []);
  setLocalCache(localKey, [alert, ...existing.filter((a) => a.id !== alert.id)]);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "workspaces", workspaceId, "inbox_alerts", alert.id), sanitizeDoc(alert));
    } catch (e) {
      console.warn("Firestore write alert error:", e);
    }
  }
}

export async function updateInboxAlertDoc(
  workspaceId: string,
  alert: InboxAlertItem
): Promise<void> {
  await addInboxAlertDoc(workspaceId, alert);
}

export function subscribeInboxAlerts(
  workspaceId: string,
  onUpdate: (items: InboxAlertItem[]) => void
): Unsubscribe | (() => void) {
  const localKey = `sentinel_${workspaceId}_inbox_alerts`;

  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, "workspaces", workspaceId, "inbox_alerts");
      return onSnapshot(
        q,
        (snapshot) => {
          const items: InboxAlertItem[] = [];
          snapshot.forEach((d) => items.push(d.data() as InboxAlertItem));
          setLocalCache(localKey, items);
          onUpdate(items);
        },
        (error) => {
          console.warn("Firestore alerts snapshot error:", error);
          onUpdate(getLocalCache<InboxAlertItem>(localKey, []));
        }
      );
    } catch (e) {
      console.warn("Firestore subscribe exception:", e);
    }
  }

  const cached = getLocalCache<InboxAlertItem>(localKey, []);
  onUpdate(cached);
  return () => {};
}

/* =========================================================================
   7. REVIEWS (DUAL-AUTH QUEUE) SERVICE
========================================================================= */

export async function addReviewDoc(
  workspaceId: string,
  review: ReviewItem
): Promise<void> {
  const localKey = `sentinel_${workspaceId}_reviews`;
  const existing = getLocalCache<ReviewItem>(localKey, []);
  setLocalCache(localKey, [review, ...existing.filter((r) => r.id !== review.id)]);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "workspaces", workspaceId, "reviews", review.id), sanitizeDoc(review));
    } catch (e) {
      console.warn("Firestore write review error:", e);
    }
  }
}

export async function updateReviewDoc(
  workspaceId: string,
  review: ReviewItem
): Promise<void> {
  await addReviewDoc(workspaceId, review);
}

export function subscribeReviews(
  workspaceId: string,
  onUpdate: (items: ReviewItem[]) => void
): Unsubscribe | (() => void) {
  const localKey = `sentinel_${workspaceId}_reviews`;

  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, "workspaces", workspaceId, "reviews");
      return onSnapshot(
        q,
        (snapshot) => {
          const items: ReviewItem[] = [];
          snapshot.forEach((d) => items.push(d.data() as ReviewItem));
          setLocalCache(localKey, items);
          onUpdate(items);
        },
        (error) => {
          console.warn("Firestore reviews snapshot error:", error);
          onUpdate(getLocalCache<ReviewItem>(localKey, []));
        }
      );
    } catch (e) {
      console.warn("Firestore subscribe exception:", e);
    }
  }

  const cached = getLocalCache<ReviewItem>(localKey, []);
  onUpdate(cached);
  return () => {};
}

/* =========================================================================
   8. INTELLIGENCE DOSSIERS SERVICE
========================================================================= */

export async function addDossierDoc(
  workspaceId: string,
  dossier: DossierItem
): Promise<void> {
  const localKey = `sentinel_${workspaceId}_dossiers`;
  const existing = getLocalCache<DossierItem>(localKey, []);
  setLocalCache(localKey, [dossier, ...existing.filter((d) => d.id !== dossier.id)]);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "workspaces", workspaceId, "dossiers", dossier.id), sanitizeDoc(dossier));
    } catch (e) {
      console.warn("Firestore write dossier error:", e);
    }
  }
}

export async function updateDossierDoc(
  workspaceId: string,
  dossier: DossierItem
): Promise<void> {
  await addDossierDoc(workspaceId, dossier);
}

export function subscribeDossiers(
  workspaceId: string,
  onUpdate: (items: DossierItem[]) => void
): Unsubscribe | (() => void) {
  const localKey = `sentinel_${workspaceId}_dossiers`;

  if (isFirebaseConfigured && db) {
    try {
      const q = collection(db, "workspaces", workspaceId, "dossiers");
      return onSnapshot(
        q,
        (snapshot) => {
          const items: DossierItem[] = [];
          snapshot.forEach((d) => items.push(d.data() as DossierItem));
          setLocalCache(localKey, items);
          onUpdate(items);
        },
        (error) => {
          console.warn("Firestore dossiers snapshot error:", error);
          onUpdate(getLocalCache<DossierItem>(localKey, []));
        }
      );
    } catch (e) {
      console.warn("Firestore subscribe exception:", e);
    }
  }

  const cached = getLocalCache<DossierItem>(localKey, []);
  onUpdate(cached);
  return () => {};
}

/* =========================================================================
   9. MANUAL SIMULATION SEEDER (EXPLICIT ON-DEMAND ONLY)
========================================================================= */
export async function seedBusinessDemoData(workspaceId: string): Promise<void> {
  INITIAL_INVESTIGATIONS.forEach((inv) => addInvestigationDoc(workspaceId, inv));
  INITIAL_SUPPLIERS.forEach((sup) => addSupplierDoc(workspaceId, sup));
  INITIAL_EVIDENCE.forEach((ev) => addEvidenceDoc(workspaceId, ev));
  INITIAL_INVOICES.forEach((inv) => addInvoiceDoc(workspaceId, inv));
  INITIAL_ENTITIES.forEach((ent) => addEntityDoc(workspaceId, ent));
  INITIAL_INBOX_ALERTS.forEach((alrt) => addInboxAlertDoc(workspaceId, alrt));
  INITIAL_REVIEWS.forEach((rev) => addReviewDoc(workspaceId, rev));
  INITIAL_DOSSIERS.forEach((dos) => addDossierDoc(workspaceId, dos));
}

export function clearAllWorkspaceData(workspaceId: string): void {
  const keys = [
    `sentinel_${workspaceId}_investigations`,
    `sentinel_${workspaceId}_suppliers`,
    `sentinel_${workspaceId}_evidence`,
    `sentinel_${workspaceId}_entities`,
    `sentinel_${workspaceId}_invoices`,
    `sentinel_${workspaceId}_inbox_alerts`,
    `sentinel_${workspaceId}_reviews`,
    `sentinel_${workspaceId}_dossiers`,
  ];
  if (typeof window !== "undefined") {
    keys.forEach((k) => {
      localStorage.removeItem(k);
      localStorage.setItem(k, JSON.stringify([]));
    });
  }
}





