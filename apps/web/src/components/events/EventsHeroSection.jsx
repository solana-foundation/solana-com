import styled from "styled-components";
import Button from "../shared/Button";
import { useTranslations } from "next-intl";

const StyledEventsHeroSection = styled.section`
  position: relative;

  .hero-gradient {
    position: absolute;
    background: radial-gradient(
      50% 50% at 50% 50%,
      #9945ff 0%,
      rgba(62, 30, 100, 0) 100%
    );
    width: 2340px;
    height: 1340px;
    bottom: -15%;
    left: ${(props) => (props.$singleton ? `-40%` : `-60%`)};
    max-width: ${(props) => (props.$singleton ? `100vw` : `auto`)};
  }
`;

const EventsHeroSection = ({ type = "hero" }) => {
  const t = useTranslations();

  return (
    <StyledEventsHeroSection>
      <div className="hero-gradient" />
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
    </StyledEventsHeroSection>
  );
};

export default EventsHeroSection;
