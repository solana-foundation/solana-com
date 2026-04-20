import type { CompanyRecord } from "../../types";
import comicbookLogoDark from "../../../assets/companies/comicbook/logo-dark.png";
import comicbookLogoLight from "../../../assets/companies/comicbook/logo-light.png";
import comicbookLogoBrand from "../../../assets/companies/comicbook/logo-brand.png";
import comicbookLogoMonotone from "../../../assets/companies/comicbook/logo-monotone.svg";
import comicbookMark from "../../../assets/companies/comicbook/mark.png";

export const comicbook = {
  id: "comicbook",
  slug: "comicbook",
  name: "ComicBook",
  profile: {
    tagline: "The #1 site for everything geek",
    summary:
      "ComicBook.com is a leading entertainment news website covering comics, movies, TV shows, video games, and anime.",
    description:
      "ComicBook.com, part of Savage Ventures, is a top-tier digital media platform for geek entertainment news spanning superheroes, horror, science fiction, anime, and gaming. The site publishes hundreds of articles weekly alongside podcasts and daily video content, with a massive social media footprint across YouTube, Facebook, Instagram, and X.",
    sector: "Community",
    type: "Company",
    links: {
      website: "https://comicbook.com/",
    },
    socials: {
      x: "https://x.com/ComicBook",
      youtube: "https://www.youtube.com/user/ComicBookCom",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: comicbookLogoLight,
      theme: "light",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: comicbookLogoDark,
      theme: "dark",
    },
    {
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: comicbookLogoMonotone,
      treatment: "monotone",
    },
    {
      id: "logo-brand",
      fileName: "logo-brand.png",
      format: "png",
      source: comicbookLogoBrand,
    },
    {
      id: "mark",
      fileName: "mark.png",
      format: "png",
      source: comicbookMark,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
