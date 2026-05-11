import type { Metadata } from "next";
import RegistrationPage from "@/components/pages/registration/RegistrationPage";
import { getPageMetadata } from "@/app/metadata";

const pageMetadata = {
  path: "/registration",
  title: "Registration",
  description:
    "Reserve Breakpoint 2026 tickets for general admission, developers, and students.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, pageMetadata);
}

export default function LocaleRegistrationPage() {
  return <RegistrationPage />;
}
