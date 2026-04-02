import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { FabMenuConfig, MenuData } from "./types";
import { fetchMenuData } from "./fetch-config";
import { DEFAULT_MENU_DATA } from "./defaults";
import { FabButton } from "./fab-button";
import { ExplorePanel } from "./explore-panel";

interface FabAppProps {
  config: FabMenuConfig;
}

export function FabApp({ config }: FabAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuData, setMenuData] = useState<MenuData>(DEFAULT_MENU_DATA);

  useEffect(() => {
    fetchMenuData(config.apiUrl).then(setMenuData);
  }, [config.apiUrl]);

  const handleOpen = () => {
    setIsOpen(true);
    config.onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    config.onClose?.();
  };

  const themeVars = config.theme
    ? Object.entries(config.theme).reduce<Record<`--sfab-${string}`, string>>(
        (acc, [key, value]) => {
          if (value) {
            const cssVar =
              `--sfab-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}` as const;
            acc[cssVar] = value;
          }
          return acc;
        },
        {},
      )
    : undefined;

  const rootStyle: CSSProperties = {
    "--sfab-z-index": String(config.zIndex ?? 999999),
    ...themeVars,
  } as CSSProperties;

  return (
    <div className="sfab-root" style={rootStyle}>
      {!isOpen && <FabButton config={config} onClick={handleOpen} />}
      {isOpen && (
        <ExplorePanel data={menuData} config={config} onClose={handleClose} />
      )}
    </div>
  );
}
