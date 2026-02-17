"use client";

import { Products } from "@/components/solutions/products.v2";
import { Projects } from "@/components/solutions/projects.v2";
import { SolutionHero } from "@/components/solutions/hero.v2";
// import { VideoGrid } from "@/components/solutions/video-grid.v2";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { useTranslations } from "next-intl";
import {
  LOGOS,
  PRODUCTS,
  PROJECTS,
  /**, VIDEOS*/
} from "@/data/solutions/desci";
import { Divider } from "@/components/solutions/divider.v2";
// import { Decor } from "@/components/solutions/decor.v2";
import { SingleVideo } from "@/components/solutions/single-video.v2";
import { SelectionColor } from "@/component-library/selection-color";

export function SolutionsDesciPage() {
  const t = useTranslations();

  return (
    <>
      <SelectionColor selectionColor="#CFF15E" selectionTextColor="#000000" />

      <div id="desci-page" className="bg-black" aria-labelledby="hero-title">
        <SolutionHero
          title={t("desci.hero.title")}
          subtitle={t("desci.hero.subtitle")}
          bgJsonFilePath="/src/img/solutions/desci/hero-bg.json"
        />

        <SingleVideo
          className="relative -mt-[300px] md:-mt-[400px] xl:-mt-[400px]"
          thumbnail="/src/img/solutions/desci/videos/video0.webp"
          id="1930665368714093001"
          platform="x"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("desci.features.title", {
            light: (chunks) => (
              <span className="font-light">
                {chunks}
                <br />
              </span>
            ),
          })}
          description={t("desci.features.description")}
          highlightColor="#CFF15E"
          imageSrc="/src/img/solutions/desci/what-is.webp"
        />

        <Projects
          title={t.rich("desci.projects.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
            br: () => <br />,
          })}
          projects={PROJECTS}
          translationBase="desci.projects"
          logos={LOGOS}
          bgSrc="/src/img/solutions/desci/ecosystem-bg.webp"
        />

        <Divider />

        <Products
          className="z-1"
          title={t("desci.products.title")}
          description={t("desci.products.description")}
          products={PRODUCTS}
          translationBase="desci.products"
          highlightColor="#CFF15E"
        />

        {/* <Decor imageSrc="/src/img/solutions/desci/bg-1.webp" /> */}

        {/*<VideoGrid
          title={t("desci.videoPlayer.title")}
          subtitle={t("desci.videoPlayer.subtitle")}
          videos={VIDEOS(t)}
        /> */}
      </div>

      <VideoPlayerModal />
    </>
  );
}
