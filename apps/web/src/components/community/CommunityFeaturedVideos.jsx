import Button from "../shared/Button";
import { useTranslations } from "next-intl";
import VideoCard from "./VideoCard";

/**
 * List videos using VideoCard
 *
 * @param {Array} videos - Array of videos from YouTube channel
 * @returns {JSX.Element}
 * @constructor
 */
export default function FeaturedVideos({ videos }) {
  const t = useTranslations();

  return videos.length ? (
    <section className="mt-36 pb-16">
      <div className="container">
        <div className="grid grid-cols-12 gap-5 md:gap-10">
          <div className="col-span-12 md:col-span-6 mb-4">
            <h2 className="m-0">{t("community.videos.head")}</h2>
          </div>
          <div className="col-span-12 md:col-span-6 mb-4 flex gap-x-3 items-center justify-start md:justify-end">
            <Button to="/youtube" arrow newTab noBorder variant="secondary">
              {t("community.videos.youtube")}
            </Button>
            <Button to="/validated" arrow noBorder variant="secondary">
              {t("community.videos.podcast")}
            </Button>
          </div>
        </div>
        <div className="videos grid grid-cols-12 gap-5 md:gap-10 mt-2">
          <div className="col-span-12 md:col-span-9 pt-8 hidden md:block">
            <VideoCard video={videos[0]} showThumbnail={true} isFeatured />
          </div>
          {/* related videos list */}
          <div className="col-span-12 md:col-span-3">
            <h5 className="mb-6 hidden md:block uppercase text-[#9945ff]">
              {t("community.videos.related")}
            </h5>
            {videos.slice(1, 4).map((video, i) => (
              <VideoCard
                key={`${i}_${video.id}`}
                video={video}
                showThumbnail={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
}
