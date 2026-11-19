"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, Globe, Shield, ArrowRight } from "lucide-react";

export default function CreateWorkspacePage() {
  const router = useRouter();
  const { user, createWorkspace } = useAuth();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [region, setRegion] = useState("European Union");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 32)
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a workspace name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createWorkspace({
        name: name.trim(),
        slug: slug || "workspace",
        region,
      });
      router.push("/onboarding/profile");
    } catch (err: any) {
      setError(err?.message || "Failed to create workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] flex flex-col items-center justify-center px-4 relative select-none">
      {/* Centered Workspace Creation Form Matching Image 2 */}
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6 animate-fade-in">
        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-xl font-medium tracking-tight text-[#f7f8f8]">
            Create a workspace
          </h1>
          <p className="text-xs text-[#8a8f98]">
            Move work forward across teams and agents
          </p>
        </div>

        {error && (
          <div className="w-full p-2.5 rounded-lg bg-[#eb5757]/10 border border-[#eb5757]/20 text-[11px] text-[#eb5757] text-left">
            {error}
          </div>
        )}

        {/* Workspace Form */}
        <form onSubmit={handleCreate} className="w-full space-y-4 text-left">
          {/* 1. Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#8a8f98]">Name</label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Acme Security Corp"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2] transition-colors"
            />
          </div>

          {/* 2. URL Prefix + Slug */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#8a8f98]">URL</label>
            <div className="flex items-center rounded-lg bg-white/[0.03] border border-white/[0.1] px-3 py-2 focus-within:border-[#5e6ad2] transition-colors">
              <span className="text-xs text-[#62666d] select-none font-mono">
                sentinel.app/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="acme"
                className="flex-1 bg-transparent text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* 3. Region Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#8a8f98]">Region</label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full appearance-none px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-[#f7f8f8] focus:outline-none focus:border-[#5e6ad2] cursor-pointer"
              >
                <option value="European Union" className="bg-[#0c0d11]">
                  European Union (GDPR Verified)
                </option>
                <option value="US East (N. Virginia)" className="bg-[#0c0d11]">
                  US East (N. Virginia)
                </option>
                <option value="Asia Pacific (Mumbai)" className="bg-[#0c0d11]">
                  Asia Pacific (Mumbai)
                </option>
                <option value="Google Cloud Run Global" className="bg-[#0c0d11]">
                  Google Cloud Run (Global Multi-Region)
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8a8f98] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-2.5 rounded-lg bg-white/[0.08] hover:bg-white text-white hover:text-black text-xs font-medium transition-colors disabled:opacity-40 disabled:hover:bg-white/[0.08] disabled:hover:text-white"
            >
              {loading ? "Creating workspace..." : "Create workspace"}
            </button>
          </div>
        </form>

        {/* Secondary Links Matching Image 2 */}
        <div className="space-y-4 pt-2">
          <Link
            href="/dashboard"
            className="text-xs text-[#8a8f98] hover:text-white transition-colors block"
          >
            Join existing workspace instead
          </Link>

          <div className="text-[11px] text-[#62666d]">
            Using{" "}
            <span className="text-[#8a8f98]">{user?.email || "rijurajdatta8@gmail.com"}</span> •{" "}
            <Link href="/login" className="text-[#8a8f98] hover:underline">
              Use a different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

