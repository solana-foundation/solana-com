import AccelerateHero from "../../../assets/accelerate/hero.jpg";
import Image from "next/image";
import styles from "./AccelerateSimpleHero.module.scss";

const SimpleHero = ({ title }) => {
  return (
    <div className={styles["simplehero"]}>
      <Image
        src={AccelerateHero}
        alt=""
        className={styles["simplehero__img"]}
      />
      <div className="container my-8">
        <h1 className="fw-normal spacegrotesk">{title}</h1>
      </div>
    </div>
  );
};

export default SimpleHero;
