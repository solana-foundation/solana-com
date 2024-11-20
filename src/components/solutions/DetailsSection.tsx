import { ReactNode } from "react";
import Link from "next/link";
import classNames from "classnames";
import styles from "./DetailsSection.module.scss";
import CaretIcon from "@/components/icons/Caret";
import { AnimatedText } from "../shared/Text";

interface DetailProps {
  title: string;
  text?: string;
  url?: string;
  arrow?: boolean;
}

export const Detail = ({ url, title, text, arrow = false }: DetailProps) => (
  <div className={classNames(styles.Detail)}>
    {url ? (
      <Link href={url} target="_blank">
        <AnimatedText element="h3" as="heading">
          <span>{title}</span>
          {arrow && <CaretIcon className={styles.Arrow} color="#EAEBF0" />}
        </AnimatedText>
      </Link>
    ) : (
      <AnimatedText element="h3" as="heading">
        <span>{title}</span>
      </AnimatedText>
    )}

    {text && (
      <AnimatedText element="p" as="paragraph">
        {text}
      </AnimatedText>
    )}
  </div>
);

const DetailsSection = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <section
      className={classNames(styles.DetailsSection, "page-width", className)}
    >
      {children}
    </section>
  );
};

export default DetailsSection;
