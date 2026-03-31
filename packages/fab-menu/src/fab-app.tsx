/** @jsxImportSource preact */
import { useEffect, useState } from "preact/hooks";
import type { FabMenuConfig, MenuData } from "./types";
import { fetchMenuData } from "./fetch-config";
import { DEFAULT_MENU_DATA } from "./defaults";
import { FabButton } from "./fab-button";
import { GetStartedPanel } from "./get-started-panel";

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
    ? Object.entries(config.theme).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (value) {
            const cssVar = `--sfab-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
            acc[cssVar] = value;
          }
          return acc;
        },
        {},
      )
    : undefined;

  return (
    <div
      class="sfab-root"
      style={{
        "--sfab-z-index": String(config.zIndex ?? 999999),
        ...themeVars,
      }}
    >
      {!isOpen && <FabButton config={config} onClick={handleOpen} />}
      {isOpen && (
        <GetStartedPanel
          data={menuData}
          config={config}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
