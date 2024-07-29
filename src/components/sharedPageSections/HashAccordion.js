import { useRouter } from "next/router";
import {
  Children,
  cloneElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Accordion } from "react-bootstrap";
import styled from "styled-components";

const StyledAccordion = styled.section`
  .accordion-button {
    background-color: #fff;
  }
`;

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

/**
 * Accordion.Item wrapper that uses an identifier and prefix to work with HashAccordion
 *
 * @param {String}  id        Accordion item identifier
 * @param {String}  prefix    Prefix matching HashAccordion (provided by parent HashAccordion)
 * @param {Array}   children  The accordion item content
 * @returns {JSX.Element}
 * @constructor
 */
const HashAccordionItem = memo(function HashAccordionItem({
  id,
  prefix,
  children,
  ...props
}) {
  const accordionKey = prefix ? `${prefix}/${id}` : id;

  return (
    <Accordion.Item data-id={id} eventKey={accordionKey} {...props}>
      {children}
    </Accordion.Item>
  );
});

/**
 * Extended Accordion that works with URL hash (#) fragment to scroll to
 * accordion item (child) and expand it.
 *
 * @param {String}  prefix    An optional prefix used to identify a particular HashAccordion and its children
 * @param {Array}   children  The accordion items
 * @returns {JSX.Element}
 * @constructor
 */
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
        element.scrollIntoView();
      }
    }
    // exclude router.asPath as we only want to scroll on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, prefix]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const key = getItemKey(prefix, router.asPath);

    if (key) {
      setActiveKey(key);
    }
  }, [router.isReady, router.asPath, prefix]);

  const onSelect = useCallback(
    (eventKey) => {
      setActiveKey(eventKey);

      if (eventKey) {
        router.push(`#${eventKey}`, undefined, {
          scroll: false,
          shallow: true,
        });
      } else {
        router.push(router.asPath.split("#")[0], undefined, {
          scroll: false,
          shallow: true,
        });
      }
    },
    [router],
  );

  const childrenWithPrefix = useMemo(() => {
    return Children.map(children, (child) => cloneElement(child, { prefix }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledAccordion>
      <Accordion activeKey={activeKey} onSelect={onSelect}>
        {childrenWithPrefix}
      </Accordion>
    </StyledAccordion>
  );
}

export { HashAccordionItem };
