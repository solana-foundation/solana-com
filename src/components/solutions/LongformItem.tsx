/**
 * LongformItem component is a versatile layout component designed to display
 * media and text content in a structured format. It supports various configurations
 * for media placement, text direction, and collapsible content sections.
 *
 * @component
 * @param {ReactNode} [mediaComponent] - The media component to be displayed (e.g., image, video).
 * @param {"left" | "right"} [mediaDesktopPlacement] - The placement of the media component on desktop view. If not specified, the media will be placed on top.
 * @param {ReactNode} [titleComponent] - The title component to be displayed.
 * @param {ReactNode} [subtitleComponent] - The subtitle component to be displayed.
 * @param {"row" | "column"} [textContentDesktopDirection] - The direction of the text content on desktop view. Defaults to "column".
 * @param {string} [seeMoreTitle] - The title for the collapsible "See More" section.
 * @param {ReactNode[]} [seeMoreItems] - The items to be displayed within the "See More" section.
 * @param {string} [className] - Additional class names to apply to the component.
 *
 * @example
 * <LongformItem
 *   mediaComponent={<img src="example.jpg" alt="Example" />}
 *   mediaDesktopPlacement="left"
 *   titleComponent={<h1>Title</h1>}
 *   subtitleComponent={<p>Subtitle</p>}
 *   textContentDesktopDirection="column"
 *   seeMoreTitle="See More"
 *   seeMoreItems={[<p>Item 1</p>, <p>Item 2</p>]}
 *   className="custom-class"
 * />
 */

import type { ReactNode } from "react";
import classNames from "classnames";

import Text from "@/components/shared/Text";
import CollapsibleContent from "@/components/shared/CollapsibleContent";

import styles from "./LongformItem.module.scss";

interface LongformItemProps {
  mediaComponent?: ReactNode;
  mediaDesktopPlacement?: "left" | "right" | "above";
  titleComponent?: ReactNode;
  subtitleComponent?: ReactNode;
  textContentDesktopDirection?: "row" | "column";
  seeMoreTitle?: string;
  seeMoreItems?: ReactNode[];
  className?: string;
  mediaClassName?: string;
  customContent?: ReactNode;
}

export const LongformSeeMoreItem = ({ children }: { children: ReactNode }) => {
  return <div className={styles.LongformSeeMoreItem}>{children}</div>;
};

const LongformItem = ({
  mediaComponent,
  mediaDesktopPlacement = "above",
  titleComponent,
  subtitleComponent,
  textContentDesktopDirection = "column",
  seeMoreTitle,
  seeMoreItems,
  className,
  mediaClassName,
  customContent,
}: LongformItemProps) => {
  return (
    <section
      className={classNames(styles.LongformItem, className)}
      data-media-desktop-placement={`${mediaDesktopPlacement}`}
    >
      {mediaComponent && (
        <div className={classNames(styles.MediaComponent, mediaClassName)}>
          {mediaComponent}
        </div>
      )}

      <div
        className={styles.TextBlock}
        data-text-content-desktop-direction={`${textContentDesktopDirection}`}
      >
        {customContent ? (
          <div>{customContent}</div>
        ) : (
          <>
            {titleComponent && (
              <Text element="h2" as="heading" className={styles.Title}>
                {titleComponent}
              </Text>
            )}

            <div className={styles.SubTextBlock}>
              {subtitleComponent && (
                <Text element="p" as="paragraph" className={styles.Subtitle}>
                  {subtitleComponent}
                </Text>
              )}

              {seeMoreTitle && seeMoreItems && (
                <div className={styles.SeeMoreWrapper}>
                  <CollapsibleContent
                    label={seeMoreTitle}
                    defaultOpen={false}
                    className={styles.CollapsibleContent}
                    triggerClassName={styles.CollapsibleTrigger}
                  >
                    <div className={styles.SeeMoreItemsWrapper}>
                      {seeMoreItems.map((item, index) => (
                        <div key={index} className={styles.SeeMoreItemWrapper}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LongformItem;
