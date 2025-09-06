import React from "react";
import { Card, CardContent } from "../../../components/ui/card";

export const TestimonialCard: React.FC<{
  name: string;
  role: string;
  quote: string;
  avatar: string;
}> = ({ name, role, quote, avatar }) => (
  <Card className="h-full rounded-2xl border-slate-200 shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-medium text-slate-800">{name}</p>
          <p className="text-xs text-slate-500 -mt-0.5">{role}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600 leading-relaxed">“{quote}”</p>
    </CardContent>
  </Card>
);
