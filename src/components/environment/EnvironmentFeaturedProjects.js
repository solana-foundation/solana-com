import classNames from "classnames";
import Image from "next/image";
import { Button } from "@solana-foundation/solana-lib";
import { useTranslation } from "next-i18next";
import styles from "./EnvironmentFeaturedProjects.module.scss";

import GainForestImg from "../../../assets/environment/projects/gainforest.jpg";
import EcoTokenImg from "../../../assets/environment/projects/ecotoken.jpg";
import SunriseStake from "../../../assets/environment/projects/sunrisestake.jpg";
import OutsiteImg from "../../../assets/environment/projects/outside.png";
import WiHiImg from "../../../assets/environment/projects/wihi.png";

export default function EnvironmentFeaturedProjects() {
  const { t } = useTranslation();
  const projects = [
    {
      title: t("environment.featured-projects.projects.ecoToken.title"),
      description: t(
        "environment.featured-projects.projects.ecoToken.description",
      ),
      image: EcoTokenImg,
      links: [
        {
          callToAction: t(
            "environment.featured-projects.projects.ecoToken.links.website",
          ),
          url: "https://ecotoken.earth/",
          isExternal: true,
        },
      ],
    },
    {
      title: t("environment.featured-projects.projects.sunriseStake.title"),
      description: t(
        "environment.featured-projects.projects.sunriseStake.description",
      ),
      image: SunriseStake,
      links: [
        {
          callToAction: t(
            "environment.featured-projects.projects.sunriseStake.links.website",
          ),
          url: "https://www.sunrisestake.com/",
          isExternal: true,
        },
      ],
    },
    {
      title: t("environment.featured-projects.projects.outerverse.title"),
      description: t(
        "environment.featured-projects.projects.outerverse.description",
      ),
      image: OutsiteImg,
      links: [
        {
          callToAction: t(
            "environment.featured-projects.projects.outerverse.links.website",
          ),
          url: "https://www.outside.io/",
          isExternal: true,
        },
      ],
    },
    {
      title: t("environment.featured-projects.projects.wiHi.title"),
      description: t("environment.featured-projects.projects.wiHi.description"),
      image: WiHiImg,
      links: [
        {
          callToAction: t(
            "environment.featured-projects.projects.wiHi.links.website",
          ),
          url: "https://www.noetika.tech/weather",
          isExternal: true,
        },
      ],
    },
  ];

  const gainforest = {
    title: t("environment.featured-projects.projects.gainForest.title"),
    description: t(
      "environment.featured-projects.projects.gainForest.description",
    ),
    image: GainForestImg,
    links: [
      {
        callToAction: t(
          "environment.featured-projects.projects.gainForest.links.caseStudy",
        ),
        url: "https://solana.com/news/case-study-gainforest",
        isExternal: false,
      },
      {
        callToAction: t(
          "environment.featured-projects.projects.gainForest.links.website",
        ),
        url: "https://gainforest.earth/",
        isExternal: true,
      },
    ],
  };

  return (
    <section
      className={classNames(
        "container my-10",
        styles["environment-featured-projects"],
      )}
    >
      <h2 className="h3 text-center mb-5 mb-lg-8">
        {t("environment.featured-projects.title")}
      </h2>

      <div
        className={classNames(
          "card",
          styles["environment-featured-projects__card"],
        )}
      >
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className={styles["details"]}>
              <h3 className={styles["details__title"]}>{gainforest.title}</h3>
              <p
                className={classNames(
                  "subdued",
                  styles["details__description"],
                )}
              >
                {gainforest.description}
              </p>
            </div>
            {gainforest.links.map((link, i) => {
              return (
                <Button
                  key={i}
                  url={link.url}
                  hierarchy={"outline"}
                  className="me-2 mb-2"
                  endIcon={link.isExternal ? "arrow-up-right" : null}
                  size={"md"}
                  iconSize={"sm"}
                >
                  {link.callToAction}
                </Button>
              );
            })}
          </div>
          <div className={"col-lg-6 d-flex justify-content-center"}>
            <Image
              className="rounded img-fluid"
              src={GainForestImg}
              alt={`${gainforest.title}`}
              width={500}
              height={400}
            />
          </div>
        </div>
      </div>

      <div className="row my-4">
        {projects.map((el, i) => {
          return (
            <div key={i} className="col-lg-6 my-2">
              <div
                className={classNames(
                  "card h-100",
                  styles["environment-featured-projects__card"],
                )}
              >
                <div
                  className={classNames(
                    styles["img-container"],
                    "d-flex align-items-center mb-4",
                  )}
                >
                  <Image
                    src={el.image}
                    alt={`${el.title}`}
                    className={classNames(
                      styles["img-container__img-single"],
                      "rounded",
                    )}
                    width={50}
                    height={50}
                  />
                  <h4 className="h5 ms-2 mb-0">{el.title}</h4>
                </div>

                <p className="subdued small">{el.description}</p>
                {el.links.map((link, i) => {
                  return (
                    <Button
                      key={i}
                      url={link.url}
                      hierarchy={"outline"}
                      className="me-2 mb-2"
                      endIcon={link.isExternal ? "arrow-up-right" : null}
                      size={"md"}
                      iconSize={"sm"}
                    >
                      {link.callToAction}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
