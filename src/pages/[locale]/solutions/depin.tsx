import DePINHero from "@/components/solutions/depin/DePinHero";
import HTMLHead from "@/components/HTMLHead";
import Image from "next/image";
import { WhatIsDepin } from "@/components/solutions/depin/WhatIsDepin";
import { EcoProjects } from "@/components/solutions/depin/EcoProjects";
import { Products } from "@/components/solutions/depin/Products";
import { Builders } from "@/components/solutions/depin/Builders";
import Layout from "@/components/solutions/layout";
import YDeveloperResources, {
  YDeveloperResourcesLink,
} from "@/components/solutions/YDeveloperResources";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { withLocales } from "@/i18n/routing";

// Import video thumbnails
import yuanImg from "assets/solutions/depin/yuan.png";
import gradientLogo from "assets/solutions/depin/gradient-yuan.svg";
import rohanImg from "assets/solutions/depin/rohan.png";
import roamLogo from "assets/solutions/depin/roam.svg";
import ioLogo from "assets/solutions/depin/io.svg";
import jakeImg from "assets/solutions/depin/jake.png";

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

        {/* Products Section */}
        <section className="pb-10">
          <Products />
        </section>

        {/* Real Builders Section */}
        <section className="py-10 bg-[#171c25]">
          <Builders />
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
