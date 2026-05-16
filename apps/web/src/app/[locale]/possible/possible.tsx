"use client";

import { useInView } from "react-intersection-observer";
import classNames from "classnames";
import styles from "@/components/possible/PossibleLayout.module.scss";
import PossibleHero from "@/components/possible/PossibleHero";
import PossibleVisionaries from "@/components/possible/PossibleVisionaries";
import PossibleCaseStudies from "@/components/possible/PossibleCaseStudies";
import PossibleInnovation from "@/components/possible/PossibleInnovations";
import dynamic from "next/dynamic";
import { VideoPlayerModal } from "@/component-library/video-modal";

const PossibleStartBuilding = dynamic(
  () => import("@/components/possible/PossibleStartBuilding"),
  { ssr: false },
);

const PossibleStats = dynamic(
  () => import("@/components/possible/PossibleStats"),
  { ssr: false },
);

const PossibleEcosystem = dynamic(
  () => import("@/components/possible/PossibleEcosystem"),
  { ssr: false },
);

const PossibleIcons = dynamic(
  () => import("@/components/possible/PossibleIcons"),
  { ssr: false },
);

export function PossiblePage() {
  const [statsRef, statsInView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const [ecosystemRef, ecosystemInView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <div
      className={classNames(
        styles["possible-layout"],
        "relative block overflow-hidden",
      )}
    >
      <PossibleHero />
      <div id="possible-visionaries">
        <PossibleVisionaries />
      </div>
      <PossibleCaseStudies />
      <PossibleInnovation />
      <div id="possible-startBuilding">
        <div ref={statsRef}>
          {statsInView ? (
            <>
              <PossibleStartBuilding />
              <PossibleStats visible={statsInView} showKPIs={false} />
            </>
          ) : (
            <div className="min-h-screen w-full" />
          )}
        </div>
      </div>
      <div ref={ecosystemRef}>
        {ecosystemInView ? (
          <>
            <PossibleEcosystem />
            <PossibleIcons />
          </>
        ) : (
          <div className="min-vh-100 w-100" />
        )}
      </div>
      <VideoPlayerModal />
    </div>
  );
}
