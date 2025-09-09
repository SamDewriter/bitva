// src/pages/admin/AdminUsers.tsx
import React, { useMemo, useState, useEffect } from "react";
import { AdminMenu } from "./components/AdminMenu";
import AdminSidebar from "./components/AdminSidebar";
import { Search, ShieldCheck, MoreHorizontal } from "lucide-react";
import api from "../../api";

// --- Types ---
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  verification: "verified" | "unverified";
  joined: string; // ISO date
};

// Fetch users with status as a PATH param: /admin/users/{status}
const fetchUsers = async (status: "all" | "active" | "inactive" | "verified" | "unverified"): Promise<User[]> => {
  const token = localStorage.getItem("bitva:access_token");

  const res = await api.get(`/admin/users/${encodeURIComponent(status)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status !== 200) {
    throw new Error(`Failed to fetch users (${res.status})`);
  }

  // backend returns: { users: [...] }
  const data = res.data;
  const list: unknown = Array.isArray(data) ? data : data?.users;
  if (!Array.isArray(list)) {
    throw new Error("Unexpected response shape (expected { users: [...] })");
  }
  return list as User[];
};

// TEMP auth hook — replace with your real auth
function useAuthUser() {
  const name = localStorage.getItem("bitva:name") || "Alex";
  const avatar = localStorage.getItem("bitva:avatar") || "";
  return { name, avatar };
}

function StatusBadge({ status }: { status: User["status"] }) {
  const map = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-amber-100 text-amber-700",
  } as const;
  const label = status[0].toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}>
      {label}
    </span>
  );
}

function VerificationBadge({ verification }: { verification: User["verification"] }) {
  const map = {
    verified: "bg-blue-100 text-blue-700",
    unverified: "bg-gray-100 text-gray-700",
  } as const;
  const label = verification[0].toUpperCase() + verification.slice(1);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[verification]}`}>
      {label}
    </span>
  );
}

export default function AdminUsers() {
  const { name, avatar } = useAuthUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Table state
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"all" | User["role"]>("all");
  const [status, setStatus] = useState<"all" | User["status"]>("all");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Fetch users when status changes
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErrMsg(null);
    fetchUsers(status)
      .then((data) => mounted && setUsers(data))
      .catch((err) => {
        console.error("fetchUsers error:", err);
        if (mounted) {
          setUsers([]);
          setErrMsg(err?.message || "Failed to load users");
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [status]);

  // Derived rows (search + role; status already filtered by API, but keep client filter for safety)
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchQ = !q || `${u.name} ${u.email}`.toLowerCase().includes(q);
      const matchRole = role === "all" || u.role === role;
      const matchStatus = status === "all" || u.status === status;
      return matchQ && matchRole && matchStatus;
    });
  }, [users, query, role, status]);

  // Local UI actions (replace with API calls when ready)
  function toggleSuspend(id: string) {
    setUsers((list) =>
      list.map((u) =>
        u.id === id ? { ...u, status: u.status === "inactive" ? "active" : "inactive" } : u
      )
    );
  }

  function approve(id: string) {
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, status: "active" } : u)));
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
            <h1 className="text-lg font-semibold">Dashboard Overview</h1>
          </div>
          <AdminMenu name={name} avatar={avatar} />
        </header>

        {/* Content */}
        <div className="px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-500 text-sm">View all users and manage their status.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Search */}
              <label className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  placeholder="Search name or email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-md border border-gray-300 bg-white text-sm shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA]"
                />
              </label>

              {/* Role filter */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA]"
              >
                <option value="all">All roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>

              {/* Status filter (drives API path) */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA]"
              >
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Error banner */}
          {errMsg && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errMsg}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      No users match your filters.
                    </td>
                  </tr>
                ) : (
                  rows.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#205FEA]/10 text-[#205FEA] grid place-content-center text-xs font-semibold">
                            {u.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-gray-700">
                          <ShieldCheck className="h-3.5 w-3.5 text-gray-500" /> {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <VerificationBadge verification={u.verification} />
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {u.joined ? new Date(u.joined).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {u.status === "inactive" ? (
                            <button
                              onClick={() => approve(u.id)}
                              className="rounded-md bg-[#205FEA] px-2.5 py-1 text-white text-xs hover:bg-[#1b4ed1]"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleSuspend(u.id)}
                              className="rounded-md px-2.5 py-1 text-xs border border-red-300 text-red-700 hover:bg-red-50"
                            >
                              Suspend
                            </button>
                          )}
                          <button className="rounded-md p-1 hover:bg-gray-50">
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span> Total: {rows.length} / {users.length} </span>
            <span className="hidden sm:inline">•</span>
            <span>
              Active: {users.filter((u) => u.status === "active").length}, Inactive:{" "}
              {users.filter((u) => u.status === "inactive").length}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
