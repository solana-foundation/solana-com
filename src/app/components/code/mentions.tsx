import { AnnotationHandler } from "codehike/code";
import React from "react";
import { Hoverable, HoverLine, HoverProvider } from "./hover.client";

export function WithMentions(props: { children: React.ReactNode }) {
  return <HoverProvider>{props.children}</HoverProvider>;
}

export function MentionLink(props: {
  href?: string;
  children?: React.ReactNode;
}) {
  const mention = props.href.slice("mention:".length);
  return (
    <Hoverable
      className="underline decoration-dotted underline-offset-4 inline"
      name={mention}
    >
      {props.children}
    </Hoverable>
  );
}

export const mention: AnnotationHandler = {
  name: "mention",
  onlyIfAnnotated: true,
  Line: HoverLine,
};
