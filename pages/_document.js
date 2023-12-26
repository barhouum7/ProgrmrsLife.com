import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta name="google-adsense-account" content="ca-pub-1339539882255727" />
          {/* // Code from AdSense */}
          <script 
            id="adsbygoogle-init"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1339539882255727"
          />
          <link rel="icon" href="/imgs/favicon.svg" />
            {/* <!-- Google Tag Manager --> */}
            <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-WFFN5QDF');
                  `,
                }}
              />
            {/* <!-- End Google Tag Manager --> */}
          {/* Sharethis integration code */}
          <script src="https://platform-api.sharethis.com/js/sharethis.js#property=65146ae9c8722100193bdff3&product=inline-reaction-buttons&source=platform" async="async" />
          
          {/* Google Adsense Allow Ads message tag */}
          <script async src="https://fundingchoicesmessages.google.com/i/pub-1339539882255727?ers=1" nonce="ML-8Zn0qG97P5bAGURNW3Q" />
          <script
            nonce="ML-8Zn0qG97P5bAGURNW3Q"
            dangerouslySetInnerHTML={{
              __html: `
              (function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();
              `,
            }}
          />
          {/* Allow Ads Error protection message */}
        </Head>
        <body>
          {/* <!-- Google Tag Manager (noscript) --> */}
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WFFN5QDF"
              height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
              {/* <!-- End Google Tag Manager (noscript) --> */}
              {/* <!-- Google tag (gtag.js) --> */}
              <script 
                  async 
                  src="https://www.googletagmanager.com/gtag/js?id=G-PEF01PTY1T"
              ></script>
              <script
              type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-PEF01PTY1T');
                  `,
                }}
              ></script>
              {/* <!-- End Google tag (gtag.js) --> */}
          <Main />
          <NextScript />


          {/* AWeber script below */}
          {/* <script
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
          ></script> */}

          {/* InfoLinks Scripts */}
          {/* <script async src="https://resources.infolinks.com/js/infolinks_main.js"></script>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                  (function(){var infolinks_pid = 3398255; var infolinks_wsid = 0;})();
              `,
            }}
          ></script> */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;