import { FC, SVGProps } from "react";
import classNames from "classnames";

import styles from "./Caret.module.scss";

interface CaretIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

const CaretIcon: FC<CaretIconProps> = ({
  color = "white",
  direction = "right",
  className,
  ...props
}) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-direction={direction}
      className={classNames(styles.CaretIcon, className)}
      {...props}
    >
      <g clipPath="url(#clip0_3892_9052)">
        <path
          d="M10.584 7.1665L15.9173 12.4998L10.584 17.8332"
          stroke={color ? color : "currentColor"}
          strokeWidth="1.42222"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3892_9052">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CaretIcon;
