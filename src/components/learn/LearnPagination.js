import { ChevronLeft, ChevronRight } from "react-feather";
import { useTranslation } from "next-i18next";
import Link from "../../utils/Link";

const LearnPagination = ({ prevSlug, prevTopic, nextSlug, nextTopic }) => {
  const { t } = useTranslation();
  return (
    <nav
      className={`d-flex mx-n5 mx-md-n0 my-10 ${
        prevSlug && nextSlug
          ? "justify-content-between"
          : nextSlug
            ? "justify-content-end"
            : "justify-content-start"
      }`}
    >
      {prevSlug && (
        <Link
          to={`/learn/${prevSlug}`}
          className="w-50 link-unstyled d-flex justify-content-start align-items-center"
        >
          <ChevronLeft className="me-2" width="20" />
          <div>
            <p className="m-0 fw-bold">{t("learn.prev")}</p>
            <p className="smaller m-0 text-capitalize">{prevTopic}</p>
          </div>
        </Link>
      )}
      {nextSlug && (
        <Link
          to={nextSlug ? `/learn/${nextSlug}` : ``}
          className="w-50 link-unstyled d-flex justify-content-end align-items-center"
        >
          <div>
            <p className="m-0 fw-bold">{t("learn.next")}</p>
            <p className="smaller m-0 text-capitalize">{nextTopic}</p>
          </div>
          <ChevronRight className="ms-2" width="20" />
        </Link>
      )}
    </nav>
  );
};

export default LearnPagination;
