'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from '../state/hooks';
import { clearCredentials } from '../state/slices/authSlice';
import { clearAuthToken } from './tokenStorage';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useCallback(() => {
    clearAuthToken();
    dispatch(clearCredentials());
    router.push('/login');
  }, [dispatch, router]);
};
