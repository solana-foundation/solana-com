import { ReactNode } from "react";
import classNames from "classnames";
import Header from "../Header";
import Footer from "../Footer";
import styles from "./Layout.module.scss";

interface LayoutProps {
  headerClassName?: string;
  children: ReactNode;
}

const Layout = ({ headerClassName, children }: LayoutProps) => {
  return (
    <div className={styles.Layout}>
      <Header className={classNames(styles.Header, headerClassName)} />
      <main>{children}</main>
      <Footer className={styles.Footer} />
    </div>
  );
};
export default Layout;
