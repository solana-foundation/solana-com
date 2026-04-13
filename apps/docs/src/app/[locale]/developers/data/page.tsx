import { getIndexMetadata } from "@@/src/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export default async function DataDashboard(props: Props) {
  return (
    <div className="w-full min-h-screen bg-white">
      <iframe
        src="https://dbc-8f4a920c-45cb.cloud.databricks.com/embed/dashboardsv3/01f1285fea66194a94ee20d29dac25de?o=1125560347127367"
        width="100%"
        height="1200"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "developers.data.title",
    descriptionKey: "developers.data.description",
    path: "/developers/data",
    locale,
  });
}
