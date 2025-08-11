import PodcastApi from "../../../lib/podcast";

export default async function getEpisodes(req, res) {
  const { page = 0, query, sort } = req.query;

  const { episodes, hasMore } = await PodcastApi.getEpisodes({
    query,
    offset: page * 15,
    sort,
  });

  return res.status(200).json({ episodes, hasMore });
}
