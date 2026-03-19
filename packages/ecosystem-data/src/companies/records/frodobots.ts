import type { CompanyRecord } from "../../types";
import frodobotsLogo from "../../../assets/companies/frodobots/logo.svg";

export const frodobots = {
  "id": "frodobots",
  "slug": "frodobots",
  "name": "FrodoBots",
  "profile": {
    "name": "FrodoBots",
    "tagLine": "Crowdsourcing real-world datasets with robotic gaming",
    "descriptionShort": "FrodoBots is a robotics and blockchain company on Solana that lets users remotely control physical robots in a gaming experience while collecting real-world datasets for embodied AI research.",
    "descriptionLong": "FrodoBots builds at the intersection of crypto and robotics, operating a global fleet of hundreds of sidewalk robots across cities on six continents. Its flagship product, Earth Rovers, is a drive-to-earn scavenger hunt game where players remotely control 4G-enabled rover robots equipped with cameras and sensors. Player actions generate teleoperation datasets used to train embodied AI foundation models.",
    "profileSector": {
      "name": "Robotics"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.frodobots.ai/",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/frodobots",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/frodobots-lab",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.gg/5mnCnZX4Pr",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/frodobots-org",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
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
