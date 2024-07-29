import BreakpointHero from "../../../assets/breakpoint/hero.jpg";
import Image from "next/image";
import styles from "./BreakpointSimpleHero.module.scss";

const SimpleHero = ({ frontmatter }) => {
  return (
    <div className={styles["simplehero"]}>
      <Image
        src={BreakpointHero}
        alt=""
        className={styles["simplehero__img"]}
        placeholder="blur"
      />
      <div className="container my-8">
        <h1 className="fw-normal">{frontmatter.title}</h1>
      </div>
    </div>
  );
};

export default SimpleHero;
