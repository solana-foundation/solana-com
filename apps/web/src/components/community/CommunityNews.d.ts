interface Post {
  id: string;
  title?: string;
  url?: string;
  heroImage?: string;
}

interface CommunityNewsProps {
  posts: Post[];
}

declare const CommunityNews: (_props: CommunityNewsProps) => JSX.Element;
export default CommunityNews;
