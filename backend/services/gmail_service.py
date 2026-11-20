import imaplib
import email
from email.header import decode_header
import os
import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from services.gemini_service import analyze_with_gemini
from models import EvidenceAnalysisRequest

class EmailAnalysisResult(BaseModel):
    id: str
    sender: str
    sender_name: str
    sender_domain: str
    recipient: str
    subject: str
    snippet: str
    body_text: str
    date: str
    has_attachment: bool
    attachment_names: List[str]
    spf_dkim: str  # "PASS", "FAIL", "UNKNOWN"
    # AI Threat Classification
    is_fraud: bool
    classification: str  # "LEGITIMATE" | "FRAUDULENT"
    threat_category: str  # "BEC" | "INVOICE_FRAUD" | "IMPERSONATION" | "PHISHING" | "CLEAN"
    severity: str  # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
    confidence_score: float
    urgency_indicators: List[str]
    extracted_entities: List[Dict[str, Any]]
    recommended_action: str
    verdict_summary: str

def parse_header_str(raw: Optional[str]) -> str:
    if not raw:
        return ""
    try:
        decoded_parts = decode_header(raw)
        result = []
        for text, encoding in decoded_parts:
            if isinstance(text, bytes):
                result.append(text.decode(encoding or "utf-8", errors="replace"))
            else:
                result.append(str(text))
        return "".join(result)
    except Exception:
        return raw

def extract_domain(email_addr: str) -> str:
    match = re.search(r"@([\w.-]+)", email_addr)
    return match.group(1).lower() if match else ""

def get_simulated_mailbox() -> List[Dict[str, Any]]:
    """
    Returns empty mailbox (mock data removed).
    """
    return []

def fetch_live_gmail_imap(
    username: str,
    app_password: str,
    max_emails: int = 5
) -> tuple[List[Dict[str, Any]], Optional[str]]:
    """
    Connects to live Gmail using IMAP over SSL (imap.gmail.com:993).
    """
    results: List[Dict[str, Any]] = []
    clean_user = username.strip()
    clean_pwd = app_password.replace(" ", "").strip()

    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com", 993)
        mail.login(clean_user, clean_pwd)
        mail.select("INBOX")

        status, messages = mail.search(None, "ALL")
        if status != "OK" or not messages[0]:
            mail.logout()
            return [], None

        email_ids = messages[0].split()
        latest_ids = email_ids[-max_emails:]  # Get latest N emails
        latest_ids.reverse()

        for eid in latest_ids:
            res, data = mail.fetch(eid, "(RFC822)")
            if res != "OK":
                continue
            
            raw_email = data[0][1]
            msg = email.message_from_bytes(raw_email)

            subject = parse_header_str(msg.get("Subject", "No Subject"))
            sender = parse_header_str(msg.get("From", "Unknown Sender"))
            recipient = parse_header_str(msg.get("To", clean_user))
            date_str = msg.get("Date", "Recent")

            # Extract body
            body_text = ""
            attachment_names = []
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    content_disposition = str(part.get("Content-Disposition") or "")
                    
                    if "attachment" in content_disposition:
                        fname = part.get_filename()
                        if fname:
                            attachment_names.append(parse_header_str(fname))
                    elif content_type == "text/plain" and not body_text:
                        payload = part.get_payload(decode=True)
                        if payload:
                            body_text = payload.decode("utf-8", errors="replace")
            else:
                payload = msg.get_payload(decode=True)
                if payload:
                    body_text = payload.decode("utf-8", errors="replace")

            if not body_text:
                body_text = subject

            # SPF header check if available
            auth_results = msg.get("Authentication-Results", "")
            spf_status = "PASS" if "spf=pass" in auth_results.lower() else "UNKNOWN"
            if "spf=fail" in auth_results.lower() or "spf=softfail" in auth_results.lower():
                spf_status = "FAIL"

            results.append({
                "id": f"gmail-live-{eid.decode()}",
                "sender": sender,
                "sender_name": sender.split("<")[0].strip() if "<" in sender else sender,
                "recipient": recipient,
                "subject": subject,
                "snippet": body_text[:140].replace("\n", " ") + "...",
                "body_text": body_text[:3000],
                "date": date_str,
                "has_attachment": len(attachment_names) > 0,
                "attachment_names": attachment_names,
                "spf_dkim": spf_status,
            })

        mail.logout()
        return results, None
    except imaplib.IMAP4.error as e:
        err_msg = f"IMAP Authentication failed: {str(e)}. Please check your Google App Password and ensure IMAP is enabled in Gmail Settings."
        print("Live Gmail IMAP error:", err_msg)
        return [], err_msg
    except Exception as e:
        err_msg = f"Gmail connection error: {str(e)}"
        print("Live Gmail connection error:", err_msg)
        return [], err_msg

def classify_email_with_ai(raw_email: Dict[str, Any]) -> EmailAnalysisResult:
    """
    Evaluates an email using Gemini Flash ScamShield threat detection.
    """
    sender = raw_email.get("sender", "")
    sender_domain = extract_domain(sender)
    body_text = raw_email.get("body_text", "")
    subject = raw_email.get("subject", "")

    # Run AI analysis via ScamShield
    req = EvidenceAnalysisRequest(
        content=f"Subject: {subject}\nFrom: {sender}\n\nBody:\n{body_text}",
        evidence_type="email",
        sender=sender,
        subject=subject
    )
    
    ai_res = analyze_with_gemini(req)

    # Heuristic cross-checks (Domain lookalikes & bank account tampering)
    is_fraud = ai_res.threat_detected and ai_res.severity in ["CRITICAL", "HIGH"]
    
    # Check for known high-risk lookalike patterns
    if "urgent" in sender_domain or "notice" in sender_domain or "auth" in sender_domain or "portal" in sender_domain:
        is_fraud = True

    classification = "FRAUDULENT" if is_fraud else "LEGITIMATE"
    threat_category = ai_res.threat_category if is_fraud else "CLEAN"
    severity = ai_res.severity if is_fraud else "LOW"
    confidence = ai_res.confidence_score if is_fraud else 0.98

    # Format entity objects
    entities = [
        {"name": e.name, "type": e.type, "risk_score": e.risk_score}
        for e in ai_res.extracted_entities
    ]

    return EmailAnalysisResult(
        id=raw_email.get("id", f"msg-{abs(hash(subject)) % 10000}"),
        sender=sender,
        sender_name=raw_email.get("sender_name", sender),
        sender_domain=sender_domain,
        recipient=raw_email.get("recipient", "treasury@sentinel.internal"),
        subject=subject,
        snippet=raw_email.get("snippet", body_text[:140]),
        body_text=body_text,
        date=raw_email.get("date", "Recent"),
        has_attachment=raw_email.get("has_attachment", False),
        attachment_names=raw_email.get("attachment_names", []),
        spf_dkim=raw_email.get("spf_dkim", "PASS"),
        is_fraud=is_fraud,
        classification=classification,
        threat_category=threat_category,
        severity=severity,
        confidence_score=confidence,
        urgency_indicators=ai_res.urgency_indicators,
        extracted_entities=entities,
        recommended_action=ai_res.recommended_action,
        verdict_summary=ai_res.summary
    )

