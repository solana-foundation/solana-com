import { useState, useRef } from "react";
import styles from "./PossibleEcosystemGridItem.module.scss";

const PossibleEcosystemGridItem = ({ data }) => {
  const [tooltipPosition, setTooltipPosition] = useState(
    "top-100 start-50 translate-middle-x",
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
        setTooltipPosition("top-50 start-100 translate-middle-y");
      } else if (right >= innerWidth) {
        setTooltipPosition("top-50 end-100 translate-middle-y");
      } else {
        setTooltipPosition("top-100 start-50 translate-middle-x");
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
        className={`ecosystem-tooltip position-absolute d-block w-auto h-auto text-center pointer-event-none p-4 ${tooltipPosition}`}
        aria-hidden={"false"}
      >
        <h5 className="h6 text-white text-center mb-0 text-nowrap">
          {data.name}
        </h5>
        <p className="mb-0 text-nowrap">{data.category}</p>
      </div>
    </div>
  );
};

export default PossibleEcosystemGridItem;
