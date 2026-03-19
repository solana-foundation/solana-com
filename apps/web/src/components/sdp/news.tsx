"use client";

import Carousel, { CarouselControls } from "@/component-library/carousel";
import { useRef } from "react";

interface NewsType {
  title: string;
  img: string;
  href: string;
}

const news: NewsType[] = [
  {
    title: "The infrastructure behind  trillions in tokenized assets",
    img: "https://img.youtube.com/vi/6bxWGU7mpJI/maxresdefault.jpg",
    href: "/news",
  },
  {
    title: "Solana Stories: Behind the Mask ft. Proph3t",
    img: "https://img.youtube.com/vi/sB6cocqLXNw/maxresdefault.jpg",
    href: "/news",
  },
  {
    title: "DePIN on Solana: DePIN Science Fair Accelerate NYC 2025",
    img: "https://img.youtube.com/vi/9arQw72tFx4/maxresdefault.jpg",
    href: "/news",
  },
  {
    title: "The infrastructure behind  trillions in tokenized assets",
    img: "https://img.youtube.com/vi/6bxWGU7mpJI/maxresdefault.jpg",
    href: "/news",
  },
  {
    title: "Solana Stories: Behind the Mask ft. Proph3t",
    img: "https://img.youtube.com/vi/sB6cocqLXNw/maxresdefault.jpg",
    href: "/news",
  },
  {
    title: "DePIN on Solana: DePIN Science Fair Accelerate NYC 2025",
    img: "https://img.youtube.com/vi/9arQw72tFx4/maxresdefault.jpg",
    href: "/news",
  },
];

function splitIntoStacks<T>(array: T[], stackSize: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / stackSize) }, (_, i) =>
    array.slice(i * stackSize, (i + 1) * stackSize),
  );
}

interface NewsCardProps extends NewsType {}

const NewsCard = ({ title, img, href }: NewsCardProps) => {
  return (
    <a
      href={href}
      className="flex flex-row xl:flex-col items-center xl:items-start gap-4 xl:gap-0 px-5 py-4 xl:p-0 border-t border-white/[0.08] hover:!bg-[#161618] xl:border-t-0 xl:border-r last:border-r-0"
    >
      <div className="w-[71px] h-[40px] shrink-0 xl:w-full xl:h-auto xl:aspect-video overflow-hidden">
        <img src={img} alt="" className="w-full h-full object-cover" />
      </div>
      <p className="nd-body-l text-white flex-1 xl:flex-none xl:p-8 min-w-0">
        {title}
      </p>
    </a>
  );
};

export const News = (): React.ReactElement => {
  const carouselRef = useRef(null);
  const stackedItems = splitIntoStacks(news, 3);

  return (
    <section className="flex flex-col items-center w-full bg-[#0C0C0E]">
      <div className="w-full max-w-[1440px] xl:border-x xl:border-white/[0.08]">
        {/* Header */}
        <div className="px-5 md:px-8 xl:px-12 py-10 md:py-20 flex flex-row justify-between items-end gap-5">
          <h2 className="nd-heading-l-a text-white">News & updates</h2>

          <CarouselControls
            className="shrink-0 grow-0 border-dashed border-x border-y border-white/[0.08] p-2 rounded-full"
            carouselRef={carouselRef}
            prevButtonClassName={
              "!w-10 !h-10 border-transparent backdrop-blur-[6px] !bg-white/[0.08] hover:!bg-white/[0.12] [&>svg]:opacity-[0.64] disabled:pointer-events-none"
            }
            nextButtonClassName={
              "!w-10 !h-10 border-transparent backdrop-blur-[6px] !bg-white/[0.08] hover:!bg-white/[0.12] [&>svg]:opacity-[0.64] disabled:pointer-events-none"
            }
          />
        </div>

        {/* Content: video + playlist */}
        <div className="xl:border-t border-white/[0.08]">
          <Carousel
            ref={carouselRef}
            controlsInline={false}
            panels={1}
            enableSwipe={true}
            className="!m-0 [&>div]:!p-0"
          >
            {stackedItems.map((stack, i) => {
              return (
                <div
                  key={i}
                  className=" flex flex-col xl:flex-row items-stretch overflow-hidden"
                >
                  {stack.map((item, j) => (
                    <NewsCard key={j} {...item} />
                  ))}
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </section>
  );
};
