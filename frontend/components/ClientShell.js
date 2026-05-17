'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import AnnouncementBar from '@/components/AnnouncementBar';
import AuthBootstrap from '@/components/AuthBootstrap';
import AuthModalGate from '@/components/auth/AuthModalGate';
import CartDrawer from '@/components/CartDrawer';
import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import StoreProvider from '@/redux/StoreProvider';

const Toaster = dynamic(() => import('react-hot-toast').then((module) => module.Toaster), {
  ssr: false,
});

export default function ClientShell({ children }) {
  return (
    <StoreProvider>
      <AuthBootstrap>
        <AnnouncementBar />
        <Suspense fallback={<header className="site-header" aria-hidden />}>
          <Navbar />
        </Suspense>
        <main className="main-shell">{children}</main>
        <AuthModalGate />
        <CartDrawer />
        <Footer />
        <CookieConsent />
        <Toaster position="top-right" />
      </AuthBootstrap>
    </StoreProvider>
  );
}
