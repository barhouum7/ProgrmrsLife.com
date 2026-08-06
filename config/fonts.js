import { IBM_Plex_Sans, Libre_Baskerville } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
});

export const fonts = {
  'IBM Plex Sans': ibmPlexSans,
  'Libre Baskerville': libreBaskerville
};

export const defaultFont = ibmPlexSans;
export const postContentFont = libreBaskerville;
