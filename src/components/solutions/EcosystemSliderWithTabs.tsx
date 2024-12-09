import { useState, ReactNode, FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trans } from "next-i18next";
import classNames from "classnames";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronRight } from "react-feather";
import Marquee from "react-fast-marquee";

import CardsSlider from "@/components/shared/CardsSlider";
import { AnimatedText, GradientText } from "@/components/shared/Text";

import styles from "./EcosystemSliderWithTabs.module.scss";

export const Card = ({ img, url, title, text }) => {
  const Content = () => (
    <>
      <Image src={img} alt={title} width={238} height={153} />
      <h5>
        <span>{title}</span>
        <ChevronRight />
      </h5>
      <p>{text}</p>
    </>
  );

  return (
    <div className={classNames(styles.Card)}>
      {url ? (
        <Link href={url}>
          <Content />
        </Link>
      ) : (
        <Content />
      )}
    </div>
  );
};

interface EcosystemSliderWithTabsProps {
  titleKey: string;
  tab1Title: string;
  tab2Title: string;
  tab1Cards: ReactNode[];
  tab2Cards: ReactNode[];
  className?: string;
}

const EcosystemSliderWithTabs: FC<EcosystemSliderWithTabsProps> = ({
  titleKey,
  tab1Title,
  tab2Title,
  tab1Cards,
  tab2Cards,
  className,
}) => {
  const [value, setValue] = useState("tab1");

  return (
    <div className={classNames(styles.EcosystemSliderWithTabs, className)}>
      <div className={classNames("page-width")}>
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
      </div>

      <Tabs.Root className={styles.TabsRoot} defaultValue="tab1" value={value}>
        <Tabs.List
          className={styles.TabsList}
          aria-label={`${tab1Title} and ${tab2Title}`}
        >
          <Tabs.Trigger
            className={styles.TabsTrigger}
            value="tab1"
            onClick={() => setValue("tab1")}
          >
            {tab1Title}
          </Tabs.Trigger>
          <Tabs.Trigger
            className={styles.TabsTrigger}
            value="tab2"
            onClick={() => setValue("tab2")}
          >
            {tab2Title}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          className={`${styles.TabsContent} hero-tab-content`}
          value="tab1"
        >
          <div className={classNames(styles.MobileCarousel, "d-lg-none")}>
            <CardsSlider items={tab1Cards} />
          </div>

          <div
            className={classNames(styles.DesktopMarquee, "d-none d-lg-block")}
          >
            <Marquee
              pauseOnHover={true}
              play={true}
              speed={100}
              autoFill={true}
            >
              <div className={styles.Cards}>
                {tab1Cards.map((card, index) => (
                  <div key={`card-${index}`} className={styles.CardWrapper}>
                    {card}
                  </div>
                ))}
              </div>
            </Marquee>
          </div>
        </Tabs.Content>

        <Tabs.Content
          className={`${styles.TabsContent} hero-tab-content`}
          value="tab2"
        >
          <div className={classNames(styles.MobileCarousel, "d-lg-none")}>
            <CardsSlider items={tab2Cards} />
          </div>

          <div
            className={classNames(styles.DesktopMarquee, "d-none d-lg-block")}
          >
            <Marquee
              pauseOnHover={true}
              play={true}
              speed={100}
              autoFill={true}
            >
              <div className={styles.Cards}>
                {tab2Cards.map((card, index) => (
                  <div key={`card-${index}`} className={styles.CardWrapper}>
                    {card}
                  </div>
                ))}
              </div>
            </Marquee>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default EcosystemSliderWithTabs;
