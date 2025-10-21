import React from "react";
import Image from "next/image";

export type DecorProps = {
  imageSrc?: string;
};

export const Decor = ({ imageSrc }: DecorProps) => {
  return (
    <div className="relative pointer-events-none h-0 xl:my-[40px]">
      {imageSrc && (
        <div className="relative top-0 left-0 h-[300px] xl:h-[600px] -translate-y-1/2  min-h-[300px] overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full bg-[length:100%_100%] bg-center"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />
          <div className="absolute top-[50%] left-0 w-full h-0">
            <Image
              className="object-cover max-w-none absolute bottom-[-100px] left-[-450px] md:left-[-200px] xl:bottom-[-200px] xl:left-[-1000px] w-[706px] h-[142px] xl:w-[1411px] xl:h-[283px] mix-blend-overlay"
              src={"/src/img/solutions/decoration-left-part.svg"}
              alt=""
              width="1411"
              height="283"
              loading="lazy"
            />
            <Image
              className="object-cover max-w-none absolute bottom-[-40px] left-[-470px] md:left-[-220px] xl:bottom-[-80px] xl:left-[-1020px] w-[706px] h-[142px] xl:w-[1411px] xl:h-[283px] mix-blend-overlay"
              src={"/src/img/solutions/decoration-left-part.svg"}
              alt=""
              width="1411"
              height="283"
              loading="lazy"
            />
            <Image
              className="object-cover max-w-none absolute top-[20px] md:top-[-20px] right-[-260px] xl:top-[0] xl:right-[-100px] w-[472px] h-[142px] xl:w-[944px] xl:h-[283px] mix-blend-overlay"
              src={"/src/img/solutions/decoration-right-part.svg"}
              alt=""
              width="944"
              height="283"
              loading="lazy"
            />
            <Image
              className="object-cover max-w-none absolute top-[80px] md:top-[40px] right-[-300px] xl:top-[100px] xl:right-[-100px] w-[472px] h-[142px] xl:w-[944px] xl:h-[283px] mix-blend-overlay"
              src={"/src/img/solutions/decoration-right-part.svg"}
              alt=""
              width="944"
              height="283"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
};
