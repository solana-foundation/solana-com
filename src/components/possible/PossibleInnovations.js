import { createRef } from "react";
import Accordion from "react-bootstrap/Accordion";
import Link from "@/utils/Link";
import compressNFTImage from "../../../assets/possible/innovation-compressed-nft.png";
import scalableImage from "../../../assets/possible/innovation-scalable.png";
import lowcarbonImage from "../../../assets/possible/innovation-lowcarbon.png";
import concensusImage from "../../../assets/possible/innovation-concensus.png";
import sagaImage from "../../../assets/possible/innovation-saga.png";
import InnovationAccordion from "./PossibleInnovationAccordion";
import { Trans, useTranslation } from "next-i18next";

const PossibleInnovation = () => {
  // create refs for each accordion item - need this to open accordions via the control buttons
  const refs = Array.from({ length: 5 }).map((_) => createRef());
  const { t } = useTranslation();

  return (
    <Accordion alwaysOpen>
      <section
        id={`possible-innovation`}
        className="container pt-12 pb-8 pt-md-6 pb-md-0 position-relative z-3"
      >
        <div className={`row d-flex`}>
          <div className="col-12 col-md-6">
            <h2 className="h2 mb-0 mb-md-11 pt-md-11">
              {t("possible.innovations.title")}
            </h2>
          </div>
        </div>
        <div className={`row d-flex`}>
          <div className="col-12 col-md-6">
            {/* MINT */}
            <InnovationAccordion
              ref={refs[0]}
              index={0}
              image={compressNFTImage}
              animatedIcon={
                "https://player.vimeo.com/progressive_redirect/playback/864508527/rendition/360p/file.mp4?loc=external&signature=5feb0751138c0f6136f1c44152011a42ff5c5f53b40a8dd46bfdae04823909ae"
              }
              imageAlt={`${t("possible.innovations.mint.controlText")} icon`}
              title={t("possible.innovations.mint.title")}
              color={"206, 26, 203"}
            >
              {t("possible.innovations.mint.description1")}
              <br />
              <br />
              <Trans
                i18nKey="possible.innovations.mint.description2"
                components={{
                  docsLink: (
                    <Link
                      href="/news/state-compression-compressed-nfts-solana"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                }}
              />
            </InnovationAccordion>

            {/* SCALE */}
            <InnovationAccordion
              ref={refs[1]}
              index={1}
              image={scalableImage}
              animatedIcon={
                "https://player.vimeo.com/progressive_redirect/playback/864519842/rendition/360p/file.mp4?loc=external&signature=eace99a0edcd8889feba26bfb91a5c80b46ff9660f2eb690c219b58a5cef338b"
              }
              imageAlt={`${t("possible.innovations.scale.controlText")} icon`}
              title={t("possible.innovations.scale.title")}
              color={"152, 69, 254"}
            >
              <Trans
                i18nKey="possible.innovations.scale.description1"
                components={{
                  gamingLink: (
                    <Link
                      href="/developers/gaming"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                }}
              />
              <br />
              <br />
              <Trans
                i18nKey="possible.innovations.scale.description2"
                components={{
                  heliumLink: (
                    <Link
                      href="/news/helium-upgrades-to-solana"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                  hivemapperLink: (
                    <Link
                      href="/news/case-study-hivemapper"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                  aiLink: (
                    <Link
                      href="/ai"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                }}
              />
            </InnovationAccordion>

            {/* CLIMATE */}
            <InnovationAccordion
              ref={refs[2]}
              index={2}
              image={lowcarbonImage}
              animatedIcon={
                "https://player.vimeo.com/progressive_redirect/playback/864519832/rendition/360p/file.mp4?loc=external&signature=568925fd9fee65dc791fd69c0abf8a0ac670f49bb8e41575d653df5a83ae099e"
              }
              imageAlt={`${t("possible.innovations.climate.controlText")} icon`}
              title={t("possible.innovations.climate.title")}
              color={"25, 251, 155"}
            >
              <Trans
                i18nKey="possible.innovations.climate.description1"
                components={{
                  environmentLink: (
                    <Link
                      href="/environment"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                  emissionsLink: (
                    <Link
                      href="/news/announcing-real-time-emissions-measurement-on-the-solana-blockchain"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                }}
              />
              <br />
              <br />
              {t("possible.innovations.climate.description2")}
            </InnovationAccordion>
          </div>
          <div className="col-12 col-md-6">
            {/* Payment */}
            <InnovationAccordion
              ref={refs[3]}
              index={3}
              image={concensusImage}
              animatedIcon={
                "https://player.vimeo.com/progressive_redirect/playback/864508546/rendition/360p/file.mp4?loc=external&signature=fb9b841e28c0665848f84f11e306d3f2de6d872b6aaa79d3d008f13a91b94fb0"
              }
              imageAlt={`${t("possible.innovations.payment.controlText")} icon`}
              title={t("possible.innovations.payment.title")}
              color={"255, 213, 18"}
            >
              <Trans
                i18nKey="possible.innovations.payment.description1"
                components={{
                  paymentsLink: (
                    <Link
                      href="/developers/payments"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                  solanapayLink: (
                    <Link
                      target={"_blank"}
                      href="https://solanapay.com/"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                }}
              />
              <br />
              <br />
              {t("possible.innovations.payment.description2")}
            </InnovationAccordion>

            {/* WEB3 */}
            <InnovationAccordion
              ref={refs[4]}
              index={4}
              image={sagaImage}
              animatedIcon={
                "https://player.vimeo.com/progressive_redirect/playback/864508562/rendition/360p/file.mp4?loc=external&signature=71c5045ecdf9c5dd57a32dd758d6da6b738a89d557c8cbdc6c107360899d15da"
              }
              imageAlt={`${t("possible.innovations.web3.controlText")} icon`}
              title={t("possible.innovations.web3.title")}
              color={"32, 207, 241"}
            >
              <Trans
                i18nKey="possible.innovations.web3.description1"
                components={{
                  solanaMobileLink: (
                    <Link
                      target={"_blank"}
                      href="https://solanamobile.com/"
                      className="text-decoration-underline copy__link"
                    ></Link>
                  ),
                }}
              />
              <br />
              <br />
              {t("possible.innovations.web3.description2")}
            </InnovationAccordion>
          </div>
        </div>
      </section>
    </Accordion>
  );
};

export default PossibleInnovation;
