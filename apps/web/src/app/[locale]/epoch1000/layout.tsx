import { ReactNode } from "react";
import "./epoch1000.css";

type Props = {
  children: ReactNode;
};

export default function Epoch1000Layout({ children }: Props) {
  return <div className="epoch1000-page">{children}</div>;
}
