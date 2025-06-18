import Link from "next/link";
import Image from "next/image";
import { Trans } from "next-i18next";
import classNames from "classnames";

import Button from "@/components/solutions/Button";
import { AnimatedText } from "@/components/shared/Text";
import { SquareArrowOutUpRight } from "lucide-react";

import styles from "./YDeveloperResources.module.scss";

import { ArrowUpRight } from "lucide-react";

interface YDeveloperResourcesLinkProps {
  title: string;
  link?: string;
}

export const YDeveloperResourcesLink = ({
  title,
  link,
}: YDeveloperResourcesLinkProps) => (
  <li>
    {link && (
      <Link href={link} target="_blank">
        {title}
        <SquareArrowOutUpRight color="#D0D0DC" />
      </Link>
    )}
  </li>
);

interface YDeveloperResourcesProps {
  id: string;
  title: string;
  subtitle?: string;
  links?: React.ReactNode;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secButtonText?: string;
  secButtonUrl?: string;
}

const YDeveloperResources = ({
  id,
  title,
  subtitle,
  links,
  primaryButtonText,
  primaryButtonUrl,
  secButtonText,
  secButtonUrl,
}: YDeveloperResourcesProps) => {
  return (
    <section className={styles.developer_resources} id={id}>
      <div className={styles.container}>
        <div className={styles.inner_container}>
          <div className={styles.title_block}>
            <h3 className={styles.title_badge}>Build</h3>
            <AnimatedText element="h2" as="heading">
              <Trans i18nKey={title} />
            </AnimatedText>

            {subtitle && (
              <AnimatedText
                element="p"
                as="paragraph"
                className={classNames(styles.subtitle)}
              >
                <Trans i18nKey={subtitle} />
              </AnimatedText>
            )}

            {links && <ul className={styles.links_wrapper}>{links}</ul>}

            <div className={styles.button_wrapper}>
              {primaryButtonText && primaryButtonUrl && (
                <Button
                  text={primaryButtonText}
                  url={primaryButtonUrl}
                  target="_blank"
                />
              )}

              {secButtonText && secButtonUrl && (
                <a
                  href={secButtonUrl}
                  className={styles.btn_secondary}
                  target="_blank"
                >
                  <span>
                    {secButtonText}
                    <ArrowUpRight size="14" />
                  </span>
                </a>
              )}
            </div>
          </div>

          {title && (
            <div>
              <Image
                src="/src/img/home/dev-resources.svg"
                alt={title}
                width={514}
                height={485}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.random_gradient_bg}></div>
    </section>
  );
};

export default YDeveloperResources;
