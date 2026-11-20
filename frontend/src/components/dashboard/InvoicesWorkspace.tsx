"use client";

import { useState } from "react";
import { InvoiceItem } from "@/lib/dashboard-data";
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Lock,
  Plus,
  Loader2,
  CreditCard,
  Building2,
  DollarSign,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { verifySupplierBankDetails } from "@/lib/apiClient";
import { updateInvoiceDoc } from "@/lib/firestoreService";

interface InvoicesWorkspaceProps {
  invoice: InvoiceItem | null;
  workspaceId: string;
  onOpenQuickCreate?: (tab?: "investigation" | "supplier" | "upload" | "entity") => void;
  onInvoiceUpdated?: (updated: InvoiceItem) => void;
}

export function InvoicesWorkspace({
  invoice,
  workspaceId,
  onOpenQuickCreate,
  onInvoiceUpdated,
}: InvoicesWorkspaceProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  if (!invoice) {
    return (
      <main className="flex-1 h-screen bg-[#08090a] flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#8a8f98]">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-white">No Invoice Selected</h2>
            <p className="text-xs text-[#8a8f98]">
              Select an invoice from the ledger to inspect line items, recipient banking coordinates, and clearance status.
            </p>
          </div>
          {onOpenQuickCreate && (
            <button
              type="button"
              onClick={() => onOpenQuickCreate("upload")}
              className="px-3 py-1.5 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest New Invoice</span>
            </button>
          )}
        </div>
      </main>
    );
  }

  const isMismatch = invoice.matchStatus === "MISMATCH" || invoice.status === "Payment Held" || invoice.status === "Discrepancy";

  const handleCopy = (text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
  };

  const handleLiveReverify = async () => {
    setIsVerifying(true);
    try {
      const res = await verifySupplierBankDetails({
        supplier_name: invoice.vendorName,
        account_number: invoice.payeeAccount,
        ifsc_or_iban: invoice.payeeIfsc,
      });

      const updatedStatus: InvoiceItem["status"] =
        res.risk_level === "CRITICAL" || res.risk_level === "HIGH"
          ? "Payment Held"
          : res.risk_level === "MEDIUM"
          ? "Under Review"
          : "Cleared";

      const updatedMatchStatus: InvoiceItem["matchStatus"] =
        res.risk_level === "CRITICAL" || res.risk_level === "HIGH" ? "MISMATCH" : "VERIFIED";

      const updated: InvoiceItem = {
        ...invoice,
        status: updatedStatus,
        matchStatus: updatedMatchStatus,
        bankBranch: res.findings[0] || invoice.bankBranch,
        discrepancyNote: res.findings.join(" • ") || invoice.discrepancyNote,
      };

      await updateInvoiceDoc(workspaceId, updated);
      if (onInvoiceUpdated) onInvoiceUpdated(updated);
    } catch (err) {
      console.error("FinGuard verification failed:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAuthorizeRelease = async () => {
    const updated: InvoiceItem = {
      ...invoice,
      status: "Cleared",
      matchStatus: "VERIFIED",
    };
    await updateInvoiceDoc(workspaceId, updated);
    if (onInvoiceUpdated) onInvoiceUpdated(updated);
    setApprovalModalOpen(false);
  };

  const handleFreezePayment = async () => {
    const updated: InvoiceItem = {
      ...invoice,
      status: "Payment Held",
      matchStatus: "MISMATCH",
    };
    await updateInvoiceDoc(workspaceId, updated);
    if (onInvoiceUpdated) onInvoiceUpdated(updated);
  };

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-y-auto flex flex-col z-10 select-text transition-all duration-300">
      {/* Top Header Bar */}
      <div className="h-12 px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                isMismatch ? "bg-[#eb5757]" : "bg-[#4ebe82]"
              }`}
            />
            <span className="font-mono text-xs text-[#8a8f98] font-medium">
              {invoice.id}
            </span>
          </div>
          <span className="text-white/20">/</span>
          <span className="text-xs font-semibold text-white truncate max-w-xs">
            {invoice.vendorName}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${
              isMismatch
                ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                : "bg-[#4ebe82]/10 text-[#4ebe82] border border-[#4ebe82]/20"
            }`}
          >
            {invoice.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLiveReverify}
            disabled={isVerifying}
            className="px-2.5 py-1 rounded bg-[#5e6ad2] hover:bg-[#6f7be8] disabled:opacity-50 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm shadow-[#5e6ad2]/20"
          >
            {isVerifying ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{isVerifying ? "Verifying Payee..." : "Re-Verify Payee (FinGuard)"}</span>
          </button>

          {isMismatch ? (
            <button
              type="button"
              onClick={() => setApprovalModalOpen(true)}
              className="px-2.5 py-1 rounded border border-white/10 hover:border-white/20 text-[#8a8f98] hover:text-white text-xs transition-colors flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5 text-[#f0b96d]" />
              <span>Dual-Auth Clearance</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFreezePayment}
              className="px-2.5 py-1 rounded border border-[#eb5757]/30 text-[#eb5757] hover:bg-[#eb5757]/10 text-xs transition-colors flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Freeze Wire Transfer</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Critical Discrepancy Alert */}
        {isMismatch && (
          <div className="p-4 rounded-xl border border-[#eb5757]/30 bg-[#eb5757]/[0.04] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#eb5757]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>FINGUARD HOLD: PAYMENT COORDINATE DIVERGENCE DETECTED</span>
            </div>
            <p className="text-xs text-[#d0d3d8] leading-relaxed">
              {invoice.discrepancyNote ||
                "The payee account number on this invoice does not match the verified profile in the master supplier register. Clearing codes failed checksum validation."}
            </p>
          </div>
        )}

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Invoice Total</div>
            <div className="text-lg font-semibold text-white font-mono">{invoice.amount}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Due Date</div>
            <div className="text-xs font-medium text-[#f0b96d]">{invoice.dueDate}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Purchase Order</div>
            <div className="text-xs font-mono text-white">{invoice.poNumber}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Case Docket</div>
            <div className="text-xs font-mono text-[#5e6ad2]">{invoice.associatedInvestigationId || "Unassigned"}</div>
          </div>
        </div>

        {/* Payee Comparison Matrix */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#8a8f98]" />
              <span className="text-xs font-semibold text-white">Payee Bank Reconciliation Matrix</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                isMismatch
                  ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                  : "bg-[#4ebe82]/10 text-[#4ebe82] border border-[#4ebe82]/20"
              }`}
            >
              {isMismatch ? "CRITICAL MISMATCH" : "VERIFIED CREDENTIALS"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Master File Expected */}
            <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-2">
              <div className="text-[10px] font-mono text-[#4ebe82] uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Master Supplier Profile (Verified)</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-[#8a8f98]">Registered Account:</div>
                <div className="font-mono text-white text-xs">
                  {invoice.expectedAccount || "1111 2222 3333"}
                </div>
                <div className="text-[#8a8f98] pt-1">Registered IFSC:</div>
                <div className="font-mono text-white text-xs">
                  {invoice.expectedIfsc || "HDFC0001234"} (HDFC Bank, Bandra West)
                </div>
              </div>
            </div>

            {/* Invoice Presentment Payee */}
            <div
              className={`p-3.5 rounded-lg border space-y-2 ${
                isMismatch
                  ? "border-[#eb5757]/30 bg-[#eb5757]/[0.03]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              <div
                className={`text-[10px] font-mono uppercase flex items-center gap-1.5 ${
                  isMismatch ? "text-[#eb5757]" : "text-[#4ebe82]"
                }`}
              >
                {isMismatch ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                <span>Invoice Presented Coordinates (In Transit)</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-[#8a8f98]">Payee Account on Invoice:</div>
                <div className="font-mono text-white text-xs flex items-center justify-between">
                  <span className={isMismatch ? "text-[#eb5757] font-semibold" : ""}>
                    {invoice.payeeAccount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(invoice.payeeAccount)}
                    className="text-[#8a8f98] hover:text-white p-1"
                  >
                    {copiedAcc ? <Check className="w-3 h-3 text-[#4ebe82]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="text-[#8a8f98] pt-1">Presented IFSC / Clearing:</div>
                <div className="font-mono text-xs flex items-center justify-between">
                  <span className={isMismatch ? "text-[#eb5757] font-semibold" : "text-white"}>
                    {invoice.payeeIfsc}
                  </span>
                  <span className="text-[10px] text-[#8a8f98]">{invoice.bankBranch}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
            <span className="text-xs font-semibold text-white">Itemized Invoice Breakdown</span>
            <span className="text-[10px] font-mono text-[#8a8f98]">
              {invoice.items.length} line items
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-[#8a8f98] text-[10px] font-mono uppercase">
                <th className="py-2.5 px-4 font-normal">Description</th>
                <th className="py-2.5 px-4 font-normal text-right">Qty</th>
                <th className="py-2.5 px-4 font-normal text-right">Unit Price</th>
                <th className="py-2.5 px-4 font-normal text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white">{item.description}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#8a8f98]">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#8a8f98]">{item.unitPrice}</td>
                  <td className="py-3 px-4 text-right font-mono text-white font-medium">{item.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/[0.08] bg-white/[0.01]">
                <td colSpan={3} className="py-3 px-4 text-right text-xs font-semibold text-white">
                  Total Settlement Amount
                </td>
                <td className="py-3 px-4 text-right font-mono text-sm font-semibold text-white">
                  {invoice.amount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Dual Authorization Confirmation Modal */}
      {approvalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1015] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#f0b96d]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-semibold text-white">Override FinGuard Payment Freeze?</h3>
            </div>
            <p className="text-xs text-[#8a8f98] leading-relaxed">
              This invoice has an active payee coordinate mismatch warning. Clearing this payment without out-of-band confirmation creates an irreversible wire transfer risk.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApprovalModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#8a8f98] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorizeRelease}
                className="px-3 py-1.5 rounded-lg bg-[#eb5757] hover:bg-[#d64545] text-white text-xs font-medium transition-colors"
              >
                Acknowledge Risk & Authorize
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

