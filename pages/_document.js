import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/imgs/favicon.svg" />
        {/* Sharethis integration code */}
        <Script type="text/javascript" src="https://platform-api.sharethis.com/js/sharethis.js#property=64cb74163aa29300123c3d5b&product=inline-reaction-buttons&source=platform" async="async" />
        </Head>
        <body>
          <Script async src="https://assets.aweber-static.com/aweberjs/aweber.js" />
          <Main />
          <NextScript />
          
          <Script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                  (function(){var infolinks_pid = 3398255; var infolinks_wsid = 0;})();
              `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;