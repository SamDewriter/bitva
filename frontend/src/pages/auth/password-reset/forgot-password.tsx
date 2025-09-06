import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import forgotImg from "../../../images/reset-password.png";
import bitvaLogo from "../../../images/bitva.jpeg"; // adjust path based on where NavBar is


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      // Adjust endpoint/body to your backend
      await api.post("/forgot_password", { email });
      setSent(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "We couldn't send the reset email. Please try again.";
      setError(typeof msg === "string" ? msg : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Success panel (in-place state on the same /forgot-password route)
  if (sent) {
    return (
      <div className="min-h-screen bg-[#f7f7fb] relative overflow-hidden flex items-center justify-center px-4">
        {/* optional subtle curves/backdrop – keep simple shapes */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="w-full max-w-xl rounded-2xl bg-white shadow-sm border border-gray-200 px-6 py-8">
          {/* green check */}
          <div className="mx-auto mb-4 grid h-10 w-10 place-content-center rounded-full bg-green-100">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 text-center">Check your email</h1>
          <p className="mt-3 text-center text-gray-600">
            If an account exists for <b className="font-semibold">{email}</b>,{" "}
            you’ll get an email with instructions to reset your password.
          </p>

          <p className="mt-5 text-center text-gray-600">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <a href="/support" className="text-[#205FEA] hover:underline">contact support</a>.
          </p>

          <div className="mt-6 text-center">
            <button
              onClick={() => setSent(false)}
              className="text-[#205FEA] hover:underline text-sm"
            >
              ← Edit email
            </button>
            <span className="mx-2 text-gray-300">•</span>
            <Link to="/login" className="text-[#205FEA] hover:underline text-sm">
              Back to Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="grid md:grid-cols-2 max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="hidden md:block">
          <img src={forgotImg} alt="Forgot password" className="h-full w-full object-cover" />
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6 text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              {<img src={bitvaLogo} alt="Bitva Logo" className="w-7 h-7" />}
              <span className="text-2xl font-bold text-[#205FEA]">Bitva</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Forgot Password</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your email address and we will send you a link to reset your password.</p>
          </div>

          {/* {msg && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800" role="status" aria-live="polite">
              {msg}
            </div>
          )} */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-[#205FEA] focus:border-[#205FEA] text-sm"
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-md py-2 text-white font-medium transition ${
                submitting ? "bg-[#205FEA]/60 cursor-not-allowed" : "bg-[#205FEA] hover:bg-[#1b4ed1]"
              }`}
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}
