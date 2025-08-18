import { FC, ReactNode } from "react";
import styles from "./AccelerateStarContainer.module.scss";

export const AccelerateStarContainer: FC<{
  children: ReactNode;
  attributes: any;
}> = ({ children, attributes }) => {
  return (
    <div {...attributes} className={styles.root}>
      {children}
      <div className={styles.star}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 88 88"
          fill="none"
        >
          <path
            d="M43.9998 18.3334L62.1288 69.6667L14.6665 37.941H73.3332L25.8708 69.6667L43.9998 18.3334Z"
            fill="url(#paint0_linear_70_3336)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_70_3336"
              x1="43.9998"
              y1="18.3334"
              x2="43.9998"
              y2="69.6667"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#707070" />
              <stop offset="1" stop-color="#707070" stop-opacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
