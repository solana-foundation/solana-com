"use client";

import Image from "next/image";
import {
  getSafeUnicornDpi,
  SafeUnicornScene,
} from "@/components/shared/SafeUnicornScene";

export function HubHeroBackground({
  heroImageSrc,
  bgJsonFilePath,
}: {
  heroImageSrc?: string;
  bgJsonFilePath?: string;
}) {
  return (
    <>
      {bgJsonFilePath ? (
        <SafeUnicornScene
          projectId={`hub-${bgJsonFilePath}`}
          className="!absolute inset-0 z-0"
          jsonFilePath={bgJsonFilePath}
          width="100%"
          height="101%"
          scale={1}
          dpi={getSafeUnicornDpi()}
          fps={30}
          lazyLoad
          production
          onError={(error) => console.error("UnicornScene error:", error)}
          placeholder={
            heroImageSrc ? (
              <Image
                className="!absolute inset-0 z-0"
                src={heroImageSrc}
                alt=""
                fill
                priority
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
            ) : undefined
          }
          fallback={
            heroImageSrc ? (
              <Image
                className="!absolute inset-0 z-0"
                src={heroImageSrc}
                alt=""
                fill
                priority
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
            ) : null
          }
          showPlaceholderOnError
          showPlaceholderWhileLoading
        />
      ) : (
        heroImageSrc && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src={heroImageSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover scale-[1.05]"
            />
          </div>
        )
      )}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(70% 70% at 78% 22%, color-mix(in srgb, var(--hub-accent) 55%, transparent) 0%, transparent 60%), radial-gradient(90% 100% at 0% 100%, color-mix(in srgb, var(--hub-accent) 22%, transparent) 0%, transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.42) 35%, #000 92%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 80%, #000 100%)",
        }}
      />
    </>
  );
}
