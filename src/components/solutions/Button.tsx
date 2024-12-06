import { AnchorHTMLAttributes } from "react";
import Link from "next/link";
import classNames from "classnames";
import styles from "./Button.module.scss";

export interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  url?: string;
  theme?: "primary" | "secondary";
  classes?: string;
}

const Button = ({
  text,
  url,
  theme = "primary",
  classes,
  ...props
}: ButtonProps) => {
  return (
    <Link
      href={url}
      className={classNames(styles.Button, styles[theme], classes)}
      {...props}
    >
      <span>{text}</span>
    </Link>
  );
};

export default Button;
