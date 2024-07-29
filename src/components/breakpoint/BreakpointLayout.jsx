import styles from "./BreakpointLayout.module.scss";
import Header from "./BreakpointHeader";
import Footer from "./../Footer";
import BreakpointFooter from "./BreakpointFooter";

const BreakpointLayout = ({ data, children }) => {
  return (
    <>
      {data?.showHeader && <Header />}

      <main>
        <div className={styles["breakpoint-layout"]}>
          {children}
          <BreakpointFooter />
        </div>
      </main>
      {data?.showFooter && <Footer />}
    </>
  );
};

export default BreakpointLayout;
