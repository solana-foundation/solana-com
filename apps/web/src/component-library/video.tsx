/**
 * Video Component
 *
 * @description
 * A video component that displays a thumbnail with a play button overlay.
 * When clicked, it embeds and plays YouTube or Vimeo videos inline.
 *
 * @usage
 * Use the <Video /> component to render a video player with thumbnail:
 *
 *    <Video
 *      platform="youtube"
 *      id="dQw4w9WgXcQ"
 *      title="Demo Video"
 *      thumbnail="/path/to/thumbnail.jpg"
 *      privacyMode={true}
 *      startTime={30} // Start at 30 seconds
 *    />
 *
 *    // Or for Vimeo:
 *    <Video
 *      platform="vimeo"
 *      id="123456789"
 *      title="Vimeo Example"
 *      aspectRatio="4:3"
 *      privacyMode={true}
 *      startTime={45} // Start at 45 seconds
 *    />
 *
 * @remarks
 * The component supports YouTube and Vimeo platforms. It shows a thumbnail with a play button
 * initially, then embeds the video when clicked. The `autoplay` prop is optional (defaults to true).
 * Enable `privacyMode` to use YouTube's privacy-enhanced embed (youtube-nocookie.com) and
 * Vimeo's Do Not Track parameter for better privacy compliance. Use `startTime` (in seconds) to
 * specify when the video should start playing.
 */

import { Play } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const ASPECT_RATIOS = {
  "16:9": "aspect-[16/9]",
  "4:3": "aspect-[4/3]",
} as const;

export interface VideoProps {
  platform: "youtube" | "vimeo";
  id: string;
  title?: string;
  vimeoHash?: string;
  autoplay?: boolean;
  aspectRatio?: "16:9" | "4:3";
  thumbnail?: string;
  alt?: string;
  bgColorClass?: string;
  playButtonClassName?: string;
  playButtonIconClassName?: string;
  privacyMode?: boolean;
  startTime?: number; // Start time in seconds
}

export function Video(props: VideoProps) {
  const {
    platform,
    id,
    autoplay = true,
    aspectRatio = "16:9",
    vimeoHash,
    title,
    thumbnail,
    alt,
    bgColorClass,
    playButtonClassName,
    playButtonIconClassName,
    privacyMode = false,
    startTime,
  } = props;

  const [show, setShow] = useState((autoplay || !thumbnail) ?? false);

  const getEmbedUrl = (): string => {
    if (platform === "youtube") {
      const baseUrl = privacyMode
        ? `https://www.youtube-nocookie.com/embed/${id}`
        : `https://www.youtube.com/embed/${id}`;
      const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        autoplay: autoplay ? "1" : "0",
        ...(startTime && { start: startTime.toString() }),
      });
      return `${baseUrl}?${params.toString()}`;
    }
    // Vimeo
    const baseUrl = `https://player.vimeo.com/video/${id}`;
    const params = new URLSearchParams({
      ...(vimeoHash && { h: vimeoHash }),
      title: "0",
      byline: "0",
      portrait: "0",
      autoplay: autoplay ? "1" : "0",
      ...(privacyMode && { dnt: "1" }), // Add Do Not Track parameter for privacy
    });
    return `${baseUrl}?${params.toString()}${startTime ? `#${startTime.toString()}` : ""}`;
  };

  if (!show) {
    return (
      <div
        className={`relative w-full ${ASPECT_RATIOS[aspectRatio]} cursor-pointer group overflow-hidden rounded-xl`}
      >
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={alt}
            fill
            className="object-cover z-0"
            loading="lazy"
          />
        )}
        <button
          type="button"
          onClick={() => setShow(true)}
          aria-label={title}
          tabIndex={0}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 ${bgColorClass} ${playButtonClassName ?? ""} rounded-full flex items-center justify-center transition group-hover:scale-110 z-10`}
        >
          <Play
            fill="white"
            strokeWidth={0}
            className={`w-8 h-8 ${playButtonIconClassName ?? ""}`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${ASPECT_RATIOS[aspectRatio]}`}>
      <iframe
        key={`${platform}-${id}`}
        src={getEmbedUrl()}
        title={title || "Video player"}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
