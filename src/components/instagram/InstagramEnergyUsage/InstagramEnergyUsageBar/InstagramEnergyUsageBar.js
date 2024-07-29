import { memo, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./InstagramEnergyUsageBar.module.scss";
import { useTranslation } from "next-i18next";

function countUpDown(end, duration, container, t, onComplete) {
  let startTimestamp = null;
  const start = parseFloat(container.current.innerHTML.replace(/,/g, ""));
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const newValue = Math.floor(progress * (end - start) + start);
    container.current.innerHTML = t("{{value, number}}", { value: newValue });
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      onComplete();
    }
  };
  window.requestAnimationFrame(step);
}

export default memo(function InstagramEnergyUsageBar({
  color,
  value,
  label,
  unit,
  percentage,
}) {
  const { t } = useTranslation("common");
  const valueContainer = useRef(null);

  const [animatedValue, setAnimatedValue] = useState(value);
  useEffect(() => {
    countUpDown(value, 200, valueContainer, t, () => {
      setAnimatedValue(value);
    });
  }, [value, t]);

  return (
    <div className={classNames(styles["instagram-energy-usage-bar"])}>
      <div className={classNames(styles["instagram-energy-usage-bar__label"])}>
        {label}
      </div>
      <div className={classNames(styles["instagram-energy-usage-bar__value"])}>
        <span
          className={classNames(
            styles["instagram-energy-usage-bar__value-text"],
          )}
          style={{ color }}
          ref={valueContainer}
        >
          {t("{{value, number}}", { value: animatedValue })}
        </span>
        <span
          className={classNames(
            styles["instagram-energy-usage-bar__value-unit"],
          )}
        >
          {unit}
        </span>
      </div>
      <div
        className={classNames(styles["instagram-energy-usage-bar__container"])}
      >
        <div
          className={classNames(styles["instagram-energy-usage-bar__fill"])}
          style={{
            width: percentage,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
});
