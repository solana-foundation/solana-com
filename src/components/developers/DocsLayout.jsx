import Header from "../Header";
import Footer from "../Footer";

export default function DocsLayout({ children }) {
  return (
    <>
      <Header containerClassName="container-docs" />
      <main
        style={{
          minHeight: "70vh",
        }}
      >
        <div className="container-xl container-docs py-5">{children}</div>
      </main>
      <Footer />
    </>
  );
}
