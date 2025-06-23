import Image from "next/image";
import worldMapDots from "assets/solutions/depin/world-map-dots.png";
import { Check, Play } from "lucide-react";

export const WhatIsDepin = () => (
  <section className="w-full py-10 md:py-20 flex justify-center">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 max-w-5xl w-full px-4 items-center">
      <div className="relative w-full h-[240px] max-h-[240px] rounded-2xl bg-[#181F2B] flex items-center justify-center overflow-hidden">
        <Image
          src={worldMapDots}
          alt="World map"
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 768px) 100vw, 488px"
          priority
        />
        <button
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2DFB89] rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
          aria-label="Play video"
        >
          <Play className="w-5 h-5 text-[#101722] opacity-70" fill="#101722" />
        </button>
      </div>

      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          What is DePIN?
        </h2>
        <p className="text-lg text-[#B0B8C1] mb-8 max-w-xl">
          Build real-world infrastructure faster by decentralizing it.
          <br />
          Reward contributors, grow your network, and tap into crypto capital.
        </p>
        <div className="flex flex-wrap gap-4">
          <FeatureCheck text="Fast & Cheap" />
          <FeatureCheck text="Decentralized" />
          <FeatureCheck text="Community First" />
        </div>
      </div>
    </div>
  </section>
);

const FeatureCheck = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2">
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0f533d]">
      <Check className="w-4 h-4 text-[#1eff9b]" strokeWidth={2.5} />
    </span>
    <span className="text-base text-[#B0B8C1]">{text}</span>
  </div>
);
