import { useState, useRef } from "react";
import styles from "./PossibleEcosystemGridItem.module.scss";

const PossibleEcosystemGridItem = ({ data }) => {
  const [tooltipPosition, setTooltipPosition] = useState(
    "top-full left-1/2 -translate-x-1/2",
  );
  const itemRef = useRef(null);

  const handleTooltipPosition = () => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const { innerWidth } = window;
      const tooltipHalfWidth = rect.width / 2; // approximate width of tooltip / 2
      let left = rect.left + rect.width / 2 - tooltipHalfWidth;
      let right = rect.left + rect.width;

      if (left < 0) {
        setTooltipPosition("top-1/2 left-full -translate-y-1/2");
      } else if (right >= innerWidth) {
        setTooltipPosition("top-1/2 right-full -translate-y-1/2");
      } else {
        setTooltipPosition("top-full left-1/2 -translate-x-1/2");
      }
    }
  };

  return (
    <div
      ref={itemRef}
      className={styles["ecosystem__grid-item--possible"]}
      onMouseEnter={handleTooltipPosition}
      onFocus={handleTooltipPosition}
    >
      <img
        height={74}
        width={74}
        src={data.logo.src}
        alt={`${data.name} logo`}
      />
      <div
        className={`ecosystem-tooltip absolute block w-auto h-auto text-center pointer-events-none p-4 ${tooltipPosition}`}
        aria-hidden={"false"}
      >
        <h5 className="h6 text-white text-center mb-0 whitespace-nowrap">
          {data.name}
        </h5>
        <p className="mb-0 whitespace-nowrap">{data.category}</p>
      </div>
    </div>
  );
};

export default PossibleEcosystemGridItem;
