export const COOKIE_CONSENT_KEY = 'hozoko_cookie_consent';
const CONSENT_MAX_AGE_DAYS = 365;

function readCookie(name) {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function hasCookieConsent() {
  return readCookie(COOKIE_CONSENT_KEY) === 'accepted';
}

export function acceptCookieConsent() {
  if (typeof document === 'undefined') {
    return;
  }

  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

  document.cookie = `${COOKIE_CONSENT_KEY}=accepted; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}
