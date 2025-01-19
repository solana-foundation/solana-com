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
      const codeElement = btnRef.current?.closest("pre")?.querySelector("code");
      const textToCopy = codeElement?.textContent || "[err]";

      if (!navigator?.clipboard) {
        // Fallback for browsers that don't support the Clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand("copy");
          textArea.remove();
          setIsCopied(true);
          return;
        } catch (err) {
          console.error("Fallback copy failed:", err);
          textArea.remove();
          throw new Error("Copy failed");
        }
      }

      await navigator.clipboard.writeText(textToCopy);
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
