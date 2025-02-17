import { FC } from "react";
import styles from "./AccelerateEventDescription.module.scss";
import { HtmlParser } from "@solana-foundation/solana-lib";

export const AccelerateEventDescription: FC<{
  content: string;
  variant: "scale" | "ship";
  attributes: any;
}> = ({ content, variant, attributes }) => {
  return (
    <div {...attributes} className={styles.root} data-variant={variant}>
      <HtmlParser rawHtml={content} />
    </div>
  );
};
