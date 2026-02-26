import { Children, createElement } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import Button from "../shared/Button";

/**
 * Displays a React Markdown section.
 */
const CommonMarkdown = ({
  children,
  ...props
}: {
  children?: string;
  [key: string]: unknown;
}) => {
  const flatten = (text: string, child: React.ReactNode): string => {
    return typeof child === "string"
      ? text + child
      : (Children.toArray(
          (child as React.ReactElement<{ children: React.ReactNode }>).props
            .children,
        ).reduce(
          flatten as (_text: string, _child: unknown) => string,
          text,
        ) as string);
  };

  const HeadingRenderer = (props: {
    level: number;
    children?: React.ReactNode;
  }) => {
    const headingChildren = Children.toArray(props.children);
    const text = headingChildren.reduce(
      flatten as (_text: string, _child: unknown) => string,
      "",
    ) as string;
    const slug = text.toLowerCase().replace(/\W/g, "-");
    return createElement(
      "h" + props.level,
      { id: slug, className: `h${props.level + 2}` },
      props.children,
    );
  };

  const ImageRenderer = (props: { src?: string; alt?: string }) => (
    <img src={props.src} alt={props.alt} />
  );

  const ButtonRender = (props: Record<string, unknown>) => (
    <Button
      {...props}
      newTab={props.newtab as boolean}
      arrowRight={props.arrowright as boolean}
      noBorder={props.noborder as boolean}
      className={props.classname as string}
    />
  );

  return (
    <div className="text-[#e6e6e6] break-words [&_h1,&_h2,&_h3,&_h4,&_h5,&_h6]:text-white [&_h1,&_h2,&_h3]:mt-12 [&_h1,&_h2,&_h3]:mb-8 lg:[&_h1,&_h2,&_h3]:mt-16 [&_h4,&_h5,&_h6]:mt-10 [&_h4,&_h5,&_h6]:mb-6 lg:[&_h4,&_h5,&_h6]:mt-14 [&_hr]:my-6 [&_ul]:mb-4 [&_ul_li]:mb-1 [&_p]:mb-4 [&_img]:max-w-full">
      <ReactMarkdown
        components={{
          h1: HeadingRenderer as React.ComponentType<object>,
          h2: HeadingRenderer as React.ComponentType<object>,
          h3: HeadingRenderer as React.ComponentType<object>,
          h4: HeadingRenderer as React.ComponentType<object>,
          img: ImageRenderer as React.ComponentType<object>,
          button: ButtonRender as React.ComponentType<object>,
        }}
        {...props}
        rehypePlugins={[rehypeRaw]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default CommonMarkdown;
