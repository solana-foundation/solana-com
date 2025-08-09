import _ from "lodash";
import PropTypes from "prop-types";
import { getAuthor } from "@/lib/builder/api";

export const getAuthorProperties = (primaryAuthor) => {
  let authorProfiles = [];
  const authorData = primaryAuthor ? getAuthor(primaryAuthor?.id) : null;

  authorProfiles.push(
    authorData?.website ? authorData?.website : null,
    authorData?.twitter
      ? `https://twitter.com/${authorData?.twitter.replace(/^@/, ``)}/`
      : null,
    authorData?.facebook
      ? `https://www.facebook.com/${authorData?.facebook.replace(/^\//, ``)}/`
      : null,
  );

  authorProfiles = _.compact(authorProfiles);

  return {
    name: authorData?.name || null,
    sameAsArray: authorProfiles.length
      ? `["${_.join(authorProfiles, `", "`)}"]`
      : null,
    image: authorData?.profileImage || null,
    facebookUrl: authorData?.facebook
      ? `https://www.facebook.com/${authorData?.facebook.replace(/^\//, ``)}/`
      : null,
  };
};

getAuthorProperties.defaultProps = {
  fetchAuthorData: false,
};

getAuthorProperties.PropTypes = {
  primaryAuthor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
    website: PropTypes.string,
    twitter: PropTypes.string,
    facebook: PropTypes.string,
  }).isRequired,
};

export default getAuthorProperties;
