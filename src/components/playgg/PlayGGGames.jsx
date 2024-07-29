import { useTranslation } from "next-i18next";
import styles from "./PlayGGGames.module.scss";
import { InlineLink } from "../shared/Link";
import Image from "next/image";
import br1 from "../../../assets/playgg/games/br1.png";
import aurory from "../../../assets/playgg/games/aurory.png";
import mixmob from "../../../assets/playgg/games/mixmob.png";
import skatex from "../../../assets/playgg/games/skatex.png";
import genopets from "../../../assets/playgg/games/genopets.png";
import staratlas from "../../../assets/playgg/games/staratlas.png";
import honeyland from "../../../assets/playgg/games/honeyland.png";
import alphaleagueracing from "../../../assets/playgg/games/alphaleagueracing.png";
import stepn from "../../../assets/playgg/games/stepn.png";
import earthfromanothersun from "../../../assets/playgg/games/earthfromanothersun.png";
import eternaldragons from "../../../assets/playgg/games/eternaldragons.png";
import caveworld from "../../../assets/playgg/games/caveworld.png";
import reignoftitans from "../../../assets/playgg/games/reignoftitans.png";
import bmc from "../../../assets/playgg/games/bmc.png";
import monkeyleague from "../../../assets/playgg/games/monkeyleague.png";
import angelic from "../../../assets/playgg/games/angelic.png";
import nowayback from "../../../assets/playgg/games/nowayback.png";
import evio from "../../../assets/playgg/games/evio.png";
import bladerite from "../../../assets/playgg/games/bladerite.png";
import miniarena from "../../../assets/playgg/games/miniarena.png";
import mirrorworld from "../../../assets/playgg/games/mirrorworld.png";
import solcraft from "../../../assets/playgg/games/solcraft.png";
import astrospace from "../../../assets/playgg/games/astrospace.png";
import portals from "../../../assets/playgg/games/portals.png";
import moddio from "../../../assets/playgg/games/moddio.png";
import photofinishlive from "../../../assets/playgg/games/photofinishlive.png";
import milliononmars from "../../../assets/playgg/games/milliononmars.png";
import dripdroparena from "../../../assets/playgg/games/dripdroparena.png";
import royalechess from "../../../assets/playgg/games/royalechess.png";
import tinies from "../../../assets/playgg/games/tinies.png";
import chronosdawnoftime from "../../../assets/playgg/games/chronosdawnoftime.png";
import worldseekers from "../../../assets/playgg/games/worldseekers.png";
import alchemy from "../../../assets/playgg/games/alchemy.png";
import laddercaster from "../../../assets/playgg/games/laddercaster.png";
import abysswalkers from "../../../assets/playgg/games/abysswalkers.png";
import projectelunne from "../../../assets/playgg/games/projectelunne.png";
import yesgnome from "../../../assets/playgg/games/yesgnome.png";
import houseofparlay from "../../../assets/playgg/games/houseofparlay.png";
import lowlifeforms from "../../../assets/playgg/games/lowlifeforms.png";
import megaroad from "../../../assets/playgg/games/megaroad.png";
import pogdigital from "../../../assets/playgg/games/pogdigital.png";

const Game = ({ logo, url, name }) => {
  return (
    <InlineLink to={url}>
      <Image src={logo} alt={name} />
      <div className="mono">{name}</div>
    </InlineLink>
  );
};

