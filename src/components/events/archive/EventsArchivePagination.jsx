import { ArrowLeft, ArrowRight } from "react-feather";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import Button from "../../shared/Button";

const StyledProgressBar = styled.div`
  height: 0.25rem;
  margin-top: 0.5rem;
  max-width: 11rem;
  background: #232323;

  .progress-bar {
    background: #f9f9fb;
    height: 100%;
    width: ${(props) => props.$progressPercentage || 6}%;
  }
`;

const EventsArchivePagination = ({
  initialPageSize,
  totalCount = 0,
  currentPage = 0,
  setCurrentPage = () => {},
}) => {
  const { t } = useTranslation();
  const pageLowerBound = currentPage * initialPageSize;

  const pageUpperBound =
    pageLowerBound + initialPageSize < totalCount
      ? pageLowerBound + initialPageSize
      : totalCount;

  const progressPercentage = (pageUpperBound / totalCount) * 100;

  const totalPages = totalCount / initialPageSize;

  return (
    <div className="container">
      <div className="mt-5">
        {t("events.archive.event-count", {
          current: `${pageLowerBound + 1} - ${pageUpperBound}`,
          total: totalCount,
        })}
        <StyledProgressBar $progressPercentage={progressPercentage}>
          <div className="progress-bar" />
        </StyledProgressBar>
      </div>
      <div className="d-md-flex justify-content-between mt-5">
        <Button
          onClick={() =>
            setCurrentPage((prevPage) => (currentPage === 0 ? 0 : prevPage - 1))
          }
          variant="tertiary"
          className="mt-5 mt-md-0"
          disabled={currentPage === 0}
        >
          <ArrowLeft className="me-2" />
          {t("events.archive.previous-page")}
        </Button>
        <Button
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage + 1 > totalPages ? prevPage : prevPage + 1,
            )
          }
          variant="tertiary"
          className="mt-5 mt-md-0"
          disabled={currentPage + 1 >= totalPages}
        >
          {t("events.archive.next-page")}
          <ArrowRight className="ms-2" />
        </Button>
      </div>
    </div>
  );
};

export default EventsArchivePagination;
