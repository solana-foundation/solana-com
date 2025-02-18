import AccelerateHero from "../../../assets/accelerate/hero.jpg";
import AccelerateHeroA from "../../../assets/accelerate/hero-a.png";
import Image from "next/image";
import styles from "./AccelerateSimpleHero.module.scss";

const SimpleHero = ({ title }) => {
  return (
    <div className={styles["simplehero"]}>
      <Image
        src={AccelerateHero}
        alt=""
        className={styles["simplehero__img"]}
        placeholder="blur"
      />
      <Image
        src={AccelerateHeroA}
        alt=""
        className={styles["simplehero__img-blend"]}
        placeholder="blur"
      />
      <div className="container my-8">
        <h1 className="fw-normal spacegrotesk">{title}</h1>
      </div>
    </div>
  );
};

export default SimpleHero;
