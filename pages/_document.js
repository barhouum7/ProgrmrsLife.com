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
          <Script type="text/javascript" data-cfasync="false">
          {`
            var pmauid = '72784';
            var pmawid = '73107';
            var fq = '0';
          `}
          </Script>
          <Script type="text/javascript" data-cfasync="false" src="https://cdn.popmyads.com/pma.js" />
            
          {/* <!-- PopMyAds.com Popunder Code End --> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;