import { themeIcons } from "seti-icons";
import { TerminalIcon } from "lucide-react";

export function CodeIcon({
  title,
  lang,
  className,
}: {
  title: string;
  lang: string;
  className?: string;
}) {
  if (
    title?.toLowerCase() == "terminal output" ||
    title?.toLowerCase() == "terminal" ||
    lang === "sh" ||
    lang == "shell" ||
    lang == "bash"
  ) {
    return (
      <TerminalIcon
        size={16}
        className={className}
        style={{ marginTop: -3.5 }}
      />
    );
  }

  let filename = title || "x";
  if (!filename.includes(".")) {
    const ext = lang === "rust" ? "rs" : lang === "typescript" ? "ts" : lang;
    filename += "." + ext;
  }
  const { svg, color } = getIcon(filename);
  const __html = svg.replace(
    /svg/,
    `svg fill='${color}' height='28' style='margin-left: -6px; margin-top: -6px;'`,
  );
  return (
    <span className={className}>
      <span
        dangerouslySetInnerHTML={{ __html }}
        style={{ display: "contents" }}
      />
    </span>
  );
}

// from https://github.com/jesseweed/seti-ui/blob/master/styles/ui-variables.less
const getIcon = themeIcons({
  white: "#d4d7d6",
  grey: "#4d5a5e",
  "grey-light": "#6d8086",
  blue: "#519aba",
  green: "#8dc149",
  orange: "#e37933",
  pink: "#f55385",
  purple: "#a074c4",
  red: "#cc3e44",
  yellow: "#cbcb41",
  ignore: "#41535b",
});
