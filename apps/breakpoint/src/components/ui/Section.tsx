import type { HTMLAttributes } from "react";
import { Container } from "@/components/ui/Container";

export function Section({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`py-14 md:py-20 ${className}`.trim()} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
