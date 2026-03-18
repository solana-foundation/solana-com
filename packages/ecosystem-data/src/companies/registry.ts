import type { CompanyRecord } from "../types";
import aisaLogo from "../../assets/companies/aisa/logo.svg";
import alchemyLogoBlack from "../../assets/companies/alchemy/logo-black.svg";
import alchemyLogoColor from "../../assets/companies/alchemy/logo-color.svg";
import alchemyLogoWhiteBlue from "../../assets/companies/alchemy/logo-white-blue.svg";
import alchemyLogoWhite from "../../assets/companies/alchemy/logo-white.svg";
import alchemyLogomarkWhite from "../../assets/companies/alchemy/logomark-white.svg";
import alchemyLogomark from "../../assets/companies/alchemy/logomark.svg";
import allnodesLogo from "../../assets/companies/allnodes/logo.svg";
import arciumLogo from "../../assets/companies/arcium/logo.svg";
import atxpLogo from "../../assets/companies/atxp/logo.svg";
import bonkLogo from "../../assets/companies/bonk/logo.webp";
import bridgeLogo from "../../assets/companies/bridge/logo.svg";
import bydfiLogo from "../../assets/companies/bydfi/logo.svg";
import byrealLogo from "../../assets/companies/byreal/logo.svg";
import coinbaseLogo from "../../assets/companies/coinbase/logo.svg";
import dabbaLogo from "../../assets/companies/dabba/logo.svg";
import darkresearchLogo from "../../assets/companies/darkresearch/logo.png";
import doublezeroLogo from "../../assets/companies/doublezero/logo.svg";
import fireblocksLogo from "../../assets/companies/fireblocks/logo.png";
import frodobotsLogo from "../../assets/companies/frodobots/logo.svg";
import galaxyLogo from "../../assets/companies/galaxy/logo.svg";
import gradientLogo from "../../assets/companies/gradient/logo.png";
import jitoLogo from "../../assets/companies/jito/logo.svg";
import kastLogo from "../../assets/companies/kast/logo.svg";
import libearaLogo from "../../assets/companies/libeara/logo.svg";
import mantleByrealLogo from "../../assets/companies/mantle-byreal/logo.svg";
import openminedLogo from "../../assets/companies/openmined/logo.png";
import oslLogo from "../../assets/companies/osl/logo.svg";
import phantomLogo from "../../assets/companies/phantom/logo.svg";
import playSolanaLogo from "../../assets/companies/play-solana/logo.svg";
import quicknodeLogo from "../../assets/companies/quicknode/logo.svg";
import safepalWalletLogo from "../../assets/companies/safepal-wallet/logo.svg";
import solanaSpacesLogo from "../../assets/companies/solana-spaces/logo.svg";
import solayerLogo from "../../assets/companies/solayer/logo.svg";
import solflareLogo from "../../assets/companies/solflare/logo.svg";
import spiLogo from "../../assets/companies/spi/logo.svg";
import squadsLogo from "../../assets/companies/squads/logo.svg";
import sunriseLogo from "../../assets/companies/sunrise/logo.svg";
import superteamUsaLogo from "../../assets/companies/superteam-usa/logo.svg";
import switchboardLogo from "../../assets/companies/switchboard/logo.svg";
import tritonLogo from "../../assets/companies/triton/logo.svg";
import veliaNetLogo from "../../assets/companies/velia-net/logo.svg";
import visaLogo from "../../assets/companies/visa/logo.png";

