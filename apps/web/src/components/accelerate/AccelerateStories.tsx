import { FC } from "react";
import styles from "./AccelerateStories.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const AccelerateStories: FC<{ urls: { url: string }[] }> = ({
  urls,
}) => {
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.5,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1245,
        settings: {
          slidesToShow: 1.5,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1.5,
        },
      },
    ],
  };

  return (
    <div className={styles.container}>
      <Slider {...settings}>
        {urls &&
          urls.map(({ url }, index) => {
            const videoId =
              url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
            return (
              <div key={index} className={styles.card}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}&amp;controls=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            );
          })}
      </Slider>
    </div>
  );
};

const CustomPrevArrow = (props: any) => {
  const { style, onClick } = props;
  return (
    <div className={styles.arrowLeft} style={{ ...style }} onClick={onClick}>
      <ArrowLeft size={28} />
    </div>
  );
};

const CustomNextArrow = (props: any) => {
  const { style, onClick } = props;
  return (
    <div className={styles.arrowRight} style={{ ...style }} onClick={onClick}>
      <ArrowRight size={28} />
    </div>
  );
};
