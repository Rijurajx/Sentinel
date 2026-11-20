export interface InvestigationItem {
  id: string;
  title: string;
  description: string;
  category: "FinGuard" | "TrustGraph" | "ScamShield" | "Inbox";
  status: "Under Review" | "Critical" | "Monitoring" | "Resolved" | "Blocked" | "Correlated";
  riskScore: number; // 0-100
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  targetEntity: string;
  amount?: string;
  detectedDate: string;
  timeAgo: string;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  evidenceCount: number;
  intelligence: {
    summary: string;
    indicators: Array<{
      label: string;
      confidence: number;
      type: "danger" | "warning" | "verified";
      evidenceRef: string;
    }>;
    relatedIncidentId?: string;
    relatedIncidentTitle?: string;
    recommendedAction: string;
  };
  trustGraph: {
    nodes: Array<{
      id: string;
      label: string;
      type: "incident" | "supplier" | "domain" | "phone" | "bank";
      risk?: "danger" | "warning" | "success";
    }>;
    edges: Array<{
      from: string;
      to: string;
      label: string;
      provenanceId: string;
    }>;
  };
  evidenceList: Array<{
    id: string;
    filename: string;
    type: "pdf" | "email" | "image" | "url";
    size: string;
    uploadedAt: string;
    status: "Extracted" | "Verified" | "Anomalous" | "Flagged";
  }>;
  activity: Array<{
    id: string;
    actor: string;
    action: string;
    time: string;
    type: "system" | "user" | "alert";
  }>;
  comments: Array<{
    id: string;
    author: string;
    role: string;
    content: string;
    time: string;
  }>;
}

export interface SupplierItem {
  id: string;
  name: string;
  status: "Verified" | "Discrepancy Detected" | "Under Review";
  riskLevel: "Low" | "Critical" | "Medium";
  accountNumber: string;
  ifsc: string;
  bankBranch: string;
  totalInvoiced: string;
  lastPaymentDate: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: "Email" | "Invoice PDF" | "Screenshot" | "Domain Telemetry";
  associatedInvestigationId: string;
  uploadedAt: string;
  status: "Extracted" | "Flagged" | "Verified";
  fileSize: string;
  fileData?: string;
  mimeType?: string;
  threatSummary?: string;
  threatCategory?: string;
  severity?: string;
  urgencyTriggers?: string[];
  coercionTactics?: string[];
  extractedEntities?: Array<{
    type: string;
    value: string;
    role: string;
  }>;
}

export interface InvoiceItem {
  id: string;
  vendorName: string;
  amount: string;
  invoiceDate: string;
  dueDate: string;
  status: "Payment Held" | "Cleared" | "Under Review" | "Discrepancy";
  payeeAccount: string;
  payeeIfsc: string;
  expectedAccount?: string;
  expectedIfsc?: string;
  bankBranch?: string;
  matchStatus: "MISMATCH" | "VERIFIED" | "UNKNOWN";
  discrepancyNote?: string;
  poNumber: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: string;
    total: string;
  }>;
  associatedInvestigationId?: string;
}

export interface EntityItem {
  id: string;
  value: string;
  type: "Domain" | "Bank Account" | "Phone Number" | "Organization";
  riskLevel: "Critical" | "High" | "Medium" | "Verified";
  incidentCount: number;
  lastObserved: string;
}

export interface InboxAlertItem {
  id: string;
  title: string;
  source: "FinGuard Gateway" | "ScamShield Ingestion" | "TrustGraph Radar" | "Treasury Webhook";
  severity: "Critical" | "High" | "Medium" | "Info";
  status: "Action Required" | "Investigating" | "Dismissed";
  timestamp: string;
  summary: string;
  affectedEntity: string;
  amount?: string;
  payloadSnippet: string;
  recommendedAction: string;
}

export interface ReviewItem {
  id: string;
  title: string;
  type: "Payment Hold Override" | "Vendor Coordinate Change" | "IFSC Checksum Exception";
  requesterName: string;
  requesterRole: string;
  requestedDate: string;
  status: "Pending Dual-Auth" | "Approved" | "Rejected";
  riskTier: "Critical" | "High" | "Medium";
  amount: string;
  targetSupplier: string;
  discrepancySummary: string;
  currentCoordinates: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  proposedCoordinates: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  checks: Array<{
    name: string;
    passed: boolean;
    detail: string;
  }>;
}

