"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Search,
  Plus,
  GitFork,
  FileText,
  Scan,
  Activity,
  ChevronDown,
  Circle,
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
  Database,
  Settings,
  LogOut,
  FolderPlus,
} from "lucide-react";
import { SentinelLogo } from "@/components/ui/SentinelLogo";
import { useAuth } from "@/context/AuthContext";

interface PrimarySidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenQuickCreate: () => void;
  onOpenSearch: () => void;
  onOpenProfileSettings?: () => void;
  badges?: Record<string, string | number>;
}

export function PrimarySidebar({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  onOpenQuickCreate,
  onOpenSearch,
  onOpenProfileSettings,
  badges = {},
}: PrimarySidebarProps) {
  const router = useRouter();
  const { user, profile, workspaces, activeWorkspace, switchWorkspace, logout } = useAuth();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const [favoritesExpanded, setFavoritesExpanded] = useState(true);

  // Top-level root items matching Linear screenshot (Pulse, Inbox, My issues, Reviews)
  const topNavItems: Array<{ id: string; label: string; icon: any; badge?: string }> = [
    {
      id: "command",
      label: "Pulse",
      icon: Activity,
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: Inbox,
    },
    {
      id: "investigations",
      label: "My issues",
      icon: Circle,
    },
    {
      id: "finguard",
      label: "Reviews",
      icon: GitFork,
    },
  ];

  // Workspace items matching Linear screenshot (Workspace -> Initiatives, Projects, More)
  const workspaceItems = [
    { id: "evidence", label: "Evidence Vault", icon: Database },
    { id: "graph", label: "TrustGraph", icon: GitFork },
    { id: "suppliers", label: "Suppliers", icon: Building2 },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "scamshield", label: "ScamShield Ingest", icon: Scan },
    { id: "reports", label: "Intelligence Dossiers", icon: FileText },
  ];

  // User starred cases (empty initially until user stars records)
  const favoriteItems: Array<{ id: string; label: string; color: string; view: string }> = [];

  return (
    <aside
      className={`h-screen bg-[#08090a] border-r border-white/[0.08] flex flex-col justify-between shrink-0 select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 ${
        isCollapsed ? "w-14" : "w-64"
      }`}
    >
      {/* Top Header & Workspace Switcher */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="h-12 px-3 border-b border-white/[0.08] flex items-center justify-between">
          {!isCollapsed ? (
            <>
              {/* Workspace Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/[0.06] text-left transition-colors group"
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <SentinelLogo className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-[#f7f8f8] truncate max-w-[110px]">
                    {activeWorkspace?.name || "Sentinel"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#8a8f98] group-hover:text-white shrink-0" />
                </button>

                {/* Workspace Switcher Dropdown */}
                {workspaceMenuOpen && (
                  <div className="absolute top-10 left-0 w-60 rounded-lg border border-white/10 bg-[#0e1015] p-1.5 shadow-2xl z-50 text-xs animate-modal-enter">
                    <div className="px-2 py-1 text-[10px] font-mono text-[#8a8f98] uppercase">
                      Switch Workspace
                    </div>

                    <div className="space-y-0.5 max-h-48 overflow-y-auto">
                      {workspaces.map((ws) => (
                        <button
                          key={ws.id}
                          type="button"
                          onClick={() => {
                            switchWorkspace(ws.id);
                            setWorkspaceMenuOpen(false);
                          }}
                          className={`w-full px-2 py-1.5 rounded text-left flex items-center justify-between font-medium transition-colors ${
                            activeWorkspace?.id === ws.id
                              ? "text-[#f7f8f8] bg-white/[0.08]"
                              : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="truncate">{ws.name}</div>
                            <div className="text-[10px] text-[#62666d] font-mono leading-none">
                              {ws.region}
                            </div>
                          </div>
                          {activeWorkspace?.id === ws.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe82] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="my-1 border-t border-white/[0.06]" />

                    <Link
                      href="/onboarding/workspace"
                      className="w-full px-2 py-1.5 rounded text-left text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.04] flex items-center gap-2"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-[#5e6ad2]" />
                      <span>+ Create new workspace</span>
                    </Link>

                    <Link
                      href="/"
                      className="w-full px-2 py-1.5 rounded text-left text-[#62666d] hover:text-[#8a8f98] hover:bg-white/[0.02] block text-[11px]"
                    >
                      Back to Homepage
                    </Link>
                  </div>
                )}
              </div>

              {/* Action Icons: Search, Create & Collapse — Distinct, Non-overlapping */}
              <div className="flex items-center gap-1 shrink-0 text-[#8a8f98]">
                <button
                  type="button"
                  onClick={onOpenSearch}
                  title="Search (⌘K)"
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:text-[#f7f8f8] hover:bg-white/[0.06] transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onOpenQuickCreate}
                  title="New issue (C)"
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:text-[#f7f8f8] hover:bg-white/[0.06] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  title="Collapse sidebar ([)"
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:text-[#f7f8f8] hover:bg-white/[0.06] transition-colors ml-0.5"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* Collapsed Header: Monochromatic Sentinel Emblem (Click to expand) */
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Expand sidebar ([)"
                className="w-8 h-8 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-white transition-all group"
              >
                <SentinelLogo className="w-4 h-4 text-[#f7f8f8] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Area */}
        <div className={`p-2 space-y-4 transition-opacity duration-200 ${isCollapsed ? "px-1.5" : "px-2"}`}>
          {/* Top Primary Items (Pulse, Inbox, My issues, Reviews) */}
          <div className="space-y-0.5">
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectView(item.id)}
                  title={item.label}
                  className={`w-full flex items-center ${
                    isCollapsed ? "justify-center px-0 py-2" : "justify-between px-2.5 py-1.5"
                  } rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-white/[0.08] text-[#f7f8f8]"
                      : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#f7f8f8]" : "text-[#8a8f98]"}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && (badges[item.id] !== undefined && badges[item.id] !== "" ? badges[item.id] : item.badge) && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive
                          ? "bg-white/10 text-white font-medium"
                          : typeof (badges[item.id] ?? item.badge) === "number" && Number(badges[item.id] ?? item.badge) > 0
                          ? "bg-[#5e6ad2]/20 text-[#828fff] border border-[#5e6ad2]/30"
                          : "bg-white/[0.04] text-[#8a8f98]"
                      }`}
                    >
                      {badges[item.id] !== undefined && badges[item.id] !== "" ? badges[item.id] : item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section: Workspace */}
          <div className="space-y-0.5">
            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setWorkspaceExpanded(!workspaceExpanded)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-medium text-[#8a8f98] hover:text-white group"
              >
                <span>Workspace</span>
                <ChevronDown
                  className={`w-3 h-3 text-[#62666d] group-hover:text-white transition-transform ${
                    workspaceExpanded ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            )}

            {(workspaceExpanded || isCollapsed) && (
              <div className="space-y-0.5">
                {workspaceItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  const badgeVal = badges[item.id] !== undefined && badges[item.id] !== "" ? badges[item.id] : undefined;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectView(item.id)}
                      title={item.label}
                      className={`w-full flex items-center ${
                        isCollapsed ? "justify-center px-0 py-2" : "justify-between px-2.5 py-1.5"
                      } rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-white/[0.08] text-[#f7f8f8]"
                          : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#f7f8f8]" : "text-[#8a8f98]"}`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!isCollapsed && badgeVal && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isActive
                              ? "bg-white/10 text-white font-medium"
                              : typeof badgeVal === "number" && Number(badgeVal) > 0
                              ? "bg-[#5e6ad2]/20 text-[#828fff] border border-[#5e6ad2]/30"
                              : "bg-white/[0.04] text-[#8a8f98]"
                          }`}
                        >
                          {badgeVal}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Favorites */}
          <div className="space-y-0.5">
            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setFavoritesExpanded(!favoritesExpanded)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-medium text-[#8a8f98] hover:text-white group"
              >
                <span>Favorites</span>
                <ChevronDown
                  className={`w-3 h-3 text-[#62666d] group-hover:text-white transition-transform ${
                    favoritesExpanded ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            )}

            {(favoritesExpanded || isCollapsed) && (
              <div className="space-y-0.5">
                {favoriteItems.map((fav) => (
                  <button
                    key={fav.id}
                    type="button"
                    onClick={() => onSelectView(fav.view)}
                    title={fav.label}
                    className={`w-full flex items-center ${
                      isCollapsed ? "justify-center px-0 py-2" : "justify-between px-2.5 py-1.5"
                    } rounded-md text-xs text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.03] transition-colors group`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${fav.color}`} />
                      {!isCollapsed && <span className="truncate text-left">{fav.label}</span>}
                    </div>
                  </button>
                ))}
                {favoriteItems.length === 0 && !isCollapsed && (
                  <div className="px-2.5 py-1 text-[11px] text-[#62666d]">
                    No starred cases
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Account / Profile Footer */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-white/[0.08] flex items-center justify-between relative">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {profile?.fullName ? profile.fullName.slice(0, 2).toUpperCase() : user?.email ? user.email.slice(0, 2).toUpperCase() : "RR"}
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-[#f7f8f8] truncate">
                {profile?.fullName || user?.displayName || "Riju Raj"}
              </div>
              <div className="text-[10px] text-[#8a8f98] font-mono leading-none truncate">
                {profile?.roleTitle || "SecOps Analyst"}
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              title="Account Settings"
              className="w-6 h-6 rounded flex items-center justify-center text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.04]"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-8 right-0 w-48 rounded-lg border border-white/10 bg-[#0e1015] p-1.5 shadow-2xl z-50 text-xs animate-modal-enter">
                <div className="px-2 py-1 text-[10px] font-mono text-[#8a8f98] truncate">
                  {user?.email || "rijurajdatta8@gmail.com"}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenProfileSettings?.();
                  }}
                  className="w-full px-2 py-1.5 rounded text-left text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.04] flex items-center justify-between transition-colors"
                >
                  <span>Edit Profile</span>
                  <span className="text-[10px] text-[#62666d] font-mono">Right Pane</span>
                </button>
                <div className="my-1 border-t border-white/[0.06]" />
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    router.push("/login");
                  }}
                  className="w-full px-2 py-1.5 rounded text-left text-[#eb5757] hover:bg-[#eb5757]/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-white/[0.08] flex items-center justify-center">
          <button
            type="button"
            onClick={() => onOpenProfileSettings?.()}
            title="Edit Profile"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[10px] font-bold text-white transition-colors"
          >
            {profile?.fullName ? profile.fullName.slice(0, 2).toUpperCase() : "RR"}
          </button>
        </div>
      )}
    </aside>
  );
}
