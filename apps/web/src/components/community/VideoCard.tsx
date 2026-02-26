import Image from "next/legacy/image";
import Button from "../shared/Button";
import { useTranslations } from "next-intl";
import { Link } from "../../utils/Link";
import { getMaximalThumbnailResolutionUrl } from "../../utils/ytUtils";

type Video = {
  contentDetails: { videoId: string };
  snippet: { title: string };
};

/**
 * Show video info in the card
 *
 * @param {object} video - Video data
 * @param {boolean} isFeatured - Whether this is the featured (large) video card
 */
const VideoCard = ({
  video,
  showThumbnail,
  isFeatured,
}: {
  video: Video;
  showThumbnail?: boolean;
  isFeatured?: boolean;
}) => {
  const t = useTranslations();
  const thumbnailUrl = getMaximalThumbnailResolutionUrl(video);

  return (
    <div className="font-brand mb-8 pb-4 border-b border-[rgba(255,255,255,0.3)] last:border-b-0 max-md:!border-none card-container">
      <div>
        {showThumbnail && (
          <div className="aspect-video hover:scale-[1.02] hover:transition-transform hover:duration-100 hover:ease-[ease]">
            <Link
              to={`https://www.youtube.com/watch?v=${video.contentDetails.videoId}`}
            >
              <Image
                className="video-card-image m-0 w-auto h-full bg-[var(--color-secondary)] bg-no-repeat bg-center bg-cover [&::before]:bg-black [&::before]:rounded-xl [&::after]:bg-black [&::after]:rounded-xl"
                src={thumbnailUrl}
                width={1280}
                height={720}
                objectFit="cover"
              />
            </Link>
          </div>
        )}
        <p
          className={
            isFeatured
              ? "mt-4 text-white font-bold text-[2.625rem] leading-[110%] tracking-[-1px] mb-4"
              : "mt-4 text-white font-bold text-[1.3rem] leading-[130%] mb-4"
          }
        >
          {video.snippet.title}
        </p>
      </div>
      <Button
        to={`https://www.youtube.com/watch?v=${video.contentDetails.videoId}`}
      >
        {t("community.videos.watch")}
      </Button>
    </div>
  );
};

export default VideoCard;
