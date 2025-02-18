export default {
  rewrites: [
    //
  ],

  redirects: [
    { source: "/brand", destination: "/branding" },
    { source: "/press", destination: "/branding" },
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
    { source: "/blog", destination: "/news" },
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
    {
      source: "/developers/courses/lesson",
      destination: "/developers/courses",
    },
    { source: "/disclaimer", destination: "/tos" },
    { source: "/ecosystem(.*)", destination: "/" },
    { source: "/lolla", destination: "/" },
    { source: "/solana-pay", destination: "https://solanapay.com/" },
    { source: "/solanapay", destination: "https://solanapay.com/" },
    { source: "/pay", destination: "https://solanapay.com/" },
    { source: "/mobile", destination: "https://solanamobile.com/" },
    { source: "/podcast", destination: "/validated" },
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
    { source: "/breakpoint/speakers", destination: "/breakpoint" },
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
      source: "/docs/toolkit/projects",
      destination: "/docs/toolkit/projects/overview",
    },
    {
      source: "/docs/toolkit/test-suite",
      destination: "/docs/toolkit/test-suite/overview",
    },
    {
      source: "/developers/cookbook/tokens",
      destination: "/developers/cookbook/tokens/create-mint-account",
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
      source: "/developers/guides/immutable-owner",
      destination: "/developers/guides/token-extensions/immutable-owner",
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
      source: "/docs/references/economics/staking/:path*",
      destination: "/staking",
    },
  ],
};
