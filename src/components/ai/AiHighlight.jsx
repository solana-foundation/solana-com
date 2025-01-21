import classNames from "classnames";
import Image from "next/image";
// import { useTranslation } from "next-i18next";
import Button from "../shared/Button";

import previewImg from "../../../assets/ai/cookbook.png";
import styles from "./AiHighlight.module.scss";

export default function AiHighlight() {
  // const { t } = useTranslation();

  return (
    <section className="pt-10 my-10 overflow-hidden">
      <div className="container position-relative">
        <div className={styles["highlight__light"]}></div>
        <h2 className={styles["highlight__title"]}>
          <span className="d-none d-md-flex align-items-center">
            Cookbook examples
          </span>
        </h2>
        <div className="d-flex flex-column flex-lg-row">
          <div
            className={classNames(
              styles["highlight__plugin--video"],
              "position-relative w-lg-50",
            )}
          >
            <Image src={previewImg} alt="" width={400} height={400} />
          </div>
          <div className="d-flex flex-column w-lg-75 justify-content-center">
            <h3 className={styles["highlight__plugin--title"]}>
              More copy on the Cookbook examples
            </h3>
            <p className={styles["highlight__plugin--content"]}>
              Even more copy on the Cookbook examples here. Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <Button to="https://github.com/solana-developers" newTab>
              Check out Cookbook examples
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
