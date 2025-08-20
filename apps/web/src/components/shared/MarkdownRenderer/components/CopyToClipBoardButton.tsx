import styles from "./CopyToClipBoardButton.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";

import CopyIcon from "@@/public/src/img/icons/Copy.inline.svg";
import CopyConfirmIcon from "@@/public/src/img/icons/CopyConfirm.inline.svg";

export function CopyToClipBoardButton() {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isCopied]);

  const copyToClipboard = useCallback(async () => {
    try {
      if (!navigator?.clipboard) {
        // todo: fallback copy
        console.log("unable to access the window's clipboard");
      }

      await navigator.clipboard.writeText(
        btnRef.current?.closest("pre")?.querySelector("code")?.textContent ||
          "[err]",
      );

      setIsCopied(true);
    } catch (err) {
      console.error(err);
      console.warn("Unable to copy to clipboard");
    }
  }, [btnRef]);

  const IconToUse = isCopied ? CopyConfirmIcon : CopyIcon;

  return (
    <button
      className={styles.button}
      ref={btnRef}
      type="button"
      onClick={copyToClipboard}
      aria-label="Copy"
    >
      <IconToUse width={18} height={18} strokeWidth={1.5} />
    </button>
  );
}
