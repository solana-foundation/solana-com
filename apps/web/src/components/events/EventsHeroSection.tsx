import Button from "../shared/Button";
import { useTranslations } from "next-intl";

const EventsHeroSection = ({ type = "hero" }: { type?: string }) => {
  const t = useTranslations();
  const isSingleton = type !== "archive";

  return (
    <section className="relative">
      <div
        className="absolute w-[2340px] h-[1340px] bottom-[-15%] pointer-events-none"
        style={{
          left: isSingleton ? "-40%" : "-60%",
          maxWidth: isSingleton ? "100vw" : undefined,
          background:
            "radial-gradient(50% 50% at 50% 50%, #9945ff 0%, rgba(62, 30, 100, 0) 100%)",
        }}
      />
      <div className="container relative">
        <h1 className="h1 mt-20">{t(`events.${type}.title`)}</h1>
        <div className="grid grid-cols-12 gap-5 md:gap-10">
          <div className="col-span-12 md:col-span-7">
            <p className="mb-4">{t(`events.${type}.subtitle`)}</p>
            {type === "archive" && (
              <Button to="/events">{t("events.hero.all-events")}</Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsHeroSection;
