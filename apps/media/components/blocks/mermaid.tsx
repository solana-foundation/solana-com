"use client";
import dynamic from "next/dynamic";

const MermaidElement = dynamic(() => import("../mermaid-renderer"), {
  ssr: false,
  loading: () => <div>Loading diagram...</div>,
});

export function Mermaid(props: { value: string }) {
  if (!props?.value) return null;
  return <MermaidElement value={props.value} />;
}
