import Image from "next/legacy/image";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

import bannedLogos1 from "../../../public/src/img/branding/bannedLogos-1.svg";
import bannedLogos2 from "../../../public/src/img/branding/bannedLogos-2.png";
import bannedLogos3 from "../../../public/src/img/branding/bannedLogos-3.svg";
import bannedLogos4 from "../../../public/src/img/branding/bannedLogos-4.svg";
import bannedLogos5 from "../../../public/src/img/branding/bannedLogos-5.svg";
import bannedLogos6 from "../../../public/src/img/branding/bannedLogos-6.svg";
import InvalidMark from "../../../public/src/img/icons/RedClose.inline.svg";

const StyledSection = styled.section`
  .banned-logos {
    display: flex;
    justify-content: space-between;
    column-gap: 1.5rem;
    row-gap: 1.5rem;
    flex-wrap: wrap;

    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      flex: 1;
      width: 100%;
      min-width: 280px;
      height: 180px;
      background: #ffffff;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;

      .invalid-mark {
        position: absolute;
        left: 0.5rem;
        bottom: 0.5rem;
      }

      .description {
        font-size: 0.875rem;
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
      }
    }
  }
`;

const BrandingBannedLogos = () => {
  const { t } = useTranslation();

  return (
    <StyledSection className="mt-6">
      <div className="h6 fw-bold">{t("branding.banned.title")}</div>
      <p className="small mt-2">{t("branding.banned.description")}</p>
      <div className="banned-logos">
        <div style={{ background: "#9945FF" }}>
          <Image alt="" src={bannedLogos1} />
          <InvalidMark className="invalid-mark" />
          <p className="description">{t("branding.banned.shadow")}</p>
        </div>
        <div style={{ background: "#9945FF" }}>
          <Image alt="" src={bannedLogos2} />
          <InvalidMark className="invalid-mark" />
          <p className="description">{t("branding.banned.outline")}</p>
        </div>
        <div>
          <Image alt="" src={bannedLogos3} />
          <InvalidMark className="invalid-mark" />
          <p className="description">{t("branding.banned.stretch")}</p>
        </div>
        <div>
          <Image alt="" src={bannedLogos4} />
          <InvalidMark className="invalid-mark" />
          <p className="description">{t("branding.banned.lowResolution")}</p>
        </div>
        <div>
          <Image alt="" src={bannedLogos5} />
          <InvalidMark className="invalid-mark" />
          <p className="description">{t("branding.banned.imagery")}</p>
        </div>
        <div style={{ background: "#6D86D1" }}>
          <Image alt="" src={bannedLogos6} />
          <InvalidMark className="invalid-mark" />
          <p className="description">{t("branding.banned.contrast")}</p>
        </div>
      </div>
    </StyledSection>
  );
};

export default BrandingBannedLogos;
