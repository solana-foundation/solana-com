import type { Metadata } from "next";
import RegistrationPage from "@/components/pages/registration/RegistrationPage";

export const metadata: Metadata = {
  title: "Registration | Breakpoint 2026",
  description:
    "Reserve Breakpoint 2026 tickets for general admission, developers, and students.",
};

export default function LocaleRegistrationPage() {
  return <RegistrationPage />;
}
