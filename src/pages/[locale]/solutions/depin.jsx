import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";
import Layout from "@/components/solutions/layout";
import HTMLHead from "@/components/HTMLHead";
import Image from "next/image";
import FooterCallout from "@/components/solutions/FooterCallout";
import DePINHero from "@/components/solutions/depin/DePinHero";
import WhyBuildSection from "@/components/solutions/depin/WhyBuildSection";
import YDeveloperResources, {
  YDeveloperResourcesLink,
} from "@/components/solutions/YDeveloperResources";
import styles from "./depin.module.scss";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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

const VideoLightbox = ({ videoId, onClose }) => {
  useEffect(() => {
    // Disable scrolling when lightbox is open
    document.body.style.overflow = "hidden";

    // Cleanup function to re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className={styles.lightboxOverlay}>
      <div className={styles.lightboxContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
        <div className={styles.videoContainer}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const DePINPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { t: _ } = useTranslation("common");
  const [activeVideo, setActiveVideo] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        "Given the scale of our vision, Solana is undoubtedly the best foundation for us to build on moving forward.",
      name: "Yuan",
      title: "Founder & CEO",
      companyLogo: gradientLogo,
      avatar: yuanImg,
    },
    {
      quote:
        "Our users are pushing almost 2 million on chain transactions daily. Not a lot of blockchains can handle that volume.",
      name: "Rohan",
      title: "CMO",
      companyLogo: roamLogo,
      avatar: rohanImg,
    },
    {
      quote:
        "Solana's high throughput and fast finality ensure that our globally distributed GPU compute resources can be orchestrated with minimal latency, which is critical for powering AI/ML workloads, zero-knowledge proof generation, and other compute-intensive operations.",
      name: "Jake",
      title: "Founder & CEO",
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

  const goToSlide = (index) => {
    setCurrentTestimonial(index);
  };

  const videoData = [
    {
      id: "IpWVxL4V4Oc",
      thumbnail: video1Img,
      title: "Render Network",
      description:
        "Discover how Render is revolutionizing cloud computing with their innovative DePIN solution on Solana.",
      alt: "Render video thumbnail",
    },
    {
      id: "PzNXP0w4xqU", // Replace with actual Render YouTube video ID
      thumbnail: video2Img,
      title: "Hivemapper",
      description:
        "Learn how Hivemapper is building a decentralized mapping network powered by dashcams and Solana's blockchain.",
      alt: "Render video thumbnail",
    },
    {
      id: "VaBJu3dXpKk", // Replace with actual Hivemapper YouTube video ID
      thumbnail: video3Img,
      title: "Helium Mobile",
      description:
        "Learn how Helium Mobile is building a decentralized mobile network powered by dashcams and Solana's blockchain.",
      alt: "Hivemapper video thumbnail",
    },
  ];

  const openLightbox = (videoId) => {
    setActiveVideo(videoId);
  };

  const closeLightbox = () => {
    setActiveVideo(null);
  };

  return (
    <Layout>
      <HTMLHead
        title="DePIN"
        description="Build Decentralized Physical Infrastructure Networks on Solana for affordable, censorship-resistant, and composable hardware resource orchestration."
      />

      <div id="depin-page">
        <DePINHero />
        <WhyBuildSection />

        {/* Two Column Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <div className={styles.featuresRow}>
              {/* Left Column - Mint at Scale */}
              <div className={styles.featureColumn}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src={mintImg}
                    alt="Mint at Scale visualization"
                    width={500}
                    height={300}
                    layout="responsive"
                  />
                </div>
                <h2 className={styles.featureTitle}>Mint at Scale</h2>
                <p className={styles.featureDescription}>
                  Use zk compression on Solana to create millions of digital
                  assets for hundreds of dollars.
                </p>
              </div>

              {/* Right Column - Ready-made tooling */}
              <div className={styles.featureColumn}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src={kycImg}
                    alt="Compliance tooling visualization"
                    width={500}
                    height={300}
                    layout="responsive"
                  />
                </div>
                <h2 className={styles.featureTitle}>
                  Ready-made tooling for scale and compliance
                </h2>
                <p className={styles.featureDescription}>
                  Token extensions on Solana can enable KYC checks, privacy,
                  audit trails, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real Builders Section */}
        <section className={styles.buildersSection}>
          <div className={styles.buildersContainer}>
            <h2 className={styles.buildersTitle}>
              Real Builders. Real Impact.
            </h2>
            <p className={styles.buildersSubtitle}>
              Meet the visionary teams building the future of global
              infrastructure on Solana, revolutionizing how we think about
              decentralized physical infrastructure.
            </p>

            <div className={styles.buttonContainer}>
              <a
                href="https://www.youtube.com/@SolanaFndn"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ghostButton}
              >
                More Stories
              </a>
            </div>

            <div className={styles.videoGrid}>
              {videoData.map((video, index) => (
                <div className={styles.videoCard} key={index}>
                  <div
                    className={styles.videoThumbnail}
                    onClick={() => openLightbox(video.id)}
                  >
                    <Image
                      src={video.thumbnail}
                      alt={video.alt}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className={styles.playButton}>
                      <Play fill="white" strokeWidth={0} />
                    </div>
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
                className={`${styles.testimonialSlide} ${currentTestimonial === index ? styles.active : ""}`}
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
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <div className={styles.sliderDots}>
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.sliderDot} ${currentTestimonial === index ? styles.active : ""}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                className={styles.nextButton}
                onClick={nextSlide}
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Developer Resources Section */}
        <YDeveloperResources
          id="depin-resources"
          title="Start Building on Solana Today"
          subtitle="Get everything you need to build DePIN applications on Solana with these essential resources."
          links={
            <>
              <YDeveloperResourcesLink
                title="DePIN Quickstart Guide"
                link="/developers/guides/depin/getting-started"
              />
              <YDeveloperResourcesLink
                title="Solana DePIN Examples"
                link="https://github.com/solana-developers/solana-depin-examples"
              />
            </>
          }
        />
        <FooterCallout
          title="Ready to build on Solana?"
          text="Check out funding, hackathon, and grant opportunities within the Solana ecosystem."
          btnText="Funding Opportunities"
          btnUrl="https://solana.org/grants-funding"
          btnLargeText="<strong>Still have questions?</strong> Reach out to Solana Foundation DePIN team"
          btnLargeUrl="https://solanafoundation.typeform.com/to/NFeIvWZi"
          className={styles.FooterCallout}
          topSectionClassName={styles.FooterCalloutTopSection}
          buttonLargeClassName={styles.FooterCalloutButtonLarge}
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
                <h3 className={styles.resourceColumnTitle}>DePIN in Action</h3>
                <div className={styles.resourceContent}>
                  <p className={styles.resourceText}>
                    Check out these videos of Solana DePIN founders telling
                    their stories about what they&apos;re building.
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
                      Watch Videos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {activeVideo && (
          <VideoLightbox videoId={activeVideo} onClose={closeLightbox} />
        )}
      </div>
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
