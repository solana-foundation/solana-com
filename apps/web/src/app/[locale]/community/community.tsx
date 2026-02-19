"use client";

import FeaturedVideos from "@/components/community/CommunityFeaturedVideos";
import CommunityHero from "@/components/community/CommunityHero";
import CommunityLinks from "@/components/community/CommunityLinks";
import CommunitySocial from "@/components/community/CommunitySocial";
import CommunityNews from "@/components/community/CommunityNews";
import CommunityCollective from "@/components/community/CommunityCollective";

interface CommunityPageProps {
  posts: any[];
  socialData: {
    youtube: any;
    github: any;
    meetup: any;
  };
  youtubeVideos: any;
}

export function CommunityPage({
  posts,
  socialData,
  youtubeVideos,
}: CommunityPageProps) {
  return (
    <div className="community-page mt-n10">
      <CommunityHero />
      <CommunityLinks />
      <CommunitySocial data={socialData} />
      <CommunityCollective />
      <FeaturedVideos videos={youtubeVideos} />
      <CommunityNews posts={posts} />
    </div>
  );
}
