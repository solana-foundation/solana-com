import DePINHero from "@/components/solutions/depin/DePinHero";
import HTMLHead from "@/components/HTMLHead";
import Image from "next/image";
import WhatIsDepin from "@/components/solutions/depin/WhatIsDepin";
import Layout from "@/components/solutions/layout";
import YDeveloperResources, {
  YDeveloperResourcesLink,
} from "@/components/solutions/YDeveloperResources";
import styles from "./depin.module.scss";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import {
  VideoPlayerModal,
  VideoTrigger,
} from "@/component-library/video-modal";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { withLocales } from "@/i18n/routing";

// Import video thumbnails
import video1Img from "assets/solutions/depin/video1.png";
import video2Img from "assets/solutions/depin/video2.png";
import video3Img from "assets/solutions/depin/video3.png";
import yuanImg from "assets/solutions/depin/yuan.png";
import gradientLogo from "assets/solutions/depin/gradient-yuan.svg";
import rohanImg from "assets/solutions/depin/rohan.png";
import roamLogo from "assets/solutions/depin/roam.svg";
import ioLogo from "assets/solutions/depin/io.svg";
import jakeImg from "assets/solutions/depin/jake.png";
import mintImg from "assets/solutions/depin/mint.png";
import kycImg from "assets/solutions/depin/kyc.png";

