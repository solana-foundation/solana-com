import Image from "next/legacy/image";
import styled from "styled-components";
import Button from "../shared/Button";
import { useTranslation } from "next-i18next";
import { Link } from "../../utils/Link";
import { getMaximalThumbnailResolutionUrl } from "../../utils/ytUtils";

const StyledVideoCard = styled.div`
  font-family: Diatype, var(--font-family-sans-serif);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);

  &:last-child {
    border-bottom: 0;
  }

  .video {
    &:hover {
      transform: scale(1.02);
      transition: transform 0.1s ease 0s;
    }
  }

  .video-card {
    &-title {
      margin-top: 1rem;
      color: white;
      font-style: normal;
      font-weight: bold;
      font-size: 1.3rem;
      line-height: 130% !important;
    }

    &-image {
      margin: 0 0 10px 0;
      width: auto;
      height: 100%;
      background: var(--color-secondary) no-repeat center center;
      background-size: cover;

      &::before,
      &::after {
        background-color: #000;
        border-radius: 12px;
      }
    }

    &-button {
      padding: 8px 20px;
      border: 1px solid #ffffff;
      box-sizing: border-box;
      border-radius: 32px;
      color: #ffffff;
      text-transform: uppercase;
      &:hover {
        text-decoration: none;
      }
    }
  }
`;

/**
 * Show video info in the card
 *
 * @param {object} video - Video data
 * @returns {JSX.Element}
 * @constructor
 */
const VideoCard = ({ video, showThumbnail }) => {
  const { t } = useTranslation();
  const thumbnailUrl = getMaximalThumbnailResolutionUrl(video);

  return (
    <StyledVideoCard className="card-container">
      <div>
        {showThumbnail && (
          <div className="ratio ratio-16x9 video">
            <Link
              to={`https://www.youtube.com/watch?v=${video.contentDetails.videoId}`}
            >
              <Image
                className="video-card-image"
                src={thumbnailUrl}
                width={1280}
                height={720}
                objectFit="cover"
              />
            </Link>
          </div>
        )}
        <p className="video-card-title">{video.snippet.title}</p>
      </div>
      <Button
        to={`https://www.youtube.com/watch?v=${video.contentDetails.videoId}`}
      >
        {t("community.videos.watch")}
      </Button>
    </StyledVideoCard>
  );
};

export default VideoCard;
