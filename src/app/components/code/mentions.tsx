import { AnnotationHandler, CodeAnnotation } from "codehike/code";
import React from "react";
import {
  Hoverable,
  HoverInline,
  HoverLine,
  HoverProvider,
} from "./hover.client";

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
  Inline: HoverInline,
  transform: (annotation: CodeAnnotation) => {
    if (!("fromColumn" in annotation)) {
      return [annotation];
    }
    // if is inline, add a block annotation so the line is not dimmed
    const blockAnnotation = {
      name: annotation.name,
      query: annotation.query,
      fromLineNumber: annotation.lineNumber,
      toLineNumber: annotation.lineNumber,
      data: { inline: true },
    };
    return [blockAnnotation, annotation];
  },
};
