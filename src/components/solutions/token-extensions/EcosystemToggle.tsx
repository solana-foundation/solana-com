import { ReactNode, Fragment } from "react";
import classNames from "classnames";
import { Trans } from "next-i18next";
import * as Accordion from "@radix-ui/react-accordion";

import Text, { AnimatedText, GradientText } from "@/components/shared/Text";
import CollapsibleContent from "@/components/shared/CollapsibleContent";

import styles from "./EcosystemToggle.module.scss";

interface EcosystemItem {
  label: string;
  content: ReactNode;
}

const AccordionItem = ({ value, label, content }) => {
  return (
    <Accordion.Item className={styles.EcosystemItem} value={value}>
      <Accordion.Header>
        <Accordion.Trigger className={styles.ItemToggleBtn}>
          {label}
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content className={styles.AccordionContent}>
        {content}
      </Accordion.Content>
    </Accordion.Item>
  );
};

const EcosystemToggle = ({ titleKey, textKey, toggleLabel, items }) => {
  return (
    <div className={classNames(styles.EcosystemToggle, "page-width")}>
      <div className={classNames("page-width", styles.TitleBlock)}>
        {titleKey && (
          <AnimatedText element="h2" as="heading" className={styles.Title}>
            <Trans
              i18nKey={titleKey}
              components={{
                gradient: (
                  <GradientText gradient="linear-gradient(89.77deg, #80ECFF 0.17%, #64A8F2 50.54%, #9945FF 99.77%);" />
                ),
              }}
            />
          </AnimatedText>
        )}

        {textKey && (
          <AnimatedText element="p" as="paragraph" className={styles.Text}>
            <Trans i18nKey={textKey} />
          </AnimatedText>
        )}
      </div>

      <div className={styles.CollapsibleContentWrapper}>
        <Accordion.Root type="single" defaultValue="item-0" collapsible>
          <CollapsibleContent
            label={toggleLabel}
            triggerClassName={styles.ToggleBtn}
            className={styles.MainCollapsible}
            previewContent={
              <div className={styles.EcosystemPreviewContent}>
                {items.slice(0, 3).map((item: EcosystemItem, index: number) => (
                  <Fragment key={`item-${index}`}>
                    <AccordionItem
                      value={`item-${index}`}
                      label={item.label}
                      content={item.content}
                    />
                  </Fragment>
                ))}
              </div>
            }
          >
            {items
              .slice(3)
              .map(
                (
                  item: { label: string; content?: ReactNode },
                  index: number,
                ) => (
                  <Fragment key={`item-${index + 3}`}>
                    <AccordionItem
                      value={`item-${index + 3}`}
                      label={item.label}
                      content={item.content}
                    />
                  </Fragment>
                ),
              )}
            {/* {items
              .slice(3)
              .map(
                (
                  item: { label: string; content?: ReactNode },
                  index: number,
                ) => (
                  <Fragment key={`item-${index + 3}`}>
                    <AccordionItem
                      value={`item-${index + 3}`}
                      label={item.label}
                      content={item.content}
                    />
                  </Fragment>
                ),
              )} */}
          </CollapsibleContent>
        </Accordion.Root>
      </div>
    </div>
  );
};

export const EcosystemItemContentWrap = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className={styles.EcosystemItemContent}>
    <div className={styles.EcosystemItemContentInner}>{children}</div>
  </div>
);

export const EcosystemItemContentTitle = ({ text }: { text: string }) => (
  <Text element="h4">{text}</Text>
);

export const EcosystemItemContentText = ({ text }: { text: string }) => (
  <Text element="p">{text}</Text>
);

export default EcosystemToggle;
