import { cookbookSource } from "@/app/sources/cookbook";
import { CookbookPage, getMetadataFromSlug } from "../cookbook";
import { toStaticParams } from "@/app/sources/utils";

type Props = {
  params: Promise<{ slug?: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slug, locale } = await props.params;
  return <CookbookPage slug={slug} locale={locale} />;
}

export async function generateStaticParams() {
  return toStaticParams(cookbookSource).filter(
    (param) => param.slug.length > 0,
  );
}

export async function generateMetadata(props: Props) {
  const { slug, locale } = await props.params;
  return getMetadataFromSlug(slug, locale);
}
