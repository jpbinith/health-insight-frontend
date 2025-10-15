'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { makeStore, type AppStore } from 'web/lib/state/store';
import { loadRememberPreference, loadStoredAuthToken } from 'web/lib/auth/tokenStorage';
import { setCredentials, setRememberPreference } from 'web/lib/state/slices/authSlice';

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
      remember: false,
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
    const remember = loadRememberPreference();
    const state = storeRef.current?.getState();
    if (!state) {
      return;
    }

    if (remember !== state.auth.remember) {
      storeRef.current?.dispatch(setRememberPreference(remember));
    }

    if (storedToken && !state.auth.token) {
      storeRef.current?.dispatch(setCredentials({ token: storedToken }));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
