import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import slugify from "@sindresorhus/slugify";
import styles from "./HashAccordion.module.scss";

const HashAccordionItem = ({ question, answer }) => {
  const id = slugify(question);
  return (
    <Accordion.Item
      data-id={id}
      eventKey={id}
      className={styles["accordion-item"]}
    >
      <Accordion.Header>{question}</Accordion.Header>
      <Accordion.Body>{answer}</Accordion.Body>
    </Accordion.Item>
  );
};

export default function HashAccordion({ prefix, children }) {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const key = getItemKey(prefix, router.asPath);

      if (!key) {
        return;
      }

      const keyWithoutPrefix = key.replace(`${prefix}/`, "");
      const element = document.querySelector(`[data-id="${keyWithoutPrefix}"]`);

      if (element) {
        setActiveKey(keyWithoutPrefix);
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [router.isReady, prefix, router.asPath]);

  const handleSelect = (eventKey) => {
    setActiveKey(eventKey);
    router.push(
      eventKey ? `#${eventKey}` : router.asPath.split("#")[0],
      undefined,
      {
        scroll: false,
        shallow: true,
      },
    );
  };

  return (
    <Accordion
      activeKey={activeKey}
      onSelect={handleSelect}
      className={styles["accordion"]}
    >
      {children}
    </Accordion>
  );
}

// Helper function to get the item key from the URL
function getItemKey(prefix, asPath) {
  const [, itemKey] = asPath.split("#");
  if (!itemKey) {
    return null;
  }
  if (itemKey.includes("/") && !itemKey.startsWith(prefix)) {
    return null;
  }
  return itemKey;
}

// Export HashAccordionItem if needed
export { HashAccordionItem };
