import React from "react";

export const Decor = () => {
  return (
    <div>
      <div className="pb-20 xl:pb-10"></div>
      <div className="relative pointer-events-none h-0 z-0">
        <div className="relative top-0 left-0 h-[900px] md:h-[800px] xl:h-[900px] -translate-y-1/2 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full blur-[2px]">
            <img
              className="absolute top-0 left-0 w-full h-1/2 object-cover"
              src="/src/img/index/decor-bg.webp"
              alt=""
              loading="lazy"
            />
            <img
              className="absolute bottom-0 left-0 w-full h-1/2 rotate-180 object-cover"
              src="/src/img/index/decor-bg.webp"
              alt=""
              loading="lazy"
            />
          </div>
          <div className="absolute top-[50%] left-[50%] w-0 h-0">
            <img
              className="object-cover max-w-none absolute bottom-0 right-[-180px] md:right-[-225px] xl:right-[-210px] w-[1158px] h-[145px] xl:h-[165px] mix-blend-plus-lighter"
              src="/src/img/index/decor-part-top.webp"
              alt=""
              width="1158"
              height="165"
              loading="lazy"
            />
            <img
              className="object-cover max-w-none absolute top-0 left-[-220px] w-[1195px] h-[143px] mix-blend-plus-lighter"
              src="/src/img/index/decor-part-bottom.webp"
              alt=""
              width="1195"
              height="143"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className="pb-10 xl:pb-0"></div>
    </div>
  );
};
