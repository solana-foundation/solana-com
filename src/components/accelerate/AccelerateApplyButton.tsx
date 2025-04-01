import { FC } from "react";
import styles from "./AccelerateApplyButton.module.scss";
import { Ticket } from "lucide-react";

export const AccelerateApplyButton: FC<{
  label: string;
  type: "mix" | "blue" | "red";
  url: string;
  attributes: any;
  newTab: boolean;
}> = ({ label, url = "", attributes, type = "mix", newTab }) => {
  return (
    <a href={url} target={newTab && "_blank"} {...attributes}>
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
