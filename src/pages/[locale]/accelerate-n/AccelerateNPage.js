import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./accelerate-n.module.scss";

// Import images
import MapSVG from "../../../../assets/accelerate/map.svg";
import LibertyImage from "../../../../assets/accelerate/liberty.png";
import CapitolImage from "../../../../assets/accelerate/capitol.png";
import FacesImage from "../../../../assets/accelerate/faces.png";
import PeopleImage from "../../../../assets/accelerate/people.png";
// import CompaniesImage from "../../../../assets/accelerate/companies.png";
import GovtImage from "../../../../assets/accelerate/govt.png";
import ThumbnailImage from "../../../../assets/accelerate/thumbnail.png";
import LibertyDotImage from "../../../../assets/accelerate/liberty-dot.png";
import FreeTicketImage from "../../../../assets/accelerate/free.png";

// Import speaker images
import EmmettImage from "../../../../assets/accelerate/speakers/emmett.png";
import LucaImage from "../../../../assets/accelerate/speakers/luca.png";
import AustinImage from "../../../../assets/accelerate/speakers/austin.png";
import SummerImage from "../../../../assets/accelerate/speakers/summer.png";
import TaylorImage from "../../../../assets/accelerate/speakers/taylor.png";
import ArielImage from "../../../../assets/accelerate/speakers/ariel.png";
import RobertImage from "../../../../assets/accelerate/speakers/robert.png";
import ArmaniImage from "../../../../assets/accelerate/speakers/armani.png";
import BrandonImage from "../../../../assets/accelerate/speakers/brandon.png";
import SantiagoImage from "../../../../assets/accelerate/speakers/santiago.png";
import KashImage from "../../../../assets/accelerate/speakers/kash.png";
import DavidImage from "../../../../assets/accelerate/speakers/david.png";

// Import sponsor logos
import CubeSVG from "../../../../assets/accelerate/sponsors/cube.svg";
import HelioSVG from "../../../../assets/accelerate/sponsors/helio.svg";
import JitoSVG from "../../../../assets/accelerate/sponsors/Jito.svg";
import MagnaSVG from "../../../../assets/accelerate/sponsors/magna.svg";
import PhantomSVG from "../../../../assets/accelerate/sponsors/phantom.svg";
import RockawaySVG from "../../../../assets/accelerate/sponsors/rockaway.svg";
import SolanaMobileSVG from "../../../../assets/accelerate/sponsors/solanamobile.svg";
import SolflareSVG from "../../../../assets/accelerate/sponsors/solflare.svg";
import WormholeSVG from "../../../../assets/accelerate/sponsors/wormhole.svg";
import ZeusSVG from "../../../../assets/accelerate/sponsors/zeus.svg";

// Counter animation hook
const useCounterAnimation = (end, duration = 2000, startDelay = 0) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    // Check if on mobile
    const isMobile = window.innerWidth < 768;

    // If on mobile, just set to the end value without animation
    if (isMobile) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          setTimeout(() => {
            let startTime;
            const animateCount = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const currentCount = Math.floor(progress * end);
              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(animateCount);
              } else {
                setCount(end);
              }
            };
            requestAnimationFrame(animateCount);
          }, startDelay);
        }
      },
      { threshold: 0.1 },
    );

    // Store ref.current in a variable for cleanup
    const currentRef = countRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [end, duration, startDelay, hasStarted]);

  return [count, countRef];
};

const FAQs = [
  {
    question: "Which ticket do I need?",
    answer:
      "Tickets are purchases by event, and you should get the ticket that best first your eligibility. " +
      "Ship or Die is open to everyone. " +
      "Scale or Die is exclusively for developers and by application only. " +
      "For other events, it's a case by case basis — check the listing for more details.",
  },
  {
    question: "Are travel and accommodation part of my ticket?",
    answer:
      'Attendees are responsible for making their own travel and accommodation — but there are plenty of hotels in New York! The Solana Foundation <a href="https://solanafoundation.notion.site/Accelerate-Travel-1c1d36dad52d801ea92ad3e495c1a36a" target="_blank" rel="noopener noreferrer">has worked with</a> multiple hotels in New York to offer discounted rates on hotels during Ship or Die.',
  },
  {
    question: "I can no longer attend. Can I get a refund?",
    answer:
      'We&apos;re sorry to hear that! Tickets are non-refundable, but are transferable. Please email <a href="mailto:accelerate@solana.org" className={styles.emailLink}>accelerate@solana.org</a> to transfer your ticket. For more information on how to book, check out the travel section.',
  },
  {
    question: "How do I get to the venues?",
    answer:
      "There's plenty of ways to get around New York! We suggest using the subway, taxis, Citibike, or rideshare apps. Please note that there is no parking onsite at any venue.",
  },
  {
    question: "Additional Questions/Enquires?",
    answer:
      'Please email <a href="mailto:accelerate@solana.org" className={styles.emailLink}>accelerate@solana.org</a> | <a href="mailto:press@solana.org" className={styles.emailLink}>press@solana.org</a>',
  },
];

