import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./tickets.module.scss";

// Import images
import MapSVG from "../../../../../assets/accelerate/map.svg";
import ShipTicket from "../../../../../assets/accelerate/ship.png";
import ScaleTicket from "../../../../../assets/accelerate/scale.png";
import AccLogo from "../../../../../assets/accelerate/acc-logo.svg";

function TicketsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showShipModal, setShowShipModal] = useState(false);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check in case page loads with scroll
    handleScroll();

    // Add a class to the body to hide global header
    document.body.classList.add("accelerate-tickets-page");

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("accelerate-tickets-page");
    };
  }, []);

  // Handle modal open/close
  const openShipModal = (e) => {
    e.preventDefault();
    setShowShipModal(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeShipModal = () => {
    setShowShipModal(false);
    document.body.style.overflow = ""; // Re-enable scrolling
  };

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && showShipModal) {
        closeShipModal();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [showShipModal]);

  return (
    <>
      <Head>
        <title>Accelerate - Get Your Ticket</title>
        <meta
          name="description"
          content="Get your ticket to Accelerate - a gathering of America's next builders."
        />
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
            <Link href="/accelerate">
              <Image
                src={AccLogo}
                alt="Accelerate Logo"
                className={styles.logoImg}
                width={245}
                height={58}
                priority
              />
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link href="/accelerate#sponsors">SPONSORS</Link>
            <Link href="/accelerate#speakers">SPEAKERS</Link>
            <Link href="/accelerate#faq">FAQ</Link>
            <Link href="/accelerate" className={styles.backButton}>
              BACK TO EVENT
            </Link>
          </nav>
        </header>

        <section className={styles.ticketsSection}>
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

          <div className={styles.ticketsContent}>
            <h1 className={styles.mainTitle}>Get Your Ticket</h1>

            <div className={styles.ticketsGrid}>
              {/* Ship or Die Ticket */}
              <div className={`${styles.ticketCard} ${styles.shipTicket}`}>
                <div className={styles.ticketImageContainer}>
                  <Image
                    src={ShipTicket}
                    alt="Ship or Die Ticket"
                    className={styles.ticketImage}
                    width={500}
                    height={200}
                    priority
                  />
                </div>
                <div className={styles.ticketInfo}>
                  <div className={styles.ticketDate}>MAY 22-23 • NYC</div>
                  <h2 className={styles.ticketTitle}>Attend Ship or Die</h2>
                  <p className={styles.ticketDescription}>
                    Open to all, this event will introduce the Solana ecosystem
                    – and the crypto world at large – to the deep innovation
                    happening in the U.S.
                  </p>
                  <div className={styles.ticketPrice}>$400</div>
                  <a
                    href="#"
                    onClick={openShipModal}
                    className={styles.getTicketsButton}
                  >
                    Get Tickets
                  </a>
                  <div className={styles.studentLinkInline}>
                    <span className={styles.studentText}>
                      Student? Apply to get a subsidized ticket&nbsp;
                    </span>
                    <a
                      href="https://solanafoundation.typeform.com/SOD-student?typeform-source=solana.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.studentLink}
                    >
                      here
                    </a>
                  </div>
                </div>
              </div>

              {/* Scale or Die Ticket */}
              <div className={`${styles.ticketCard} ${styles.scaleTicket}`}>
                <div className={styles.ticketImageContainer}>
                  <Image
                    src={ScaleTicket}
                    alt="Scale or Die Ticket"
                    className={styles.ticketImage}
                    width={500}
                    height={200}
                    priority
                  />
                </div>
                <div className={styles.ticketInfo}>
                  <div className={styles.ticketDate}>MAY 19-20 • NYC</div>
                  <h2 className={styles.ticketTitle}>Attend Scale or Die</h2>
                  <p className={styles.ticketDescription}>
                    A dev-only, workshop-driven conference for deep tech that
                    moves data at the speed of light.
                  </p>
                  <div className={styles.ticketPrice}>$200</div>
                  <a
                    href="https://solanafoundation.typeform.com/scaleordie?typeform-source=solana.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.getTicketsButton}
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerRow}>
              <div className={styles.footerLogo}>
                <Link href="/accelerate">
                  <Image
                    src={AccLogo}
                    alt="Accelerate Logo"
                    className={styles.footerLogoImg}
                    width={120}
                    height={30}
                    priority
                  />
                </Link>
              </div>
              <nav className={styles.footerNav}>
                <Link href="/accelerate#sponsors">SPONSORS</Link>
                <Link href="/accelerate#speakers">SPEAKERS</Link>
                <Link href="/accelerate#faq">FAQ</Link>
              </nav>
              <p className={styles.copyright}>© Solana Foundation 2025</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Ship or Die Modal */}
      {showShipModal && (
        <div className={styles.modalOverlay} onClick={closeShipModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeModalButton}
              onClick={closeShipModal}
            >
              ×
            </button>
            <div className={styles.iframeContainer}>
              <iframe
                src="https://lu.ma/embed/event/evt-bjj5kjavcbnr0ki/simple"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { TicketsPage };
export default TicketsPage;
