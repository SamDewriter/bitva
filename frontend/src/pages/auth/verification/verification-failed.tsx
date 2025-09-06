import React from "react";
import { Link } from "react-router-dom";

export default function VerificationFailed() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
        {/* Error icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-red-500">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            stroke="red"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Verification Failed
        </h1>

        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          We couldn&apos;t verify your Bitva account. The verification link may have
          expired or is invalid.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">What Can You Do?</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          You can request a new verification email to activate your account. If you
          think this is a mistake, please contact our support team.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => alert("Resend verification triggered")}
            className="w-full sm:w-auto rounded-md bg-[#205FEA] hover:bg-[#1b4ed1] px-5 py-2.5 text-white font-medium transition"
          >
            Resend Verification
          </button>
          <Link to="/support" className="inline-flex">
            <button className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-5 py-2.5 text-gray-800 hover:bg-gray-50 font-medium transition">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
