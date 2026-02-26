import { SimpleComponentProps } from "@@/src/types";

type StyledDivProps = SimpleComponentProps<{
  color?: string;
  bgColor?: string;
  borderRadius?: string;
  shadow?: string;
}>;

const StyledRoundedCard = ({
  children,
  className,
  color,
  bgColor,
  borderRadius,
}: StyledDivProps) => {
  return (
    <div
      className={`relative z-[1] ${className ?? ""}`}
      style={{
        color: color ?? "#000",
        background: bgColor ?? "#14f195",
        borderRadius: borderRadius ?? "1rem",
      }}
    >
      {children}
    </div>
  );
};

export default StyledRoundedCard;
