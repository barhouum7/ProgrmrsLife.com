import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from "./Header/Header";
import Footer from "./FooterSection";
import { Subscribe, ScrollToTopButton, ConsentPreferenceLink, ChatWithAIButton } from "../components";
import Head from "next/head";
import Script from "next/script";

const Layout = ({ children }) => {

  // // Dynamically add the PopAds script tag to the head
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.type = 'text/javascript';
  //   script.setAttribute('data-cfasync', 'false');
  //   script.innerHTML = `
  //     /*<![CDATA[/* */
  //     (function(){if(window.ee05df34921703334cba6a52748be1e5) return; window.ee05df34921703334cba6a52748be1e5="EVHqg4Vcht4GlDTfeK2nkh6ke36ndtvK_zsVjmDQGO1NsW1QU0xqIW7sEVDWo6Ytwf8ik5rIqzcNfyw";var a=['w4ACLzjCocK3wqfDksOuwpzDkU3Di8O0woE=','Jx9KMcKxwrU=','w58Qw6oSGXQjwopGwo5Nw7A=','GCDDrHXChQ==','wrTDo8KBw4XDg1V6eMKmw48=','PQvDnMKFwogtIXt3PQQIwqo=','TCnCm8Oxwpd3OsOEwpvDu8KtwpsHwqg=','w6keOzZPbsO7w4o=','w5ckPsO5w5vDgsOMw6I=','woLDsMOOwq0=','w580w6fDhijChw==','w5ACOy3Dt8KfwqPDkMO4worDl1E=','Sk0hwrpHwrPCiQ==','A8OFwo4=','w57DtmxywqVeJzzDksKIw77Ci8KR','HEnDqsObE8KP','ZsOcw43Cn1/Ctz45w7wILw==','AsOew5J8wonDmcObAsK3AcKjw6g=','ccKIw6HDu8Kuw5HChMKDw68=','DyjCl2ACBsKUUMOSw5xgw5jDvxbCrsOmPjzDsRYSwojDi8OWesOjw69PH8OtFhRRwr7DiQ3DicOzQxg8R1wgMMOuOsKOI8KPw5fDhlEAw6DCnA4+XQ==','w5QlUk3CrlcGw5gzw5rDh8KXwoTDtsK2QzHDtsOVw5c=','ccOXw5LCiQ==','w58+w6HDihHClw==','BMOew4RrwonDgsOr','a8K7H0nDr2Nhw6Q=','dMK4HBfDvTc6wqLDv8Kgwq/DrsK6YDDCggHDlyfDh8KpGGARUcKpacOVwr3DnMK6wo4jZsKOwqTCoCfCkCVWw64awqkRY8OTFwDDuUw='];(function(b,e){var f=function(g){while(--g){b['push'](b['shift']());}};f(++e);}(a,0x7a));var b=function(c,d){c=c-0x0;var e=a[c];if(b['flZuVG']===undefined){(function(){var h=function(){var k;try{k=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(l){k=window;}return k;};var i=h();var j='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';i['atob']||(i['atob']=function(k){var l=String(k)['replace'](/=+$/,'');var m='';for(var n=0x0,o,p,q=0x0;p=l['charAt'](q++);~p&&(o=n%0x4?o*0x40+p:p,n++%0x4)?m+=String['fromCharCode'](0xff&o>>(-0x2*n&0x6)):0x0){p=j['indexOf'](p);}return m;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};b['OsMbWF']=g;b['WcZUlp']={};b['flZuVG']=!![];}var f=b['WcZUlp'][c];if(f===undefined){if(b['LjQAef']===undefined){b['LjQAef']=!![];}e=b['OsMbWF'](e,d);b['WcZUlp'][c]=e;}else{e=f;}return e;};var i=window;i[b('0x11','3[DA')]=[[b('0x12','%pbB'),0x4be13c],[b('0x9','7$5X'),0x0],[b('0xe','uG%5'),'0'],[b('0x13','w$[@'),0x0],[b('0x14','2nhH'),![]],[b('0x16','HNcR'),0x0],[b('0xa','c3&o'),!0x0]];var p=[b('0x7','WQeU'),b('0x1','a77n')],s=0x0,f,n=function(){if(!p[s])return;f=i[b('0xf','u$ZP')][b('0xd','c4yt')](b('0x17','KnOP'));f[b('0x3','xlyU')]=b('0x8','w$[@');f[b('0xb',']dtl')]=!0x0;var c=i[b('0x10','OV05')][b('0x2','Ocg3')](b('0x4','%pbB'))[0x0];f[b('0x15','1y)l')]=b('0x6','WQeU')+p[s];f[b('0x18','xlyU')]=b('0x0','pjdZ');f[b('0x5','A%In')]=function(){s++;n();};c[b('0xc','iKBd')][b('0x19','A%In')](f,c);};n();})();
  //     /*]]>/* */    
  //   `;
  
  //   document.head.appendChild(script);
  
  //   // Clean up the script when the component unmounts
  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);
  

  // // Dynamically add the AWeber Web Push script to the <body> tag
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.type = 'text/javascript';
  //   script.innerHTML = `
  //       var AWeber = window.AWeber || [];
  //       AWeber.push(function() {
  //           AWeber.WebPush.init(
  //               'BPWeSrUv87tnPkdoNOpUlMTllSqJ-fyJCJlYT2eeU8M6fBSFwO4FfQWcU83SEte8wowpIdhAH2P19HJDkUuAmAc',
  //               'a8f015e0-3041-4a1c-be7f-e8817369ba07',
  //               '9b0f384d-00c7-46f4-b678-2d996e3f2e4a'
  //           );
  //       });
  //   `;

  //   document.body.appendChild(script);

  //   // Clean up the script when the component unmounts
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  // if (typeof window !== "undefined") {
  //   window.document.querySelector("html").addEventListener("copy", (e) => {
  //     e.preventDefault();
  //     e.clipboardData.setData("text/plain", "Copying is not allowed.");
  //   });
  // }
  return (
    <div>
      <Head>
        <title>ProgrammersLife™</title>
        <link rel="icon" href="/imgs/favicon.svg" />
        <meta name="description" content="ProgrammersLife™ is a blog about programming, web development, and tech in general. We write about the latest technologies, frameworks, and libraries. We also write about the latest news in the tech world." />
        <meta name="keywords" content="programming, web development, tech, latest technologies, frameworks, libraries, latest news, tech world" />
        <meta name="author" content="ProgrammersLife™" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <meta property="og:title" content="ProgrammersLife™" />
        <meta property="og:description" content="ProgrammersLife™ is a blog about programming, web development, and tech in general. We write about the latest technologies, frameworks, and libraries. We also write about the latest news in the tech world." />
        <meta property="og:image" content="/imgs/logo.svg" />
        <meta property="og:url" content="https://programmerslife.site/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ProgrammersLife™" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:locale:alternate" content="de_DE" />
        <meta property="og:locale:alternate" content="it_IT" />
        <meta property="og:locale:alternate" content="pt_PT" />
        <meta property="og:locale:alternate" content="ru_RU" />
        <meta property="og:locale:alternate" content="zh_CN" />
        <meta property="og:locale:alternate" content="ja_JP" />
        <meta property="og:locale:alternate" content="ko_KR" />
        <meta property="og:locale:alternate" content="ar_SA" />
        <meta property="og:locale:alternate" content="tr_TR" />
        <meta property="og:locale:alternate" content="nl_NL" />
        <meta property="og:locale:alternate" content="pl_PL" />
        <meta property="og:locale:alternate" content="sv_SE" />
        <meta property="og:locale:alternate" content="da_DK" />
        <meta property="og:locale:alternate" content="no_NO" />
        <meta property="og:locale:alternate" content="fi_FI" />
        <meta property="og:locale:alternate" content="cs_CZ" />
        <meta property="og:locale:alternate" content="hu_HU" />
        <meta property="og:locale:alternate" content="ro_RO" />
        <meta property="og:locale:alternate" content="sk_SK" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@programmerslife" />
        <meta name="twitter:creator" content="@programmerslife" />
        <meta name="twitter:title" content="ProgrammersLife™" />
        <meta name="twitter:description" content="ProgrammersLife™ is a blog about programming, web development, and tech in general. We write about the latest technologies, frameworks, and libraries. We also write about the latest news in the tech world." />
        <meta name="twitter:image" content="/imgs/logo.svg" />
        <meta name="twitter:image:alt" content="ProgrammersLife™" />
        <meta name="twitter:domain" content="https://programmerslife.site/" />
        <meta name="twitter:app:country" content="US" />
        <meta name="twitter:app:name:iphone" content="ProgrammersLife™" />
        <meta name="twitter:app:id:iphone" content="id1520000000" />
        <meta name="twitter:app:url:iphone" content="https://programmerslife.site/" />
        <meta name="twitter:app:name:ipad" content="ProgrammersLife™" />
        <meta name="twitter:app:id:ipad" content="id1520000000" />
        <meta name="twitter:app:url:ipad" content="https://programmerslife.site/" />
        <meta name="twitter:app:name:googleplay" content="ProgrammersLife™" />
        <meta name="twitter:app:id:googleplay" content="com.programmerslife" />
        <meta name="twitter:app:url:googleplay" content="https://programmerslife.site/" />
        <meta name="twitter:app:country" content="US" />
        <meta name="twitter:app:name:iphone" content="ProgrammersLife™" />
        <meta name="twitter:app:id:iphone" content="id1520000000" />

        <meta name="apple-mobile-web-app-title" content="ProgrammersLife™" />
        <meta name="application-name" content="ProgrammersLife™" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/imgs/logo.svg" />

        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandex" content="index, follow" />
        <meta name="msnbot" content="index, follow" />
        <meta name="slurp" content="index, follow" />
        <meta name="duckduckbot" content="index, follow" />
        <meta name="teoma" content="index, follow" />
        <meta name="exabot" content="index, follow" />
        <meta name="facebot" content="index, follow" />
        <meta name="ia_archiver" content="index, follow" />
        <meta name="mj12bot" content="index, follow" />
        <meta name="pinterest" content="index, follow" />
        <meta name="twitterbot" content="index, follow" />
        <meta name="googlebot-news" content="index, follow" />
        <meta name="googlebot-image" content="index, follow" />
        <meta name="googlebot-video" content="index, follow" />
        <meta name="googlebot-mobile" content="index, follow" />
        <meta name="googlebot-ads" content="index, follow" />
        <meta name="googlebot-amp" content="index, follow" />
        <meta name="googlebot-favicons" content="index, follow" />
        <meta name="googlebot-webmasters" content="index, follow" />
        <meta name="googlebot-structured-data" content="index, follow" />
        <meta name="googlebot-nosnippet" content="index, follow" />
        <meta name="googlebot-noscript" content="index, follow" />
        <meta name="googlebot-crawl-delay" content="index, follow" />
        <meta name="googlebot-translation" content="index, follow" />
        <meta name="googlebot-translation-robots" content="index, follow" />
        <meta name="googlebot-translation-language" content="index, follow" />
        <meta name="googlebot-translation-country" content="index, follow" />
        <meta name="googlebot-translation-region" content="index, follow" />
        <meta name="googlebot-translation-variant" content="index, follow" />
        <meta name="googlebot-translation-variant-country" content="index, follow" />
        <meta name="googlebot-translation-variant-region" content="index, follow" />
        <meta name="googlebot-translation-variant-language" content="index, follow" />
        <meta name="googlebot-translation-variant-variant" content="index, follow" />
        <meta name="googlebot-translation-variant-variant-country" content="index, follow" />
        <meta name="googlebot-translation-variant-variant-region" content="index, follow" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1339539882255727"
          crossOrigin="anonymous"
        />
      </Head>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-PEF01PTY1T"
      />
      <Script>
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PEF01PTY1T');
          `}
      </Script>
      {/* <!-- End Google tag (gtag.js) --> */}
        <Header />
        <main className="container relative rounded-t mx-auto transition ease-in-out duration-500">
            {children}
        </main>
        <Subscribe />
        <Footer />
        
        <ScrollToTopButton />
        <ChatWithAIButton />
        <div className="h-16 z-10 fixed bottom-0 left-0 w-screen">
          <ConsentPreferenceLink />
        </div>
        <Script
          src="https://app.termly.io/embed.min.js"
          data-auto-block="off"
          data-website-uuid="6be0f015-e759-4ffd-8346-ebb290ddbdf9"
          async
        />
        <Script async src="https://assets.aweber-static.com/aweberjs/aweber.js" />
        <HelmetProvider>
        <Script type="text/javascript">
            {`
              var AWeber = window.AWeber || [];
              AWeber.push(function() {
                AWeber.WebPush.init(
                  'BPWeSrUv87tnPkdoNOpUlMTllSqJ-fyJCJlYT2eeU8M6fBSFwO4FfQWcU83SEte8wowpIdhAH2P19HJDkUuAmAc',
                  'a8f015e0-3041-4a1c-be7f-e8817369ba07',
                  '9b0f384d-00c7-46f4-b678-2d996e3f2e4a'
                );
              });
            `}
          </Script>
        </HelmetProvider>
    </div>
  );
};

export default Layout;