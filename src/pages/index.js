import Layout from "@/components/solutions/layout";
import { Trans, useTranslation } from "next-i18next";
import HTMLHead from "@/components/HTMLHead";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Hero from "@/components/home/Hero";
import BasicCallout from "@/components/solutions/BasicCallout";
import Stats from "@/components/home/Stats";
import JoinCommunity from "@/components/home/JoinCommunity";
import Companies from "@/components/home/Companies";
import DeveloperResources from "@/components/solutions/DeveloperResources";
import { AnimatedText, GradientText } from "@/components/shared/Text";
import { Carousel, Card } from "@/components/home/CardsSlider";
import Solutions from "@/components/home/Solutions";

import styles from "./HomePage.module.scss";

export default function Home() {
  const { t } = useTranslation();

  const statsContent = t("home.stats", {
    returnObjects: true,
  });

  const joinCommunityLinks = [
    {
      text: t("home.join-community.links.x"),
      url: "https://x.com/solana",
    },
    {
      text: t("home.join-community.links.youtube"),
      url: "https://www.youtube.com/channel/UC9AdQPUe4BdVJ8M9X7wxHUA",
    },
    {
      text: t("home.join-community.links.linkedin"),
      url: "https://www.linkedin.com/company/solana-foundation/",
    },
    {
      text: t("home.join-community.links.community-groups"),
      url: "/community",
    },
  ];

  const cardsData = [
    {
      title: t("home.new.cards.firedancer.title"),
      text1: t("home.new.cards.firedancer.text-1"),
      text2: t("home.new.cards.firedancer.text-2"),
      src: "/src/img/home/new-firedancer.svg",
      url: "https://jumpcrypto.com/firedancer/",
    },
    {
      title: t("home.new.cards.recap.title"),
      text1: t("home.new.cards.recap.text-1"),
      text2: t("home.new.cards.recap.text-2"),
      src: "/src/img/home/new-recap.svg",
      url: "https://solana.com/news/state-of-solana-breakpoint-2024",
    },
    {
      title: t("home.new.cards.ticket-sale.title"),
      text1: t("home.new.cards.ticket-sale.text-1"),
      src: "/src/img/home/new-ticket-sale.png",
      url: "/breakpoint/tickets",
    },
    {
      title: <Trans i18nKey="home.new.cards.hacker-house.title" />,
      text1: t("home.new.cards.hacker-house.text-1"),
      src: "/src/img/home/new-hacker-house.svg",
      url: "https://lu.ma/hong-kong-hh-2024",
    },
    {
      title: t("home.new.cards.blinks.title"),
      text1: t("home.new.cards.blinks.text-1"),
      text2: t("home.new.cards.blinks.text-2"),
      src: "/src/img/home/new-blinks.png",
      url: "https://solana.com/solutions/actions",
    },
  ];

  const cards = cardsData.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <Layout>
      <HTMLHead
        title={t("home.meta.title")}
        description={t("home.meta.description")}
      />
      <div id="home-page" className={styles.PageWrapper}>
        <Hero />

        <div className={styles.Callout2}>
          <AnimatedText element="h2" as="heading">
            <GradientText gradient="linear-gradient(85.62deg, #9945ff -2.51%, #14f195 92.16%)">
              {t("home.callout-2.title")}
            </GradientText>
          </AnimatedText>

          <AnimatedText element="p" as="paragraph">
            {t("home.callout-2.subtitle")}
          </AnimatedText>
        </div>

        <Solutions />

        <Companies />

        <BasicCallout
          titleContent={
            <Trans
              i18nKey="home.callout-1.title"
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(90deg, #64A8F2 0%, #9945FF 49.61%, #EB54BC 100%);" />
                ),
                kernout: <span className={styles.KernOut} />,
              }}
            />
          }
          subtitleKey={t("home.callout-1.subtitle")}
          className={styles.Callout1}
        />

        <Stats stats={statsContent} />

        <Carousel titleKey="home.new.title" items={cards} />

        <DeveloperResources
          title={t("home.developer-resources.title")}
          subtitle={t("home.developer-resources.subtitle")}
          buttonText={t("home.developer-resources.btn")}
          buttonUrl="/docs/intro/quick-start"
          image="/src/img/home/developer-resources.svg"
          className={styles.DeveloperResources}
          imageClassName={styles.DeveloperResourcesImage}
        />

        <JoinCommunity
          title={t("home.join-community.title")}
          links={joinCommunityLinks}
        />
      </div>
    </Layout>
  );
}

export const getStaticProps = async ({ locale }) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};
