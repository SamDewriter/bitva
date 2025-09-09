import React from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import cryptoImg from "../../images/crypto-network-2.png";
import bitvaLogo from "../../images/bitva.jpeg";

export default function RegisterForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [msg, setMsg] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  // Disable button unless all fields are filled, passwords match, and not loading
  const canSubmit =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password.length >= 8 &&
    confirmPassword.length >= 8 &&
    password === confirmPassword &&
    !loading;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!canSubmit) {
      setError("Please fill in all fields and ensure passwords match.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/register", {
        name,
        email,
        password,
      });
      setMsg("Registration successful! Check your email for verification.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Registration failed:", err);
      const serverMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="grid md:grid-cols-2 max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
        {/* Left image */}
        <div className="hidden md:block">
          <img
            src={cryptoImg}
            alt="Crypto network"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6 text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <img src={bitvaLogo} alt="Bitva Logo" className="w-7 h-7" />
              <span className="text-2xl font-bold text-[#205FEA]">Bitva</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Create Your Bitva Account
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your details to get started on the platform.
            </p>
          </div>

          {/* Feedback */}
          {msg && (
            <div
              className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
              role="status"
              aria-live="polite"
            >
              {msg}
            </div>
          )}
          {error && (
            <div
              className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={submit} noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-[#205FEA] focus:border-[#205FEA] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-[#205FEA] focus:border-[#205FEA] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-[#205FEA] focus:border-[#205FEA] text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-[#205FEA] focus:border-[#205FEA] text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full rounded-md py-2 text-white font-medium transition ${
                canSubmit
                  ? "bg-[#205FEA] hover:bg-[#1b4ed1]"
                  : "bg-[#205FEA]/60 cursor-not-allowed"
              }`}
            >
              {loading ? "Registering..." : "Register Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#205FEA] hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}