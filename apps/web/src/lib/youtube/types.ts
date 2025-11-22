export interface GetPlaylistOptions {
  limit?: number;
  pageToken?: string;
  part?: string[];
}

export interface YouTubePlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails?: {
    videoId: string;
    videoPublishedAt: string;
  };
}

export interface YouTubePlaylistResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubePlaylistItem[];
}

export interface YoutubePlaylistData {
  items: YouTubePlaylistItem[];
  pagination: {
    totalPages: number;
    totalCount: number;
    nextPageToken?: string;
    prevPageToken?: string;
  };
}
