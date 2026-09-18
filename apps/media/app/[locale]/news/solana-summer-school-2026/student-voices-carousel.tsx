"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./summer-school.module.css";

const figmaRoot = "/uploads/posts/solana-summer-school-2026/figma/voices";

const quotes = [
  {
    name: "Jae",
    text: "I started with almost no web3 experience and not much confidence in my English. A few months in, I actually believe I can build something and I've started thinking about a global career for the first time. It was also great to see how genuinely committed Solana is to growing builders.",
  },
  {
    name: "Sulav",
    text: "I applied with just amateur skills and a learning mindset, but the hands-on exercises throughout the six weeks made me genuinely interested in contributing to the ecosystem.",
  },
  {
    name: "Nan",
    text: "Solana Summer School pushed me from writing my first Anchor program to shipping a full dApp with a live token and AI pipeline. Many thanks to Chaerin, Andre, and the other lecturers.",
  },
  {
    name: "Michal",
    text: "I had been holding off on learning blockchain for a long time because I couldn't find anything suitable that could motivate me. Thanks to Solana Summer School, I finally learned it and built a project!",
  },
] as const;

export function StudentVoicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(3);
  const activeQuote = quotes[activeIndex] ?? quotes[3];

  const move = (direction: -1 | 1) => {
    setActiveIndex(
      (current) => (current + direction + quotes.length) % quotes.length,
    );
  };

  return (
    <section
      aria-label="Student voices"
      aria-roledescription="carousel"
      className={`not-prose ${styles.canvas} ${styles.voices}`}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
      tabIndex={0}
    >
      <h2 className={`${styles.zineHeading} ${styles.voicesHeading}`}>
        Student
        <br />
        Voices
      </h2>
      <Image
        src={`${figmaRoot}/yellow-smiley.webp`}
        alt="Hand-painted yellow smiley face"
        width={366}
        height={259}
        className={styles.voicesSmile}
        loading="eager"
      />
      <Image
        src={`${figmaRoot}/smartwatch-collage.webp`}
        alt="A wristwatch collage with hand-drawn arrows"
        width={486}
        height={445}
        className={styles.voicesWatch}
        loading="eager"
      />

      <div className={styles.quoteArea}>
        <button
          type="button"
          aria-label="Previous student quote"
          className={styles.quoteArrow}
          onClick={() => move(-1)}
        >
          ◀
        </button>
        <blockquote
          aria-live="polite"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} of ${quotes.length}`}
          className={styles.quotePaper}
        >
          <p>{activeQuote.text}</p>
          <footer>– {activeQuote.name}</footer>
        </blockquote>
        <button
          type="button"
          aria-label="Next student quote"
          className={styles.quoteArrow}
          onClick={() => move(1)}
        >
          ▶
        </button>
        <div className={styles.quoteDots} aria-label="Choose a student quote">
          {quotes.map((quote, index) => (
            <button
              key={quote.name}
              type="button"
              aria-label={`Show quote from ${quote.name}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
