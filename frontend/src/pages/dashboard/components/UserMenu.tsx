import React, { useEffect, useRef, useState } from "react";
import api from "../../../api";

const access_token = localStorage.getItem("access_token");



export function UserMenu({ name, avatar }: { name: string; avatar?: string }) {

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("bitva:name");
      localStorage.removeItem("bitva:email");
      localStorage.removeItem("bitva:avatar");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
  }

  };
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("click", onClickOutside);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("click", onClickOutside);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  const initials = name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="hidden sm:inline text-sm text-gray-700">{name}</span>
        {avatar ? (
          <img src={avatar} alt={name} className="h-8 w-8 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#205FEA] text-white grid place-content-center text-xs font-semibold">
            {initials}
          </div>
        )}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
          <a href="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Profile</a>
          {/* <a href="/settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Settings</a> */}
          <button
            onClick={(e) => {
              submit(e);
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
} 