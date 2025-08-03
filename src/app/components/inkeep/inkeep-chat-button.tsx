"use client";

import dynamic from "next/dynamic";
import { useInkeepConfig } from "./useInkeepConfig";

const ChatButton = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepChatButton),
  { ssr: false },
);

export function InkeepChatButton() {
  const inkeepConfig = useInkeepConfig();

  return <ChatButton {...inkeepConfig} />;
}
