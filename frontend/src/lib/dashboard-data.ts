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
}

export interface EntityItem {
  id: string;
  value: string;
  type: "Domain" | "Bank Account" | "Phone Number" | "Organization";
  riskLevel: "Critical" | "High" | "Medium" | "Verified";
  incidentCount: number;
  lastObserved: string;
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
    title: "INV-2024-8842_Asterion_Fraudulent.pdf",
    type: "Invoice PDF",
    associatedInvestigationId: "AST-104",
    uploadedAt: "15 mins ago",
    status: "Flagged",
    fileSize: "1.4 MB",
  },
  {
    id: "EV-02",
    title: "Urgent_Settlement_Demands.eml",
    type: "Email",
    associatedInvestigationId: "AST-104",
    uploadedAt: "12 mins ago",
    status: "Flagged",
    fileSize: "42 KB",
  },
  {
    id: "EV-03",
    title: "Wire_Transfer_Instruction_Slip.png",
    type: "Screenshot",
    associatedInvestigationId: "AST-104",
    uploadedAt: "8 mins ago",
    status: "Extracted",
    fileSize: "820 KB",
  },
  {
    id: "EV-04",
    title: "asterion-supplies-billing.com.whois",
    type: "Domain Telemetry",
    associatedInvestigationId: "AST-103",
    uploadedAt: "1 hour ago",
    status: "Flagged",
    fileSize: "14 KB",
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
