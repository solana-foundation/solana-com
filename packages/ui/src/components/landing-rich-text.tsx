import parse, {
  Element,
  Text,
  attributesToProps,
  domToReact,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";

import { cn } from "../lib/utils";

function textContent(nodes: DOMNode[]): string {
  return nodes
    .map((node) => {
      if (node instanceof Text) return node.data;
      if (node instanceof Element)
        return textContent(node.children as DOMNode[]);
      return "";
    })
    .join("");
}

export function headingId(text: string): string {
  return text
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1-$2")
    .replace(/_/g, "-")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function HtmlParser({
  rawHtml,
  classes,
}: {
  rawHtml?: string;
  classes?: string;
}) {
  if (typeof rawHtml !== "string" || !rawHtml) return null;

  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) return;
      if (node.name === "script") return <></>;
      if (node.name === "a") {
        const href = node.attribs.href;
        const safeHref =
          href && !/^\s*(?:javascript|data):/i.test(href) ? href : undefined;
        return (
          <a
            {...attributesToProps(node.attribs)}
            href={safeHref}
            className="text-[#14F195] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]"
          >
            {domToReact(node.children as DOMNode[], options)}
          </a>
        );
      }
      if (node.name === "h1" || node.name === "h2" || node.name === "h3") {
        const H = node.name;
        return (
          <H
            {...attributesToProps(node.attribs)}
            id={
              node.attribs.id ||
              headingId(textContent(node.children as DOMNode[]))
            }
            className="scroll-mt-28 font-brand font-medium leading-tight"
          >
            {domToReact(node.children as DOMNode[], options)}
          </H>
        );
      }
    },
  };

  return (
    <div
      className={cn(
        "min-w-0 max-w-full overflow-x-auto break-words leading-relaxed",
        "[&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1",
        "[&_h1]:my-8 [&_h1]:text-4xl [&_h2]:my-7 [&_h2]:text-3xl [&_h3]:my-6 [&_h3]:text-2xl",
        "[&_table]:my-6 [&_table]:min-w-full [&_table]:border-collapse [&_th]:border [&_th]:border-white/20 [&_th]:p-3 [&_th]:text-left [&_td]:border [&_td]:border-white/20 [&_td]:p-3",
        "[&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[#111114] [&_pre]:p-4 [&_code]:font-brand-mono",
        classes,
      )}
    >
      {parse(rawHtml, options)}
    </div>
  );
}
