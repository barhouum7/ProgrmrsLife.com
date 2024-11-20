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


    // Fade in animation for the component
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 }
            }}
            transition={{ duration: 0.5 }}
        >
            <Head>
                <title>Latest Canva Pro Links - ProgrmrsLife</title>
                <meta name="description" content="Find the latest Canva Pro team links shared by our community. Join teams quickly before they reach capacity." />
                <meta property="og:title" content="Latest Canva Pro Links - ProgrmrsLife" />
                <meta property="og:description" content="Find the latest Canva Pro team links shared by our community. Join teams quickly before they reach capacity." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.progrmrslife.com/icons/icon-512x512.png" />
                <meta property="og:url" content="https://www.progrmrslife.com/canva-links" />
            </Head>

            {isLoading ? (
                <Loader
                    loading={isLoading}
                />
            ) : (
                <div className="flex py-8">
                    <div className="flex-1 container mx-auto px-4 md:px-10 py-8">
                        <div className="mb-4">
                            {
                            placeAdUnit && (
                                <>
                                {/* <!-- Recommended-ad-unit --> */}
                                {/* <ins className="adsbygoogle"
                                style={{ display: 'block' }}
                                data-ad-client="ca-pub-1339539882255727"
                                data-ad-slot="9618957531"
                                data-ad-format="auto"
                                data-full-width-responsive="true"></ins> */}

                                {/* <!-- Recommended-ad-unit --> */}
                                <ins className="adsbygoogle"
                                style={{ display: 'block' }}
                                data-ad-client="ca-pub-5021308603136043"
                                data-ad-slot="3167248456"
                                data-ad-format="auto"
                                data-full-width-responsive="true"></ins>
                            </>
                            )
                            }
                        </div>
                        <AdsenseScript />

                        <motion.div variants={fadeInUp}>
                            <CanvaLinks />
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mt-4">
                            <div className="mb-4">
                                {
                                    placeAdUnit && (
                                        <>
                                        {/* <!-- Recommended-ad-unit --> */}
                                        {/* <ins className="adsbygoogle"
                                        style={{ display: 'block' }}
                                        data-ad-client="ca-pub-1339539882255727"
                                        data-ad-slot="9618957531"
                                        data-ad-format="auto"
                                        data-full-width-responsive="true"></ins> */}

                                        {/* <!-- Recommended-ad-unit --> */}
                                        <ins className="adsbygoogle"
                                        style={{ display: 'block' }}
                                        data-ad-client="ca-pub-5021308603136043"
                                        data-ad-slot="3167248456"
                                        data-ad-format="auto"
                                        data-full-width-responsive="true"></ins>
                                    </>
                                )
                                }
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side ad */}
                    <div className="hidden lg:block w-fit py-20 sticky top-20 -ml-8">
                        {placeAdUnit && (
                            <>
                                {/* <!-- Recommended-ad-unit --> */}
                                {/* <ins className="adsbygoogle"
                                style={{ display: 'block' }}
                                data-ad-client="ca-pub-1339539882255727"
                                data-ad-slot="9618957531"
                                data-ad-format="auto"
                                data-full-width-responsive="true"></ins> */}

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
                </div>
            )}
        </motion.div>
    );
};

export default CanvaLinksPage;