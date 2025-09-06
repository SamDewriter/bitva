import React from "react";
import { Card, CardContent } from "../../../components/ui/card";

export const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  desc: string;
}> = ({ icon: Icon, title, desc }) => (
  <Card className="h-full rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="w-11 h-11 rounded-xl grid place-content-center bg-teal-50 text-[#205FEA] mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
    </CardContent>
  </Card>
);
