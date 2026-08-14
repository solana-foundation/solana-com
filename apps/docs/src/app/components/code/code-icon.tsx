import { Bash } from "@boxicons/react/Bash";
import { C } from "@boxicons/react/C";
import { CPlusPlus } from "@boxicons/react/CPlusPlus";
import { Css3 } from "@boxicons/react/Css3";
import { FileCode } from "@boxicons/react/FileCode";
import { Html5 } from "@boxicons/react/Html5";
import { Java } from "@boxicons/react/Java";
import { Javascript } from "@boxicons/react/Javascript";
import { Markdown } from "@boxicons/react/Markdown";
import { Python } from "@boxicons/react/Python";
import { ReactIcon } from "@boxicons/react/ReactIcon";
import { TailwindCss } from "@boxicons/react/TailwindCss";
import { Terminal } from "@boxicons/react/Terminal";
import { Typescript } from "@boxicons/react/Typescript";

const languageIcons: Record<string, typeof FileCode> = {
  bash: Bash,
  c: C,
  "c++": CPlusPlus,
  cpp: CPlusPlus,
  css: Css3,
  html: Html5,
  java: Java,
  javascript: Javascript,
  js: Javascript,
  jsx: ReactIcon,
  markdown: Markdown,
  md: Markdown,
  mdx: Markdown,
  python: Python,
  py: Python,
  react: ReactIcon,
  sass: Css3,
  scss: Css3,
  sh: Bash,
  shell: Bash,
  tailwind: TailwindCss,
  ts: Typescript,
  tsx: ReactIcon,
  typescript: Typescript,
};

export function CodeIcon({
  title,
  lang,
  className,
}: {
  title: string;
  lang: string;
  className?: string;
}) {
  const normalizedTitle = title?.toLowerCase();
  const normalizedLanguage = lang?.toLowerCase();
  const Icon =
    normalizedTitle === "terminal output" || normalizedTitle === "terminal"
      ? Terminal
      : (languageIcons[normalizedLanguage] ?? FileCode);

  return (
    <Icon
      aria-hidden="true"
      width={16}
      height={16}
      className={className}
      style={{ marginTop: -3.5 }}
    />
  );
}
