import React from "react";
import { UniversityAmbassadorPage } from "./university-ambassador";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  return <UniversityAmbassadorPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "universities.title",
    descriptionKey: "universities.description",
    path: "/universities",
    locale,
  });
}
