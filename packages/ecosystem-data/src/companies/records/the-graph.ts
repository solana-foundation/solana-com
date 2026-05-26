import type { CompanyRecord } from "../../types";
import theGraphLogoDark from "../../../assets/companies/the-graph/logo-dark.svg";
import theGraphLogoLight from "../../../assets/companies/the-graph/logo-light.svg";

export const theGraph = {
  id: "the-graph",
  slug: "the-graph",
  name: "The Graph",
  profile: {
    tagline:
      "The open-source protocol for indexing and querying blockchain data",
    summary:
      "The Graph is a decentralized protocol for indexing and querying data from blockchains, enabling developers to build and publish open APIs called subgraphs.",
    description:
      "The Graph is a decentralized indexing protocol that organizes blockchain data and makes it easily accessible via GraphQL APIs called subgraphs. It supports querying data across multiple networks including Ethereum, Solana, and many other chains. The protocol is powered by a decentralized network of Indexers, Curators, and Delegators who stake GRT tokens to ensure reliable data serving. The Graph has become critical web3 infrastructure, with thousands of subgraphs deployed by developers building decentralized applications.",
    sector: "Infrastructure",
    type: "Protocol",
    links: {
      website: "https://thegraph.com/",
    },
    socials: {
      x: "https://x.com/graphprotocol",
      linkedin: "https://www.linkedin.com/company/thegraph/",
      github: "https://github.com/graphprotocol",
      discord: "https://discord.gg/graphprotocol",
      telegram: "https://t.me/GraphProtocol",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: theGraphLogoDark,
      theme: "light",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: theGraphLogoLight,
      theme: "dark",
    },
  ],
} satisfies CompanyRecord;
