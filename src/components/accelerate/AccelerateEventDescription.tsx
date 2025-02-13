import { FC } from "react";
import styles from "./AccelerateEventDescription.module.scss";

export const AccelerateEventDescription: FC<{
  content: string;
  attributes: any;
}> = ({ content, attributes }) => {
  return (
    <p {...attributes} className={styles.root}>
      {content}
    </p>
  );
};
