import styles from "./NFTShowdownLayout.module.scss";
import BodyPattern from "../../../assets/nft-showdown/body-pattern.png";

const NFTShowdownLayout = ({ children }) => {
  return (
    <>
      <div className={styles["nft-showdown-layout"]}>
        <main>
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">{children}</div>
            </div>
          </div>
        </main>
      </div>
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
