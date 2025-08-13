import React, { useEffect, useState, useRef, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./accelerate.module.scss";

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
// import FreeTicketImage from "../../../../assets/accelerate/free.png";
import AccLogo from "../../../../assets/accelerate/acc-logo.svg";

// Import speaker images
import AnatolyImage from "../../../../assets/accelerate/speakers/anatoly.png";
import AustinImage from "../../../../assets/accelerate/speakers/austin.png";
import SummerImage from "../../../../assets/accelerate/speakers/summer.png";
import DanImage from "../../../../assets/accelerate/speakers/dan.png";
import LilyImage from "../../../../assets/accelerate/speakers/lily.png";
import RogerImage from "../../../../assets/accelerate/speakers/roger.png";
import DavidImage from "../../../../assets/accelerate/speakers/david.png";
import BrandonImage from "../../../../assets/accelerate/speakers/brandon.png";
import LucaImage from "../../../../assets/accelerate/speakers/luca.png";
import RobertImage from "../../../../assets/accelerate/speakers/robert.png";
import TaylorImage from "../../../../assets/accelerate/speakers/taylor.png";
import KashImage from "../../../../assets/accelerate/speakers/kash.png";

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
import PaxosSVG from "../../../../assets/accelerate/sponsors/paxos.svg";
import UsdgSVG from "../../../../assets/accelerate/sponsors/usdg.svg";

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

// Create a component for the hotel information
const HotelInfoTable = () => (
  <>
    <p>
      The Solana Foundation has worked with multiple hotels in New York City to
      set up discounted rates during Ship or Die.
    </p>
    <table
      style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}
    >
      <thead>
        <tr>
          <th
            style={{
              textAlign: "left",
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Hotel
          </th>
          <th
            style={{
              textAlign: "left",
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Rate (May 17-24)
          </th>
          <th
            style={{
              textAlign: "left",
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Booking Info
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <a
              href="https://www.google.com/maps/place/Hotel+Indigo+NYC+Financial+District"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emailLink}
            >
              Hotel Indigo NYC Financial District
            </a>
          </td>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Starting at $269
          </td>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <a
              href="https://www.ihg.com/hotelindigo/hotels/us/en/find-hotels/select-roomrate?fromRedirect=true&qSrt=sBR&qIta=99801505&icdv=99801505&qSlH=NYCWL&qCiD=17&qCiMy=042025&qCoD=24&qCoMy=042025&qGrpCd=SLN&qAAR=6CBARC&qRtP=6CBARC&setPMCookies=true&qSHBrC=IN&qDest=50%20Trinity%20Place,%20New%20York,%20NY,%20US&srb_u=1&qRmFltr="
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emailLink}
            >
              Book Now
            </a>
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <a
              href="https://www.google.com/maps/place/Moxy+NYC+Downtown"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emailLink}
            >
              Moxy NYC Downtown
            </a>
          </td>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Starting at $329
          </td>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <a
              href="https://www.marriott.com/event-reservations/reservation-link.mi?id=1733952806965&key=GRP&guestreslink2=true&app=resvlink"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emailLink}
            >
              Book Now
            </a>
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <a
              href="https://www.google.com/maps/place/New+York+Marriott+Downtown"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emailLink}
            >
              New York Marriott Downtown
            </a>
          </td>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Starting at $399
          </td>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <a
              href="https://book.passkey.com/gt/220513367?gtid=f7b00f615a2c48c96440d4375b8c1a20"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emailLink}
            >
              Book Now
            </a>
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <a
              href="https://www.google.com/maps/place/The+Washington+by+LuxUrban"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emailLink}
            >
              The Washington by LuxUrban
            </a>
          </td>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Starting at $314
          </td>
          <td
            style={{
              padding: "8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <a
              href="https://hotels.cloudbeds.com/en/reservation/pIsUES/?currency=usd"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emailLink}
            >
              Book Now
            </a>{" "}
            (Promo code: <code>B965776</code>)
          </td>
        </tr>
      </tbody>
    </table>
  </>
);

