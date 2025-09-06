import React from "react";

export const Footer = () => (
  <footer className="py-8 text-sm">
    <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-slate-500">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#205FEA] grid place-content-center text-white text-[10px]">B</div>
        <span className="font-medium text-slate-700">Bitva</span>
      </div>
      <div className="flex gap-6">
        <a href="#resources" className="hover:text-slate-700">Resources</a>
        <a href="#company" className="hover:text-slate-700">Company</a>
        <a href="#legal" className="hover:text-slate-700">Legal</a>
      </div>
      <p className="text-xs">© {new Date().getFullYear()} Bitva. All rights reserved.</p>
    </div>
  </footer>
);