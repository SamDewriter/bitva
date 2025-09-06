import React, { useState } from "react";
import { UserMenu } from "./components/UserMenu";
import { QuickActionCard } from "./components/QuickActionCard";
import { DollarSign, ShoppingCart, Gift, Plane } from "lucide-react";
import bitvaLogo from "../../images/bitva.jpeg"; // adjust path based on where NavBar is

// TEMP auth hook — replace with your real auth
function useAuthUser() {
  const name = localStorage.getItem("bitva:name") || "Alex";
  const avatar = localStorage.getItem("bitva:avatar") || "";
  return { name, avatar };
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name, avatar } = useAuthUser();

  const NavItems = () => (
    <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
      <a className="flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-900 font-medium">
        Dashboard Overview
      </a>
      <a href="/profile" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
        Profile
      </a>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          {<img src={bitvaLogo} alt="Bitva Logo" className="w-7 h-7" />}
          <span className="font-bold text-lg text-[#205FEA]">Bitva</span>
        </div>
        <NavItems />
        {/* <div className="px-4 py-6 border-t text-sm text-gray-600">Profile</div> */}
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

      {/* Main */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white border-b px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <UserMenu name={name} avatar={avatar} />
        </header>

        {/* Content */}
        <div className="px-4 md:px-8 py-6">
          {/* Greeting */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome, {name}!</h2>
            {/* <p className="text-gray-500 mt-1">Your quick actions and key insights at a glance.</p> */}
          </div>

          {/* Quick Actions — full-width grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <QuickActionCard
              icon={<DollarSign />}
              title="Sell Crypto"
              blurb="Instantly sell your cryptocurrency holdings for fiat currency."
            />
            <QuickActionCard
              icon={<ShoppingCart />}
              title="Buy Crypto"
              blurb="Purchase cryptocurrencies with ease and competitive rates."
            />
            <QuickActionCard
              icon={<Gift />}
              title="Trade Giftcard"
              blurb="Exchange your unused gift cards for crypto or cash."
            />
            <QuickActionCard
              icon={<Plane />}
              title="Book Flight"
              blurb="Book flights globally using your crypto or other funds."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
