import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel="icon" href="/icons/favicon.svg" />
          <link rel="apple-touch-icon" href="/icons/icon-128x128.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
          <meta name="theme-color" content="#60A5FA" />
          <meta name="detect-adblock" content="technical" />

          {/* <meta name="google-adsense-account" content="ca-pub-1339539882255727" /> */}
          <meta name="google-adsense-account" content="ca-pub-5021308603136043" />
          
        </Head>
        <body>


          {/* // Code from AdSense */}
          <Script 
            id="adsbygoogle-init"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5021308603136043"
            // src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1339539882255727"
          />

          {/* <!-- Google Tag Manager --> */}
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
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
          <Script 
            async 
            src="https://platform-api.sharethis.com/js/sharethis.js#property=65146ae9c8722100193bdff3&product=inline-reaction-buttons&source=platform" 
            strategy="afterInteractive"
          />
          

          {/* <!-- Google Tag Manager (noscript) --> */}
          {/* <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WFFN5QDF"
              height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript> */}

          {/* <!-- End Google Tag Manager (noscript) --> */}
          {/* <!-- Google tag (gtag.js) --> */}
          <Script 
              async 
              src="https://www.googletagmanager.com/gtag/js?id=G-PEF01PTY1T"
              strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-PEF01PTY1T');
              `,
            }}
          />
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