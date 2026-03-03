import { useTranslations } from "next-intl";
import Image from "next/image";

import DevelopersDocumentItem from "./DevelopersDocumentItem";
import DevelopersChangelog from "./DevelopersChangelog";

import styles from "./DevelopersDocumentsSection.module.scss";

import changelogImg from "../../../../../assets/developers/documents/changelog.png";
import { InlineLink } from "../../../../utils/Link";
import DevelopersSectionTitle from "../DevelopersSectionTitle";
import { YT_PLAYLIST_CHANGELOG } from "@/constants/developerContentConfig";

export default function DevelopersDocumentsSection({ latestVideo }) {
  const t = useTranslations();

  return (
    <section className={styles["documents-section"]}>
      <div className="container">
        <div className="mb-12 pt-20">
          <DevelopersSectionTitle titleId="developers.documents.title" />
          <p className="subdued">{t("developers.documents.description")}</p>
        </div>
        <div
          className="flex flex-col"
          style={{
            backgroundColor:
              "linear-gradient(180deg, #19161C 0%, rgba(25, 22, 28, 0) 100%)",
          }}
        >
          <div className="grid grid-cols-12 gap-5 md:gap-10">
            <div className="col-span-12 lg:col-span-6">
              <DevelopersDocumentItem
                title={t("developers.documents.solana-docs.title")}
                description={t("developers.documents.solana-docs.description")}
                url="/docs"
                newTab={false}
              />
            </div>
            <div className="col-span-12 lg:col-span-6 mt-20 lg:mt-0">
              <DevelopersDocumentItem
                title={t("developers.documents.anchor-docs.title")}
                description={t("developers.documents.anchor-docs.description")}
                url="https://www.anchor-lang.com/"
                newTab={true}
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-5 md:gap-10 mt-12 lg:mt-32">
            <div className="col-span-12 lg:col-span-6">
              <DevelopersChangelog latestVideo={latestVideo} />
            </div>
            <div className="col-span-12 lg:col-span-6">
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
