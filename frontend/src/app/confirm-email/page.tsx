"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SentinelLogo } from "@/components/ui/SentinelLogo";
import { useAuth } from "@/context/AuthContext";
import { Mail, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const { pendingEmail, expectedCode, verifyEmailCode, resendVerificationEmail } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the 6-digit confirmation code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const success = await verifyEmailCode(code);
      if (success) {
        // Proceed to workspace creation step
        router.push("/onboarding/workspace");
      } else {
        setError("Invalid confirmation code. Please check your inbox or request a new code.");
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLinkClicked = async () => {
    try {
      setLoading(true);
      setError("");
      const success = await verifyEmailCode("firebase-link");
      if (success) {
        router.push("/onboarding/workspace");
      } else {
        setError("Email verification not detected yet. Click the link in your email, or enter the 6-digit code below.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setCanResend(false);
      setCountdown(45);
      await resendVerificationEmail();
      setResendStatus("New verification email and code sent!");
      setTimeout(() => setResendStatus(""), 4000);
    } catch (err: any) {
      setError("Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] flex flex-col items-center justify-center px-4 relative select-none">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        {/* Monochromatic Sentinel Logo */}
        <Link href="/" className="transition-transform hover:scale-105">
          <SentinelLogo className="w-9 h-9 text-white" />
        </Link>

        {/* Title & Email Destination */}
        <div className="space-y-1.5">
          <h1 className="text-xl font-medium tracking-tight text-[#f7f8f8]">
            Check your inbox
          </h1>
          <p className="text-xs text-[#8a8f98] leading-relaxed">
            We sent a verification link and security code to
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white">
            <Mail className="w-3.5 h-3.5 text-[#8a8f98]" />
            <span>{pendingEmail || "your email address"}</span>
          </div>
        </div>

        {error && (
          <div className="w-full p-2.5 rounded-lg bg-[#eb5757]/10 border border-[#eb5757]/20 text-[11px] text-[#eb5757] text-left animate-fade-in">
            {error}
          </div>
        )}

        {resendStatus && (
          <div className="w-full p-2.5 rounded-lg bg-[#82c9a7]/10 border border-[#82c9a7]/20 text-[11px] text-[#82c9a7] text-left animate-fade-in flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{resendStatus}</span>
          </div>
        )}

        {/* 6-Digit Code Form */}
        <form onSubmit={handleVerify} className="w-full space-y-3 pt-1">
          <div className="space-y-1 text-left">
            <label className="text-[11px] text-[#8a8f98] font-medium block">
              Enter 6-digit confirmation code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center font-mono text-lg tracking-[0.5em] text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full py-2.5 px-4 rounded-lg bg-white/[0.1] hover:bg-white/[0.15] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
          >
            <span>{loading ? "Verifying..." : "Verify & Continue"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Direct Link Option */}
        <div className="w-full pt-1 space-y-2">
          <button
            type="button"
            onClick={handleEmailLinkClicked}
            disabled={loading}
            className="w-full py-2 px-3 rounded-lg bg-[#141518] hover:bg-[#1c1d22] border border-white/[0.06] text-xs text-[#8a8f98] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <span>I clicked the link in my email</span>
          </button>

          {/* Resend and Countdown */}
          <div className="flex items-center justify-between text-xs text-[#8a8f98] pt-2 px-1">
            <span>Didn&apos;t receive it?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className="text-white hover:underline disabled:text-[#62666d] disabled:no-underline font-medium flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${!canResend ? "animate-spin" : ""}`} />
              <span>{canResend ? "Resend email" : `Resend in ${countdown}s`}</span>
            </button>
          </div>
        </div>

        {/* Fallback development hint */}
        {expectedCode && (
          <div className="w-full p-2 rounded bg-white/[0.02] border border-white/[0.05] text-[10px] text-[#62666d] font-mono text-center">
            Security code: <span className="text-[#8a8f98]">{expectedCode}</span>
          </div>
        )}

        {/* Change email link */}
        <div className="pt-4 border-t border-white/[0.06] w-full text-xs text-[#8a8f98]">
          Wrong email?{" "}
          <Link href="/signup" className="text-white hover:underline font-medium">
            Use a different email
          </Link>
        </div>
      </div>
    </div>
  );
}