// Custom components for FAQ answers
const FAQAnswers = {
  whereIsAccelerate: () => (
    <p>
      Accelerate will be spread across New York City, the crypto capital of the
      United States. Ship or Die will be at Pier 36 in Manhattan underneath the
      iconic Manhattan Bridge. Scale or Die will be located at a to-be-announced
      venue in Lower Manhattan.
    </p>
  ),
  whichTicket: () => (
    <p>
      Tickets are event-specific; please choose the ticket that aligns with your
      eligibility. Ship or Die is open to everyone. Scale or Die is exclusively
      for developers and by application only. For other events, it&apos;s a case
      by case basis — check the listing for more details.
    </p>
  ),
  canIGetTicketToEverything: () => (
    <p>
      All applicants who are approved for Scale or Die will be automatically
      issued tickets to both Ship or Die and Scale or Die. You can only get
      these tickets if you are approved for Scale or Die.
    </p>
  ),
  howDoISponsor: () => (
    <p>
      There are many sponsorship opportunities available for Accelerate events.
      Please fill out the form{" "}
      <a
        href="https://solanafoundation.typeform.com/sponsorform?typeform-source=solana.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.emailLink}
      >
        here
      </a>
      .
    </p>
  ),
  areTravelAndAccommodation: () => (
    <p>
      Attendees are responsible for making their own travel and accommodation as
      part of their ticket. See below for hotel discounts!
    </p>
  ),
  whatHotelShouldIStayAt: () => <HotelInfoTable />,
  howDoIGetInvitationLetter: () => (
    <p>
      Attendees are responsible for getting their own visas. If you need a
      letter of invitation for your visa, you can submit your request{" "}
      <a
        href="https://solanafoundation.typeform.com/invite-letter?typeform-source=solana.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.emailLink}
      >
        here
      </a>
      . Letters should arrive within 5 business days of your request, but may
      take longer.
    </p>
  ),
  arePressPassesAvailable: () => (
    <p>
      Press passes are only available for Ship or Die, and by application only.
      Please apply{" "}
      <a
        href="https://solanafoundation.typeform.com/pressform"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.emailLink}
      >
        here
      </a>
      .
    </p>
  ),
  howDoIGetToVenues: () => (
    <p>
      There&apos;s plenty of ways to get around New York! We suggest using the
      subway, taxis, Citibike, or rideshare apps. Please note that there is no
      parking onsite at any venue.
    </p>
  ),
  iHaveAnotherQuestion: () => (
    <p>
      Reach out to{" "}
      <a href="mailto:accelerate@solana.org" className={styles.emailLink}>
        accelerate@solana.org
      </a>
      .
    </p>
  ),
};

const FAQs = [
  {
    question: "Where is Accelerate?",
    answerComponent: FAQAnswers.whereIsAccelerate,
  },
  {
    question: "Which ticket should I get?",
    answerComponent: FAQAnswers.whichTicket,
  },
  {
    question: "Can I get a ticket to everything?",
    answerComponent: FAQAnswers.canIGetTicketToEverything,
  },
  {
    question: "How do I sponsor Accelerate?",
    answerComponent: FAQAnswers.howDoISponsor,
  },
  {
    question: "Are travel and accommodation part of my ticket?",
    answerComponent: FAQAnswers.areTravelAndAccommodation,
  },
  {
    question: "What hotel should I stay at?",
    answerComponent: FAQAnswers.whatHotelShouldIStayAt,
  },
  {
    question: "How do I get an invitation letter?",
    answerComponent: FAQAnswers.howDoIGetInvitationLetter,
  },
  {
    question: "Are press passes available?",
    answerComponent: FAQAnswers.arePressPassesAvailable,
  },
  {
    question: "How do I get to the venues?",
    answerComponent: FAQAnswers.howDoIGetToVenues,
  },
  {
    question: "I have another question!",
    answerComponent: FAQAnswers.iHaveAnotherQuestion,
  },
];

