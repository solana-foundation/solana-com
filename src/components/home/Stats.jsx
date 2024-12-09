import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./Stats.module.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Stats = ({ stats }) => {
  const container = useRef();

  useGSAP(
    () => {
      let statsElements = gsap.utils.toArray(".single-stat"),
        pinDuration = statsElements.length * 500,
        lastIndex = statsElements.length - 1,
        paginationDots = gsap.utils.toArray(".pagination .dot"),
        paginationDotsBG = gsap.utils.toArray(".pagination .dotBG"),
        mm = gsap.matchMedia();

      mm.add("(min-width:768px)", () => {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "center center",
            end: `+=${pinDuration}`,
            scrub: 1,
            pin: true,
            pinSpacing: "margin",
            invalidateOnRefresh: false,
          },
          defaults: { ease: "none" },
        });

        statsElements.forEach((stat, i) => {
          pinTl.set(paginationDots[i], { height: "40px" });
          pinTl.to(paginationDotsBG[i], { height: "100%" });

          pinTl.fromTo(
            stat,
            {
              opacity: i === 0 ? 1 : 0,
            },
            {
              keyframes: [
                { opacity: 1 },
                {
                  opacity: i !== lastIndex && 0,
                },
              ],
            },
            "<",
          );

          pinTl.set(paginationDots[i], { height: "7px" });
          pinTl.set(paginationDotsBG[i], { height: "0%" });
        });
      });
    },
    { scope: container },
  );

  return (
    <div className={styles.StatsSection} ref={container}>
      <div className={`${styles.Pagination} pagination`}>
        {stats.length &&
          stats.map((stat, index) => (
            <div key={index} className={`${styles.dot} dot`}>
              <span className={`${styles.dotBG} dotBG `}></span>
            </div>
          ))}
      </div>
      <div id="statsWrapper" className={styles.StatsWrapper}>
        {stats.length &&
          stats.map((stat, index) => <MotionStat key={index} stat={stat} />)}
      </div>
    </div>
  );
};

const MotionStat = ({ stat }) => {
  return (
    <div className={`${styles.Stat} single-stat`}>
      <MotionSlideIn element="h3" className={styles.Title}>
        {stat.title}
      </MotionSlideIn>
      <MotionSlideIn element="p" className={styles.Value}>
        {stat.value}
      </MotionSlideIn>
      <MotionSlideIn element="p" className={styles.Subtext}>
        {stat.subtext}
      </MotionSlideIn>
    </div>
  );
};

export default Stats;
