'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { acceptCookieConsent, hasCookieConsent } from '@/utils/cookieConsent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieConsent());
  }, []);

  const handleAccept = () => {
    acceptCookieConsent();
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="cookie-consent" role="dialog" aria-labelledby="cookie-consent-title" aria-live="polite">
      <div className="cookie-consent-inner">
        <div className="cookie-consent-copy">
          <p id="cookie-consent-title" className="cookie-consent-title">
            We use cookies
          </p>
          <p className="cookie-consent-text">
            HOZOKO stores cookies on your device to remember your cart, recently viewed products, and sign-in
            session. By clicking Accept, you agree to our use of cookies. See our{' '}
            <Link href="/support" className="cookie-consent-link">
              help center
            </Link>{' '}
            for more.
          </p>
        </div>
        <button type="button" className="btn-primary cookie-consent-btn" onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );
}
