import { ReactNode } from "react";
import "./privacy.css";

type Props = {
  children: ReactNode;
};

export default function PrivacyLayout({ children }: Props) {
  return <>{children}</>;
}