export interface DossierItem {
  id: string;
  title: string;
  classification: "RESTRICTED // TREASURY FRAUD INTEL" | "CONFIDENTIAL // COMPLIANCE";
  generatedDate: string;
  associatedIncidentId: string;
  targetSyndicate: string;
  preventedLoss: string;
  threatScore: number;
  executiveSummary: string;
  provenanceEntitiesCount: number;
  status: "Active Brief" | "Submitted to Regulators" | "Archived";
  actionableRecommendations: string[];
}

export const INITIAL_INVESTIGATIONS: InvestigationItem[] = [
  {
    id: "AST-104",
    title: "Supplier Bank Account Mismatch on $485,000 Hardware Order",
    description:
      "An urgent invoice submitted under Asterion Supplies Pvt Ltd contains bank account details that differ from the trusted payment profile. Wire transfer scheduled within 2 hours.",
    category: "FinGuard",
    status: "Blocked",
    riskScore: 94,
    riskLevel: "Critical",
    targetEntity: "Asterion Supplies Pvt Ltd",
    amount: "$485,000.00",
    detectedDate: "Nov 19, 2026, 14:15 UTC",
    timeAgo: "2m ago",
    assignee: {
      name: "Rijuraj Sen",
      avatar: "RS",
      role: "Lead Threat Analyst",
    },
    evidenceCount: 3,
    intelligence: {
      summary:
        "FinGuard deterministic comparison identified that the invoice payee account (999988887777, IFSC DEMO0002222) does not match the verified supplier profile (111122223333, IFSC DEMO0001111). TrustGraph correlation additionally matched the invoice contact email domain to historical phishing campaign #104.",
      indicators: [
        {
          label: "Bank IFSC Mismatch: DEMO0002222 (Axis Connaught) != DEMO0001111 (HDFC Bandra)",
          confidence: 100,
          type: "danger",
          evidenceRef: "DOC-INV-8842",
        },
        {
          label: "Sender Domain Impersonation: asterion-supplies-billing.com",
          confidence: 96,
          type: "warning",
          evidenceRef: "EML-MSG-9921",
        },
        {
          label: "Extreme Payment Urgency: Demands wire release to clear customs",
          confidence: 91,
          type: "warning",
          evidenceRef: "EML-MSG-9921",
        },
      ],
      relatedIncidentId: "AST-103",
      relatedIncidentTitle: "Phishing Infrastructure Cluster #104",
      recommendedAction:
        "Enforce immediate payment halt on invoice INV-2024-8842. Request secondary out-of-band phone confirmation via registered procurement contact.",
    },
    trustGraph: {
      nodes: [
        { id: "inv", label: "Invoice #8842", type: "incident", risk: "danger" },
        { id: "sup", label: "Asterion Supplies", type: "supplier", risk: "warning" },
        { id: "dom", label: "asterion-supplies-billing.com", type: "domain", risk: "danger" },
        { id: "phn", label: "+91 98765 43210", type: "phone", risk: "warning" },
        { id: "bnk", label: "Acc: 9999 8888 7777", type: "bank", risk: "danger" },
      ],
      edges: [
        { from: "inv", to: "sup", label: "CLAIMS_SUPPLIER", provenanceId: "EV-01" },
        { from: "inv", to: "dom", label: "SENT_FROM", provenanceId: "EV-02" },
        { from: "dom", to: "phn", label: "MENTIONS_CONTACT", provenanceId: "EV-02" },
        { from: "inv", to: "bnk", label: "PAYMENT_TO", provenanceId: "EV-01" },
      ],
    },
    evidenceList: [
      {
        id: "ev-1",
        filename: "INV-2024-8842_Asterion.pdf",
        type: "pdf",
        size: "1.4 MB",
        uploadedAt: "10 mins ago",
        status: "Anomalous",
      },
      {
        id: "ev-2",
        filename: "Urgent_Settlement_Notice.eml",
        type: "email",
        size: "42 KB",
        uploadedAt: "8 mins ago",
        status: "Flagged",
      },
      {
        id: "ev-3",
        filename: "Routing_Slip_Screenshot.png",
        type: "image",
        size: "820 KB",
        uploadedAt: "5 mins ago",
        status: "Extracted",
      },
    ],
    activity: [
      {
        id: "act-1",
        actor: "FinGuard Verification Engine",
        action: "Blocked transaction: Account 999988887777 not registered for Asterion Supplies",
        time: "2m ago",
        type: "alert",
      },
      {
        id: "act-2",
        actor: "TrustGraph Engine",
        action: "Correlated domain asterion-supplies-billing.com to historical Incident #104",
        time: "4m ago",
        type: "system",
      },
      {
        id: "act-3",
        actor: "ScamShield Multimodal",
        action: "Extracted 5 entities from INV-2024-8842_Asterion.pdf via Gemini API",
        time: "8m ago",
        type: "system",
      },
      {
        id: "act-4",
        actor: "Rijuraj Sen",
        action: "Assigned investigation to Lead Security Queue",
        time: "9m ago",
        type: "user",
      },
    ],
    comments: [
      {
        id: "c-1",
        author: "Sarah Chen",
        role: "Head of Accounts Payable",
        content: "Hold placed on ACH queue. I reached out to David at Asterion via their registered office line; he confirmed this invoice was spoofed.",
        time: "1m ago",
      },
    ],
  },
  {
    id: "AST-103",
    title: "Domain Impersonation Campaign targeting Vendor Invoices",
    description:
      "Telemetry detected domain asterion-supplies-billing.com registered 4 days prior, spoofing the legitimate MX records of asterion-supplies.com.",
    category: "TrustGraph",
    status: "Correlated",
    riskScore: 82,
    riskLevel: "High",
    targetEntity: "asterion-supplies-billing.com",
    amount: "Lead Tracker",
    detectedDate: "Nov 19, 2026, 12:40 UTC",
    timeAgo: "1h ago",
    assignee: {
      name: "Marcus Vance",
      avatar: "MV",
      role: "Cyber Intelligence",
    },
    evidenceCount: 2,
    intelligence: {
      summary:
        "The domain registration exhibits characteristic typo-squatting and deceptive subdomains designed to mislead procurement personnel scanning email addresses quickly.",
      indicators: [
        {
          label: "Domain Age < 7 Days (Newly Registered Asset)",
          confidence: 100,
          type: "danger",
          evidenceRef: "WHOIS-LOOKUP-01",
        },
        {
          label: "Name Server Association with Known Malicious Bulletproof Host",
          confidence: 88,
          type: "warning",
          evidenceRef: "DNS-TRACE-44",
        },
      ],
      recommendedAction: "Add domain to enterprise email perimeter blocklist and alert accounts payable.",
    },
    trustGraph: {
      nodes: [
        { id: "dom", label: "asterion-supplies-billing.com", type: "domain", risk: "danger" },
        { id: "inc1", label: "Incident #104", type: "incident", risk: "warning" },
        { id: "inc2", label: "Incident #089", type: "incident", risk: "warning" },
      ],
      edges: [
        { from: "dom", to: "inc1", label: "REUSED_IN", provenanceId: "EV-03" },
        { from: "dom", to: "inc2", label: "LINKED_TO", provenanceId: "EV-04" },
      ],
    },
    evidenceList: [
      {
        id: "ev-103-1",
        filename: "whois_registration_audit.txt",
        type: "url",
        size: "14 KB",
        uploadedAt: "1 hour ago",
        status: "Flagged",
      },
    ],
    activity: [
      {
        id: "act-103-1",
        actor: "TrustGraph Crawler",
        action: "Discovered active MX record pointing to suspicious relay",
        time: "1h ago",
        type: "system",
      },
    ],
    comments: [],
  },
  {
    id: "AST-102",
    title: "Compromised Vendor Contact Telephony Reused in Phishing",
    description:
      "Phone number +91 98765 43210 appeared on the fraudulent invoice letterhead; entity normalization matched this to historical incident #089.",
    category: "TrustGraph",
    status: "Monitoring",
    riskScore: 68,
    riskLevel: "Medium",
    targetEntity: "+91 98765 43210",
    detectedDate: "Nov 19, 2026, 11:20 UTC",
    timeAgo: "3h ago",
    assignee: {
      name: "Rijuraj Sen",
      avatar: "RS",
      role: "Lead Threat Analyst",
    },
    evidenceCount: 1,
    intelligence: {
      summary:
        "The telephony identifier has surfaced across two distinct vendor impersonation attempts in the past 6 months. It operates as an unmonitored WhatsApp business handle.",
      indicators: [
        {
          label: "Virtual VOIP / Burner Number Profile",
          confidence: 84,
          type: "warning",
          evidenceRef: "TEL-AUDIT-90",
        },
      ],
      recommendedAction: "Monitor incoming messages bearing this phone number across communications.",
    },
    trustGraph: {
      nodes: [
        { id: "phn", label: "+91 98765 43210", type: "phone", risk: "warning" },
        { id: "inc", label: "Incident #089", type: "incident", risk: "warning" },
      ],
      edges: [{ from: "phn", to: "inc", label: "MENTIONED_IN", provenanceId: "EV-09" }],
    },
    evidenceList: [
      {
        id: "ev-102-1",
        filename: "Invoice_Header_Contact.png",
        type: "image",
        size: "420 KB",
        uploadedAt: "3 hours ago",
        status: "Verified",
      },
    ],
    activity: [],
    comments: [],
  },
  {
    id: "AST-101",
    title: "Quarterly IT Hardware Supply Routine Clearance",
    description:
      "Batch invoice verification for CloudCore Infrastructure Inc passed all automated FinGuard and ScamShield checks.",
    category: "ScamShield",
    status: "Resolved",
    riskScore: 12,
    riskLevel: "Low",
    targetEntity: "CloudCore Infrastructure Inc",
    amount: "$124,300.00",
    detectedDate: "Nov 19, 2026, 09:10 UTC",
    timeAgo: "5h ago",
    assignee: {
      name: "Emily Watson",
      avatar: "EW",
      role: "Finance Operations",
    },
    evidenceCount: 1,
    intelligence: {
      summary:
        "Zero discrepancies detected. Account number, routing code, and sender domain match trusted supplier profile with 100% fidelity.",
      indicators: [
        {
          label: "Account Number & Routing Code Verified",
          confidence: 100,
          type: "verified",
          evidenceRef: "SUP-REG-001",
        },
      ],
      recommendedAction: "Cleared for payment disbursement.",
    },
    trustGraph: {
      nodes: [
        { id: "sup", label: "CloudCore Inc", type: "supplier", risk: "success" },
        { id: "bnk", label: "Acc: 4444 5555 6666", type: "bank", risk: "success" },
      ],
      edges: [{ from: "sup", to: "bnk", label: "AUTHORIZED_PAYEE", provenanceId: "SUP-REG-001" }],
    },
    evidenceList: [
      {
        id: "ev-101-1",
        filename: "CloudCore_INV_Nov2026.pdf",
        type: "pdf",
        size: "620 KB",
        uploadedAt: "5 hours ago",
        status: "Verified",
      },
    ],
    activity: [],
    comments: [],
  },
];

