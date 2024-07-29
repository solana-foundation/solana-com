import { useTranslation } from "next-i18next";
import CarouselCards from "../../../shared/CarouselCards";
import HackathonWinnerCard from "./HackathonWinnerCard";

import StepnLogo from "../../../../../assets/hackathon/previous-winners/stepn.png";
import MangoLogo from "../../../../../assets/hackathon/previous-winners/mango.png";
import DialectLogo from "../../../../../assets/hackathon/previous-winners/dialect.png";
import UXDLogo from "../../../../../assets/hackathon/previous-winners/uxd.png";
import SolendLogo from "../../../../../assets/hackathon/previous-winners/solend.png";
import MarinadeLogo from "../../../../../assets/hackathon/previous-winners/marinade.png";
import HLogo from "../../../../../assets/hackathon/previous-winners/h.png";
import PortalsLogo from "../../../../../assets/hackathon/previous-winners/portals.png";
import SquadsLogo from "../../../../../assets/hackathon/previous-winners/squads.png";
import SolanafmLogo from "../../../../../assets/hackathon/previous-winners/solanafm.png";
import WordcelLogo from "../../../../../assets/hackathon/previous-winners/wordcel.png";
import GenopetsLogo from "../../../../../assets/hackathon/previous-winners/genopets.png";
import SwitchboardLogo from "../../../../../assets/hackathon/previous-winners/switchboard.png";
import JitoLogo from "../../../../../assets/hackathon/previous-winners/jito.png";
import TensorLogo from "../../../../../assets/hackathon/previous-winners/tensor.png";
import CrossmintLogo from "../../../../../assets/hackathon/previous-winners/crossmint.png";

import styles from "./HackathonPreviousWinnersSection.module.scss";

const pastWinners = [
  { logo: StepnLogo, alt: "Stepn", width: 122, height: 22 },
  { logo: MangoLogo, alt: "Mango", width: 112, height: 33 },
  { logo: DialectLogo, alt: "Dialect", width: 82, height: 21 },
  { logo: UXDLogo, alt: "UXD", width: 75, height: 45 },
  { logo: SolendLogo, alt: "Solend", width: 54, height: 54 },
  { logo: MarinadeLogo, alt: "Marinade", width: 139, height: 23 },
  { logo: HLogo, alt: "Hubble", width: 51, height: 38 },
  { logo: PortalsLogo, alt: "Portals", width: 106, height: 25 },
  { logo: SquadsLogo, alt: "Squads", width: 127, height: 25 },
  { logo: SolanafmLogo, alt: "SolanaFM", width: 113, height: 34 },
  { logo: WordcelLogo, alt: "Wordcel", width: 109, height: 27 },
  { logo: GenopetsLogo, alt: "Genopets", width: 88, height: 25 },
  { logo: SwitchboardLogo, alt: "Switchboard", width: 34, height: 25 },
  { logo: JitoLogo, alt: "Jito", width: 63, height: 25 },
  { logo: TensorLogo, alt: "Tensor", width: 30, height: 25 },
  { logo: CrossmintLogo, alt: "Crossmint", width: 123, height: 25 },
];

export default function HackathonPreviousWinnersSection() {
  const { t } = useTranslation();
  const pastWinnersCards = pastWinners.map(({ logo, alt, width, height }) => (
    <HackathonWinnerCard
      key={alt}
      logo={logo}
      alt={alt}
      width={width}
      height={height}
    />
  ));

  return (
    <section className={styles["previous-winners"]}>
      <div className="container">
        <h2>{t("hackathon.previousWinners.title")}</h2>

        <div className={styles["previous-winners__carousel-container"]}>
          <CarouselCards>{pastWinnersCards}</CarouselCards>
        </div>
        <div className={styles["previous-winners__container"]}>
          {pastWinnersCards}
        </div>
      </div>
    </section>
  );
}
