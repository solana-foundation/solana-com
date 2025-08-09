import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

export type NewsItemProps = {
  title: string;
  summary: string;
  image: string;
  link: string;
};

export const NewsItem = ({ title, summary, image, link }: NewsItemProps) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 [padding-block:1rem] sm:[padding-top:3rem]">
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group mb-3 focus:outline-none"
    >
      <div
        className="
      grid grid-cols-1 md:grid-cols-6 gap-6
      rounded-lg transition
      hover:shadow-lg focus:shadow-lg
      hover:scale-[1.01] focus:scale-[1.01]
      ring-0 group-focus-visible:ring-2 group-focus-visible:ring-[#6c47ff]
    "
        tabIndex={-1}
      >
        <div className="md:col-span-3 flex flex-col">
          <div className="w-full rounded-lg overflow-hidden flex-shrink-0 relative h-64">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="md:col-span-3 flex flex-col gap-6">
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-white mb-2 group-hover:underline group-focus:underline">
              {title}
            </h3>
            <p className="text-white/65 text-base">{summary}</p>
            <span
              className="inline-block mt-2 py-2 rounded bg-primary-600 text-white text-sm font-semibold pointer-events-none select-none"
              aria-hidden="true"
            >
              Read Article <ArrowRightIcon className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
    <hr className="mt-8 border-[#919191]" />
  </div>
);
