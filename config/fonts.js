import { IBM_Plex_Sans, Roboto_Mono, Source_Code_Pro, Fira_Sans, Open_Sans, Playfair_Display, Lora, Source_Sans_Pro, Merriweather, Libre_Baskerville, Cormorant_Garamond } from 'next/font/google'

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

const playfairDisplay = Playfair_Display({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const lora = Lora({ 
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const sourceSansPro = Source_Sans_Pro({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const merriweather = Merriweather({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const fonts = {
  'IBM Plex Sans': ibmPlexSans,
  'Roboto Mono': robotoMono,
  'Source Code Pro': sourceCodePro,
  'Fira Sans': firaSans,
  'Open Sans': openSans,
  'Playfair Display': playfairDisplay,
  'Lora': lora,
  'Source Sans Pro': sourceSansPro,
  'Merriweather': merriweather,
  'Libre Baskerville': libreBaskerville,
  'Cormorant Garamond': cormorantGaramond
};

export const defaultFont = ibmPlexSans;
export const postContentFont = libreBaskerville;
