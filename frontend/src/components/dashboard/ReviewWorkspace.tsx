"use client";

import { useState } from "react";
import { ReviewItem } from "@/lib/dashboard-data";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  UserCheck,
  FileCheck2,
  XCircle,
  Building2,
  DollarSign,
  Copy,
  Check,
} from "lucide-react";
import { updateReviewDoc } from "@/lib/firestoreService";

interface ReviewWorkspaceProps {
  review: ReviewItem | null;
  workspaceId: string;
  onReviewUpdated?: (updated: ReviewItem) => void;
}

export function ReviewWorkspace({
  review,
  workspaceId,
  onReviewUpdated,
}: ReviewWorkspaceProps) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  if (!review) {
    return (
      <main className="flex-1 h-screen bg-[#08090a] flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#8a8f98]">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-white">No Review Selected</h2>
            <p className="text-xs text-[#8a8f98]">
              Select a payment or banking change review from the dual-authorization queue on the left.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const isPending = review.status === "Pending Dual-Auth";
  const isApproved = review.status === "Approved";
  const isRejected = review.status === "Rejected";

  const handleApprove = async () => {
    const updated: ReviewItem = {
      ...review,
      status: "Approved",
    };
    await updateReviewDoc(workspaceId, updated);
    if (onReviewUpdated) onReviewUpdated(updated);
    setConfirmModalOpen(false);
  };

  const handleReject = async () => {
    const updated: ReviewItem = {
      ...review,
      status: "Rejected",
    };
    await updateReviewDoc(workspaceId, updated);
    if (onReviewUpdated) onReviewUpdated(updated);
  };

  return (
    <main className="flex-1 h-screen bg-[#08090a] overflow-y-auto flex flex-col z-10 select-text transition-all duration-300">
      {/* Top Header Bar */}
      <div className="h-12 px-6 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#08090a]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                isApproved
                  ? "bg-[#4ebe82]"
                  : isRejected
                  ? "bg-[#eb5757]"
                  : "bg-[#f0b96d]"
              }`}
            />
            <span className="font-mono text-xs text-[#8a8f98] font-medium">
              {review.id}
            </span>
          </div>
          <span className="text-white/20">/</span>
          <span className="text-xs font-semibold text-white truncate max-w-md">
            {review.title}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium shrink-0 ${
              isApproved
                ? "bg-[#4ebe82]/10 text-[#4ebe82] border border-[#4ebe82]/20"
                : isRejected
                ? "bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/20"
                : "bg-[#f0b96d]/10 text-[#f0b96d] border border-[#f0b96d]/20"
            }`}
          >
            {review.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isPending && (
            <>
              <button
                type="button"
                onClick={() => setConfirmModalOpen(true)}
                className="px-2.5 py-1 rounded bg-[#4ebe82] hover:bg-[#5ec992] text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-[#4ebe82]/20"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Approve & Sign Clearance</span>
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-2.5 py-1 rounded border border-[#eb5757]/30 text-[#eb5757] hover:bg-[#eb5757]/10 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject & Freeze Payee</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Review Body */}
      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Dual-Auth Banner */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Lock className="w-4 h-4 text-[#f0b96d]" />
              <span>DUAL-AUTHORIZATION POLICY (FOUR-EYES PRINCIPLE)</span>
            </div>
            <span className="text-[10px] font-mono text-[#8a8f98]">{review.requestedDate}</span>
          </div>
          <p className="text-xs text-[#8a8f98] leading-relaxed">
            Corporate Treasury Policy requires secondary security controller sign-off for any transaction exceeding \$100,000 or any payee banking coordinate modification.
          </p>
        </div>

        {/* Review Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Originating Maker</div>
            <div className="text-xs font-medium text-white">{review.requesterName}</div>
            <div className="text-[10px] text-[#8a8f98]">{review.requesterRole}</div>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Risk Tier</div>
            <div className="text-xs font-medium text-[#eb5757]">{review.riskTier} Risk</div>
            <div className="text-[10px] text-[#8a8f98]">Discrepancy Score: 94</div>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Target Vendor</div>
            <div className="text-xs font-medium text-white truncate">{review.targetSupplier}</div>
            <div className="text-[10px] text-[#8a8f98] font-mono">Master Vendor File</div>
          </div>
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0e1015] space-y-1">
            <div className="text-[10px] font-mono text-[#8a8f98] uppercase">Exposure Amount</div>
            <div className="text-base font-mono font-semibold text-white">{review.amount}</div>
          </div>
        </div>

        {/* Coordinate Diff: Established Profile vs Requested Profile */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-xs font-semibold text-white">Banking Coordinate Reconciliation Diff</span>
            <span className="text-[10px] font-mono text-[#eb5757] bg-[#eb5757]/10 px-2 py-0.5 rounded">
              MODIFICATION DETECTED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-2">
              <div className="text-[10px] font-mono text-[#4ebe82] uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Established Registered Record</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-[#8a8f98]">Account Number:</div>
                <div className="font-mono text-white text-xs">{review.currentCoordinates.accountNumber}</div>
                <div className="text-[#8a8f98] pt-1">IFSC / Routing Code:</div>
                <div className="font-mono text-white text-xs">{review.currentCoordinates.ifsc}</div>
                <div className="text-[10px] text-[#8a8f98]">{review.currentCoordinates.bankName}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-[#eb5757]/30 bg-[#eb5757]/[0.03] space-y-2">
              <div className="text-[10px] font-mono text-[#eb5757] uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                <span>Requested / Inbound Presentment</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-[#8a8f98]">Account Number:</div>
                <div className="font-mono text-[#eb5757] text-xs font-semibold">{review.proposedCoordinates.accountNumber}</div>
                <div className="text-[#8a8f98] pt-1">IFSC / Routing Code:</div>
                <div className="font-mono text-[#eb5757] text-xs font-semibold">{review.proposedCoordinates.ifsc}</div>
                <div className="text-[10px] text-[#eb5757]">{review.proposedCoordinates.bankName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Four-Eyes Verification Checkpoints */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1015] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <FileCheck2 className="w-4 h-4 text-[#5e6ad2]" />
            <span>Automated Checkpoints</span>
          </div>

          <div className="space-y-2">
            {review.checks.map((chk, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {chk.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#4ebe82] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#eb5757] shrink-0" />
                  )}
                  <div>
                    <div className="font-medium text-white">{chk.name}</div>
                    <div className="text-[11px] text-[#8a8f98]">{chk.detail}</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    chk.passed
                      ? "bg-[#4ebe82]/10 text-[#4ebe82]"
                      : "bg-[#eb5757]/10 text-[#eb5757]"
                  }`}
                >
                  {chk.passed ? "PASSED" : "FAILED"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1015] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#f0b96d]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-semibold text-white">Cryptographically Sign Clearance?</h3>
            </div>
            <p className="text-xs text-[#8a8f98] leading-relaxed">
              You are acting as the Secondary Authorization Checker under Treasury Policy. Confirming this action will release the payment hold and disburse funds to the destination coordinates.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#8a8f98] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-3 py-1.5 rounded-lg bg-[#4ebe82] hover:bg-[#5ec992] text-black text-xs font-semibold transition-colors"
              >
                Sign & Authorize Release
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
