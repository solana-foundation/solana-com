import Button from "../shared/Button";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;

const IndexBtn = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      className={`btn ![background:linear-gradient(101.81deg,#f087ff_-4.52%,#6e1fce_54.5%,rgba(110,31,206,0.2)_101.41%)] !text-white hover:![background:#fff] hover:!text-black ${className ?? ""}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default IndexBtn;
