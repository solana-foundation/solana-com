import DePINHero from "@/components/solutions/depin/DePinHero";
import HTMLHead from "@/components/HTMLHead";
import Image from "next/image";
import { WhatIsDepin } from "@/components/solutions/depin/WhatIsDepin";
import { EcoProjects } from "@/components/solutions/depin/EcoProjects";
import Layout from "@/components/solutions/layout";
import YDeveloperResources, {
  YDeveloperResourcesLink,
} from "@/components/solutions/YDeveloperResources";
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

      <div id="depin-page" className="bg-depin-bg">
        <DePINHero />
        <WhatIsDepin />

        {/* EcoProjects Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-start">
              <h2 className="text-3xl font-bold text-white col-span-full">
                {t("depin.features.title")}
              </h2>
              <EcoProjects />
            </div>
          </div>
        </section>

        {/* Two Column Features Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Left Column - Mint at Scale */}
              <div className="flex flex-col">
                <div className="mb-8 rounded-2xl overflow-hidden bg-[#12101e] p-8 h-72 flex items-center justify-center">
                  <Image
                    src={mintImg}
                    alt={t("depin.features.mint.alt")}
                    width={500}
                    height={300}
                    className="object-contain max-h-60 w-full"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                  {t("depin.features.mint.title")}
                </h2>
                <p className="text-base md:text-lg text-gray-300">
                  {t("depin.features.mint.description")}
                </p>
              </div>
              {/* Right Column - Ready-made tooling */}
              <div className="flex flex-col">
                <div className="mb-8 rounded-2xl overflow-hidden bg-[#12101e] p-8 h-72 flex items-center justify-center">
                  <Image
                    src={kycImg}
                    alt={t("depin.features.tooling.alt")}
                    width={500}
                    height={300}
                    className="object-contain max-h-60 w-full"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                  {t("depin.features.tooling.title")}
                </h2>
                <p className="text-base md:text-lg text-gray-300">
                  {t("depin.features.tooling.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real Builders Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
              {t("depin.builders.title")}
            </h2>
            <p className="text-base md:text-lg text-gray-300 text-center max-w-2xl mx-auto mb-12">
              {t("depin.builders.subtitle")}
            </p>
            <div className="flex justify-center mb-12">
              <a
                href="https://www.youtube.com/@SolanaFndn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/30 rounded-full text-white font-medium hover:bg-white/10 transition"
              >
                {t("depin.builders.moreStories")}
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoData.map((video, index) => (
                <div className="flex flex-col" key={index}>
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
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-600/90 rounded-full flex items-center justify-center transition group-hover:scale-110"
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
          </div>
        </section>

        {/* Testimonial Slider Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="relative overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`flex flex-col-reverse md:flex-row items-center transition-all duration-700 absolute w-full top-0 left-0 ${currentTestimonial === index ? "opacity-100 relative" : "opacity-0 pointer-events-none"}`}
                  style={{
                    transform: `translateX(${100 * (index - currentTestimonial)}%)`,
                  }}
                >
                  <div className="flex-1 pt-6 md:pt-0 md:pr-12">
                    <blockquote>
                      <p className="text-lg md:text-2xl text-white font-light mb-6">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                    </blockquote>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-8">
                      <div>
                        <div className="text-purple-400 font-semibold text-base md:text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-300 text-sm md:text-base">
                          {testimonial.title}
                        </div>
                      </div>
                      <div className="flex items-center max-w-xs h-10">
                        <Image
                          src={testimonial.companyLogo}
                          alt="Company logo"
                          width={120}
                          height={24}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="max-w-xs w-full h-72 flex-shrink-0 mx-auto md:mx-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={280}
                      height={280}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              ))}
              {/* Slider Controls */}
              <div className="flex items-center justify-center mt-10">
                <button
                  className="w-10 h-10 flex items-center justify-center text-white hover:text-purple-400 transition"
                  onClick={prevSlide}
                  aria-label={t("depin.testimonials.prevAria")}
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-2 mx-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full border-none transition ${currentTestimonial === index ? "bg-white" : "bg-white/30"}`}
                      onClick={() => goToSlide(index)}
                      aria-label={t("depin.testimonials.gotoAria", {
                        num: index + 1,
                      })}
                    />
                  ))}
                </div>
                <button
                  className="w-10 h-10 flex items-center justify-center text-white hover:text-purple-400 transition"
                  onClick={nextSlide}
                  aria-label={t("depin.testimonials.nextAria")}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
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
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="flex flex-col items-center text-center max-w-xl">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-6">
                {t("depin.resources.actionTitle")}
              </h3>
              <p className="text-base md:text-lg text-gray-300 mb-6">
                {t("depin.resources.actionText")}
              </p>
              <div className="mt-6">
                <a
                  href="https://www.youtube.com/playlist?list=PLilwLeBwGuK5OT4zLm3-YOGnT0x5cmRsK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/30 rounded-full text-white font-medium hover:bg-white/10 transition"
                >
                  {t("depin.resources.watchVideos")}
                </a>
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
