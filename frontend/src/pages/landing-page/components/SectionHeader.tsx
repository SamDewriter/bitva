import React from "react";

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="mx-auto mb-10 text-center max-w-2xl">
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
      {title}
    </h2>
    {subtitle && <p className="mt-3 text-slate-600">{subtitle}</p>}
  </div>
);