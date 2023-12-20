import { useState, useEffect } from "react";
import Header from "./Header/Header";
import Footer from "./FooterSection";
import { Subscribe, ScrollToTopButton, ConsentPreferenceLink, ChatWithAIButton } from "../components";
import Head from "next/head";
import Script from "next/script";


// // Make HeartAnimation effect
function makeHeartAnimation () {
  var brd = document.createElement("DIV");
		document.body.insertBefore(brd, document.body.firstChild);

		const duration = 3000;
		const speed = 0.5;
		const cursorXOffset = 0;
		const cursorYOffset = -5;

		var hearts = [];
		
		function generateHeart(x, y, xBound, xStart, scale)
		{
			var heart = document.createElement("DIV");
			heart.setAttribute('class', 'heart');
			brd.appendChild(heart);
			heart.time = duration;
			heart.x = x;
			heart.y = y;
			heart.bound = xBound;
			heart.direction = xStart;
			heart.style.left = heart.x + "px";
			heart.style.top = heart.y + "px";
			heart.scale = scale;
			heart.style.transform = "scale(" + scale + "," + scale + ")";
			if(hearts == null)
				hearts = [];
			hearts.push(heart);
			return heart;
		}

		var down = false;
		var event = null;

		document.onmousedown = function(e) {
			down = true;
			event = e;
		}

		document.onmouseup = function(e) {
			down = false;
		}

		document.onmousemove = function(e) {
			event = e;
		}

		document.ontouchstart = function(e) {
			down = true;
			event = e.touches[0];
		}

		document.ontouchend = function(e) {
			down = false;
		}

		document.ontouchmove = function(e) {
			event = e.touches[0];
		}

		var before = Date.now();
		var id = setInterval(frame, 5);
		var gr = setInterval(check, 100);

		function frame()
		{
			var current = Date.now();
			var deltaTime = current - before;
			before = current;
			for(var i in hearts)
			{
				var heart = hearts[i];
				heart.time -= deltaTime;
				if(heart.time > 0)
				{
					heart.y -= speed;
					heart.style.top = heart.y + "px";
					heart.style.left = heart.x + heart.direction * heart.bound * Math.sin(heart.y * heart.scale / 30) / heart.y * 200 + "px";
				}
				else
				{
					heart.parentNode.removeChild(heart);
					hearts.splice(i, 1);
				}
			}
		}

		function check()
		{
			if(down)
			{
				var start = 1 - Math.round(Math.random()) * 2;
				var scale = Math.random() * Math.random() * 0.8 + 0.2;
				var bound = 30 + Math.random() * 20;
				generateHeart(event.pageX - brd.offsetLeft + cursorXOffset, event.pageY - brd.offsetTop + cursorYOffset, bound, start, scale);
			}
		}
}

