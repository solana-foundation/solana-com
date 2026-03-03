import { cva, type VariantProps } from "class-variance-authority";
import GetEmArrow from "../../../public/src/img/icons/getemarrow.inline.svg";
import Link from "../../utils/Link";

const buttonVariants = cva(
  "font-brand-mono font-normal uppercase w-fit align-middle cursor-pointer select-none text-center active:translate-y-0 disabled:opacity-65 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white border border-white [&:not([disabled])]:hover:!bg-white [&:not([disabled])]:hover:text-black [&:not([disabled])]:hover:border-black [&:not([disabled])]:active:!bg-white [&:not([disabled])]:active:text-black [&:not([disabled])]:active:border-black [&:not([disabled])]:focus:!bg-white [&:not([disabled])]:focus:text-black [&:not([disabled])]:focus:border-black",
        secondary:
          "!bg-[#14f195] text-black border border-black [&:not([disabled])]:hover:!bg-white [&:not([disabled])]:hover:text-black [&:not([disabled])]:hover:border-black [&:not([disabled])]:active:!bg-white [&:not([disabled])]:active:text-black [&:not([disabled])]:active:border-black [&:not([disabled])]:focus:!bg-white [&:not([disabled])]:focus:text-black [&:not([disabled])]:focus:border-black",
        tertiary:
          "!bg-[#9945ff] text-white border border-transparent [&:not([disabled])]:hover:!bg-white [&:not([disabled])]:hover:text-black [&:not([disabled])]:hover:border-black [&:not([disabled])]:active:!bg-white [&:not([disabled])]:active:text-black [&:not([disabled])]:active:border-black [&:not([disabled])]:focus:!bg-white [&:not([disabled])]:focus:text-black [&:not([disabled])]:focus:border-black",
        quaternary:
          "!bg-[#ff623a] text-black border border-black [&:not([disabled])]:hover:!bg-white [&:not([disabled])]:hover:text-black [&:not([disabled])]:hover:border-black [&:not([disabled])]:active:!bg-white [&:not([disabled])]:active:text-black [&:not([disabled])]:active:border-black [&:not([disabled])]:focus:!bg-white [&:not([disabled])]:focus:text-black [&:not([disabled])]:focus:border-black",
        quinary:
          "!bg-[#26262b] text-white border border-black [&:not([disabled])]:hover:!bg-white [&:not([disabled])]:hover:text-black [&:not([disabled])]:hover:border-black [&:not([disabled])]:active:!bg-white [&:not([disabled])]:active:text-black [&:not([disabled])]:active:border-black [&:not([disabled])]:focus:!bg-white [&:not([disabled])]:focus:text-black [&:not([disabled])]:focus:border-black",
        senary:
          "!bg-[#80ECFF] text-black border border-black [&:not([disabled])]:hover:!bg-white [&:not([disabled])]:hover:text-black [&:not([disabled])]:hover:border-black [&:not([disabled])]:active:!bg-white [&:not([disabled])]:active:text-black [&:not([disabled])]:active:border-black [&:not([disabled])]:focus:!bg-white [&:not([disabled])]:focus:text-black [&:not([disabled])]:focus:border-black",
        inverted:
          "!bg-[#f9f9fb] text-black border border-black [&:not([disabled])]:hover:!bg-black [&:not([disabled])]:hover:text-white [&:not([disabled])]:hover:border-white [&:not([disabled])]:active:!bg-black [&:not([disabled])]:active:text-white [&:not([disabled])]:active:border-white [&:not([disabled])]:focus:!bg-black [&:not([disabled])]:focus:text-white [&:not([disabled])]:focus:border-white",
        disabled: "bg-[#a6a6c1] text-black border border-black",
        transparent:
          "bg-transparent text-black border border-black [&:not([disabled])]:hover:!bg-white [&:not([disabled])]:hover:text-black [&:not([disabled])]:hover:border-black [&:not([disabled])]:active:!bg-white [&:not([disabled])]:active:text-black [&:not([disabled])]:active:border-black [&:not([disabled])]:focus:!bg-white [&:not([disabled])]:focus:text-black [&:not([disabled])]:focus:border-black",
        captioned:
          "bg-transparent text-white border border-transparent [&:not([disabled])]:hover:!bg-transparent [&:not([disabled])]:hover:text-white [&:not([disabled])]:hover:border-transparent [&:not([disabled])]:active:!bg-transparent [&:not([disabled])]:active:text-white [&:not([disabled])]:active:border-transparent [&:not([disabled])]:focus:!bg-transparent [&:not([disabled])]:focus:text-white [&:not([disabled])]:focus:border-transparent",
        outline:
          "bg-transparent text-white border border-white [&:not([disabled])]:hover:!bg-white [&:not([disabled])]:hover:text-black [&:not([disabled])]:hover:border-black [&:not([disabled])]:active:!bg-white [&:not([disabled])]:active:text-black [&:not([disabled])]:active:border-black [&:not([disabled])]:focus:!bg-white [&:not([disabled])]:focus:text-black [&:not([disabled])]:focus:border-black",
        none: "bg-black text-white border border-black [&:not([disabled])]:hover:!bg-white [&:not([disabled])]:hover:text-black [&:not([disabled])]:hover:border-black [&:not([disabled])]:active:!bg-white [&:not([disabled])]:active:text-black [&:not([disabled])]:active:border-black [&:not([disabled])]:focus:!bg-white [&:not([disabled])]:focus:text-black [&:not([disabled])]:focus:border-black",
      },
      size: {
        large: "py-[0.875rem] px-6 rounded-[2.25rem] text-[0.95rem] leading-5",
        medium:
          "py-[0.625rem] px-[1.3125rem] rounded-3xl text-[0.95rem] leading-5",
        small: "py-[0.3rem] px-[0.6rem] rounded-[2.25rem] text-xs leading-none",
        none: "p-0 rounded-none text-[0.95rem] leading-5",
        default:
          "py-[0.5625rem] px-4 rounded-[2.25rem] text-[0.95rem] leading-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = {
  to?: string;
  newTab?: boolean;
  ariaLabel?: string;
  className?: string;
  variant?: ButtonVariantProps["variant"];
  arrow?: boolean;
  arrowRight?: boolean;
  size?: ButtonVariantProps["size"];
  noBorder?: boolean;
  children?: React.ReactNode;
  [key: string]: unknown;
};

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
 */
