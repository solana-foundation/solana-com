import { AnnotationHandler, InnerLine } from "codehike/code";
import React from "react";
import "./mentions.css";

export function WithMentions(props: { children: React.ReactNode }) {
  return <div className="mention-container">{props.children}</div>;
}

export function MentionLink(props: {
  href?: string;
  children?: React.ReactNode;
}) {
  const mention = props.href.slice("mention:".length);
  return (
    <span
      className="underline decoration-dotted underline-offset-4"
      data-mention={mention}
    >
      {props.children}
    </span>
  );
}

export const mention: AnnotationHandler = {
  name: "mention",
  onlyIfAnnotated: true,
  Line: ({ annotation, ...props }) => (
    <InnerLine
      merge={props}
      className="transition-opacity"
      data-line={annotation?.query || ""}
    />
  ),
};
