import styled from "styled-components";
import { Button as BSButton } from "react-bootstrap";
import GetEmArrow from "../../../public/src/img/icons/getemarrow.inline.svg";
import Link from "../../utils/Link";

const StyledBSButton = styled(BSButton)`
  &.btn {
    font-family: DSemi, monospace;
    font-weight: normal;
    text-transform: uppercase;
    line-height: ${(props) => (props.size === "small" ? "1" : "1.25rem")};
    font-size: ${(props) => (props.size === "small" ? "0.75rem" : "0.95rem")};
    // fit-content to prevent .btn growing when inside a flex box
    width: fit-content;
    background-color: ${(props) => {
      switch (props.$variant) {
        case "secondary":
          return `#14f195`;
        case "tertiary":
          return `#9945ff`;
        case "quaternary":
          return `#ff623a`;
        case "quinary":
          return `#26262b`;
        case "senary":
          return `#80ECFF`;
        case "inverted":
          return `#f9f9fb`;
        case "disabled":
          return `#a6a6c1`;
        case "transparent":
        case "captioned":
        case "outline":
          return `transparent`;
        default:
          return `black`;
      }
    }};
    border-radius: ${(props) => {
      switch (props.size) {
        case "medium":
          return "1.5rem";
        case "none":
          return "0";
        default:
          return "2.25rem";
      }
    }};
    padding: ${(props) => {
      switch (props.size) {
        case "large":
          return "0.875rem 1.5rem";
        case "medium":
          return "0.625rem 1.3125rem";
        case "small":
          return "0.3rem 0.6rem";
        case "none":
          return "0";
        default:
          return "0.5625rem 1rem";
      }
    }};
    color: ${(props) =>
      [
        "secondary",
        "quaternary",
        "senary",
        "inverted",
        "disabled",
        "transparent",
      ].includes(props.$variant)
        ? `black`
        : `white`};
    border: ${(props) =>
      props.$variant === "outline"
        ? `1px solid white`
        : props.$noBorder || props.$variant === "captioned"
          ? `1px solid transparent`
          : props.$variant
            ? `1px solid black`
            : `1px solid white`};

    &:not([disabled]):hover,
    &:not([disabled]):active,
    &:not([disabled]):focus {
      background-color: ${(props) => {
        switch (props.$variant) {
          case "disabled":
            return "#a6a6c1";
          case "inverted":
            return "#000";
          case "captioned":
            return "transparent";
          default:
            return "#fff";
        }
      }};
      color: ${(props) =>
        props.$variant === "disabled"
          ? `inherit`
          : props.$variant === "inverted" || props.$variant === "captioned"
            ? `white`
            : `black`};
      border: ${(props) =>
        props.$variant === "disabled" || props.$variant === "captioned"
          ? `1px solid transparent`
          : props.$variant === "inverted"
            ? `1px solid white`
            : `1px solid black`};
    }
    &:active {
      transform: translateY(0);
    }
  }
`;

/**
 * The new default button.
 *
 * @param to            Where an `a` should link/href to
 * @param newTab        If an `a` should open in a new tab
 * @param ariaLabel     This is handy to send screen readers info to, when a Button contains no text at all
 * @param className     Adjacent classes besides the default `.btn`
 * @param variant       Defines the variant in terms of background, color and border styles
 * @param arrow         Left arrow, usually highlights an external link
 * @param arrowRight    Right arrow, usually highlights an external link
 * @param size          Defines the `.btn` size, in terms of radius and padding
 * @param noBorder      Makes the `.btn` border transparent, usually handy to adapt to colored foregrounds
 * @param children      Component's children to render
 * @param props         The remaining props to spread in.
 * @returns {JSX.Element}
 * @constructor
 */
const Button = ({
  to,
  newTab = false,
  ariaLabel,
  className,
  variant,
  arrow = false,
  arrowRight = false,
  size = "medium",
  noBorder = false,
  children,
  ...props
}) => {
  return (
    <StyledBSButton
      // Decide on what HTML element to return
      as={to ? Link : "button"}
      // <a>...</a> specific
      to={to && to}
      //
      target={newTab ? "_blank" : null}
      // <button>...</button> specific
      type={to ? null : "button"}
      // Common conditionals
      aria-label={ariaLabel}
      className={`
      btn
      ${className || ``}
      ${variant === "disabled" ? `disabled` : `lift`}
      ${arrow || arrowRight ? `d-inline-flex align-items-center` : ``}`}
      $variant={variant}
      size={size}
      $noBorder={noBorder}
      {...props}
    >
      {arrow && <GetEmArrow width="11" height="11" className="me-2" />}
      {children}
      {arrowRight && <GetEmArrow width="11" height="11" className="ms-2" />}
    </StyledBSButton>
  );
};

export default Button;
