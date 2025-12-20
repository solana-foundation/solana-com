import { Header, Footer } from "@solana-com/ui-chrome";

const Layout = ({ children, className }) => {
  return (
    <>
      <Header />
      <main className={className}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
