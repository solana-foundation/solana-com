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
import { News } from "@/components/sdp/news";
import { Podcasts } from "@/components/sdp/podcasts";
import Join from "@/components/sdp/join";
import Header from "@/components/sdp/header";
import { Footer } from "@/components/sdp/footer";

export async function SdpPage() {
  return (
    <div className="bg-[#0C0C0E]">
      <Header />
      <Hero />
      <Logos
        className="py-8"
        itemClassName="!mr-8 xl:!mr-[72px]"
        speed={80}
        fadeColor="#0C0C0E"
        logos={[
          {
            src: "/src/img/logos-eco/bridge.svg",
            alt: "Bridge",
            height: "28px",
          },
          {
            src: "/src/img/logos-eco/modern-treasury.svg",
            alt: "Modern Treasury",
            height: "16px",
          },
          { src: "/src/img/logos-eco/bvnk.svg", alt: "BVNK", height: "16px" },
          {
            src: "/src/img/logos-eco/lightspark.svg",
            alt: "Lightspark",
            height: "24px",
          },
          {
            src: "/src/img/logos-eco/moonpay.svg",
            alt: "MoonPay",
            height: "22px",
          },
          {
            src: "/src/img/logos-eco/range.svg",
            alt: "Range",
            height: "15px",
          },
          {
            src: "/src/img/logos-eco/chainalysis.svg",
            alt: "Chainalysis",
            height: "22px",
          },
          {
            src: "/src/img/logos-eco/elliptic.svg",
            alt: "Elliptic",
            height: "16px",
          },
          { src: "/src/img/logos-eco/trm.svg", alt: "TRM", height: "22px" },
          {
            src: "/src/img/logos-eco/paxos.svg",
            alt: "Paxos",
            height: "30px",
          },
          {
            src: "/src/img/logos-eco/bitgo.svg",
            alt: "BitGo",
            height: "24px",
          },
          {
            src: "/src/img/logos-eco/coinbase.svg",
            alt: "Coinbase",
            height: "22px",
          },
          {
            src: "/src/img/logos-eco/privy.svg",
            alt: "Privy",
            height: "18px",
          },
          { src: "/src/img/logos-eco/para.svg", alt: "Para", height: "18px" },
          {
            src: "/src/img/logos-eco/crossmint.svg",
            alt: "Crossmint",
            height: "32px",
          },
          {
            src: "/src/img/logos-eco/turnkey.svg",
            alt: "Turnkey",
            height: "20px",
          },
          { src: "/src/img/logos-eco/dfns.svg", alt: "Dfns", height: "24px" },
          {
            src: "/src/img/logos-eco/anchorage-digital.svg",
            alt: "Anchorage Digital",
            height: "30px",
          },
          {
            src: "/src/img/logos-eco/dynamic.svg",
            alt: "Dynamic",
            height: "28px",
          },
          {
            src: "/src/img/logos-eco/fireblocks.svg",
            alt: "Fireblocks",
            height: "22px",
          },
          {
            src: "/src/img/logos-eco/quicknode.svg",
            alt: "QuickNode",
            height: "18px",
          },
          {
            src: "/src/img/logos-eco/alchemy.svg",
            alt: "Alchemy",
            height: "24px",
          },
          {
            src: "/src/img/logos-eco/triton.svg",
            alt: "Triton",
            height: "24px",
          },
          {
            src: "/src/img/logos-eco/helius.svg",
            alt: "Helius",
            height: "22px",
          },
        ]}
      />
      <DecorGrid />
      <Advantages
        title="Build and launch financial products in weeks, not months."
        items={[
          "Accelerate time to market",
          "Built for AI",
          "Designed for institutions",
        ]}
        visualSrc="/src/img/solutions/sdp/advantages-visual.svg"
        visualBgSrc="/src/img/solutions/sdp/advantages-visual-bg.jpg"
      />
      <DecorGrid />
      <CardGrid />
      <DecorGrid />
      <Infrastructure />
      <DecorGrid />
      <Ecosystem />
      <DecorGrid />
      <AiAdvantages
        title="Build with the AI tools you already use"
        description="SDP works out of the box with AI coding tools like Claude Code by Anthropic and Codex by OpenAI, so your team can build faster with the tools they already know."
        items={[
          "Fully API driven",
          "Skills for AI agents",
          "AI-ready API documentation",
        ]}
      />
      <DecorGrid />
      <Tutorials />
      <DecorGrid />
      <News />
      <DecorGrid />
      <Podcasts />
      <DecorGrid />
      <Join />
      <DecorGrid />
      <Footer />

      <VideoPlayerModal />
    </div>
  );
}
