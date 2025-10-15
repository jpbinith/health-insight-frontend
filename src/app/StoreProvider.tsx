'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { useRouter } from 'next/navigation';

import { makeStore, type AppStore } from 'web/lib/state/store';
import {
  clearAuthToken,
  loadRememberPreference,
  loadStoredAuthToken,
  loadStoredTokenExpiry,
  persistAuthToken,
} from 'web/lib/auth/tokenStorage';
import {
  clearCredentials,
  setCredentials,
  setRememberPreference,
  setTokenExpiry,
} from 'web/lib/state/slices/authSlice';
import { getTokenExpiry } from 'web/lib/auth/jwt';

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
      expiresAt: null,
    },
  };
};

export default function StoreProvider({ children, initialToken }: StoreProviderProps) {
  const router = useRouter();
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore(buildPreloadedState(initialToken));
  }

  useEffect(() => {
    const storedToken = loadStoredAuthToken();
    const storedExpiry = loadStoredTokenExpiry();
    const remember = loadRememberPreference();
    const state = storeRef.current?.getState();
    if (!state) {
      return;
    }

    if (remember !== state.auth.remember) {
      storeRef.current?.dispatch(setRememberPreference(remember));
    }

    const nextToken = storedToken ?? state.auth.token;
    const nextExpires =
      storedExpiry ??
      state.auth.expiresAt ??
      (nextToken ? getTokenExpiry(nextToken) : null);

    if (nextToken && (!state.auth.token || state.auth.token !== nextToken)) {
      storeRef.current?.dispatch(
        setCredentials({
          token: nextToken,
          user: state.auth.user,
          remember,
          expiresAt: nextExpires ?? undefined,
        })
      );
    } else if (typeof nextExpires === 'number' && nextExpires !== state.auth.expiresAt) {
      storeRef.current?.dispatch(setTokenExpiry(nextExpires));
    }

    if (nextToken) {
      persistAuthToken(nextToken, { remember, expiresAt: nextExpires ?? null });
    }
  }, []);

  useEffect(() => {
    const store = storeRef.current;
    if (!store) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleLogout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      const state = store.getState();
      const { token, expiresAt, remember } = state.auth;

      if (token && !expiresAt) {
        const computed = getTokenExpiry(token);
        if (computed) {
          store.dispatch(setTokenExpiry(computed));
          persistAuthToken(token, { remember, expiresAt: computed });
        }
      }

      const currentExpiry = store.getState().auth.expiresAt;

      if (!store.getState().auth.token || !currentExpiry) {
        return;
      }

      const ttl = currentExpiry - Date.now();

      if (ttl <= 0) {
        clearAuthToken({ preserveRemember: true });
        store.dispatch(clearCredentials());
        router.push('/login');
        return;
      }

      timeoutId = setTimeout(() => {
        clearAuthToken({ preserveRemember: true });
        store.dispatch(clearCredentials());
        router.push('/login');
      }, ttl);
    };

    scheduleLogout();
    const unsubscribe = store.subscribe(scheduleLogout);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      unsubscribe();
    };
  }, [router]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
