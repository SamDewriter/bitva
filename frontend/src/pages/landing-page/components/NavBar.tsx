import React from "react";
import { Button } from "../../../components/ui/button";
import bitvaLogo from "../../../images/bitva.jpeg"; // adjust path based on where NavBar is
import { Link } from "react-router-dom";

export const NavBar = () => (
  <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-slate-200">
    <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {<img src={bitvaLogo} alt="Bitva Logo" className="w-7 h-7" />}
        <span className="font-semibold text-[#205FEA]">Bitva</span>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
        <a href="#home" className="hover:text-slate-900">Home</a>
        <a href="#features" className="hover:text-slate-900">Features</a>
        {/* <a href="#pricing" className="hover:text-slate-900">Pricing</a> */}
        {/* <a href="#contact" className="hover:text-slate-900">Contact</a> */}
      </nav>
      <div className="flex items-center gap-3">
        <Link to="/login">
          <Button variant="ghost" className="text-slate-700 hover:text-slate-900">Log In</Button>
        </Link>
        <Link to="/register">
          <Button className="bg-[#205FEA] hover:bg-[#1b4ed1] text-white">Sign Up</Button>
        </Link> 
      </div>
    </div>
  </header>
);