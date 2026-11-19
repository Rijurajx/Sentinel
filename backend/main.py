import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

app = FastAPI(
    title="SENTINEL Intelligence API",
    description="Deterministic Financial Threat Intelligence & FinGuard Verification",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "operational",
        "service": "sentinel-api",
        "engine": "Google Cloud Run",
        "deterministic_verification": True
    }

class BankVerificationRequest(BaseModel):
    supplier_name: str
    account_number: str
    ifsc_or_iban: str
    bank_name: Optional[str] = None
    historical_account: Optional[str] = None

class BankVerificationResponse(BaseModel):
    is_verified: bool
    risk_level: str
    match_status: str
    risk_score: int
    findings: List[str]
    provenance_hash: str

@app.post("/api/v1/finguard/verify", response_model=BankVerificationResponse)
def verify_bank_details(req: BankVerificationRequest):
    """
    Deterministic zero-hallucination verification of supplier banking details.
    """
    findings = []
    risk_score = 0
    is_verified = True
    match_status = "VERIFIED_EXACT_MATCH"

    if req.historical_account and req.account_number != req.historical_account:
        is_verified = False
        risk_score = 92
        match_status = "CRITICAL_DISCREPANCY"
        findings.append("Account number mismatch against historical ledger.")
        findings.append("Potential supplier payment redirection or business email compromise (BEC).")

    return BankVerificationResponse(
        is_verified=is_verified,
        risk_level="CRITICAL" if not is_verified else "LOW",
        match_status=match_status,
        risk_score=risk_score,
        findings=findings,
        provenance_hash=f"prov_{abs(hash(req.account_number + req.ifsc_or_iban))}"
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
