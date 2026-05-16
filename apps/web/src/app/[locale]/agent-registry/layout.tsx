import { ReactNode } from "react";
import "./agent-registry.css";

type Props = {
  children: ReactNode;
};

export default function AgentRegistryLayout({ children }: Props) {
  return <>{children}</>;
}
