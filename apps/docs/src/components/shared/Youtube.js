import { memo } from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";

function getYoutubeVideoId(url) {
  const match = url.match(/[=/]([\w\d_-]{10,12})/);
  if (!match) {
    throw new Error(`${url} is not a YouTube URL or regex couldn't find id`);
  }
  return match[1];
}

function getYoutubeThumbnail(id) {
  return `https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`;
}

function getYoutubeEmbedUrl(id, { autoplay }) {
  return `https://www.youtube-nocookie.com/embed/${id}?controls=1&amp;autoplay=${autoplay}&amp;mute=1&amp;autohide=1&amp;modestbranding=1&amp;iv_load_policy=3&amp;rel=0`;
}

const StyledSpinnerWrapper = styled.div`
  position: absolute;

  > div.spinner-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const YoutubeIFrame = memo(function ({
  url,
  loaded,
  autoplay = false,
  enabled = true,
  onLoad,
}) {
  const id = getYoutubeVideoId(url);
  const thumbUrl = getYoutubeThumbnail(id);
  const embedYoutubeUrl = getYoutubeEmbedUrl(id, {
    autoplay,
  });

  return (
    <>
      <link rel="preload" href={thumbUrl} as="image" />
      <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://static.doubleclick.net" />
      <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
      {!loaded && (
        <>
          <img src={thumbUrl} alt="" />
          <StyledSpinnerWrapper>
            <div className="spinner-wrapper">
              <Spinner animation="border" role="status" variant="secondary" />
            </div>
          </StyledSpinnerWrapper>
        </>
      )}
      {enabled && (
        <iframe
          src={embedYoutubeUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Youtube video"
          className="youtube-embed"
          style={{ visibility: loaded ? "visible" : "hidden" }}
          onLoad={onLoad}
        ></iframe>
      )}
    </>
  );
});
