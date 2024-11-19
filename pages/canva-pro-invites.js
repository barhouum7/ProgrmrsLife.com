import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { CanvaLinks } from '../components';
import { AdUnit } from '../components';

const CanvaLinksPage = () => {
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

            <div className="container mx-auto px-4 md:px-10 py-8">

                <AdUnit
                    client="ca-pub-5021308603136043"
                    slot="3167248456"
                />

                <motion.div variants={fadeInUp}>
                    <CanvaLinks />
                </motion.div>

                <motion.div variants={fadeInUp} className="mt-8">
                    <AdUnit
                        client="ca-pub-5021308603136043"
                        slot="3167248456"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CanvaLinksPage;