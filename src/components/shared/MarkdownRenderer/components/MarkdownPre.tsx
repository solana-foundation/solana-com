import styles from "./MarkdownPre.module.scss";
import { CopyToClipBoardButton } from "./CopyToClipBoardButton";

/**
 * Listing of the supported custom metadata that can be attached to parsed components via `attachMetadata`
 */
export type CustomPreMetadataProps = {
  filename?: string;
  showCopyCode?: boolean;
  showLineNumbers?: boolean;
};

export function MarkdownPre({
  children,
  ...props
}: React.ComponentProps<"pre"> & CustomPreMetadataProps) {
  return (
    <div className={styles.wrapper}>
      {!!props.filename && (
        <div className={styles.header}>{props.filename}</div>
      )}
      <pre className={styles.pre} {...props}>
        {children}
        <div className={styles["copy-button"]}>
          <CopyToClipBoardButton />
        </div>
      </pre>
    </div>
  );
}
