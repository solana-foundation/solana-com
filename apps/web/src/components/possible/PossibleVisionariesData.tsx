import { useTranslations } from "next-intl";
import heliumSpeaker01 from "assets/possible/visionaries/Helium_speaker_01.png";
import heliumSpeaker02 from "assets/possible/visionaries/Helium_speaker_02.png";
import heliumSpeaker03 from "assets/possible/visionaries/Helium_speaker_03.png";
import heliumPoster from "assets/possible/visionaries/Helium_poster.jpg";
import decafSpeaker01 from "assets/possible/visionaries/Decaf_speaker_01.png";
import decafPoster from "assets/possible/visionaries/Decaf_poster.jpg";
import dripSpeaker01 from "assets/possible/visionaries/DRiP_speaker_01.png";
import dripPoster from "assets/possible/visionaries/DRiP_poster.jpg";
import hivemapperSpeaker01 from "assets/possible/visionaries/Hivemapper_speaker_01.png";
import hivemapperPoster from "assets/possible/visionaries/Hivemapper_poster.jpg";
import orcaSpeaker01 from "assets/possible/visionaries/Orca_speaker_01.png";
import orcaSpeaker02 from "assets/possible/visionaries/Orca_speaker_02.png";
import orcaPoster from "assets/possible/visionaries/Orca_poster.jpg";
import dialectSpeaker01 from "assets/possible/visionaries/Dialect_speaker_01.png";
import dialectPoster from "assets/possible/visionaries/Dialect_poster.jpg";
import heliusSpeaker01 from "assets/possible/visionaries/Helius_speaker_01.png";
import heliusPoster from "assets/possible/visionaries/Helius_poster.jpg";

type Episode = {
  name: string;
  title: string;
  description: string;
};

export const PossibleVisionariesData = () => {
  const t = useTranslations();
  const episodes = t.raw("possible.visionaries.episodes") as Episode[];
  const [ep0, ep1, ep2, ep3, ep4, ep5, ep6] = episodes;
  if (!ep0 || !ep1 || !ep2 || !ep3 || !ep4 || !ep5 || !ep6) return [];

  return [
    {
      speakers: [
        {
          name: "Abhay Kumar",
          image: heliumSpeaker01,
        },
        {
          name: "Scott Sigel",
          image: heliumSpeaker02,
        },
        {
          name: "Noah Prince",
          image: heliumSpeaker03,
        },
      ],
      name: ep4.name,
      title: ep4.title,
      description: ep4.description,
      poster: heliumPoster,
      vimeoId: "923872175",
    },
    {
      speakers: [
        {
          name: "Fernanda Orduña Rangel",
          image: decafSpeaker01,
        },
      ],
      name: ep5.name,
      title: ep5.title,
      description: ep5.description,
      poster: decafPoster,
      vimeoId: "923876499",
    },
    {
      speakers: [
        {
          name: "Vibhu Norby",
          image: dripSpeaker01,
        },
      ],
      name: ep6.name,
      title: ep6.title,
      description: ep6.description,
      poster: dripPoster,
      vimeoId: "923867820",
    },
    {
      speakers: [
        {
          name: "Mert Mumtaz",
          image: heliusSpeaker01,
        },
      ],
      name: ep3.name,
      title: ep3.title,
      description: ep3.description,
      poster: heliusPoster,
      vimeoId: "873378046",
    },
    {
      speakers: [
        {
          name: "Chris Osborn",
          image: dialectSpeaker01,
        },
      ],
      name: ep2.name,
      title: ep2.title,
      description: ep2.description,
      poster: dialectPoster,
      vimeoId: "873360315",
    },
    {
      speakers: [
        {
          name: "Yutaro Mori",
          image: orcaSpeaker01,
        },
        {
          name: "Ori Kwan",
          image: orcaSpeaker02,
        },
      ],
      name: ep1.name,
      title: ep1.title,
      description: ep1.description,
      poster: orcaPoster,
      vimeoId: "873400844",
    },
    {
      speakers: [
        {
          name: "Ariel Seidman",
          image: hivemapperSpeaker01,
        },
      ],
      name: ep0.name,
      title: ep0.title,
      description: ep0.description,
      poster: hivemapperPoster,
      vimeoId: "873394287",
    },
  ];
};
