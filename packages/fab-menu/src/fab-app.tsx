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
  const [menuData, setMenuData] = useState<MenuData>(
    config.data ?? DEFAULT_MENU_DATA,
  );

  useEffect(() => {
    if (config.data) {
      setMenuData(config.data);
      return;
    }
    let cancelled = false;
    fetchMenuData(config.apiUrl).then((data) => {
      if (!cancelled) setMenuData(data);
    });
    return () => {
      cancelled = true;
    };
  }, [config.apiUrl, config.data]);

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
