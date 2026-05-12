'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { fetchCart } from '@/redux/slices/cartSlice';

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }

    hasBootstrapped.current = true;

    dispatch(fetchCurrentUser())
      .unwrap()
      .then(() => dispatch(fetchCart()))
      .catch(() => {});
  }, [dispatch]);

  return children;
}
