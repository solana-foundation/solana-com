"use client";

import React from "react";

interface PanelProps {
  title: string;
  meta?: React.ReactNode;
  live?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** One instrument panel: hairline border, dark ground, mono header rail. */
export const Panel: React.FC<PanelProps> = ({
  title,
  meta,
  live,
  className,
  children,
}) => (
  <section className={`s2-panel ${className ?? ""}`}>
    <header className="s2-panel-head">
      <h2 className="s2-panel-title">
        {live && <span aria-hidden className="s2-dot s2-dot-live" />}
        {title}
      </h2>
      {meta && <span className="s2-panel-meta">{meta}</span>}
    </header>
    <div className="s2-panel-body">{children}</div>
  </section>
);
