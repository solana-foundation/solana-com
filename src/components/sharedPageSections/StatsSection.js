import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import RoundedDepthCard from "../shared/RoundedDepthCard";
import { useTranslation } from "next-i18next";
import Divider from "../shared/Divider";
import StyledCaption from "../shared/StyledCaption";

/**
 * Displays a singular statistic about Solana NFTs.
 *
 * @param id
 * @param subId
 * @param className
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const SingleNFTStat = ({ id, subId, children }) => {
  const { t } = useTranslation();
  return (
    <div className="p-5">
      <div className="h2 mb-0">{t(id)}</div>
      <div className="h5">{t(subId)}</div>
      {children}
    </div>
  );
};

const options = {
  year: "2-digit",
  month: "numeric",
  day: "2-digit",
};

const StatsUpdatedAt = ({ updatedId, updatedAt }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const formatted = useMemo(() => {
    try {
      return Intl.DateTimeFormat(locale, options).format(updatedAt);
    } catch (error) {
      console.error(error);
      return updatedAt;
    }
  }, [locale, updatedAt]);

  return (
    <StyledCaption>
      {t(updatedId, {
        updateDate: formatted,
      })}
    </StyledCaption>
  );
};

/**
 * Displays a statistics section.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const StatsSection = ({
  firstStatId,
  firstStatSubId,
  secondStatId,
  secondStatSubId,
  thirdStatId,
  thirdStatSubId,
  updatedId,
  updatedAt,
  updatedComponent = 1,
}) => {
  const [updatedAtDatetime, setUpdatedDatetime] = useState(null);

  useEffect(() => {
    setUpdatedDatetime(updatedAt);
  }, [updatedAt]);

  return (
    <section className="container py-10">
      <RoundedDepthCard shadow="bottom">
        <div className="d-flex flex-column flex-lg-row justify-content-lg-between">
          <SingleNFTStat id={firstStatId} subId={firstStatSubId}>
            {updatedComponent === 1 && updatedAtDatetime && (
              <StatsUpdatedAt
                updatedId={updatedId}
                updatedAt={updatedAtDatetime}
              />
            )}
          </SingleNFTStat>
          <Divider
            className="d-block w-100 d-lg-none my-2"
            theme="dark"
            axis="x"
          />
          <SingleNFTStat id={secondStatId} subId={secondStatSubId}>
            {updatedComponent === 2 && updatedAtDatetime && (
              <StatsUpdatedAt
                updatedId={updatedId}
                updatedAt={updatedAtDatetime}
              />
            )}
          </SingleNFTStat>
          <Divider
            className="d-block w-100 d-lg-none my-2"
            theme="dark"
            axis="x"
          />
          <SingleNFTStat id={thirdStatId} subId={thirdStatSubId}>
            {updatedComponent === 3 && updatedAtDatetime && (
              <StatsUpdatedAt
                updatedId={updatedId}
                updatedAt={updatedAtDatetime}
              />
            )}
          </SingleNFTStat>
        </div>
      </RoundedDepthCard>
    </section>
  );
};

export default StatsSection;
