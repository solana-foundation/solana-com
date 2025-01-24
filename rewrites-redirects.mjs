export default {
  rewrites: [
    { source: "/brand", destination: "/branding" },
    { source: "/press", destination: "/branding" },
    { source: "/upgrade", destination: "/news/solana-network-upgrades" },
    { source: "/upgrades", destination: "/news/solana-network-upgrades" },
  ],

  redirects: [
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
      destination: "/docs/rpc/deprecated/getConfirmedBlock",
    },
    {
      source: "/docs/rpc/http/getConfirmedBlock",
      destination: "/docs/rpc/deprecated/getConfirmedBlock",
    },
    {
      source: "/docs/rpc/getConfirmedBlocks",
      destination: "/docs/rpc/deprecated/getConfirmedBlocks",
    },
    {
      source: "/docs/rpc/http/getConfirmedBlocks",
      destination: "/docs/rpc/deprecated/getConfirmedBlocks",
    },
    {
      source: "/docs/rpc/getConfirmedBlocksWithLimit",
      destination: "/docs/rpc/deprecated/getConfirmedBlocksWithLimit",
    },
    {
      source: "/docs/rpc/http/getConfirmedBlocksWithLimit",
      destination: "/docs/rpc/deprecated/getConfirmedBlocksWithLimit",
    },
    {
      source: "/docs/rpc/getConfirmedSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getConfirmedSignaturesForAddress2",
    },
    {
      source: "/docs/rpc/http/getConfirmedSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getConfirmedSignaturesForAddress2",
    },
    {
      source: "/docs/rpc/getSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getConfirmedSignaturesForAddress2",
    },
    {
      source: "/docs/rpc/http/getSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getConfirmedSignaturesForAddress2",
    },
    {
      source: "/docs/rpc/deprecated/getSignaturesForAddress2",
      destination: "/docs/rpc/deprecated/getConfirmedSignaturesForAddress2",
    },
    {
      source: "/docs/rpc/http/getconfirmedsignaturesforaddress",
      destination: "/docs/rpc/deprecated/getConfirmedSignaturesForAddress2",
    },
    {
      source: "/docs/rpc/deprecated/getconfirmedsignaturesforaddress",
      destination: "/docs/rpc/deprecated/getConfirmedSignaturesForAddress2",
    },
    {
      source: "/docs/rpc/getconfirmedsignaturesforaddress",
      destination: "/docs/rpc/deprecated/getConfirmedSignaturesForAddress2",
    },
    {
      source: "/docs/rpc/getConfirmedTransaction",
      destination: "/docs/rpc/deprecated/getConfirmedTransaction",
    },
    {
      source: "/docs/rpc/http/getConfirmedTransaction",
      destination: "/docs/rpc/deprecated/getConfirmedTransaction",
    },
    {
      source: "/docs/rpc/getFeeCalculatorForBlockhash",
      destination: "/docs/rpc/deprecated/getFeeCalculatorForBlockhash",
    },
    {
      source: "/docs/rpc/http/getFeeCalculatorForBlockhash",
      destination: "/docs/rpc/deprecated/getFeeCalculatorForBlockhash",
    },
    {
      source: "/docs/rpc/getFeeRateGovernor",
      destination: "/docs/rpc/deprecated/getFeeRateGovernor",
    },
    {
      source: "/docs/rpc/http/getFeeRateGovernor",
      destination: "/docs/rpc/deprecated/getFeeRateGovernor",
    },
    {
      source: "/docs/rpc/getFees",
      destination: "/docs/rpc/deprecated/getFees",
    },
    {
      source: "/docs/rpc/http/getFees",
      destination: "/docs/rpc/deprecated/getFees",
    },
    {
      source: "/docs/rpc/http/getRecentBlockhash",
      destination: "/docs/rpc/deprecated/getRecentBlockhash",
    },
    {
      source: "/docs/rpc/getRecentBlockhash",
      destination: "/docs/rpc/deprecated/getRecentBlockhash",
    },
    {
      source: "/docs/rpc/http/getSnapshotSlot",
      destination: "/docs/rpc/deprecated/getSnapshotSlot",
    },
    {
      source: "/docs/rpc/getSnapshotSlot",
      destination: "/docs/rpc/deprecated/getSnapshotSlot",
    },
    {
      source: "/docs/rpc/http/getStakeActivation",
      destination: "/docs/rpc/deprecated/getStakeActivation",
    },
    {
      source: "/docs/rpc/getAccountInfo",
      destination: "/docs/rpc/http/getAccountInfo",
    },
    {
      source: "/docs/rpc/getBalance",
      destination: "/docs/rpc/http/getBalance",
    },
    {
      source: "/docs/rpc/getBlock",
      destination: "/docs/rpc/http/getBlock",
    },
    {
      source: "/docs/rpc/getBlockCommitment",
      destination: "/docs/rpc/http/getBlockCommitment",
    },
    {
      source: "/docs/rpc/getBlockHeight",
      destination: "/docs/rpc/http/getBlockHeight",
    },
    {
      source: "/docs/rpc/getBlockProduction",
      destination: "/docs/rpc/http/getBlockProduction",
    },
    {
      source: "/docs/rpc/getBlocks",
      destination: "/docs/rpc/http/getBlocks",
    },
    {
      source: "/docs/rpc/getBlocksWithLimit",
      destination: "/docs/rpc/http/getBlocksWithLimit",
    },
    {
      source: "/docs/rpc/getBlockTime",
      destination: "/docs/rpc/http/getBlockTime",
    },
    {
      source: "/docs/rpc/getClusterNodes",
      destination: "/docs/rpc/http/getClusterNodes",
    },
    {
      source: "/docs/rpc/getEpochInfo",
      destination: "/docs/rpc/http/getEpochInfo",
    },
    {
      source: "/docs/rpc/getEpochSchedule",
      destination: "/docs/rpc/http/getEpochSchedule",
    },
    {
      source: "/docs/rpc/getFeeForMessage",
      destination: "/docs/rpc/http/getFeeForMessage",
    },
    {
      source: "/docs/rpc/getFirstAvailableBlock",
      destination: "/docs/rpc/http/getFirstAvailableBlock",
    },
    {
      source: "/docs/rpc/getGenesisHash",
      destination: "/docs/rpc/http/getGenesisHash",
    },
    {
      source: "/docs/rpc/getHealth",
      destination: "/docs/rpc/http/getHealth",
    },
    {
      source: "/docs/rpc/getHighestSnapshotSlot",
      destination: "/docs/rpc/http/getHighestSnapshotSlot",
    },
    {
      source: "/docs/rpc/getIdentity",
      destination: "/docs/rpc/http/getIdentity",
    },
    {
      source: "/docs/rpc/getInflationGovernor",
      destination: "/docs/rpc/http/getInflationGovernor",
    },
    {
      source: "/docs/rpc/getInflationRate",
      destination: "/docs/rpc/http/getInflationRate",
    },
    {
      source: "/docs/rpc/getInflationReward",
      destination: "/docs/rpc/http/getInflationReward",
    },
    {
      source: "/docs/rpc/getLargestAccounts",
      destination: "/docs/rpc/http/getLargestAccounts",
    },
    {
      source: "/docs/rpc/getLatestBlockhash",
      destination: "/docs/rpc/http/getLatestBlockhash",
    },
    {
      source: "/docs/rpc/getLeaderSchedule",
      destination: "/docs/rpc/http/getLeaderSchedule",
    },
    {
      source: "/docs/rpc/getMaxRetransmitSlot",
      destination: "/docs/rpc/http/getMaxRetransmitSlot",
    },
    {
      source: "/docs/rpc/getMaxShredInsertSlot",
      destination: "/docs/rpc/http/getMaxShredInsertSlot",
    },
    {
      source: "/docs/rpc/getMinimumBalanceForRentExemption",
      destination: "/docs/rpc/http/getMinimumBalanceForRentExemption",
    },
    {
      source: "/docs/rpc/getMultipleAccounts",
      destination: "/docs/rpc/http/getMultipleAccounts",
    },
    {
      source: "/docs/rpc/getProgramAccounts",
      destination: "/docs/rpc/http/getProgramAccounts",
    },
    {
      source: "/docs/rpc/getRecentPerformanceSamples",
      destination: "/docs/rpc/http/getRecentPerformanceSamples",
    },
    {
      source: "/docs/rpc/getRecentPrioritizationFees",
      destination: "/docs/rpc/http/getRecentPrioritizationFees",
    },
    {
      source: "/docs/rpc/getSignaturesForAddress",
      destination: "/docs/rpc/http/getSignaturesForAddress",
    },
    {
      source: "/docs/rpc/getSignatureStatuses",
      destination: "/docs/rpc/http/getSignatureStatuses",
    },
    {
      source: "/docs/rpc/getSlot",
      destination: "/docs/rpc/http/getSlot",
    },
    {
      source: "/docs/rpc/getSlotLeader",
      destination: "/docs/rpc/http/getSlotLeader",
    },
    {
      source: "/docs/rpc/getSlotLeaders",
      destination: "/docs/rpc/http/getSlotLeaders",
    },
    {
      source: "/docs/rpc/getStakeMinimumDelegation",
      destination: "/docs/rpc/http/getStakeMinimumDelegation",
    },
    {
      source: "/docs/rpc/getSupply",
      destination: "/docs/rpc/http/getSupply",
    },
    {
      source: "/docs/rpc/getTokenAccountBalance",
      destination: "/docs/rpc/http/getTokenAccountBalance",
    },
    {
      source: "/docs/rpc/getTokenAccountsByDelegate",
      destination: "/docs/rpc/http/getTokenAccountsByDelegate",
    },
    {
      source: "/docs/rpc/getTokenAccountsByOwner",
      destination: "/docs/rpc/http/getTokenAccountsByOwner",
    },
    {
      source: "/docs/rpc/getTokenLargestAccounts",
      destination: "/docs/rpc/http/getTokenLargestAccounts",
    },
    {
      source: "/docs/rpc/getTokenSupply",
      destination: "/docs/rpc/http/getTokenSupply",
    },
    {
      source: "/docs/rpc/getTransaction",
      destination: "/docs/rpc/http/getTransaction",
    },
    {
      source: "/docs/rpc/getTransactionCount",
      destination: "/docs/rpc/http/getTransactionCount",
    },
    {
      source: "/docs/rpc/getVersion",
      destination: "/docs/rpc/http/getVersion",
    },
    {
      source: "/docs/rpc/getVoteAccounts",
      destination: "/docs/rpc/http/getVoteAccounts",
    },
    {
      source: "/docs/rpc/isBlockhashValid",
      destination: "/docs/rpc/http/isBlockhashValid",
    },
    {
      source: "/docs/rpc/minimumLedgerSlot",
      destination: "/docs/rpc/http/minimumLedgerSlot",
    },
    {
      source: "/docs/rpc/requestAirdrop",
      destination: "/docs/rpc/http/requestAirdrop",
    },
    {
      source: "/docs/rpc/sendTransaction",
      destination: "/docs/rpc/http/sendTransaction",
    },
    {
      source: "/docs/rpc/simulateTransaction",
      destination: "/docs/rpc/http/simulateTransaction",
    },
    {
      source: "/docs/rpc/accountSubscribe",
      destination: "/docs/rpc/websocket/accountSubscribe",
    },
    {
      source: "/docs/rpc/accountUnsubscribe",
      destination: "/docs/rpc/websocket/accountUnsubscribe",
    },
    {
      source: "/docs/rpc/blockSubscribe",
      destination: "/docs/rpc/websocket/blockSubscribe",
    },
    {
      source: "/docs/rpc/blockUnsubscribe",
      destination: "/docs/rpc/websocket/blockUnsubscribe",
    },
    {
      source: "/docs/rpc/logsSubscribe",
      destination: "/docs/rpc/websocket/logsSubscribe",
    },
    {
      source: "/docs/rpc/logsUnsubscribe",
      destination: "/docs/rpc/websocket/logsUnsubscribe",
    },
    {
      source: "/docs/rpc/programSubscribe",
      destination: "/docs/rpc/websocket/programSubscribe",
    },
    {
      source: "/docs/rpc/programUnsubscribe",
      destination: "/docs/rpc/websocket/programUnsubscribe",
    },
    {
      source: "/docs/rpc/rootSubscribe",
      destination: "/docs/rpc/websocket/rootSubscribe",
    },
    {
      source: "/docs/rpc/rootUnsubscribe",
      destination: "/docs/rpc/websocket/rootUnsubscribe",
    },
    {
      source: "/docs/rpc/signatureSubscribe",
      destination: "/docs/rpc/websocket/signatureSubscribe",
    },
    {
      source: "/docs/rpc/signatureUnsubscribe",
      destination: "/docs/rpc/websocket/signatureUnsubscribe",
    },
    {
      source: "/docs/rpc/slotSubscribe",
      destination: "/docs/rpc/websocket/slotSubscribe",
    },
    {
      source: "/docs/rpc/slotsUpdatesSubscribe",
      destination: "/docs/rpc/websocket/slotsUpdatesSubscribe",
    },
    {
      source: "/docs/rpc/slotsUpdatesUnsubscribe",
      destination: "/docs/rpc/websocket/slotsUpdatesUnsubscribe",
    },
    {
      source: "/docs/rpc/slotUnsubscribe",
      destination: "/docs/rpc/websocket/slotUnsubscribe",
    },
    {
      source: "/docs/rpc/voteSubscribe",
      destination: "/docs/rpc/websocket/voteSubscribe",
    },
    {
      source: "/docs/rpc/voteUnsubscribe",
      destination: "/docs/rpc/websocket/voteUnsubscribe",
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
      destination: "/developers/guides/getstarted/hello-world-in-your-browser",
    },
    {
      source: "/developers/guides/solana-playground",
      destination: "/developers/guides/getstarted/hello-world-in-your-browser",
    },
    {
      source: "/developers/guides/solang/solang-getting-started",
      destination: "/developers/guides/getstarted/hello-world-in-your-browser",
    },
    {
      source: "/developers/guides/solang-getting-started",
      destination: "/developers/guides/getstarted/hello-world-in-your-browser",
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
  ],
};
