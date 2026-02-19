import { getIndexMetadata } from "@/app/metadata";
import EnvironmentHero from "@/components/environment/EnvironmentHero";
import EnvironmentReport from "@/components/environment/EnvironmentReport";
import EnvironmentFeaturedProjects from "@/components/environment/EnvironmentFeaturedProjects";
import EnvironmentWhatYouCanDo from "@/components/environment/EnvironmentWhatYouCanDo";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  return (
    <>
      <EnvironmentHero />
      <EnvironmentReport />
      <EnvironmentFeaturedProjects />
      <EnvironmentWhatYouCanDo />
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "environment.title",
    descriptionKey: "environment.description",
    path: "/environment",
    locale,
  });
}
