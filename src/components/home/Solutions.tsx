import { useTranslation } from "next-i18next";
import CardsSlider from "@/components/shared/CardsSlider";
import Text from "@/components/shared/Text";
import { MotionSlideIn } from "@/components/shared/Motions";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import styles from "./Solutions.module.scss";
import CaretIcon from "@/components/icons/Caret";

const Card = ({ title, text, mobileImg, desktopImgSrc, href }) => (
  <MotionSlideIn>
    <div className={styles.Card}>
      <Link href={href}>
        <div className={styles.TitleWrapper}>
          <Text element="h3" as="heading">
            {title}
          </Text>
          <div className={styles.CaretIconWrapper}>
            <CaretIcon className={styles.CaretIcon} color="#0F0A16" />
          </div>
        </div>

        <Text element="p" as="paragraph">
          {text}
        </Text>

        <div className={classNames(styles.ImageWrapper)}>
          <Image
            src={mobileImg.src}
            alt={title}
            className={classNames("d-md-none")}
            placeholder="blur"
            blurDataURL={mobileImg.src}
            width={mobileImg.width}
            height={mobileImg.width}
          />
          <Image
            src={desktopImgSrc}
            alt={title}
            className={classNames("d-none d-md-block")}
            placeholder="blur"
            blurDataURL={desktopImgSrc}
            width={374}
            height={319}
          />
        </div>
      </Link>
    </div>
  </MotionSlideIn>
);

const Solutions = () => {
  const { t } = useTranslation();

  const cardsData = [
    {
      title: t("home.solutions.payments.title"),
      text: t("home.solutions.payments.text"),
      mobileImg: {
        src: "/src/img/home/solutions/payments-mb.svg",
        width: 290.76,
        height: 248,
      },
      desktopImgSrc: "/src/img/home/solutions/payments-dt.svg",
      href: "/solutions/payments",
    },
    {
      title: t("home.solutions.defi.title"),
      text: t("home.solutions.defi.text"),
      mobileImg: {
        src: "/src/img/home/solutions/defi-mb.png",
        width: 290.76,
        height: 248,
      },
      desktopImgSrc: "/src/img/home/solutions/defi-dt.png",
      href: "/solutions/defi",
    },
    {
      title: t("home.solutions.gaming.title"),
      text: t("home.solutions.gaming.text"),
      mobileImg: {
        src: "/src/img/home/solutions/gaming-mb.png",
        width: 294,
        height: 255,
      },
      desktopImgSrc: "/src/img/home/solutions/gaming-dt.png",
      href: "/solutions/gaming",
    },
    {
      title: t("home.solutions.creative.title"),
      text: t("home.solutions.creative.text"),
      mobileImg: {
        src: "/src/img/home/solutions/creative-mb.png",
        width: 294,
        height: 319,
      },
      desktopImgSrc: "/src/img/home/solutions/creative-dt.png",
      href: "/solutions/creative",
    },
    {
      title: t("home.solutions.institutional-finance.title"),
      text: t("home.solutions.institutional-finance.text"),
      mobileImg: {
        src: "/src/img/home/solutions/institutional-finance-mb.png",
        width: 294,
        height: 250.76,
      },
      desktopImgSrc: "/src/img/home/solutions/institutional-finance-dt.png",
      href: "/solutions/institutional-finance",
    },
    {
      title: t("home.solutions.loyalty.title"),
      text: t("home.solutions.loyalty.text"),
      mobileImg: {
        src: "/src/img/home/solutions/loyalty-dt.png",
        width: 294,
        height: 277.69,
      },
      desktopImgSrc: "/src/img/home/solutions/loyalty-dt.png",
      href: "/solutions/loyalty",
    },
    {
      title: t("home.solutions.wallets.title"),
      text: t("home.solutions.wallets.text"),
      mobileImg: {
        src: "/src/img/home/solutions/wallets-mb.png",
        width: 294,
        height: 250.76,
      },
      desktopImgSrc: "/src/img/home/solutions/wallets-dt.png",
      href: "/solutions/wallets",
    },
  ];

  const cards = cardsData.map((card, index) => (
    <Card
      key={`solution-card-${index}`}
      title={card.title}
      text={card.text}
      mobileImg={card.mobileImg}
      desktopImgSrc={card.desktopImgSrc}
      href={card.href}
    />
  ));

  return (
    <div className={styles.Solutions}>
      <div className={classNames("d-md-none", styles.CardsWrapper)}>
        {cards}
      </div>
      <CardsSlider
        items={cards}
        className={"d-none d-md-block"}
        carouselClassName={styles.Carousel}
      />
    </div>
  );
};

export default Solutions;
