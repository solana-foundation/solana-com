import type { CompanyRecord } from "../../types";
import frodobotsLogo from "../../../assets/companies/frodobots/logo.svg";

export const frodobots = {
  "id": "frodobots",
  "slug": "frodobots",
  "name": "FrodoBots",
  "profile": {
    "tagline": "Crowdsourcing real-world datasets with robotic gaming",
    "summary": "FrodoBots is a robotics and blockchain company on Solana that lets users remotely control physical robots in a gaming experience while collecting real-world datasets for embodied AI research.",
    "description": "FrodoBots builds at the intersection of crypto and robotics, operating a global fleet of hundreds of sidewalk robots across cities on six continents. Its flagship product, Earth Rovers, is a drive-to-earn scavenger hunt game where players remotely control 4G-enabled rover robots equipped with cameras and sensors. Player actions generate teleoperation datasets used to train embodied AI foundation models.",
    "sector": "Robotics",
    "type": "Company",
    "links": {
      "website": "https://www.frodobots.ai/"
    },
    "socials": {
      "x": "https://x.com/frodobots",
      "linkedin": "https://www.linkedin.com/company/frodobots-lab",
      "discord": "https://discord.gg/5mnCnZX4Pr",
      "github": "https://github.com/frodobots-org"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": frodobotsLogo
    }
  ]
} satisfies CompanyRecord;