export const companiesById = {
  "aisa": {
  "id": "aisa",
  "slug": "aisa",
  "name": "AIsa",
  "legalName": "AIsa Inc.",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "AIsa",
    "tagLine": "The Unified Resource & Payment Layer for AI Agents",
    "descriptionShort": "AIsa is an AI infrastructure platform that combines a unified resource gateway with usage-based payment infrastructure for AI agents and applications.",
    "descriptionLong": "AIsa provides a unified API layer for AI models, search, financial data, social data, and packaged agent skills, alongside a payments stack built for high-frequency, pay-per-use AI workloads. The platform positions itself as infrastructure for autonomous agents to discover resources, execute micropayments, and settle usage without vendor-specific integrations. The company says it was founded in San Francisco in late 2024, while its LinkedIn page lists the company as founded in 2025.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://aisa.one/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/AIsaOneHQ",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/aipayhq",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.gg/bhjDrRKc",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": aisaLogo
    }
  ]
},
  "alchemy": {
  "id": "alchemy",
  "slug": "alchemy",
  "name": "Alchemy",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Alchemy",
    "tagLine": "Infrastructure that moves billions at scale.",
    "descriptionShort": "Web3 development platform providing blockchain infrastructure, APIs, and developer tools across multiple chains including Solana.",
    "descriptionLong": "Alchemy is a web3 development platform providing blockchain infrastructure, APIs, SDKs, and developer tools. Its Solana offering includes archive data retrieval, gRPC streaming, enhanced RPC endpoints, and staked transaction connections purpose-built for Solana's architecture. The platform also provides embedded wallets, gasless transactions, webhooks, and portfolio APIs across over 100 supported chains.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.alchemy.com/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/Alchemy",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/alchemyinc/",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.gg/9GnAcXQYZ6",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/alchemyplatform",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo-white",
  "logos": [
    {
      "id": "logo-black",
      "fileName": "logo-black.svg",
      "format": "svg",
      "source": alchemyLogoBlack
    },
    {
      "id": "logo-color",
      "fileName": "logo-color.svg",
      "format": "svg",
      "source": alchemyLogoColor
    },
    {
      "id": "logo-white-blue",
      "fileName": "logo-white-blue.svg",
      "format": "svg",
      "source": alchemyLogoWhiteBlue
    },
    {
      "id": "logo-white",
      "fileName": "logo-white.svg",
      "format": "svg",
      "source": alchemyLogoWhite
    },
    {
      "id": "logomark-white",
      "fileName": "logomark-white.svg",
      "format": "svg",
      "source": alchemyLogomarkWhite,
      "kind": "mark"
    },
    {
      "id": "logomark",
      "fileName": "logomark.svg",
      "format": "svg",
      "source": alchemyLogomark,
      "kind": "mark"
    }
  ]
},
  "allnodes": {
  "id": "allnodes",
  "slug": "allnodes",
  "name": "Allnodes",
  "gridProfileSlug": "allnodes",
  "gridProfile": {
    "name": "Allnodes",
    "tagLine": "Non-custodial platform for node hosting and staking across 120+ protocols",
    "descriptionShort": "Allnodes is a non-custodial infrastructure platform that provides node hosting, validator services, and staking for Solana and 120+ other blockchain protocols.",
    "descriptionLong": "Allnodes provides reliable non-custodial node hosting and staking services, allowing users to deploy validators, full nodes, and stake assets across 120+ blockchain protocols. On Solana, Allnodes hosts over 100 nodes including 61 validators with 6.47M SOL staked. The platform also offers bare-metal servers purpose-built for Solana validators, featuring AMD EPYC Turin processors and enterprise-grade hardware.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.allnodes.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/Allnodes",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/allnodes",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/allnodes",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/allnodes",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/allnodes",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": allnodesLogo
    }
  ]
},
  "arcium": {
  "id": "arcium",
  "slug": "arcium",
  "name": "Arcium",
  "gridProfileSlug": "Arcium",
  "gridProfile": {
    "name": "Arcium",
    "tagLine": "Encrypt Everything. Compute Anything.",
    "descriptionShort": "Arcium is a decentralized confidential computing network built on Solana that enables encrypted computations using multi-party computation, fully homomorphic encryption, and zero-knowledge proofs.",
    "descriptionLong": "Arcium provides a parallelized confidential computing network that serves as an encrypted supercomputer for developers and applications across DeFi, AI, healthcare, and beyond. Built natively on Solana, Arcium combines MPC, FHE, and ZKPs through its Multiparty computation eXecution Environments (MXEs) to enable trustless, verifiable encrypted computations at scale. The network introduced the CSPL Confidential Token Standard, allowing any existing Solana token to support encrypted balances and transfer amounts.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://www.arcium.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/ArciumHQ",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/arciumnetwork",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/arcium",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/arcium-hq",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": arciumLogo
    }
  ]
},
  "atxp": {
  "id": "atxp",
  "slug": "atxp",
  "name": "ATXP",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "ATXP",
    "tagLine": "A web-wide protocol for agentic payments",
    "descriptionShort": "ATXP is a protocol built by Circuit & Chisel that enables AI agents to autonomously handle commerce from discovery to payment, with support for Solana-based micropayments.",
    "descriptionLong": "ATXP (developed by Circuit & Chisel) is a web-wide protocol enabling AI agents to manage the full commerce lifecycle — discovery, negotiation, and payment — without human oversight. The protocol supports instant, nested, delegated micropayments between AI agents. Circuit & Chisel raised $19.2 million in seed funding led by Primary Venture Partners and ParaFi Capital, with participation from Stripe, Coinbase Ventures, Solana Ventures, and Samsung Next.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://circuitandchisel.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/atxp_ai",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/circuit-chisel",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/atxp-dev",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": atxpLogo
    }
  ]
},
  "bonk": {
  "id": "bonk",
  "slug": "bonk",
  "name": "BONK",
  "gridProfileSlug": "Bonk",
  "gridProfile": {
    "name": "BONK",
    "tagLine": "The first Solana dog coin for the people, by the people",
    "descriptionShort": "BONK is a community-driven dog-themed memecoin on Solana, governed by BonkDAO, with over 350 on-chain integrations and a deflationary burn mechanism.",
    "descriptionLong": "BONK launched on Christmas Day 2022 via a massive airdrop that distributed 50% of total supply to Solana community members, aiming to revitalize the ecosystem after the FTX collapse. Created by 22 anonymous Solana community builders with no venture capital backing, BONK is governed by BonkDAO and features a deflationary burn mechanism. The project has expanded into memecoin infrastructure through LetsBonk.fun, one of Solana's leading memecoin launchpads.",
    "profileSector": {
      "name": "Community"
    },
    "profileType": {
      "name": "DAO"
    },
    "urls": [
      {
        "url": "https://bonkcoin.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/bonk_inu",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/bonkinu",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/FTfayXdpqH",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/Official_Bonk_Inu",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/BonkLabs",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.webp",
      "format": "webp",
      "source": bonkLogo
    }
  ]
},
  "bridge": {
  "id": "bridge",
  "slug": "bridge",
  "name": "Bridge",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Bridge",
    "tagLine": "Make money move",
    "descriptionShort": "An entirely new payments platform built with stablecoins to simplify global money movement.",
    "descriptionLong": "Bridge provides a fully integrated stablecoin infrastructure platform enabling businesses to receive, store, convert, issue, and spend stablecoins. The platform offers APIs for orchestration, issuance, card programs, wallets, and cross-border payments. By handling regulatory, compliance, and technical complexities, Bridge allows companies to expand globally and move funds faster and cheaper.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.bridge.xyz/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/StableCoin",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/bridge-apis/",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": bridgeLogo
    }
  ]
},
  "bydfi": {
  "id": "bydfi",
  "slug": "bydfi",
  "name": "BYDFi",
  "gridProfileSlug": "bydfi",
  "gridProfile": {
    "name": "BYDFi",
    "tagLine": "BUIDL Your Dream Finance",
    "descriptionShort": "BYDFi is a centralized cryptocurrency exchange supporting trading of 1000+ altcoins and 500+ perpetual contracts, including Solana ecosystem tokens.",
    "descriptionLong": "BYDFi (formerly BitYard) is a centralized cryptocurrency exchange registered in Canada, serving over 1,000,000 users across 190+ countries. The platform offers spot trading, futures trading with up to 200x leverage, leveraged tokens, trading bots, and copy trading. BYDFi supports over 650 cryptocurrencies including Solana ecosystem tokens, and partners with payment providers such as Banxa, Transak, Ramp, and Mercuryo for fiat on-ramps.",
    "profileSector": {
      "name": "Exchange"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.bydfi.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/BYDFi",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/bydfi",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/VJjYhsWegV",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/BYDFiEnglish",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": bydfiLogo
    }
  ]
},
  "byreal": {
  "id": "byreal",
  "slug": "byreal",
  "name": "Byreal",
  "gridProfileSlug": "byreal",
  "gridProfile": {
    "name": "Byreal",
    "tagLine": "The onchain liquidity network for the next wave of assets",
    "descriptionShort": "Byreal is an AI agent-native DEX on Solana incubated by Bybit, combining CEX-grade liquidity with DeFi-native transparency for trading real-world and digital assets.",
    "descriptionLong": "Byreal is a decentralized exchange built on Solana and incubated by Bybit that merges centralized exchange liquidity with decentralized finance transparency. The platform uses RFQ and CLMM routing to deliver low-slippage, MEV-protected trading with zero gas fees and zero price impact. Byreal supports spot swaps, a token launchpad, yield vaults, and perpetual trading, and is designed to serve both human traders and autonomous AI agents.",
    "profileSector": {
      "name": "DeFi"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://www.byreal.io",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/byreal_io",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/Byreal_Community",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": byrealLogo
    }
  ]
},
  "coinbase": {
  "id": "coinbase",
  "slug": "coinbase",
  "name": "Coinbase",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Coinbase",
    "tagLine": "Increase economic freedom in the world",
    "descriptionShort": "Coinbase is a publicly traded cryptocurrency exchange that provides a platform for buying, selling, storing, and managing digital assets including Solana and SPL tokens.",
    "descriptionLong": "Coinbase is one of the largest regulated cryptocurrency exchanges, offering trading, custody, and staking services for a wide range of digital assets. The platform provides full Solana ecosystem support including native DEX trading via Jupiter integration, cbBTC on Solana, and Coinbase Wallet compatibility with SPL tokens and Solana dApps. The company is publicly traded on NASDAQ under ticker COIN.",
    "profileSector": {
      "name": "Exchange"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.coinbase.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/coinbase",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/coinbase",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/coinbase",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": coinbaseLogo
    }
  ]
},
  "dabba": {
  "id": "dabba",
  "slug": "dabba",
  "name": "Dabba",
  "gridProfileSlug": "dabba",
  "gridProfile": {
    "name": "Dabba",
    "tagLine": "Web3 powered WiFi networks, built for emerging markets",
    "descriptionShort": "Dabba Network is a DePIN project on Solana that deploys decentralized WiFi hotspots across India to provide affordable high-speed internet access to underserved communities.",
    "descriptionLong": "Dabba Network operates a decentralized physical infrastructure network (DePIN) on Solana, deploying WiFi hotspots across India through local cable operators. The network is live in over 11,000 locations, with a mission to bring internet access to a billion Indians over the next decade. The platform uses the DBT utility token to reward hotspot owners and network participants, with tokens burned as data is consumed.",
    "profileSector": {
      "name": "DePIN"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://dabba.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/DabbaNetwork",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/wifidabba",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.gg/dabbanetwork",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/DabbaHQ",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/wifidabba",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": dabbaLogo
    }
  ]
},
  "darkresearch": {
  "id": "darkresearch",
  "slug": "darkresearch",
  "name": "Dark Research",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Dark Research",
    "tagLine": "An AI lab for the new internet",
    "descriptionShort": "Dark Research is an applied AI lab building production applications at the intersection of blockchain infrastructure and artificial intelligence, with tools for Solana.",
    "descriptionLong": "Dark Research is a technology company focused on closing the gap between frontier technology and human cognition through production applications. The company operates at the intersection of blockchain infrastructure and artificial intelligence, building tools including Model Context Protocol servers for interacting with the Solana blockchain powered by the Solana Agent Kit.",
    "profileSector": {
      "name": "Developer Tools"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.darkresearch.ai",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/darkresearchai",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/dark-ai",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/darkresearch",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.png",
      "format": "png",
      "source": darkresearchLogo
    }
  ]
},
  "doublezero": {
  "id": "doublezero",
  "slug": "doublezero",
  "name": "DoubleZero",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "DoubleZero",
    "tagLine": "The High-Performance Global Network",
    "descriptionShort": "DoubleZero is a decentralized fiber network providing low-latency connectivity for distributed systems like blockchain networks.",
    "descriptionLong": "DoubleZero Foundation operates a global fiber network designed to deliver high-performance networking infrastructure to blockchains and systems requiring millisecond-level responsiveness. The protocol enables validators to connect to dedicated network links while introducing revenue opportunities through real-time data distribution services.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.doublezero.xyz/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/DoubleZeroXYZ",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": doublezeroLogo
    }
  ]
},
  "fireblocks": {
  "id": "fireblocks",
  "slug": "fireblocks",
  "name": "Fireblocks",
  "gridProfileSlug": "Fireblocks",
  "gridProfile": {
    "name": "Fireblocks",
    "tagLine": "Digital asset and stablecoin infrastructure",
    "descriptionShort": "Fireblocks provides enterprise-grade digital asset infrastructure for securely storing, transferring, and issuing assets on Solana and other blockchains.",
    "descriptionLong": "Fireblocks is an enterprise digital asset infrastructure platform that enables institutions to build blockchain-based products and manage digital asset operations securely. The platform supports native Solana integration including SOL and SPL token custody, decoded program calls, gasless transactions, and tokenization capabilities. Fireblocks processes Solana transactions with sub-50ms broadcast times and sub-$0.01 fees.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.fireblocks.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/FireblocksHQ",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/fireblocks",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/fireblocks",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.png",
      "format": "png",
      "source": fireblocksLogo
    }
  ]
},
  "frodobots": {
  "id": "frodobots",
  "slug": "frodobots",
  "name": "FrodoBots",
  "gridProfileSlug": "FrodoBots",
  "gridProfile": {
    "name": "FrodoBots",
    "tagLine": "Crowdsourcing real-world datasets with robotic gaming",
    "descriptionShort": "FrodoBots is a robotics and blockchain company on Solana that lets users remotely control physical robots in a gaming experience while collecting real-world datasets for embodied AI research.",
    "descriptionLong": "FrodoBots builds at the intersection of crypto and robotics, operating a global fleet of hundreds of sidewalk robots across cities on six continents. Its flagship product, Earth Rovers, is a drive-to-earn scavenger hunt game where players remotely control 4G-enabled rover robots equipped with cameras and sensors. Player actions generate teleoperation datasets used to train embodied AI foundation models.",
    "profileSector": {
      "name": "Robotics"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.frodobots.ai/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/frodobots",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/frodobots-lab",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.gg/5mnCnZX4Pr",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/frodobots-org",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": frodobotsLogo
    }
  ]
},
  "galaxy": {
  "id": "galaxy",
  "slug": "galaxy",
  "name": "Galaxy",
  "gridProfileSlug": "Galaxy_Digital",
  "gridProfile": {
    "name": "Galaxy",
    "tagLine": "Global leader in digital assets and data center infrastructure",
    "descriptionShort": "Galaxy is a publicly traded digital asset and blockchain financial services firm that provides institutional-grade trading, asset management, and infrastructure solutions.",
    "descriptionLong": "Galaxy (TSX: GLXY) is a digital asset and blockchain leader founded by Michael Novogratz, headquartered in New York. The company operates three complementary businesses: Global Markets, Asset Management, and Digital Infrastructure Solutions, serving institutions, startups, and qualified individuals. Galaxy is a major participant in the Solana ecosystem and a significant SOL holder.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.galaxy.com/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/galaxyhq",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/galaxyhq",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/galaxy-digital",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": galaxyLogo
    }
  ]
},
  "gradient": {
  "id": "gradient",
  "slug": "gradient",
  "name": "Gradient Network",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Gradient Network",
    "tagLine": "Building open intelligence collectively",
    "descriptionShort": "Gradient Network is a decentralized AI infrastructure platform on Solana that enables distributed training, serving, and agentic systems through its Open Intelligence Stack.",
    "descriptionLong": "Gradient is an AI R&D lab building the Open Intelligence Stack (OIS), a fully decentralized infrastructure on Solana for distributed AI workloads. The network transforms idle devices into compute nodes via a lightweight Chrome extension called Sentry Node, with over 1.6 million active nodes deployed across 190+ countries. Its core protocols enable AI models to run across distributed devices at scale.",
    "profileSector": {
      "name": "DePIN"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://gradient.network/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/Gradient_HQ",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/gradient-network",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/gradientnetwork",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/Gradient_HQ",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.png",
      "format": "png",
      "source": gradientLogo
    }
  ]
},
  "jito": {
  "id": "jito",
  "slug": "jito",
  "name": "Jito",
  "gridProfileSlug": "jito",
  "gridProfile": {
    "name": "Jito",
    "tagLine": "Non-custodial liquid staking on Solana",
    "descriptionShort": "Jito is the largest DeFi protocol on Solana, providing non-custodial liquid staking with MEV rewards and MEV-optimized validator infrastructure.",
    "descriptionLong": "Jito operates two core products on Solana: a liquid staking protocol that lets users stake any amount of SOL and receive JitoSOL with auto-compounded rewards amplified by MEV extraction, and a MEV infrastructure suite including an open-source validator client and transaction relayer. The Jito Foundation governs the protocol through JTO token holders who shape its development.",
    "profileSector": {
      "name": "Staking"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://www.jito.network/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/jito_sol",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/jito-labs",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.gg/jito",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/jito-foundation",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": jitoLogo
    }
  ]
},
  "kast": {
  "id": "kast",
  "slug": "kast",
  "name": "KAST",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "KAST",
    "tagLine": "Borderless finance for the internet economy.",
    "descriptionShort": "KAST is building a global financial account that lets users hold, move, and spend stablecoins across cards, transfers, and everyday payments.",
    "descriptionLong": "KAST is a fintech platform focused on borderless finance for the internet economy. It offers a stablecoin-powered account experience designed to help users save, send, and spend digitally native money with familiar payment rails such as cards and transfers.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.kast.xyz/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/KASTxyz",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/kastxyz",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/KASTCommunity",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/KASTxyz",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": kastLogo
    }
  ]
},
  "libeara": {
  "id": "libeara",
  "slug": "libeara",
  "name": "Libeara",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Libeara",
    "tagLine": "Investing is more accessible and equitable with tokenised assets.",
    "descriptionShort": "SC Ventures incubated tokenisation platform helping organizations create, issue, and manage real-world assets on-chain.",
    "descriptionLong": "Libeara is a road-tested asset tokenisation platform focused on making markets more accessible, transparent, and secure, with solutions for regulated funds, tokenised government bonds, and other real-world assets.",
    "profileSector": {
      "name": "Tokenization"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://libeara.com/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/libeara_",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/libeara/",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": libearaLogo
    }
  ]
},
  "mantle-byreal": {
  "id": "mantle-byreal",
  "slug": "mantle-byreal",
  "name": "Mantle / Byreal",
  "gridProfileSlug": "mantle_xyz",
  "gridProfile": {
    "name": "Mantle / Byreal",
    "tagLine": "Building the Liquidity Chain of the Future",
    "descriptionShort": "Mantle is an Ethereum Layer 2 network that has expanded to Solana via the Mantle Super Portal and Byreal, a Solana-native decentralized exchange incubated by Bybit.",
    "descriptionLong": "Mantle Network is an Ethereum L2 blockchain focused on capital efficiency through modular architecture and zero-knowledge proofs. In partnership with Bybit and Byreal, Mantle launched the Super Portal, a native cross-chain infrastructure that bridges $MNT tokens between Ethereum and Solana. This integration positions $MNT as a cross-ecosystem asset connecting Ethereum L2 liquidity, Solana DeFi, and centralized exchange infrastructure.",
    "profileSector": {
      "name": "DeFi"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.mantle.xyz/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/0xMantle",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/0xmantle",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/0xMantle",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/mantlenetwork",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/mantlenetworkio",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": mantleByrealLogo
    }
  ]
},
  "openmined": {
  "id": "openmined",
  "slug": "openmined",
  "name": "OpenMined",
  "gridProfileSlug": null,
  "gridProfile": null,
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.png",
      "format": "png",
      "source": openminedLogo
    }
  ]
},
  "osl": {
  "id": "osl",
  "slug": "osl",
  "name": "OSL",
  "gridProfileSlug": "osl",
  "gridProfile": {
    "name": "OSL",
    "tagLine": "Built for simple crypto trading.",
    "descriptionShort": "Licensed digital asset exchange providing secure trading, fiat deposits, and custody services.",
    "descriptionLong": "OSL offers regulated trading, OTC services, custody, trading APIs, tokenization, and payment infrastructure for individuals and institutions, backed by global compliance coverage.",
    "profileSector": {
      "name": "Exchange"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.osl.com/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://twitter.com/OSLdotcom",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://hk.linkedin.com/company/osldotcom/",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/oslglobal",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/osl_community",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": oslLogo
    }
  ]
},
  "phantom": {
  "id": "phantom",
  "slug": "phantom",
  "name": "Phantom",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Phantom",
    "tagLine": "The crypto app for everyone",
    "descriptionShort": "Phantom is a self-custodial multi-chain crypto wallet originally built for Solana, supporting token management, swaps, NFTs, and dApp interactions.",
    "descriptionLong": "Phantom is a leading self-custodial crypto wallet that originated on Solana and has expanded to support Ethereum, Bitcoin, Base, and Sui. It provides a unified interface for buying, storing, sending, swapping tokens, and managing NFTs across supported chains. Phantom is available as a browser extension for Chrome, Brave, and Firefox, as well as native mobile apps on iOS and Android.",
    "profileSector": {
      "name": "Wallet"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://phantom.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/phantom",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/phantomwallet",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.gg/phantom",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/phantom",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": phantomLogo
    }
  ]
},
  "play-solana": {
  "id": "play-solana",
  "slug": "play-solana",
  "name": "Play Solana",
  "gridProfileSlug": "playsolana",
  "gridProfile": {
    "name": "Play Solana",
    "tagLine": "Your gateway to the Web3 gaming revolution",
    "descriptionShort": "Play Solana is a Web3 gaming ecosystem on Solana that combines a handheld gaming console, a token economy, and a curated game library.",
    "descriptionLong": "Play Solana builds the gaming layer for Solana, uniting hardware, software, and cultural IP within a connected network called the Play Solana SuperHUB. Its flagship product, the PSG1, is the first handheld Web3 gaming device built on Solana, featuring a built-in hardware wallet for managing tokens, NFTs, and rewards. The ecosystem includes a curated gaming library, the $PLAYSOLANA token for staking and in-game economies, and identity NFT collections.",
    "profileSector": {
      "name": "Gaming"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.playsolana.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/playsolana",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/play-solana",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/playsolanaofficial",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/playsolanaofficial",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/playsolana",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": playSolanaLogo
    }
  ]
},
  "quicknode": {
  "id": "quicknode",
  "slug": "quicknode",
  "name": "Quicknode",
  "gridProfileSlug": "quicknode",
  "gridProfile": {
    "name": "QuickNode",
    "tagLine": "Build, scale, and ship without compromise",
    "descriptionShort": "QuickNode provides high-performance RPC endpoints and developer tooling for building and scaling applications on Solana and other blockchains.",
    "descriptionLong": "QuickNode is a multi-chain blockchain infrastructure platform that provides dedicated RPC endpoints, WebSocket subscriptions, and developer tools for production applications. On Solana, QuickNode serves over 50% of Solana projects with sub-100ms response times and 99.99% uptime. The platform offers Solana-specific add-ons including Jito bundles, Metaplex DAS for NFT data, Priority Fee API, and Jupiter swap routing.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.quicknode.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/QuickNode",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/quicknode",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/quicknode",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/quiknode-labs",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": quicknodeLogo
    }
  ]
},
  "safepal-wallet": {
  "id": "safepal-wallet",
  "slug": "safepal-wallet",
  "name": "Safepal wallet",
  "gridProfileSlug": "safepal",
  "gridProfile": {
    "name": "SafePal",
    "tagLine": "The best wallet to protect your assets",
    "descriptionShort": "SafePal is a hardware and software crypto wallet suite supporting Solana and 100+ blockchains, offering air-gapped cold storage and integrated DeFi access.",
    "descriptionLong": "SafePal is a non-custodial crypto wallet ecosystem backed by Binance and Animoca Brands, serving over 10 million users globally. The company offers hardware wallets (S1 air-gapped and X1 Bluetooth), a mobile app, and a browser extension supporting Solana, Ethereum, Bitcoin, and 100+ other blockchains. SafePal provides native Solana DeFi hub features including buying, swapping, trading, and staking SOL and SPL tokens.",
    "profileSector": {
      "name": "Wallet"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.safepal.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/iSafePal",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/safepal",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/SafePalwallet",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/SafePalWallet",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": safepalWalletLogo
    }
  ]
},
  "solana-spaces": {
  "id": "solana-spaces",
  "slug": "solana-spaces",
  "name": "Solana Spaces",
  "gridProfileSlug": "solanaspaces",
  "gridProfile": {
    "name": "Solana Spaces",
    "tagLine": "Activating e-commerce and global IRL stores for Solana and its ecosystem",
    "descriptionShort": "Solana Spaces provides end-to-end events, merchandise, and community activations for the Solana ecosystem, operating pop-up retail stores at crypto conferences.",
    "descriptionLong": "Solana Spaces operates physical retail experiences and pop-up stores for the Solana ecosystem, offering branded apparel, hardware wallets, phones, gaming gear, and DePIN devices. Originally launched in 2022 with a flagship store in New York's Hudson Yards, the venture was revived as a pop-up model at crypto conferences. Solana Spaces partners with ecosystem teams to sell merchandise, turning community relationships into real-world cultural moments.",
    "profileSector": {
      "name": "Community"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://solanaspaces.com/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/solanaspaces",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/solana-spaces",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": solanaSpacesLogo
    }
  ]
},
  "solayer": {
  "id": "solayer",
  "slug": "solayer",
  "name": "Solayer",
  "gridProfileSlug": "Solayer",
  "gridProfile": {
    "name": "Solayer",
    "tagLine": "Hardware-accelerated SVM",
    "descriptionShort": "Solayer is Solana's native restaking protocol, enabling SOL holders to extend the utility of their staked assets to secure additional services and protocols within the ecosystem.",
    "descriptionLong": "Solayer is the first native restaking and liquid restaking protocol on Solana, allowing SOL holders to restake their assets to secure Actively Validated Services (AVSs) such as oracles and bridges. Users receive sSOL in exchange for their staked SOL, earning additional yield while improving the security and reliability of ecosystem services. Solayer also offers sUSD, a yield-bearing stablecoin backed by US Treasury Bonds, and is building InfiniSVM, a hardware-accelerated SVM blockchain.",
    "profileSector": {
      "name": "Restaking"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://solayer.org/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/solayer_labs",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/solayer-labs",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/solayerlabs",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/solayer_discussion",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/solayer-labs",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": solayerLogo
    }
  ]
},
  "solflare": {
  "id": "solflare",
  "slug": "solflare",
  "name": "Solflare",
  "gridProfileSlug": "Solflare",
  "gridProfile": {
    "name": "Solflare",
    "tagLine": "The Solana Wallet",
    "descriptionShort": "Solflare is a self-custody wallet for the Solana ecosystem, enabling users to buy, store, stake, swap tokens, and manage NFTs across web, browser extension, and mobile platforms.",
    "descriptionLong": "Solflare is a non-custodial wallet built for Solana, available as a web wallet, Chrome extension, and mobile app on iOS and Android. It supports buying, storing, staking, and swapping tokens as well as managing NFTs. Solflare integrates with hardware wallets like Ledger and Keystone for offline key management and features a built-in privacy layer with Private Send functionality.",
    "profileSector": {
      "name": "Wallet"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.solflare.com/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/solflare_wallet",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/solflare-official",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/solflare",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/solflare-wallet",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": solflareLogo
    }
  ]
},
  "spi": {
  "id": "spi",
  "slug": "spi",
  "name": "Solana Policy Institute",
  "gridProfileSlug": "solanapolicyinstitute",
  "gridProfile": {
    "name": "Solana Policy Institute",
    "tagLine": "Educating policymakers on how decentralized networks are the future of the digital economy",
    "descriptionShort": "The Solana Policy Institute is a non-partisan, not-for-profit organization that educates policymakers on decentralized networks and advocates for legal clarity for the Solana ecosystem.",
    "descriptionLong": "The Solana Policy Institute is a non-partisan, not-for-profit organization focused on educating policymakers about how decentralized networks like Solana are transforming the digital economy. The institute serves as a liaison between policymakers and the Solana ecosystem, advocating for legislation and regulation that supports industry growth in the United States.",
    "profileSector": {
      "name": "Policy"
    },
    "profileType": {
      "name": "Community"
    },
    "urls": [
      {
        "url": "https://www.solanapolicyinstitute.org/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/SolanaInstitute",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/solana-policy-institute",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": spiLogo
    }
  ]
},
  "squads": {
  "id": "squads",
  "slug": "squads",
  "name": "Squads",
  "gridProfileSlug": "Squads",
  "gridProfile": {
    "name": "Squads",
    "tagLine": "Finance Without Legacy Constraints",
    "descriptionShort": "Squads is the multisig standard on Solana, providing smart account infrastructure for teams, DAOs, and businesses to securely manage on-chain assets with shared ownership and permissions.",
    "descriptionLong": "Squads is the industry-standard multisig platform on Solana, built on the formally verified Squads Protocol. Teams can deploy a multisig in a few clicks, configuring time locks, spending limits, roles, sub-accounts, and custom access controls. Major Solana projects including Helium, Jito, Pyth, Drift, and Orca rely on Squads for on-chain operations.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://squads.xyz/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/SquadsProtocol",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/squads-labs",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/Squads-Protocol",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": squadsLogo
    }
  ]
},
  "sunrise": {
  "id": "sunrise",
  "slug": "sunrise",
  "name": "Sunrise",
  "gridProfileSlug": "sunrise",
  "gridProfile": {
    "name": "Sunrise",
    "tagLine": "Strengthen Solana and offset carbon emissions simultaneously",
    "descriptionShort": "Sunrise Stake is a regenerative finance protocol on Solana that lets users stake SOL and automatically donate staking yield to carbon offset programs.",
    "descriptionLong": "Sunrise Stake is a non-custodial, permissionless smart contract on Solana that directs staking yield toward retiring carbon tokens and supporting climate-positive projects. Users stake SOL and receive gSOL (green SOL), a wrapped token representing their stake, which can be used across the Solana ecosystem. The protocol is volunteer-driven, charges no fees, and donates 100% of staking rewards to carbon offset initiatives.",
    "profileSector": {
      "name": "Staking"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://www.sunrisestake.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/sunrisestake",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/sunrisestake",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/dhhAddB6AJ",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/sunrise-stake",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": sunriseLogo
    }
  ]
},
  "superteam-usa": {
  "id": "superteam-usa",
  "slug": "superteam-usa",
  "name": "Solana Superteam USA",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Superteam USA",
    "tagLine": "The talent layer of Solana in the United States.",
    "descriptionShort": "US chapter of the Superteam community connecting founders, developers, creatives, and operators building on Solana.",
    "descriptionLong": "Superteam USA is the United States chapter of Superteam, a Solana talent community focused on helping builders learn, earn, and ship. It supports founders and contributors through community programming, ecosystem connections, and events tied to the broader Solana network.",
    "profileSector": {
      "name": "Community"
    },
    "profileType": {
      "name": "Community"
    },
    "urls": [
      {
        "url": "https://superteam.fun/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/SuperteamUSA",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": superteamUsaLogo
    }
  ]
},
  "switchboard": {
  "id": "switchboard",
  "slug": "switchboard",
  "name": "Switchboard",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Switchboard",
    "tagLine": "The Everything Oracle",
    "descriptionShort": "Switchboard is a permissionless, multi-chain oracle protocol on Solana that provides customizable data feeds, verifiable randomness, and off-chain compute for smart contracts.",
    "descriptionLong": "Switchboard is a decentralized, community-curated oracle network that brings real-world data on-chain across 10+ blockchains including Solana, Arbitrum, Aptos, and Sui. It serves as the data provider for prominent DeFi projects such as Kamino, Jito, MarginFi, and Drift. The protocol delivers price feeds at sub-100ms latency through its Surge oracle network.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://switchboard.xyz",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/switchboardxyz",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/switchboardxyz",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/sNeGymrabT",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://telegram.me/switchboardxyz",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/switchboard-xyz",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": switchboardLogo
    }
  ]
},
  "triton": {
  "id": "triton",
  "slug": "triton",
  "name": "Triton",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Triton",
    "tagLine": "Ship fast. Scale ambitiously. Never settle for downtime.",
    "descriptionShort": "Triton One is a high-performance RPC infrastructure provider for Solana, offering enterprise-grade node services with full historical data access and advanced APIs.",
    "descriptionLong": "Triton One operates a large-scale Solana RPC deployment with 100 nodes across public and private pools, handling hundreds of millions of requests daily. The platform provides complete compatibility with Solana JSON-RPC and WebSocket APIs across Mainnet, Testnet, and Devnet, with full blockchain history back to genesis. Triton also offers advanced tools including the Digital Assets API (DAS) for querying NFTs and tokens, plus Project Yellowstone components like Dragon's Mouth for gRPC streaming.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://triton.one",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/triton_one",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/triton-one",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/+zxGloe4vMZUzZmVl",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/rpcpool",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": tritonLogo
    }
  ]
},
  "velia-net": {
  "id": "velia-net",
  "slug": "velia-net",
  "name": "velia.net",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "velia.net",
    "tagLine": "Bare Metal Server Power — Reliable Server Hosting",
    "descriptionShort": "Enterprise dedicated server and bare metal hosting provider with over 20 years of industry experience.",
    "descriptionLong": "velia.net supplies single-tenant bare metal infrastructure and computing services to enterprises across gaming, AI/ML, ecommerce, payment processing, and Web3 sectors. Operating globally from six data centers with a 4.2 TBit/s backbone and DDoS protection, the company serves approximately 5,000+ clients and maintains ISO 27001 and SOC 1 Type II certifications.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.velia.net/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/velianet",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/velia-net",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": veliaNetLogo
    }
  ]
},
  "visa": {
  "id": "visa",
  "slug": "visa",
  "name": "Visa",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Visa",
    "tagLine": "A world leader in digital payments",
    "descriptionShort": "Visa has expanded its stablecoin settlement capabilities to the Solana blockchain, using USDC for cross-border payments between participating banks.",
    "descriptionLong": "Visa is a global payments network facilitating transactions across more than 200 countries and territories. The company expanded its stablecoin settlement pilot to Solana, leveraging the blockchain's high throughput and low transaction fees for USDC-based cross-border bank settlements. Visa chose Solana for its sub-cent transaction fees, 400ms slot times, and global validator network.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://visa.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/Visa",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/visa",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/visa",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.png",
      "format": "png",
      "source": visaLogo
    }
  ]
}
} satisfies Record<string, CompanyRecord>;

export type CompanyId = keyof typeof companiesById;

export const companies = Object.values(companiesById);

export const companiesBySlug = Object.fromEntries(
  companies.map((company) => [company.slug, company]),
) as Record<string, CompanyRecord>;

export function getCompany(id: string) {
  return companiesById[id as CompanyId];
}

export function getCompanyBySlug(slug: string) {
  return companiesBySlug[slug];
}
