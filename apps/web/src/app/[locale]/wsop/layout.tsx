import type { ReactNode } from "react";
import "./wsop.css";

export default function WsopLayout({ children }: { children: ReactNode }) {
  return <div className="wsop-page">{children}</div>;
}
