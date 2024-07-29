import { ComponentProps, createElement } from "react";
import ContentApi from "@/utils/contentApi";

/**
 *
 */
export function createHeadingComponent(level: number) {
  return ({ children }: { children?: any }) => {
    let slug = ContentApi.slugify(children);

    return createElement(
      `h${level}`,
      { id: slug },
      children,
      " ", // note: this spacer is important
      [
        createElement(
          "a",
          {
            href: `#${slug}`,
            key: `link-${slug}`,
            // className: "anchor",
          },
          "#",
        ),
      ],
    );
  };
}

export function MarkdownLine(_props: ComponentProps<"hr">) {
  return (
    <div className="">
      <hr />
    </div>
  );
}
