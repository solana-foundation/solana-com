import { useTranslation } from "next-i18next";
import Image from "next/legacy/image";

import DevelopersDocumentItem from "./DevelopersDocumentItem";
import DevelopersChangelog from "./DevelopersChangelog";

import styles from "./DevelopersDocumentsSection.module.scss";

import changelogImg from "../../../../../assets/developers/documents/changelog.png";
import { InlineLink } from "../../../../utils/Link";
import DevelopersSectionTitle from "../DevelopersSectionTitle";
import { YT_PLAYLIST_CHANGELOG } from "@/constants/developerContentConfig";

export default function DevelopersDocumentsSection({ latestVideo }) {
  const { t } = useTranslation();

  return (
    <section className={styles["documents-section"]}>
      <div className="container">
        <div className="mb-8 pt-10">
          <DevelopersSectionTitle titleId="developers.documents.title" />
          <p className="subdued">{t("developers.documents.description")}</p>
        </div>
        <div
          className="d-flex flex-column"
          style={{
            backgroundColor:
              "linear-gradient(180deg, #19161C 0%, rgba(25, 22, 28, 0) 100%)",
          }}
        >
          <div className="row">
            <div className="col-12 col-lg-6">
              <DevelopersDocumentItem
                title={t("developers.documents.solana-docs.title")}
                description={t("developers.documents.solana-docs.description")}
                url="/docs"
                newTab={false}
              />
            </div>
            <div className="col-12 col-lg-6 mt-10 mt-lg-0">
              <DevelopersDocumentItem
                title={t("developers.documents.anchor-docs.title")}
                description={t("developers.documents.anchor-docs.description")}
                url="https://www.anchor-lang.com/"
                newTab={true}
              />
            </div>
          </div>
          <div className="row mt-8 mt-lg-12">
            <div className="col-12 col-lg-6">
              <DevelopersChangelog latestVideo={latestVideo} />
            </div>
            <div className="col-12 col-lg-6">
              <InlineLink
                to={`https://www.youtube.com/playlist?list=${YT_PLAYLIST_CHANGELOG}`}
              >
                <Image src={changelogImg} alt="Solana Changelog" />
              </InlineLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
