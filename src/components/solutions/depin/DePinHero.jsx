import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Text from "@/components/shared/Text";
import Button from "@/components/solutions/Button";
import { ChevronRight } from "lucide-react";
import styles from "./DePINHero.module.scss";

// Import images
import gradientBg from "assets/solutions/depin/gradient.svg";
import globeImage from "assets/solutions/depin/globe.png";
import heliumLogo from "assets/solutions/depin/helium.png";
import renderLogo from "assets/solutions/depin/render.png";
import hivemapperLogo from "assets/solutions/depin/hivemapper.png";
import starpowerLogo from "assets/solutions/depin/starpower.png";
import geodnetLogo from "assets/solutions/depin/geodnet.png";
import skytradeLogo from "assets/solutions/depin/skytrade.png";
import xnetLogo from "assets/solutions/depin/xnet.png";
import cudisLogo from "assets/solutions/depin/cudis.png";
import natixLogo from "assets/solutions/depin/natix.png";

// Additional logos will need to be added here

const sliderData = [
  {
    logo: heliumLogo,
    name: "Helium Mobile",
    description: "A cheaper phone plan",
    stats: {
      users: "350k+",
      label: "daily subscribers",
    },
  },
  {
    logo: hivemapperLogo,
    name: "Hivemapper",
    description: "Decentralized mapmaking",
    stats: {
      users: "30%",
      label: "of the world's roads mapped",
    },
  },
  {
    logo: renderLogo,
    name: "Render",
    description: "AI-driven creativity with decentralized GPU power",
    stats: {
      users: "40M",
      label: "frames rendered",
    },
  },
  {
    logo: starpowerLogo,
    name: "Starpower",
    description:
      "Powering AI partnering with renewable energy device manufactures",
    stats: {
      users: "5M",
      label: "registered users",
    },
  },
  {
    logo: geodnetLogo,
    name: "Geodnet",
    description: "High-precision positioning for robots",
    stats: {
      users: "2.5x",
      label: "bigger than its closest web2 competitor",
    },
  },
  {
    logo: skytradeLogo,
    name: "Skytrade",
    description: "Monetizing your low-altitude air rights assets",
    stats: {
      users: "10,000",
      label: "air rights parcels",
    },
  },
  {
    logo: xnetLogo,
    name: "XNET",
    description: "A decentralized mobile network that works with any carrier",
    stats: {
      users: "1M",
      label: "total users",
    },
  },
  {
    logo: cudisLogo,
    name: "Cudis",
    description: "The smart ring that rewards your wellness journey",
    stats: {
      users: "1B+",
      label: "steps tracked",
    },
  },
  {
    logo: natixLogo,
    name: "NATIX",
    description:
      "Infrastructure for mapping, autonomous driving, and physical AI",
    stats: {
      users: "220k",
      label: "registered drivers",
    },
  },
];

const ProjectCard = ({ data }) => (
  <motion.div className={styles.cardWrapper}>
    <div className={styles.projectCard}>
      <div className={styles.cardHeader}>
        <Image
          src={data.logo}
          alt={data.name}
          width={32}
          height={32}
          className={styles.logo}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <h3>{data.name}</h3>
        <div className={styles.arrow}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 15L15 5M15 5H5M15 5V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <p className={styles.description}>{data.description}</p>
      <div className={styles.singleStat}>
        <span className={styles.statValue}>{data.stats.users}</span>
        <span className={styles.statLabel}>{data.stats.label}</span>
      </div>
    </div>
  </motion.div>
);

const DePINHero = () => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollTimerRef = useRef(null);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

      // Update scroll position for debug display
      setScrollPosition(scrollLeft);
      setHasHorizontalScroll(scrollWidth > clientWidth);

      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Function to handle automatic scrolling
  const autoScroll = useCallback(() => {
    if (!carouselRef.current || !isAutoScrolling) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

    // If we're near the end, go back to the start
    if (scrollLeft >= scrollWidth - clientWidth - 10) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      // Otherwise keep scrolling right
      carouselRef.current.scrollBy({ left: 424, behavior: "smooth" });
    }
  }, [isAutoScrolling]);

  useEffect(() => {
    // Set up auto-scrolling timer
    if (isAutoScrolling) {
      autoScrollTimerRef.current = setInterval(autoScroll, 5000);
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [isAutoScrolling, autoScroll]);

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);

    return () => {
      window.removeEventListener("resize", checkScrollability);
    };
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      // Pause auto scrolling temporarily when user interacts
      setIsAutoScrolling(false);

      carouselRef.current.scrollBy({ left: -424, behavior: "smooth" });

      // Resume auto scrolling after a delay
      setTimeout(() => setIsAutoScrolling(true), 10000);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      // Pause auto scrolling temporarily when user interacts
      setIsAutoScrolling(false);

      carouselRef.current.scrollBy({ left: 424, behavior: "smooth" });

      // Resume auto scrolling after a delay
      setTimeout(() => setIsAutoScrolling(true), 10000);
    }
  };

  return (
    <section className={styles.hero}>
      {/* Background Elements */}
      <Image
        src={gradientBg}
        alt="Background gradient"
        fill
        className={styles.backgroundImage}
        priority
      />

      {/* DePIN Badge */}
      <div className={styles.badge}>
        <span className={styles.eyebrowText}>DePIN SZN is here</span>
        <ChevronRight className={styles.badgeIcon} size={14} />
      </div>

      <div className={styles.content}>
        <Text element="h1" as="heading">
          Home of World&apos;s Biggest DePIN projects
        </Text>
        <Text element="p" as="paragraph">
          The next generation of infrastructure is being built on the
          decentralized, high-performance Solana blockchain.
        </Text>
        <Button text="Start Building" url="#developer-resources" />
      </div>

      <div className={styles.sliderSection}>
        {/* Debug info - remove in production */}
        <div
          style={{
            position: "absolute",
            top: "-30px",
            left: 0,
            color: "white",
            background: "rgba(0,0,0,0.5)",
            padding: "5px",
            fontSize: "14px",
            zIndex: 100,
            display: "none", // hide in production
          }}
        >
          Scroll: {Math.round(scrollPosition)}px | Scrollable:{" "}
          {hasHorizontalScroll ? "Yes" : "No"} | Auto:{" "}
          {isAutoScrolling ? "On" : "Off"}
        </div>

        <button
          className={`${styles.navigationButton} ${styles.prev}`}
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          aria-label="Previous slide"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M23 28L15 20L23 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className={styles.carouselContainer}
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className={styles.cards}>
            {sliderData.map((project, index) => (
              <ProjectCard key={index} data={project} />
            ))}
          </div>
        </div>

        <button
          className={`${styles.navigationButton} ${styles.next}`}
          onClick={scrollRight}
          disabled={!canScrollRight}
          aria-label="Next slide"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M17 28L25 20L17 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <Image
        src={globeImage}
        alt="Globe visualization"
        width={1400}
        height={800}
        className={styles.globe}
        priority
      />
    </section>
  );
};

export default DePINHero;
