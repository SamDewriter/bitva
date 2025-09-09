import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setBearer } from "../../api";
import cryptoImg from "../../images/crypto-network-1.png";
import bitvaLogo from "../../images/bitva.jpeg";
import { identifySmartsuppUser } from "../../lib/smartsupp";

const siteKey = import.meta.env.VITE_SMARTSUPP_KEY || "";

type LoginResponse = {
  access_token?: string;
  token_type?: string;
  name?: string;
  email?: string;
};

export default function SignInPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [msg, setMsg] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const redirectTo = "/dashboard";

  // Disable button unless both fields are filled and not loading
  const canSubmit = username.trim() !== "" && password !== "" && !loading;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (!username.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);

      const res = await api.post<LoginResponse>(
        "/login",
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
        const email = res.data?.email || "";
        if (email) localStorage.setItem("bitva:email", email);
        if (name) localStorage.setItem("bitva:name", name);
        const token = res.data?.access_token;
        if (token) {
          localStorage.setItem("bitva:access_token", token);
          setBearer(token);
        }
        setMsg("Login successful!");
        setUsername("");
        setPassword("");

        navigate(redirectTo, { replace: true });
        await identifySmartsuppUser(siteKey, username, name);

        return;
      }

      const detail =
        (res.data as any)?.detail ||
        (res.data as any)?.message ||
        `Login failed (HTTP ${res.status}).`;

      if (res.status === 401) setError("Invalid email or password.");
      else if (res.status === 403 && String(detail).toLowerCase().includes("verify"))
        setError("Please verify your email before logging in.");
      else setError(detail);
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="grid md:grid-cols-2 max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="hidden md:block">
          <img src={cryptoImg} alt="Crypto network" className="h-full w-full object-cover" />
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6 text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <img src={bitvaLogo} alt="Bitva Logo" className="w-7 h-7" />
              <span className="text-2xl font-bold text-[#205FEA]">Bitva</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Login to Bitva</h2>
            <p className="text-gray-500 text-sm mt-1">Access your secure trading account</p>
          </div>

          {msg && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800" role="status" aria-live="polite">
              {msg}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={submit} noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="your@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-[#205FEA] focus:border-[#205FEA] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-[#205FEA] focus:border-[#205FEA] text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full rounded-md py-2 text-white font-medium transition ${
                canSubmit ? "bg-[#205FEA] hover:bg-[#1b4ed1]" : "bg-[#205FEA]/60 cursor-not-allowed"
              }`}
            >
              {loading ? "Logging in..." : "Login Securely"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-[#205FEA] hover:underline">Register Now</Link>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link to="/forgot-password" className="text-[#205FEA] hover:underline">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}