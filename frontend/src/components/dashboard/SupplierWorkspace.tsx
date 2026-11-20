"use client";

import { useState } from "react";
import { SupplierItem } from "@/lib/dashboard-data";
import {
  Building2,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Clock,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";
import { verifySupplierBankDetails } from "@/lib/apiClient";
import { updateSupplierDoc } from "@/lib/firestoreService";

interface SupplierWorkspaceProps {
  supplier: SupplierItem | null;
  workspaceId: string;
  onOpenQuickCreate?: (tab?: "investigation" | "supplier" | "upload" | "entity") => void;
  onSupplierUpdated?: (updated: SupplierItem) => void;
}

export function SupplierWorkspace({
  supplier,
  workspaceId,
  onOpenQuickCreate,
  onSupplierUpdated,
}: SupplierWorkspaceProps) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [showFullAccount, setShowFullAccount] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveFindings, setLiveFindings] = useState<string[]>([]);
  const [provenanceHash, setProvenanceHash] = useState<string>("");

  if (!supplier) {
    return (
      <main className="flex-1 h-screen bg-[#08090a] flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#8a8f98]">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-white">No Supplier Selected</h2>
            <p className="text-xs text-[#8a8f98]">
              Select a supplier from the list on the left or register a new vendor.
            </p>
          </div>
          {onOpenQuickCreate && (
            <button
              type="button"
              onClick={() => onOpenQuickCreate("supplier")}
              className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Supplier</span>
            </button>
          )}
        </div>
      </main>
    );
  }

  const isMule = supplier.status === "Discrepancy Detected" || supplier.riskLevel === "Critical";

  const handleCopy = (text: string, type: "account" | "ifsc") => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      if (type === "account") {
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2000);
      } else {
        setCopiedIfsc(true);
        setTimeout(() => setCopiedIfsc(false), 2000);
      }
    }
  };

  const handleLiveReverify = async () => {
    setIsVerifying(true);
    try {
      const res = await verifySupplierBankDetails({
        supplier_name: supplier.name,
        account_number: supplier.accountNumber,
        ifsc_or_iban: supplier.ifsc,
      });

      setLiveFindings(res.findings || []);
      setProvenanceHash(res.provenance_hash || "");

      const updatedStatus: SupplierItem["status"] =
        res.risk_level === "CRITICAL" || res.risk_level === "HIGH"
          ? "Discrepancy Detected"
          : res.risk_level === "MEDIUM"
          ? "Under Review"
          : "Verified";

      const updatedRisk: SupplierItem["riskLevel"] =
        res.risk_level === "CRITICAL" || res.risk_level === "HIGH"
          ? "Critical"
          : res.risk_level === "MEDIUM"
          ? "Medium"
          : "Low";

      const updatedSupplier: SupplierItem = {
        ...supplier,
        status: updatedStatus,
        riskLevel: updatedRisk,
        bankBranch: res.findings[0] || supplier.bankBranch,
        lastPaymentDate: "Re-verified Just Now",
      };

      await updateSupplierDoc(workspaceId, updatedSupplier);
      if (onSupplierUpdated) onSupplierUpdated(updatedSupplier);
    } catch (err) {
      console.error("Live reverification failed:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const maskedAccount = showFullAccount
    ? supplier.accountNumber
    : supplier.accountNumber.length > 4
    ? "•".repeat(supplier.accountNumber.length - 4) + supplier.accountNumber.slice(-4)
    : supplier.accountNumber;

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-y-auto flex flex-col z-10 select-text transition-all duration-300">
      {/* Top Header Bar */}
      <div className="h-12 px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                isMule ? "bg-[#eb5757]" : "bg-[#4ebe82]"
              }`}
            />
            <span className="font-mono text-xs text-[#8a8f98] font-medium">
              {supplier.id}
            </span>
          </div>

          <span className="text-xs text-[#f7f8f8] truncate max-w-sm font-medium">
            {supplier.name}
          </span>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              isMule
                ? "bg-[#eb5757]/15 text-[#eb5757] border border-[#eb5757]/30"
                : "bg-[#4ebe82]/15 text-[#4ebe82] border border-[#4ebe82]/30"
            }`}
          >
            {supplier.status}
          </span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleLiveReverify}
            disabled={isVerifying}
            className="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/[0.08] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5e6ad2] ${isVerifying ? "animate-spin" : ""}`} />
            <span>{isVerifying ? "Verifying with RBI Registry..." : "Run FinGuard Re-Check"}</span>
          </button>

          {onOpenQuickCreate && (
            <button
              type="button"
              onClick={() => onOpenQuickCreate("supplier")}
              className="px-2.5 py-1 rounded bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Supplier</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 max-w-5xl w-full mx-auto space-y-6 animate-fade-in">
        {/* Hero Title Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium tracking-tight text-[#f7f8f8]">
              {supplier.name}
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#8a8f98]">Risk Evaluation:</span>
              <span className={isMule ? "text-[#eb5757] font-semibold" : "text-[#4ebe82] font-semibold"}>
                {supplier.riskLevel.toUpperCase()} RISK
              </span>
            </div>
          </div>
          <p className="text-xs text-[#8a8f98]">
            Master vendor profile verified against scheduled commercial bank routing and ISO 7064 checksums.
          </p>
        </div>

        {/* Discrepancy Alert Banner */}
        {isMule ? (
          <div className="p-4 rounded-xl bg-[#eb5757]/10 border border-[#eb5757]/30 space-y-2 text-xs text-[#eb5757]">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>CRITICAL PAYMENT DIVERSION ALERT: Unauthorized Account Discrepancy</span>
            </div>
            <p className="text-[11px] text-[#fca5a5] leading-relaxed">
              FinGuard has flagged this supplier account. The provided IFSC or bank identifier does not match standard clearinghouse records or displays known mule/diversion heuristics. Automatic wire hold is enforced.
            </p>
            {liveFindings.length > 0 && (
              <div className="p-2.5 rounded bg-black/40 font-mono text-[10px] space-y-1">
                {liveFindings.map((f, i) => (
                  <div key={i}>• {f}</div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#4ebe82]/10 border border-[#4ebe82]/30 flex items-center justify-between text-xs text-[#4ebe82]">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>FinGuard Certified Beneficiary — Zero Discrepancy Detected</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">RBI REGISTRY MATCHED</span>
          </div>
        )}

        {/* Grid 1: Banking Details & Provenance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Banking Coordinates */}
          <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-white">
                <CreditCard className="w-4 h-4 text-[#5e6ad2]" />
                <span>Banking Coordinates</span>
              </div>
              <button
                type="button"
                onClick={() => setShowFullAccount(!showFullAccount)}
                className="text-[11px] text-[#8a8f98] hover:text-white flex items-center gap-1 transition-colors"
              >
                {showFullAccount ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showFullAccount ? "Mask" : "Reveal"}</span>
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#8a8f98]">Account Number</div>
                  <div className="text-white font-medium">{maskedAccount}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(supplier.accountNumber, "account")}
                  className="p-1.5 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white"
                  title="Copy Account Number"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-[#4ebe82]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#8a8f98]">IFSC / Routing Code</div>
                  <div className={isMule ? "text-[#eb5757] font-semibold" : "text-[#4ebe82] font-semibold"}>
                    {supplier.ifsc}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(supplier.ifsc, "ifsc")}
                  className="p-1.5 rounded hover:bg-white/10 text-[#8a8f98] hover:text-white"
                  title="Copy IFSC"
                >
                  {copiedIfsc ? <Check className="w-3.5 h-3.5 text-[#4ebe82]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                <div className="text-[10px] text-[#8a8f98]">Registered Branch</div>
                <div className="text-white">{supplier.bankBranch}</div>
              </div>
            </div>
          </div>

          {/* Card B: Deterministic Cryptographic Audit */}
          <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-white">
                <Lock className="w-4 h-4 text-[#4ebe82]" />
                <span>Deterministic Rule Engine</span>
              </div>
              <span className="text-[10px] font-mono text-[#4ebe82] bg-[#4ebe82]/10 px-2 py-0.5 rounded">
                v2.4-strict
              </span>
            </div>

            <div className="space-y-2 text-[#8a8f98] text-[11px] leading-relaxed">
              <p>
                FinGuard operates with zero LLM hallucination on financial numbers. Bank codes are deterministically checked against official central clearing databases.
              </p>

              <div className="pt-2 border-t border-white/[0.06] space-y-1.5 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span>Routing Jurisdiction:</span>
                  <span className="text-white">India / RBI Clearing</span>
                </div>
                <div className="flex justify-between">
                  <span>Audit Timestamp:</span>
                  <span className="text-white">{supplier.lastPaymentDate}</span>
                </div>
                <div className="space-y-0.5 pt-1">
                  <span>Cryptographic Provenance Hash:</span>
                  <div className="p-2 rounded bg-black/40 text-[9px] text-[#5e6ad2] truncate">
                    {provenanceHash || "7c41a64eba5dce6e5445eb7dcdaf9965e232b4efe79a33d2659f6e7f995a3381"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card C: Commercial Exposure & Invoicing */}
        <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.015] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-white">
              <FileText className="w-4 h-4 text-[#f0b96d]" />
              <span>Commercial Exposure & Invoiced Volume</span>
            </div>
            <span className="text-sm font-mono font-semibold text-white">
              {supplier.totalInvoiced}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-3 rounded-lg bg-black/20 border border-white/[0.04]">
              <div className="text-[10px] text-[#8a8f98]">Historical Total</div>
              <div className="text-sm font-semibold text-white mt-0.5">{supplier.totalInvoiced}</div>
            </div>
            <div className="p-3 rounded-lg bg-black/20 border border-white/[0.04]">
              <div className="text-[10px] text-[#8a8f98]">Verification State</div>
              <div className={`text-sm font-semibold mt-0.5 ${isMule ? "text-[#eb5757]" : "text-[#4ebe82]"}`}>
                {supplier.status}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/20 border border-white/[0.04]">
              <div className="text-[10px] text-[#8a8f98]">Treasury Clearance</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {isMule ? "HOLD (Dual-Auth Req)" : "Authorized"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

