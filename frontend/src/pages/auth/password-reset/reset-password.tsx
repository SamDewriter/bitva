import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../../api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canSubmit = password.length >= 8 && password === confirm && token;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/reset_password", {
        token, new_password: password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Choose a new password for your account.
        </p>

        {!token && (
          <div className="mt-4 rounded-md bg-orange-50 px-3 py-2 text-sm text-orange-800 text-center">
            Missing or invalid reset token. Please use the link from your email.
          </div>
        )}

        {success ? (
          <div className="mt-6 space-y-4 text-center">
            <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
              Your password has been updated successfully.
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md bg-[#205FEA] hover:bg-[#1b4ed1] px-4 py-2 text-white text-sm font-medium"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!error || (password && confirm && password !== confirm) ? true : false}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA] text-sm"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-2 my-auto text-gray-500 hover:text-gray-700"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="mt-1 text-[12px] text-gray-500">
                Must be at least 8 characters.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!error || (password && confirm && password !== confirm) ? true : false}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-[#205FEA] focus:ring-[#205FEA] text-sm"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-2 my-auto text-gray-500 hover:text-gray-700"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            {password && confirm && password !== confirm && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 text-center">
                Passwords do not match.
              </div>
            )}
            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full rounded-md bg-[#205FEA] hover:bg-[#1b4ed1] disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-white font-medium transition"
            >
              {submitting ? "Updating..." : "Update Password"}
            </button>
            <div className="text-center">
              <Link to="/login" className="text-[#205FEA] text-sm hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
