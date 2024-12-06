import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Collapsible from "@radix-ui/react-collapsible";
import styles from "./CollapsibleContent.module.scss";
import CaretIcon from "@/components/icons/Caret";

interface CollapsibleContentProps {
  label: string;
  defaultOpen?: boolean;
  className?: string;
  triggerClassName?: string;
  onOpenChange?: () => void;
  previewContent?: ReactNode;
  children: ReactNode;
}

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  label,
  defaultOpen,
  className,
  triggerClassName,
  onOpenChange,
  previewContent,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen || false);

  const handleOpenChange = () => {
    setOpen(!open);
    onOpenChange && onOpenChange();
  };

  return (
    <Collapsible.Root
      className={className}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Collapsible.Trigger asChild className={triggerClassName}>
        <button className={styles.CollapsibleTrigger}>
          {open ? (
            <>
              <span className={styles.Label}>{label}</span>
              <CaretIcon color="#D0D0DC" direction="down" />
            </>
          ) : (
            <>
              <p className={styles.Label}>{label}</p>
              <CaretIcon color="#D0D0DC" direction="up" />
            </>
          )}
        </button>
      </Collapsible.Trigger>

      {previewContent ? previewContent : null}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                ease: "circOut",
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Collapsible.Root>
  );
};

export default CollapsibleContent;
