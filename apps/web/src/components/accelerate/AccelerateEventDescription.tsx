import { FC } from "react";
import styles from "./AccelerateEventDescription.module.scss";
import { HtmlParser } from "@solana-foundation/solana-lib";
import type { SolanaLibAttributes } from "@/types/solana-lib";

export const AccelerateEventDescription: FC<{
  content: string;
  variant: "none" | "scale" | "ship";
  attributes: SolanaLibAttributes;
}> = ({ content, variant, attributes }) => {
  return (
    <div {...attributes} className={styles.root} data-variant={variant}>
      <HtmlParser rawHtml={content} />
    </div>
  );
};
