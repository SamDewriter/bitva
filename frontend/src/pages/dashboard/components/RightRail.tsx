import React from "react";

function RailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function RightRail() {
  return (
    <div className="grid gap-4">
      {/* Getting Started */}
      <RailCard title="Getting Started">
        <ul className="space-y-2 text-[13px] leading-5 text-gray-600">
          {[
            "Complete profile information",
            "Verify identity (KYC)",
            "Connect a crypto wallet",
            "Enable 2-Factor Authentication",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#205FEA]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <button className="mt-4 inline-flex items-center rounded-md bg-[#205FEA] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#1b4ed1]">
          Continue Setup
        </button>
      </RailCard>

      {/* System Status */}
      <RailCard title="System Status">
        <div className="space-y-2 text-[13px] leading-5">
          {[
            { name: "API", ok: true },
            { name: "Trading", ok: true },
            { name: "Payments", ok: true },
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <span className="text-gray-600">{s.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  s.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {s.ok ? "Operational" : "Issue"}
              </span>
            </div>
          ))}
        </div>
      </RailCard>

      {/* Shortcuts */}
      <RailCard title="Shortcuts">
        <div className="grid grid-cols-2 gap-2">
          {["Buy Crypto", "Sell Crypto", "Giftcard", "Book Flight"].map((t) => (
            <button
              key={t}
              className="rounded-lg border border-gray-200 px-3 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
            >
              {t}
            </button>
          ))}
        </div>
      </RailCard>

      {/* Security Tips */}
      <RailCard title="Security Tips">
        <ul className="list-disc pl-5 space-y-1 text-[13px] leading-5 text-gray-600">
          <li>Enable withdrawal address whitelist</li>
          <li>Review active sessions weekly</li>
          <li>Use an authenticator app (not SMS)</li>
        </ul>
        <a
          href="/settings/security"
          className="mt-3 inline-block text-[#205FEA] text-[12px] font-medium hover:underline"
        >
          Review Security Settings
        </a>
      </RailCard>
    </div>
  );
}
