import { useTranslation } from "next-i18next";
import StyledCaption from "../shared/StyledCaption";
import Divider from "../shared/Divider";
import Button from "../shared/Button";

/**
 * Displays grid info
 *
 * @param {String}  captionId     The section caption ID
 * @param {String}  titleId       The section title ID
 * @param {Array}   childrenArr   The array of objects, title and description, to loop within
 * @returns {JSX.Element}
 * @constructor
 */

const FeatsGrid = ({ captionId, titleId, childrenArr }) => {
  const { t } = useTranslation();

  return (
    <section>
      {captionId && (
        <StyledCaption className="text-uppercase mb-6">
          {t(captionId)}
        </StyledCaption>
      )}
      {titleId && <h3 className="mb-6">{t(titleId)}</h3>}
      <div className="row">
        {childrenArr.map((el, k) => (
          <div className="col-md-6" key={k}>
            <Divider theme="light" axis="x" className="my-5" />
            <h3 className="h5">{t(el.title)}</h3>
            <p className="subdued">{t(el.info)}</p>
            {el.cta && (
              <Button to={el.cta.url} newTab>
                {t(el.cta.text)}
              </Button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatsGrid;
