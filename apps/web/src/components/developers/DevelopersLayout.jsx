import { Footer, Header } from "@solana-com/ui-chrome";

const DevelopersLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "70vh",
        }}
      >
        <div className="container py-5">{children}</div>
      </main>
      <Footer />
    </>
  );
};

export default DevelopersLayout;
