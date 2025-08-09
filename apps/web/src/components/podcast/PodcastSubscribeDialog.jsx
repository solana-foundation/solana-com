import classNames from "classnames";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { InlineLink } from "../shared/Link";
import SharedModal from "../shared/SharedModal";

import AmazonMusicLogo from "../../../assets/podcast/amazon-music-logo.inline.svg";
import ApplePodcastsLogo from "../../../assets/podcast/apple-podcasts-logo.inline.svg";
import GooglePodcastsLogo from "../../../assets/podcast/google-podcasts-logo.inline.svg";
import PocketcastLogo from "../../../assets/podcast/pocketcast-logo.inline.svg";
import SpotifyLogo from "../../../assets/podcast/spotify-logo.inline.svg";
import RssFeedIcon from "../../../assets/podcast/rss-feed.inline.svg";

import styles from "./PodcastSubscribeDialog.module.scss";

function PodcastSubscribeDialog(_, ref) {
  const [show, setShow] = useState(false);

  const open = useCallback(() => setShow(true), []);
  const close = useCallback(() => setShow(false), []);

  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [open, close],
  );

  return (
    <SharedModal
      show={show}
      titleId="podcast.listen-options-modal.title"
      handleClose={close}
      showCloseButton={false}
    >
      <div
        className={classNames(
          "container d-flex flex-wrap",
          styles["podcast-listen-options-modal-content"],
        )}
      >
        <div className="col-12 col-sm-6">
          <InlineLink to="https://podcasts.apple.com/us/podcast/the-solana-podcast/id1476353378">
            <ApplePodcastsLogo width={36} height={36} />
            Apple Podcasts
          </InlineLink>
        </div>
        <div className="col-12 col-sm-6">
          <InlineLink to="https://open.spotify.com/show/5m24z58eqLGgxMLHHxNCwV?si=1tbCxC4DRW6QtLpD9RfTew&dl_branch=1">
            <SpotifyLogo width={36} height={36} />
            Spotify
          </InlineLink>
        </div>
        <div className="col-12 col-sm-6">
          <InlineLink to="https://podcasts.google.com/feed/aHR0cHM6Ly9mZWVkcy5zaW1wbGVjYXN0LmNvbS9XMU5JMnYzWg==">
            <GooglePodcastsLogo width={36} height={36} />
            Google Podcasts
          </InlineLink>
        </div>
        <div className="col-12 col-sm-6">
          <InlineLink to="https://music.amazon.com/podcasts/15029d3a-655f-43a4-9a38-b91129e153cc/the-solana-podcast">
            <AmazonMusicLogo width={36} height={36} />
            Amazon Music
          </InlineLink>
        </div>
        <div className="col-12 col-sm-6">
          <InlineLink to="https://pca.st/js84742w">
            <PocketcastLogo width={36} height={36} />
            Pocketcast
          </InlineLink>
        </div>
        <div className="col-12 col-sm-6">
          <InlineLink to="https://feeds.simplecast.com/W1NI2v3Z">
            <RssFeedIcon width={36} height={36} />
            RSS Feed
          </InlineLink>
        </div>
      </div>
    </SharedModal>
  );
}

export default forwardRef(PodcastSubscribeDialog);
