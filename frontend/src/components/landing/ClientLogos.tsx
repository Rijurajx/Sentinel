"use client";

export function ClientLogos() {
  const clients = [
    "Asterion Tech",
    "Apex Ledger",
    "Veritas Capital",
    "Meridian Pay",
    "Novus Financial",
    "Vanguard Protocol",
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 border-b border-white/[0.06] text-center">
      <p className="text-xs text-[#8a8f98] font-normal tracking-wide uppercase mb-6 font-mono">
        Engineered for high-volume accounts payable, finance controllers, and security operations
      </p>

      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-50 hover:opacity-75 transition-opacity">
        {clients.map((client) => (
          <div
            key={client}
            className="flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold tracking-wider text-[#d0d3d8]"
          >
            <span className="w-2 h-2 rounded-sm bg-white/40" />
            <span>{client}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

