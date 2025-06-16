import React from "react";
import Image from "next/image";
import Link from "next/link";
import { serverTranslation } from "@/i18n/translation";

const featuredPosts = [
  {
    id: 1,
    title: "What is a Crypto Wallet?",
    description:
      "Learn what a wallet is, why you need one, and how it works as your gateway to Web3.",
    icon: "https://placehold.co/40x40/9945FF/FFFFFF?text=W",
  },
  {
    id: 2,
    title: "Getting Your First SOL",
    description:
      "Discover how to acquire SOL tokens to start exploring the Solana ecosystem.",
    icon: "https://placehold.co/40x40/14F195/000000?text=S",
  },
  {
    id: 3,
    title: "Your First Solana Transaction",
    description:
      "Step-by-step guide to sending and receiving tokens on Solana safely.",
    icon: "https://placehold.co/40x40/FF623A/FFFFFF?text=T",
  },
];

const tutorials = [
  {
    id: 1,
    title: "Setting Up Your Phantom Wallet",
    description:
      "Create your first wallet and secure it properly with recovery phrases.",
    image: "https://placehold.co/400x400/9945FF/FFFFFF?text=Wallet",
  },
  {
    id: 2,
    title: "Understanding NFTs",
    description:
      "What are NFTs, how to buy them, and how to spot legitimate projects.",
    image: "https://placehold.co/400x400/14F195/000000?text=NFT",
  },
  {
    id: 3,
    title: "Staying Safe in Web3",
    description:
      "Essential security tips to protect your assets from scams and hacks.",
    image: "https://placehold.co/400x400/FF623A/FFFFFF?text=Security",
  },
  {
    id: 4,
    title: "Introduction to Stablecoins",
    description:
      "Learn about USDC and other stablecoins for safer crypto transactions.",
    image: "https://placehold.co/400x400/80ECFF/000000?text=USDC",
  },
  {
    id: 5,
    title: "Making Your First Payment",
    description:
      "How to pay for goods and services using Solana Pay and crypto.",
    image: "https://placehold.co/400x400/9945FF/FFFFFF?text=Pay",
  },
  {
    id: 6,
    title: "Exploring DeFi Basics",
    description:
      "Simple introduction to earning yield and swapping tokens safely.",
    image: "https://placehold.co/400x400/14F195/000000?text=DeFi",
  },
  {
    id: 7,
    title: "Using Jupiter for Token Swaps",
    description:
      "How to exchange one token for another using Jupiter aggregator.",
    image: "https://placehold.co/400x400/FF623A/FFFFFF?text=Swap",
  },
  {
    id: 8,
    title: "Understanding Transaction Fees",
    description:
      "Learn about Solana's low fees and how to manage transaction costs.",
    image: "https://placehold.co/400x400/80ECFF/000000?text=Fees",
  },
  {
    id: 9,
    title: "Connecting to dApps Safely",
    description:
      "How to connect your wallet to applications and verify legitimacy.",
    image: "https://placehold.co/400x400/9945FF/FFFFFF?text=dApps",
  },
  {
    id: 10,
    title: "Your Web3 Journey Continues",
    description: "Next steps and resources to deepen your Solana knowledge.",
    image: "https://placehold.co/400x400/14F195/000000?text=Next",
  },
];

import { redirect } from "next/navigation";
import { get } from "@vercel/edge-config";

type Props = { params: Promise<{ locale: string }> };

export default async function LearnV2Page(props: Props) {
  const { locale } = await props.params;

  const learnV2Enabled =
    process.env.LOCAL_LEARN_V2 === "true" || (await get("learn-v2"));

  if (!learnV2Enabled) {
    redirect("/learn");
  }

  const { t } = await serverTranslation(locale, ["common"]);

  return (
    <>
      <section
        className="relative min-h-[480px] flex items-center justify-center overflow-hidden mb-8"
        aria-label="Introduction"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://placehold.co/1920x600/9945FF/FFFFFF?text=Learn+Solana"
            alt=""
            role="presentation"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40"
            aria-hidden="true"
          />
        </div>
        <div className="container relative z-10">
          <div className="text-center py-5 px-4 md:px-8">
            <h1 className="h1 mb-4 text-white">{t("learn.hero.title")}</h1>
            <p className="text-xl text-white/90 mb-4">
              {t("learn.hero.subtitle")}
            </p>
            <nav
              aria-label={t("learn.hero.nav-aria-label")}
              className="flex gap-4 justify-center"
            >
              <Link
                href="#tutorials"
                className="text-white hover:text-white/80 underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded px-1"
                aria-label={t("learn.hero.start-learning-aria-label")}
              >
                {t("learn.hero.start-learning")}
              </Link>
              <span className="text-white/60" aria-hidden="true">
                •
              </span>
              <Link
                href="/docs"
                className="text-white hover:text-white/80 underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 rounded px-1"
                aria-label={t("learn.hero.build-aria-label")}
              >
                {t("learn.hero.build")}
              </Link>
            </nav>
          </div>
        </div>
      </section>

      <section
        id="featured"
        className="py-16 md:py-20"
        aria-label={t("learn.featured.aria-label")}
      >
        <div className="container">
          <h2 className="h3 mb-4">{t("learn.featured.title")}</h2>
          <div className="row g-4" role="list">
            {featuredPosts.map((post) => (
              <div
                key={post.id}
                className="col-12 col-md-6 col-lg-4"
                role="listitem"
              >
                <Link
                  href={`/learn/${post.id}`}
                  className="no-underline d-block h-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 rounded-2xl"
                  aria-label={`${post.title}: ${post.description}`}
                >
                  <article className="h-full bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative">
                    <div className="p-6 d-flex flex-column h-100">
                      <div className="flex-grow-1">
                        <h3 className="text-xl font-bold mb-3 text-gray-900">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {post.description}
                        </p>
                      </div>
                      <div className="text-right mt-4">
                        <span
                          className="text-sm text-purple-600 hover:text-purple-700"
                          aria-hidden="true"
                        >
                          {t("learn.featured.learn-more")} →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="tutorials"
        className="py-16 md:py-20 bg-light"
        aria-label={t("learn.tutorials.aria-label")}
      >
        <div className="container">
          <h2 className="h3 mb-4 text-dark">{t("learn.tutorials.title")}</h2>
          <p className="text-muted mb-5 col-lg-8">
            {t("learn.tutorials.subtitle")}
          </p>
          <ol className="row g-4 list-unstyled" role="list">
            {tutorials.map((tutorial) => (
              <li
                key={tutorial.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                role="listitem"
              >
                <Link
                  href={`/learn/tutorial/${tutorial.id}`}
                  className="no-underline focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 rounded-2xl d-block"
                  aria-label={t("learn.tutorials.tutorial-aria-label", {
                    id: tutorial.id,
                    title: tutorial.title,
                    description: tutorial.description,
                  })}
                >
                  <article className="h-full bg-white rounded-2xl shadow-sm overflow-visible transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative group">
                    <div
                      className="absolute -top-2 -left-2 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10 shadow-md transition-transform duration-300 group-hover:scale-110"
                      aria-hidden="true"
                    >
                      {tutorial.id}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        <span className="sr-only">
                          {t("learn.tutorials.step", { id: tutorial.id })}:{" "}
                        </span>
                        {tutorial.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {tutorial.description}
                      </p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
