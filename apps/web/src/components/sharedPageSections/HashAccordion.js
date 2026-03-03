import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@workspace/ui";
import slugify from "@sindresorhus/slugify";

const HashAccordionItem = ({ question, answer }) => {
  const id = slugify(question);
  return (
    <AccordionItem
      data-id={id}
      value={id}
      className={`[&>h3]:mb-0 border-b border-white/20 md:py-4`}
    >
      <AccordionTrigger
        className={`text-xl [&>svg]:self-center [&>svg]:size-6 [&[data-state="open"]>svg]:rotate-180 mb-0 px-5`}
      >
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-xl px-5">{answer}</AccordionContent>
    </AccordionItem>
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
    router.push(eventKey ? `#${eventKey}` : router.asPath.split("#")[0], {
      scroll: false,
    });
  };

  return (
    <Accordion
      type="single"
      value={activeKey}
      onValueChange={handleSelect}
      collapsible
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
