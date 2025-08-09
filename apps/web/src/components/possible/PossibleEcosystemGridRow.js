import { useRef, useEffect, useState, Fragment } from "react";
import styles from "./PossibleEcosystemGridRow.module.scss";
import PossibleEcosystemGridItem from "./PossibleEcosystemGridItem";

const PossibleEcosystemGridRow = ({ data, dir }) => {
  const rowRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(0);
  const [rowWidth, setRowWidth] = useState(0);

  // determine how many times you need to repeat the row for animation
  const getRepeatCount = (width) => {
    const containerWidth =
      typeof window !== "undefined" ? window.innerWidth : 0;
    const repeatCount = Math.ceil(containerWidth / width) * 2;

    return repeatCount;
  };

  const RowDirection =
    dir === "ltr"
      ? "ecosystem__ltr-row--possible"
      : "ecosystem__rtl-row--possible";

  useEffect(() => {
    if (rowRef?.current) {
      const initRowWidth = rowRef?.current.clientWidth || 0;
      const repeatCount = getRepeatCount(initRowWidth);
      setRepeatCount(repeatCount);
    }
  }, []);

  useEffect(() => {
    const rowWidth = rowRef?.current.clientWidth || 0;
    setRowWidth(rowWidth);
  }, [repeatCount]);

  return (
    <div
      ref={rowRef}
      className={styles[RowDirection]}
      style={{ minWidth: rowWidth }}
    >
      {data.map((item, index) => {
        return <PossibleEcosystemGridItem data={item} key={index} />;
      })}
      {Array.from(Array(repeatCount - 1 > 1 ? repeatCount - 1 : 1).keys()).map(
        (i) => (
          <Fragment key={i}>
            {data.map((item, index) => {
              return (
                <PossibleEcosystemGridItem
                  aria-hidden={"true"}
                  data={item}
                  key={index}
                />
              );
            })}
          </Fragment>
        ),
      )}
    </div>
  );
};

export default PossibleEcosystemGridRow;
