import { ReactNode } from "react";
import classNames from "classnames";
import { Footer, Header } from "@solana-com/ui-chrome";
import styles from "./Layout.module.scss";

interface LayoutProps {
  className?: string;
  headerClassName?: string;
  children: ReactNode;
}

const Layout = ({ className, headerClassName, children }: LayoutProps) => {
  return (
    <div className={classNames(styles.Layout, className)}>
      <Header className={classNames(styles.Header, headerClassName)} />
      <main>{children}</main>
      <Footer className={styles.Footer} />
    </div>
  );
};
export default Layout;
