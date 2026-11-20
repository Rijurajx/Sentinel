"use client";

import { useState } from "react";
import { useAuth, UserProfile } from "@/context/AuthContext";
import { clearAllWorkspaceData, seedBusinessDemoData } from "@/lib/firestoreService";
import {
  User,
  Building2,
  ShieldCheck,
  Check,
  X,
  Lock,
  Mail,
  Server,
  Database,
  Cloud,
  Save,
  ArrowLeft,
} from "lucide-react";

interface ProfileSettingsPaneProps {
  onClose: () => void;
}

export function ProfileSettingsPane({ onClose }: ProfileSettingsPaneProps) {
  const { user, profile, activeWorkspace, updateProfile } = useAuth();

  const [accountType, setAccountType] = useState<"individual" | "business">(
    profile?.accountType || "business"
  );
  const [fullName, setFullName] = useState(profile?.fullName || user?.displayName || "");
  const [roleTitle, setRoleTitle] = useState(profile?.roleTitle || "Threat Intelligence Analyst");

  // Business details
  const [legalName, setLegalName] = useState(
    profile?.businessDetails?.legalName || ""
  );
  const [country, setCountry] = useState(
    profile?.businessDetails?.country || "European Union"
  );
  const [industry, setIndustry] = useState(
    profile?.businessDetails?.industry || "Financial Services & Fintech"
  );
  const [monthlyVolume, setMonthlyVolume] = useState(
    profile?.businessDetails?.monthlyVolume || "$1M - $10M"
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (accountType === "business" && !legalName.trim()) {
      setError("Legal business name is required for business accounts.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await updateProfile({
        accountType,
        fullName: fullName.trim(),
        roleTitle: roleTitle.trim() || "Financial Intelligence Analyst",
        businessDetails:
          accountType === "business"
            ? {
                legalName: legalName.trim(),
                country,
                industry,
                monthlyVolume,
              }
            : undefined,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to update profile settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#08090a] flex flex-col select-none">
      {/* 1. Header & Breadcrumb */}
      <div className="h-12 border-b border-white/[0.08] px-6 flex items-center justify-between shrink-0 bg-[#08090a]/80 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a8f98] hover:text-[#f7f8f8] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>
          <span className="text-white/20">/</span>
          <span className="text-[#f7f8f8] font-medium">Profile & Organization Settings</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded text-xs text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1 rounded bg-white text-black text-xs font-medium hover:bg-white/90 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Body Form */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-8 py-8 space-y-8 animate-fade-in">
        {error && (
          <div className="p-3 rounded-lg bg-[#eb5757]/10 border border-[#eb5757]/20 text-xs text-[#eb5757]">
            {error}
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 rounded-lg bg-[#82c9a7]/10 border border-[#82c9a7]/20 text-xs text-[#82c9a7] flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Profile and security data successfully synchronized to Cloud Firestore.</span>
          </div>
        )}

        {/* Section 1: User Identity */}
        <section className="space-y-4">
          <div className="border-b border-white/[0.06] pb-2">
            <h2 className="text-sm font-medium text-[#f7f8f8]">User Identity</h2>
            <p className="text-xs text-[#8a8f98]">
              Manage your personal credentials and operational title across investigations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-[#8a8f98] font-mono uppercase block mb-1.5">
                Full Name <span className="text-[#eb5757]">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Riju Raj"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#8a8f98] font-mono uppercase block mb-1.5">
                Role / Title
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Lead Threat Investigator"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] text-[#8a8f98] font-mono uppercase block mb-1.5">
                Authenticated Work Email
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-[#8a8f98]">
                <Mail className="w-3.5 h-3.5 text-[#62666d]" />
                <span className="font-mono text-[#f7f8f8]">{user?.email || "analyst@sentinel.app"}</span>
                <span className="ml-auto flex items-center gap-1 text-[10px] text-[#82c9a7] bg-[#82c9a7]/10 px-2 py-0.5 rounded font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Account Classification */}
        <section className="space-y-4">
          <div className="border-b border-white/[0.06] pb-2">
            <h2 className="text-sm font-medium text-[#f7f8f8]">Account Classification</h2>
            <p className="text-xs text-[#8a8f98]">
              Configure risk thresholds based on whether you are an individual investigator or an enterprise firm.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccountType("individual")}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                accountType === "individual"
                  ? "bg-white/[0.06] border-white/30 text-white"
                  : "bg-white/[0.02] border-white/[0.06] text-[#8a8f98] hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-white" />
                <span className="text-xs font-medium text-white">Individual Practitioner</span>
              </div>
              <p className="text-[11px] text-[#8a8f98] leading-relaxed">
                For independent security consultants, forensic auditors, and threat researchers.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("business")}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                accountType === "business"
                  ? "bg-white/[0.06] border-white/30 text-white"
                  : "bg-white/[0.02] border-white/[0.06] text-[#8a8f98] hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-white" />
                <span className="text-xs font-medium text-white">Enterprise / Business</span>
              </div>
              <p className="text-[11px] text-[#8a8f98] leading-relaxed">
                For corporate treasury, procurement, finance teams, and enterprise SecOps.
              </p>
            </button>
          </div>
        </section>

        {/* Section 3: Business Details (Conditional) */}
        {accountType === "business" && (
          <section className="space-y-4 animate-fade-in">
            <div className="border-b border-white/[0.06] pb-2">
              <h2 className="text-sm font-medium text-[#f7f8f8]">Legal Organization Details</h2>
              <p className="text-xs text-[#8a8f98]">
                Required for deterministic FinGuard supplier verification and bank anomaly models.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-[#8a8f98] font-mono uppercase block mb-1.5">
                  Legal Entity Name <span className="text-[#eb5757]">*</span>
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="e.g. Sentinel Technologies Inc."
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8a8f98] font-mono uppercase block mb-1.5">
                  Primary Banking Jurisdiction
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141518] border border-white/[0.08] text-xs text-[#f7f8f8] focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
                >
                  <option value="European Union">European Union (SEPA / IBAN)</option>
                  <option value="United States / Delaware">United States (ACH / Fedwire)</option>
                  <option value="United Kingdom">United Kingdom (BACS / CHAPS)</option>
                  <option value="India">India (RBI / IFSC / NEFT / RTGS)</option>
                  <option value="Singapore">Singapore (MAS / FAST)</option>
                  <option value="Global / Multi-Jurisdiction">Global Multi-Jurisdiction</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#8a8f98] font-mono uppercase block mb-1.5">
                  Industry Classification
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141518] border border-white/[0.08] text-xs text-[#f7f8f8] focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
                >
                  <option value="Financial Services & Fintech">Financial Services & Fintech</option>
                  <option value="Supply Chain & Global Logistics">Supply Chain & Global Logistics</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                  <option value="Enterprise SaaS & Cloud Infrastructure">Enterprise SaaS & Cloud</option>
                  <option value="Energy & Utilities">Energy & Utilities</option>
                  <option value="Government & Defense">Government & Defense</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#8a8f98] font-mono uppercase block mb-1.5">
                  Estimated Monthly Wire Volume
                </label>
                <select
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141518] border border-white/[0.08] text-xs text-[#f7f8f8] focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
                >
                  <option value="Under $500K">Under $500K / month</option>
                  <option value="$500K - $1M">$500K - $1M / month</option>
                  <option value="$1M - $10M">$1M - $10M / month</option>
                  <option value="$10M - $50M">$10M - $50M / month</option>
                  <option value="$50M+">$50M+ / month</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Google Cloud Platform Infrastructure Status */}
        <section className="space-y-4">
          <div className="border-b border-white/[0.06] pb-2">
            <h2 className="text-sm font-medium text-[#f7f8f8]">Connected Cloud Infrastructure</h2>
            <p className="text-xs text-[#8a8f98]">
              Sentinel operates directly against Google Cloud Platform products for zero hallucination compliance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#82c9a7]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-medium">Firebase Auth</span>
              </div>
              <div className="text-[10px] text-[#8a8f98] font-mono">Live / OAuth2</div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#82c9a7]">
                <Database className="w-3.5 h-3.5" />
                <span className="font-medium">Cloud Firestore</span>
              </div>
              <div className="text-[10px] text-[#8a8f98] font-mono">Standard Edition</div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#82c9a7]">
                <Cloud className="w-3.5 h-3.5" />
                <span className="font-medium">Cloud Storage</span>
              </div>
              <div className="text-[10px] text-[#8a8f98] font-mono">Evidence Vault</div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#82c9a7]">
                <Server className="w-3.5 h-3.5" />
                <span className="font-medium">Cloud Run</span>
              </div>
              <div className="text-[10px] text-[#8a8f98] font-mono">Gemini Threat API</div>
            </div>
          </div>
        </section>

        {/* Section 5: Current Workspace Metadata */}
        <section className="space-y-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8a8f98]">Active Workspace</span>
            <span className="font-medium text-[#f7f8f8]">{activeWorkspace?.name || "Sentinel"}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8a8f98]">Workspace Identifier</span>
            <span className="font-mono text-[11px] text-[#8a8f98]">{activeWorkspace?.id || "ws-default"}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8a8f98]">Deployment Region</span>
            <span className="text-[#f7f8f8]">{activeWorkspace?.region || "European Union"}</span>
          </div>
        </section>

        {/* Workspace Operations & Real Data Management */}
        <section className="space-y-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8a8f98]">
            <Database className="w-3.5 h-3.5" />
            <span>Workspace Operations & Data Hygiene</span>
          </div>
          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-white">Reset to Clean Workspace (0 Records)</div>
                <div className="text-[11px] text-[#8a8f98]">Purges local cache and starts empty for real-world business operation.</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset workspace to 0 records? All cached data will be cleared.")) {
                    clearAllWorkspaceData(activeWorkspace?.id || "default-workspace");
                    window.location.reload();
                  }
                }}
                className="px-3 py-1.5 rounded-md bg-[#eb5757]/10 hover:bg-[#eb5757]/20 border border-[#eb5757]/20 text-[#eb5757] text-xs font-medium transition-colors"
              >
                Clear All Records
              </button>
            </div>
            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-white">Load Demo Simulation Suite</div>
                <div className="text-[11px] text-[#8a8f98]">Populate sample supplier, invoice discrepancy, and threat dossier for testing.</div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await seedBusinessDemoData(activeWorkspace?.id || "default-workspace");
                  window.location.reload();
                }}
                className="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-medium transition-colors"
              >
                Load Simulation
              </button>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#141518] hover:bg-[#1c1d22] border border-white/[0.08] text-xs text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
          >
            Back to Investigation
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-white/90 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save Profile Data"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

