import React from "react";
import { NavBar } from "./components/NavBar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { WhyChoose } from "./components/WhyChoose";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <NavBar />
      <main>
        <Hero />
        <Features />
        <WhyChoose />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}