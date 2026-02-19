import { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant =
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "senary"
  | "inverted"
  | "disabled"
  | "transparent"
  | "captioned"
  | "outline";

export type ButtonSize = "large" | "medium" | "small" | "none";

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "type"> {
  /**
   * Where an `a` should link/href to
   */
  to?: string;

  /**
   * If an `a` should open in a new tab
   * @default false
   */
  newTab?: boolean;

  /**
   * This is handy to send screen readers info to, when a Button contains no text at all
   */
  ariaLabel?: string;

  /**
   * Adjacent classes besides the default `.btn`
   */
  className?: string;

  /**
   * Defines the variant in terms of background, color and border styles
   */
  variant?: ButtonVariant;

  /**
   * Left arrow, usually highlights an external link
   * @default false
   */
  arrow?: boolean;

  /**
   * Right arrow, usually highlights an external link
   * @default false
   */
  arrowRight?: boolean;

  /**
   * Defines the `.btn` size, in terms of radius and padding
   * @default "medium"
   */
  size?: ButtonSize;

  /**
   * Makes the `.btn` border transparent, usually handy to adapt to colored foregrounds
   * @default false
   */
  noBorder?: boolean;

  /**
   * Component's children to render
   */
  children?: ReactNode;
}

declare const Button: (_props: ButtonProps) => JSX.Element;

export default Button;
