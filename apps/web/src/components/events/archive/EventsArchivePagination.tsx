import { ArrowLeft, ArrowRight } from "react-feather";
import { useTranslations } from "next-intl";
import Button from "../../shared/Button";

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
        <div className="h-1 mt-2 max-w-[11rem] bg-[#232323]">
          <div
            className="bg-[#f9f9fb] h-full"
            style={{ width: `${progressPercentage || 6}%` }}
          />
        </div>
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
