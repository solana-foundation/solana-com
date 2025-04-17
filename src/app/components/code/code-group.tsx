type CodeOptions = {
  copyButton?: boolean;
  lineNumbers?: boolean;
  wordWrap?: boolean;
  animate?: boolean;
  runable?: boolean;
};

export type CodeGroup = {
  storage?: string;
  options: CodeOptions;
  tabs: {
    options: CodeOptions;
    title: string;
    style: React.CSSProperties;
    code: string;
    pre: React.ReactNode;
    icon: React.ReactNode;
    lang: string;
  }[];
};

export const theme = "github-from-css";

/**
 * Convert flags string to options object.
 *
 * @example
 * flagsToOptions("na") // { lineNumbers: true, animate: true }
 * flagsToOptions("c") // { copyButton: true }
 */
export function flagsToOptions(flags: string = "") {
  const options: CodeOptions = {};
  const map = {
    c: "copyButton",
    n: "lineNumbers",
    w: "wordWrap",
    a: "animate",
    r: "runable",
  } as const;
  flags.split("").forEach((flag) => {
    if (flag in map) {
      const key = map[flag as keyof typeof map];
      options[key] = true;
    } else {
      console.warn(`Unknown flag: ${flag}`);
    }
  });
  return options;
}
