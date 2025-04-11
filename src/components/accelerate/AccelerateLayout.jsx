import styles from "./AccelerateLayout.module.scss";
import Header from "./AccelerateHeader";
import Footer from "../Footer";

const AccelerateLayout = ({ data, children }) => {
  return (
    <>
      {data?.showHeader && <Header />}
      <main>
        <div className={styles["accelerate-layout"]}>{children}</div>
      </main>
      {data?.showFooter && <Footer />}
    </>
  );
};

export default AccelerateLayout;
