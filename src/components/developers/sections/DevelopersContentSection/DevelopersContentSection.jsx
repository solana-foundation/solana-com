import DevelopersNewsletter from "./DevelopersNewsletter";
import DevelopersOtherContent from "./DevelopersOtherContent";

export default function DevelopersContentSection() {
  return (
    <section className="mt-4 mt-lg-12">
      <div className="container d-flex">
        <div className="row gx-5 gy-5">
          <div className="col-12 col-lg-6">
            <DevelopersNewsletter />
          </div>
          <div className="col-12 col-lg-6">
            <DevelopersOtherContent />
          </div>
        </div>
      </div>
    </section>
  );
}
