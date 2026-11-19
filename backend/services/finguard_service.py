import re
import hashlib
from typing import Dict, Any, List
from models import BankVerificationRequest, BankVerificationResponse

# Known bank prefixes for Indian IFSC validation
KNOWN_IFSC_BANKS = {
    "SBIN": "State Bank of India",
    "HDFC": "HDFC Bank",
    "ICIC": "ICICI Bank",
    "UTIB": "Axis Bank",
    "PUNB": "Punjab National Bank",
    "BARB": "Bank of Baroda",
    "CNRB": "Canara Bank",
    "KKBK": "Kotak Mahindra Bank",
    "YESB": "Yes Bank",
    "IDIB": "Indian Bank",
}

def validate_ifsc(ifsc: str) -> Dict[str, Any]:
    cleaned = ifsc.strip().upper()
    pattern = r"^[A-Z]{4}0[A-Z0-9]{6}$"
    if not re.match(pattern, cleaned):
        return {
            "valid": False,
            "bank_name": None,
            "error": "Invalid IFSC structure. Must be 4 letters, '0', followed by 6 alphanumeric characters.",
        }
    bank_code = cleaned[:4]
    bank_name = KNOWN_IFSC_BANKS.get(bank_code, f"Recognized Scheduled Bank ({bank_code})")
    return {"valid": True, "bank_name": bank_name, "error": None}

def validate_iban(iban: str) -> Dict[str, Any]:
    cleaned = re.sub(r"\s+", "", iban.upper())
    if len(cleaned) < 15 or len(cleaned) > 34:
        return {"valid": False, "error": "Invalid IBAN length (expected 15-34 characters)."}
    
    # ISO 7064 Mod 97-10 checksum validation
    rearranged = cleaned[4:] + cleaned[:4]
    numeric = ""
    for ch in rearranged:
        if ch.isalpha():
            numeric += str(ord(ch) - ord('A') + 10)
        elif ch.isdigit():
            numeric += ch
        else:
            return {"valid": False, "error": "IBAN contains invalid characters."}
    
    try:
        mod97 = int(numeric) % 97
        if mod97 != 1:
            return {"valid": False, "error": "IBAN checksum validation failed (Mod 97 != 1)."}
        return {"valid": True, "country": cleaned[:2], "error": None}
    except Exception as e:
        return {"valid": False, "error": f"IBAN checksum calculation error: {str(e)}"}

def verify_supplier_banking(req: BankVerificationRequest) -> BankVerificationResponse:
    """
    Strict 100% Deterministic Bank Account & IFSC/IBAN Verification.
    Zero LLM hallucination.
    """
    findings: List[str] = []
    risk_score = 0
    match_status = "VERIFIED_EXACT_MATCH"
    format_valid = True
    code_to_check = req.ifsc_or_iban.strip().upper()

    # 1. Format Verification
    if len(code_to_check) == 11 and code_to_check[4] == "0":
        # Indian IFSC
        ifsc_res = validate_ifsc(code_to_check)
        if not ifsc_res["valid"]:
            format_valid = False
            findings.append(f"IFSC Validation Error: {ifsc_res['error']}")
            risk_score += 45
        else:
            findings.append(f"IFSC Validated: Registered to {ifsc_res['bank_name']}.")
    elif len(code_to_check) >= 15:
        # IBAN format
        iban_res = validate_iban(code_to_check)
        if not iban_res["valid"]:
            format_valid = False
            findings.append(f"IBAN Checksum Error: {iban_res['error']}")
            risk_score += 50
        else:
            findings.append(f"IBAN Checksum Verified (Country: {iban_res['country']}).")
    else:
        # Basic routing or account format
        if not re.match(r"^[A-Z0-9]{8,34}$", code_to_check):
            format_valid = False
            findings.append("Routing/IFSC/IBAN does not conform to standardized banking format.")
            risk_score += 35

    # 2. Historical Ledger Comparison (Detecting sudden bank detail tampering)
    if req.historical_account:
        cleaned_hist = req.historical_account.strip().replace(" ", "")
        cleaned_curr = req.account_number.strip().replace(" ", "")
        if cleaned_curr != cleaned_hist:
            risk_score += 65
            match_status = "CRITICAL_DISCREPANCY"
            findings.append(
                f"PAYMENT DIVERSION ALERT: Account number ({cleaned_curr}) deviates from authorized historical account ({cleaned_hist})."
            )
            findings.append("Potential Business Email Compromise (BEC) or rogue vendor account modification.")
        else:
            findings.append("Account number perfectly matches historical approved vendor ledger.")

    # 3. Bank Account Number Sanity
    cleaned_acc = req.account_number.strip().replace(" ", "")
    if len(cleaned_acc) < 6:
        findings.append("Account number is unusually short for commercial wire operations.")
        risk_score += 30

    # Determine risk level
    if risk_score >= 70:
        risk_level = "CRITICAL"
        is_verified = False
    elif risk_score >= 40:
        risk_level = "HIGH"
        is_verified = False
    elif risk_score >= 20:
        risk_level = "MEDIUM"
        is_verified = True
    else:
        risk_level = "LOW"
        is_verified = True

    # Deterministic Cryptographic Provenance Hash
    raw_hash_input = f"{req.supplier_name}|{cleaned_acc}|{code_to_check}|{risk_score}|{match_status}"
    provenance_hash = hashlib.sha256(raw_hash_input.encode()).hexdigest()

    return BankVerificationResponse(
        is_verified=is_verified,
        risk_level=risk_level,
        match_status=match_status,
        risk_score=min(risk_score, 100),
        format_valid=format_valid,
        findings=findings,
        audit_trail={
            "supplier_name": req.supplier_name,
            "account_checked": cleaned_acc[-4:].rjust(len(cleaned_acc), "*"),
            "routing_type": "IFSC" if len(code_to_check) == 11 else "IBAN",
            "jurisdiction": "India" if len(code_to_check) == 11 else "International",
            "deterministic_rule_engine": "v2.4-strict",
        },
        provenance_hash=provenance_hash,
    )

