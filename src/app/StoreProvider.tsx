'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppStore } from 'web/lib/state/store';
import { loadStoredAuthToken } from 'web/lib/auth/tokenStorage';
import { setCredentials } from 'web/lib/state/slices/authSlice';

type StoreProviderProps = {
  children: ReactNode;
  initialToken?: string | null;
};

const buildPreloadedState = (token?: string | null) => {
  if (!token) {
    return undefined;
  }

  return {
    auth: {
      token,
      user: null,
    },
  };
};

export default function StoreProvider({ children, initialToken }: StoreProviderProps) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore(buildPreloadedState(initialToken));
  }

  useEffect(() => {
    const storedToken = loadStoredAuthToken();
    const state = storeRef.current?.getState();
    if (storedToken && state && !state.auth.token) {
      storeRef.current?.dispatch(setCredentials({ token: storedToken }));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
