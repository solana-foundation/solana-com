import { AnnotationHandler } from "codehike/code";
import { NoteTooltip } from "./notes.tooltip";

export const tooltip: AnnotationHandler = {
  name: "tooltip",
  Inline: ({ children, annotation }) => {
    const { query } = annotation;
    return <NoteTooltip name={query}>{children}</NoteTooltip>;
  },
};
