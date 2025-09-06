import React from "react";
import bitvaLogo from "../../../images/bitva.jpeg"; // adjust path based on where NavBar is

export const Footer = () => (
  <footer className="py-8 text-sm">
    <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-slate-500">
      <div className="flex items-center gap-2">
        {<img src={bitvaLogo} alt="Bitva Logo" className="w-7 h-7" />}
        <span className="font-semibold text-[#205FEA]">Bitva</span>
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