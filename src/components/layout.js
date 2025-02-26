import Header from "./Header";
import Footer from "./Footer";
import { InkeepScript } from "../app/components/inkeep-script";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <InkeepScript />
      <Footer />
    </>
  );
};

export default Layout;
