"use client";

import { useTranslations } from "next-intl";
import { VideoPlayerModal } from "@/component-library/video-modal";
import { Hero } from "@/components/sdp/hero";
import { Logos } from "@/component-library/logos";
import { DecorGrid } from "@/components/sdp/decor-grid";
import { Advantages } from "@/components/sdp/advantages";
import { AiAdvantages } from "@/components/sdp/ai-advantages";
import { CardGrid } from "@/components/sdp/card-grid";
import { Infrastructure } from "@/components/sdp/infrastructure";
import { Ecosystem } from "@/components/sdp/ecosystem";
import { Tutorials } from "@/components/sdp/tutorials";
// import { News } from "@/components/sdp/news";
import { Podcasts } from "@/components/sdp/podcasts";
import Join from "@/components/sdp/join";
import Header from "@/components/sdp/header";
import { Footer } from "@/components/sdp/footer";
import Bank from "@@/public/src/img/icons/Bank.inline.svg";
import Nodes from "@@/public/src/img/icons/Nodes.inline.svg";
import Law from "@@/public/src/img/icons/Law.inline.svg";
import Sort from "@@/public/src/img/icons/Sort.inline.svg";
import Dollar from "@@/public/src/img/icons/Dollar.inline.svg";
import Steps from "@@/public/src/img/icons/Steps.inline.svg";
import Switch from "@@/public/src/img/icons/Switch.inline.svg";
import {
  COMPLIANCE_LOGOS,
  INST_LOGOS,
  LOGOS,
  // NEWS,
  NODES_LOGOS,
  PODCASTS,
  RAMP_LOGOS,
  TUTORIALS,
} from "@/data/solutions/sdp";

