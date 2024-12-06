import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Text, { AnimatedText } from "@/components/shared/Text";

import styles from "./JoinCommunity.module.scss";

import MobileHeroImage from "../../../assets/home/join-community.png";
import Image1 from "../../../assets/home/join-community-1.png";
import Image2 from "../../../assets/home/join-community-2.png";
import Image3 from "../../../assets/home/join-community-3.png";
import Image4 from "../../../assets/home/join-community-4.png";
import Image5 from "../../../assets/home/join-community-5.png";
import Image6 from "../../../assets/home/join-community-6.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const JoinCommunity = ({ title, links }) => {
  const { t } = useTranslation();

  const container = useRef(null);

  const images = [Image1, Image2, Image4, Image6, Image5, Image3];

  useGSAP(
    () => {
      let Imgs = gsap.utils.toArray(".join-community-img"),
        mm = gsap.matchMedia();

      mm.add("(min-width:768px)", () => {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=500px",
            scrub: 1,
            pin: true,
            pinSpacing: "margin",
          },
          defaults: { ease: "none" },
        });

        pinTl.from(Imgs, {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        });

        pinTl.from(
          ".join-commuity-main-title , .links",
          {
            autoAlpha: 0,
            y: 50,
            stagger: 0.1,
          },
          "<50%",
        );
      });
    },
    { scope: container },
  );

  return (
    <div className={styles.JoinCommunity} ref={container}>
      <Image
        src={MobileHeroImage}
        alt={t("home.join-community.hero-alt")}
        width={390}
        height={209}
        className={styles.MobileHeroImage}
      />

      <div className={styles.ImgsWrapper}>
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={t("home.join-community.hero-alt")}
            width={390}
            height={209}
            className={`${styles.Image} join-community-img`}
          />
        ))}
      </div>

      <div className={styles.Content}>
        <AnimatedText
          element="h2"
          as="heading"
          className={`${styles.Title} ${styles.MobileTitle}`}
        >
          {title}
        </AnimatedText>

        <Text
          element="h2"
          as="heading"
          className={`${styles.Title} ${styles.DesktopTitle} join-commuity-main-title`}
        >
          {title}
        </Text>

        <div className={`${styles.Links} links`}>
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinCommunity;
