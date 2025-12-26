import { AnnotationHandler, InnerLine } from "codehike/code";

export const mark: AnnotationHandler = {
  name: "mark",
  Line: ({ annotation, ...props }) => {
    const color = getColor(annotation);
    return (
      <div
        style={{
          borderLeft: "solid 2px transparent",
          borderLeftColor: annotation && color,
          backgroundColor: annotation && `rgb(from ${color} r g b / 0.13)`,
        }}
        className="flex"
      >
        <InnerLine merge={props} className="px-3 flex-1" />
      </div>
    );
  },
  Inline: ({ annotation, children }) => {
    const color = getColor(annotation);
    return (
      <span
        style={{
          boxShadow: `0 0 0 1px rgb(from ${color} r g b / 0.5)`,
          backgroundColor: `rgb(from ${color} r g b / 0.13)`,
        }}
        className="rounded px-0.5 py-0 -mx-0.5"
      >
        {children}
      </span>
    );
  },
};

function getColor(annotation?: { query?: string }) {
  const n = Number(annotation?.query || "0") % colors.length;
  return colors[n] || annotation?.query;
}

const colors = ["var(--ch-5)", "var(--ch-3)", "var(--ch-2)"];
