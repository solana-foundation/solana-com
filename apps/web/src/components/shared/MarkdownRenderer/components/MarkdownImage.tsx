import styles from "./MarkdownImage.module.scss";
import { memo } from "react";

export const MarkdownImage = memo(function ({
  src,
  ref: _ref,
  ...props
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  src = src.replace(/^(https?:\/\/)?solana.com\//gi, "/");

  return (
    <span className={styles["markdown-renderer-img"]}>
      <span className={styles["image-wrapper"]}>
        <img src={src} {...props} />
      </span>

      {!!props.alt && <span className={styles["label"]}>{props.alt}</span>}
    </span>
  );
});
