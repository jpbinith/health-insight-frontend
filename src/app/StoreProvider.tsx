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
  loadStoredUserProfile,
  persistAuthToken,
} from 'web/lib/auth/tokenStorage';
import {
  clearCredentials,
  setCredentials,
  setRememberPreference,
  setTokenExpiry,
} from 'web/lib/state/slices/authSlice';
import type { AuthUser } from 'web/lib/state/slices/authSlice';
import { getTokenExpiry } from 'web/lib/auth/jwt';

type StoreProviderProps = {
  children: ReactNode;
  initialToken?: string | null;
  initialUser?: { fullName?: string | null; email?: string | null } | null;
};

const buildPreloadedState = (
  token?: string | null,
  user?: { fullName?: string | null; email?: string | null } | null
) => {
  if (!token) {
    return undefined;
  }

  return {
    auth: {
      token,
      user: user ?? null,
      remember: false,
      expiresAt: null,
    },
  };
};

export default function StoreProvider({ children, initialToken, initialUser }: StoreProviderProps) {
  const router = useRouter();
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(buildPreloadedState(initialToken, initialUser));
  }
  const store = storeRef.current;
  if (!store) {
    throw new Error('Failed to initialise application store.');
  }

  useEffect(() => {
    const storedToken = loadStoredAuthToken();
    const storedExpiry = loadStoredTokenExpiry();
    const storedUser = loadStoredUserProfile();
    const remember = loadRememberPreference();
    const state = store.getState();
    if (!state) {
      return;
    }

    if (remember !== state.auth.remember) {
      store.dispatch(setRememberPreference(remember));
    }

    const seededUser = state.auth.user ?? initialUser ?? null;
    const nextToken = storedToken ?? state.auth.token;
    const nextExpires =
      storedExpiry ??
      state.auth.expiresAt ??
      (nextToken ? getTokenExpiry(nextToken) : null);
    const nextUser = storedUser ?? seededUser;

    const shouldHydrateUser = !!nextUser && !state.auth.user;

    if (nextToken && (!state.auth.token || state.auth.token !== nextToken || shouldHydrateUser)) {
      store.dispatch(
        setCredentials({
          token: nextToken,
          user: nextUser ?? null,
          remember,
          expiresAt: nextExpires ?? undefined,
        })
      );
    } else if (typeof nextExpires === 'number' && nextExpires !== state.auth.expiresAt) {
      store.dispatch(setTokenExpiry(nextExpires));
    }

    if (nextToken) {
      const persistOptions: {
        remember: boolean;
        expiresAt: number | null;
        user?: AuthUser | null;
      } = {
        remember,
        expiresAt: nextExpires ?? null,
      };
      if (nextUser) {
        persistOptions.user = nextUser;
      }
      persistAuthToken(nextToken, persistOptions);
    }
  }, [store, initialUser]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleLogout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      const state = store.getState();
      const { token, expiresAt, remember, user } = state.auth;

      if (token && !expiresAt) {
        const computed = getTokenExpiry(token);
        if (computed) {
          store.dispatch(setTokenExpiry(computed));
          const persistOptions: {
            remember: boolean;
            expiresAt: number | null;
            user?: AuthUser | null;
          } = { remember, expiresAt: computed };
          if (user) {
            persistOptions.user = user;
          }
          persistAuthToken(token, persistOptions);
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
  }, [router, store]);

  return <Provider store={store}>{children}</Provider>;
}
