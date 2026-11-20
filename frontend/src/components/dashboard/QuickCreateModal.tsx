"use client";

import { useState, useEffect } from "react";
import {
  X,
  Briefcase,
  FileUp,
  Building2,
  GitFork,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  FileText,
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { SentinelLogo } from "@/components/ui/SentinelLogo";
import {
  InvestigationItem,
  SupplierItem,
  EvidenceItem,
  EntityItem,
} from "@/lib/dashboard-data";
import { verifySupplierBankDetails, analyzeThreatEvidence } from "@/lib/apiClient";

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvestigation: (title: string, entity: string, amount: string) => void;
  onCreateSupplier?: (supplier: SupplierItem) => void;
  onCreateEvidence?: (evidence: EvidenceItem) => void;
  onCreateEntity?: (entity: EntityItem) => void;
  initialAction?: "investigation" | "supplier" | "upload" | "entity";
}

export function QuickCreateModal({
  isOpen,
  onClose,
  onCreateInvestigation,
  onCreateSupplier,
  onCreateEvidence,
  onCreateEntity,
  initialAction = "investigation",
}: QuickCreateModalProps) {
  const [selectedAction, setSelectedAction] = useState<
    "investigation" | "supplier" | "upload" | "entity"
  >(initialAction);

  useEffect(() => {
    if (isOpen && initialAction) {
      setSelectedAction(initialAction);
    }
  }, [isOpen, initialAction]);

  // Investigation State
  const [invTitle, setInvTitle] = useState("");
  const [invTarget, setInvTarget] = useState("");
  const [invAmount, setInvAmount] = useState("");

  // Supplier State
  const [supName, setSupName] = useState("");
  const [supAccount, setSupAccount] = useState("");
  const [supIfsc, setSupIfsc] = useState("");
  const [supBranch, setSupBranch] = useState("");
  const [supInvoiced, setSupInvoiced] = useState("");

  // Evidence State
  const [evTitle, setEvTitle] = useState("");
  const [evType, setEvType] = useState<"Invoice PDF" | "Email" | "Screenshot" | "Domain Telemetry">("Invoice PDF");
  const [evSize, setEvSize] = useState("450 KB");
  const [evIncident, setEvIncident] = useState("INC-NEW");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [extractedOrInputText, setExtractedOrInputText] = useState("");

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setEvTitle(file.name);
    const sizeInKB = Math.round(file.size / 1024);
    setEvSize(sizeInKB > 1024 ? `${(sizeInKB / 1024).toFixed(1)} MB` : `${sizeInKB} KB`);
    setFileMime(file.type || "application/octet-stream");

    if (file.type.includes("pdf") || file.name.endsWith(".pdf")) {
      setEvType("Invoice PDF");
    } else if (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name)) {
      setEvType("Screenshot");
    } else if (file.name.endsWith(".eml") || file.name.endsWith(".msg")) {
      setEvType("Email");
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".eml")) {
      const textReader = new FileReader();
      textReader.onload = (e) => {
        const textContent = (e.target?.result as string) || "";
        setExtractedOrInputText(textContent.slice(0, 3000));
      };
      textReader.readAsText(file);
    }
  };

  // Entity State
  const [entValue, setEntValue] = useState("");
  const [entType, setEntType] = useState<"Domain" | "Bank Account" | "Phone Number" | "Organization">("Domain");
  const [entRisk, setEntRisk] = useState<"Critical" | "High" | "Medium" | "Verified">("Critical");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedAction === "investigation") {
        if (!invTitle.trim()) return;
        onCreateInvestigation(
          invTitle.trim(),
          invTarget.trim() || "Target Entity",
          invAmount ? (invAmount.startsWith("$") ? invAmount : `$${invAmount}`) : "$50,000.00"
        );
        setInvTitle("");
        setInvTarget("");
        setInvAmount("");
      } else if (selectedAction === "supplier" && onCreateSupplier) {
        if (!supName.trim() || !supAccount.trim()) return;
        
        // Live FinGuard Verification via Backend
        const ifscOrIban = (supIfsc.trim() || "HDFC0001234").toUpperCase();
        const verification = await verifySupplierBankDetails({
          supplier_name: supName.trim(),
          account_number: supAccount.trim(),
          ifsc_or_iban: ifscOrIban,
        });

        let status: "Verified" | "Discrepancy Detected" | "Under Review" = "Under Review";
        let riskLevel: "Critical" | "Medium" | "Low" = "Low";

        if (verification.risk_level === "CRITICAL" || verification.risk_level === "HIGH") {
          status = "Discrepancy Detected";
          riskLevel = "Critical";
        } else if (verification.risk_level === "MEDIUM") {
          status = "Under Review";
          riskLevel = "Medium";
        } else if (verification.is_verified) {
          status = "Verified";
          riskLevel = "Low";
        }

        const newSup: SupplierItem = {
          id: `SUP-${Date.now()}`,
          name: supName.trim(),
          accountNumber: supAccount.trim(),
          ifsc: ifscOrIban,
          bankBranch: verification.findings[0] || supBranch.trim() || "Scheduled Banking Division",
          status,
          riskLevel,
          totalInvoiced: supInvoiced ? (supInvoiced.startsWith("$") ? supInvoiced : `$${supInvoiced}`) : "$10,000.00",
          lastPaymentDate: "Verified Just Now",
        };
        onCreateSupplier(newSup);
        setSupName("");
        setSupAccount("");
        setSupIfsc("");
        setSupBranch("");
        setSupInvoiced("");
      } else if (selectedAction === "upload" && onCreateEvidence) {
        if (!evTitle.trim() && !selectedFile) return;

        const effectiveTitle = evTitle.trim() || selectedFile?.name || "Uploaded_Evidence_Document";
        const analysisPrompt = `${effectiveTitle}. ${extractedOrInputText}`.trim();

        // Live ScamShield Analysis via Backend (with multimodal file support)
        const analysis = await analyzeThreatEvidence({
          content: analysisPrompt,
          evidence_type: evType.toLowerCase(),
          file_data: filePreview || undefined,
          file_name: selectedFile?.name || effectiveTitle,
          mime_type: fileMime || undefined,
        });

        const newEv: EvidenceItem = {
          id: `EV-${Date.now()}`,
          title: effectiveTitle,
          type: evType,
          fileSize: evSize || "240 KB",
          associatedInvestigationId: evIncident.trim() || "GLOBAL-QUEUE",
          uploadedAt: "Just now",
          status: analysis.threat_detected ? "Flagged" : "Extracted",
          fileData: filePreview || undefined,
          mimeType: fileMime || undefined,
          threatSummary: analysis.summary,
          threatCategory: analysis.threat_category,
          severity: analysis.severity,
        };
        onCreateEvidence(newEv);
        setEvTitle("");
        setSelectedFile(null);
        setFilePreview(null);
        setFileMime("");
        setExtractedOrInputText("");
      } else if (selectedAction === "entity" && onCreateEntity) {
        if (!entValue.trim()) return;
        const newEnt: EntityItem = {
          id: `ENT-${Date.now()}`,
          value: entValue.trim(),
          type: entType,
          riskLevel: entRisk,
          incidentCount: 1,
          lastObserved: "Just now",
        };
        onCreateEntity(newEnt);
        setEntValue("");
      }

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-white/[0.1] bg-[#0c0d11] p-6 shadow-2xl overflow-hidden animate-modal-enter"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <SentinelLogo className="w-4 h-4 text-white" />
            <h3 className="text-sm font-medium text-[#f7f8f8]">Create Record</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-5 h-5 rounded flex items-center justify-center text-[#8a8f98] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Selector Pills */}
        <div className="grid grid-cols-4 gap-1.5 my-4">
          <button
            type="button"
            onClick={() => setSelectedAction("investigation")}
            className={`p-2 rounded-lg border text-left text-xs transition-colors ${
              selectedAction === "investigation"
                ? "bg-white/[0.08] border-white/20 text-white"
                : "bg-white/[0.02] border-white/[0.06] text-[#8a8f98] hover:bg-white/[0.04]"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 mb-1 text-[#5e6ad2]" />
            <div className="font-medium text-[11px] truncate">Investigation</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAction("supplier")}
            className={`p-2 rounded-lg border text-left text-xs transition-colors ${
              selectedAction === "supplier"
                ? "bg-white/[0.08] border-white/20 text-white"
                : "bg-white/[0.02] border-white/[0.06] text-[#8a8f98] hover:bg-white/[0.04]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 mb-1 text-[#4ebe82]" />
            <div className="font-medium text-[11px] truncate">Supplier</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAction("upload")}
            className={`p-2 rounded-lg border text-left text-xs transition-colors ${
              selectedAction === "upload"
                ? "bg-white/[0.08] border-white/20 text-white"
                : "bg-white/[0.02] border-white/[0.06] text-[#8a8f98] hover:bg-white/[0.04]"
            }`}
          >
            <FileUp className="w-3.5 h-3.5 mb-1 text-[#5ed6c0]" />
            <div className="font-medium text-[11px] truncate">Evidence</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAction("entity")}
            className={`p-2 rounded-lg border text-left text-xs transition-colors ${
              selectedAction === "entity"
                ? "bg-white/[0.08] border-white/20 text-white"
                : "bg-white/[0.02] border-white/[0.06] text-[#8a8f98] hover:bg-white/[0.04]"
            }`}
          >
            <GitFork className="w-3.5 h-3.5 mb-1 text-[#f0b96d]" />
            <div className="font-medium text-[11px] truncate">Entity</div>
          </button>
        </div>

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* TAB 1: INVESTIGATION */}
          {selectedAction === "investigation" && (
            <div className="space-y-3 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[11px] text-[#8a8f98]">Incident Title</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Unscheduled wire reroute request from apex-corp.com"
                  value={invTitle}
                  onChange={(e) => setInvTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">Target Vendor / Entity</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Laboratories Ltd"
                    value={invTarget}
                    onChange={(e) => setInvTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">Disbursement Amount</label>
                  <input
                    type="text"
                    placeholder="$125,000.00"
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPPLIER */}
          {selectedAction === "supplier" && (
            <div className="space-y-3 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[11px] text-[#8a8f98]">Supplier Legal Name</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Veritas Global Logistics Pvt Ltd"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">Master Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 987654321098"
                    value={supAccount}
                    onChange={(e) => setSupAccount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">Master IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={supIfsc}
                    onChange={(e) => setSupIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">Bank / Branch</label>
                  <input
                    type="text"
                    placeholder="HDFC Bank Commercial"
                    value={supBranch}
                    onChange={(e) => setSupBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">Historical Total Invoiced</label>
                  <input
                    type="text"
                    placeholder="$250,000.00"
                    value={supInvoiced}
                    onChange={(e) => setSupInvoiced(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE / MULTIMODAL INGESTION */}
          {selectedAction === "upload" && (
            <div className="space-y-3 animate-fade-in">
              {/* Drag & Drop File Upload Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative ${
                  isDragging
                    ? "border-[#5e6ad2] bg-[#5e6ad2]/10"
                    : "border-white/10 hover:border-white/20 bg-white/[0.015]"
                }`}
              >
                <input
                  type="file"
                  id="evidence-file-input"
                  accept=".pdf,image/png,image/jpeg,image/webp,.eml,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {selectedFile ? (
                  <div className="flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      {filePreview && fileMime.startsWith("image/") ? (
                        <img
                          src={filePreview}
                          alt="preview"
                          className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/15 border border-[#5e6ad2]/30 flex items-center justify-center shrink-0">
                          {evType === "Invoice PDF" ? (
                            <FileText className="w-5 h-5 text-[#5e6ad2]" />
                          ) : (
                            <FileUp className="w-5 h-5 text-[#5e6ad2]" />
                          )}
                        </div>
                      )}
                      <div className="truncate">
                        <div className="text-xs font-medium text-white truncate">
                          {selectedFile.name}
                        </div>
                        <div className="text-[11px] text-[#8a8f98] font-mono">
                          {evSize} • {evType} • Ready for ScamShield AI
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setFilePreview(null);
                        setFileMime("");
                      }}
                      className="p-1.5 rounded hover:bg-white/10 text-[#8a8f98] hover:text-[#eb5757] transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="evidence-file-input" className="cursor-pointer block py-2">
                    <UploadCloud className="w-7 h-7 text-[#5e6ad2] mx-auto mb-2 opacity-90" />
                    <div className="text-xs font-medium text-white">
                      Click to upload or drag & drop files
                    </div>
                    <div className="text-[11px] text-[#8a8f98] mt-1">
                      PDF invoices, payment screenshots (PNG/JPG), email threads (.eml)
                    </div>
                  </label>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#8a8f98]">Document / Subject Title</label>
                <input
                  type="text"
                  placeholder="e.g. Urgent_Invoice_INV-8891.pdf"
                  value={evTitle}
                  onChange={(e) => setEvTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#8a8f98]">Accompanying Text / Threat Context (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Paste email body, wire urgency instructions, or suspicious vendor notes..."
                  value={extractedOrInputText}
                  onChange={(e) => setExtractedOrInputText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">Evidence Classification</label>
                  <select
                    value={evType}
                    onChange={(e) => setEvType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#08090a] border border-white/[0.08] text-xs text-[#f7f8f8] focus:outline-none focus:border-white/20"
                  >
                    <option value="Invoice PDF">Invoice PDF</option>
                    <option value="Screenshot">Screenshot</option>
                    <option value="Email">Email Thread</option>
                    <option value="Domain Telemetry">Domain Telemetry</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">File Size</label>
                  <input
                    type="text"
                    value={evSize}
                    onChange={(e) => setEvSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ENTITY */}
          {selectedAction === "entity" && (
            <div className="space-y-3 animate-fade-in">
              <div className="space-y-1">
                <label className="text-[11px] text-[#8a8f98]">Entity Value (Identifier)</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. support@apex-support-billing.com or 9876543210"
                  value={entValue}
                  onChange={(e) => setEntValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">Entity Type</label>
                  <select
                    value={entType}
                    onChange={(e) => setEntType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#08090a] border border-white/[0.08] text-xs text-[#f7f8f8] focus:outline-none focus:border-white/20"
                  >
                    <option value="Domain">Domain</option>
                    <option value="Bank Account">Bank Account</option>
                    <option value="Phone Number">Phone Number</option>
                    <option value="Organization">Organization</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#8a8f98]">Risk Classification</label>
                  <select
                    value={entRisk}
                    onChange={(e) => setEntRisk(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#08090a] border border-white/[0.08] text-xs text-[#f7f8f8] focus:outline-none focus:border-white/20"
                  >
                    <option value="Critical">Critical Threat</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Verified">Verified Safe</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs text-[#8a8f98] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white text-white hover:text-black text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying & Saving...</span>
                </>
              ) : (
                <span>Create Record</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
