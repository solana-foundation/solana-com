import NextErrorComponent from "next/error";

const MyError = ({ statusCode }) => {
  return <NextErrorComponent statusCode={statusCode} />;
};

MyError.getInitialProps = async (context) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(context);

  const { res } = context;

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true;

  // Returning early because we don't want to log 404 errors
  if (res?.statusCode === 404) {
    return errorInitialProps;
  }

  return errorInitialProps;
};

export default MyError;
