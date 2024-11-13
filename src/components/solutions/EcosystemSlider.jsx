import Link from "next/link";
import Image from "next/image";
import { Trans } from "next-i18next";
import classNames from "classnames";
import { ChevronRight } from "react-feather";
import Marquee from "react-fast-marquee";

import CardsSlider from "@/components/shared/CardsSlider";
import { AnimatedText, GradientText } from "@/components/shared/Text";

import styles from "./EcosystemSlider.module.scss";

export const Card = ({ img, url, title, text, className }) => {
  const Content = () => (
    <>
      <div className={styles.ImageWrapper}>
        <Image src={img} alt={title} width={238} height={153} />
      </div>
      <h5>
        <span>{title}</span>
        {url && <ChevronRight />}
      </h5>
      <p>{text}</p>
    </>
  );

  return (
    <div className={classNames(styles.Card, className)}>
      {url ? (
        <Link href={url} target="_blank">
          <Content />
        </Link>
      ) : (
        <Content />
      )}
    </div>
  );
};

const EcosystemSlider = ({
  titleKey,
  textKey,
  cards,
  className,
  titleBlockClassName,
}) => {
  return (
    <div className={classNames(styles.EcosystemSlider, className)}>
      <div className={classNames("page-width", titleBlockClassName)}>
        {titleKey && (
          <AnimatedText element="h2" as="heading" className={styles.Title}>
            <Trans
              i18nKey={titleKey}
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(89.77deg, #80ECFF 0.17%, #64A8F2 50.54%, #9945FF 99.77%);" />
                ),
              }}
            />
          </AnimatedText>
        )}

        {textKey && (
          <AnimatedText element="p" as="paragraph" className={styles.Text}>
            <Trans i18nKey={textKey} />
          </AnimatedText>
        )}
      </div>

      <div className={classNames(styles.MobileCarousel, "d-lg-none")}>
        <CardsSlider items={cards} />
      </div>

      <div className={classNames(styles.DesktopMarquee, "d-none d-lg-block")}>
        <Marquee pauseOnHover={true} play={true} speed={100} autoFill={true}>
          <div className={styles.Cards}>
            {cards.map((card, index) => (
              <div key={`card-${index}`} className={styles.CardWrapper}>
                {card}
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default EcosystemSlider;
