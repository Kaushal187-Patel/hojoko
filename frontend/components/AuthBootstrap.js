'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { fetchCart } from '@/redux/slices/cartSlice';

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((result) => {
      if (result.payload) {
        dispatch(fetchCart());
      }
    });
  }, [dispatch]);

  return children;
}