export default function AcceleratePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showVideoLightbox, setShowVideoLightbox] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  // Counter animations
  const [peopleCount, peopleCountRef] = useCounterAnimation(3000, 2000, 0);
  const [companiesCount, companiesCountRef] = useCounterAnimation(
    100,
    2000,
    200,
  );
  const [policyCount, policyCountRef] = useCounterAnimation(20, 2000, 400);
  const [touristsCount, touristsCountRef] = useCounterAnimation(50, 1000, 600);

  // Handle video lightbox
  const openVideoLightbox = useCallback(() => {
    setShowVideoLightbox(true);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden";
  }, [setShowVideoLightbox]);

  const closeVideoLightbox = useCallback(() => {
    setShowVideoLightbox(false);
    // Re-enable scrolling
    document.body.style.overflow = "";
  }, [setShowVideoLightbox]);

  // Close lightbox on ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (showVideoLightbox) {
          closeVideoLightbox();
        }
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [showVideoLightbox, closeVideoLightbox]);

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
    document.body.classList.add("accelerate-page");

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("accelerate-page");
    };
  }, [stickyVisible]);

  // These could be moved to translation files in a real implementation
  const heroTitle = "Tech, Finance, and Policy are Changing";
  const heroDescription =
    "Accelerate is a high-conviction summit for people building the next chapter of America. From AI to crypto, defense to finance—if you&apos;re not in the room, you&apos;re already behind.";

  // YouTube video ID
  const youtubeVideoId = "_pF34DUWYSY";

  return (
    <>
      <Head>
        <title>Accelerate | Solana</title>
        <meta name="description" content={heroDescription} />

        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content={`Accelerate - ${heroTitle}`} />
        <meta property="og:description" content={heroDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solana.com/accelerate" />
        <meta
          property="og:image"
          content="https://solana.com/social/accelerate.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Accelerate - ${heroTitle}`} />
        <meta name="twitter:description" content={heroDescription} />
        <meta
          name="twitter:image"
          content="https://solana.com/social/accelerate.jpg"
        />

        <style>
          {`
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
            <Image
              src={AccLogo}
              alt="Accelerate Logo"
              className={styles.logoImg}
              width={120}
              height={30}
              priority
            />
          </div>
          <nav className={styles.nav}>
            <a href="#sponsors">SPONSORS</a>
            <a href="#speakers">SPEAKERS</a>
            <a href="#faq">FAQ</a>
            <Link href="/accelerate/tickets" className={styles.ticketsButton}>
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
                src={AccLogo}
                alt="Accelerate Logo"
                className={styles.heroLogoImg}
              />
            </div>

            <h1>Tech, Finance, and Policy are Changing</h1>
            <p className={styles.heroDescription}>
              Accelerate is an event where business, policy, and crypto leaders
              collaborate to write the next chapter of blockchain in America.
            </p>
            <Link
              href="/accelerate/tickets"
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
                  Builders, Executives, and Attendees
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
                  {companiesCount}+
                </h3>
                <p
                  className={styles.cardDescription}
                  style={{ textAlign: "left" }}
                >
                  Fintech and Tech Companies
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
                  Policymakers
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
                  Disruptive Crypto Startups
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
                  Choose your path. Accelerate is a week packed with two
                  conferences and dozens of summits, workshops, dinners, and
                  more.
                </p>
                <p>
                  Ship or Die will host leaders from tech, finance, and policy
                  to accelerate the future of crypto in the United States.
                </p>
                <p>
                  Scale or Die is a developer-only conference to dig into the
                  deep tech behind scaling the global demand for blockspace.
                </p>
              </div>
              <Link
                href="/accelerate/tickets"
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

        {/* Full-width divider */}
        <div className={styles.divider}></div>

        {/* Speakers Section */}
        <section className={styles.speakersSection} id="speakers">
          <div className={styles.speakersContent}>
            <div className={styles.speakersTitleRow}>
              <h2 className={styles.speakersTitle}>Speakers</h2>
              <Link href="/accelerate/tickets" className={styles.speakersCTA}>
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
                    src={AnatolyImage}
                    alt="Anatoly Yakovenko"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Anatoly Yakovenko</h3>
                <p className={styles.speakerCompany}>
                  Solana Labs • Scale or Die
                </p>
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
                <p className={styles.speakerCompany}>Doodles • Ship or Die</p>
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
                <p className={styles.speakerCompany}>CFTC • Ship or Die</p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={DanImage}
                    alt="Dan Albert"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Dan Albert</h3>
                <p className={styles.speakerCompany}>
                  Solana Foundation • Scale or Die
                </p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={LilyImage}
                    alt="Lily Liu"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Lily Liu</h3>
                <p className={styles.speakerCompany}>
                  Solana Foundation • Ship or Die
                </p>
              </div>

              <div className={styles.speakerCard}>
                <div className={styles.speakerImageWrapper}>
                  <Image
                    src={RogerImage}
                    alt="Roger Wattenhofer"
                    width={300}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    className={styles.speakerImage}
                  />
                </div>
                <h3 className={styles.speakerName}>Roger Wattenhofer</h3>
                <p className={styles.speakerCompany}>Anza • Scale or Die</p>
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
                <p className={styles.speakerCompany}>CoinFund • Ship or Die</p>
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
                <p className={styles.speakerCompany}>Phantom • Ship or Die</p>
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
                <p className={styles.speakerCompany}>
                  Pudgy Penguins • Ship or Die
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
                  Superstate • Ship or Die
                </p>
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
                  Exo Technologies • Ship or Die
                </p>
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
                <p className={styles.speakerCompany}>Jupiter • Ship or Die</p>
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
              <Link href="/accelerate/tickets" className={styles.sponsorsCTA}>
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
              <div className={styles.titleSponsorSection}>
                <p className={styles.sponsorTierLabel}>HEADLINE SPONSORS</p>
                <div className={styles.titleSponsorsGrid}>
                  <div className={styles.titleSponsorLogo}>
                    <Image
                      src={WormholeSVG}
                      alt="Wormhole"
                      width={400}
                      height={127}
                    />
                  </div>
                  <div className={styles.titleSponsorLogo}>
                    <Image
                      src={SolflareSVG}
                      alt="Solflare"
                      width={180}
                      height={60}
                    />
                  </div>
                  <div className={styles.titleSponsorLogo}>
                    <Image
                      src={SolanaMobileSVG}
                      alt="Solana Mobile"
                      width={225}
                      height={75}
                    />
                  </div>
                  <div className={styles.titleSponsorLogo}>
                    <Image src={JitoSVG} alt="Jito" width={120} height={40} />
                  </div>
                  <div className={styles.titleSponsorLogo}>
                    <Image src={PaxosSVG} alt="Paxos" width={180} height={60} />
                  </div>
                  <div className={styles.titleSponsorLogo}>
                    <Image src={UsdgSVG} alt="USDG" width={180} height={60} />
                  </div>
                </div>
              </div>

              <div className={styles.goldSponsorsSection}>
                <p className={styles.sponsorTierLabel}>SUPPORTING SPONSORS</p>
                <div className={styles.goldSponsorsGrid}>
                  <div className={styles.sponsorLogo}>
                    <Image
                      src={PhantomSVG}
                      alt="Phantom"
                      width={150}
                      height={50}
                    />
                  </div>
                  <div className={styles.sponsorLogo}>
                    <Image src={ZeusSVG} alt="Zeus" width={120} height={40} />
                  </div>
                  <div className={styles.sponsorLogo}>
                    <Image src={HelioSVG} alt="Helio" width={120} height={40} />
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
                    {faq.answerComponent && <faq.answerComponent />}
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
                  href="/accelerate/tickets"
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
                <Image
                  src={AccLogo}
                  alt="Accelerate Logo"
                  className={styles.footerLogoImg}
                  width={120}
                  height={30}
                  priority
                />
              </div>
              <nav className={styles.footerNav}>
                <a href="#sponsors">SPONSORS</a>
                <a href="#speakers">SPEAKERS</a>
                <a href="#faq">FAQ</a>
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
            href="/accelerate/tickets"
            className={styles.stickyBottomButton}
          >
            Get Tickets
          </Link>
        </div>
      </div>
    </>
  );
}

// Add layout property
AcceleratePage.layout = "AccelerateLayout";
