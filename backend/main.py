import os
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from models import (
    BankVerificationRequest,
    BankVerificationResponse,
    EvidenceAnalysisRequest,
    ScamShieldAnalysisResponse,
    TrustGraphResponse,
    UnifiedDossierRequest,
    UnifiedDossierResponse,
)
from services.finguard_service import verify_supplier_banking
from services.gemini_service import analyze_with_gemini
from services.trustgraph_service import correlate_trustgraph_entities

app = FastAPI(
    title="SENTINEL Intelligence API",
    description="Deterministic Financial Threat Intelligence, FinGuard Verification & Gemini Flash ScamShield",
    version="2.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# CORS configuration allowing all origins (Vercel frontend, preview deployments, localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
)

@app.get("/")
@app.get("/api")
def root():
    return {
        "status": "operational",
        "service": "SENTINEL Intelligence Engine",
        "version": "2.0.0",
        "endpoints": [
            "/health",
            "/api/v1/finguard/verify",
            "/api/v1/scamshield/analyze",
            "/api/v1/trustgraph/correlate",
            "/api/v1/intelligence/dossier"
        ]
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    gemini_key_present = bool(os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "your_gemini_api_key_here")
    return {
        "status": "operational",
        "service": "sentinel-intelligence-engine",
        "cors_enabled": True,
        "finguard_deterministic": True,
        "scamshield_ai": {
            "model": os.getenv("GEMINI_MODEL", "gemini-2.0-flash"),
            "live_gemini_key": gemini_key_present,
            "mode": "live_gemini_flash" if gemini_key_present else "hybrid_heuristic_testing"
        },
        "trustgraph_engine": "active"
    }

# 1. FinGuard: Deterministic Supplier Bank Account & IFSC/IBAN Verification
@app.post("/api/v1/finguard/verify", response_model=BankVerificationResponse)
@app.post("/v1/finguard/verify", response_model=BankVerificationResponse)
def verify_bank_details(req: BankVerificationRequest):
    """
    100% Deterministic Verification:
    - IFSC checksum & Reserve Bank of India scheduling check
    - IBAN ISO 7064 Mod 97-10 checksum validation
    - Historical vendor ledger discrepancy alert
    """
    try:
        return verify_supplier_banking(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"FinGuard verification failed: {str(e)}")

# 2. ScamShield: AI Evidence Analysis with Gemini Flash
@app.post("/api/v1/scamshield/analyze", response_model=ScamShieldAnalysisResponse)
@app.post("/v1/scamshield/analyze", response_model=ScamShieldAnalysisResponse)
def analyze_threat_evidence(req: EvidenceAnalysisRequest):
    """
    AI Evidence Analysis using Gemini Flash:
    - Business Email Compromise (BEC) detection
    - Urgency & coercion linguistic extraction
    - Named entity recognition (domains, bank accounts, emails)
    """
    try:
        return analyze_with_gemini(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ScamShield analysis failed: {str(e)}")

# 3. TrustGraph: Entity Correlation & Network Topology
@app.post("/api/v1/trustgraph/correlate", response_model=TrustGraphResponse)
@app.post("/v1/trustgraph/correlate", response_model=TrustGraphResponse)
def correlate_entities(req: BankVerificationRequest):
    """
    Historical entity correlation & forensic relationship graph for React Flow.
    """
    try:
        return correlate_trustgraph_entities(
            supplier_name=req.supplier_name,
            account_number=req.account_number,
            ifsc_or_iban=req.ifsc_or_iban,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"TrustGraph correlation failed: {str(e)}")

# 4. Unified Intelligence Dossier (Consolidated Threat Report)
@app.post("/api/v1/intelligence/dossier", response_model=UnifiedDossierResponse)
@app.post("/v1/intelligence/dossier", response_model=UnifiedDossierResponse)
def generate_unified_dossier(req: UnifiedDossierRequest):
    """
    Synthesizes FinGuard bank telemetry, ScamShield AI extraction, and TrustGraph correlation
    into an executive incident investigation dossier.
    """
    supplier_name = req.supplier_name or "Acme Industrial Supplies"
    account_num = req.account_number or "920194810294"
    ifsc_code = req.ifsc_or_iban or "HDFC0001234"
    evidence_text = req.evidence_text or (
        "URGENT: Please remit invoice #INV-8491 to our updated secondary treasury account immediately. "
        "Do not contact our finance director as we are undergoing an emergency external audit."
    )

    # 1. FinGuard check
    finguard_res = verify_supplier_banking(
        BankVerificationRequest(
            supplier_name=supplier_name,
            account_number=account_num,
            ifsc_or_iban=ifsc_code,
            historical_account="102938475601"
        )
    )

    # 2. ScamShield check
    scamshield_res = analyze_with_gemini(
        EvidenceAnalysisRequest(
            content=evidence_text,
            evidence_type="email",
            sender="accounts@acme-industrial-supplies.net",
            subject="URGENT: Revised Wire Instructions"
        )
    )

    # 3. TrustGraph correlation
    trustgraph_res = correlate_trustgraph_entities(
        supplier_name=supplier_name,
        account_number=account_num,
        ifsc_or_iban=ifsc_code
    )

    # Calculate overall risk score
    overall_threat_score = max(finguard_res.risk_score, int(scamshield_res.confidence_score * 100))
    verdict = "CRITICAL_PAYMENT_INTERCEPTION_DETECTED" if overall_threat_score >= 70 else "VERIFIED_SAFE"

    return UnifiedDossierResponse(
        dossier_id=f"dos_{uuid.uuid4().hex[:10]}",
        investigation_id=req.investigation_id,
        overall_threat_score=overall_threat_score,
        verdict=verdict,
        finguard_status=finguard_res.model_dump(),
        scamshield_intel=scamshield_res.model_dump(),
        graph_topology=trustgraph_res.model_dump(),
        executive_summary=(
            f"Consolidated analysis indicates a {finguard_res.risk_level} threat on {supplier_name}. "
            f"Payment diversion identified with urgency indicators: {', '.join(scamshield_res.urgency_indicators)}. "
            f"Target routing linked to historical threat cluster."
        ),
        actionable_remediation=[
            "Freeze all outgoing ACH/wire transmissions to the updated bank account.",
            "Contact verified supplier executive via pre-established out-of-band telephone channel.",
            "Report mule account and routing number to financial intelligence unit."
        ]
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
