export const stablecoinCoverageProviders = [
  "Allium",
  "DeFiLlama",
  "Dune",
  "RWA",
  "Top Ledger",
] as const;

export type StablecoinCoverageProvider =
  (typeof stablecoinCoverageProviders)[number];

export type StablecoinCoverageRow = {
  coverage: Record<StablecoinCoverageProvider, boolean>;
  mintAddress: string;
  token: string;
};

type CoverageFlags = [
  allium: boolean,
  defiLlama: boolean,
  dune: boolean,
  rwa: boolean,
  topLedger: boolean,
];

function row(
  token: string,
  mintAddress: string,
  flags: CoverageFlags,
): StablecoinCoverageRow {
  return {
    coverage: Object.fromEntries(
      stablecoinCoverageProviders.map((provider, index) => [
        provider,
        flags[index],
      ]),
    ) as Record<StablecoinCoverageProvider, boolean>,
    mintAddress,
    token,
  };
}

const Y = true;
const N = false;

// Flags: Allium, DeFiLlama, Dune, RWA, Top Ledger
// prettier-ignore
export const stablecoinCoverageRows: StablecoinCoverageRow[] = [
  row("USDT", "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", [Y, Y, Y, Y, Y]),
  row("USDC", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", [Y, Y, Y, Y, Y]),
  row("USDS", "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA", [Y, Y, Y, Y, Y]),
  row("USDE", "DEkqHyPN7GMRJ5cArtQFAWefqbZb33Hyf6s5iCwjEonT", [Y, Y, Y, Y, Y]),
  row("USD1", "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB", [Y, Y, Y, Y, Y]),
  row("USDG", "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH", [Y, Y, Y, Y, Y]),
  row("PYUSD", "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo", [Y, Y, Y, Y, Y]),
  row("USDGO", "72puLt71H93Z9CzHuBRTwFpL4TG3WZUhnoCC7p8gxigu", [Y, Y, Y, Y, Y]),
  row("OUSD", "ousd2mJsPEckLHcSCDxyKD7NDGARZcfLbDZkKiatYHB", [Y, Y, Y, N, N]),
  row("EURC", "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr", [Y, Y, Y, Y, Y]),
  row("USDTB", "8yXrtJ54jZtE84xEBzTESKuegjcAkAuDrdAhRd8i8n3T", [Y, Y, Y, Y, N]),
  row("APXUSD", "HAYQtfJEQ9DbDbaHEhxfGsWbSZ3ywthdsVB3PuB72DYe", [Y, N, N, N, N]),
  row("SOFID", "APhcqtzE73es3KAGiVksZFMLGwJDiAey5qZKUrQHEHfS", [Y, Y, N, Y, N]),
  row("FDUSD", "9zNQRsGLjNKwCUU5Gq5LR8beUCPzQMVMqKAi3SSZh54u", [Y, Y, Y, Y, Y]),
  row("USX", "6FrrzDk5mQARGc1TDYoyVnSyRdds1t4PbtohCD6p3tgG", [Y, Y, Y, Y, Y]),
  row("EURCV", "DghpMkatCiUsofbTmid3M3kAbDTPqDwKiYHnudXeGG52", [Y, Y, Y, Y, N]),
  row("AUSD", "AUSD1jCcCyPLybk1YnvPWsHQSrZ46dxwoMniN4N2UEB9", [Y, Y, Y, Y, Y]),
  row("CASH", "CASHx9KJUStyftLFWGvEVf59SGeG9sh5FfcnZMVPCASH", [Y, Y, Y, Y, N]),
  row("FRXUSD", "GzX1ireZDU865FiMaKrdVB1H6AE8LAqWYCg6chrMrfBw", [Y, Y, N, Y, N]),
  row("WM", "mzeroXDoBpRVhnEXBra27qzAMdxgpWVY3DzQW7xMVJp", [N, N, N, N, N]),
  row("USDU", "9ckR7pPPvyPadACDTzLwK2ZAEeUJ3qGSnzPs8bVaHrSy", [Y, Y, Y, Y, N]),
  row("BRZ", "BRZbFNQDcWLfcdHmAkqEVnLHCAWKTRf6eHyEaWdZp3JN", [Y, N, N, N, N]),
  row("CHFAU", "3GJfXJvPcjuAu6VQZmcs9pAXQau8nz3z88CCpBztgQSv", [Y, N, N, N, N]),
  row("JUPUSD", "JuprjznTrTSp2UFa3ZBUFgwdAmtZCq4MQCwysN55USD", [Y, Y, Y, Y, N]),
  row("XUSD", "4UbvZiomFvXDnZSz6vdHiDNiHozH2ykTEqjhhbVHiv9z", [N, N, N, N, N]),
  row("TGBP", "2zMqyX4AYCk6mgy5UZ2S7zUaLxwERhK5WjqDzkPPbSpW", [Y, Y, N, Y, N]),
  row("HYUSD", "5YMkXAYccHSGnHn9nob9xEvv6Pvka9DZWH7nTbotTu9E", [Y, Y, Y, Y, N]),
  row("USDP", "HVbpJAQGNpkgBaYBZQBR1t7yFdvaYVp2vCQQfKKEN4tM", [Y, Y, Y, Y, Y]),
  row("USDPT", "HVWf8JmLoHs99Lw8Psf3fyqAtA4crWxCPkrmSdNjhNH3", [Y, Y, Y, Y, N]),
  row("EUROP", "euro5sNHrZC2wu2RoLvy6xxoVMc3Qnd1vjxoWf4MftA", [Y, Y, N, Y, N]),
  row("XSGD", "71S9cppWipeUEQDFngYwxjoxB6Sz1MUqX72byLsVYJqy", [Y, N, N, N, N]),
  row("SBC", "DBAzBUXaLj1qANCseUPZz4sp9F8d2sc78C4vKjhbTGMA", [Y, Y, N, Y, N]),
  row("EUSD", "HQMYCZTDq9g3oZejDRUeQsFtLKgyfvBpD3yHaTnain3L", [Y, Y, N, N, N]),
  row("USDV", "USDvUSpnhCr9yBgj3UyVrD239HRUv4RsHwH2FxsWuMk", [Y, Y, N, N, N]),
  row("DUSD", "DUSDt4AeLZHWYmcXnVGYdgAzjtzU5mXUVnTMdnSzAttM", [Y, Y, Y, Y, N]),
  row("VCHF", "AhhdRu5YZdjVkKR3wbnUDaymVQL2ucjMQ63sZ3LFHsch", [Y, Y, Y, Y, Y]),
  row("ZARP", "dngKhBQM3BGvsDHKhrLnjvRKfY5Q7gEnYGToj9Lk8rk", [Y, N, Y, N, Y]),
  row("AUDD", "AUDDttiEpCydTm7joUMbYddm72jAWXZnCpPZtDoxqBSw", [Y, Y, Y, Y, N]),
  row("ZARU", "2WvREMqcoxtGuKTyyuzVMH7xDkeH8mY6phduvUofPRXN", [N, N, N, N, N]),
  row("CNGN", "3jiqwBQVRC5zRwHyqvnkQurebJ5RNxg3F5fXMwaxgkv8", [Y, N, N, N, N]),
  row("AUDX", "AUDXrwm6dhhAw4aaXPemvS5ZJR7am2KUZ2axLL9TVff4", [N, N, N, N, N]),
  row("GYEN", "Crn4x1Y2HUKko7ox2EZMT6N2t2ZyH7eKtwkBGVnhEq1g", [Y, Y, Y, Y, Y]),
  row("GBPA", "DYoCmA91VE8REbWNw3kM736PN7vv97qc2jr5wmUbuNtZ", [Y, Y, Y, Y, N]),
  row("AUDM", "CiYXBwHPrdNkMtxR8YEWKv78K6bQjFoEWhPQrZqEmubi", [Y, Y, N, Y, N]),
  row("MYRC", "myrcAs6bpP2g5oGHZ3qpgrfZQAFkbo9KUHdqYDXMjGv", [Y, N, N, N, N]),
  row("IDRX", "idrxZcP8xiKkYk6XGD4uz1dxEYCWSgKDHqgjsBbwDur", [Y, N, N, N, N]),
  row("USTC", "CXLBjMMcwkc17GfJtBos6rQCo1ypeH6eDbB82Kby4MRm", [Y, N, N, N, N]),
  row("SUSD", "susdabGDNbhrnCa6ncrYo81u4s9GM8ecK2UwMyZiq4X", [Y, Y, N, N, Y]),
  row("GGUSD", "GGUSDyBUPFg5RrgWwqEqhXoha85iYGs6cL57SyK4G2Y7", [Y, Y, Y, N, Y]),
  row("EURAU", "9pCWprxbZMW2rYSMhPTeoyLMV2sN2WJqshdT7DQVt6hS", [Y, N, N, Y, N]),
  row("UXD", "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT", [Y, Y, Y, N, N]),
  row("VGBP", "5H4voZhzySsVvwVYDAKku8MZGuYBC7cXaBKDPW4YHWW1", [Y, Y, Y, N, Y]),
  row("UST", "9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i", [Y, N, N, N, N]),
  row("USDT", "Dn4noZ5jgGfkntzcQSUZ8czkreiZ1ForXYoV2H8Dm7S1", [Y, N, N, N, N]),
  row("USDH", "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX", [Y, Y, Y, N, N]),
  row("USDCET", "A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM", [Y, N, Y, N, N]),
  row("FRNT", "FRNTPi9V3Sw9b9U8d5Q3WY7tNANT6Q394d7dYtv7Jdog", [Y, Y, N, Y, N]),
  row("RD", "RD1S1CMtHEQyxmRVnoFRTwq24SAwDHJGikgo8Q23eRD", [Y, N, N, N, N]),
  row("MOVEUSD", "3AdhVEX6k85yNivHVXDEiY3WyP2WgFQTUZCahGaeC2qm", [Y, Y, Y, N, Y]),
  row("ORD", "ordRfw9q3nTSK5DR2H9o1SA6TtL3HRzAMKVXQsigayp", [Y, N, N, N, N]),
  row("USDB", "ENL66PGy8d8j5KNqLtCcg4uidDUac5ibt45wbjH9REzB", [Y, N, N, N, N]),
  row("SQUSD", "8D9XrAWLNHYY3skSrpgkcwrr3zTp7Jr5pkiQyjfsiv7t", [Y, N, N, N, N]),
  row("BRZ", "FtgGSFADXBtroxq8VCausXRr2of47QBf5AS1NtZCu4GD", [Y, N, Y, Y, Y]),
  row("TAKO", "He1ZD1o5WTUCHz5QoVMSdfhZjyqecVgYK75TUg95rnhL", [Y, N, N, N, N]),
  row("XO", "xoUSDq85Rjsb6SbUwJyreFgeWQvxdkT7R3c3g7s6p5Y", [Y, N, N, N, N]),
  row("M", "mzerokyEX9TNDoK4o2YZQBDmMzjokAeN6M2g2S3pLJo", [Y, Y, N, N, N]),
  row("USDON", "ZPFtoCe7WWqG4N3ZFRccS8T9SMBeHsd1Vmgv2i7ondo", [N, N, N, Y, N]),
  row("USDV", "u2jUWdHS5HxpHvea2s653JZ4cTg3HFD4K1KkSuPRrua", [Y, N, N, N, N]),
  row("LAVAUSD", "ENiQN61NU5Sq2h3QY5ZpV9SJpyfRvRCNGNgUdB3Lr6yP", [Y, N, N, N, N]),
  row("MAI", "9mWRABuz2x6koTPCWiCPM49WUbcrNqGTHBV9T9k7y1o7", [Y, N, N, N, N]),
  row("USDCV", "8smindLdDuySY6i2bStQX9o8DVhALCXCMbNxD98unx35", [Y, Y, N, Y, N]),
  row("YU", "YUYAiJo8KVbnc6Fb6h3MnH2VGND4uGWDH4iLnw7DLEu", [Y, Y, N, N, N]),
  row("USDX", "9Gst2E7KovZ9jwecyGqnnhpG1mhHKdyLpJQnZonkCFhA", [N, N, Y, Y, N]),
  row("MXNE", "6zYgzrT7X2wi9a9NeMtUvUWLLmf2a8vBsbYkocYdB9wa", [Y, N, Y, Y, Y]),
  row("VEUR", "C4Kkr9NZU3VbyedcgutU6LKmi6MKz81sx6gRmk5pX519", [Y, Y, Y, Y, Y]),
  row("USDT", "5goWRao6a3yNC4d6UjMdQxonkCMvKBwdpubU3qhfcdf1", [Y, N, N, N, N]),
  row("TRYB", "A94X2fRy3wydNShU4dRaDyap2UuoeWJGWyATtyp61WZf", [Y, Y, Y, N, Y]),
  row("EUROE", "2VhjJ9WxaGC3EZFwJG9BDUs9KxKCAjQY4vgd1qxgYWVg", [Y, Y, Y, Y, Y]),
  row("USDT", "DNhZkUaxHXYvpxZ7LNnHtss8sQgdAfd1ZYS1fB7LKWUZ", [Y, N, N, N, N]),
  row("USDC", "E2VmbootbVCBkMNNxKQgCLMS1X3NoGMaYAsufaAsf7M", [Y, N, N, N, N]),
  row("AFRI", "Fk9mK6eHhPbzx2FEJZY9Usxt2jBS3dz8fu8a7wijRzy3", [Y, N, N, N, N]),
  row("CADC", "9ewjJpmD1ES83RDRFnHs7V2hUdH76WAVjdvu6UV6WNo7", [Y, N, N, N, N]),
  row("FRAX", "FR87nWEUxVgerFGhZM8Y4AggKGLnaXswr1Pd8wZ4kZcp", [Y, Y, N, N, N]),
  row("USDO", "BnANu5CtUogLqcvBNByJuwaRvRxNtVuDcAytwjsUUtqs", [Y, N, N, Y, N]),
  row("QCAD", "EeBX9JLdvsp4HnBbMgC1HnAjBkBQxgxtWxspcCLtT6ci", [Y, Y, N, Y, N]),
  row("ZUSD", "FrBfWJ4qE5sCzKm3k3JaAtqZcXUh4LvJygDeketsrsH4", [N, Y, Y, Y, Y]),
  row("USDTB", "5hVfCMHKKcb4rcB9BLYkM3ZRkvvyjaUU1LVcSAQyASbS", [N, N, N, Y, N]),
  row("RUSD", "Ejqkht2dyN1BaaEtK92zBKY6S8HbVH8APB5sDK9Rmokt", [Y, Y, Y, N, N]),
  row("WUSD", "EczfGov7Mia54FLP6Stz3kttWsUA2fv4vtDTKLuyAPDN", [Y, N, N, N, N]),
  row("BILS", "CDxFUPSRK4dC68jWV7SCPezU1vNYXz87Y6fjhhRvsuhd", [Y, N, N, N, N]),
  row("USAD", "DHsUQZYRqZ5WNEHZxL5evnAt7A7W19BJ5GxUdJz3NcPh", [N, N, N, N, N]),
  row("AEDZ", "BMrgsEdrqfP4EAhiRbK5fFkq8xgQrqDAcZrv8R2pG4zG", [Y, N, N, N, N]),
  row("TEST", "A5nvoNHLmJ4ydL5KroxphCX4umFwcn8VWb4kXm7L6sXn", [Y, N, N, N, N]),
  row("USDV", "Ex5DaKYMCN6QWFA4n67TmMwsH8MJV68RX6YXTmVM532C", [Y, N, Y, N, N]),
  row("ABBUSD", "6nuaX3ogrr2CaoAPjtaKHAoBNWok32BMcRozuf32s2QF", [N, N, N, N, N]),
  row("ACUSD", "EwxNF8g9UfmsJVcZFTpL9Hx5MCkoQFoJi6XNWzKf1j8e", [Y, N, N, N, N]),
  row("BUSD", "5RpUwQ8wtdPCZHhu6MERp2RGrpobsbZ6MH5dDHkUjs2", [N, Y, N, N, N]),
  row("DAI", "EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o", [Y, Y, N, N, N]),
  row("HUSD", "7VQo3HFLNH5QqGtM8eC3XQbPkJUu7nS9LeGWjerRh5Sw", [Y, Y, N, N, N]),
  row("SUSDC-9", "JEFFSQ3s8T3wKsvp4tnRAsUBW7Cqgnf8ukBZC4C8XBm1", [Y, N, N, N, N]),
  row("IDRX", "idrxTdNftk6tYedPv2M7tCFHBVCpk5rkiNRd8yUArhr", [Y, N, Y, N, N]),
];
