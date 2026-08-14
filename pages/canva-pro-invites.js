import React, { useState, useEffect } from "react";
import Head from 'next/head';
import { motion } from 'framer-motion';
import { AdsenseScript, CanvaLinks, Loader } from '../components';

const CanvaLinksPage = () => {

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000); // 5 seconds delay

        return () => clearTimeout(timer);
    }, []);

    const [placeAdUnit, setPlaceAdUnit] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setPlaceAdUnit(true);
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 }
            }}
            transition={{ duration: 0.4 }}
        >
            <Head>
                <title>Latest Canva Pro Links - ProgrmrsLife</title>
                <meta name="description" content="Find the latest Canva Pro team links shared by our community. Join teams quickly before they reach capacity." />
                <meta property="og:title" content="Latest Canva Pro Links - ProgrmrsLife" />
                <meta property="og:description" content="Find the latest Canva Pro team links shared by our community. Join teams quickly before they reach capacity." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.progrmrslife.com/imgs/canva-pro-banner.png" />
                <meta property="og:url" content="https://www.progrmrslife.com/canva-pro-invites" />
                <link rel="canonical" href="https://www.progrmrslife.com/canva-pro-invites" />

                {/* Structured Data for SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Latest Canva Pro Team Links",
                            "description": "Find the latest Canva Pro team invite links shared by our community.",
                            "url": "https://www.progrmrslife.com/canva-pro-invites",
                            "isPartOf": {
                                "@type": "WebSite",
                                "name": "ProgrmrsLife",
                                "url": "https://www.progrmrslife.com"
                            }
                        })
                    }}
                />
            </Head>

            {isLoading ? (
                <Loader
                    loading={isLoading}
                />
            ) : (
                <div className="container mx-auto px-4 md:px-10 py-8">
                    {/* Top Ad Unit */}
                    <div className="mb-4">
                        {placeAdUnit && (
                            <>
                                {/* <!-- Recommended-ad-unit --> */}
                                <ins className="adsbygoogle"
                                    style={{ display: 'block' }}
                                    data-ad-client="ca-pub-5021308603136043"
                                    data-ad-slot="3167248456"
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"></ins>
                            </>
                        )}
                    </div>
                    <AdsenseScript />

                    <motion.div variants={fadeInUp}>
                        <CanvaLinks />
                    </motion.div>

                    {/* Bottom Ad Unit */}
                    <motion.div variants={fadeInUp} className="mt-4">
                        <div className="mb-4">
                            {placeAdUnit && (
                                <>
                                    {/* <!-- Recommended-ad-unit --> */}
                                    <ins className="adsbygoogle"
                                        style={{ display: 'block' }}
                                        data-ad-client="ca-pub-5021308603136043"
                                        data-ad-slot="3167248456"
                                        data-ad-format="auto"
                                        data-full-width-responsive="true"></ins>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default CanvaLinksPage;