import { Link } from "../../utils/Link";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

const StyledPagination = styled.div`
  font-family: Diatype, var(--font-family-sans-serif);
  font-size: 20px;
  line-height: 145%;
  color: #f9f9fb;

  .progress {
    height: 4px;
    margin-top: 8px;
    max-width: 178px;
    background: #232323;

    &-bar {
      background: #f9f9fb;
    }
  }

  .load-more {
    margin-top: 15px;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem !important;
    color: #fff;

    @media (min-width: 576px) {
      padding: 0.5625rem 1rem;
      font-size: 0.9375rem !important;
    }

    @media (min-width: 768px) {
      margin: 0;
    }
  }

  .separator {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .btns-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 0.5rem;

    @media (min-width: 567px) {
      column-gap: 1.5rem;
    }

    .up-arrow {
      transform: rotate(180deg);
    }
  }
`;

const Pagination = ({
  disableSeperatorMargin = false,
  nextPagePath,
  previousPagePath,
  humanPageNumber,
  numberOfPages,
  postsPerPage = 3,
  postsInThisPage,
  itemsTotal,
  onPageChange,
}) => {
  const itemsRead = postsInThisPage + (humanPageNumber - 1) * postsPerPage;
  const progressPercentage = (itemsRead * 100) / itemsTotal;
  const progressPercentageStyle = {
    width: `${progressPercentage}%`,
  };

  const firstIndex = 1 + (humanPageNumber - 1) * postsPerPage;
  const lastIndex = postsInThisPage + (humanPageNumber - 1) * postsPerPage;

  const seperatorClassname = disableSeperatorMargin
    ? "separator"
    : "seperator mt-10";

  const { t } = useTranslation();

  return (
    <StyledPagination>
      <div role="separator" className={seperatorClassname} />
      <nav
        className="d-md-flex justify-content-between pt-4 pb-10 text-white"
        role="navigation"
      >
        {numberOfPages > 1 && (
          <>
            <div>
              {t("blog.pagination", {
                firstItem: firstIndex,
                lastItem: lastIndex > itemsTotal ? itemsTotal : lastIndex,
                total: itemsTotal,
              })}
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={progressPercentageStyle}
                ></div>
              </div>
            </div>
            <div className="btns-group">
              {previousPagePath && (
                <Link
                  className="btn btn-sm btn-black rounded-pill load-more"
                  to={previousPagePath}
                  onClick={onPageChange}
                  rel="next"
                  scroll={false}
                >
                  <svg
                    width="12"
                    height="15"
                    viewBox="0 0 17 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="up-arrow me-2"
                  >
                    <path
                      d="M8.48438 0.514648V17.4852M8.48438 17.4852L15.4723 10.4973M8.48438 17.4852L1.4965 10.4973"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  {t("blog.previous-btn")}
                </Link>
              )}
              {nextPagePath && (
                <Link
                  className="btn btn-sm btn-black rounded-pill load-more"
                  to={nextPagePath}
                  onClick={onPageChange}
                  rel="next"
                  scroll={false}
                >
                  <svg
                    width="12"
                    height="15"
                    viewBox="0 0 17 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="me-2"
                  >
                    <path
                      d="M8.48438 0.514648V17.4852M8.48438 17.4852L15.4723 10.4973M8.48438 17.4852L1.4965 10.4973"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  {t("blog.next-btn")}
                </Link>
              )}
            </div>
          </>
        )}
      </nav>
    </StyledPagination>
  );
};

export default Pagination;
