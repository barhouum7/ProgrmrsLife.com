import React, { useEffect, useState } from "react"
import { Layout } from "../sections"
import { ThemeProvider } from "next-themes"

import '../styles/globals.scss'
import '../styles/postDetail.css'
import 'tailwindcss/tailwind.css'



function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Layout>
          <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default MyApp
