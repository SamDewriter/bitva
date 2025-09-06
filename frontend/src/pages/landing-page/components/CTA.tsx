import React from "react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";

export const CTA = () => (
  <section className="bg-[#24AFF2]/30 border-y border-slate-200">
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-18 text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Ready to Start Your Journey?</h3>
      <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
        Join thousands who trust Bitva for their cryptocurrency trading needs. Sign up today and experience the future of finance.
      </p>
      <div className="mt-6">
        <Link to="/register">
          <Button className="bg-[#205FEA] hover:bg-[#1b4ed1] text-white">Join Bitva Today</Button>
        </Link>
      </div>
    </div>
  </section>
);