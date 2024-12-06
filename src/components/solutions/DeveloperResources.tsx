import Link from "next/link";
import Image from "next/image";
import { Trans } from "next-i18next";
import classNames from "classnames";

import Button from "@/components/solutions/Button";
import { AnimatedText } from "@/components/shared/Text";
import CaretIcon from "@/components/icons/Caret";

import styles from "./DeveloperResources.module.scss";

import resourcesImage from "../../../assets/solutions/developer-resources.svg";

interface DeveloperResourcesLinkProps {
  title: string;
  text?: string;
  link?: string;
}

export const DeveloperResourcesLink = ({
  title,
  text,
  link,
}: DeveloperResourcesLinkProps) => (
  <li>
    {link && (
      <Link href={link} target="_blank">
        {title}
        <CaretIcon color="#D0D0DC" />
      </Link>
    )}
    {text && <span className={styles.SubText}>{text}</span>}
  </li>
);

interface DeveloperResourcesProps {
  title: string;
  subtitle?: string;
  links: React.ReactNode;
  id: string;
  buttonText?: string;
  buttonUrl?: string;
  image?: string;
  className?: string;
  imageClassName?: string;
  media?: React.ReactNode;
}

const DeveloperResources = ({
  title,
  subtitle,
  links,
  id,
  buttonText,
  buttonUrl,
  image,
  className,
  imageClassName,
  media,
}: DeveloperResourcesProps) => {
  return (
    <section
      className={classNames(styles.DeveloperResources, className)}
      id={id}
    >
      <div className={styles.Container}>
        <div className={styles.TitleBlock}>
          <AnimatedText element="h2" as="heading" className={styles.Title}>
            <Trans i18nKey={title} />
          </AnimatedText>

          {subtitle && (
            <AnimatedText
              element="p"
              as="paragraph"
              className={classNames(styles.Subtitle)}
            >
              <Trans i18nKey={subtitle} />
            </AnimatedText>
          )}

          {links && <ul className={styles.LinksWrapper}>{links}</ul>}

          {buttonText && buttonUrl && (
            <div className={styles.ButtonWrapper}>
              <Button text={buttonText} url={buttonUrl} target="_blank" />
            </div>
          )}
        </div>

        <div className={classNames(styles.ImageWrapper, imageClassName)}>
          {media ? (
            <div className={styles.CustomMedia}>{media}</div>
          ) : (
            <Image
              src={image ? image : resourcesImage}
              alt={title}
              width={514}
              height={485}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default DeveloperResources;
