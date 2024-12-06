import Link from "next/link";
import { Trans } from "next-i18next";
import classNames from "classnames";

import Button from "@/components/solutions/Button";
import CaretIcon from "@/components/icons/Caret";
import { AnimatedText } from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./FooterCallout.module.scss";

interface FooterCalloutProps {
  title?: string;
  text?: string;
  btnText?: string;
  btnUrl?: string;
  btnLargeText?: string;
  btnLargeUrl?: string;
  className?: string;
  topSectionClassName?: string;
  buttonLargeClassName?: string;
}

const FooterCallout = ({
  title,
  text,
  btnText,
  btnUrl,
  btnLargeText,
  btnLargeUrl,
  className,
  topSectionClassName,
  buttonLargeClassName,
}: FooterCalloutProps) => {
  return (
    <section className={classNames(styles.FooterCallout, className)}>
      <div className={styles.Container}>
        <div
          className={classNames(
            styles.TopSection,
            "page-width",
            topSectionClassName,
          )}
        >
          {title && (
            <AnimatedText element="h2" as="heading" className={styles.Title}>
              {title}
            </AnimatedText>
          )}

          <div className={styles.TextBtnWrapper}>
            {text && (
              <AnimatedText element="p" as="paragraph" className={styles.Text}>
                <Trans i18nKey={text} />
              </AnimatedText>
            )}

            {btnText && btnUrl && (
              <MotionSlideIn>
                <Button text={btnText} url={btnUrl} target="_blank" />
              </MotionSlideIn>
            )}
          </div>
        </div>

        {btnLargeText && btnLargeUrl && (
          <div
            className={classNames(
              styles.ButtonLargeWrapper,
              "page-width",
              buttonLargeClassName,
            )}
          >
            <MotionSlideIn>
              {btnLargeUrl.includes("@") ? (
                <a
                  href={`mailto:${btnLargeUrl}`}
                  className={styles.ButtonLarge}
                  aria-label={`Email: ${btnLargeText}`}
                >
                  <Trans i18nKey={btnLargeText} />
                  <CaretIcon />
                </a>
              ) : (
                <Link
                  href={btnLargeUrl}
                  className={styles.ButtonLarge}
                  target="_blank"
                  aria-label={`Visit: ${btnLargeText}`}
                >
                  <Trans i18nKey={btnLargeText} />
                  <CaretIcon />
                </Link>
              )}
            </MotionSlideIn>
          </div>
        )}
      </div>
    </section>
  );
};

export default FooterCallout;
