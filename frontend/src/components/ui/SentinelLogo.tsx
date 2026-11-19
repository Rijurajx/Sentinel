"use client";

import React from "react";

interface SentinelLogoProps {
  className?: string;
  size?: number;
  withWordmark?: boolean;
  wordmarkClassName?: string;
}

export function SentinelLogo({
  className = "w-5 h-5 text-white",
  size,
  withWordmark = false,
  wordmarkClassName = "text-[13px] font-semibold tracking-wider text-[#f7f8f8]",
}: SentinelLogoProps) {
  const icon = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Sentinel Logo"
    >
      {/* Outer Monochromatic Protective Shield */}
      <path
        d="M12 2.5L4 6.75V13.25C4 17.65 7.35 21.15 12 22.25C16.65 21.15 20 17.65 20 13.25V6.75L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Geometric Diamond Core (Intelligence & Provenance) */}
      <path
        d="M12 7L16 12L12 17L8 12L12 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Precision Focal Center */}
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );

  if (!withWordmark) {
    return icon;
  }

  return (
    <div className="flex items-center gap-2.5 select-none group">
      <div className="transition-transform group-hover:scale-105 duration-200">
        {icon}
      </div>
      <span className={wordmarkClassName}>SENTINEL</span>
    </div>
  );
}

