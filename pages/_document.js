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
          <Script async src="https://assets.aweber-static.com/aweberjs/aweber.js" />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                  var AWeber = window.AWeber || [];
                  AWeber.push(function() {
                    AWeber.WebPush.init(
                      'BPWeSrUv87tnPkdoNOpUlMTllSqJ-fyJCJlYT2eeU8M6fBSFwO4FfQWcU83SEte8wowpIdhAH2P19HJDkUuAmAc',
                      'a8f015e0-3041-4a1c-be7f-e8817369ba07',
                      '9b0f384d-00c7-46f4-b678-2d996e3f2e4a'
                    );
                  });
              `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;