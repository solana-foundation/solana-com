import type { ReactNode } from "react";
import { InkeepChatButton } from "@solana-com/ui-chrome";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <InkeepChatButton />
    </>
  );
}
