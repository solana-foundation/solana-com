import React from "react";
import Image from "next/image";

export function BackgroundShapes() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-50 overflow-hidden pointer-events-none">
      <Image
        src={"/hero.webp"}
        alt="Background decoration"
        width={1000}
        height={1000}
        className="absolute top-0 -left-[550px] hidden md:block opacity-50"
      />
      <Image
        src={"/hero.webp"}
        alt="Background decoration"
        width={1000}
        height={1000}
        className="absolute -top-44 -right-[550px] hidden md:block opacity-50"
      />
    </div>
  );
}
