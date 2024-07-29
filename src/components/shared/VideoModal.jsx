import { Modal, Ratio } from "react-bootstrap";
import Script from "next/script";

const VideoModal = ({
  type,
  showVideoModal,
  setShowVideoModal,
  urlId,
  title,
  className,
  autoplay = false,
}) => {
  const hide = () => {
    setShowVideoModal(false);
  };

  const handleVimeoIframeLoad = () => {
    if (typeof Vimeo !== "undefined" && autoplay) {
      const player = new Vimeo.Player(document.querySelector(".vimeo-iframe"));
      player.play();
    }
  };

  return (
    <Modal
      show={showVideoModal}
      centered
      size="xl"
      onHide={hide}
      contentClassName="overflow-hidden dark-modal-content"
      className={className}
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-black border-0"
      />
      <Modal.Body className="d-flex justify-content-center bg-black p-0">
        <Ratio aspectRatio="16x9">
          {type !== "youtube" ? (
            <iframe
              className={`vimeo-iframe`}
              src={`https://player.vimeo.com/video/${urlId}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1`}
              frameBorder="0"
              onLoad={handleVimeoIframeLoad}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={title}
            ></iframe>
          ) : (
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${urlId}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </Ratio>
        {type !== "youtube" && (
          <Script
            src="https://player.vimeo.com/api/player.js"
            strategy="lazyOnload"
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default VideoModal;
