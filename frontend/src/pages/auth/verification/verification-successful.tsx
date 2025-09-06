// src/pages/verify/verification-success.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function VerificationSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
        {/* Check icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-[#205FEA]">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            stroke="#205FEA"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Verification Successful!
        </h1>

        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Your Bitva account has been successfully verified. You now have full access
          to all features.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-gray-900">What&apos;s Next?</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          You can now proceed to your dashboard to explore all the powerful tools and
          resources Bitva offers. We&apos;re excited to have you on board!
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard" className="inline-flex">
            <button className="w-full sm:w-auto rounded-md bg-[#205FEA] hover:bg-[#1b4ed1] px-5 py-2.5 text-white font-medium transition">
              Go to Dashboard
            </button>
          </Link>
          <a href="/#features" className="inline-flex">
            <button className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-5 py-2.5 text-gray-800 hover:bg-gray-50 font-medium transition">
              Explore Features
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
