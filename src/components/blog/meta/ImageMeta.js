import Head from "next/head";
import PropTypes from "prop-types";
import { config } from "src/config";

const ImageMeta = ({ image }) => {
  if (!image) {
    return null;
  }

  return (
    <Head>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={image} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={config.shareImageWidth} />
      <meta property="og:image:height" content={config.shareImageHeight} />
    </Head>
  );
};

ImageMeta.propTypes = {
  image: PropTypes.string,
};

export default ImageMeta;
