import { IBM_Plex_Sans, Roboto_Mono, Source_Code_Pro, Fira_Sans, Open_Sans } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const firaSans = Fira_Sans({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const openSans = Open_Sans({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const fonts = {
  'IBM Plex Sans': ibmPlexSans,
  'Roboto Mono': robotoMono,
  'Source Code Pro': sourceCodePro,
  'Fira Sans': firaSans,
  'Open Sans': openSans,
};

export const defaultFont = ibmPlexSans;
