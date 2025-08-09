import Document, { Head, Html, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { config } from "src/config";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      let locale = null;
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => {
            locale = props.pageProps?.locale;
            return sheet.collectStyles(<App {...props} />);
          },
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        locale,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const id = config.siteMetadata.googleTagManagerID;
    const { locale } = this.props;

    return (
      <Html lang={locale || "en"}>
        <Head />
        <body>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${id}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
