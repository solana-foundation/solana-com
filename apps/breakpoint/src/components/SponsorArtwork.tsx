import { publicAssetPath } from "@/config";
import type { ResolvedSponsorLogo } from "@/lib/sponsors";

export default function SponsorArtwork({
  sponsor,
  loading,
}: {
  sponsor: ResolvedSponsorLogo;
  loading?: "eager" | "lazy";
}) {
  return (
    <img
      src={publicAssetPath(sponsor.src)}
      alt=""
      aria-hidden="true"
      loading={loading}
      className="block h-full w-full object-contain brightness-0 invert"
    />
  );
}
