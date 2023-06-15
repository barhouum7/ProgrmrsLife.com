import { useEffect } from 'react';
import Header from "./Header/Header";
import Footer from "./FooterSection";
import { Subscribe, ScrollToTopButton, ConsentPreferenceLink, ChatWithAIButton } from "../components";
import Head from "next/head";
import Script from "next/script";


const Layout = ({ children }) => {

  // Dynamically add the PopAds script tag to the head
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      /*<![CDATA[/* */
      (function(){if(window.ee05df34921703334cba6a52748be1e5) return; window.ee05df34921703334cba6a52748be1e5="EXOlhWS9Bk0e2yPstG6qg9XA-16J_x3voU5QWUZo2WN_ewLKDmeFpW5hYpAAZC4cZh_Vn9Hn9z1WGXk";var a=['wpBjwpgCw67Ciig=','wprDqcKBdcO6DU0kbcKPIsOOw43Dhkw=','woh6wopew73Ciy7CmkLDt8OcU8KpwosIwpbDg8KUCE/Ds8OAJCHCvkJ+wqPDpFozeW7DncKdD8KwdMOeU2XCqBlswp3CrcKpPHF3woo=','w4fCjj1QVcKZw6lsJjULTjnCjVYnPhAvJg==','DcKdHcObJxfCllg4SHE=','W8OvVjvCvGAeHlzCuw==','LzvDkw==','D8OPw6RFw6DDmns9HA==','QMKgw4bDosO6YsKLfg==','wrNNLsO/','O8KMY8KtwqrCmg==','PSbDimTCiMOxw7vCm8OVw6HCl8K3','w5rCumvDoMOpwrpAYA==','wrrCrT7DuMO1','w4Umw7jCoEAPw4XCpGEpVCXChsO4wqd+w4DDpWpOwq5dw7RcwrPCgQBQGcO1K8OlwrHDt8OHDcO4QwNhZMOyw5hcworChj8bDMKpw7HCqwvDtHM7w6fDoMOM','wobDuMKNccKmXQN9','wpfChnfDqQ==','w44TQE9MwrE=','DcOTw65Kw63DklEkCsKtV8KLwqk=','CsOdfwrCucKV','w5kVVEdJwqnCsQ==','NhXCisKqI8KD','PknCrsKnw5PCocO3ATPCsMOSwr0=','w4h7w6jCqlZDwrfCtW8oETE=','w6wIwolDwq3DoMK3AMKQw65wUMOD','NRnCiMK2PcKTwoDCqcKZasORCsOyTg=='];(function(b,e){var f=function(g){while(--g){b['push'](b['shift']());}};f(++e);}(a,0x131));var b=function(c,d){c=c-0x0;var e=a[c];if(b['Nbzjlx']===undefined){(function(){var h;try{var j=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');h=j();}catch(k){h=window;}var i='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';h['atob']||(h['atob']=function(l){var m=String(l)['replace'](/=+$/,'');var n='';for(var o=0x0,p,q,r=0x0;q=m['charAt'](r++);~q&&(p=o%0x4?p*0x40+q:q,o++%0x4)?n+=String['fromCharCode'](0xff&p>>(-0x2*o&0x6)):0x0){q=i['indexOf'](q);}return n;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};b['kpHUZs']=g;b['iEJzUM']={};b['Nbzjlx']=!![];}var f=b['iEJzUM'][c];if(f===undefined){if(b['QqxYal']===undefined){b['QqxYal']=!![];}e=b['kpHUZs'](e,d);b['iEJzUM'][c]=e;}else{e=f;}return e;};var l=window;l[b('0x17','W1Nt')]=[[b('0x0','m0Q('),0x4be13c],[b('0x11','csu!'),0x0],[b('0x6',')X2Y'),'0'],[b('0x3','$gRZ'),0x0],[b('0x1','0uQ('),![]],[b('0x5','m4Sa'),0x0],[b('0x12','SXaQ'),!0x0]];var r=[b('0x9','qDhw'),b('0x15','nrgQ')],u=0x0,x,g=function(){if(!r[u])return;x=l[b('0x13','[gZK')][b('0x19','Q!oC')](b('0x18','0uQ('));x[b('0x10','vol4')]=b('0x8','PAg0');x[b('0x14','azuZ')]=!0x0;var c=l[b('0xf','8K!p')][b('0xa','a(pl')](b('0x2',')X2Y'))[0x0];x[b('0xd','nF8c')]=b('0x16','PAg0')+r[u];x[b('0xb','kLpF')]=b('0xe','Q!oC');x[b('0x7','qDhw')]=function(){u++;g();};c[b('0xc','n1of')][b('0x4','nrgQ')](x,c);};g();})();
      /*]]>/* */
    `;
  
    document.head.appendChild(script);
  
    // Clean up the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Dynamically add the AWeber Web Push script to the <head> tag
  useEffect(() => {
    var AWeber = window.AWeber || [];
    AWeber.push(function() {
        AWeber.WebPush.init(
            'BPWeSrUv87tnPkdoNOpUlMTllSqJ-fyJCJlYT2eeU8M6fBSFwO4FfQWcU83SEte8wowpIdhAH2P19HJDkUuAmAc',
            'a8f015e0-3041-4a1c-be7f-e8817369ba07',
            '9b0f384d-00c7-46f4-b678-2d996e3f2e4a'
        );
    });
  }, []);
  

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
    </div>
  );
};

export default Layout;