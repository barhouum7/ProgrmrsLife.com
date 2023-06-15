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
          <link rel="icon" href="/favicon.svg" />
          <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1339539882255727"
              crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          
          <Script async src="http://resources.infolinks.com/js/infolinks_main.js" />
          <script
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