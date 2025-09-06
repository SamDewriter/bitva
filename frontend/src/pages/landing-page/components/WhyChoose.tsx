import React from "react";
import { bullets } from "./constants";

export const WhyChoose = () => (
  <section className="bg-slate-50 border-y border-slate-200">
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-18 grid md:grid-cols-2 gap-10 items-center">
      <div>
        {/* <div className="aspect-video w-full rounded-2xl bg-white border border-slate-200 shadow-sm grid place-content-center">
          <div className="flex items-center gap-2 text-slate-600">
            <Lock className="w-6 h-6" />
            <span className="font-medium">Advanced Security Modules</span>
          </div>
        </div> */}
        <div className="hidden md:block">
            <img
              src="../src/images/why-choose.png"
              alt="Crypto network"
              className="h-full w-full object-cover"
            />
        </div>
      </div>
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Why Choose Bitva?</h3>
        <p className="text-slate-600 max-w-xl">
          Buy and sell crypto instantly, book flights with ease, and enjoy a seamless experience designed for both beginners and experts. With rock-solid security, lightning-fast transactions, and 24/7 support, 
          Bitva is your trusted platform for trading, payments, and travel.
        </p>
        <ul className="mt-6 space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#205FEA] text-white text-[11px]">{i + 1}</span>
              <span className="text-slate-700">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
