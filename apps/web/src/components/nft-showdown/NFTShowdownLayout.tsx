import styles from "./NFTShowdownLayout.module.scss";
import BodyPattern from "../../../assets/nft-showdown/body-pattern.png";

interface NFTShowdownLayoutProps {
  children: React.ReactNode;
}

const NFTShowdownLayout = ({ children }: NFTShowdownLayoutProps) => {
  return (
    <>
      <div className={styles["nft-showdown-layout"]}>
        <main>
          <div className="container">
            <div className="w-full lg:w-10/12 mx-auto">{children}</div>
          </div>
        </main>
      </div>
      {/* eslint-disable-next-line react/no-unknown-property*/}
      <style global jsx>{`
        body {
          background-color: #070708;
          color: #cdcece;
          background-image: url(${BodyPattern.src});
          background-attachment: fixed;
        }
      `}</style>
    </>
  );
};

export default NFTShowdownLayout;
