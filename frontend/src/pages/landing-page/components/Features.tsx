import { FeatureCard } from "./FeatureCard";
import { SectionHeader } from "./SectionHeader";
import { featuresTop, featuresBottom } from "./constants";

export const Features = () => (
  <section id="features" className="py-14 md:py-18">
    <div className="mx-auto max-w-6xl px-4">
      <SectionHeader title="Empower Your Trading Journey" />
      <div className="grid md:grid-cols-3 gap-6">
        {featuresTop.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {featuresBottom.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </div>
  </section>
);
