"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import Image from "next/image";
import styles from "./summer-school.module.css";

const uploadRoot = "/uploads/posts/solana-summer-school-2026";
const figmaRoot = `${uploadRoot}/figma/projects`;
const figmaFile =
  "https://www.figma.com/design/Luylq1JM1lfjdhTwNyFHAo/Solana.-Summer-School-Recap-Zine";

const projects = [
  { image: "project-01.webp", name: "Quant Royale", node: "170-767" },
  { image: "project-02.webp", name: "Polaris Oracle", node: "170-769" },
  { image: "project-03.webp", name: "P-Loop", node: "170-771" },
  { image: "project-04.webp", name: "ZKGate", node: "170-773" },
  { image: "project-05.webp", name: "ZKGate", node: "170-775" },
  { image: "project-06.webp", name: "Grail", node: "170-777" },
  { image: "project-07.webp", name: "AgentVault", node: "170-779" },
  { image: "project-08.webp", name: "Quant Royale", node: "170-781" },
  { image: "project-09.webp", name: "Polaris Oracle", node: "170-783" },
  { image: "project-10.webp", name: "Ashlar", node: "170-785" },
  { image: "project-11.webp", name: "Backr", node: "170-787" },
  { image: "project-12.webp", name: "Polaris Oracle", node: "170-789" },
  { image: "project-13.webp", name: "Ashlar", node: "170-791" },
] as const;

const projectUrl = (node: string) => `${figmaFile}?node-id=${node}&m=dev`;

export function StudentProjects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeProject = projects[activeIndex] ?? projects[0];

  const showProject = (index: number) => {
    setActiveIndex((index + projects.length) % projects.length);
  };

  useEffect(() => {
    const rail = railRef.current;
    const item = itemRefs.current[activeIndex];

    if (!rail || !item) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    rail.scrollTo({
      left: item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeIndex]);

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
        <p className={styles.projectsInstruction}>
          Select a project preview, then open its full presentation.
        </p>
      </div>

      <Image
        src={`${figmaRoot}/project-collage-left-doodle.svg`}
        alt=""
        width={197}
        height={145}
        className={styles.projectsDoodle}
      />
      <Image
        src={`${figmaRoot}/lightning-bolt.svg`}
        alt=""
        width={51}
        height={116}
        className={styles.projectsBolt}
      />

      <div className={styles.projectStage}>
        <div className={styles.projectStageTopline} aria-hidden="true">
          <span>Now showing</span>
          <span>
            {String(activeIndex + 1).padStart(2, "0")} / {projects.length}
          </span>
        </div>

        <a
          href={projectUrl(activeProject.node)}
          target="_blank"
          rel="noreferrer"
          className={styles.projectFeature}
          aria-label={`Open the ${activeProject.name} presentation in a new tab`}
        >
          <Image
            key={activeProject.image}
            src={`${uploadRoot}/${activeProject.image}`}
            alt={`${activeProject.name} capstone presentation`}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 640px) 92vw, 76vw"
          />
          <span className={styles.projectOpen}>
            Open presentation
            <ArrowUpRight aria-hidden="true" />
          </span>
        </a>

        <div className={styles.projectMeta} aria-live="polite">
          <p>
            <span>Project</span>
            {activeProject.name}
          </p>
          <div className={styles.projectArrows}>
            <button
              type="button"
              onClick={() => showProject(activeIndex - 1)}
              aria-label="Show previous project"
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => showProject(activeIndex + 1)}
              aria-label="Show next project"
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.projectBrowseHeader}>
        <p>Browse the demo wall</p>
        <p>
          Drag or scroll
          <ArrowRight aria-hidden="true" />
        </p>
      </div>
      <div
        ref={railRef}
        className={styles.projectRail}
        aria-label="Choose a student project"
      >
        {projects.map((project, index) => (
          <button
            key={project.image}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            type="button"
            aria-pressed={activeIndex === index}
            aria-label={`Show project ${index + 1}: ${project.name}`}
            className={styles.projectThumbnail}
            onClick={() => showProject(index)}
          >
            <span className={styles.projectThumbnailImage}>
              <Image
                src={`${uploadRoot}/${project.image}`}
                alt=""
                fill
                sizes="180px"
              />
            </span>
            <span className={styles.projectThumbnailLabel}>{project.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
