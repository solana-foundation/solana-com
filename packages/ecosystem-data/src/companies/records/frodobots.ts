import type { CompanyRecord } from "../../types";
import frodobotsLogoDark from "../../../assets/companies/frodobots/logo-dark.svg";
import frodobotsMarkLight from "../../../assets/companies/frodobots/mark-light.svg";
import frodobotsMarkDark from "../../../assets/companies/frodobots/mark-dark.png";

export const frodobots = {
  id: "frodobots",
  slug: "frodobots",
  name: "FrodoBots",
  profile: {
    tagline: "Crowdsourcing real-world datasets with robotic gaming",
    summary:
      "FrodoBots is a robotics and blockchain company on Solana that lets users remotely control physical robots in a gaming experience while collecting real-world datasets for embodied AI research.",
    description:
      "FrodoBots builds at the intersection of crypto and robotics, operating a global fleet of hundreds of sidewalk robots across cities on six continents. Its flagship product, Earth Rovers, is a drive-to-earn scavenger hunt game where players remotely control 4G-enabled rover robots equipped with cameras and sensors. Player actions generate teleoperation datasets used to train embodied AI foundation models.",
    sector: "Robotics",
    type: "Company",
    links: {
      website: "https://www.frodobots.ai/",
    },
    socials: {
      x: "https://x.com/frodobots",
      linkedin: "https://www.linkedin.com/company/frodobots-lab",
      discord: "https://discord.gg/5mnCnZX4Pr",
      github: "https://github.com/frodobots-org",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: frodobotsLogoDark,
      theme: "dark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: frodobotsMarkLight,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.png",
      format: "png",
      source: frodobotsMarkDark,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
