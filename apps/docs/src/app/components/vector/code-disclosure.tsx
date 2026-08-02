import { type ReactNode } from "react";
import { vectorRoot } from "./base";
import { CodeChevronsIcon } from "./icons";
import styles from "./vector.module.css";

/* Always-open code-snippets section: a small icon tile in the gutter, a
   prose lead-in line, and a boxed body that usually holds a TabBar with
   PrereqLists, CommandLists and CodeSnippets. */
export function CodeDisclosure({
  summary,
  icon,
  className,
  children,
}: {
  summary: ReactNode;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={vectorRoot(styles.codeRow, className)}>
      <span className={styles.codeIcon} aria-hidden="true">
        {icon ?? <CodeChevronsIcon />}
      </span>
      <div className={styles.codeDetails}>
        <div className={styles.codeSummary}>{summary}</div>
        <div className={styles.codeBody}>{children}</div>
      </div>
    </div>
  );
}
