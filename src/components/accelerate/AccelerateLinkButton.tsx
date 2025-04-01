import { FC } from "react";
import styles from "./AccelerateLinkButton.module.scss";
import { ArrowUpRight } from "lucide-react";

export const AccelerateLinkButton: FC<{
  label: string;
  url: string;
  attributes: any;
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
