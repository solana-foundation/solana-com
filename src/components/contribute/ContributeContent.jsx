import { useEffect, useRef, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import Button from "@/components/solutions/Button";
import { MotionSlideIn } from "@/components/shared/Motions";
import { AnimatedText } from "@/components/shared/Text";

import styles from "./ContributeContent.module.scss";

const ContributeContent = ({ tabs }) => {
  const container = useRef(null);
  const [value, setValue] = useState("tab1");
  let tabsContent = useRef(null);
  const { t } = useTranslation();

  useGSAP(
    () => {
      if (tabsContent.current) {
        const activeTab = tabsContent.current.find(
          (tab) => tab.getAttribute("data-state") === "active",
        );
        gsap.fromTo(
          activeTab,
          {
            autoAlpha: 0,
            y: 100,
          },
          {
            autoAlpha: 1,
            y: 0,
            overwrite: true,
          },
        );
      }
    },
    { scope: container, dependencies: [value] },
  );

  useEffect(() => {
    tabsContent.current = gsap.utils.toArray(".hero-tab-content");
  }, []);

  return (
    <>
      <Tabs.Root
        ref={container}
        className={styles.TabsRoot}
        defaultValue="tab1"
        value={value}
      >
        <Tabs.List
          className={styles.TabsList}
          aria-label={t("contribute.tabs-list-aria-label")}
        >
          <Tabs.Trigger
            className={styles.TabsTrigger}
            value="tab1"
            onClick={() => setValue("tab1")}
          >
            {t("contribute.tabs.0.trigger")}
          </Tabs.Trigger>
          <Tabs.Trigger
            className={styles.TabsTrigger}
            value="tab2"
            onClick={() => setValue("tab2")}
          >
            {t("contribute.tabs.1.trigger")}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          className={`${styles.TabsContent} hero-tab-content`}
          value="tab1"
        >
          <section className={styles.TabCallout}>
            <div className={styles.CalloutContainer}>
              <div className={styles.TextWrapper}>
                <AnimatedText element="h2" as="heading">
                  {tabs[0].callout.title}
                </AnimatedText>
                <AnimatedText element="p">{tabs[0].callout.text}</AnimatedText>
                <MotionSlideIn>
                  <Button
                    text={tabs[0].callout.button}
                    url="https://github.com/solana-foundation/solana-com/blob/main/CONTRIBUTING.md"
                    target="_blank"
                  />
                </MotionSlideIn>
              </div>

              <div className={styles.MediaWrapper}>
                <Image
                  src="/src/img/contribute/tab-1.svg"
                  alt={tabs[0].callout.title}
                  fill
                />
              </div>
            </div>
          </section>

          <section className={styles.TabsDetails}>
            <div className={styles.DetailsContainer}>
              {tabs[0].details.map((detail, i) => (
                <div className={styles.Detail} key={i}>
                  <MotionSlideIn>
                    <h5>{detail.title}</h5>
                    <p>{detail.text}</p>
                  </MotionSlideIn>
                </div>
              ))}
            </div>
          </section>
        </Tabs.Content>

        <Tabs.Content
          className={`${styles.TabsContent} hero-tab-content`}
          value="tab2"
        >
          <section className={styles.TabCallout}>
            <div className={styles.CalloutContainer}>
              <div className={styles.TextWrapper}>
                <AnimatedText element="h2" as="heading">
                  {tabs[1].callout.title}
                </AnimatedText>
                <AnimatedText element="p">{tabs[1].callout.text}</AnimatedText>
                <MotionSlideIn>
                  <Button
                    text={tabs[1].callout.button}
                    url="https://solanafoundation.typeform.com/to/JDtGdIoy"
                    target="_blank"
                  />
                </MotionSlideIn>
              </div>

              <div className={styles.MediaWrapper}>
                <Image
                  src="/src/img/contribute/tab-2.png"
                  alt={tabs[1].callout.title}
                  fill
                />
              </div>
            </div>
          </section>

          <section className={styles.TabsDetails}>
            <div className={styles.DetailsContainer}>
              {tabs[1].details.map((detail, i) => (
                <div className={styles.Detail} key={i}>
                  <MotionSlideIn>
                    <h5>{detail.title}</h5>
                    <p>{detail.text}</p>
                  </MotionSlideIn>
                </div>
              ))}
            </div>
          </section>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default ContributeContent;