export const INITIAL_SUPPLIERS: SupplierItem[] = [
  {
    id: "SUP-001",
    name: "Asterion Supplies Pvt Ltd",
    status: "Discrepancy Detected",
    riskLevel: "Critical",
    accountNumber: "1111 2222 3333",
    ifsc: "DEMO0001111",
    bankBranch: "HDFC Bank, Bandra West, Mumbai",
    totalInvoiced: "$1,280,000",
    lastPaymentDate: "Oct 28, 2026",
  },
  {
    id: "SUP-002",
    name: "CloudCore Infrastructure Inc",
    status: "Verified",
    riskLevel: "Low",
    accountNumber: "4444 5555 6666",
    ifsc: "SVB0000444",
    bankBranch: "Silicon Valley Bank, Sand Hill Road",
    totalInvoiced: "$3,450,000",
    lastPaymentDate: "Nov 15, 2026",
  },
  {
    id: "SUP-003",
    name: "Quantum Hardware Global",
    status: "Under Review",
    riskLevel: "Medium",
    accountNumber: "7777 8888 9999",
    ifsc: "BARC0009999",
    bankBranch: "Barclays Bank, Canary Wharf, London",
    totalInvoiced: "$620,000",
    lastPaymentDate: "Sep 12, 2026",
  },
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: "EV-01",
    title: "Urgent_Apex_Logistics_Invoice_INV-8891.pdf",
    type: "Invoice PDF",
    associatedInvestigationId: "INC-719",
    uploadedAt: "Just now",
    status: "Flagged",
    fileSize: "1.4 MB",
    threatCategory: "Invoice Diversion / Bank Spoofing",
    severity: "Critical",
    threatSummary:
      "Invoice payee coordinates diverged from master supplier profile. Beneficiary account changed to 998877665544 with invalid IFSC FAKEX009999.",
    urgencyTriggers: [
      "Immediate Wire Required to Avoid Port Detention Fees",
      "Demands Settlement within 4 Hours",
    ],
    coercionTactics: [
      "Supply Chain Blockade Threat",
      "Impersonated Freight Forwarding Authorization",
    ],
    extractedEntities: [
      { type: "Supplier", value: "Apex Logistics International", role: "Alleged Sender" },
      { type: "Payee Account", value: "998877665544", role: "Mule Account" },
      { type: "IFSC Code", value: "FAKEX009999", role: "Invalid Clearing Code" },
      { type: "Invoice Total", value: "$485,000.00", role: "Target Wire Volume" },
    ],
  },
  {
    id: "EV-02",
    title: "Executive_Impersonation_Wire_Screenshot.png",
    type: "Screenshot",
    associatedInvestigationId: "INC-719",
    uploadedAt: "10 mins ago",
    status: "Flagged",
    fileSize: "820 KB",
    threatCategory: "Business Email Compromise (BEC)",
    severity: "Critical",
    threatSummary:
      "CEO David Vance persona spoofed requesting an emergency off-ledger wire transfer to an unverified beneficiary to expedite logistics clearance.",
    urgencyTriggers: [
      "Confidential Acquisition / Strict Secrecy Demanded",
      "Bypass Standard Procurement Dual-Signoff",
    ],
    coercionTactics: [
      "Executive Authority Impersonation",
      "Artificial Time Window Constraint",
    ],
    extractedEntities: [
      { type: "Impersonated Exec", value: "David Vance (CEO)", role: "Persona" },
      { type: "Routing Code", value: "FAKEX009999", role: "Destination Bank" },
      { type: "Email", value: "ceo-office@apex-logistics-urgent.com", role: "Lookalike Domain" },
    ],
  },
  {
    id: "EV-03",
    title: "INV-2024-8842_Asterion_Discrepancy.pdf",
    type: "Invoice PDF",
    associatedInvestigationId: "AST-104",
    uploadedAt: "25 mins ago",
    status: "Flagged",
    fileSize: "1.2 MB",
    threatCategory: "Vendor Account Substitution",
    severity: "Critical",
    threatSummary:
      "Payee account 999988887777 (Axis Connaught) does not match Asterion registered account 111122223333 (HDFC Bandra).",
    urgencyTriggers: ["Customs Clearance Penalty Imminent"],
    coercionTactics: ["Time-sensitive release ultimatum"],
    extractedEntities: [
      { type: "Supplier", value: "Asterion Supplies Pvt Ltd", role: "Target Vendor" },
      { type: "Payee Account", value: "999988887777", role: "Diverted Account" },
      { type: "IFSC Code", value: "DEMO0002222", role: "Axis Connaught" },
    ],
  },
  {
    id: "EV-04",
    title: "CloudCore_Routine_Service_Slip.pdf",
    type: "Invoice PDF",
    associatedInvestigationId: "AST-101",
    uploadedAt: "5 hours ago",
    status: "Verified",
    fileSize: "620 KB",
    threatCategory: "Benign Procurement",
    severity: "Low",
    threatSummary:
      "Routine recurring monthly cloud compute invoice. All banking coordinates perfectly match verified profile with Barcode & PO signature match.",
    urgencyTriggers: [],
    coercionTactics: [],
    extractedEntities: [
      { type: "Supplier", value: "CloudCore Infrastructure Inc", role: "Verified Payee" },
      { type: "Payee Account", value: "444455556666", role: "Verified Account" },
      { type: "IFSC / IBAN", value: "SVB0000444", role: "SVB Sand Hill" },
    ],
  },
];

