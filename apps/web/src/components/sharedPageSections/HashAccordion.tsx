import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@workspace/ui";
import slugify from "@sindresorhus/slugify";

const HashAccordionItem = ({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) => {
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

export default function HashAccordion({
  prefix,
  children,
}: {
  prefix?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    const hash =
      typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    const asPath = hash ? `${pathname}#${hash}` : pathname;
    const key = getItemKey(prefix, asPath);

    if (!key) {
      return;
    }

    const keyWithoutPrefix = key.replace(`${prefix}/`, "");
    const element = document.querySelector(`[data-id="${keyWithoutPrefix}"]`);

    if (element) {
      setActiveKey(keyWithoutPrefix);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname, prefix]);

  const handleSelect = (eventKey: string) => {
    setActiveKey(eventKey);
    router.push(eventKey ? `#${eventKey}` : pathname, {
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
function getItemKey(prefix: string | undefined, asPath: string): string | null {
  const [, itemKey] = asPath.split("#");
  if (!itemKey) {
    return null;
  }
  if (
    itemKey.includes("/") &&
    prefix !== undefined &&
    !itemKey.startsWith(prefix)
  ) {
    return null;
  }
  return itemKey;
}

// Export HashAccordionItem if needed
export { HashAccordionItem };
