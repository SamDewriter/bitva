import React from "react";
import { Link, useNavigate } from "react-router-dom";
import adminImg from "../../images/admin.png";
import api, { setBearer } from "../../api";


type LoginResponse = {
  access_token?: string;
  token_type?: string;
  name?: string;
};


export default function AdminLogin() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const navigate = useNavigate();
  const redirectTo = "/admin/dashboard";

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = validEmail && password.length >= 6;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const body = new URLSearchParams();
      body.append("username", email);
      body.append("password", password);

      const res = await api.post<LoginResponse>(
        "/admin/login",
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          validateStatus: () => true,
        }
      );

      if (res.status >= 200 && res.status < 300) {
        const name = res.data?.name || "User";
        localStorage.setItem("bitva:name", name);
        localStorage.setItem("bitva:email", email);
        if (remember) localStorage.setItem("bitva:remember", "1");
        else localStorage.removeItem("bitva:remember");
        const token = res.data?.access_token;
        if (token) {
          localStorage.setItem("access_token", token);
          setBearer(token);
        }
        setError("");
        setEmail("");
        setPassword("");
        navigate(redirectTo, { replace: true });
        return;
      } 
      
      const detail =
        (res.data as any)?.detail ||
        (res.data as any)?.message ||
        `Login failed (HTTP ${res.status}).`;

      if (res.status === 401) setError("Invalid email or password.");
      else if (res.status === 403)
        setError("Access denied. Admins only.");
      else setError(detail);
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left image — match your existing login artwork */}
          <div className="hidden md:block bg-black/5">
            <img
              src={adminImg}
              alt="Admin access"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right form card */}
          <div className="px-6 sm:px-10 py-10">
            {/* Brand row + Admin badge (matches your login header style) */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-6 w-6 rounded-md bg-[#205FEA] grid place-content-center text-white text-[12px] font-bold">
                B
              </div>
              <span className="text-[#205FEA] font-bold text-2xl">Bitva</span>
              <span className="ml-2 text-[11px] rounded-full border px-2 py-0.5 font-medium text-[#205FEA] border-[#205FEA]">
                Admin
              </span>
            </div>

            <h1 className="mt-4 text-center text-2xl font-semibold text-gray-900">
              Login to Bitva
            </h1>
            <p className="mt-1 text-center text-sm text-gray-600">
              Access your secure administrative console
            </p>

            {error && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="admin@bitva.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA] text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#205FEA] focus:ring-[#205FEA]"
                  />
                  Remember on this device
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[12px] text-[#205FEA] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="w-full rounded-md px-4 py-2 font-medium transition
                           text-white bg-[#205FEA] hover:bg-[#1b4ed1]
                           disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {submitting ? "Signing in..." : "Login Securely"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Not an admin?{" "}
                <Link to="/login" className="text-[#205FEA] hover:underline">
                  Return to User Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
