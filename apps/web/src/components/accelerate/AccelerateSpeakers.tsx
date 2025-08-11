import { FC } from "react";
import Image from "next/image";
import styles from "./AccelerateSpeakers.module.scss";
import TwitterIcon from "../../../public/src/img/footer/twitter.inline.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Speaker {
  event: "scale" | "ship";
  speakerName: string;
  company: string;
  title: string;
  image: string;
  socialLink: string;
}

interface AccelerateSpeakersProps {
  heading: string;
  speakers: Speaker[];
}

export const AccelerateSpeakers: FC<AccelerateSpeakersProps> = ({
  heading,
  speakers,
}) => {
  var settings = {
    dots: false,
    speed: 500,
    className: styles.slider,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1245,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.container}>
      <p className={`gradient-text-red ${styles.heading}`}>
        <span>{heading}</span>
      </p>
      <Slider {...settings}>
        {speakers &&
          speakers.map((speaker, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image src={speaker.image} alt={speaker.speakerName} fill />
              </div>
              <div className={styles.info}>
                <p className={`${styles.event} ${styles[speaker.event]}`}>
                  {speaker.event === "scale" ? "Scale or die" : "Ship or die"}
                </p>
                <h3 className={styles.name}>
                  <span>{speaker.speakerName.split(" ")[0]}</span>
                  <span>{speaker.speakerName.split(" ")[1]}</span>
                </h3>
                <div className={styles.companyWrapper}>
                  <p className={styles.company}>{speaker.company}</p>
                  <div className={styles.socialWrapper}>
                    <p className={styles.title}>{speaker.title}</p>
                    <a
                      className={styles.social}
                      href={speaker.socialLink}
                      target="_blank"
                    >
                      <TwitterIcon width="16" height="16" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
