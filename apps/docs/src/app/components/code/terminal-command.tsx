"use client";
import "./terminal-command.css";
import { AnnotationHandler } from "codehike/code";
import React from "react";

export const CommandBlock: AnnotationHandler["Block"] = ({
  children,
  annotation,
}) => {
  const [active, setActive] = React.useState(false);
  return (
    <div className="px-1 flex ch-terminal-line" data-active={active}>
      <span className="select-none text-ch-line-number shrink-0">$ </span>
      <span className="ch-terminal-content break-all">{children}</span>
      <button
        aria-label="Copy command"
        className="ch-terminal-button select-none self-start"
        onClick={() => {
          navigator.clipboard.writeText(annotation?.query || "");
          setActive(true);
          setTimeout(() => setActive(false), 350);
        }}
      >
        Copy
      </button>
    </div>
  );
};
