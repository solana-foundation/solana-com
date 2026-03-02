"use client";

import Image from "next/image";
import { getImagePath } from "@/config";

export function AuroraWave() {
  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "200px" }}
    >
      {/* Use existing wave-lines SVG which matches the Figma aurora component */}
      <div className="pointer-events-none absolute -left-[50px] bottom-0 h-[300px] w-[calc(100%+100px)]">
        <Image
          src={getImagePath("/images/wave-lines.svg")}
          alt=""
          fill
          className="object-cover"
        />
      </div>
      {/* Bottom gradient fade into next section */}
      <div
        className="absolute bottom-0 left-0 h-[132px] w-full"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 15.35%, black 73.26%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
