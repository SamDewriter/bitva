import React, { useState } from "react";
import { UserMenu } from "./components/UserMenu";
import Sidebar from "./components/NavAccessories";
import api from "../../api";

// TEMP auth hook — replace with your real auth
function useAuthUser() {
  const name = localStorage.getItem("bitva:name") || "Alex";
  const email = localStorage.getItem("bitva:email") || "alex@example.com";
  const avatar = localStorage.getItem("bitva:avatar") || "";
  const access_token = localStorage.getItem("bitva:access_token");
  return { name, email, avatar, access_token };
}

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name, email, avatar } = useAuthUser();

  const [formName, setFormName] = useState(name);
  const [formEmail] = useState(email);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Disable button unless name has changed and not saving
  const isChanged = formName.trim() !== name.trim();
  const canSubmit = isChanged && !saving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = { name: formName };
      const access_token = localStorage.getItem("bitva:access_token");
      console.log("Access Token:", access_token); // Debug log
      const res = await api.post(
        "/update_profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (res.status >= 200 && res.status < 300) {
        localStorage.setItem("bitva:name", formName);
        setMessage("Profile updated successfully!");
        if (formName !== name) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      setMessage("An error occurred while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA] text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
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