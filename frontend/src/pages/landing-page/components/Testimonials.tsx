import React from "react";
import { SectionHeader } from "./SectionHeader";
import { TestimonialCard } from "./TestimonialCard";
import { testimonials } from "./constants";

export const Testimonials = () => (
  <section className="py-14 md:py-18">
    <div className="mx-auto max-w-6xl px-4">
      <SectionHeader title="What Our Users Say" />
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
    </div>
  </section>
);