import styles from "./AccelerateSponsors.module.scss";

interface Sponsor {
  name: string;
  image: string;
}

interface AccelerateSponsorsProps {
  sponsors: Sponsor[];
  minLogos?: number;
}

export function AccelerateSponsors({
  sponsors,
  minLogos = 9,
}: AccelerateSponsorsProps) {
  const filledLogos =
    sponsors.length >= 5
      ? sponsors
      : Array.from(
          { length: Math.ceil(minLogos / sponsors.length) },
          () => sponsors,
        )
          .flat()
          .slice(0, minLogos);

  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {[...filledLogos, ...filledLogos].map((logo, index) => (
          <div className={styles.logoContainer} key={index}>
            <img src={logo.image} alt={logo.name} className={styles.logo} />
          </div>
        ))}
      </div>
    </div>
  );
}
