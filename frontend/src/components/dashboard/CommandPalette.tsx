"use client";

import { useState, useEffect } from "react";
import { Search, X, Briefcase, Building2, GitFork, ArrowRight } from "lucide-react";
import {
  InvestigationItem,
  SupplierItem,
  EntityItem,
} from "@/lib/dashboard-data";
import { SentinelLogo } from "@/components/ui/SentinelLogo";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (type: string, id: string) => void;
  investigations?: InvestigationItem[];
  suppliers?: SupplierItem[];
  entities?: EntityItem[];
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectItem,
  investigations = [],
  suppliers = [],
  entities = [],
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredIncidents = investigations.filter(
    (i) => i.title.toLowerCase().includes(query.toLowerCase()) || i.id.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.accountNumber.includes(query)
  );

  const filteredEntities = entities.filter(
    (e) => e.value.toLowerCase().includes(query.toLowerCase()) || e.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl border border-white/[0.1] bg-[#0c0d11] shadow-2xl overflow-hidden animate-modal-enter"
      >
        {/* Search Input Bar */}
        <div className="h-12 px-4 border-b border-white/[0.08] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#8a8f98] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search investigations, suppliers, accounts, IFSC..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#f7f8f8] placeholder-[#62666d] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="w-5 h-5 rounded flex items-center justify-center text-[#8a8f98] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/[0.04] text-xs">
          {/* Investigations */}
          {filteredIncidents.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[10px] font-mono text-[#62666d] uppercase">Investigations</div>
              {filteredIncidents.map((inc) => (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => {
                    onSelectItem("investigation", inc.id);
                    onClose();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Briefcase className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0" />
                    <span className="font-mono text-[#8a8f98]">{inc.id}</span>
                    <span className="text-[#f7f8f8] truncate">{inc.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8a8f98] group-hover:text-white">Jump →</span>
                </button>
              ))}
            </div>
          )}

          {/* Suppliers */}
          {filteredSuppliers.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[10px] font-mono text-[#62666d] uppercase">Suppliers</div>
              {filteredSuppliers.map((sup) => (
                <button
                  key={sup.id}
                  type="button"
                  onClick={() => {
                    onSelectItem("supplier", sup.id);
                    onClose();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#4ebe82] shrink-0" />
                    <span className="text-[#f7f8f8] font-medium">{sup.name}</span>
                    <span className="font-mono text-[#8a8f98] text-[11px]">Acc: {sup.accountNumber}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8a8f98] group-hover:text-white">View →</span>
                </button>
              ))}
            </div>
          )}

          {/* Entities */}
          {filteredEntities.length > 0 && (
            <div className="py-1">
              <div className="px-2 py-1 text-[10px] font-mono text-[#62666d] uppercase">Correlated Entities</div>
              {filteredEntities.map((ent) => (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => {
                    onSelectItem("entity", ent.id);
                    onClose();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate font-mono">
                    <GitFork className="w-3.5 h-3.5 text-[#f0b96d] shrink-0" />
                    <span className="text-[#f7f8f8]">{ent.value}</span>
                    <span className="text-[10px] text-[#62666d]">({ent.type})</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8a8f98] group-hover:text-white">Trace →</span>
                </button>
              ))}
            </div>
          )}

          {filteredIncidents.length === 0 && filteredSuppliers.length === 0 && filteredEntities.length === 0 && (
            <div className="py-8 text-center text-[#62666d]">
              No matches found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="h-8 px-4 border-t border-white/[0.06] bg-[#090a0d] flex items-center justify-between text-[11px] text-[#62666d]">
          <div className="flex items-center gap-2">
            <SentinelLogo className="w-3 h-3 text-[#8a8f98]" />
            <span>Sentinel Intelligence</span>
          </div>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
}

