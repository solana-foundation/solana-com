import { FC } from "react";
import styles from "./AccelerateLinkButton.module.scss";
import { ArrowUpRight } from "lucide-react";
import type { SolanaLibAttributes } from "@/types/solana-lib";

export const AccelerateLinkButton: FC<{
  label: string;
  url: string;
  attributes: SolanaLibAttributes;
}> = ({ label, url = "", attributes }) => {
  return (
    <a href={url} target="_blank" {...attributes}>
      <button className={styles.btn}>
        <span>
          {label}
          <ArrowUpRight size={16} />
        </span>
      </button>
    </a>
  );
};
