import { Check } from "lucide-react";

type WhatIsItProps = {
  title: string;
  description: string;
  features: string[];
};

export const WhatIsIt = ({ title, description, features }: WhatIsItProps) => (
  <section className="w-full py-10 md:py-20 flex justify-center">
    <div className="flex flex-col items-center max-w-5xl w-full px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
        {title}
      </h2>
      <p className="text-lg text-[#B0B8C1] mb-8 max-w-xl text-center">
        {description}
      </p>
      <ul className="flex flex-col md:flex-row flex-wrap gap-4 pl-0 justify-center">
        {features.map((feature) => (
          <FeatureCheck key={feature} text={feature} />
        ))}
      </ul>
    </div>
  </section>
);
type FeatureCheckProps = { text: string };

const FeatureCheck = ({ text }: FeatureCheckProps) => (
  <li className="flex items-center gap-2">
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0f533d]">
      <Check
        className="w-4 h-4 text-[#1eff9b]"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </span>
    <span className="text-base text-[#B0B8C1]">{text}</span>
  </li>
);
