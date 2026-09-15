"use client";

import Link from "next/link";
import { useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@workspace/ui";
import styles from "./request-for-startups.module.scss";

type Request = {
  slug: string;
  category: string;
  title: string;
  thesis: string;
  description: string;
  whyNow: string;
  whySolana: string;
  prompts: string[];
  accent: "violet" | "green" | "pink" | "blue" | "orange";
};

const REQUESTS: Request[] = [
  {
    slug: "wallet-that-knows-you",
    category: "Consumer",
    title: "The wallet that knows you",
    thesis: "Make the first onchain experience feel like a favorite app.",
    description:
      "A personal financial home that understands context, protects the user, and makes every payment, credential, collectible, and community membership feel native - not technical.",
    whyNow:
      "Wallets have become capable, but they still ask people to think like infrastructure operators. The next wave needs an interface that feels personal from the first tap.",
    whySolana:
      "Low fees, fast confirmation, mobile tooling, and a shared account layer make rich everyday interactions practical at consumer scale.",
    prompts: [
      "Design for the person, not the public key.",
      "Make sending money as easy as sending a message.",
      "Let trust be earned through useful, private signals.",
    ],
    accent: "violet",
  },
  {
    slug: "global-checkout",
    category: "Commerce",
    title: "A global checkout, finally",
    thesis: "Let anyone sell to anyone, anywhere, in seconds.",
    description:
      "Build the invisible payment layer for internet commerce: stablecoin-native, instantly settled, and crafted for merchants who have never needed to think about a blockchain.",
    whyNow:
      "Stablecoin supply and payment demand are growing, while global settlement still runs on slow, fragmented systems built for another era.",
    whySolana:
      "High throughput, near-instant settlement, token extensions, and deep stablecoin liquidity can support checkout without exposing crypto complexity.",
    prompts: [
      "Start with a checkout people choose because it is better.",
      "Give merchants simple money movement and real-time reconciliation.",
      "Treat borders, currencies, and fees as implementation details.",
    ],
    accent: "green",
  },
  {
    slug: "business-of-being-a-fan",
    category: "Creators",
    title: "The business of being a fan",
    thesis: "Turn audience participation into durable creative economies.",
    description:
      "Fans already create value around the people and worlds they love. Build tools that let communities collect, contribute, trade access, and share in the upside - with taste.",
    whyNow:
      "Creators have global audiences but rent the relationship from platforms. Fans want participation that means more than another subscription tier.",
    whySolana:
      "Programmable assets and inexpensive interactions can make membership, collecting, and contribution part of the product - not a separate marketplace.",
    prompts: [
      "Build for fandom, not financialization.",
      "Make ownership feel like belonging.",
      "Create recurring reasons to participate.",
    ],
    accent: "pink",
  },
  {
    slug: "agents-with-agency",
    category: "AI",
    title: "Agents with agency",
    thesis: "Give autonomous software a fast, programmable economy.",
    description:
      "As agents begin to browse, buy, create, and coordinate, they need identity, permissions, and payments that work at machine speed while remaining legible to the humans they serve.",
    whyNow:
      "Software can increasingly act on a person’s behalf, but the web still lacks a native way for agents to hold permissions and exchange small amounts of value.",
    whySolana:
      "Fast execution and low transaction costs let agents coordinate and pay in real time, while programmable accounts can keep humans in control.",
    prompts: [
      "Make an agent’s limits clear and controllable.",
      "Create tiny, useful transactions - not a token wrapper.",
      "Design for accountability from the first interaction.",
    ],
    accent: "blue",
  },
  {
    slug: "proof-without-paperwork",
    category: "Infrastructure",
    title: "Proof without paperwork",
    thesis: "Make trust portable, private, and useful in the real world.",
    description:
      "A person should be able to prove what matters - age, membership, reputation, qualifications - without handing over a life story. Build the rails that make that possible.",
    whyNow:
      "Digital identity is becoming more important just as people are losing control of where their personal data travels and how long it stays there.",
    whySolana:
      "Composable programs and inexpensive verification can turn private credentials into reusable building blocks across many applications.",
    prompts: [
      "Ask for the least information needed.",
      "Make credentials usable across products.",
      "Give people the power to revoke access.",
    ],
    accent: "orange",
  },
];

function VideoPlaceholder({ request }: { request: Request }) {
  return (
    <div className={`${styles.video} ${styles[`video${request.accent}`]}`}>
      <div className={styles.videoTopline}>
        <span>YouTube premiere</span>
        <span>Coming soon</span>
      </div>
      <div className={styles.play} aria-hidden="true">
        <span />
      </div>
      <div className={styles.videoCaption}>
        <span>Ecosystem voice to be announced</span>
        <span>{request.category}</span>
      </div>
    </div>
  );
}

export function RequestForStartupsPage() {
  const handleRequestChange = useCallback((value: string) => {
    if (!value) return;

    window.requestAnimationFrame(() => {
      const request = document.getElementById(`request-item-${value}`);
      const headerHeight = document
        .querySelector("header")
        ?.getBoundingClientRect().height;

      if (!request) return;

      window.scrollTo({
        top: Math.max(
          0,
          request.getBoundingClientRect().top +
            window.scrollY -
            (headerHeight ?? 0) -
            24,
        ),
        behavior: "auto",
      });
    });
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.signalField} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className={styles.heroMeta}>
          <span>Solana / Requests for startups</span>
          <span>For the curious and the committed</span>
        </div>
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.kicker}>Worth building</p>
            <h1>
              <span>What would</span>
              <span>
                you build <em>now?</em>
              </span>
            </h1>
          </div>
          <div className={styles.heroAside}>
            <p>
              The next great company could begin with a question. Here are the
              questions we want the next generation of Solana builders to
              answer.
            </p>
            <a href="#requests" className={styles.textLink}>
              Explore the requests <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className={styles.manifesto}>
          <span>Build what matters.</span>
          <span>Build on Solana.</span>
          <span className={styles.manifestoMark}>✦</span>
        </div>
      </section>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>The starting point</p>
        <div className={styles.introCopy}>
          <p>
            We asked people shaping the ecosystem one question: what should
            exist that Solana makes possible now?
          </p>
          <p>
            These requests are points of view, not prescriptions. Take one,
            challenge it, and make something only you would make.
          </p>
        </div>
      </section>

      <Accordion
        id="requests"
        className={styles.requests}
        aria-label="Startup requests"
        type="single"
        defaultValue={REQUESTS[0].slug}
        collapsible
        onValueChange={handleRequestChange}
      >
        <div className={styles.indexHeader}>
          <span>Ideas worth building</span>
          <span>Focus</span>
          <span>Interview</span>
        </div>
        {REQUESTS.map((request) => (
          <AccordionItem
            className={styles.request}
            id={`request-item-${request.slug}`}
            key={request.slug}
            value={request.slug}
          >
            <AccordionTrigger
              className={styles.requestTrigger}
              aria-controls={`request-${request.slug}`}
            >
              <span className={styles.requestTitle}>{request.title}</span>
              <span className={styles.category}>{request.category}</span>
              <span className={styles.interviewStatus}>Coming soon</span>
              <span className={styles.toggle} aria-hidden="true">
                +
              </span>
            </AccordionTrigger>
            <AccordionContent
              id={`request-${request.slug}`}
              className={styles.requestDetail}
            >
              <div className={styles.detailInner}>
                <div className={styles.brief}>
                  <div className={styles.copy}>
                    <p className={styles.detailLabel}>The opportunity</p>
                    <p className={styles.thesis}>{request.thesis}</p>
                    <p>{request.description}</p>
                  </div>
                  <dl className={styles.context}>
                    <div>
                      <dt>Why now</dt>
                      <dd>{request.whyNow}</dd>
                    </div>
                    <div>
                      <dt>Why Solana</dt>
                      <dd>{request.whySolana}</dd>
                    </div>
                  </dl>
                  <div className={styles.startingPoints}>
                    <p className={styles.detailLabel}>Starting points</p>
                    <ul>
                      {request.prompts.map((prompt) => (
                        <li key={prompt}>{prompt}</li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className={styles.briefLink}
                  >
                    <Link href="/developers">
                      Build from this request <span aria-hidden="true">↗</span>
                    </Link>
                  </Button>
                </div>
                <VideoPlaceholder request={request} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <section id="build" className={styles.build}>
        <p className={styles.eyebrow}>Your turn</p>
        <div>
          <h2>
            Start where the <em>request ends.</em>
          </h2>
          <p>
            Bring an idea to life with the people, tools, and capital that can
            help it move. The build challenge is coming next.
          </p>
          <Button asChild className={styles.cta}>
            <Link href="/developers">
              Start building <span aria-hidden="true">↗</span>
            </Link>
          </Button>
        </div>
        <div className={styles.buildMark} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </section>
    </main>
  );
}
