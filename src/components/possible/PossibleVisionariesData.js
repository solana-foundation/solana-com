import { useTranslation } from "next-i18next";
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

export const PossibleVisionariesData = () => {
  const { t } = useTranslation("common");
  const episodes = t("possible.visionaries.episodes", { returnObjects: true });

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
      name: episodes[4].name,
      title: episodes[4].title,
      description: episodes[4].description,
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
      name: episodes[5].name,
      title: episodes[5].title,
      description: episodes[5].description,
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
      name: episodes[6].name,
      title: episodes[6].title,
      description: episodes[6].description,
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
      name: episodes[3].name,
      title: episodes[3].title,
      description: episodes[3].description,
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
      name: episodes[2].name,
      title: episodes[2].title,
      description: episodes[2].description,
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
      name: episodes[1].name,
      title: episodes[1].title,
      description: episodes[1].description,
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
      name: episodes[0].name,
      title: episodes[0].title,
      description: episodes[0].description,
      poster: hivemapperPoster,
      vimeoId: "873394287",
    },
  ];
};