export const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "INV-8891",
    vendorName: "Apex Logistics International",
    amount: "$485,000.00",
    invoiceDate: "Nov 19, 2026",
    dueDate: "Immediate (Within 4 Hours)",
    status: "Payment Held",
    payeeAccount: "998877665544",
    payeeIfsc: "FAKEX009999",
    expectedAccount: "111122223333",
    expectedIfsc: "HDFC0001234",
    bankBranch: "Unrecognized Bank Entity (Discrepancy)",
    matchStatus: "MISMATCH",
    discrepancyNote:
      "CRITICAL: Payee account does not match Master Vendor File. Clearing code FAKEX009999 is invalid under RBI / FinGuard registry.",
    poNumber: "PO-2026-9901",
    associatedInvestigationId: "INC-719",
    items: [
      {
        description: "Express Air Freight & Expedited Port Clearance - Priority Tier 1",
        quantity: 1,
        unitPrice: "$320,000.00",
        total: "$320,000.00",
      },
      {
        description: "International Customs Bond Escrow & Emergency Clearance Surcharge",
        quantity: 1,
        unitPrice: "$165,000.00",
        total: "$165,000.00",
      },
    ],
  },
  {
    id: "INV-2024-8842",
    vendorName: "Asterion Supplies Pvt Ltd",
    amount: "$485,000.00",
    invoiceDate: "Nov 18, 2026",
    dueDate: "Nov 19, 2026",
    status: "Discrepancy",
    payeeAccount: "999988887777",
    payeeIfsc: "DEMO0002222",
    expectedAccount: "111122223333",
    expectedIfsc: "DEMO0001111",
    bankBranch: "Axis Bank, Connaught Place (Mule Flag)",
    matchStatus: "MISMATCH",
    discrepancyNote:
      "Account substitution detected. Wire requested to unverified payee account at Axis Bank instead of registered HDFC Bandra account.",
    poNumber: "PO-2024-8840",
    associatedInvestigationId: "AST-104",
    items: [
      {
        description: "High-Density Enterprise Server Racks & ASIC Modules",
        quantity: 50,
        unitPrice: "$9,700.00",
        total: "$485,000.00",
      },
    ],
  },
  {
    id: "INV-1002",
    vendorName: "CloudCore Infrastructure Inc",
    amount: "$124,300.00",
    invoiceDate: "Nov 15, 2026",
    dueDate: "Dec 01, 2026",
    status: "Cleared",
    payeeAccount: "444455556666",
    payeeIfsc: "SVB0000444",
    expectedAccount: "444455556666",
    expectedIfsc: "SVB0000444",
    bankBranch: "Silicon Valley Bank, Sand Hill Road",
    matchStatus: "VERIFIED",
    discrepancyNote: "All credentials, routing numbers, and signatures match master agreement.",
    poNumber: "PO-2026-1002",
    associatedInvestigationId: "AST-101",
    items: [
      {
        description: "Cloud Compute Fleet & Kubernetes Node Allocation - Nov 2026",
        quantity: 1,
        unitPrice: "$124,300.00",
        total: "$124,300.00",
      },
    ],
  },
];

