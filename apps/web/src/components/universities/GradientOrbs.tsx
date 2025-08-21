import React from "react";

export interface OrbConfig {
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size: string; // e.g., "400px", "500px"
  color: "green" | "purple";
  opacity?: number; // 0-100
  blur?: number; // blur amount in px
}

interface GradientOrbsProps {
  orbs: OrbConfig[];
}

const colorMap = {
  green: "#14F195",
  purple: "#9945FF",
};

export default function GradientOrbs({ orbs }: GradientOrbsProps) {
  return (
    <>
      {orbs.map((orb, index) => {
        const { position, size, color, opacity = 20, blur = 120 } = orb;

        const style: React.CSSProperties = {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: colorMap[color],
          opacity: opacity / 100,
          filter: `blur(${blur}px)`,
          ...position,
        };

        return <div key={`orb-${index}`} style={style} aria-hidden="true" />;
      })}
    </>
  );
}

// Preset configurations for common patterns
export const orbPresets = {
  topRightGreen: {
    position: { top: "10%", right: "-200px" },
    size: "400px",
    color: "green" as const,
    opacity: 15,
    blur: 120,
  },
  bottomLeftPurple: {
    position: { bottom: "20%", left: "-150px" },
    size: "350px",
    color: "purple" as const,
    opacity: 20,
    blur: 100,
  },
  topLeftGreen: {
    position: { top: "50%", left: "-150px", transform: "translateY(-50%)" },
    size: "350px",
    color: "green" as const,
    opacity: 15,
    blur: 150,
  },
  topRightPurple: {
    position: { top: "20%", right: "-250px" },
    size: "500px",
    color: "purple" as const,
    opacity: 15,
    blur: 150,
  },
  bottomLeftPurpleSmall: {
    position: { bottom: "10%", left: "-150px" },
    size: "400px",
    color: "purple" as const,
    opacity: 10,
    blur: 120,
  },
};
