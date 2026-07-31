import {
  formatUpgradePublishedDate,
  getUpgradeTitleFontSize,
} from "@/lib/upgrades/social-image";

type UpgradeBadge = {
  text: string;
  color: string;
  variant: string;
};

type UpgradeMetric = {
  value: string;
  label: string;
};

type UpgradeSocialImageProps = {
  title: string;
  subtitle?: string | null;
  publishedAt?: string | null;
  authorName: string;
  badges: UpgradeBadge[];
  metrics: UpgradeMetric[];
};

const badgeColorMap: Record<
  string,
  { backgroundColor: string; borderColor: string; color: string }
> = {
  green: {
    backgroundColor: "rgba(20, 241, 149, 0.08)",
    borderColor: "rgba(20, 241, 149, 0.35)",
    color: "#42E6A3",
  },
  yellow: {
    backgroundColor: "rgba(234, 179, 8, 0.08)",
    borderColor: "rgba(234, 179, 8, 0.35)",
    color: "#FACC15",
  },
  red: {
    backgroundColor: "rgba(244, 63, 94, 0.08)",
    borderColor: "rgba(244, 63, 94, 0.35)",
    color: "#FB7185",
  },
  purple: {
    backgroundColor: "rgba(153, 69, 255, 0.08)",
    borderColor: "rgba(153, 69, 255, 0.35)",
    color: "#C084FC",
  },
};

export function UpgradeSocialImage({
  title,
  subtitle,
  publishedAt,
  authorName,
  badges,
  metrics,
}: UpgradeSocialImageProps) {
  const publishedDate = formatUpgradePublishedDate(publishedAt);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#030308",
        backgroundImage:
          "linear-gradient(115deg, #172A3F 0%, #060813 50%, #0B2F20 100%)",
        color: "#FFFFFF",
        fontFamily: "ABC Diatype",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage:
            "linear-gradient(0deg, rgba(67, 26, 107, 0.7) 0%, rgba(3, 3, 8, 0) 62%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "28px 30px 30px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {badges.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 28,
              }}
            >
              {badges.map((badge, index) => {
                const palette =
                  badgeColorMap[badge.color] ?? badgeColorMap.green!;

                return badge.variant === "text" ? (
                  <span
                    key={`${badge.text}-${index}`}
                    style={{
                      color: "#8D8D9D",
                      fontSize: 18,
                      lineHeight: 1,
                    }}
                  >
                    {badge.text}
                  </span>
                ) : (
                  <span
                    key={`${badge.text}-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 18px 7px",
                      border: `1px solid ${palette.borderColor}`,
                      borderRadius: 999,
                      backgroundColor: palette.backgroundColor,
                      color: palette.color,
                      fontSize: 18,
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    {badge.text}
                  </span>
                );
              })}
            </div>
          )}

          <div
            style={{
              display: "flex",
              maxWidth: 1140,
              fontSize: getUpgradeTitleFontSize(title),
              fontWeight: 500,
              letterSpacing: "-2.2px",
              lineHeight: 0.98,
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                display: "flex",
                maxWidth: 1120,
                marginTop: 24,
                color: "#C6C6D0",
                fontSize: 30,
                lineHeight: 1.15,
              }}
            >
              {subtitle}
            </div>
          )}

          {(publishedDate || authorName) && (
            <div
              style={{
                display: "flex",
                marginTop: 30,
                color: "#9696A6",
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              {publishedDate}
              {publishedDate && authorName ? ", by " : ""}
              {authorName}
            </div>
          )}
        </div>

        {metrics.length > 0 && (
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: 22,
              marginTop: 26,
            }}
          >
            {metrics.map((metric, index) => (
              <div
                key={`${metric.value}-${index}`}
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: 138,
                  padding: "20px 36px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018))",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    marginBottom: 12,
                    backgroundImage:
                      "linear-gradient(90deg, #14F195 0%, #80D7EE 58%, #A879FF 100%)",
                    backgroundClip: "text",
                    color: "transparent",
                    fontSize: 50,
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    display: "flex",
                    color: "#9696A6",
                    fontSize: 19,
                    lineHeight: 1.2,
                  }}
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
