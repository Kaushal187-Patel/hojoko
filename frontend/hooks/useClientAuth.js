'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * Avoids hydration mismatch: server and first client paint use logged-out UI
 * until mount + fetchCurrentUser complete.
 */
export default function useClientAuth() {
  const [mounted, setMounted] = useState(false);
  const { user, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ready = mounted && initialized;
  const sessionUser = ready ? user : null;

  return {
    user: sessionUser,
    ready,
    isAuthenticated: Boolean(sessionUser),
    storeUser: user,
  };
}
