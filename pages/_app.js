import React, { useEffect, useState } from "react"
import { Layout } from "../sections"
import { ThemeProvider } from "next-themes"
import { HelmetProvider } from 'react-helmet-async';

import '../styles/globals.scss'
import '../styles/postDetail.css'
import '../styles/scrollbar.css'
import 'tailwindcss/tailwind.css'



function MyApp({ Component, pageProps }) {
  return (
    <HelmetProvider>
      <ThemeProvider enableSystem={true} attribute="class">
        <Layout>
            <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default MyApp