export const INITIAL_ENTITIES: EntityItem[] = [
  {
    id: "ENT-01",
    value: "asterion-supplies-billing.com",
    type: "Domain",
    riskLevel: "Critical",
    incidentCount: 3,
    lastObserved: "2m ago",
  },
  {
    id: "ENT-02",
    value: "+91 98765 43210",
    type: "Phone Number",
    riskLevel: "High",
    incidentCount: 2,
    lastObserved: "1h ago",
  },
  {
    id: "ENT-03",
    value: "9999 8888 7777",
    type: "Bank Account",
    riskLevel: "Critical",
    incidentCount: 2,
    lastObserved: "2m ago",
  },
  {
    id: "ENT-04",
    value: "DEMO0002222",
    type: "Bank Account",
    riskLevel: "Critical",
    incidentCount: 1,
    lastObserved: "2m ago",
  },
  {
    id: "ENT-05",
    value: "Asterion Supplies Pvt Ltd",
    type: "Organization",
    riskLevel: "Verified",
    incidentCount: 4,
    lastObserved: "2m ago",
  },
];

export const INITIAL_INBOX_ALERTS: InboxAlertItem[] = [
  {
    id: "ALRT-901",
    title: "Urgent Wire Transfer $485,000 Intercepted at Gateway",
    source: "FinGuard Gateway",
    severity: "Critical",
    status: "Action Required",
    timestamp: "2m ago",
    summary:
      "Automated treasury wire gate blocked ACH release for Apex Logistics. Beneficiary clearing code FAKEX009999 was rejected by the RBI IFSC registry.",
    affectedEntity: "Apex Logistics International",
    amount: "$485,000.00",
    payloadSnippet:
      '{"tx_ref": "TX-889102", "source_acc": "CORP-TREAS-01", "dest_acc": "998877665544", "ifsc": "FAKEX009999", "gate_action": "HOLD"}',
    recommendedAction: "Convert to formal investigation and freeze downstream transaction settlement.",
  },
  {
    id: "ALRT-902",
    title: "ScamShield Flagged Ingested PDF with Fake Port Detention Threat",
    source: "ScamShield Ingestion",
    severity: "High",
    status: "Action Required",
    timestamp: "14m ago",
    summary:
      "Multimodal analysis detected extreme psychological coercion language ('Port seizure penalty within 4 hours') on document INV-8891.",
    affectedEntity: "Urgent_Apex_Logistics_Invoice_INV-8891.pdf",
    amount: "$485,000.00",
    payloadSnippet:
      '{"ocr_model": "gemini-2.5-flash", "coercion_score": 0.94, "category": "BEC", "triggers": ["Port Detention", "Wire Immediate"]}',
    recommendedAction: "Validate purchase order matching via out-of-band logistics verification.",
  },
  {
    id: "ALRT-903",
    title: "Suspicious Domain Registered Spoofing Vendor MX Records",
    source: "TrustGraph Radar",
    severity: "High",
    status: "Investigating",
    timestamp: "1h ago",
    summary:
      "TrustGraph discovered newly registered domain asterion-supplies-billing.com (created 4 days ago) routing mail through known malicious relays.",
    affectedEntity: "asterion-supplies-billing.com",
    payloadSnippet:
      '{"domain": "asterion-supplies-billing.com", "whois_age_days": 4, "reputation": "MALICIOUS", "linked_incidents": ["AST-104"]}',
    recommendedAction: "Deploy DNS-level perimeter blocklist rule across corporate mail relays.",
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "REV-401",
    title: "Emergency Dual-Auth Signoff: Apex Logistics Wire Transfer ($485,000)",
    type: "Payment Hold Override",
    requesterName: "Sarah Chen",
    requesterRole: "Accounts Payable Controller",
    requestedDate: "Nov 19, 2026, 14:30 UTC",
    status: "Pending Dual-Auth",
    riskTier: "Critical",
    amount: "$485,000.00",
    targetSupplier: "Apex Logistics International",
    discrepancySummary:
      "Invoice payee coordinates diverged from Master Vendor File. Payee presented: 998877665544 (IFSC: FAKEX009999). Registered: 111122223333 (IFSC: HDFC0001234).",
    currentCoordinates: {
      accountNumber: "1111 2222 3333",
      ifsc: "HDFC0001234",
      bankName: "HDFC Bank, Bandra West, Mumbai",
    },
    proposedCoordinates: {
      accountNumber: "9988 7766 5544",
      ifsc: "FAKEX009999",
      bankName: "Unrecognized Financial Institution (Mule Flag)",
    },
    checks: [
      { name: "RBI Scheduled Bank Checksum", passed: false, detail: "FAKEX009999 failed RBI master IFSC registry checksum" },
      { name: "Master Vendor Account Match", passed: false, detail: "Payee 998877665544 does not match established profile" },
      { name: "Vendor Dual-Confirmation Callback", passed: false, detail: "No out-of-band call recorded with David Vance" },
      { name: "Executive Persona Match", passed: false, detail: "Originating email used unverified lookalike domain" },
    ],
  },
  {
    id: "REV-402",
    title: "Vendor Profile Banking Change: Asterion Supplies Pvt Ltd",
    type: "Vendor Coordinate Change",
    requesterName: "David Miller",
    requesterRole: "Senior Procurement Specialist",
    requestedDate: "Nov 19, 2026, 11:15 UTC",
    status: "Pending Dual-Auth",
    riskTier: "Critical",
    amount: "$485,000.00",
    targetSupplier: "Asterion Supplies Pvt Ltd",
    discrepancySummary:
      "Requested bank account update to Axis Bank Connaught Place (999988887777). Discrepancy detected with long-standing HDFC account.",
    currentCoordinates: {
      accountNumber: "1111 2222 3333",
      ifsc: "DEMO0001111",
      bankName: "HDFC Bank, Bandra West",
    },
    proposedCoordinates: {
      accountNumber: "9999 8888 7777",
      ifsc: "DEMO0002222",
      bankName: "Axis Bank, Connaught Place",
    },
    checks: [
      { name: "Format & Cheque Leaf Verification", passed: false, detail: "Cancelled cheque leaf failed forensic font inspection" },
      { name: "Historical Invoicing Variance", passed: false, detail: "Requested immediate payment redirect on active PO" },
    ],
  },
  {
    id: "REV-403",
    title: "Quarterly IT Infrastructure Recurring Clearance: CloudCore Inc",
    type: "Payment Hold Override",
    requesterName: "Emily Watson",
    requesterRole: "Finance Operations",
    requestedDate: "Nov 19, 2026, 09:10 UTC",
    status: "Approved",
    riskTier: "Medium",
    amount: "$124,300.00",
    targetSupplier: "CloudCore Infrastructure Inc",
    discrepancySummary: "Standard periodic settlement check. Zero coordinate discrepancies detected.",
    currentCoordinates: {
      accountNumber: "4444 5555 6666",
      ifsc: "SVB0000444",
      bankName: "Silicon Valley Bank, Sand Hill Road",
    },
    proposedCoordinates: {
      accountNumber: "4444 5555 6666",
      ifsc: "SVB0000444",
      bankName: "Silicon Valley Bank, Sand Hill Road",
    },
    checks: [
      { name: "RBI / Clearing House Match", passed: true, detail: "100% verified against SVB routing registry" },
      { name: "Master Vendor Account Match", passed: true, detail: "Exact match with registered contract records" },
    ],
  },
];

