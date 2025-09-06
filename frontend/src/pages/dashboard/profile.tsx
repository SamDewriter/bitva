import React, { useState } from "react";
import { UserMenu } from "./components/UserMenu";
import bitvaLogo from "../../images/bitva.jpeg"; // adjust path based on where NavBar is


// TEMP auth hook — replace with your real auth
function useAuthUser() {
  const name = localStorage.getItem("bitva:name") || "Alex";
  const email = localStorage.getItem("bitva:email") || "alex@example.com";
  const avatar = localStorage.getItem("bitva:avatar") || "";
  return { name, email, avatar };
}

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name, email, avatar } = useAuthUser();

  const [formName, setFormName] = useState(name);
  const [formEmail, setFormEmail] = useState(email);
  const [formAvatar, setFormAvatar] = useState(avatar);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const NavItems = () => (
    <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
      <a href='/dashboard' className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">
        Dashboard Overview
      </a>
      <a className="flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-900 font-medium">
        Profile
      </a>
    </nav>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("bitva:name", formName);
      localStorage.setItem("bitva:email", formEmail);
      localStorage.setItem("bitva:avatar", formAvatar);
      setMessage("Profile updated successfully!");
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          {<img src={bitvaLogo} alt="Bitva Logo" className="w-7 h-7" />}
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
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
          <UserMenu name={name} avatar={avatar} />
        </header>

        {/* Content */}
        <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
              <input
                type="url"
                value={formAvatar}
                onChange={(e) => setFormAvatar(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA] text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-[#205FEA] hover:bg-[#1b4ed1] disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-white font-medium transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
