import { Cormorant_Garamond, Inter } from 'next/font/google';
import '@/styles/globals.css';
import ClientShell from '@/components/ClientShell';
import { SITE_TAGLINE } from '@/utils/brand';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: `HOZOKO | ${SITE_TAGLINE}`,
  description: SITE_TAGLINE,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
