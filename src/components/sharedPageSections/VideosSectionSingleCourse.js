import styled from "styled-components";

const StyledVideosSectionButton = styled.button`
  color: #fff;
  cursor: pointer;
  width: 100%;
  background: none;
  border: 0;

  &:hover,
  &:focus {
    outline: none;
    text-decoration: none;
    color: #ffffff;

    .video-and-courses--content {
      transition: border-color 0.25s cubic-bezier(0.32, 0.08, 0.24, 1);
      border-color: transparent;

      &::before {
        opacity: 1;
      }
    }
  }

  .video-and-courses--content {
    aspect-ratio: 16 / 9;
    position: relative;
    z-index: 2;
    border-radius: 1rem;
    margin: 0.1rem;

    &::before {
      transition: opacity 0.15s cubic-bezier(0.32, 0.08, 0.24, 1);
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      margin: -0.1rem;
      border-radius: 0.9rem;
      opacity: 0;
      background: linear-gradient(
        35.16deg,
        #8f4af6 13.72%,
        #14f195 56.28%,
        #14f195 93.19%
      );
    }

    .image-container {
      overflow: hidden;
      border-radius: 0.75rem 0.75rem 0 0;
      height: 100%;
      .react-player__preview {
        border-radius: 0.75rem 0.75rem 0 0;
      }
    }

    img {
      width: 100%;
      height: 100%;
    }

    .video-and-courses--info {
      position: relative;
      z-index: 2;
      border-radius: 0 0 0.75rem 0.75rem;
      margin-top: -0.3125rem;
      padding: 1rem;
      background-color: #26262b;
    }

    .video-title {
      font-size: 1rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;

/**
 * Displays a single video card.
 *
 * @param image
 * @param title
 * @param onClick
 * @param url
 * @returns {JSX.Element}
 * @constructor
 */
const VideosSectionSingleCourse = ({ image, title, onClick, url }) => {
  let props = {
    type: "button",
  };
  props.onClick = (e) => onClick(e, url);

  return (
    <StyledVideosSectionButton {...props}>
      <div className="video-and-courses--content">
        <div className="image-container position-relative">{image}</div>
        <div className="video-and-courses--info d-flex flex-column">
          <div className="video-title" title={title}>
            {title}
          </div>
        </div>
      </div>
    </StyledVideosSectionButton>
  );
};

export default VideosSectionSingleCourse;
