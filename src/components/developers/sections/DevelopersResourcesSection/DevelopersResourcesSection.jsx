import { memo } from "react";
import { useTranslation } from "next-i18next";
import CarouselCards from "@/components/shared/CarouselCards";
import DevelopersResourceItem from "./DevelopersResourceItem";
import DevelopersSectionTitle from "../DevelopersSectionTitle";

import styles from "./DevelopersResourcesSection.module.scss";
import Button from "@/components/shared/Button";

export default function DevelopersResourcesSection({
  items,
  baseHref = "/developers/resources",
  translationKey = "resources",
}) {
  const { t } = useTranslation();

  return (
    <section className="mt-10 mt-md-12" id={translationKey}>
      <div className="container">
        <div className="d-md-flex align-items-center justify-content-between mb-6">
          <div>
            <DevelopersSectionTitle
              titleId={`developers.${translationKey}.title`}
            />
            <p className="subdued">
              {t(`developers.${translationKey}.description`)}
            </p>
          </div>
          <Button className="text-nowrap ms-md-4" to={baseHref}>
            {t("developers.documents.view-all")}
          </Button>
        </div>
        <div className={styles["resources-section__carousel-container"]}>
          <CarouselCards>
            <ResourceCards items={items} />
          </CarouselCards>
        </div>

        <div className={styles["resources-section__grid-container"]}>
          <ResourceCards items={items} />
        </div>
      </div>
    </section>
  );
}

const ResourceCards = memo(function ResourceCards({ items }) {
  // const { t } = useTranslation();

  return (
    <>
      {items.map((item, id) => (
        <DevelopersResourceItem
          key={id}
          category={item?.category || item?.difficulty || undefined}
          title={item.title}
          description={item.description}
          url={item.href}
          isExternal={item?.isExternal}
        />
      ))}
    </>
  );
});