const Layout = ({ children }) => {

  useEffect(() => {
    makeHeartAnimation();
  }, []);

  useEffect(() => {
        const stickyShareButton = document.querySelectorAll('.st-sticky-share-buttons .st-btn');
        if (stickyShareButton) {
            stickyShareButton.forEach((button) => {
                button.style.height = '46px';
            });
        }
  }, []);

  // if (typeof window !== "undefined") {
  //   window.document.querySelector("html").addEventListener("copy", (e) => {
  //     e.preventDefault();
  //     e.clipboardData.setData("text/plain", "Copying is not allowed.");
  //   });
  // }


  // Announcement Banner
  const [showBanner, setShowBanner] = useState(true);
  const [closeBanner, setCloseBanner] = useState(false);

    const handleCloseBanner = () => {
      setCloseBanner(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 500);
    };

    const bannerStyle = {
      background: showBanner
      ? 'linear-gradient(to left, #FFC900, #FF6C00)' // Darker yellow gradient
      : 'none', // No background
      transition: 'all 0.5s', // Smooth transition
    };
    
  return (
    <div>
      <Head>
        {/* UserWay Script */}
      <script>
      {`
          (function(d){
            var s = d.createElement('script');
            /* uncomment the following line to override default position*/
            s.setAttribute('data-position', 3);
            /* uncomment the following line to override default size (values: small, large)*/
            /* s.setAttribute('data-size', 'small');*/
            /* uncomment the following line to override default language (e.g., fr, de, es, he, nl, etc.)*/
            s.setAttribute('data-language', 'language');
            /* uncomment the following line to override color set via widget (e.g., #053f67)*/
            /* s.setAttribute('data-color', '#053e67');*/
            /* uncomment the following line to override type set via widget (1=person, 2=chair, 3=eye, 4=text)*/
            /* s.setAttribute('data-type', '1');*/
            /* s.setAttribute('data-statement_text:', 'Our Accessibility Statement');*/
            /* s.setAttribute('data-statement_url', 'http://www.example.com/accessibility');*/
            /* uncomment the following line to override support on mobile devices*/
            s.setAttribute('data-mobile', true);
            /* uncomment the following line to set custom trigger action for accessibility menu*/
            /* s.setAttribute('data-trigger', 'triggerId')*/
            s.setAttribute('data-account', 'qvONRLOSyv');
            s.setAttribute('src', 'https://cdn.userway.org/widget.js');
            (d.body || d.head).appendChild(s);
          })(document)
      `}
      </script>
        <noscript>Please ensure Javascript is enabled for purposes of <a href="https://userway.org">website accessibility</a></noscript>
        <title>ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News</title>
        <link rel="icon" href="/imgs/favicon.svg" />
        <meta name="description" content="ProgrammersLife is a blog about programming, web development, and tech in general. We write about the latest technologies, frameworks, and libraries. We also write about the latest news in the tech world." />
        <meta name="keywords" content="programming, web development, tech, latest technologies, frameworks, libraries, latest news, tech world" />
        <meta name="author" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <meta property="og:title" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta property="og:description" content="ProgrammersLife is a blog about programming, web development, and tech in general. We write about the latest technologies, frameworks, and libraries. We also write about the latest news in the tech world." />
        <meta property="og:image" content="/imgs/logo0.png" />
        <meta property="og:url" content="https://progrmrslife.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
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
        <meta name="twitter:title" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="twitter:description" content="ProgrammersLife is a blog about programming, web development, and tech in general. We write about the latest technologies, frameworks, and libraries. We also write about the latest news in the tech world." />
        <meta name="twitter:image" content="/imgs/logo0.png" />
        <meta name="twitter:image:alt" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="twitter:domain" content="https://progrmrslife.com/" />
        <meta name="twitter:app:country" content="US" />
        <meta name="twitter:app:name:iphone" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="twitter:app:id:iphone" content="id1520000000" />
        <meta name="twitter:app:url:iphone" content="https://progrmrslife.com/" />
        <meta name="twitter:app:name:ipad" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="twitter:app:id:ipad" content="id1520000000" />
        <meta name="twitter:app:url:ipad" content="https://progrmrslife.com/" />
        <meta name="twitter:app:name:googleplay" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="twitter:app:id:googleplay" content="com.programmerslife" />
        <meta name="twitter:app:url:googleplay" content="https://progrmrslife.com/" />
        <meta name="twitter:app:country" content="US" />
        <meta name="twitter:app:name:iphone" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="twitter:app:id:iphone" content="id1520000000" />

        <meta name="facebook:card" content="summary" />
        <meta name="facebook:site" content="@programmerslife" />
        <meta name="facebook:creator" content="@programmerslife" />
        <meta name="facebook:title" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="facebook:description" content="ProgrammersLife is a blog about programming, web development, and tech in general. We write about the latest technologies, frameworks, and libraries. We also write about the latest news in the tech world." />
        <meta name="facebook:image" content="/imgs/logo0.png" />
        <meta name="facebook:image:alt" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="facebook:domain" content="https://progrmrslife.com/" />
        <meta name="facebook:app:country" content="US" />
        <meta name="facebook:app:name:iphone" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />

        <meta name="apple-mobile-web-app-title" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="application-name" content="ProgrammersLife - Your Guide to Web Development, Tips & Tricks and Tech News" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/imgs/logo0.png" />

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
        <meta name="google-adsense-account" content="ca-pub-1339539882255727" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1339539882255727"
          crossorigin="anonymous"></script>

        {/* // Code from AdSense */}
        {/* <script 
          id="adsbygoogle-init"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1339539882255727"
        ></script> */}
      </Head>
      
      {/* Announcement Banner */}
      
      {
        showBanner && (
          <div className="relative top-0 z-20">
            <div
              id="flash-div"
              className={`absolute z-20 inset-0 bg-black bg-opacity-20 shadow-2xl -top-20 rounded-full banner-flash-animation
                ${closeBanner ? 'hidden' : 'block'}
              `}
            ></div>
              <div 
              style={bannerStyle}
              className={`bg-yellow-500 text-white text-xs sm:text-sm fixed top-0 left-0 right-0 z-10 ${
                closeBanner ? 'p-0 transition-all duration-500' : 'p-3'
              }`}
              >
                    <div className="flex container mx-auto justify-center text-center z-50">
                    <p>
                    Our website has moved to{' '}
                    <a href="https://progrmrslife.com" className="underline">
                        progrmrslife.com
                    </a>
                    . Please update your bookmarks.
                    </p>
                    <button
                    className="ml-2 px-3 py-1 rounded-md bg-yellow-600 hover:bg-opacity-80 transition-colors duration-300"
                    onClick={handleCloseBanner}
                    >
                    Close
                    </button>
                </div>
              </div>
          </div>
        )
      }
        <Header showBanner={showBanner} />
        <main className="container relative rounded-t mx-auto transition ease-in-out duration-500">
            {children}
        </main>
        <Subscribe />
        <Footer />
        
        <ScrollToTopButton />
        <ChatWithAIButton />
        {/* <div className="h-16 z-10 fixed bottom-0 left-0 w-screen">
          <ConsentPreferenceLink />
        </div> */}
    </div>
  );
};

export default Layout;