const Button = ({
  to,
  newTab = false,
  ariaLabel,
  className,
  variant,
  arrow = false,
  arrowRight = false,
  size = "default",
  noBorder = false,
  children,
  ...props
}: ButtonProps) => {
  const isDisabled = variant === "disabled";

  const liftClasses = isDisabled
    ? ""
    : "transition-[box-shadow,transform] duration-[250ms] ease-[ease] [&:not([disabled])]:hover:![box-shadow:0_1rem_2.5rem_rgba(35,35,35,0.1),0_0.5rem_1rem_-0.75rem_rgba(35,35,35,0.1)] [&:not([disabled])]:hover:-translate-y-[3px] [&:not([disabled])]:focus:-translate-y-[3px]";

  const noBorderClass =
    noBorder || variant === "captioned" ? "!border-transparent" : "";

  const layoutClass =
    arrow || arrowRight ? "inline-flex items-center" : "inline-block";

  const variantClasses = buttonVariants({ variant, size });

  const disabledClasses = "disabled:opacity-[0.65] disabled:poiter-events-none";

  const Tag = to ? Link : "button";
  const tagProps = to
    ? {
        to,
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
      }
    : { type: "button" };

  return (
    <Tag
      aria-label={ariaLabel}
      className={`${variantClasses} ${noBorderClass} ${liftClasses} ${layoutClass} ${disabledClasses} ${className ?? ""}`}
      {...(tagProps as object)}
      {...(props as object)}
    >
      {arrow && <GetEmArrow width="11" height="11" className="mr-2" />}
      {children}
      {arrowRight && <GetEmArrow width="11" height="11" className="ml-2" />}
    </Tag>
  );
};

export default Button;
