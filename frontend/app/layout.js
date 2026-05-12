import { Cormorant_Garamond, Inter } from 'next/font/google';
import '@/styles/globals.css';
import ClientShell from '@/components/ClientShell';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata = {
  title: 'HOZOKO | Modern Ecommerce',
  description: 'Curated fashion and lifestyle essentials with a calm, editorial shopping experience.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
