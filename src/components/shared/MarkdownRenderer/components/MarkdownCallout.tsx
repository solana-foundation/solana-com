import styles from "./MarkdownCallout.module.scss";
import classNames from "classnames";

type ComponentProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  title?: string | boolean;
  type?: CalloutType;
};

/**
 * Define the supported callout types
 */
type CalloutType =
  | "default"
  | "info"
  | "note"
  | "blue"
  | "warning"
  | "red"
  | "caution"
  | "yellow"
  | "green"
  | "success";

export const MarkdownCallout = function MarkdownCallout({
  children,
  title,
  type = "info",
  ...props
}: ComponentProps) {
  // set the default title to the type
  if (typeof title == "undefined") {
    title = getCalloutTitle(type);
  }

  return (
    <div
      {...props}
      className={classNames(styles.callout, getCalloutClass(type))}
    >
      {!!title && <div className={styles.title}>{title}</div>}
      {children}
    </div>
  );
};

// only allow the supported callout types
const getCalloutClass = (type: CalloutType) => {
  switch (type.toLowerCase()) {
    case "warning":
    case "red":
      return styles["red"];
    case "caution":
    case "yellow":
      return styles["yellow"];
    case "success":
    case "green":
      return styles["green"];
    case "info":
    case "note":
    case "blue":
      return styles["blue"];
    default:
      return styles["blue"];
  }
};

// only allow the supported callout types
const getCalloutTitle = (type: CalloutType) => {
  switch (type.toLowerCase()) {
    case "warning":
    case "red":
      return "Warning";
    case "caution":
    case "yellow":
      return "Caution";
    case "success":
    case "green":
      return "Success";
    case "info":
    case "note":
    case "blue":
    default:
      return "Info";
  }
};
