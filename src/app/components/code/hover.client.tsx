"use client";
import { BlockAnnotationComponent } from "codehike/code";
import { createContext, useContext, useState } from "react";

const HoverContext = createContext<{
  hoveredNames: string[];
  addHoveredName: (_: string) => void;
  removeHoveredName: (_: string) => void;
}>({
  hoveredNames: [],
  addHoveredName: () => {},
  removeHoveredName: () => {},
});

export function HoverProvider({ children }: { children: React.ReactNode }) {
  const [hoveredNames, setHoveredNames] = useState<string[]>([]);

  const addHoveredName = (name: string) => {
    setHoveredNames((prev) => [...prev, name]);
  };

  const removeHoveredName = (name: string) => {
    setHoveredNames((prev) => prev.filter((n) => n !== name));
  };

  return (
    <HoverContext.Provider
      value={{ hoveredNames, addHoveredName, removeHoveredName }}
    >
      {children}
    </HoverContext.Provider>
  );
}

export function Hoverable({
  name,
  children,
  className,
  style,
}: {
  name: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { addHoveredName, removeHoveredName, hoveredNames } =
    useContext(HoverContext);
  const isHovered =
    hoveredNames.length > 0 && hoveredNames[hoveredNames.length - 1] === name;
  return (
    <div
      className={className}
      onMouseEnter={() => addHoveredName(name)}
      onMouseLeave={() => removeHoveredName(name)}
      data-hovered={isHovered}
      style={style}
    >
      {children}
    </div>
  );
}

export const HoverBlock: BlockAnnotationComponent = ({
  annotation,
  children,
}) => {
  const name = annotation.query;
  const { hoveredNames } = useContext(HoverContext);
  const isHovered = hoveredNames[hoveredNames.length - 1] === name;

  return (
    <div
      className={isHovered ? "bg-sky-500/20" : "bg-sky-500/0"}
      style={{ transition: "background-color 0.3s ease" }}
      data-block-hovered={isHovered ? "true" : undefined}
    >
      {children}
    </div>
  );
};
