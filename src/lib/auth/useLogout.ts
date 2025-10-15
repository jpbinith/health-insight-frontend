'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from '../state/hooks';
import { clearCredentials, setRememberPreference } from '../state/slices/authSlice';
import { clearAuthToken } from './tokenStorage';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useCallback(() => {
    clearAuthToken();
    dispatch(clearCredentials());
    dispatch(setRememberPreference(false));
    router.push('/login');
  }, [dispatch, router]);
};
