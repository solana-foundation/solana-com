import Image from "next/image";
import styles from "./summer-school.module.css";

const uploadRoot = "/uploads/posts/solana-summer-school-2026";
const figmaRoot = `${uploadRoot}/figma`;

type Project = {
  image: string;
  name: string;
  href?: string;
};

const projects: readonly Project[] = [
  {
    image: "project-01.webp",
    name: "Quant Royale",
    href: "https://quantroyale.com",
  },
  {
    image: "project-02.webp",
    name: "Auron",
    href: "https://auron-mocha.vercel.app/",
  },
  { image: "project-03.webp", name: "P-Loop" },
  { image: "project-04.webp", name: "ZKGate" },
  { image: "project-05.webp", name: "ZKGate" },
  {
    image: "project-06.webp",
    name: "Riveseek",
    href: "https://riveseek.vercel.app/",
  },
  { image: "project-07.webp", name: "AgentVault" },
  {
    image: "project-08.webp",
    name: "Quant Royale",
    href: "https://quantroyale.com",
  },
  {
    image: "project-09.webp",
    name: "Polaris Oracle",
    href: "https://polaris-oracle.xyz/",
  },
  {
    image: "project-10.webp",
    name: "Agentic Commerce Platform",
    href: "https://acp-full-frontend-pwq1-swart.vercel.app/agents",
  },
  { image: "project-11.webp", name: "Backr" },
  { image: "project-12.webp", name: "Polaris Oracle" },
  { image: "project-13.webp", name: "Ashlar" },
] as const;

export function StudentProjects() {
  return (
    <section
      aria-labelledby="projects-title"
      className={`not-prose ${styles.canvas} ${styles.projects}`}
    >
      <div className={styles.projectsIntro}>
        <p className={styles.projectsEyebrow}>Demo day · capstone showcase</p>
        <h2
          id="projects-title"
          className={`${styles.zineHeading} ${styles.projectsHeading}`}
        >
          Student Projects
        </h2>
      </div>

      <Image
        src={`${figmaRoot}/projects/project-collage-left-doodle.svg`}
        alt=""
        width={197}
        height={145}
        className={styles.projectsDoodle}
      />
      <Image
        src={`${figmaRoot}/projects/lightning-bolt.svg`}
        alt=""
        width={51}
        height={116}
        className={styles.projectsBolt}
      />
      <Image
        src={`${figmaRoot}/curriculum/week-1-star.svg`}
        alt=""
        width={72}
        height={72}
        className={`${styles.projectsTexture} ${styles.projectsTextureStar}`}
      />
      <Image
        src={`${figmaRoot}/curriculum/week-4-smiley.svg`}
        alt=""
        width={72}
        height={72}
        className={`${styles.projectsTexture} ${styles.projectsTextureSmiley}`}
      />
      <Image
        src={`${figmaRoot}/curriculum/week-5-burst.svg`}
        alt=""
        width={72}
        height={72}
        className={`${styles.projectsTexture} ${styles.projectsTextureBurst}`}
      />

      <div className={styles.projectEditorialCollage}>
        {projects.map(({ image, name, href }) => (
          <figure key={image} className={styles.projectEditorialShot}>
            <span className={styles.projectEditorialImage}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visit ${name}`}
                  className={styles.projectEditorialLink}
                >
                  <Image
                    src={`${uploadRoot}/${image}`}
                    alt={`${name} capstone presentation`}
                    fill
                    sizes="(max-width: 640px) 88vw, 48vw"
                  />
                </a>
              ) : (
                <Image
                  src={`${uploadRoot}/${image}`}
                  alt={`${name} capstone presentation`}
                  fill
                  sizes="(max-width: 640px) 88vw, 48vw"
                />
              )}
            </span>
          </figure>
        ))}
      </div>
    </section>
  );
}
