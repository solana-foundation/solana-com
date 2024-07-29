import { useState } from "react";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import ReactPlayer from "react-player/lazy";
import VideosSectionSingleCourse from "./VideosSectionSingleCourse";
import CarouselCards from "../shared/CarouselCards";
import { getMaximalThumbnailResolutionUrl } from "../../utils/ytUtils";

const imageProps = {
  layout: "fill",
  alt: "",
  objectFit: "cover",
};

const data = {
  videos: [
    {
      title: "Solana Core Concepts",
      url: "https://www.youtube.com/watch?v=4dNuMXBjpr0&list=PLilwLeBwGuK4teLcqyXavweEbveCjjRk0",
      id: "0",
    },
    {
      title: "Solana Tutorial | Solana for Developers",
      url: "https://www.youtube.com/watch?v=qNIhClYDjR8",
      id: "1",
    },
    {
      title: "Programming Solana (playlist)",
      url: "https://www.youtube.com/playlist?list=PL41Cw3fN3CfdbmhgxADwyDyIoDrxc22v2",
      id: "2",
    },
    {
      title: "Programming Solana Smart Contracts",
      url: "https://www.youtube.com/watch?v=i6Ycr5nhjH8",
      id: "3",
    },
    {
      title: "Figment Learn Pathway",
      url: "https://www.youtube.com/playlist?list=PLkgTdjgP1aUAiqqbvVi3b0sSdxByd5KSX",
      id: "4",
    },
    {
      title: "Programming Solana Smart Contracts | Hello World Anchor Tutorial",
      url: "https://www.youtube.com/watch?v=oD1umX_DnUw",
      id: "5",
    },
    {
      title: "Let’s Get Rusty - Rust Lang Book (playlist)",
      url: "https://www.youtube.com/playlist?list=PLai5B987bZ9CoVR-QEIN9foz4QCJ0H2Y8",
      id: "6",
    },
  ],
};

const VIDEO_PREVIEW_IMAGES = {
  0: (
    <Image
      src="https://i.ytimg.com/vi/4dNuMXBjpr0/hqdefault.jpg"
      {...imageProps}
    />
  ),
  1: (
    <Image
      src="https://i.ytimg.com/vi/qNIhClYDjR8/hqdefault.jpg"
      {...imageProps}
    />
  ),
  2: (
    <Image
      src="https://img.youtube.com/vi/gA7hFdq2h9Q/hqdefault.jpg"
      {...imageProps}
    />
  ),
  3: (
    <Image
      src="https://i.ytimg.com/vi/i6Ycr5nhjH8/hqdefault.jpg"
      {...imageProps}
    />
  ),
  4: (
    <Image
      src="https://img.youtube.com/vi/ndYmwoem6tI/hqdefault.jpg"
      {...imageProps}
    />
  ),
  5: (
    <Image
      src="https://i.ytimg.com/vi/oD1umX_DnUw/hqdefault.jpg"
      {...imageProps}
    />
  ),
  6: (
    <Image
      src="https://img.youtube.com/vi/OX9HJsJUDxA/hqdefault.jpg"
      {...imageProps}
    />
  ),
};

const processVideos = (youtubeVideos) => {
  return youtubeVideos.map((video, index) => {
    const thumbnailUrl = getMaximalThumbnailResolutionUrl(video);
    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`,
      id: index,
      image: <Image src={thumbnailUrl} {...imageProps} />,
    };
  });
};

/**
 * Displays a shared video section.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const VideosSection = ({ videos, jsonData = data }) => {
  const opts = {
    youtube: {
      playerVars: { autoplay: 1 },
    },
  };
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentSource, setCurrentSource] = useState("");

  const handleClickVideoSource = (e, source) => {
    e.preventDefault();

    setShowVideoModal(true);
    let normalizedSource = source;
    if (source) {
      const params = source.split("v=");
      if (params[1]) {
        const videoIds = params[1].split("&");
        normalizedSource = params[0] + "v=" + videoIds[0];
      }
    }
    setCurrentSource(normalizedSource);
  };

  const youtubeVideos = videos ? processVideos(videos) : jsonData.videos;

  return (
    <section>
      <CarouselCards>
        {youtubeVideos.map(({ title, url, id, image }, index) => (
          <div key={index}>
            <VideosSectionSingleCourse
              image={image || VIDEO_PREVIEW_IMAGES[id]}
              title={title}
              url={url}
              onClick={handleClickVideoSource}
            />
          </div>
        ))}
      </CarouselCards>
      <Modal
        show={showVideoModal}
        centered
        size="xl"
        onHide={() => setShowVideoModal(false)}
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-black"
          style={{ borderBottom: 0 }}
        />
        <Modal.Body className="d-flex pt-0 justify-content-center bg-black">
          <div
            style={{
              padding: "56.25% 0 0 0",
              position: "relative",
              width: "100%",
            }}
          >
            <ReactPlayer
              className="youtube-player"
              url={currentSource}
              config={opts}
              controls
            />
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default VideosSection;
