/** @jsxImportSource preact */
import type { FabMenuConfig } from "./types";
import { SolanaMonoIcon } from "./icons/solana-mono";
import { SolanaColorIcon } from "./icons/solana-color";

interface FabButtonProps {
  config: FabMenuConfig;
  onClick: () => void;
}

function getPositionClass(
  position: FabMenuConfig["position"],
): string | undefined {
  if (typeof position === "string") {
    return `sfab-pos-${position}`;
  }
  return undefined;
}

function getPositionStyle(
  position: FabMenuConfig["position"],
): Record<string, string> | undefined {
  if (typeof position === "object" && position !== null) {
    const style: Record<string, string> = {};
    if (position.top) style.top = position.top;
    if (position.bottom) style.bottom = position.bottom;
    if (position.left) style.left = position.left;
    if (position.right) style.right = position.right;
    return style;
  }
  return undefined;
}

function getVariantClass(variant: FabMenuConfig["logoVariant"]): string {
  switch (variant) {
    case "light-mono":
      return " sfab-button--light-mono";
    case "color":
      return " sfab-button--color";
    case "dark-mono":
    default:
      return " sfab-button--dark-mono";
  }
}

export function FabButton({ config, onClick }: FabButtonProps) {
  const position = config.position ?? "bottom-right";
  const variant = config.logoVariant ?? "dark-mono";
  const posClass = getPositionClass(position);
  const posStyle = getPositionStyle(position);

  const Icon = variant === "color" ? SolanaColorIcon : SolanaMonoIcon;

  return (
    <button
      type="button"
      class={`sfab-button${posClass ? ` ${posClass}` : ""}${getVariantClass(variant)}`}
      style={{
        "--sfab-z-index": String(config.zIndex ?? 999999),
        ...posStyle,
      }}
      onClick={onClick}
      aria-label="Get Started with Solana"
    >
      <Icon />
    </button>
  );
}
