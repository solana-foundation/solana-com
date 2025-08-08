import { useTranslations } from "next-intl";
import { Video } from "@/component-library/video";

export const SingleVideo = () => {
  const t = useTranslations();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Video
        platform="youtube"
        id="PdVUa8TR2nk"
        thumbnail="/src/img/solutions/btcfi/video1.webp"
        title={t("btcfi.videoPlayer.videos.0.title")}
        alt={t("btcfi.videoPlayer.videos.0.alt")}
        privacyMode={true}
        autoplay={false}
        aspectRatio="16:9"
        bgColorClass="!bg-purple-600/90"
      />
      <h3 className="text-xl md:text-3xl font-bold text-white mt-4">
        {t("btcfi.videoPlayer.videos.0.title")}
      </h3>
    </div>
  );
};
