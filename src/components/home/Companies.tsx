import { Fragment } from "react";
import classNames from "classnames";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Marquee from "react-fast-marquee";

import { AnimatedText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./Companies.module.scss";

import visaSvg from "../../../assets/home/companies/visa.svg";
import paypalSvg from "../../../assets/home/companies/paypal-usd.svg";
import stripeSvg from "../../../assets/home/companies/stripe.svg";
import awsSvg from "../../../assets/home/companies/aws.svg";
import mastercardSvg from "../../../assets/home/companies/mastercard.svg";
import shopifySvg from "../../../assets/home/companies/shopify.svg";
import googleCloudSvg from "../../../assets/home/companies/google-cloud.svg";
import basicsSvg from "../../../assets/home/companies/basics.svg";
import moreSvg from "../../../assets/home/companies/100-more.svg";

const Companies = () => {
  const { t } = useTranslation();

  const mobileLogos = [
    { src: visaSvg, alt: "Visa" },
    { src: paypalSvg, alt: "PayPal" },
    { src: stripeSvg, alt: "Stripe" },
    { src: awsSvg, alt: "AWS" },
    { src: mastercardSvg, alt: "MasterCard" },
    { src: shopifySvg, alt: "Shopify" },
    { src: googleCloudSvg, alt: "Google Cloud" },
    { src: basicsSvg, alt: "Basics" },
  ];

  const desktopLogos = [
    { src: visaSvg, alt: "Visa" },
    { src: paypalSvg, alt: "PayPal" },
    { src: stripeSvg, alt: "Stripe" },
    { src: awsSvg, alt: "AWS" },
    { src: mastercardSvg, alt: "MasterCard" },
    { src: shopifySvg, alt: "Shopify" },
    { src: googleCloudSvg, alt: "Google Cloud" },
    { src: basicsSvg, alt: "Basics" },
    { src: moreSvg, alt: "100s more" },
  ];

  return (
    <section className={styles.Companies}>
      <div className={classNames(styles.ContentWrapper, "page-width")}>
        <AnimatedText element="h2" as="heading">
          {t("home.companies.title")}
        </AnimatedText>
        <AnimatedText element="p" as="paragraph">
          {t("home.companies.subtitle")}
        </AnimatedText>
      </div>

      <div>
        <div className={styles.MobileMarquee}>
          <Marquee pauseOnHover={false} play={true} speed={100}>
            {[...mobileLogos, ...mobileLogos].map((logo, index) => (
              <Fragment key={`logo-${index}`}>
                <Image src={logo.src} alt={logo.alt} loading="eager" />
              </Fragment>
            ))}
          </Marquee>

          <MotionSlideIn>
            <Image
              src={"/src/img/home/logos/100-more.svg"}
              alt={"100s more"}
              width={145}
              height={98}
              className={styles.MoreLogo}
            />
          </MotionSlideIn>
        </div>

        <div className={styles.DesktopStatic}>
          <div className={styles.StaticRow}>
            {desktopLogos.slice(0, 4).map((logo, index) => (
              <MotionSlideIn
                delayIncrease={0.1}
                key={`logo-${index}`}
                className={styles.LogoWrapper}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={130}
                  height={87.75}
                />
              </MotionSlideIn>
            ))}
          </div>
          <div className={styles.StaticRow}>
            {desktopLogos.slice(4).map((logo, index) => (
              <MotionSlideIn
                delayIncrease={0.1}
                key={`logo-${index}`}
                className={styles.LogoWrapper}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={130}
                  height={87.75}
                />
              </MotionSlideIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Companies;
