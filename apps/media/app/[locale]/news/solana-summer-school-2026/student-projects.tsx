import Image from "next/image";
import styles from "./summer-school.module.css";

const uploadRoot = "/uploads/posts/solana-summer-school-2026";
const figmaRoot = `${uploadRoot}/figma/projects`;
const figmaFile =
  "https://www.figma.com/design/Luylq1JM1lfjdhTwNyFHAo/Solana.-Summer-School-Recap-Zine";

const projects = [
  {
    image: "project-01.webp",
    name: "Quant Royale",
    node: "170-767",
    x: 15.1,
    y: 28.8,
    w: 31.1,
    h: 42.2,
  },
  {
    image: "project-02.webp",
    name: "Polaris Oracle",
    node: "170-769",
    x: 0,
    y: 34.6,
    w: 13.8,
    h: 21.4,
  },
  {
    image: "project-03.webp",
    name: "P-Loop",
    node: "170-771",
    x: 16.2,
    y: 73,
    w: 14.2,
    h: 21,
  },
  {
    image: "project-04.webp",
    name: "ZKGate",
    node: "170-773",
    x: 31.7,
    y: 73,
    w: 14.2,
    h: 26.7,
  },
  {
    image: "project-05.webp",
    name: "ZKGate",
    node: "170-775",
    x: 47.2,
    y: 82.5,
    w: 18.3,
    h: 17.5,
  },
  {
    image: "project-06.webp",
    name: "Grail",
    node: "170-777",
    x: 47.3,
    y: 57.8,
    w: 27.1,
    h: 22.6,
  },
  {
    image: "project-07.webp",
    name: "AgentVault",
    node: "170-779",
    x: 75.7,
    y: 57.8,
    w: 10.1,
    h: 32.7,
  },
  {
    image: "project-08.webp",
    name: "Quant Royale",
    node: "170-781",
    x: 47.4,
    y: 28.8,
    w: 29.3,
    h: 27,
  },
  {
    image: "project-09.webp",
    name: "Polaris Oracle",
    node: "170-783",
    x: 77.9,
    y: 28.8,
    w: 22,
    h: 27,
  },
  {
    image: "project-10.webp",
    name: "Ashlar",
    node: "170-785",
    x: 17.3,
    y: 6.2,
    w: 16.8,
    h: 20.5,
  },
  {
    image: "project-11.webp",
    name: "Backr",
    node: "170-787",
    x: 35.4,
    y: 0,
    w: 16.4,
    h: 26.7,
  },
  {
    image: "project-12.webp",
    name: "Polaris Oracle",
    node: "170-789",
    x: 53.2,
    y: 4.3,
    w: 26.7,
    h: 22.4,
  },
  {
    image: "project-13.webp",
    name: "Ashlar",
    node: "170-791",
    x: 81.1,
    y: 6.2,
    w: 13.9,
    h: 20.5,
  },
] as const;

export function StudentProjects() {
  return (
    <section
      aria-labelledby="projects-title"
      className={`not-prose ${styles.canvas} ${styles.projects}`}
    >
      <h2
        id="projects-title"
        className={`${styles.zineHeading} ${styles.projectsHeading}`}
      >
        Student Projects
      </h2>
      <Image
        src={`${figmaRoot}/project-collage-left-doodle.svg`}
        alt=""
        width={197}
        height={145}
        style={{ position: "absolute", left: "5.7%", top: "15%", width: "13%" }}
      />
      <Image
        src={`${figmaRoot}/lightning-bolt.svg`}
        alt=""
        width={51}
        height={116}
        style={{
          position: "absolute",
          right: "9.2%",
          top: "14.5%",
          width: "3.4%",
        }}
      />
      <div className={styles.projectCollage}>
        {projects.map((project) => (
          <a
            key={project.image}
            href={`${figmaFile}?node-id=${project.node}&m=dev`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name} project frame`}
            className={styles.projectShot}
            style={{
              left: `${project.x}%`,
              top: `${project.y}%`,
              width: `${project.w}%`,
              height: `${project.h}%`,
            }}
          >
            <Image
              src={`${uploadRoot}/${project.image}`}
              alt={`${project.name} capstone project`}
              fill
              sizes="30vw"
            />
          </a>
        ))}
      </div>
      <div className={styles.projectDots} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
