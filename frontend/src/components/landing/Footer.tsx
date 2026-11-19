"use client";

import Link from "next/link";
import { SentinelLogo } from "@/components/ui/SentinelLogo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#08090a] text-[#8a8f98] py-16 text-xs">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/[0.06]">
          {/* Col 1: Brand & Status */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <SentinelLogo withWordmark className="w-4 h-4 text-white" />
            </Link>

            <p className="text-xs text-[#62666d] max-w-xs leading-relaxed">
              Detect the threat. Understand the network. Protect the money. AI-powered financial threat intelligence and verification.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82] animate-pulse" />
              <span className="text-[#8a8f98] font-mono text-[11px]">All defensive engines operational</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <span className="text-[#f7f8f8] font-medium text-xs block">Product</span>
            <ul className="space-y-2 text-[#8a8f98]">
              <li>
                <Link href="#scamshield" className="hover:text-[#f7f8f8] transition-colors">
                  ScamShield
                </Link>
              </li>
              <li>
                <Link href="#trustgraph" className="hover:text-[#f7f8f8] transition-colors">
                  TrustGraph
                </Link>
              </li>
              <li>
                <Link href="#finguard" className="hover:text-[#f7f8f8] transition-colors">
                  FinGuard
                </Link>
              </li>
              <li>
                <Link href="/investigations/new" className="hover:text-[#f7f8f8] transition-colors">
                  Investigation Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture */}
          <div className="space-y-3">
            <span className="text-[#f7f8f8] font-medium text-xs block">Architecture</span>
            <ul className="space-y-2 text-[#8a8f98]">
              <li>
                <Link href="#security" className="hover:text-[#f7f8f8] transition-colors">
                  Zero-LLM Verification
                </Link>
              </li>
              <li>
                <Link href="#security" className="hover:text-[#f7f8f8] transition-colors">
                  Gemini Multimodal
                </Link>
              </li>
              <li>
                <Link href="#security" className="hover:text-[#f7f8f8] transition-colors">
                  Provenance Tracking
                </Link>
              </li>
              <li>
                <Link href="#scenario" className="hover:text-[#f7f8f8] transition-colors">
                  Golden Path Test
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div className="space-y-3">
            <span className="text-[#f7f8f8] font-medium text-xs block">Platform</span>
            <ul className="space-y-2 text-[#8a8f98]">
              <li>
                <span className="text-[#62666d]">Next.js 16</span>
              </li>
              <li>
                <span className="text-[#62666d]">FastAPI Backend</span>
              </li>
              <li>
                <span className="text-[#62666d]">React Flow</span>
              </li>
              <li>
                <span className="text-[#62666d]">Tailwind CSS v4</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#62666d] text-[11px]">
          <div>
            © 2026 SENTINEL Technologies Inc. Built for the 24-Hour Hackathon.
          </div>
          <div className="flex items-center gap-6">
            <span>Linear Design System</span>
            <span>•</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
