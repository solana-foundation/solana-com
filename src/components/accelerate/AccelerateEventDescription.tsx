import { FC } from "react";
import styles from "./AccelerateEventDescription.module.scss";

export const AccelerateEventDescription: FC<{
  content: string;
  variant: "scale" | "ship";
  attributes: any;
}> = ({ content, variant, attributes }) => {
  return (
    <p {...attributes} className={styles.root} data-variant={variant}>
      {content}
    </p>
  );
};
