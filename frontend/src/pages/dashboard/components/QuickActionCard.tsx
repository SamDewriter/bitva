import React from "react";
import { openSmartsupp } from "../../../lib/smartsupp";

type Props = {
  icon: React.ReactNode;
  title: string;
  blurb: string;
  onClick?: () => void;
};

const SMARTSUPP_KEY = import.meta.env.VITE_SMARTSUPP_KEY || "";

if (!SMARTSUPP_KEY) {
  console.warn("SMARTSUPP_KEY is not set. Chat widget will not be available.");
}

export function QuickActionCard({ icon, title, blurb, onClick }: Props) {
  const handleClick = onClick || (() => openSmartsupp(SMARTSUPP_KEY));

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3">
      {/* Title row */}
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-md bg-[#205FEA]/10 text-[#205FEA] grid place-content-center">
          <div className="[&>svg]:h-5 [&>svg]:w-5">{icon}</div>
        </div>
        <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Blurb */}
      <p className="mt-2 text-[13px] leading-5 text-gray-600">
        {blurb}
      </p>

      {/* Button */}
      <button
        onClick={handleClick}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#205FEA] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#1b4ed1] transition"
      >
        Open Chat
        <span className="inline-grid h-5 w-5 place-content-center rounded-md border border-white/40">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        </span>
      </button>
    </div>
  );
}