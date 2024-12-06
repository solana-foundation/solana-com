import { useState, ReactNode } from "react";
import Image from "next/image";
import classNames from "classnames";
import * as Tabs from "@radix-ui/react-tabs";
import Lottie from "react-lottie";

import { OpacityInText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "@/components/solutions/LottieHeroWithTabs.module.scss";

interface LottieHeroWithTabsProps {
  tabs: {
    buttonTitle: string;
    content: {
      title: string;
      subtitle: string;
      lottieMobile: ReactNode;
      lottieDesktop: ReactNode;
    };
  };
  tabListAriaLabel: string;
  className?: string;
}

const LottieHeroWithTabs = ({
  tabs,
  tabListAriaLabel,
  className,
}: LottieHeroWithTabsProps) => {
  const [value, setValue] = useState("tab1");

  return (
    <>
      <Tabs.Root
        className={classNames(styles.TabsRoot, className)}
        defaultValue="tab1"
        value={value}
      >
        <Tabs.Content value="tab1">
          <div className={styles.GradientBgWrapper}>
            <Image
              src="/solutions/payments/payments-with-mobile-gradient.svg"
              className={classNames(styles.GradientBg, "d-lg-none")}
              priority
              fill
              alt="Gradient background"
            />
            <Image
              src="/solutions/payments/payments-with-desktop-gradient.svg"
              className={classNames(styles.GradientBg, "d-none d-lg-block")}
              priority
              fill
              alt="Gradient background"
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="tab2">
          <div className={styles.GradientBgWrapper}>
            <Image
              src="/solutions/payments/payments-without-mobile-gradient.svg"
              className={classNames(styles.GradientBg, "d-lg-none")}
              priority
              fill
              alt="Gradient background"
            />
            <Image
              src="/solutions/payments/payments-without-desktop-gradient.svg"
              className={classNames(styles.GradientBg, "d-none d-lg-block")}
              priority
              fill
              alt="Gradient background"
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="tab1">
          <OpacityInText
            element="h1"
            as="heading"
            className={classNames(styles.Title)}
          >
            {tabs[0].content.title}
          </OpacityInText>

          <OpacityInText
            element="p"
            as="paragraph"
            className={classNames(styles.Subtitle)}
          >
            {tabs[0].content.subtitle}
          </OpacityInText>
        </Tabs.Content>

        <Tabs.Content value="tab2">
          <OpacityInText element="h1" className={classNames(styles.Title)}>
            {tabs[1].content.title}
          </OpacityInText>
          <OpacityInText
            element="p"
            as="paragraph"
            className={classNames(styles.Subtitle)}
          >
            {tabs[1].content.subtitle}
          </OpacityInText>
        </Tabs.Content>

        <MotionSlideIn>
          <Tabs.List className={styles.TabsList} aria-label={tabListAriaLabel}>
            <Tabs.Trigger
              className={styles.TabsTrigger}
              value="tab1"
              onClick={() => setValue("tab1")}
            >
              {tabs[0].buttonTitle}
            </Tabs.Trigger>
            <Tabs.Trigger
              className={styles.TabsTrigger}
              value="tab2"
              onClick={() => setValue("tab2")}
            >
              {tabs[1].buttonTitle}
            </Tabs.Trigger>
          </Tabs.List>
        </MotionSlideIn>

        <Tabs.Content
          className={`${styles.TabsContent} hero-tab-content`}
          value="tab1"
        >
          <MotionSlideIn>
            <div className={classNames(styles.LottieWrapper, "d-lg-none")}>
              <Lottie
                options={{
                  animationData: tabs[0].content.lottieMobile,
                  loop: true,
                  autoplay: true,
                }}
                isClickToPauseDisabled={true}
              />
            </div>
            <div
              className={classNames(styles.LottieWrapper, "d-none d-lg-block")}
            >
              <Lottie
                options={{
                  animationData: tabs[0].content.lottieDesktop,
                  loop: true,
                  autoplay: true,
                }}
                isClickToPauseDisabled={true}
              />
            </div>
          </MotionSlideIn>
        </Tabs.Content>

        <Tabs.Content
          className={`${styles.TabsContent} hero-tab-content`}
          value="tab2"
        >
          <MotionSlideIn>
            <div className={classNames(styles.LottieWrapper, "d-lg-none")}>
              <Lottie
                options={{
                  animationData: tabs[1].content.lottieMobile,
                  autoplay: true,
                }}
                isClickToPauseDisabled={true}
              />
            </div>
            <div
              className={classNames(styles.LottieWrapper, "d-none d-lg-block")}
            >
              <Lottie
                options={{
                  animationData: tabs[1].content.lottieDesktop,
                  loop: true,
                  autoplay: true,
                }}
                isClickToPauseDisabled={true}
              />
            </div>
          </MotionSlideIn>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default LottieHeroWithTabs;
