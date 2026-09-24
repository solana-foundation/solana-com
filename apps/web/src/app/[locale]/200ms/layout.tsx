import { ReactNode } from "react";
import "./slot200.css";

type Props = {
  children: ReactNode;
};

export default function Slot200Layout({ children }: Props) {
  return <div className="slot200-page">{children}</div>;
}
