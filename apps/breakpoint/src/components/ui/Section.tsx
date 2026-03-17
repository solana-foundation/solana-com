import type { HTMLAttributes } from "react";
import { Container } from "@/components/ui/Container";

export function Section({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`py-xl md:py-3xl ${className}`.trim()} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
