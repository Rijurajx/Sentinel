"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Building2, User, Camera, ShieldCheck, ChevronRight } from "lucide-react";
import { SentinelLogo } from "@/components/ui/SentinelLogo";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, profile, updateProfile } = useAuth();

  const [accountType, setAccountType] = useState<"individual" | "business">("business");
  const [fullName, setFullName] = useState(profile?.fullName || user?.displayName || "");
  const [roleTitle, setRoleTitle] = useState(profile?.roleTitle || "Head of Financial Security");

  // Business specific fields
  const [legalName, setLegalName] = useState(profile?.businessDetails?.legalName || "");
  const [country, setCountry] = useState(profile?.businessDetails?.country || "United States / Delaware");
  const [industry, setIndustry] = useState(profile?.businessDetails?.industry || "Financial Services & Fintech");
  const [monthlyVolume, setMonthlyVolume] = useState(profile?.businessDetails?.monthlyVolume || "$1M - $10M");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please provide your full name.");
      return;
    }

    if (accountType === "business" && !legalName.trim()) {
      setError("Legal business name is required for business accounts.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await updateProfile({
        accountType,
        fullName: fullName.trim(),
        roleTitle: roleTitle.trim() || "Financial Controller",
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
      router.push("/onboarding/invite");
    } catch (err: any) {
      setError(err?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/invite");
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] flex flex-col justify-between select-none">
      {/* Top Subtle Brand Bar */}
      <div className="h-14 px-8 border-b border-white/[0.06] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <SentinelLogo className="w-5 h-5 text-white" />
          <span className="text-xs font-semibold tracking-wider text-[#f7f8f8]">SENTINEL</span>
        </Link>
        <div className="text-[11px] font-mono text-[#8a8f98]">
          STEP 2 OF 3 — PROFILE SETUP
        </div>
      </div>

      {/* Main Split Layout Matching Image 3 */}
      <div className="max-w-6xl w-full mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-1">
        {/* Left Form Column */}
        <div className="max-w-md w-full space-y-6 animate-fade-in">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-medium tracking-tight text-[#f7f8f8]">
              Set up your profile
            </h1>
            <p className="text-xs text-[#8a8f98]">
              Choose how you&apos;ll appear in Sentinel and define your financial protection posture
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-[#eb5757]/10 border border-[#eb5757]/20 text-[11px] text-[#eb5757]">
              {error}
            </div>
          )}

          {/* Account Type Selector (Individual vs Business) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#8a8f98]">Account Category</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccountType("business")}
                className={`p-3 rounded-lg border text-left transition-colors flex items-start gap-2.5 ${
                  accountType === "business"
                    ? "bg-white/[0.06] border-white/30 text-white"
                    : "bg-white/[0.02] border-white/[0.08] text-[#8a8f98] hover:bg-white/[0.04]"
                }`}
              >
                <Building2 className="w-4 h-4 mt-0.5 text-[#5e6ad2] shrink-0" />
                <div>
                  <div className="text-xs font-medium text-[#f7f8f8]">Business / Enterprise</div>
                  <div className="text-[10px] text-[#8a8f98] mt-0.5">
                    For corporate treasury, procurement & SecOps
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("individual")}
                className={`p-3 rounded-lg border text-left transition-colors flex items-start gap-2.5 ${
                  accountType === "individual"
                    ? "bg-white/[0.06] border-white/30 text-white"
                    : "bg-white/[0.02] border-white/[0.08] text-[#8a8f98] hover:bg-white/[0.04]"
                }`}
              >
                <User className="w-4 h-4 mt-0.5 text-[#5ed6c0] shrink-0" />
                <div>
                  <div className="text-xs font-medium text-[#f7f8f8]">Individual / Consultant</div>
                  <div className="text-[10px] text-[#8a8f98] mt-0.5">
                    For forensic investigators & sole proprietors
                  </div>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleContinue} className="space-y-4">
            {/* Name & Picture Matching Image 3 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[#8a8f98]">Name & picture</label>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                  {fullName ? fullName.slice(0, 2).toUpperCase() : "RR"}
                </div>
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter your name..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2]"
                />
              </div>
            </div>

            {/* Title Matching Image 3 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[#8a8f98]">Title / Role</label>
              <input
                type="text"
                placeholder="Software engineer, CFO, Lead Analyst..."
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2]"
              />
            </div>

            {/* Business Specific Mandatory & Optional Fields */}
            {accountType === "business" && (
              <div className="space-y-3 pt-2 border-t border-white/[0.06] animate-fade-in">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
                  <span>ORGANIZATION DATA</span>
                  <span className="text-[10px] text-[#5e6ad2]">FOR FINGUARD COMPLIANCE</span>
                </div>

                {/* Legal Entity Name (Mandatory) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8a8f98]">Legal Company Name</span>
                    <span className="text-[10px] text-[#f0b96d] font-mono">MANDATORY</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Asterion Technologies Inc."
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2]"
                  />
                </div>

                {/* Country / Jurisdiction (Mandatory) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8a8f98]">Primary Banking Jurisdiction</span>
                    <span className="text-[10px] text-[#f0b96d] font-mono">MANDATORY</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. United States, European Union, India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2]"
                  />
                </div>

                {/* Industry Sector (Optional) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8a8f98]">Industry / Sector</span>
                    <span className="text-[10px] text-[#62666d] font-mono">OPTIONAL</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Supply Chain, Healthcare, Technology"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2]"
                  />
                </div>

                {/* Monthly Volume (Optional) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8a8f98]">Estimated Monthly Wire Volume</span>
                    <span className="text-[10px] text-[#62666d] font-mono">OPTIONAL</span>
                  </div>
                  <select
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0c0d11] border border-white/[0.1] text-xs text-[#f7f8f8] focus:outline-none focus:border-[#5e6ad2]"
                  >
                    <option value="Under $500K">Under $500K / month</option>
                    <option value="$500K - $2M">$500K - $2M / month</option>
                    <option value="$2M - $10M">$2M - $10M / month</option>
                    <option value="$10M+">$10M+ / month (High Value Treasury)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Buttons Matching Image 3: Skip & Continue */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2 text-xs font-medium text-[#8a8f98] hover:text-white transition-colors"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-white/[0.08] hover:bg-white text-white hover:text-black text-xs font-medium transition-colors"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Atmospheric Preview Column Matching Image 3 */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 relative">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 space-y-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="w-40 h-40 bg-[#5e6ad2]/10 blur-3xl absolute -top-10 -right-10 pointer-events-none" />

            <div className="flex items-center justify-between text-xs text-[#8a8f98]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ebe82]" />
                <span className="font-mono text-[11px] text-[#f7f8f8]">SENTINEL DESKTOP</span>
              </div>
              <span className="text-[10px] font-mono">v1.0.4 PROD</span>
            </div>

            <div className="p-4 rounded-xl bg-[#08090a] border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                  {fullName ? fullName.slice(0, 2).toUpperCase() : "RR"}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#f7f8f8]">
                    {fullName || "Riju Raj"}
                  </div>
                  <div className="text-[10px] text-[#8a8f98] font-mono">
                    {roleTitle || "Lead Threat Analyst"} • {accountType === "business" ? (legalName || "Asterion Corp") : "Independent"}
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.06]" />

              <div className="text-[11px] font-mono text-[#8a8f98] space-y-1">
                <div className="flex justify-between">
                  <span>DEFENSE ENGINE:</span>
                  <span className="text-[#4ebe82]">READY</span>
                </div>
                <div className="flex justify-between">
                  <span>JURISDICTION:</span>
                  <span className="text-[#f7f8f8]">{country}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#62666d] leading-relaxed text-center">
              Your profile grants role-based cryptographic signing across ScamShield, TrustGraph, and FinGuard audit trails.
            </p>
          </div>
        </div>
      </div>

      {/* Pagination Indicator Dots Matching Image 3 (● ○ ○) */}
      <div className="py-6 flex justify-center items-center gap-2">
        <span className="w-6 h-1 rounded-full bg-white/30" />
        <span className="w-2 h-2 rounded-full bg-white" />
        <span className="w-2 h-2 rounded-full bg-white/30" />
      </div>
    </div>
  );
}

