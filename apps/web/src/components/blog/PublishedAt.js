import PropTypes from "prop-types";
import { toLocaleString } from "../../utils/dateUtils";
import { useRouter } from "next/router";

/**
 * Converts the Date and displays it.
 *
 * @param publishedDateString
 * @returns {JSX.Element}
 * @constructor
 */
const PublishedAt = ({ publishedDateString }) => {
  const { locale } = useRouter();
  const publishedAt = toLocaleString(locale, publishedDateString);
  return <time dateTime={publishedDateString}>{publishedAt}</time>;
};

PublishedAt.propTypes = {
  publishedDateString: PropTypes.string.isRequired,
};

export default PublishedAt;
