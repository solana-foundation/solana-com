import Image from "next/image";
import { Play, ArrowRight } from "lucide-react";
import { VideoTrigger } from "@/component-library/video-modal";

export type VideoItem = {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  alt: string;
};

export type VideoGridProps = {
  title: string;
  subtitle: string;
  videos: VideoItem[];
  moreVideosUrl?: string;
  moreVideosLabel?: string;
};

export const VideoGrid = ({
  title,
  subtitle,
  videos,
  moreVideosUrl,
  moreVideosLabel,
}: VideoGridProps) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
      {title}
    </h2>
    <p className="text-base md:text-lg text-gray-300 text-center max-w-2xl mx-auto mb-8">
      {subtitle}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
      {videos.map((video) => (
        <div className="flex flex-col" key={video.id}>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group">
            <Image
              src={video.thumbnail}
              alt={video.alt}
              fill
              className="object-cover"
            />
            <VideoTrigger
              platform="youtube"
              id={video.id}
              title={video.title}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-600/90 rounded-full flex items-center justify-center transition group-hover:scale-110 z-10"
            >
              <Play fill="white" strokeWidth={0} />
            </VideoTrigger>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-white mt-4 mb-2">
            {video.title}
          </h3>
          <p className="text-sm md:text-base text-gray-300">
            {video.description}
          </p>
        </div>
      ))}
    </div>
    {moreVideosUrl && moreVideosLabel && (
      <div className="flex justify-center mb-6">
        <a
          href={moreVideosUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 border border-white/30 rounded-xl text-white font-medium hover:bg-white/10 transition"
        >
          {moreVideosLabel}
          <ArrowRight className="ml-2 w-5 h-5" />
        </a>
      </div>
    )}
  </div>
);
