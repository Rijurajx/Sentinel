"use client";

export function ClientLogos() {
  const clients = [
    "Apex Logistics",
    "Acme Industrial",
    "Veritas Capital",
    "Meridian Pay",
    "Novus Financial",
    "Vanguard Protocol",
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 border-b border-white/[0.06] text-center">
      <p className="text-[11px] text-[#62666d] tracking-wider uppercase mb-5 font-mono">
        Engineered for enterprise accounts payable, controllers, and treasury operations
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-40 hover:opacity-70 transition-opacity">
        {clients.map((client) => (
          <div
            key={client}
            className="flex items-center gap-2 font-mono text-xs font-medium tracking-wider text-[#8a8f98]"
          >
            <span className="w-1.5 h-1.5 rounded-sm bg-white/30" />
            <span>{client}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
