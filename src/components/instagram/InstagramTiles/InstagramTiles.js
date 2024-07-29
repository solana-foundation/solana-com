import { memo, useState, useCallback } from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import styles from "./InstagramTiles.module.scss";
import InstagramColorGlow from "../InstagramColorGlow/InstagramColorGlow";
import InstagramTilesTile from "./InstagramTilesTile/InstagramTilesTile";
import CatalinaWhales from "../../../../assets/instagram/tiles/catalina-whales.jpg";
import Fractal from "../../../../assets/instagram/tiles/fractal.jpg";
import GrimSyndicate from "../../../../assets/instagram/tiles/grim-syndicate.jpg";
import Y00ts from "../../../../assets/instagram/tiles/y00ts.jpg";
import SolanaMonkeyBusiness from "../../../../assets/instagram/tiles/solana-monkey-business.jpg";
import Aurory from "../../../../assets/instagram/tiles/aurory.jpg";
import DegenApe from "../../../../assets/instagram/tiles/degen-ape.jpg";
import OkayBears from "../../../../assets/instagram/tiles/okay-bears.jpg";
import Boogles from "../../../../assets/instagram/tiles/boogles.jpg";
import DeGods from "../../../../assets/instagram/tiles/degods.jpg";

import Holaplex from "../../../../assets/instagram/tiles/holaplex.jpg";
import Metaplex from "../../../../assets/instagram/tiles/metaplex.jpg";
import Formfunction from "../../../../assets/instagram/tiles/formfunction.jpg";
import ExchangeArt from "../../../../assets/instagram/tiles/exchangeart.jpg";
import Hyperspace from "../../../../assets/instagram/tiles/hyperspace.jpg";
import MagicEden from "../../../../assets/instagram/tiles/magiceden.jpg";

const TILE_IMAGES = {
  CatalinaWhales,
  Fractal,
  GrimSyndicate,
  Y00ts,
  SolanaMonkeyBusiness,
  Aurory,
  DegenApe,
  OkayBears,
  Boogles,
  DeGods,
  Holaplex,
  Metaplex,
  Formfunction,
  ExchangeArt,
  Hyperspace,
  MagicEden,
};

const TILE_LINKS = {
  CatalinaWhales: "https://barracuda.io/catalinawhales",
  Fractal: "https://www.fractal.is/",
  GrimSyndicate: "https://grimsyndicate.com/",
  Y00ts: "https://www.y00ts.com/",
  SolanaMonkeyBusiness: "https://solanamonkey.business/",
  Aurory: "https://aurory.io/",
  DegenApe: "http://marketplace.degenape.academy/",
  OkayBears: "https://www.okaybears.com/",
  Boogles: "https://linktr.ee/SolBoogles",
  DeGods: "https://www.degods.com/",
  Holaplex: "https://www.holaplex.com/",
  Metaplex: "https://www.metaplex.com/",
  Formfunction: "https://formfunction.xyz/",
  ExchangeArt: "https://exchange.art/",
  Hyperspace: "https://hyperspace.xyz/",
  MagicEden: "https://magiceden.io/",
};

export default memo(function InstagramTiles() {
  const { t } = useTranslation("common");

  const [openTileIndex, setOpenTileIndex] = useState(-1);
  const TILES = t("instagram.tiles.tiles", { returnObjects: true });

  const onTileClick = useCallback(
    (index) => {
      setOpenTileIndex(openTileIndex === index ? -1 : index);
    },
    [openTileIndex],
  );

  return (
    <section className={styles["instagram-tiles"]}>
      <div
        className={classNames(
          "container-fluid",
          styles["instagram-tiles__container"],
        )}
      >
        <InstagramColorGlow
          color="yellow"
          positionTop="-5%"
          positionLeft="-35%"
        />
        <InstagramColorGlow color="red" positionTop="25%" positionLeft="10%" />
        <InstagramColorGlow
          color="purple"
          positionTop="20%"
          positionLeft="85%"
        />
        <InstagramColorGlow
          color="green"
          positionTop="45%"
          positionLeft="115%"
        />

        <h2 className={styles["instagram-tiles__title"]}>
          {t("instagram.tiles.title")}
        </h2>
        <div className={styles["instagram-tiles__tiles"]}>
          {TILES.map((tile, index) => (
            <InstagramTilesTile
              tile={tile}
              image={TILE_IMAGES[tile.image]}
              link={TILE_LINKS[tile.image]}
              key={tile.title}
              open={openTileIndex === index}
              onTileClick={() => {
                onTileClick(index);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
