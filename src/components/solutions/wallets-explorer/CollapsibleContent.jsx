import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import classNames from "classnames";

import CaretIcon from "@/components/icons/Caret";

import styles from "./CollapsibleContent.module.scss";

const CollapsibleContent = ({
  label,
  defaultOpen,
  children,
  icon,
  classes,
}) => {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <Collapsible.Root
      className={classNames(styles.CollapsibleRoot, classes)}
      open={open}
      onOpenChange={setOpen}
    >
      {label && (
        <Collapsible.Trigger asChild>
          <button className={styles.CollapsibleTrigger}>
            <>
              <p className={styles.Label}>
                {icon && <span className={styles.Icon}>{icon}</span>}
                <span>{label}</span>
              </p>
              <CaretIcon direction={open ? "down" : "up"} />
            </>
          </button>
        </Collapsible.Trigger>
      )}

      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleContent;
