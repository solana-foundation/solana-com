interface CommunitySocialData {
  telegram?: number;
  twitter?: number;
  github?: number;
  discord?: number;
  meetup?: number;
  weibo?: number;
  youtube?: number;
  news?: number;
  reddit?: number;
}

interface CommunitySocialProps {
  data: CommunitySocialData;
}

declare const CommunitySocial: (_props: CommunitySocialProps) => JSX.Element;
export default CommunitySocial;
