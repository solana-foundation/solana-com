import classNames from "classnames";
import { useTranslation } from "next-i18next";
import styles from "./InstagramTilesTile.module.scss";

const InstagramTilesTile = ({ tile, image, open, onTileClick, link }) => {
  const { t } = useTranslation("common");

  return (
    <a className={styles["instagram-tile"]} href={link} target="_blank">
      <div
        className={classNames(styles["instagram-tile__image"], {
          [styles["instagram-tile__image--open"]]: open,
        })}
        style={{ backgroundImage: `url(${image.src})` }}
      ></div>
      <div className={styles["instagram-tile__info"]}>
        <div className={styles["instagram-tile__header"]}>
          <h3 className={styles["instagram-tile__title"]}>{tile.title}</h3>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onTileClick(e);
            }}
            aria-label={`${tile.title} - ${
              open
                ? t("instagram.tiles.tileOpenCTA")
                : t("instagram.tiles.tileClosedCTA")
            }`}
            className={styles["instagram-tile__cta"]}
          >
            {open
              ? t("instagram.tiles.tileOpenCTA")
              : t("instagram.tiles.tileClosedCTA")}
            <span
              className={classNames(styles["instagram-tile__cta-arrow"], {
                [styles["instagram-tile__cta-arrow--open"]]: open,
              })}
            />
          </button>
        </div>
        <p
          className={classNames(styles["instagram-tile__description"], {
            [styles["instagram-tile__description--open"]]: open,
          })}
        >
          {tile.description}
        </p>
      </div>
    </a>
  );
};

export default InstagramTilesTile;
