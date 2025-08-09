import Header from "../Header";
import Footer from "../Footer";

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
