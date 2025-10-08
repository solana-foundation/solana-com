import styles from "./BreakpointLayout.module.scss";
import Header from "./BreakpointHeader";
import { Footer } from "@solana-com/ui-chrome";

const BreakpointLayout = ({ data, children }) => {
  return (
    <>
      {data?.showHeader && <Header />}

      <main>
        <div className={styles["breakpoint-layout"]}>{children}</div>
      </main>
      {data?.showFooter && <Footer />}
    </>
  );
};

export default BreakpointLayout;
