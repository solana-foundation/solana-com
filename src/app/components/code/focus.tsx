import { AnnotationHandler, InnerLine } from "codehike/code";
import { PreWithFocus } from "./focus.client";

export const focus: AnnotationHandler = {
  name: "focus",
  onlyIfAnnotated: true,
  PreWithRef: PreWithFocus,
  Line: (props) => (
    <InnerLine
      merge={props}
      className="opacity-60 data-[focus]:opacity-100 px-2 transition-opacity duration-300"
    />
  ),
  AnnotatedLine: ({ annotation: _, ...props }) => (
    <InnerLine merge={props} data-focus={true} className="" />
  ),
};
