interface Video {
  id: string;
  snippet: {
    title: string;
    thumbnails?: Record<
      string,
      { url: string; width?: number; height?: number }
    >;
  };
  contentDetails: {
    videoId: string;
  };
}

interface FeaturedVideosProps {
  videos: Video[];
}

declare const FeaturedVideos: (_props: FeaturedVideosProps) => JSX.Element;
export default FeaturedVideos;