export default function AccelerateNPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showVideoLightbox, setShowVideoLightbox] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [showFreeTicketModal, setShowFreeTicketModal] = useState(false);

  // Counter animations
  const [peopleCount, peopleCountRef] = useCounterAnimation(3000, 2000, 0);
  const [companiesCount, companiesCountRef] = useCounterAnimation(
    1.5,
    2000,
    200,
  );
  const [policyCount, policyCountRef] = useCounterAnimation(50, 2000, 400);
  const [touristsCount, touristsCountRef] = useCounterAnimation(250, 1000, 600);

  // Handle video lightbox
  const openVideoLightbox = () => {
    setShowVideoLightbox(true);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden";
  };

  const closeVideoLightbox = () => {
    setShowVideoLightbox(false);
    // Re-enable scrolling
    document.body.style.overflow = "";
  };

  // Close lightbox and free ticket modal on ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (showVideoLightbox) {
          closeVideoLightbox();
        }
        if (showFreeTicketModal) {
          closeFreeTicketModal();
        }
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [showVideoLightbox, showFreeTicketModal]);

  // Show free ticket modal after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFreeTicketModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Close free ticket modal
  const closeFreeTicketModal = () => {
    setShowFreeTicketModal(false);
  };

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // For sticky bottom bar (mobile only) - show as soon as user scrolls
      const isScrolled = scrollPosition > 10; // Just need minimal scroll to trigger

      if (isScrolled !== stickyVisible) {
        setStickyVisible(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check in case page loads with scroll
    handleScroll();

    // Add a class to the body to hide global header
    document.body.classList.add("accelerate-n-page");

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("accelerate-n-page");
    };
  }, [stickyVisible]);

  // These could be moved to translation files in a real implementation
  const heroTitle = "Tech, Finance and Policy meet crypto";
  const heroDescription =
    "Accelerate is a high-conviction summit for people building the next chapter of America. From AI to crypto, defense to finance—if you&apos;re not in the room, you&apos;re already behind.";

  // Define logo paths directly
  const accLogoPath = "/assets/accelerate/acc-logo.svg";

  // YouTube video ID
  const youtubeVideoId = "_pF34DUWYSY";

  return (
    <>
      <Head>
        <title>Accelerate - {heroTitle}</title>
        <meta name="description" content={heroDescription} />
        <style>
          {`
            /* Hide global header via direct CSS */
            header.global-header, 
            header.position-sticky, 
            header[class*="Header_header"] {
              display: none !important;
            }

            /* ABC Diatype font-face declaration */
            @font-face {
              font-family: 'ABC Diatype';
              src: url('/fonts/ABCDiatype-Regular.woff2') format('woff2'),
                   url('/fonts/ABCDiatype-Regular.woff') format('woff');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
            
            @font-face {
              font-family: 'ABC Diatype';
              src: url('/fonts/ABCDiatype-Medium.woff2') format('woff2'),
                   url('/fonts/ABCDiatype-Medium.woff') format('woff');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
          `}
        </style>
      </Head>

      <div className={styles.container}>
        {/* Custom header for this page */}
        <header
          className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
        >
          <div className={styles.logo}>
            <img
              src={accLogoPath}
              alt="Accelerate Logo"
              className={styles.logoImg}
            />
          </div>
          <nav className={styles.nav}>
            <Link href="#sponsors">SPONSORS</Link>
            <Link href="#speakers">SPEAKERS</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="/accelerate-n/tickets" className={styles.ticketsButton}>
              GET TICKETS
            </Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <div className={styles.mapBackground}>
            <div className={styles.mapSvgWrapper}>
              <Image
                src={MapSVG}
                alt="US Map"
                fill
                style={{ objectFit: "cover" }}
                className={styles.mapSvg}
                priority
              />
            </div>
          </div>

          <div className={styles.libertyImage}>
            <Image
              src={LibertyImage}
              alt="Statue of Liberty"
              width={400}
              height={600}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>

          <div className={styles.capitolImage}>
            <Image
              src={CapitolImage}
              alt="Capitol Building"
              width={400}
              height={600}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroLogo}>
              <img
                src={accLogoPath}
                alt="Accelerate Logo"
                className={styles.heroLogoImg}
              />
            </div>

            <h1>Tech, Finance and Policy meet crypto</h1>
            <p className={styles.heroDescription}>
              Accelerate is a conference for builders shaping crypto&apos;s next
              chapter in America. Crypto is transforming tech, policy, and
              finance—join us!
            </p>
            <Link
              href="/accelerate-n/tickets"
              className={styles.getTicketsButton}
            >
              Get Tickets →
            </Link>

            <div className={styles.eventInfo}>
              <div className={styles.infoItem}>
                <h3>WHEN</h3>
                <p>May 19-23</p>
              </div>
              <div className={styles.infoItem}>
                <h3>WHERE</h3>
                <p>NYC</p>
              </div>
              <div className={styles.infoItem}>
                <h3>ATTENDEES</h3>
                <div className={styles.joinInfo}>
                  <p>3,000+</p>
                  <div className={styles.facesImageContainer}>
                    <Image
                      src={FacesImage}
                      alt="Attendee faces"
                      className={styles.facesImage}
                      width={80}
                      height={25}
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who&apos;s attending section */}
        <section className={styles.attendingSection}>
          <div className={styles.attendingContent}>
            <h2 className={styles.attendingTitle}>
              <span className={styles.slashes}>{"//"}</span>
              {" Who's attending?"}
            </h2>

            <div className={styles.attendingCards}>
              <div
                className={styles.attendingCard}
                style={{ padding: "2rem", backgroundColor: "#1F2941" }}
              >
                <h3
                  className={styles.cardNumber}
                  ref={peopleCountRef}
                  style={{ textAlign: "left" }}
                >
                  {peopleCount}+
                </h3>
                <p
                  className={styles.cardDescription}
                  style={{ textAlign: "left" }}
                >
                  Executives from Fintech, AI and startups
                </p>
                <img
                  src={PeopleImage.src}
                  alt="People attending"
                  width="100"
                  height="32"
                  style={{
                    maxHeight: "32px",
                    display: "block",
                    padding: 0,
                    margin: 0,
                    objectFit: "contain",
                    objectPosition: "left center",
                  }}
                />
              </div>

              <div
                className={styles.attendingCard}
                style={{ padding: "2rem", backgroundColor: "#1F2941" }}
              >
                <h3
                  className={styles.cardNumber}
                  ref={companiesCountRef}
                  style={{ textAlign: "left" }}
                >
                  ${companiesCount}T
                </h3>
                <p
                  className={styles.cardDescription}
                  style={{ textAlign: "left" }}
                >
                  Combined value of public and private companies
                </p>
                {/* <img
                  src={CompaniesImage.src}
                  alt="Companies attending"
                  width="100"
                  height="32"
                  style={{
                    maxHeight: "32px",
                    display: "block",
                    padding: 0,
                    margin: 0,
                    objectFit: "contain",
                    objectPosition: "left center",
                  }}
                /> */}
              </div>

              <div
                className={styles.attendingCard}
                style={{ padding: "2rem", backgroundColor: "#1F2941" }}
              >
                <h3
                  className={styles.cardNumber}
                  ref={policyCountRef}
                  style={{ textAlign: "left" }}
                >
                  {policyCount}+
                </h3>
                <p
                  className={styles.cardDescription}
                  style={{ textAlign: "left" }}
                >
                  Policy makers from Capitol Hill
                </p>
                <img
                  src={GovtImage.src}
                  alt="Government representatives"
                  width="48"
                  height="32"
                  style={{
                    maxHeight: "32px",
                    display: "block",
                    padding: 0,
                    margin: 0,
                    objectFit: "contain",
                    objectPosition: "left center",
                  }}
                />
              </div>

              <div
                className={styles.attendingCard}
                style={{ padding: "2rem", backgroundColor: "#1F2941" }}
              >
                <h3
                  className={styles.cardNumber}
                  ref={touristsCountRef}
                  style={{ textAlign: "left" }}
                >
                  {touristsCount}+
                </h3>
                <p
                  className={styles.cardDescription}
                  style={{ textAlign: "left" }}
                >
                  Crypto Projects
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Promo Section */}
        <section className={styles.videoSection}>
          <div className={styles.videoContent}>
            <div className={styles.videoThumbnailContainer}>
              <div className={styles.thumbnailWrapper}>
                <Image
                  src={ThumbnailImage}
                  alt="Accelerate Event Video Thumbnail"
                  fill
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  className={styles.thumbnailImage}
                />
                <div className={styles.playButton} onClick={openVideoLightbox}>
                  <div className={styles.playIcon}></div>
                </div>
              </div>
            </div>
            <div className={styles.videoTextContainer}>
              <h2 className={styles.videoTitle}>Scale. Ship. Accelerate.</h2>
              <div className={styles.videoDescription}>
                <p>
                  Solana needs to keep up with the increasing global demand for
                  blockspace. Scale or die is a developers-only conference to
                  explore the future of Solana scaling.
                </p>
                <p>
                  Ship or die is a conference hosting leaders from tech, finance
                  and policy to accelerate the adoption of crypto in these
                  areas.
                </p>
                <p>
                  Accelerate is a week packed with two conferences, tens of side
                  events, workshops and dinners in NYC.
                </p>
              </div>
              <Link
                href="/accelerate-n/tickets"
                className={styles.videoTicketsButton}
              >
                {/* Get Tickets button */}
                Get Tickets →
              </Link>
            </div>
          </div>
        </section>

        {/* Video Lightbox */}
        {showVideoLightbox && (
          <div className={styles.videoLightbox} onClick={closeVideoLightbox}>
            <div
              className={styles.videoLightboxContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeLightboxButton}
                onClick={closeVideoLightbox}
              >
                ×
              </button>
              <div className={styles.videoWrapper}>
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                  title="Accelerate Event Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Free Ticket Modal */}
        {showFreeTicketModal && (
          <div
            className={styles.freeTicketModal}
            onClick={closeFreeTicketModal}
          >
            <div
              className={styles.freeTicketModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeModalButton}
                onClick={closeFreeTicketModal}
              >
                ×
              </button>
              <div className={styles.freeTicketImageWrapper}>
                <div className={styles.freeTicketImageBackground}>
                  <Image
                    src={FreeTicketImage}
                    alt="Free Ticket"
                    width={500}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    priority
                  />
                </div>
              </div>
              <div className={styles.freeTicketText}>
                <h3 className={styles.freeTicketTitle}>BOGO</h3>
                <h2 className={styles.freeTicketHeadline}>
                  Buy 1 Ticket, Get 1 Free
                </h2>
                <p className={styles.freeTicketDescription}>
                  Purchase a ticket and receive a second, so you can bring a
                  fellow builder, founder, or friend.
                </p>
                <Link
                  href="/accelerate-n/tickets"
                  className={styles.freeTicketButton}
                >
                  Get Tickets
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Full-width divider */}
        <div className={styles.divider}></div>

        {/* Speakers Section */}
        <section className={styles.speakersSection} id="speakers">
          <div className={styles.speakersContent}>
            <div className={styles.speakersTitleRow}>
              <h2 className={styles.speakersTitle}>Speakers</h2>
              <Link href="/accelerate-n/tickets" className={styles.speakersCTA}>
                Get Tickets
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.172 11L10.808 5.636L12.222 4.222L20 12L12.222 19.778L10.808 18.364L16.172 13H4V11H16.172Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>

            <div className={styles.speakerGrid}>
              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={EmmettImage}
                    alt="Emmett Hollyer"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Emmett Hollyer</h3>
                <p className={styles.speakerCompany}>
                  General Manager • Solana Mobile
                </p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={LucaImage}
                    alt="Luca Netz"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Luca Netz</h3>
                <p className={styles.speakerCompany}>CEO • Pudgy Penguins</p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={AustinImage}
                    alt="Austin Hurwitz"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Austin Hurwitz</h3>
                <p className={styles.speakerCompany}>Head of BD • Doodles</p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={SummerImage}
                    alt="Summer Mersinger"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Summer Mersinger</h3>
                <p className={styles.speakerCompany}>Commissioner • CFTC</p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={TaylorImage}
                    alt="Taylor Johnson"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Taylor Johnson</h3>
                <p className={styles.speakerCompany}>
                  Founder • Exo Technologies
                </p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={ArielImage}
                    alt="Ariel Seidman"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Ariel Seidman</h3>
                <p className={styles.speakerCompany}>
                  CEO & Co-Founder • Hivemapper
                </p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={RobertImage}
                    alt="Robert Leshner"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Robert Leshner</h3>
                <p className={styles.speakerCompany}>
                  CEO & Co-founder • Superstate
                </p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={ArmaniImage}
                    alt="Armani Ferrante"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Armani Ferrante</h3>
                <p className={styles.speakerCompany}>CEO • Backpack</p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={BrandonImage}
                    alt="Brandon Millman"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Brandon Millman</h3>
                <p className={styles.speakerCompany}>CEO • Phantom</p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={SantiagoImage}
                    alt="Santiago Roel Santos"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Santiago Roel Santos</h3>
                <p className={styles.speakerCompany}>Founder • Inversion</p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={KashImage}
                    alt="Kash Dhanda"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Kash Dhanda</h3>
                <p className={styles.speakerCompany}>Cat-Herder • Jupiter</p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={DavidImage}
                    alt="David Pakman"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>David Pakman</h3>
                <p className={styles.speakerCompany}>
                  Managing Partner • CoinFund
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width divider */}
        <div className={styles.divider}></div>

        {/* Sponsors Section */}
        <section className={styles.sponsorsSection} id="sponsors">
          <div className={styles.sponsorsContent}>
            <div className={styles.sponsorsTitleRow}>
              <h2 className={styles.sponsorsTitle}>Sponsors</h2>
              <Link href="/accelerate-n/tickets" className={styles.sponsorsCTA}>
                Get Tickets
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.172 11L10.808 5.636L12.222 4.222L20 12L12.222 19.778L10.808 18.364L16.172 13H4V11H16.172Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>

            <div className={styles.sponsorsHR}></div>

            <div className={styles.sponsorsGrid}>
              <div className={styles.sponsorLogo}>
                <Image
                  src={WormholeSVG}
                  alt="Wormhole"
                  width={150}
                  height={50}
                />
              </div>
              <div className={styles.sponsorLogo}>
                <Image src={PhantomSVG} alt="Phantom" width={150} height={50} />
              </div>
              <div className={styles.sponsorLogo}>
                <Image
                  src={SolanaMobileSVG}
                  alt="Solana Mobile"
                  width={150}
                  height={50}
                />
              </div>
              <div className={styles.sponsorLogo}>
                <Image
                  src={SolflareSVG}
                  alt="Solflare"
                  width={120}
                  height={40}
                />
              </div>
              <div className={styles.sponsorLogo}>
                <Image src={ZeusSVG} alt="Zeus" width={120} height={40} />
              </div>
              <div className={styles.sponsorLogo}>
                <Image src={HelioSVG} alt="Helio" width={120} height={40} />
              </div>
              <div className={styles.sponsorLogo}>
                <Image src={JitoSVG} alt="Jito" width={85} height={28} />
              </div>
              <div className={styles.sponsorLogo}>
                <Image src={MagnaSVG} alt="Magna" width={120} height={40} />
              </div>
              <div className={styles.sponsorLogo}>
                <Image src={CubeSVG} alt="Cube" width={35} height={12} />
              </div>
              <div className={styles.sponsorLogo}>
                <Image
                  src={RockawaySVG}
                  alt="Rockaway"
                  width={150}
                  height={50}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection} id="faq">
          <h2 className={styles.faqTitle}>FAQs</h2>

          <div className={styles.faqContent}>
            <div className={styles.faqList}>
              {FAQs.map((faq, index) => (
                <details key={index} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    {faq.question}
                    <svg
                      className={styles.faqIcon}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <div className={styles.faqAnswer}>
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* NYC CTA Section */}
        <div
          style={{
            padding: "0 2rem",
            width: "100%",
            backgroundColor: "#13151E",
          }}
        >
          <section className={styles.nycCtaSection}>
            <div className={styles.nycCtaContent}>
              <div className={styles.nycCtaTextContent}>
                <h2 className={styles.nycCtaTitle}>Come to NYC</h2>
                <p className={styles.nycCtaDescription}>
                  Accelerate is for high-conviction people building the next
                  chapter of American tech.
                </p>
                <Link
                  href="/accelerate-n/tickets"
                  className={styles.nycCtaButton}
                >
                  Get Tickets
                </Link>
              </div>
              <div className={styles.nycCtaImageWrapper}>
                <Image
                  src={LibertyDotImage}
                  alt="Statue of Liberty pixel art"
                  className={styles.nycCtaImage}
                  width={900}
                  height={900}
                  priority
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerRow}>
              <div className={styles.footerLogo}>
                <img
                  src={accLogoPath}
                  alt="Accelerate Logo"
                  className={styles.footerLogoImg}
                  width="120"
                  height="30"
                  style={{ width: "120px", height: "auto" }}
                />
              </div>
              <nav className={styles.footerNav}>
                <Link href="#sponsors">SPONSORS</Link>
                <Link href="#speakers">SPEAKERS</Link>
                <Link href="#faq">FAQ</Link>
              </nav>
              <p className={styles.copyright}>© Solana Foundation 2025</p>
            </div>
          </div>
        </footer>

        {/* Sticky Bottom Bar (Mobile Only) */}
        <div
          className={`${styles.stickyBottomBar} ${stickyVisible ? styles.visible : ""}`}
        >
          <Link
            href="/accelerate-n/tickets"
            className={styles.stickyBottomButton}
          >
            Get Tickets
          </Link>
        </div>
      </div>
    </>
  );
}
