import Button from "../shared/Button";
import { useTranslation } from "next-i18next";
import VideoCard from "./VideoCard";

/**
 * List videos using VideoCard
 *
 * @param {Array} videos - Array of videos from YouTube channel
 * @returns {JSX.Element}
 * @constructor
 */
export default function FeaturedVideos({ videos }) {
  const { t } = useTranslation();

  return videos.length ? (
    <section className="featured-videos">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <h2 className="m-0">{t("community.videos.head")}</h2>
          </div>
          <div className="col-12 col-md-6 links mb-4">
            <Button to="/youtube" arrow newTab noBorder variant="secondary">
              {t("community.videos.youtube")}
            </Button>
            <Button to="/validated" arrow noBorder variant="secondary">
              {t("community.videos.podcast")}
            </Button>
          </div>
        </div>
        <div className="videos row mt-2">
          <div className="featured col-12 col-md-9 pt-8 d-none d-md-block">
            <VideoCard video={videos[0]} showThumbnail={true} />
          </div>
          {/* related videos list */}
          <div className="related col-12 col-md-3">
            <h5 className="mb-5 d-none d-md-block">
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