export function SdpPage() {
  const t = useTranslations("sdp");

  return (
    <div className="bg-[#0C0C0E]">
      <Header
        navLinks={[
          { label: t("header.nav.platform"), href: "#platform" },
          { label: t("header.nav.useCases"), href: "#use-cases" },
          { label: t("header.nav.partners"), href: "#partners" },
          { label: t("header.nav.sandbox"), href: "#sandbox" },
          // { label: t("header.nav.media"), href: "#media" },
        ]}
        ctaLabel={t("header.cta")}
        ctaHref="https://platform.solana.com"
      />
      <Hero
        title={t("hero.title")}
        description={t("hero.description")}
        primaryCta={t("hero.primaryCta")}
        primaryCtaHref="https://platform.solana.com"
        videoLabel={t("hero.videoLabel")}
      />
      <Logos
        className="py-8"
        itemClassName="!mr-8 xl:!mr-[72px]"
        speed={97}
        fadeColor="transparent"
        logos={LOGOS}
      />
      <DecorGrid />
      <section id="platform" className="scroll-mt-[72px]">
        <Advantages
          title={t("advantages.title")}
          items={[
            t("advantages.items.0"),
            t("advantages.items.1"),
            t("advantages.items.2"),
          ]}
          visualSrc="/src/img/solutions/sdp/advantages-visual.svg"
          visualBgSrc="/src/img/solutions/sdp/advantages-visual-bg.jpg"
        />
      </section>
      <DecorGrid />
      <section id="use-cases" className="scroll-mt-[72px]">
        <CardGrid
          title={t("cardGrid.title")}
          columns={[
            {
              num: "1",
              img: "/src/img/solutions/sdp/feat-1.svg",
              bg: "/src/img/solutions/sdp/feat-bg-1.jpg",
              heading: t("cardGrid.columns.0.heading"),
              body: t("cardGrid.columns.0.body"),
            },
            {
              num: "2",
              img: "/src/img/solutions/sdp/feat-2.svg",
              bg: "/src/img/solutions/sdp/feat-bg-2.jpg",
              heading: t("cardGrid.columns.1.heading"),
              body: t("cardGrid.columns.1.body"),
            },
            {
              num: "3",
              img: "/src/img/solutions/sdp/feat-3.svg",
              bg: "/src/img/solutions/sdp/feat-bg-3.jpg",
              heading: t("cardGrid.columns.2.heading"),
              headingBadge: t("cardGrid.columns.2.headingBadge"),
              body: t("cardGrid.columns.2.body"),
            },
          ]}
        />
      </section>
      <DecorGrid />
      <Infrastructure
        title={t("infrastructure.title")}
        description={t("infrastructure.description")}
        testimonialQuote={t("infrastructure.testimonialQuote")}
        testimonialName={t("infrastructure.testimonialName")}
        testimonialRole={t("infrastructure.testimonialRole")}
        checklistItems={[
          { label: t("infrastructure.checklist.0"), Icon: Dollar },
          { label: t("infrastructure.checklist.1"), Icon: Switch },
          {
            label: t("infrastructure.checklist.2"),
            badge: t("infrastructure.soonBadge"),
            Icon: Steps,
          },
        ]}
      />
      <DecorGrid />
      <section id="partners" className="scroll-mt-[72px]">
        <Ecosystem
          title={t("ecosystem.title")}
          description={t("ecosystem.description")}
          partnersTitle={t("ecosystem.partnersTitle")}
          partnersSubtitle={t("ecosystem.partnersSubtitle")}
          institutions={[
            {
              logoSrc: "/src/img/logos-eco/mastercard.svg",
              logoAlt: "Mastercard",
              name: t("ecosystem.institutions.0.name"),
              description: t("ecosystem.institutions.0.description"),
            },
            {
              logoSrc: "/src/img/logos-eco/worldpay.svg",
              logoAlt: "Worldpay",
              name: t("ecosystem.institutions.1.name"),
              description: t("ecosystem.institutions.1.description"),
            },
            {
              logoSrc: "/src/img/logos-eco/western-union.v2.svg",
              logoAlt: "Western Union",
              name: t("ecosystem.institutions.2.name"),
              description: t("ecosystem.institutions.2.description"),
            },
          ]}
          categories={[
            {
              id: "node-rpc",
              Icon: Nodes,
              label: t("ecosystem.categories.0"),
              logos: NODES_LOGOS,
            },
            {
              id: "institutional-custody",
              Icon: Bank,
              label: t("ecosystem.categories.1"),
              logos: INST_LOGOS,
            },
            {
              id: "compliance",
              Icon: Law,
              label: t("ecosystem.categories.2"),
              logos: COMPLIANCE_LOGOS,
            },
            {
              id: "on-off-ramps",
              Icon: Sort,
              label: t("ecosystem.categories.3"),
              logos: RAMP_LOGOS,
            },
          ]}
        />
      </section>
      <DecorGrid />
      <AiAdvantages
        title={t("aiAdvantages.title")}
        description={t("aiAdvantages.description")}
        items={[
          t("aiAdvantages.items.0"),
          t("aiAdvantages.items.1"),
          t("aiAdvantages.items.2"),
        ]}
        prompts={[
          t("aiAdvantages.prompts.0"),
          t("aiAdvantages.prompts.1"),
          t("aiAdvantages.prompts.2"),
          t("aiAdvantages.prompts.3"),
          t("aiAdvantages.prompts.4"),
          t("aiAdvantages.prompts.5"),
        ]}
      />
      <DecorGrid />
      <section id="sandbox" className="scroll-mt-[72px]">
        <Tutorials title={t("tutorials.title")} items={TUTORIALS} />
      </section>
      <DecorGrid />
      {/* <section id="media" className="scroll-mt-[72px]">
        <News title={t("news.title")} items={NEWS} />
      </section>
      <DecorGrid /> */}
      <Podcasts title={t("podcasts.title")} items={PODCASTS} />
      <DecorGrid />
      <Join
        title={t("join.title")}
        ctaLabel={t("join.cta")}
        ctaHref="https://platform.solana.com"
      />
      <DecorGrid />
      <Footer
        navColumns={[
          {
            title: t("footer.product.title"),
            links: [
              { label: t("footer.product.apiDocs"), href: "/docs/rpc" },
              { label: t("footer.product.postman"), href: "#" },
              { label: t("footer.product.aiSkills"), href: "#" },
            ],
          },
          {
            title: t("footer.getConnected.title"),
            links: [
              { label: t("footer.getConnected.blog"), href: "/news" },
              { label: t("footer.getConnected.podcasts"), href: "/podcasts" },
              {
                label: t("footer.getConnected.newsletter"),
                href: "/newsletter",
              },
            ],
          },
          {
            title: t("footer.legal.title"),
            links: [
              { label: t("footer.legal.disclaimer"), href: "/tos" },
              {
                label: t("footer.legal.privacyPolicy"),
                href: "/privacy-policy",
              },
            ],
          },
        ]}
      />

      <VideoPlayerModal />
    </div>
  );
}