const PlayGGGames = () => {
  const { t } = useTranslation("common");

  return (
    <div className="container">
      <div className={styles["playgg-games"]}>
        <h2 className="h3">{t("playgg.games.title")}</h2>

        <div className={styles["playgg-games__grid"]}>
          <Game logo={br1} url="https://www.br1game.com/" name="BR1" />
          <Game logo={aurory} url="https://aurory.io/" name="Aurory" />
          <Game logo={mixmob} url="https://www.mixmob.io/" name="MixMob" />
          <Game logo={skatex} url="https://www.skatex.io/" name="SkateX" />
          <Game
            logo={genopets}
            url="https://www.genopets.me/"
            name="Genopets"
          />
          <Game
            logo={staratlas}
            url="https://staratlas.com/"
            name="Star Atlas"
          />
          <Game
            logo={honeyland}
            url="https://honey.land/countdown/"
            name="Honeyland"
          />
          <Game
            logo={alphaleagueracing}
            url="https://www.alphaleagueracing.com/"
            name="Alpha League Racing"
          />
          <Game logo={stepn} url="https://stepn.com/" name="Stepn" />
          <Game
            logo={earthfromanothersun}
            url="https://earthfromanothersun.com/"
            name="Earth From Another Sun"
          />
          <Game
            logo={eternaldragons}
            url="https://www.eternaldragons.com/"
            name="Eternal Dragons"
          />
          <Game
            logo={caveworld}
            url="https://www.caveworld.com/"
            name="Cave World"
          />
          <Game
            logo={reignoftitans}
            url="https://twitter.com/ReignOfTitansGG"
            name="Reign of Titans"
          />
          <Game
            logo={bmc}
            url="https://twitter.com/BMCGamesPortal"
            name="BMC"
          />
          <Game
            logo={monkeyleague}
            url="https://www.monkeyleague.io/"
            name="Monkey League"
          />
          <Game
            logo={angelic}
            url="https://www.angelicthegame.com/"
            name="Angelic"
          />
          <Game logo={nowayback} url="https://nwb.gg/" name="No Way Back" />
          <Game logo={evio} url="https://ev.io/" name="ev.io" />
          <Game
            logo={bladerite}
            url="https://www.theseeds.io/"
            name="Bladerite"
          />
          <Game
            logo={miniarena}
            url="https://www.br1game.com/"
            name="Mini Arena"
          />
          <Game
            logo={mirrorworld}
            url="https://mirrorworld.fun/"
            name="Mirror World"
          />
          <Game
            logo={solcraft}
            url="https://solcraft.online/"
            name="Solcraft"
          />
          <Game
            logo={astrospace}
            url="https://astro-space.xyz/"
            name="Astro Space"
          />
          <Game logo={portals} url="https://theportal.to/" name="Portals" />
          <Game logo={moddio} url="https://www.modd.io/" name="Moddio" />
          <Game
            logo={photofinishlive}
            url="https://photofinish.live/"
            name="Photo Finish Live"
          />
          <Game
            logo={milliononmars}
            url="https://www.milliononmars.com/"
            name="Million on Mars"
          />
          <Game
            logo={dripdroparena}
            url="https://twitter.com/drippieverse"
            name="Drip Drop Arena"
          />
          <Game
            logo={royalechess}
            url="https://www.royalechess.com/"
            name="Royale Chess"
          />
          <Game
            logo={tinies}
            url="https://launcher.elixir.app/games/tinies"
            name="Tinies"
          />
          <Game
            logo={chronosdawnoftime}
            url="https://playchronos.io/"
            name="Chronos: Dawn of Time"
          />
          <Game
            logo={worldseekers}
            url="https://www.worldseekersgame.com/home"
            name="Worldseekers"
          />
          <Game
            logo={alchemy}
            url="https://alchemy.nodia.space/"
            name="Alchemy: Battle for Ankhos"
          />
          <Game
            logo={laddercaster}
            url="https://www.laddercaster.com/"
            name="Laddercaster"
          />
          <Game
            logo={abysswalkers}
            url="https://aw.grimsyndicate.com/"
            name="Abysswalkers"
          />
          <Game
            logo={projectelunne}
            url="https://www.projecteluune.com/"
            name="Project Elunne"
          />
          <Game logo={yesgnome} url="https://www.yesgnome.com/" name="Clash" />
          <Game
            logo={houseofparlay}
            url="https://houseofparlay.com/"
            name="House of Parlay"
          />
          <Game
            logo={lowlifeforms}
            url="https://twitter.com/lowlifeforms"
            name="Lowlife Forms"
          />
          <Game
            logo={megaroad}
            url="https://magiceden.io/launchpad/fidelionnft"
            name="Mega Road (powered by Fidelion)"
          />
          <Game
            logo={pogdigital}
            url="https://www.pogdigital.com/"
            name="Pog Digital"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayGGGames;