const DePINPage = () => {
  const { t } = useTranslation("common");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: t("depin.testimonials.0.quote"),
      name: "Yuan",
      title: t("depin.testimonials.0.title"),
      companyLogo: gradientLogo,
      avatar: yuanImg,
    },
    {
      quote: t("depin.testimonials.1.quote"),
      name: "Rohan",
      title: t("depin.testimonials.1.title"),
      companyLogo: roamLogo,
      avatar: rohanImg,
    },
    {
      quote: t("depin.testimonials.2.quote"),
      name: "Jake",
      title: t("depin.testimonials.2.title"),
      companyLogo: ioLogo,
      avatar: jakeImg,
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentTestimonial(index);
  };

  const videoData = [
    {
      id: "IpWVxL4V4Oc",
      thumbnail: video1Img,
      title: t("depin.videos.0.title"),
      description: t("depin.videos.0.description"),
      alt: t("depin.videos.0.alt"),
    },
    {
      id: "PzNXP0w4xqU",
      thumbnail: video2Img,
      title: t("depin.videos.1.title"),
      description: t("depin.videos.1.description"),
      alt: t("depin.videos.1.alt"),
    },
    {
      id: "VaBJu3dXpKk",
      thumbnail: video3Img,
      title: t("depin.videos.2.title"),
      description: t("depin.videos.2.description"),
      alt: t("depin.videos.2.alt"),
    },
  ];

  return (
    <Layout>
      <HTMLHead
        title={t("depin.head.title")}
        description={t("depin.head.description")}
      />

      <div id="depin-page">
        <DePINHero />
        <WhatIsDepin />

        {/* Two Column Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <div className={styles.featuresRow}>
              {/* Left Column - Mint at Scale */}
              <div className={styles.featureColumn}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src={mintImg}
                    alt={t("depin.features.mint.alt")}
                    width={500}
                    height={300}
                    layout="responsive"
                    loading="lazy"
                  />
                </div>
                <h2 className={styles.featureTitle}>
                  {t("depin.features.mint.title")}
                </h2>
                <p className={styles.featureDescription}>
                  {t("depin.features.mint.description")}
                </p>
              </div>

              {/* Right Column - Ready-made tooling */}
              <div className={styles.featureColumn}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src={kycImg}
                    alt={t("depin.features.tooling.alt")}
                    width={500}
                    height={300}
                    layout="responsive"
                  />
                </div>
                <h2 className={styles.featureTitle}>
                  {t("depin.features.tooling.title")}
                </h2>
                <p className={styles.featureDescription}>
                  {t("depin.features.tooling.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real Builders Section */}
        <section className={styles.buildersSection}>
          <div className={styles.buildersContainer}>
            <h2 className={styles.buildersTitle}>
              {t("depin.builders.title")}
            </h2>
            <p className={styles.buildersSubtitle}>
              {t("depin.builders.subtitle")}
            </p>

            <div className={styles.buttonContainer}>
              <a
                href="https://www.youtube.com/@SolanaFndn"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ghostButton}
              >
                {t("depin.builders.moreStories")}
              </a>
            </div>

            <div className={styles.videoGrid}>
              {videoData.map((video, index) => (
                <div className={styles.videoCard} key={index}>
                  <div className={styles.videoThumbnail}>
                    <Image
                      src={video.thumbnail}
                      alt={video.alt}
                      layout="fill"
                      objectFit="cover"
                    />
                    <VideoTrigger
                      platform="youtube"
                      id={video.id}
                      title={video.title}
                      className={styles.playButton}
                    >
                      <Play fill="white" strokeWidth={0} />
                    </VideoTrigger>
                  </div>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Slider Section */}
        <section className={styles.testimonialSection}>
          <div className={styles.testimonialSlider}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`${styles.testimonialSlide} ${
                  currentTestimonial === index ? styles.active : ""
                }`}
                style={{
                  transform: `translateX(${100 * (index - currentTestimonial)}%)`,
                }}
              >
                <div className={styles.testimonialContent}>
                  <blockquote>
                    <p>&ldquo;{testimonial.quote}&rdquo;</p>
                  </blockquote>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorName}>
                        {testimonial.name}
                      </div>
                      <div className={styles.authorTitle}>
                        {testimonial.title}
                      </div>
                    </div>
                    <div className={styles.companyLogo}>
                      <Image
                        src={testimonial.companyLogo}
                        alt="Gradient logo"
                        width={120}
                        height={24}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.testimonialImage}>
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={280}
                    height={280}
                  />
                </div>
              </div>
            ))}

            <div className={styles.sliderControls}>
              <button
                className={styles.prevButton}
                onClick={prevSlide}
                aria-label={t("depin.testimonials.prevAria")}
              >
                <ChevronLeft size={24} />
              </button>
              <div className={styles.sliderDots}>
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.sliderDot} ${
                      currentTestimonial === index ? styles.active : ""
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={t("depin.testimonials.gotoAria", {
                      num: index + 1,
                    })}
                  />
                ))}
              </div>
              <button
                className={styles.nextButton}
                onClick={nextSlide}
                aria-label={t("depin.testimonials.nextAria")}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Developer Resources Section */}
        <YDeveloperResources
          id="depin-resources"
          title={t("depin.resources.title")}
          subtitle={t("depin.resources.subtitle")}
          links={
            <>
              <YDeveloperResourcesLink
                title={t("depin.resources.quickstart")}
                link="/developers/guides/depin/getting-started"
              />
              <YDeveloperResourcesLink
                title={t("depin.resources.examples")}
                link="https://github.com/solana-developers/solana-depin-examples"
              />
            </>
          }
        />
        {/* DePIN Resources Grid Section */}
        <section
          className={styles.resourcesGridSection}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            className={styles.resourcesContainer}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div
              className={styles.resourcesColumns}
              style={{
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                className={styles.resourceColumn}
                style={{ textAlign: "center", maxWidth: "600px" }}
              >
                <h3 className={styles.resourceColumnTitle}>
                  {t("depin.resources.actionTitle")}
                </h3>
                <div className={styles.resourceContent}>
                  <p className={styles.resourceText}>
                    {t("depin.resources.actionText")}
                  </p>
                  <div
                    className={styles.buttonContainer}
                    style={{ marginTop: "24px" }}
                  >
                    <a
                      href="https://www.youtube.com/playlist?list=PLilwLeBwGuK5OT4zLm3-YOGnT0x5cmRsK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.ghostButton}
                    >
                      {t("depin.resources.watchVideos")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <VideoPlayerModal />
    </Layout>
  );
};

export default DePINPage;

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
