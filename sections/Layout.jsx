import React, { useState, useEffect } from "react";
import Header from "./Header/Header";
import Footer from "./FooterSection";
import { Subscribe, ScrollToTopButton, ConsentPreferenceLink, ChatWithAIButton, AdSupportModal, VersionNotifier, AdBlockWarning } from "../components";
import Head from "next/head";
import Script from "next/script";
import checkAdBlocker from "../scripts/adBlockDetector";
import PropTypes from 'prop-types';
import Link from "next/link";
import { useRouter } from "next/router";
import PacmanLoader from "react-spinners/PacmanLoader";


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

		function check() {
      if (down && !isMouseOverInteractiveElement(event)) {
        var start = 1 - Math.round(Math.random()) * 2;
        var scale = Math.random() * Math.random() * 0.8 + 0.2;
        var bound = 30 + Math.random() * 20;
        generateHeart(event.pageX - brd.offsetLeft + cursorXOffset, event.pageY - brd.offsetTop + cursorYOffset, bound, start, scale);
      }
    }

    function isMouseOverInteractiveElement(event) {
      if (event && event.target) {
        var element = event.target;
        
        // Traverse up the DOM tree until finding an interactive elements
        // Check if the element or any of its parents are interactive
        while (element) {
          var tagName = element.tagName;
          if (
            tagName === 'BUTTON' ||
            tagName === 'A' ||
            tagName === 'INPUT' ||
            tagName === 'TEXTAREA' ||
            tagName === 'SELECT'
          ) {
            return true;
          }
          // Add more elements and their sub-elements as needed
          // Example: if (tagName === 'DIV' && element.classList.contains('exclude-hearts')) { return true; }
          
          element = element.parentElement;
        }
      }
      return false;
    }
}

const Layout = ({ children }) => {
  
  const router = useRouter();

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

    const [isAdBlockerEnabled, setIsAdBlockerEnabled] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
      const detectAdBlocker = async () => {
        try {
          // Initial delay to let the page load
          await new Promise(resolve => setTimeout(resolve, 1000));
          const isBlocked = await checkAdBlocker();
          setIsAdBlockerEnabled(isBlocked);
          setHasChecked(true);
    
          // Recheck after a short delay to catch delayed shields
          setTimeout(async () => {
            const recheckBlocked = await checkAdBlocker();
            setIsAdBlockerEnabled(recheckBlocked);
          }, 2000);
        } catch (error) {
          console.error('Error detecting ad blocker:', error);
          setIsAdBlockerEnabled(true);
          setHasChecked(true);
        }
      };
    
      detectAdBlocker();
    
      // Check again when window gains focus
      const handleFocus = () => detectAdBlocker();
      window.addEventListener('focus', handleFocus);
      window.addEventListener('visibilitychange', handleFocus);
    
      return () => {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('visibilitychange', handleFocus);
      };
    }, []);

    // Add CSS to detect ad blockers
    useEffect(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        .adsbox {
          position: absolute;
          top: -1px;
          left: -1px;
          height: 1px !important;
          width: 1px !important;
          background: transparent !important;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }, []);

    if (!hasChecked) {
      return <div className="min-h-screen flex items-center justify-center">
        <PacmanLoader
          color={"#FFF9"}
          loading={true}
          size={20}
          aria-label="Loading spinner"
          data-testid="loader"
        />
      </div>;
    }

    if (isAdBlockerEnabled) {
      return <AdBlockWarning />;
    }

  
    // useEffect(() => {
    //   const initAdsense = () => {
    //     try {
    //       const ads = document.getElementsByClassName("adsbygoogle");
    //       if (window.adsbygoogle && ads.length > 0) {
    //         for (let i = 0; i < ads.length; i++) {
    //           (adsbygoogle = window.adsbygoogle || []).push({});
    //         }
    //       }
    //     } catch (error) {
    //       console.error('Error initializing AdSense:', error);
    //     }
    //   };
  
    //   if (document.readyState === 'complete') {
    //     initAdsense();
    //   } else {
    //     window.addEventListener('load', initAdsense);
    //     return () => window.removeEventListener('load', initAdsense);
    //   }
    // }, []);


    // useEffect(() => {
    //   const initAdsense = () => {
    //     try {
    //       if (typeof window !== 'undefined' && window.adsbygoogle) {
    //         window.adsbygoogle = window.adsbygoogle || [];
    //         window.adsbygoogle.push({
    //           google_ad_client: "ca-pub-5021308603136043",
    //           enable_page_level_ads: true
    //         });
    //       }
    //     } catch (error) {
    //       console.error('Error initializing AdSense:', error);
    //     }
    //   };
    
    //   if (document.readyState === 'complete') {
    //     initAdsense();
    //   } else {
    //     window.addEventListener('load', initAdsense);
    //     return () => window.removeEventListener('load', initAdsense);
    //   }
    // }, []);

  return (
    <div>
      <Head>
        <link rel="icon" href="/icons/favicon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-128x128.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="canonical" href={`https://www.progrmrslife.com${router.asPath}`} />
        <meta name="theme-color" content="#60A5FA" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="detect-adblock" content="technical" />

        {/* <meta name="google-adsense-account" content="ca-pub-1339539882255727" /> */}
        <meta name="google-adsense-account" content="ca-pub-5021308603136043" />

      </Head>
        {/* Schema markup  */}
        <Script id="schema-script" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ProgrmrsLife",
              "url": "https://www.progrmrslife.com/",
              "description": "Explore programming, web development, and tech insights with ProgrmrsLife. Get the latest tips, tutorials, and news in the tech world."
            }
          `}
        </Script>

        <VersionNotifier />
      
        <Header/>
        <main className={`min-h-screen relative rounded-t px-2 dark:bg-gray-900 shadow-md bg-indigo-100`}>
            <h1 className="sr-only">ProgrmrsLife - Web Development and Tech Insights</h1>
            {/* <div className="mt-4">
              <Search />
            </div> */}
            {children}
            <AdSupportModal />
        </main>
        <Subscribe />
        <Footer />
        
        <ScrollToTopButton />
        <ChatWithAIButton />
        {/* <div className="h-16 z-10 fixed bottom-0 left-0 w-screen">
          <ConsentPreferenceLink />
        </div> */}

      {/* Start of All Scripts */}

      {/* // Code from AdSense */}
      <Script 
        id="adsbygoogle-init"
        crossOrigin="anonymous"
        async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5021308603136043"
        // src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1339539882255727"
        loading="lazy"
      />


      {/* End of All Scripts */}
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  showBanner: PropTypes.bool,
  closeBanner: PropTypes.bool,
  handleCloseBanner: PropTypes.func,
  bannerStyle: PropTypes.object,
};

export default Layout;