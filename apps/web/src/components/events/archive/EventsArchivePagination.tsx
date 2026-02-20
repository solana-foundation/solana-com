import { ArrowLeft, ArrowRight } from "react-feather";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import Button from "../../shared/Button";

interface StyledProgressBarProps {
  $progressPercentage: number;
}

const StyledProgressBar = styled.div<StyledProgressBarProps>`
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

interface EventsArchivePaginationProps {
  initialPageSize: number;
  totalCount?: number;
  currentPage?: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
}

const EventsArchivePagination = ({
  initialPageSize,
  totalCount = 0,
  currentPage = 0,
  setCurrentPage = () => {},
}: EventsArchivePaginationProps) => {
  const t = useTranslations();
  const pageLowerBound = currentPage * initialPageSize;

  const pageUpperBound =
    pageLowerBound + initialPageSize < totalCount
      ? pageLowerBound + initialPageSize
      : totalCount;

  const progressPercentage = (pageUpperBound / totalCount) * 100;

  const totalPages = totalCount / initialPageSize;

  return (
    <div className="container">
      <div className="mt-6">
        {t("events.archive.event-count", {
          current: `${pageLowerBound + 1} - ${pageUpperBound}`,
          total: totalCount,
        })}
        <StyledProgressBar $progressPercentage={progressPercentage}>
          <div className="progress-bar" />
        </StyledProgressBar>
      </div>
      <div className="md:flex justify-between mt-6">
        <Button
          onClick={() =>
            setCurrentPage((prevPage) => (currentPage === 0 ? 0 : prevPage - 1))
          }
          variant="tertiary"
          className="mt-6 md:mt-0"
          disabled={currentPage === 0}
        >
          <ArrowLeft className="mr-2" />
          {t("events.archive.previous-page")}
        </Button>
        <Button
          onClick={() =>
            setCurrentPage((prevPage) =>
              prevPage + 1 > totalPages ? prevPage : prevPage + 1,
            )
          }
          variant="tertiary"
          className="mt-6 md:mt-0"
          disabled={currentPage + 1 >= totalPages}
        >
          {t("events.archive.next-page")}
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default EventsArchivePagination;
