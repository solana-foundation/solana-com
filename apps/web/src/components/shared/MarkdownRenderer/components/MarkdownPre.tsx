import React from "react";
import styles from "./MarkdownPre.module.scss";
import { CopyToClipBoardButton } from "./CopyToClipBoardButton";

import RustIcon from "@@/public/src/img/icons/Rust.inline.svg";
import { Typescript as TypescriptIcon } from "@boxicons/react/Typescript";
import { Terminal as TerminalIcon } from "@boxicons/react/Terminal";
import { GitCompare as FileDiffIcon } from "@boxicons/react/GitCompare";

/**
 * Listing of the supported custom metadata that can be attached to parsed components via `attachMetadata`
 */
export type CustomPreMetadataProps = {
  filename?: string;
  showCopyCode?: boolean;
  showLineNumbers?: boolean;
};

const languageIcons: Record<
  string,
  React.ElementType<React.SVGProps<SVGSVGElement>>
> = {
  typescript: TypescriptIcon,
  javascript: TypescriptIcon,
  ts: TypescriptIcon,
  js: TypescriptIcon,
  rust: RustIcon,
  rs: RustIcon,
  sh: TerminalIcon,
  shell: TerminalIcon,
  bash: TerminalIcon,
  diff: FileDiffIcon,
};

const getIconForLanguage = (
  language: string | undefined,
): React.ElementType<React.SVGProps<SVGSVGElement>> | undefined => {
  if (!language) return undefined;
  return languageIcons[language];
};

export function MarkdownPre({
  children,
  ...props
}: React.ComponentProps<"pre"> & CustomPreMetadataProps) {
  const language = (
    props as React.ComponentProps<"pre"> & { "data-language"?: string }
  )["data-language"];
  const Icon = getIconForLanguage(language);

  return (
    <div className={styles.wrapper}>
      {(Icon || props.filename) && (
        <div className={styles.header}>
          {Icon && <Icon className={styles.icon} />}
          <span>{props.filename}</span>
        </div>
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
