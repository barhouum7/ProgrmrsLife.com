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
          <title>ProgrammersLife™ - Your Guide to Web Development, Tips & Tricks and Tech News</title>
          <meta name="description" content="ProgrammersLife™ is a blog that provides you with the latest tech news, web development tips & tricks and more." />
          <meta name="keywords" content="web development, web development tips, web development tricks, web development news, tech news, tech tips, tech tricks, tech news, tech blog, web development blog" />
          <meta name="author" content="ProgrammersLife™" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="index, follow" />
          <meta charSet="UTF-8" />
          <link rel="icon" href="/imgs/favicon.svg" />
          {/* Sharethis integration code */}
          <script type='text/javascript' strategy="afterInteractive" src='https://platform-api.sharethis.com/js/sharethis.js#property=64cb74163aa29300123c3d5b&product=inline-reaction-buttons' async='async'></script>
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* AWeber script below */}
          <script
            async
            src="https://assets.aweber-static.com/aweberjs/aweber.js"
          ></script>
          <script
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
          ></script>
          
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