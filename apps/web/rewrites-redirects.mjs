import {
  MEDIA_APP_URL,
  DOCS_APP_URL,
  TEMPLATES_APP_URL,
  ACCELERATE_APP_URL,
} from "./apps-urls";
import { locales } from "@workspace/i18n/config";

const LOCALE_REGEX = locales.join("|");

/**
 * Generates both bare-path and locale-prefixed versions of each redirect.
 * - For internal destinations: `:locale` param is prepended to both source and destination
 * - For external destinations (http/https): `:locale` param is only prepended to source
 * - All generated redirects use `locale: false` for explicit path control
 */
function withLocaleRedirects(redirects) {
  return redirects.flatMap(({ source, destination, ...rest }) => {
    const isExternalDest =
      destination.startsWith("https://") || destination.startsWith("http://");

    const localeDestination = isExternalDest
      ? destination
      : destination.startsWith("/")
        ? `/:locale${destination}`
        : `/:locale/${destination}`;

    return [
      // Bare path (e.g. /brand → /branding)
      { source, destination, locale: false, ...rest },
      // Locale-prefixed (e.g. /:locale/brand → /:locale/branding)
      {
        source: `/:locale(${LOCALE_REGEX})${source}`,
        destination: localeDestination,
        locale: false,
        ...rest,
      },
    ];
  });
}

