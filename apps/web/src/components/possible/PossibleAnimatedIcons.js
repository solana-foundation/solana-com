import { useState, useRef, useEffect } from "react";

const PossibleAnimatedIcons = ({
  videoSrc,
  fallbackImage,
  fallbackImageAlt,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          videoRef.current && videoRef.current.load();
        }
      },
      {
        rootMargin: "300px", // Loads the video a little before it comes into view
      },
    );

    const currentVideoRef = videoRef.current; // Store the current ref

    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  const handleVideoError = () => {
    setShowFallback(true);
  };

  return (
    <>
      {showFallback ? (
        <img src={fallbackImage} alt={fallbackImageAlt} width="400" />
      ) : (
        <video
          ref={videoRef}
          width="400"
          loop
          muted
          playsInline
          autoPlay
          onError={handleVideoError}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </>
  );
};

export default PossibleAnimatedIcons;
