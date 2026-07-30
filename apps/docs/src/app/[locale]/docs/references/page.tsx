import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(props: Props) {
  const { locale } = await props.params;
  redirect(
    locale === "en"
      ? "/docs/references/clusters"
      : `/${locale}/docs/references/clusters`,
  );
}
