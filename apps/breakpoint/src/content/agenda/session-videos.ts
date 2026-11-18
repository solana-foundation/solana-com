/**
 * YouTube recordings of Breakpoint 2026 sessions, keyed by the session's
 * Airtable record id (`AgendaItem.id`).
 *
 * The agenda's "Full Session - YouTube" column in Airtable takes precedence
 * when it holds a link, so the events team can add or correct a recording
 * without a deploy. This map covers sessions whose column is still empty.
 */
export const SESSION_VIDEO_IDS: Record<string, string> = {
  // Welcome to Breakpoint 2026
  rec9W1l5bhcmxpus5: "Hi41dED39O0",
  // Stablecoins Have an Alignment Problem
  recXsFPzw0eBI4wrx: "xZ32Ue4gA7c",
  // MoneyGram Ramps: Connecting Digital Assets With Cash
  rec6eiE62Pe5N2zjA: "J9XUxfSZNXE",
  // Zelle Goes Global
  recc9Al0v7BLWGXjz: "-1Hi3KdfY28",
  // Every Stablecoin Needs a Way Out
  rec5IlrguyqYi1ycZ: "3UO7iN7CsV4",
  // Why Should I Use Your Stablecoin?
  rec5aa6H9Dcvh4SOU: "9KWb6arzYAM",
  // The Future of Money Is Choice
  recLO8Gxk1bTXSJXC: "IcyrIekMDXA",
  // The Sleeping Power of the World's Other Stablecoins
  recoMl5mMRBueh7Mt: "E9yeX_DD8tA",
  // Bringing Africa's 41 Currencies Onchain
  recUv74PRbuSICN3l: "njNntH5VzKY",
  // Bank to the Future: How SoFi Is Preparing for the Digital Assets Era
  reckPifkHp4wtgdfM: "gGH1B1kzGm4",
  // When Banks Become Plugins
  recHsrnRNKC3FmGX7: "OaHerxMgIN4",
  // Cloudflare Is Making It Rain Micropayments
  rec9HeTegShuYUYKt: "QwOdGRuCF_o",
  // Unlocking the $200T Private Markets Opportunity
  reccJSHAzmeshHDPh: "tkjhJwRlX_k",
  // Fractions to Tokens: Real Estate Is Going Onchain
  rec4e8AZ2i0ZmH1nd: "8Trkm8mab1M",
  // Ledger Agent Intent, Ledger Atom & One More Thing
  reccfLGMjyd75CZ1X: "WVpFX6BoVek",
  // London Calling: The City's Pitch for Building Here
  recQhQbDM1BhT1ma3: "Aw85LUTobRM",
  // Fireside: ICE Europe
  recazG58NSGoaA7sI: "G5GKmIU_wVQ",
  // Debate: Crypto Is Key to the UK's Economic Future
  recCoxyafB3fphlRt: "SoizamnNuH4",
  // Onchain Fund Distribution at Scale
  recosgQeyxwHHauEs: "EWakMfVLggY",
  // If You Build It, Will Flows Come?
  rectyDaKlXTT5ycwu: "5bGr8CstKzc",
  // Why RWAs Need DeFi (and Vice Versa)
  recyvp2Dt1fV1b3kU: "JJY0DC06ulk",
  // The Oldest Market in the World Is Coming Onchain
  recanHsU7jYdHp9ux: "aMpQ4kLl1gQ",
  // The Next Generation of Market Infrastructure
  recVzZaxbNwYDRbJx: "SyhgkFviQe8",
  // Rewiring the Market: Why the World's Biggest Financial Institutions Are Moving Onchain
  recuewGA1IJsuoNuR: "06TA2Ep2pP8",
  // Thinking in Trillions: Graticule Onchain Asset Management
  recbyB1P7ux1lAN73: "ZX7jmBpLfB4",
  // Hard Assets, Big Stories: Gold, Copper & Crude Oil
  recA2WBD7C8OjnLDY: "XFjes4pyX54",
  // From Idle Collateral to Active Capital: TradFi Meets Solana
  recE0YhWQLlfM73F9: "nK8Sc1waR6E",
  // Leverage Without Liquidations: Options Onchain
  recyYUxxttHvX6FEY: "CBW_9R5ObeM",
  // The Capital Market Wars
  recLpPX1EjImyT2YA: "VndQnW4oJx4",
  // Okay, Traders. Now, Let's Get in Formation
  recmf36FFFCm3Oy79: "-B5EKikET9k",
  // The Post-Tokenization Era
  recjLVJ6SKTDf54SH: "V-Xax4_EI6w",
  // Backpack: The Era of the Neobrokerage
  recrXKdgSqTM97sIm: "zHA5e-2alfE",
  // Why We Went Onchain on Day 1
  rec6PscRbHT5koeIi: "2aKysb1WW6E",
  // The City Goes Onchain: From Closing Bell to Always On
  recMMsoetHgrOYypP: "bKFoANXMe-o",
  // Evading Kim Jong Un's Bot Army: A How To
  recpGqpkfeDL6tezE: "qC45-gL7Ego",
  // Defending Markets Against Machines
  rec6z2eejEAu3ie6L: "VggwC1S_jiM",
  // Growing Turkiye's Fintech Ecosystem
  recJKIQVFYYiceaOS: "goZFF02boc0",
  // The Former White House Crypto Chief on the Future of Digital Assets
  recmx45FQn4Lrq2WW: "y3Egxejl5XQ",
};

const YOUTUBE_ID = /^[\w-]{11}$/;

/** The video id from a YouTube watch, share, live, shorts or embed URL. */
export function parseYouTubeVideoId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  if (YOUTUBE_ID.test(text)) return text;

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return undefined;
  }
  const host = url.hostname.replace(/^(www|m)\./, "");
  let id: string | null | undefined;
  if (host === "youtu.be") {
    id = url.pathname.split("/")[1];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : url.pathname.match(/^\/(?:live|embed|shorts)\/([^/]+)/)?.[1];
  }
  return id && YOUTUBE_ID.test(id) ? id : undefined;
}

export function youTubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
