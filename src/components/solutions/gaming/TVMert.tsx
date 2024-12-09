import { useRef, useEffect } from "react";
import { Trans } from "next-i18next";
import classNames from "classnames";

import { AnimatedText, GradientText } from "@/components/shared/Text";

import useReducedMotion from "@/hooks/useReducedMotion";

import styles from "./TVMert.module.scss";

const TVMert = () => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [prefersReducedMotion] = useReducedMotion();

  const videos = [
    {
      src_720:
        "https://player.vimeo.com/progressive_redirect/playback/1009649838/rendition/720p/file.mp4?loc=external&signature=0c0ffaab9ea401d986555187c28100a88594ccc69d8317f295f06cb618815e4c",
      src_1080:
        "https://player.vimeo.com/progressive_redirect/playback/1009649838/rendition/1080p/file.mp4?loc=external&signature=8769962746274f024137d46578b7ee5630fe33ea5d845d5ee8e342697ab82dac",
      poster: "/solutions/gaming/mert-tv-1.jpeg",
    },
    {
      src_720:
        "https://player.vimeo.com/progressive_redirect/playback/1009649823/rendition/720p/file.mp4?loc=external&signature=9917c37382359cac1733ee757060f86b07cff29c8d646842962d56321c52d544",
      src_1080:
        "https://player.vimeo.com/progressive_redirect/playback/1009649823/rendition/1080p/file.mp4?loc=external&signature=b8f8a4574f9ee500b74e63279e83c0da87258c7c306f0ba879d051f264f85f10",
      poster: "/solutions/gaming/mert-tv-2.jpeg",
    },
  ];

  const handleVideoEnd = () => {
    video1Ref.current.style.opacity = 0;
    video2Ref.current.style.opacity = 1;
  };

  useEffect(() => {
    if (video1Ref.current && prefersReducedMotion) {
      video1Ref.current.pause();
    }
  }, [prefersReducedMotion, video1Ref]);

  useEffect(() => {
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.play();
      video2Ref.current.play();
      setTimeout(() => {
        video1Ref.current?.classList.add(styles.Active);
      }, 500);
    }
  }, [video1Ref, video2Ref]);

  return (
    <div className={classNames(styles.TVMert)}>
      <AnimatedText
        element="h2"
        as="heading"
        className={classNames(styles.Title, "page-width")}
      >
        <Trans
          i18nKey="solutions-gaming.tv-mert.title"
          components={{
            gradient: <GradientText />,
          }}
        />
      </AnimatedText>

      <div className={styles.VideoWrapper}>
        <video
          muted
          playsInline
          poster={videos[0].poster}
          ref={video1Ref}
          className={styles.Video1}
          onEnded={handleVideoEnd}
        >
          <source
            src={videos[0].src_720}
            type="video/mp4"
            media="(max-width:720px)"
          />
          <source src={videos[0].src_1080} type="video/mp4" />
        </video>

        <video
          loop
          muted
          playsInline
          poster={videos[1].poster}
          ref={video2Ref}
          className={styles.Video2}
        >
          <source
            src={videos[1].src_720}
            type="video/mp4"
            media="(max-width:720px)"
          />
          <source src={videos[1].src_1080} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default TVMert;
