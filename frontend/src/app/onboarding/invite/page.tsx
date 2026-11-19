"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SentinelLogo } from "@/components/ui/SentinelLogo";
import { useAuth } from "@/context/AuthContext";
import { Link as LinkIcon, Check, Users } from "lucide-react";

export default function InviteTeammatesPage() {
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const [emails, setEmails] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `https://sentinel.app/join/${activeWorkspace?.slug || "asterion"}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Complete onboarding and enter dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  const handleSkip = () => {
    router.push("/dashboard");
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
          STEP 3 OF 3 — TEAM INVITATION
        </div>
      </div>

      {/* Main Split Layout Matching Image 4 */}
      <div className="max-w-6xl w-full mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center flex-1">
        {/* Left Column Form */}
        <div className="max-w-md w-full space-y-6 animate-fade-in">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-medium tracking-tight text-[#f7f8f8]">
              Invite teammates
            </h1>
            <p className="text-xs text-[#8a8f98]">
              Get your treasury, legal, and SecOps analysts on Sentinel to collaborate on investigations
            </p>
          </div>

          <form onSubmit={handleFinish} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-[#8a8f98]">Invitations</label>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-[11px] text-[#8a8f98] hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-[#4ebe82]" />
                      <span className="text-[#4ebe82]">Link copied</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-3 h-3" />
                      <span>Copy invite link</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={4}
                placeholder="colleague@company.com, cfo@company.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2] resize-none"
              />
            </div>

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
                {loading ? "Entering..." : emails.trim() ? "Send invitations & enter" : "Enter workspace"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Atmospheric Team Preview Column Matching Image 4 */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 relative">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#5e6ad2]/20 border border-[#5e6ad2]/30 flex items-center justify-center text-[#5e6ad2]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium text-[#f7f8f8]">
                  {activeWorkspace?.name || "Workspace"}
                </div>
                <div className="text-[10px] text-[#8a8f98] font-mono">
                  Region: {activeWorkspace?.region || "European Union"}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
              <div className="text-[11px] font-mono text-[#8a8f98]">COLLABORATIVE THREAT DEFENSE:</div>
              <p className="text-[11px] text-[#62666d] leading-relaxed">
                Invited analysts gain access to real-time alerts, cross-incident TrustGraph correlation trails, and FinGuard invoice validation queues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Indicator Dots Matching Image 4 (○ ○ ●) */}
      <div className="py-6 flex justify-center items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white/30" />
        <span className="w-2 h-2 rounded-full bg-white/30" />
        <span className="w-6 h-1 rounded-full bg-white" />
      </div>
    </div>
  );
}

