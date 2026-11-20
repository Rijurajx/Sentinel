from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# FinGuard Verification Models
class BankVerificationRequest(BaseModel):
    supplier_name: str
    account_number: str
    ifsc_or_iban: str
    bank_name: Optional[str] = None
    bank_branch: Optional[str] = None
    historical_account: Optional[str] = None
    invoice_amount: Optional[float] = None
    currency: Optional[str] = "USD"

class BankVerificationResponse(BaseModel):
    is_verified: bool
    risk_level: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    match_status: str
    risk_score: int  # 0 to 100
    format_valid: bool
    findings: List[str]
    audit_trail: Dict[str, Any]
    provenance_hash: str

# ScamShield Threat Analysis Models
class EvidenceAnalysisRequest(BaseModel):
    content: str
    evidence_type: str = "email"  # "email", "invoice", "sms", "domain", "screenshot", "pdf"
    sender: Optional[str] = None
    subject: Optional[str] = None
    file_data: Optional[str] = None  # base64 encoded document or screenshot
    file_name: Optional[str] = None
    mime_type: Optional[str] = None

class ExtractedEntity(BaseModel):
    name: str
    type: str  # "ORG", "PERSON", "BANK_ACCOUNT", "DOMAIN", "IBAN", "IFSC", "CRYPTO_WALLET"
    confidence: float
    risk_score: int

class ScamShieldAnalysisResponse(BaseModel):
    threat_detected: bool
    threat_category: str  # "BEC", "INVOICE_FRAUD", "IMPERSONATION", "PHISHING", "CLEAN"
    severity: str  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    confidence_score: float
    summary: str
    urgency_indicators: List[str]
    coercion_tactics: List[str]
    extracted_entities: List[ExtractedEntity]
    recommended_action: str
    model_used: str

# TrustGraph Correlation Models
class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # "supplier", "account", "domain", "threat_actor", "incident"
    risk_level: str
    details: Dict[str, Any]

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    relation: str  # "OPERATES", "TRANSFERS_TO", "IMPERSONATES", "SHARES_ACCOUNT"

class TrustGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    cluster_risk: str
    connected_incidents_count: int
    provenance_summary: str

# Unified Intelligence Dossier Models
class UnifiedDossierRequest(BaseModel):
    investigation_id: str
    supplier_name: Optional[str] = None
    evidence_text: Optional[str] = None
    account_number: Optional[str] = None
    ifsc_or_iban: Optional[str] = None

class UnifiedDossierResponse(BaseModel):
    dossier_id: str
    investigation_id: str
    overall_threat_score: int
    verdict: str
    finguard_status: Dict[str, Any]
    scamshield_intel: Dict[str, Any]
    graph_topology: Dict[str, Any]
    executive_summary: str
    actionable_remediation: List[str]