export const INITIAL_DOSSIERS: DossierItem[] = [
  {
    id: "DOS-2026-01",
    title: "Executive Impersonation & Freight Diversion Syndicate (Apex Logistics Case)",
    classification: "RESTRICTED // TREASURY FRAUD INTEL",
    generatedDate: "Nov 20, 2026",
    associatedIncidentId: "INC-719",
    targetSyndicate: "Apex Logistics Spoofing Cluster",
    preventedLoss: "$485,000.00",
    threatScore: 96,
    executiveSummary:
      "A sophisticated Business Email Compromise (BEC) attempt orchestrated against the corporate treasury department. Perpetrators created a lookalike domain (apex-logistics-urgent.com), spoofed CEO David Vance, and submitted altered invoice INV-8891 demanding an emergency wire of $485,000 to an invalid clearing code FAKEX009999. FinGuard intercepted the transaction within 0.2ms.",
    provenanceEntitiesCount: 5,
    status: "Active Brief",
    actionableRecommendations: [
      "Maintain active freeze on payee account 998877665544 across banking gateways.",
      "Submit forensic packet to RBI FinNet / CERT-In financial cybercrime portal.",
      "Mandate voice out-of-band verification on all expedited logistics invoices above $100,000.",
    ],
  },
  {
    id: "DOS-2026-02",
    title: "Vendor Account Substitution Campaign #104 (Asterion Phishing Infrastructure)",
    classification: "RESTRICTED // TREASURY FRAUD INTEL",
    generatedDate: "Nov 19, 2026",
    associatedIncidentId: "AST-104",
    targetSyndicate: "Phishing Infrastructure Cluster #104",
    preventedLoss: "$485,000.00",
    threatScore: 94,
    executiveSummary:
      "Targeted invoice redirection campaign spoofing Asterion Supplies Pvt Ltd. Perpetrators attempted to alter payee coordinates to an Axis Bank mule account (999988887777). TrustGraph cross-incident correlation revealed phone number +91 98765 43210 was previously observed in historical incident #089.",
    provenanceEntitiesCount: 4,
    status: "Submitted to Regulators",
    actionableRecommendations: [
      "Enforce dual-signoff maker-checker approval for any vendor profile banking modifications.",
      "Block domain asterion-supplies-billing.com at enterprise edge firewalls.",
    ],
  },
  {
    id: "DOS-2026-03",
    title: "Cloud Infrastructure Benign Settlement Audit (CloudCore Q4 Routine)",
    classification: "CONFIDENTIAL // COMPLIANCE",
    generatedDate: "Nov 19, 2026",
    associatedIncidentId: "AST-101",
    targetSyndicate: "Benign Corporate Settlement",
    preventedLoss: "$0.00 (Cleared)",
    threatScore: 12,
    executiveSummary:
      "Routine automated clearance for CloudCore Infrastructure Inc. Both FinGuard deterministic validation and ScamShield OCR passed with zero discrepancies. Invoice cleared for scheduled disbursement.",
    provenanceEntitiesCount: 2,
    status: "Archived",
    actionableRecommendations: [
      "Release funds under standard net-30 vendor agreement terms.",
    ],
  },
];

