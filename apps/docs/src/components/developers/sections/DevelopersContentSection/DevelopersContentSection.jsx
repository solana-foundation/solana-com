import DevelopersNewsletter from "./DevelopersNewsletter";
import DevelopersOtherContent from "./DevelopersOtherContent";

export default function DevelopersContentSection() {
  return (
    <section className="mt-4 lg:mt-32">
      <div className="container flex">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <DevelopersNewsletter />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <DevelopersOtherContent />
          </div>
        </div>
      </div>
    </section>
  );
}
