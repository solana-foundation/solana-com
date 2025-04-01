import { FC } from "react";
import styles from "./AccelerateApplyButton.module.scss";
import { Ticket } from "lucide-react";

export const AccelerateApplyButton: FC<{
  label: string;
  type: "mix" | "blue" | "red";
  url: string;
  attributes: any;
}> = ({ label, url = "", attributes, type = "mix" }) => {
  return (
    <a href={url} {...attributes}>
      <button className={`${styles.btn} ${styles[type]}`}>
        <span>
          {label}
          <Ticket />
        </span>
        {type === "mix" && <div className={styles.overlay}></div>}
      </button>
    </a>
  );
};
