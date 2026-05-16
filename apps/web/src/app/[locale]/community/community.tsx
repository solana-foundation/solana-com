"use client";

import FeaturedVideos from "@/components/community/CommunityFeaturedVideos";
import CommunityHero from "@/components/community/CommunityHero";
import CommunityLinks from "@/components/community/CommunityLinks";
import CommunitySocial from "@/components/community/CommunitySocial";
import CommunityNews from "@/components/community/CommunityNews";
import CommunityCollective from "@/components/community/CommunityCollective";
import type { PostItem } from "@/types/media";
import type { YTVideoItem } from "@/utils/followerFunctions";

interface CommunityPageProps {
  posts: PostItem[];
  socialData: {
    youtube?: number;
    github?: number;
    meetup?: number;
  };
  youtubeVideos: YTVideoItem[] | undefined;
}

export function CommunityPage({
  posts,
  socialData,
  youtubeVideos,
}: CommunityPageProps) {
  return (
    <div className="-mt-20">
      <CommunityHero />
      <CommunityLinks />
      <CommunitySocial data={socialData} />
      <CommunityCollective />
      <FeaturedVideos videos={youtubeVideos || []} />
      <CommunityNews posts={posts || []} />
    </div>
  );
}
