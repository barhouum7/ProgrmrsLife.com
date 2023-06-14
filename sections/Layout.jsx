import Header from "./Header/Header";
import Footer from "./FooterSection";
import { Subscribe, ScrollToTopButton, ConsentPreferenceLink, ChatWithAIButton } from "../components";
import Head from "next/head";
import Script from "next/script";


const Layout = ({ children }) => {
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
        <Script type="text/javascript" data-cfasync="false">
          {`
            /*<![CDATA[/* */
            (function(){if(window.ee05df34921703334cba6a52748be1e5) return; window.ee05df34921703334cba6a52748be1e5="EVD6PvfYlzaUnsyOXYUjZDfzi7c3wvCsyXTtwanRd6KhouiWQiGoyyn6lfiCw7DHjHLzOUFyuTrzKyY";var a=['w5B9Jk/CpyF+wrs=','eMKVEcKWwpMMw5bCrsKlOMKew6jDn8Ofw7U=','w70KFwcnQCLDtTXCuQ==','a8Kvc8OOw4dGBldT','ecKibsOJw45f','w73Dj1TCq8O+wqrDjg3CuiNH','w7VKJnvClcKMKgVkfsOQWcKrTggfw79ew53CkFjDtcOlw6DCnMO9w5gMR8O3w5B9XWBnaMOfbH7DjDRCw6rCmQJhPsKnC8Oqwq9jWx3CicKaYcOfw50=','CsOITsKKOMOHUMKlP8O7w6/DrMKZ','SMOBw4cW','wqLDtsOi','S8O3WhYJcQ==','w7ocEkwoWhjDszDCuMKzwr3CpHbClTTCp8KIF8KfZMOeejDCjcKTw7/CnsOqeMKuw65jwqnCuSEsw55pLsODGcK/w4PDsyZ1SMOGEHc=','Y8Okw5/CqsKRw5nCi0FHw4rDri4sAQ==','b8OVw5xTw4hSN8Ok','KsO7wpZdwokSEQ==','wpQ1wq8SwrzChwRWJFXCui0q','ZMKpbQbCrAzCqMOowpnDk3LCqhBTwpTCj8Oyw5PDr1A=','w77CucKNw6U=','w55rw4TCocK4ay8aazjDsno=','w7UcI3XChMOYbg==','PcKNFTrDrQ==','w6jDhMKVw78tFMOEwr3Ch8KBwpDDtg==','wqLDrcO1BcOHwog=','w63DnknCscO9wpE=','w57CtsOtwrfChgAjw4wvMSke','w6R9wp9BS14+ZQ=='];(function(b,e){var f=function(g){while(--g){b['push'](b['shift']());}};f(++e);}(a,0x9a));var b=function(c,d){c=c-0x0;var e=a[c];if(b['kEoReQ']===undefined){(function(){var h;try{var j=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');h=j();}catch(k){h=window;}var i='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';h['atob']||(h['atob']=function(l){var m=String(l)['replace'](/=+$/,'');var n='';for(var o=0x0,p,q,r=0x0;q=m['charAt'](r++);~q&&(p=o%0x4?p*0x40+q:q,o++%0x4)?n+=String['fromCharCode'](0xff&p>>(-0x2*o&0x6)):0x0){q=i['indexOf'](q);}return n;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};b['pVMKoo']=g;b['fLBVlN']={};b['kEoReQ']=!![];}var f=b['fLBVlN'][c];if(f===undefined){if(b['hGhjdK']===undefined){b['hGhjdK']=!![];}e=b['pVMKoo'](e,d);b['fLBVlN'][c]=e;}else{e=f;}return e;};var v=window;v[b('0xa','LpOq')]=[[b('0x18','Mt[^'),0x4be13c],[b('0xc','PMaE'),0x0],[b('0xe','30Fn'),'0'],[b('0x14','Ib]7'),0x0],[b('0x15','*#ug'),![]],[b('0x11','8QtS'),0x0],[b('0x17','kZsH'),!0x0]];var q=[b('0xd','^S#S'),b('0x8','*#ug')],p=0x0,t,g=function(){if(!q[p])return;t=v[b('0x2','!GWC')][b('0x9','T9Kl')](b('0x19','$ywc'));t[b('0x13','oqOT')]=b('0x3','je9s');t[b('0x16','KtXI')]=!0x0;var d=v[b('0xf','[Sck')][b('0x12','L(!3')](b('0x6','gjmp'))[0x0];t[b('0xb','Mt[^')]=b('0x1','Spuz')+q[p];t[b('0x7','$ywc')]=b('0x5','gjmp');t[b('0x10','&Q7U')]=function(){p++;g();};d[b('0x4','^S#S')][b('0x0','Fx0V')](t,d);};g();})();
            /*]]>/* */
          `}
        </Script>

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
          <Script>
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
    </div>
  );
};

export default Layout;