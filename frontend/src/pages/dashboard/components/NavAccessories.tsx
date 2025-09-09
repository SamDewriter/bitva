import React from "react";
import bitvaLogo from "../../../images/bitva.jpeg"; // adjust path as needed

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export function NavItems() {
  return (
    <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
      <a href="/dashboard" className="flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-900 font-medium">
        Dashboard Overview
      </a>
      <a href="/profile" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
        Profile
      </a>
    </nav>
  );
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <img src={bitvaLogo} alt="Bitva Logo" className="w-7 h-7" />
          <span className="font-bold text-lg text-[#205FEA]">Bitva</span>
        </div>
        <NavItems />
      </aside>

      {/* Mobile slide-over sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#205FEA] grid place-content-center text-white font-bold text-xs">B</div>
              <span className="font-bold text-lg text-[#205FEA]">Bitva</span>
            </div>
            <button className="rounded-md p-2 hover:bg-gray-50" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">✕</button>
          </div>
          <NavItems />
          <div className="px-4 py-6 border-t text-sm text-gray-600">Profile</div>
        </aside>
      </div>
    </>
  );
}

