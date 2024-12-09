import { useState, FC, ReactNode, useRef } from "react";
import clsx from "clsx";
import Button from "@/components/solutions/Button";
import styles from "./MediaOptionSelection.module.scss";
import { AnimatedText } from "../shared/Text";

interface MediaOption {
  label: string;
  media: ReactNode;
}

interface MediaOptionSelectionProps {
  options: MediaOption[];
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
}

const MediaOptionSelection: FC = ({
  options,
  title,
  buttonText,
  buttonUrl,
}: MediaOptionSelectionProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const container = useRef(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);

    if (container.current) {
      container.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={clsx(styles.MediaOptionSelection, "page-width")}
      ref={container}
    >
      <div className={styles.MediaWrapper}>{options[selectedIndex].media}</div>

      <div className={styles.ContentWrapper}>
        {title && <AnimatedText element="h3">{title}</AnimatedText>}

        <ul>
          {options.map((option, index) => (
            <li
              key={index}
              className={clsx({
                [styles.Active]: selectedIndex === index,
              })}
            >
              <button onClick={() => handleSelect(index)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>

        {buttonText && buttonUrl && (
          <Button url={buttonUrl} text={buttonText} />
        )}
      </div>
    </div>
  );
};

export default MediaOptionSelection;
