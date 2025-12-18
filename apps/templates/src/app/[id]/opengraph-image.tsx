import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "Solana Template";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const formatTemplateName = (name: string) => {
    let cleanName = name;
    if (name.startsWith("solana-")) {
      cleanName = name.replace("solana-", "");
    }
    const parts = cleanName.split("-");
    const techTerms: Record<string, string> = {
      ui: "UI",
      api: "API",
      sdk: "SDK",
      nft: "NFT",
      defi: "DeFi",
      dao: "DAO",
      cli: "CLI",
      nextjs: "Next.js",
      next: "Next.js",
      tailwind: "Tailwind",
      typescript: "TypeScript",
      javascript: "JavaScript",
      react: "React",
      vite: "Vite",
      expo: "Expo",
      nodejs: "Node.js",
      node: "Node",
      express: "Express",
      web3js: "Web3.js",
      gill: "Gill",
      mobile: "Mobile",
      dapp: "dApp",
      spl: "SPL",
    };
    const formattedParts = parts.map(
      (part) => techTerms[part.toLowerCase()] || part,
    );
    return formattedParts.join("-");
  };

  const generateDescription = (name: string) => {
    const parts = name.toLowerCase().split("-");
    const tech = [];
    let type = "template";
    if (parts.includes("next") || parts.includes("nextjs"))
      tech.push("Next.js");
    if (parts.includes("react")) tech.push("React");
    if (parts.includes("vite")) tech.push("Vite");
    if (parts.includes("tailwind")) tech.push("Tailwind CSS");
    if (parts.includes("typescript")) tech.push("TypeScript");
    if (parts.includes("expo")) tech.push("Expo");
    if (parts.includes("express")) tech.push("Express");
    if (parts.includes("node") || parts.includes("nodejs"))
      tech.push("Node.js");
    if (parts.includes("web3js")) tech.push("Web3.js");
    if (parts.includes("gill")) tech.push("Gill (based on @solana/kit)");
    if (parts.includes("mobile")) type = "mobile template";
    if (parts.includes("basic")) type = "starter template";
    if (parts.includes("counter")) type = "counter app template";
    if (parts.includes("wallet")) type = "wallet integration template";
    if (tech.length > 0) {
      return `${tech.join(", ")} ${type} with Wallet UI integration`;
    }
    return `Solana development ${type}`;
  };

  const generateKeywords = (name: string) => {
    const parts = name.toLowerCase().split("-");
    const keywords = new Set<string>();
    keywords.add("solana");
    const keywordMap: Record<string, string[]> = {
      next: ["nextjs", "react"],
      nextjs: ["nextjs", "react"],
      react: ["react"],
      vite: ["vite", "build-tool"],
      tailwind: ["tailwind", "css"],
      typescript: ["typescript"],
      javascript: ["javascript"],
      expo: ["expo", "mobile", "react-native"],
      mobile: ["mobile", "react-native"],
      express: ["express", "nodejs", "api"],
      node: ["nodejs"],
      nodejs: ["nodejs"],
      web3js: ["web3js", "blockchain"],
      gill: ["gill", "solana-kit"],
      wallet: ["wallet", "wallet-ui"],
      basic: ["starter", "template"],
      counter: ["dapp", "example"],
    };
    parts.forEach((part) => {
      if (keywordMap[part]) {
        keywordMap[part].forEach((k) => keywords.add(k));
      } else if (part !== "solana") {
        keywords.add(part);
      }
    });
    return Array.from(keywords);
  };

  const displayName = formatTemplateName(id);
  const description = generateDescription(id);
  const keywords = generateKeywords(id);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "60px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 30%, rgba(20, 241, 149, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(153, 69, 255, 0.08) 0%, transparent 50%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
            maxWidth: "1000px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "700",
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.03em",
              lineHeight: 1,
              margin: 0,
              padding: "20px 0",
              backgroundImage:
                "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            {displayName}
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "28px",
                color: "#e2e8f0",
                margin: 0,
                maxWidth: "800px",
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              {keywords.slice(0, 6).map((keyword) => (
                <span
                  key={keyword}
                  style={{
                    fontSize: "18px",
                    color: "#94a3b8",
                    background: "rgba(255, 255, 255, 0.06)",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control":
          "public, immutable, no-transform, s-maxage=31536000, max-age=31536000",
      },
    },
  );
}
