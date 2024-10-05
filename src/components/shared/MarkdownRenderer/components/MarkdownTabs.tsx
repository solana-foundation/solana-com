import React, {
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import styles from "./MarkdownTabs.module.scss";

interface MarkdownTabsProps {
  children: ReactNode;
  items?: string[] | string;
  defaultIndex?: number;
  groupId?: string;
  persist?: boolean;
}

type ChangeListener = (_v: string) => void;
const listeners = new Map<string, ChangeListener[]>();

export function MarkdownTabs({
  children,
  items = [],
  defaultIndex = 0,
  groupId,
  persist = false,
  ...props
}: MarkdownTabsProps) {
  const labels: string[] = useMemo(() => {
    if (typeof items == "string")
      return items.split(",").map((item) => item.trim());
    else return items;
  }, [items]);
  const values = useMemo(() => labels.map((item) => toValue(item)), [labels]);
  const [value, setValue] = useState(values[defaultIndex]);

  useLayoutEffect(() => {
    if (!groupId) return;

    const onUpdate: ChangeListener = (v) => {
      if (values.includes(v)) setValue(v);
    };

    const previous = persist
      ? localStorage.getItem(groupId)
      : sessionStorage.getItem(groupId);

    if (previous) onUpdate(previous);
    addChangeListener(groupId, onUpdate);
    return () => {
      removeChangeListener(groupId, onUpdate);
    };
  }, [groupId, persist, values]);

  const onValueChange = useCallback(
    (v: string) => {
      if (groupId) {
        update(groupId, v, persist);
      } else {
        setValue(v);
      }
    },
    [groupId, persist],
  );

  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      {...props}
      className={styles["markdown-tabs"]}
    >
      <TabsPrimitive.List className={styles["markdown-tabs-list"]}>
        {values.map((v, i) => (
          <TabsPrimitive.Trigger
            key={v}
            value={v}
            className={`${styles["markdown-tabs-trigger"]} ${
              v === value ? styles["active"] : ""
            }`}
          >
            {labels[i]}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {children}
    </TabsPrimitive.Root>
  );
}

export function MarkdownTab({
  value,
  ...props
}: TabsPrimitive.TabsContentProps) {
  return (
    <TabsPrimitive.Content
      value={toValue(value)}
      {...props}
      className={styles["markdown-tabs-content"]}
    />
  );
}

function addChangeListener(groupId: string, listener: ChangeListener): void {
  const list = listeners.get(groupId) ?? [];
  list.push(listener);
  listeners.set(groupId, list);
}

function removeChangeListener(groupId: string, listener: ChangeListener): void {
  const list = listeners.get(groupId) ?? [];
  listeners.set(
    groupId,
    list.filter((item) => item !== listener),
  );
}

function update(groupId: string, v: string, persist: boolean): void {
  listeners.get(groupId)?.forEach((item) => item(v));
  if (persist) localStorage.setItem(groupId, v);
  else sessionStorage.setItem(groupId, v);
}

function toValue(v: string): string {
  return v.toLowerCase().replace(/\s/, "-");
}