export default {
  rewrites: {
    beforeFiles: [
      {
        source: "/breakpoint",
        destination: "https://solana-com-breakpoint.vercel.app/breakpoint",
        locale: false,
      },
      // everything underneath
      {
        source: "/breakpoint/:path*",
        destination:
          "https://solana-com-breakpoint.vercel.app/breakpoint/:path*",
        locale: false,
      },
      // Breakpoint app – locale-prefixed (so local pages can be removed)
      {
        source: "/:locale/breakpoint",
        destination:
          "https://solana-com-breakpoint.vercel.app/:locale/breakpoint",
        locale: false,
      },
      {
        source: "/:locale/breakpoint/:path*",
        destination:
          "https://solana-com-breakpoint.vercel.app/:locale/breakpoint/:path*",
        locale: false,
      },
      // Media app rewrites - new routes
      {
        source: "/admin",
        destination: `${MEDIA_APP_URL}/admin`,
        locale: false,
      },
      {
        source: "/news",
        destination: `${MEDIA_APP_URL}/news`,
        locale: false,
      },
      {
        source: "/news/:path*",
        destination: `${MEDIA_APP_URL}/news/:path*`,
        locale: false,
      },
      {
        source: "/podcasts",
        destination: `${MEDIA_APP_URL}/podcasts`,
        locale: false,
      },
      {
        source: "/podcasts/:path*",
        destination: `${MEDIA_APP_URL}/podcasts/:path*`,
        locale: false,
      },
      {
        source: "/:locale/news",
        destination: `${MEDIA_APP_URL}/:locale/news`,
        locale: false,
      },
      {
        source: "/:locale/news/:path*",
        destination: `${MEDIA_APP_URL}/:locale/news/:path*`,
        locale: false,
      },
      {
        source: "/:locale/podcasts",
        destination: `${MEDIA_APP_URL}/:locale/podcasts`,
        locale: false,
      },
      {
        source: "/:locale/podcasts/:path*",
        destination: `${MEDIA_APP_URL}/:locale/podcasts/:path*`,
        locale: false,
      },
      {
        source: "/api/posts/:path*",
        destination: `${MEDIA_APP_URL}/api/posts/:path*`,
        locale: false,
      },
      {
        source: "/api/links/:path*",
        destination: `${MEDIA_APP_URL}/api/links/:path*`,
        locale: false,
      },
      // Media app assets (required for static assets with assetPrefix: "/media-assets")
      {
        source: "/media-assets/uploads/:path+",
        destination: `${MEDIA_APP_URL}/media-assets/uploads/:path+`,
        locale: false,
      },
      {
        source: "/media-assets/:path+",
        destination: `${MEDIA_APP_URL}/media-assets/:path+`,
        locale: false,
      },
      {
        source: "/uploads/builder/:path+",
        destination: `${MEDIA_APP_URL}/media-assets/uploads/builder/:path+`,
        locale: false,
      },
      // Templates app assets (required for static assets with assetPrefix: "/templates-assets")
      {
        source: "/templates-assets/:path+",
        destination: `${TEMPLATES_APP_URL}/templates-assets/:path+`,
        locale: false,
      },
      // Accelerate app rewrites
      {
        source: "/accelerate",
        destination: `${ACCELERATE_APP_URL}/accelerate`,
        locale: false,
      },
      {
        source: "/accelerate/:path*",
        destination: `${ACCELERATE_APP_URL}/accelerate/:path*`,
        locale: false,
      },
      {
        source: "/:locale/accelerate",
        destination: `${ACCELERATE_APP_URL}/:locale/accelerate`,
        locale: false,
      },
      {
        source: "/:locale/accelerate/:path*",
        destination: `${ACCELERATE_APP_URL}/:locale/accelerate/:path*`,
        locale: false,
      },
      {
        source: "/accelerate-assets/:path+",
        destination: `${ACCELERATE_APP_URL}/accelerate-assets/:path+`,
        locale: false,
      },
      // Accelerate app Next.js optimizer/static (_next/*) paths
      {
        source: "/accelerate-assets/_next/:path+",
        destination: `${ACCELERATE_APP_URL}/_next/:path+`,
        locale: false,
      },
      // Templates app rewrites (must come before general /developers rewrites)
      {
        source: "/developers/templates",
        destination: `${TEMPLATES_APP_URL}/developers/templates`,
        locale: false,
      },
      {
        source: "/developers/templates/:path*",
        destination: `${TEMPLATES_APP_URL}/developers/templates/:path*`,
        locale: false,
      },
      // Accelerate app assets (required for static assets with assetPrefix: "/accelerate-assets")
      {
        source: "/accelerate-assets/images/:path+",
        destination: `${ACCELERATE_APP_URL}/images/:path+`,
        locale: false,
      },
      {
        source: "/accelerate-assets/:path+",
        destination: `${ACCELERATE_APP_URL}/accelerate-assets/:path+`,
        locale: false,
      },
      // Docs app assets (required for static assets with assetPrefix: "/docs-assets")
      {
        source: "/docs-assets/:path+",
        destination: `${DOCS_APP_URL}/docs-assets/:path+`,
        locale: false,
      },
      // Docs app rewrites
      {
        source: "/opengraph/:path+",
        destination: `${DOCS_APP_URL}/opengraph/:path+`,
        locale: false,
      },
      {
        source: "/docs",
        destination: `${DOCS_APP_URL}/docs`,
        locale: false,
      },
      {
        source: "/docs.md",
        destination: `${DOCS_APP_URL}/docs.md`,
        locale: false,
      },
      {
        source: "/docs/:path*.md",
        destination: `${DOCS_APP_URL}/docs/:path*.md`,
        locale: false,
      },
      {
        source: "/docs/:path*",
        destination: `${DOCS_APP_URL}/docs/:path*`,
        locale: false,
      },
      {
        source: "/learn",
        destination: `${DOCS_APP_URL}/learn`,
        locale: false,
      },
      {
        source: "/learn/:path*.md",
        destination: `${DOCS_APP_URL}/learn/:path*.md`,
        locale: false,
      },
      {
        source: "/learn/:path*",
        destination: `${DOCS_APP_URL}/learn/:path*`,
        locale: false,
      },
      {
        source: "/developers",
        destination: `${DOCS_APP_URL}/developers`,
        locale: false,
      },
      {
        source: "/developers/:path*.md",
        destination: `${DOCS_APP_URL}/developers/:path*.md`,
        locale: false,
      },
      {
        source: "/developers/cookbook",
        destination: `${DOCS_APP_URL}/developers/cookbook`,
        locale: false,
      },
      {
        source: "/developers/cookbook/:path*",
        destination: `${DOCS_APP_URL}/developers/cookbook/:path*`,
        locale: false,
      },
      {
        source: "/developers/guides",
        destination: `${DOCS_APP_URL}/developers/guides`,
        locale: false,
      },
      {
        source: "/developers/guides/:path*",
        destination: `${DOCS_APP_URL}/developers/guides/:path*`,
        locale: false,
      },
      // Docs app with locale
      {
        source: "/:locale/docs",
        destination: `${DOCS_APP_URL}/:locale/docs`,
        locale: false,
      },
      {
        source: "/:locale/docs/:path*.md",
        destination: `${DOCS_APP_URL}/:locale/docs/:path*.md`,
        locale: false,
      },
      {
        source: "/:locale/docs/:path*",
        destination: `${DOCS_APP_URL}/:locale/docs/:path*`,
        locale: false,
      },
      {
        source: "/:locale/learn",
        destination: `${DOCS_APP_URL}/:locale/learn`,
        locale: false,
      },
      {
        source: "/:locale/learn/:path*.md",
        destination: `${DOCS_APP_URL}/:locale/learn/:path*.md`,
        locale: false,
      },
      {
        source: "/:locale/learn/:path*",
        destination: `${DOCS_APP_URL}/:locale/learn/:path*`,
        locale: false,
      },
      {
        source: "/:locale/developers",
        destination: `${DOCS_APP_URL}/:locale/developers`,
        locale: false,
      },
      {
        source: "/:locale/developers/:path*.md",
        destination: `${DOCS_APP_URL}/:locale/developers/:path*.md`,
        locale: false,
      },
      {
        source: "/:locale/developers/cookbook",
        destination: `${DOCS_APP_URL}/:locale/developers/cookbook`,
        locale: false,
      },
      {
        source: "/:locale/developers/cookbook/:path*",
        destination: `${DOCS_APP_URL}/:locale/developers/cookbook/:path*`,
        locale: false,
      },
      {
        source: "/:locale/developers/guides",
        destination: `${DOCS_APP_URL}/:locale/developers/guides`,
        locale: false,
      },
      {
        source: "/:locale/developers/guides/:path*",
        destination: `${DOCS_APP_URL}/:locale/developers/guides/:path*`,
        locale: false,
      },
    ],
    afterFiles: [],
    fallback: [],
  },

  redirects: withLocaleRedirects([
    { source: "/brand", destination: "/branding" },
    { source: "/press", destination: "/branding" },
    // TODO: set to newws/upgrades when we have articles
    { source: "/upgrade", destination: "/news/solana-network-upgrades" },
    { source: "/upgrades", destination: "/news/solana-network-upgrades" },

    { source: "/reddit", destination: "https://reddit.com/r/solana" },
    { source: "/telegram", destination: "https://t.me/solana" },
    {
      source: "/github",
      destination: "https://github.com/solana-foundation/solana-com",
    },
    { source: "/twitter", destination: "https://twitter.com/solana" },
    {
      source: "/youtube",
      destination: "https://www.youtube.com/SolanaFndn",
    },
    {
      source: "/discord",
      destination: "https://discord.gg/kBbATFA7PW",
    },
    {
      source: "/skyline",
      destination: "https://lu.ma/solana-nyc",
    },
    { source: "/blog", destination: "/news" },
    { source: "/rss.xml", destination: "/news/rss.xml" },
    { source: "/news/tag/:path*", destination: "/news" },
    {
      source: "/news/solana-scaffold-part-1-wallet-adapter",
      destination:
        "/developers/guides/getstarted/full-stack-solana-development",
    },
    {
      source: "/news/solana-scaffold-part-2-wallet-balance",
      destination:
        "/developers/guides/getstarted/full-stack-solana-development",
    },
    {
      source: "/news/getting-started-with-solana-development",
      destination: "/docs/intro/dev",
    },
    {
      source: "/install",
      destination: "/docs/intro/installation",
    },
    {
      source: "/cli",
      destination: "/docs/intro/installation#install-the-solana-cli",
    },
    {
      source: "/setup",
      destination: "/docs/intro/installation",
    },
    {
      source: "/simd",
      destination:
        "https://github.com/solana-foundation/solana-improvement-documents",
    },
    { source: "/disclaimer", destination: "/tos" },
    { source: "/ecosystem(.*)", destination: "/" },
    { source: "/lolla", destination: "/" },
    { source: "/solana-pay", destination: "https://solanapay.com/" },
    { source: "/solanapay", destination: "https://solanapay.com/" },
    { source: "/pay", destination: "https://solanapay.com/" },
    { source: "/mobile", destination: "https://solanamobile.com/" },
    {
      source: "/podcast",
      destination: "/podcasts",
    },
    {
      source: "/validated",
      destination: "/podcasts/validated-with-austin-federa",
    },
    {
      source: "/validated/:path*",
      destination: "/podcasts/validated-with-austin-federa",
    },
    { source: "/careers", destination: "https://jobs.solana.com" },
    { source: "/jobs", destination: "https://jobs.solana.com" },
    {
      source: "/austin",
      destination: "https://calendly.com/solana-austin",
    },
    {
      source: "/dev-update",
      destination:
        "https://solana.us17.list-manage.com/subscribe?u=dc5b8a6eb6dc3d737579c03c9&id=4a4784c804",
    },
    { source: "/ignition", destination: "/hackathon" },
    { source: "/solanaszn", destination: "/hackathon" },
    { source: "/wormhole-hackathon", destination: "/hackathon" },
    { source: "/defi", destination: "/hackathon" },
    { source: "/riptide(.*)", destination: "/hackathon" },
    { source: "/summercamp(.*)", destination: "/hackathon" },
    { source: "/grizzlython(.*)", destination: "/hackathon" },
    { source: "/hyperdrive(.*)", destination: "/hackathon" },
    { source: "/developers/ai", destination: "/ai" },
    { source: "/developer", destination: "/developers" },
    { source: "/token22", destination: "/solutions/token-extensions" },
    {
      source: "/solutions/token22",
      destination: "/solutions/token-extensions",
    },
    {
      source: "/tokenextensions",
      destination: "/solutions/token-extensions",
    },
    {
      source: "/solutions/tokenextensions",
      destination: "/solutions/token-extensions",
    },
    {
      source: "/token-extensions",
      destination: "/solutions/token-extensions",
    },
    {
      source: "/enterprise",
      destination: "/solutions/enterprise",
    },
    {
      source: "/2024-outlook",
      destination: "/2024outlook",
    },
    {
      source: "/collective",
      destination: "https://www.solanacollective.com/",
    },
    {
      source: "/meta",
      destination: "/",
    },
    {
      source: "/developers/guides/getstarted/setup-local-development",
      destination: "/docs/intro/installation",
    },
    {
      source: "/environment",
      destination: "https://climate.solana.com/",
    },
    { source: "/breakpoint/side-events", destination: "/breakpoint" },
    { source: "/breakpoint/sponsors", destination: "/breakpoint" },
    {
      source: "/verifiable-builds",
      destination:
        "/developers/guides/advanced/verified-builds#install-the-solana-verify-cli",
    },
    // content redirects:
    {
      source: "/docs/actions",
      destination: "/docs/advanced/actions",
    },
    {
      source: "/docs/blinks",
      destination: "/docs/advanced/actions",
    },
    {
      source: "/docs/advanced/blinks",
      destination: "/docs/advanced/actions",
    },
    {
      source: "/docs/advanced",
      destination: "/docs/advanced/confirmation",
    },
    {
      source: "/docs/core/transactions/confirmation",
      destination: "/docs/advanced/confirmation",
    },
    {
      source: "/docs/core/transactions/retry",
      destination: "/docs/advanced/retry",
    },
    {
      source: "/docs/core/transactions/versions",
      destination: "/docs/advanced/versions",
    },
    {
      source: "/docs/core/rent",
      destination: "/docs/core/fees",
    },
    {
      source: "/docs/intro/rent",
      destination: "/docs/core/fees",
    },
    {
      source: "/docs/intro/transaction_fees",
      destination: "/docs/core/fees",
    },
    {
      source: "/docs/intro/transaction-fees",
      destination: "/docs/core/fees",
    },
    {
      source: "/docs/core/runtime",
      destination: "/docs/core/fees",
    },
    {
      source: "/docs/intro/economics",
      destination: "/docs/economics/index",
    },
    {
      source: "/docs/economics/inflation/inflation_schedule",
      destination: "/docs/economics/inflation/inflation-schedule",
    },
    {
      source: "/docs/intro/economics",
      destination: "/docs/economics/inflation/inflation-schedule",
    },
    {
      source: "/docs/intro/history",
      destination: "/docs/index",
    },
    {
      source: "/docs/intro",
      destination: "/docs/index",
    },
    {
      source: "/docs/intro/overview",
      destination: "/docs/index",
    },
    {
      source: "/developers/guides/getstarted/setup-local-development",
      destination: "/docs/intro/installation",
    },
    {
      source: "/docs/install",
      destination: "/docs/intro/installation",
    },
    {
      source: "/install",
      destination: "/docs/intro/installation",
    },
    {
      source: "/setup",
      destination: "/docs/intro/installation",
    },
    {
      source: "/docs/programs/debugging",
      destination: "/docs/programs/anchor/index",
    },
    {
      source: "/docs/programs/lang-c",
      destination: "/docs/programs/anchor/index",
    },
    {
      source: "/docs/programs/overview",
      destination: "/docs/programs/anchor/index",
    },
    {
      source: "/docs/programs/lang-rust",
      destination: "/docs/programs/rust/index",
    },
    {
      source: "/docs/rpc/getConfirmedBlock",
      destination: "/docs/rpc/deprecated/getconfirmedblock",
    },
    {
      source: "/docs/rpc/http/getConfirmedBlock",
      destination: "/docs/rpc/deprecated/getconfirmedblock",
    },
    {
      source: "/docs/rpc/getConfirmedBlocks",
      destination: "/docs/rpc/deprecated/getconfirmedblocks",
    },
    {
      source: "/docs/rpc/http/getConfirmedBlocks",
      destination: "/docs/rpc/deprecated/getconfirmedblocks",
    },
    {
      source: "/docs/rpc/getConfirmedBlocksWithLimit",
      destination: "/docs/rpc/deprecated/getconfirmedblockswithlimit",
    },
    {
      source: "/docs/rpc/http/getConfirmedBlocksWithLimit",
      destination: "/docs/rpc/deprecated/getconfirmedblockswithlimit",
    },
    {
      source: "/docs/rpc/getConfirmedSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress2",
    },
    {
      source: "/docs/rpc/http/getConfirmedSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress2",
    },
    {
      source: "/docs/rpc/getSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress2",
    },
    {
      source: "/docs/rpc/http/getSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress2",
    },
    {
      source: "/docs/rpc/deprecated/getSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress2",
    },
    {
      source: "/docs/rpc/http/getconfirmedsignaturesforaddress",
      destination: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress2",
    },
    {
      source: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress",
      destination: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress2",
    },
    {
      source: "/docs/rpc/getconfirmedsignaturesforaddress",
      destination: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress2",
    },
    {
      source: "/docs/rpc/getConfirmedTransaction",
      destination: "/docs/rpc/deprecated/getconfirmedtransaction",
    },
    {
      source: "/docs/rpc/http/getConfirmedTransaction",
      destination: "/docs/rpc/deprecated/getconfirmedtransaction",
    },
    {
      source: "/docs/rpc/getFeeCalculatorForBlockhash",
      destination: "/docs/rpc/deprecated/getfeecalculatorforblockhash",
    },
    {
      source: "/docs/rpc/http/getFeeCalculatorForBlockhash",
      destination: "/docs/rpc/deprecated/getfeecalculatorforblockhash",
    },
    {
      source: "/docs/rpc/getFeeRateGovernor",
      destination: "/docs/rpc/deprecated/getfeerategovernor",
    },
    {
      source: "/docs/rpc/http/getFeeRateGovernor",
      destination: "/docs/rpc/deprecated/getfeerategovernor",
    },
    {
      source: "/docs/rpc/getFees",
      destination: "/docs/rpc/deprecated/getfees",
    },
    {
      source: "/docs/rpc/http/getFees",
      destination: "/docs/rpc/deprecated/getfees",
    },
    {
      source: "/docs/rpc/http/getRecentBlockhash",
      destination: "/docs/rpc/deprecated/getrecentblockhash",
    },
    {
      source: "/docs/rpc/getRecentBlockhash",
      destination: "/docs/rpc/deprecated/getrecentblockhash",
    },
    {
      source: "/docs/rpc/http/getSnapshotSlot",
      destination: "/docs/rpc/deprecated/getsnapshotslot",
    },
    {
      source: "/docs/rpc/getSnapshotSlot",
      destination: "/docs/rpc/deprecated/getsnapshotslot",
    },
    {
      source: "/docs/rpc/http/getStakeActivation",
      destination: "/docs/rpc/deprecated/getstakeactivation",
    },
    {
      source: "/docs/rpc/getAccountInfo",
      destination: "/docs/rpc/http/getaccountinfo",
    },
    {
      source: "/docs/rpc/getBalance",
      destination: "/docs/rpc/http/getbalance",
    },
    {
      source: "/docs/rpc/getBlock",
      destination: "/docs/rpc/http/getblock",
    },
    {
      source: "/docs/rpc/getBlockCommitment",
      destination: "/docs/rpc/http/getblockcommitment",
    },
    {
      source: "/docs/rpc/getBlockHeight",
      destination: "/docs/rpc/http/getblockheight",
    },
    {
      source: "/docs/rpc/getBlockProduction",
      destination: "/docs/rpc/http/getblockproduction",
    },
    {
      source: "/docs/rpc/getBlocks",
      destination: "/docs/rpc/http/getblocks",
    },
    {
      source: "/docs/rpc/getBlocksWithLimit",
      destination: "/docs/rpc/http/getblockswithlimit",
    },
    {
      source: "/docs/rpc/getBlockTime",
      destination: "/docs/rpc/http/getblocktime",
    },
    {
      source: "/docs/rpc/getClusterNodes",
      destination: "/docs/rpc/http/getclusternodes",
    },
    {
      source: "/docs/rpc/getEpochInfo",
      destination: "/docs/rpc/http/getepochinfo",
    },
    {
      source: "/docs/rpc/getEpochSchedule",
      destination: "/docs/rpc/http/getepochschedule",
    },
    {
      source: "/docs/rpc/getFeeForMessage",
      destination: "/docs/rpc/http/getfeeformessage",
    },
    {
      source: "/docs/rpc/getFirstAvailableBlock",
      destination: "/docs/rpc/http/getfirstavailableblock",
    },
    {
      source: "/docs/rpc/getGenesisHash",
      destination: "/docs/rpc/http/getgenesishash",
    },
    {
      source: "/docs/rpc/getHealth",
      destination: "/docs/rpc/http/gethealth",
    },
    {
      source: "/docs/rpc/getHighestSnapshotSlot",
      destination: "/docs/rpc/http/gethighestsnapshotslot",
    },
    {
      source: "/docs/rpc/getIdentity",
      destination: "/docs/rpc/http/getidentity",
    },
    {
      source: "/docs/rpc/getInflationGovernor",
      destination: "/docs/rpc/http/getinflationgovernor",
    },
    {
      source: "/docs/rpc/getInflationRate",
      destination: "/docs/rpc/http/getinflationrate",
    },
    {
      source: "/docs/rpc/getInflationReward",
      destination: "/docs/rpc/http/getinflationreward",
    },
    {
      source: "/docs/rpc/getLargestAccounts",
      destination: "/docs/rpc/http/getlargestaccounts",
    },
    {
      source: "/docs/rpc/getLatestBlockhash",
      destination: "/docs/rpc/http/getlatestblockhash",
    },
    {
      source: "/docs/rpc/getLeaderSchedule",
      destination: "/docs/rpc/http/getleaderschedule",
    },
    {
      source: "/docs/rpc/getMaxRetransmitSlot",
      destination: "/docs/rpc/http/getmaxretransmitslot",
    },
    {
      source: "/docs/rpc/getMaxShredInsertSlot",
      destination: "/docs/rpc/http/getmaxshredinsertslot",
    },
    {
      source: "/docs/rpc/getMinimumBalanceForRentExemption",
      destination: "/docs/rpc/http/getminimumbalanceforrentexemption",
    },
    {
      source: "/docs/rpc/getMultipleAccounts",
      destination: "/docs/rpc/http/getmultipleaccounts",
    },
    {
      source: "/docs/rpc/getProgramAccounts",
      destination: "/docs/rpc/http/getprogramaccounts",
    },
    {
      source: "/docs/rpc/getRecentPerformanceSamples",
      destination: "/docs/rpc/http/getrecentperformancesamples",
    },
    {
      source: "/docs/rpc/getRecentPrioritizationFees",
      destination: "/docs/rpc/http/getrecentprioritizationfees",
    },
    {
      source: "/docs/rpc/getSignaturesForAddress",
      destination: "/docs/rpc/http/getsignaturesforaddress",
    },
    {
      source: "/docs/rpc/getSignatureStatuses",
      destination: "/docs/rpc/http/getsignaturestatuses",
    },
    {
      source: "/docs/rpc/getSlot",
      destination: "/docs/rpc/http/getslot",
    },
    {
      source: "/docs/rpc/getSlotLeader",
      destination: "/docs/rpc/http/getslotleader",
    },
    {
      source: "/docs/rpc/getSlotLeaders",
      destination: "/docs/rpc/http/getslotleaders",
    },
    {
      source: "/docs/rpc/getStakeMinimumDelegation",
      destination: "/docs/rpc/http/getstakeminimumdelegation",
    },
    {
      source: "/docs/rpc/getSupply",
      destination: "/docs/rpc/http/getsupply",
    },
    {
      source: "/docs/rpc/getTokenAccountBalance",
      destination: "/docs/rpc/http/gettokenaccountbalance",
    },
    {
      source: "/docs/rpc/getTokenAccountsByDelegate",
      destination: "/docs/rpc/http/gettokenaccountsbydelegate",
    },
    {
      source: "/docs/rpc/getTokenAccountsByOwner",
      destination: "/docs/rpc/http/gettokenaccountsbyowner",
    },
    {
      source: "/docs/rpc/getTokenLargestAccounts",
      destination: "/docs/rpc/http/gettokenlargestaccounts",
    },
    {
      source: "/docs/rpc/getTokenSupply",
      destination: "/docs/rpc/http/gettokensupply",
    },
    {
      source: "/docs/rpc/getTransaction",
      destination: "/docs/rpc/http/gettransaction",
    },
    {
      source: "/docs/rpc/getTransactionCount",
      destination: "/docs/rpc/http/gettransactioncount",
    },
    {
      source: "/docs/rpc/getVersion",
      destination: "/docs/rpc/http/getversion",
    },
    {
      source: "/docs/rpc/getVoteAccounts",
      destination: "/docs/rpc/http/getvoteaccounts",
    },
    {
      source: "/docs/rpc/isBlockhashValid",
      destination: "/docs/rpc/http/isblockhashvalid",
    },
    {
      source: "/docs/rpc/minimumLedgerSlot",
      destination: "/docs/rpc/http/minimumledgerslot",
    },
    {
      source: "/docs/rpc/requestAirdrop",
      destination: "/docs/rpc/http/requestairdrop",
    },
    {
      source: "/docs/rpc/sendTransaction",
      destination: "/docs/rpc/http/sendtransaction",
    },
    {
      source: "/docs/rpc/simulateTransaction",
      destination: "/docs/rpc/http/simulatetransaction",
    },
    {
      source: "/docs/rpc/accountSubscribe",
      destination: "/docs/rpc/websocket/accountsubscribe",
    },
    {
      source: "/docs/rpc/accountUnsubscribe",
      destination: "/docs/rpc/websocket/accountunsubscribe",
    },
    {
      source: "/docs/rpc/blockSubscribe",
      destination: "/docs/rpc/websocket/blocksubscribe",
    },
    {
      source: "/docs/rpc/blockUnsubscribe",
      destination: "/docs/rpc/websocket/blockunsubscribe",
    },
    {
      source: "/docs/rpc/logsSubscribe",
      destination: "/docs/rpc/websocket/logssubscribe",
    },
    {
      source: "/docs/rpc/logsUnsubscribe",
      destination: "/docs/rpc/websocket/logsunsubscribe",
    },
    {
      source: "/docs/rpc/programSubscribe",
      destination: "/docs/rpc/websocket/programsubscribe",
    },
    {
      source: "/docs/rpc/programUnsubscribe",
      destination: "/docs/rpc/websocket/programunsubscribe",
    },
    {
      source: "/docs/rpc/rootSubscribe",
      destination: "/docs/rpc/websocket/rootsubscribe",
    },
    {
      source: "/docs/rpc/rootUnsubscribe",
      destination: "/docs/rpc/websocket/rootunsubscribe",
    },
    {
      source: "/docs/rpc/signatureSubscribe",
      destination: "/docs/rpc/websocket/signaturesubscribe",
    },
    {
      source: "/docs/rpc/signatureUnsubscribe",
      destination: "/docs/rpc/websocket/signatureunsubscribe",
    },
    {
      source: "/docs/rpc/slotSubscribe",
      destination: "/docs/rpc/websocket/slotsubscribe",
    },
    {
      source: "/docs/rpc/slotsUpdatesSubscribe",
      destination: "/docs/rpc/websocket/slotsupdatessubscribe",
    },
    {
      source: "/docs/rpc/slotsUpdatesUnsubscribe",
      destination: "/docs/rpc/websocket/slotsupdatesunsubscribe",
    },
    {
      source: "/docs/rpc/slotUnsubscribe",
      destination: "/docs/rpc/websocket/slotunsubscribe",
    },
    {
      source: "/docs/rpc/voteSubscribe",
      destination: "/docs/rpc/websocket/votesubscribe",
    },
    {
      source: "/docs/rpc/voteUnsubscribe",
      destination: "/docs/rpc/websocket/voteunsubscribe",
    },
    {
      source: "/developers/cookbook/tokens",
      destination: "/developers/cookbook/tokens/create-mint-account",
    },
    {
      source: "/developers/cookbook/transactions/send-tokens",
      destination: "developers/cookbook/tokens/transfer-tokens",
    },
    {
      source: "/developers/guides/introduction-to-durable-nonces",
      destination: "/developers/guides/advanced/introduction-to-durable-nonces",
    },
    {
      source: "/developers/guides/advanced/stake-weighted-qos-guide",
      destination: "/developers/guides/advanced/stake-weighted-qos",
    },
    {
      source: "/developers/guides/hello-world-in-your-browser",
      destination: "/docs/intro/quick-start",
    },
    {
      source: "/developers/guides/solana-playground",
      destination: "/docs/intro/quick-start",
    },
    {
      source: "/developers/guides/solang/solang-getting-started",
      destination: "/docs/intro/quick-start",
    },
    {
      source: "/developers/guides/solang-getting-started",
      destination: "/docs/intro/quick-start",
    },
    {
      source: "/developers/guides/getstarted/hello-world-in-your-browser",
      destination: "/docs/intro/quick-start",
    },
    {
      source: "/developers/guides/local-rust-hello-world",
      destination: "/developers/guides/getstarted/local-rust-hello-world",
    },
    {
      source: "/developers/guides/wallets-explained",
      destination: "/developers/guides/intro/wallets-explained",
    },
    {
      source: "/developers/guides/compressed-nfts",
      destination: "/developers/guides/javascript/compressed-nfts",
    },
    {
      source: "/developers/guides/get-program-accounts",
      destination: "/developers/guides/javascript/get-program-accounts",
    },
    {
      source: "/docs/more/exchange",
      destination: "/developers/guides/advanced/exchange",
    },
    {
      source: "/developers/guides/getstarted/intro-to-native-rust",
      destination: "/docs/programs/rust",
    },
    {
      source: "/docs/clients/javascript-reference",
      destination: "/developers/cookbook",
    },
    {
      source: "/docs/programs/anchor/:path*",
      destination: "https://www.anchor-lang.com/docs",
    },
    {
      source: "/docs/intro/dev",
      destination: "/docs",
    },
    {
      source: "/docs/intro/wallets",
      destination: "/wallets",
    },
    {
      source: "/developers/resources",
      destination: "/docs",
    },
    {
      source: "/docs/core/clusters",
      destination: "/docs/references/clusters",
    },
    {
      source: "/docs/economics/:path*",
      destination: "/docs/references/economics/:path*",
    },
    {
      source: "/docs/advanced/:path*",
      destination: "/developers/guides/advanced/:path*",
    },
    {
      source: "/developers/guides/games/game-sdks",
      destination: "/docs/clients/game-sdks",
    },
    {
      source: "/accelerate/scale-or-die",
      destination: "/accelerate",
    },
    {
      source: "/accelerate/ship-or-die",
      destination: "/accelerate",
    },
    {
      source: "/accelerate/tickets",
      destination: "/accelerate",
    },
    {
      source: "/docs/terminology",
      destination: "/docs/references/terminology",
    },
    {
      source: "/docs/core/tokens",
      destination: "/docs/tokens",
    },
    {
      source: "/developers/guides/getstarted/how-to-cpi",
      destination: "/docs/core/cpi",
    },
    {
      source: "/developers/guides/getstarted/how-to-cpi-with-signer",
      destination: "/docs/core/cpi",
    },
    {
      source: "/developers/cookbook/programs/:path*",
      destination: "/docs/programs/examples",
    },
    {
      source: "/developers/cookbook/accounts/create-pda-account",
      destination: "/docs/core/pda",
    },
    {
      source: "/developers/cookbook/accounts/sign-with-pda",
      destination: "/docs/core/cpi",
    },
    {
      source: "/developers/cookbook/accounts/close-account",
      destination: "/docs/core/accounts",
    },
    {
      source: "/developers/guides/intro/wallets-explained",
      destination: "/wallets",
    },
    {
      source: "/developers/guides/javascript/get-program-accounts",
      destination: "/docs/rpc/http/getprogramaccounts",
    },
    {
      source: "/developers/guides/javascript/compressed-nfts",
      destination: "https://www.zkcompression.com",
    },
    {
      source: "/developers/guides/getstarted/evm-to-svm",
      destination: "/developers/evm-to-svm",
    },
    {
      source: "/developers/guides/getstarted/how-to-create-a-token",
      destination: "/docs/tokens",
    },
    {
      source: "/developers/guides/getstarted/local-rust-hello-world",
      destination: "/docs/programs/rust",
    },
    {
      source: "/developers/guides/getstarted/rust-to-solana",
      destination: "/docs/intro/quick-start",
    },
    {
      source: "/developers/guides/getstarted/scaffold-nextjs-anchor",
      destination: "/docs#deploy-your-first-solana-application",
    },
    {
      source: "/developers/guides/wallets/add-solana-wallet-adapter-to-nextjs",
      destination: "/developers/cookbook/wallets/connect-wallet-react",
    },
    {
      source: "/developers/guides/advanced/state-compression",
      destination: "https://www.zkcompression.com",
    },
    {
      source: "/developers/guides/advanced/testing-with-jest-and-bankrun",
      destination: "https://www.anchor-lang.com/docs/testing/litesvm",
    },
    {
      source: "/developers/guides/dapps/cash-app",
      destination: "https://docs.solanamobile.com/developers/overview",
    },
    {
      source: "/developers/guides/getstarted/full-stack-solana-development",
      destination: "/docs#deploy-your-first-solana-application",
    },
    {
      source: "/docs/toolkit/:path*",
      destination: "/docs/intro/installation",
    },
    {
      source: "/developers/cookbook/tokens/create-nft",
      destination: "https://developers.metaplex.com/core",
    },
    {
      source: "/developers/cookbook/tokens/fetch-nft-metadata",
      destination: "https://developers.metaplex.com/core",
    },
    {
      source: "/developers/cookbook/tokens/get-nft-owner",
      destination: "https://developers.metaplex.com/core",
    },
    {
      source: "/developers/cookbook/tokens/fetch-all-nfts",
      destination: "https://developers.metaplex.com/core",
    },
    {
      source: "/docs/programs/faq",
      destination: "https://solana.stackexchange.com",
    },
    {
      source: "/news/blog-solana-bench",
      destination: "/news/solana-bench",
    },
    {
      source: "/docs/references/feature-gates/consume-cus-on-sbpf-failure",
      destination:
        "https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0182-conditional-cu-metering.md",
    },
    {
      source: "/docs/references/feature-gates/direct-mapping",
      destination:
        "https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0219-stricter-abi-and-runtime-constraints.md",
    },
    {
      source: "/docs/references/feature-gates/reserve-minimal-cus-for-builtins",
      destination:
        "https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0170-builtin-instruction-cost-and-budget.md",
    },
    {
      source:
        "/docs/references/feature-gates/tsynmcspg4xficj1v3tdb4c7crmr5tsbhlz4sf7rrna",
      destination:
        "https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0138-deprecate-legacy-vote-instructions.md",
    },
    {
      source: "/developers/cookbook/tokens/approve-token-delegate",
      destination: "/docs/tokens/basics/approve-delegate",
    },
    {
      source: "/developers/cookbook/tokens/burn-tokens",
      destination: "/docs/tokens/basics/burn-tokens",
    },
    {
      source: "/developers/cookbook/tokens/close-token-accounts",
      destination: "/docs/tokens/basics/close-account",
    },
    {
      source: "/developers/cookbook/tokens/create-mint-account",
      destination: "/docs/tokens/basics/create-mint",
    },
    {
      source: "/developers/cookbook/tokens/create-token-account",
      destination: "/docs/tokens/basics/create-token-account",
    },
    {
      source: "/developers/cookbook/tokens/mint-tokens",
      destination: "/docs/tokens/basics/mint-tokens",
    },
    {
      source: "/developers/cookbook/tokens/revoke-token-delegate",
      destination: "/docs/tokens/basics/revoke-delegate",
    },
    {
      source: "/developers/cookbook/tokens/set-update-token-authority",
      destination: "/docs/tokens/basics/set-authority",
    },
    {
      source: "/developers/cookbook/tokens/transfer-tokens",
      destination: "/docs/tokens/basics/transfer-tokens",
    },
    {
      source: "/developers/cookbook/tokens/manage-wrapped-sol",
      destination: "/docs/tokens/basics/sync-native",
    },
    {
      source: "/developers/guides/advanced/verified-builds",
      destination: "/docs/programs/verified-builds",
    },
    {
      source: "/developers/courses",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses",
    },
    {
      source: "/developers/courses/intro-to-solana/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/intro-to-solana",
    },
    {
      source: "/developers/courses/program-optimization/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/program-optimization",
    },
    {
      source: "/developers/courses/token-extensions/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/token-extensions",
    },
    {
      source: "/developers/courses/solana-pay/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/solana-pay",
    },
    {
      source: "/developers/courses/tokens-and-nfts/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/tokens-and-nfts",
    },
    {
      source: "/developers/courses/mobile/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/mobile",
    },
    {
      source: "/developers/courses/program-security/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/program-security",
    },
    {
      source: "/developers/courses/native-onchain-development/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/native-onchain-development",
    },
    {
      source: "/developers/courses/offline-transactions/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/offline-transactions",
    },
    {
      source: "/developers/courses/onchain-development/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/onchain-development",
    },
    {
      source: "/developers/courses/state-compression/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/state-compression",
    },
    {
      source: "/developers/courses/connecting-to-offchain-data/:path*",
      destination:
        "https://github.com/solana-foundation/developer-content/tree/main/content/courses/connecting-to-offchain-data",
    },
    {
      source: "/developers/guides/immutable-owner",
      destination: "/developers/guides/token-extensions/immutable-owner",
    },
    {
      source: "/developers/guides/token-extensions/default-account-state",
      destination: "/docs/tokens/extensions/default-state",
    },
    {
      source: "/developers/guides/token-extensions/immutable-owner",
      destination: "/docs/tokens/extensions/immutable-owner",
    },
    {
      source: "/developers/guides/token-extensions/interest-bearing-tokens",
      destination: "/docs/tokens/extensions/interest-bearing-tokens",
    },
    {
      source: "/developers/guides/token-extensions/required-memo",
      destination: "/docs/tokens/extensions/memo-transfer",
    },
    {
      source: "/developers/guides/token-extensions/mint-close-authority",
      destination: "/docs/tokens/extensions/close-mint",
    },
    {
      source: "/developers/guides/token-extensions/non-transferable",
      destination: "/docs/tokens/extensions/non-transferrable-tokens",
    },
    {
      source: "/developers/guides/token-extensions/permanent-delegate",
      destination: "/docs/tokens/extensions/permanent-delegate",
    },
    {
      source: "/developers/guides/token-extensions/transfer-fee",
      destination: "/docs/tokens/extensions/transfer-fees",
    },
    {
      source: "/developers/guides/token-extensions/metadata-pointer",
      destination: "/docs/tokens/extensions/metadata",
    },
    {
      source: "/developers/guides/token-extensions/reallocate",
      destination: "/docs/tokens/extensions",
    },
    {
      source: "/developers/guides/token-extensions/getting-started",
      destination: "/docs/tokens/extensions",
    },
    {
      source: "/developers/guides/advanced/how-to-use-priority-fees",
      destination: "/docs/core/fees",
    },
    {
      source: "/developers/guides/advanced/how-to-request-optimal-compute",
      destination: "/developers/cookbook/transactions/optimize-compute",
    },
    {
      source: "/developers/guides/getstarted/full-stack-solana-development",
      destination: "/developers/guides/dapps/journal",
    },
    {
      source: "/developers/guides/getstarted/solana-test-validator",
      destination: "/docs/intro/installation/surfpool-cli-basics",
    },
    {
      source: "/developers/cookbook/development/start-local-validator",
      destination: "/docs/intro/installation/surfpool-cli-basics",
    },
    {
      source:
        "/developers/cookbook/development/using-mainnet-accounts-programs",
      destination: "/docs/intro/installation/surfpool-cli-basics",
    },
  ]),
};
