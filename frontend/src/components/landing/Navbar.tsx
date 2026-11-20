"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, BookOpen, Compass } from "lucide-react";
import { SentinelLogo } from "@/components/ui/SentinelLogo";
import { DocsModal } from "@/components/modals/DocsModal";
import { GuideModal } from "@/components/modals/GuideModal";

export function Navbar() {
  const [docsOpen, setDocsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/[0.06] bg-[#08090a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2">
            <SentinelLogo withWordmark className="w-4 h-4 text-white" />
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#8a8f98]">
            <Link
              href="#interactive-demo"
              className="hover:text-white transition-colors"
            >
              Interactive Demo
            </Link>
            <Link
              href="#features"
              className="hover:text-white transition-colors"
            >
              Architecture
            </Link>
            <Link
              href="#scenario"
              className="hover:text-white transition-colors"
            >
              Interception Lifecycle
            </Link>
            <Link
              href="#security"
              className="hover:text-white transition-colors"
            >
              Rigor &amp; Specs
            </Link>

            {/* Modal Triggers */}
            <button
              type="button"
              onClick={() => setDocsOpen(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-[#8a8f98]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span>Docs</span>
            </button>

            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-[#8a8f98]"
            >
              <Compass className="w-3.5 h-3.5 text-[#4ebe82]" />
              <span>Guide</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick buttons on mobile */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setDocsOpen(true)}
                className="text-xs text-[#8a8f98] hover:text-white px-2 py-1 rounded bg-white/[0.04]"
              >
                Docs
              </button>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="text-xs text-[#8a8f98] hover:text-white px-2 py-1 rounded bg-white/[0.04]"
              >
                Guide
              </button>
            </div>

            <Link
              href="/login"
              className="hidden sm:inline-block text-xs text-[#8a8f98] hover:text-white transition-colors font-medium"
            >
              Log in
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#f7f8f8] text-[#08090a] hover:bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.7)] transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Open Dashboard</span>
              <ChevronRight className="w-3 h-3 text-[#08090a]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Docs & Guide Modals */}
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
      <GuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
