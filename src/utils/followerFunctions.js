import cheerio from "cheerio";
import fetch from "node-fetch-cache";

const scrapeUrlForTag = async (url, tagName) => {
  const siteData = await fetch(url)
    .then((res) => res.text())
    .catch((err) => {
      console.log(err);
    });

  if (siteData) {
    const $ = cheerio.load(siteData, null, false);
    const result = $(tagName);
    return result;
  }
  return "";
};

const scrapeMeetupMemberCount = async () => {
  const meetupMemberCountTag = await scrapeUrlForTag(
    `https://www.meetup.com/topics/solana/`,
    `div.font-medium`,
  );
  if (meetupMemberCountTag.length) {
    const meetupCountString = meetupMemberCountTag[0].children[0].data;
    return parseInt(meetupCountString.replace(",", ""), 10);
  }
  return 0;
};

const scrapeYoutubeSubscriberCount = async () => {
  const youtubeSubscriberCountScripts = await scrapeUrlForTag(
    `https://www.youtube.com/c/SolanaFndn`,
    `script`,
  );

  if (youtubeSubscriberCountScripts.length) {
    let ytContent;
    for (let i = 0; i <= youtubeSubscriberCountScripts.length; i++) {
      if (
        youtubeSubscriberCountScripts[i] &&
        youtubeSubscriberCountScripts[i].hasOwnProperty("children") &&
        youtubeSubscriberCountScripts[i].children.length &&
        youtubeSubscriberCountScripts[i].children[0].data.includes(
          "subscriberCountText",
        )
      ) {
        ytContent = youtubeSubscriberCountScripts[i]?.children[0]?.data;
        break;
      }
    }
    if (ytContent) {
      const ytContentObject = JSON.parse(
        ytContent.replace("var ytInitialData = ", "").replace("};", "}"),
      );
      const youtubeSubscriberKCountText =
        ytContentObject?.header?.c4TabbedHeaderRenderer?.subscriberCountText
          ?.simpleText;
      const youtubeSubscriberCount = youtubeSubscriberKCountText
        ? parseFloat(youtubeSubscriberKCountText, 10)
        : 0;
      return youtubeSubscriberCount;
    }
  }
  return 0;
};

const scrapeVKontakteFollowerCount = async () => {
  const followerCountTag = await scrapeUrlForTag(
    `https://vk.com/solanarus`,
    `em.pm_counter`,
  );
  if (followerCountTag.length) {
    const vkCountString = followerCountTag[1].children[0].data;
    return parseInt(vkCountString.replace(",", "").replace(".", ""), 10);
  }
  return 0;
};

// const scrapeWeiboFanCount = async () => {
//   const fanCountLink = await scrapeUrlForTag(
//     `https://weibo.com/SolanaNews`,
//     `a[href*='current=fans']`
//   );
// };

const getStableCoins = async () => {
  const url = "https://api.circle.com/v1/stablecoins";
  const options = { method: "GET", headers: { Accept: "application/json" } };

  try {
    const jsonData = await fetch(url, options);
    const stableCoins = await jsonData.json();
    const chainData = stableCoins.data[0].chains;
    let solAmount = 0;
    for (let chain of chainData) {
      if (chain.chain === "SOL") {
        solAmount = chain.amount;
        break;
      }
    }
    return solAmount;
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
};

const getGHStargazers = async () => {
  const res = await fetch("https://api.github.com/repos/solana-labs/solana", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const jsonData = await res.json();
  return jsonData?.stargazers_count || 0;
};

const getYTVideos = async (
  maxVideos = 50,
  playlistId,
  channelId = process.env.YOUTUBE_CHANNEL_ID,
) => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY is not set. Returning dummy data.");
    return [
      {
        snippet: {
          title: "Solana Changelog",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin iaculis libero et quam egestas, et molestie neque dignissim.",
          playlistId: "PLilwLeBwGuK5-Qri7Pg9zd-Vvhz9kX2-R",
          resourceId: {
            videoId: "UQy6nDI1RlU",
          },
        },
        contentDetails: {
          videoId: "UQy6nDI1RlU",
        },
      },
    ];
  }

  let pageSize = Math.min(50, maxVideos);
  let videos = [];
  let videoResp;

  const baseURL = "https://www.googleapis.com/youtube/v3/";

  // Playlist videos
  if (playlistId) {
    videoResp = await fetch(
      `${baseURL}playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=${pageSize}&playlistId=${playlistId}&key=${apiKey}`,
    );
    // Channel videos
  } else {
    const channelResp = await fetch(
      `${baseURL}channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
    );

    const channelData = await channelResp.json();

    if (!!channelData) {
      const uploadsId =
        channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      videoResp = await fetch(
        `${baseURL}playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=${pageSize}&playlistId=${uploadsId}&key=${apiKey}`,
      );
    }
  }

  if (videoResp?.fromCache) {
    console.log(`Got YouTube videos from Cache.`);
  } else {
    console.log(`Fetched YouTube videos from API.`);
  }

  const videosData = await videoResp.json();

  if (!videosData.error) {
    // No thumbnails usually means the video has been deleted from a list
    videos.push(
      ...(videosData?.items?.filter(
        (item) => Object.keys(item.snippet.thumbnails).length,
      ) || []),
    );
  } else {
    console.error(videosData.error.message);
  }

  return videos;
};

export {
  scrapeUrlForTag,
  scrapeMeetupMemberCount,
  scrapeYoutubeSubscriberCount,
  scrapeVKontakteFollowerCount,
  // scrapeWeiboFanCount,
  getStableCoins,
  getGHStargazers,
  getYTVideos,
};
