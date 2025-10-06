import { ReactNode } from "react";
import { Button } from "@workspace/ui/components/button";

export function Header({ children }: { children?: ReactNode }) {
  return (
    <div>
      <Button>FOO BAR BUTTON IN HEADER</Button>
      {children}
    </div>
  );
}
