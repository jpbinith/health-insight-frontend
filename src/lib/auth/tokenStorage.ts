'use client';

import type { AuthUser } from 'web/lib/state/slices/authSlice';

const TOKEN_COOKIE_NAME = 'authToken';
const TOKEN_USER_COOKIE_NAME = 'authUser';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 2; // 2 hours
const REMEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days
const TOKEN_EXPIRY_KEY = `${TOKEN_COOKIE_NAME}:expires`;
const TOKEN_USER_KEY = `${TOKEN_COOKIE_NAME}:user`;

const isBrowser = () => typeof window !== 'undefined';

const buildCookie = (name: string, value: string, maxAgeSeconds: number) => {
  const secure = isBrowser() && window.location.protocol === 'https:' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
};

const persistRememberPreference = (remember: boolean) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(`${TOKEN_COOKIE_NAME}:remember`, remember ? '1' : '0');
  } catch {
    // Ignore storage issues.
  }
};

const persistExpiry = (expiresAt: number | null, remember: boolean) => {
  if (!isBrowser()) {
    return;
  }

  try {
    if (expiresAt) {
      const target = remember ? window.localStorage : window.sessionStorage;
      target.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
      const other = remember ? window.sessionStorage : window.localStorage;
      other.removeItem(TOKEN_EXPIRY_KEY);
    } else {
      window.localStorage.removeItem(TOKEN_EXPIRY_KEY);
      window.sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
  } catch {
    // Ignore storage issues.
  }
};

const persistUserProfile = (user: AuthUser | null, remember: boolean) => {
  if (!isBrowser()) {
    return;
  }

  try {
    const target = remember ? window.localStorage : window.sessionStorage;
    const other = remember ? window.sessionStorage : window.localStorage;
    if (user) {
      target.setItem(TOKEN_USER_KEY, JSON.stringify(user));
    } else {
      target.removeItem(TOKEN_USER_KEY);
    }
    other.removeItem(TOKEN_USER_KEY);
  } catch {
    // Ignore storage issues.
  }
};

export const persistAuthToken = (
  token: string,
  options?: { remember?: boolean; expiresAt?: number | null; user?: AuthUser | null }
) => {
  if (!isBrowser()) {
    return;
  }

  const maxAge = options?.remember ? REMEMBER_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  document.cookie = buildCookie(TOKEN_COOKIE_NAME, token, maxAge);
  const remember = Boolean(options?.remember);
  persistRememberPreference(remember);
  persistExpiry(options?.expiresAt ?? null, remember);
  if (options && 'user' in options) {
    persistUserProfile(options.user ?? null, remember);
  }

  try {
    if (remember) {
      window.localStorage.setItem(TOKEN_COOKIE_NAME, token);
    } else {
      window.sessionStorage.setItem(TOKEN_COOKIE_NAME, token);
      window.localStorage.removeItem(TOKEN_COOKIE_NAME);
    }
  } catch {
    // Access to storage might be blocked; best effort only.
  }

  try {
    if (options?.user) {
      document.cookie = buildCookie(
        TOKEN_USER_COOKIE_NAME,
        JSON.stringify(options.user),
        maxAge
      );
    } else {
      document.cookie = buildCookie(TOKEN_USER_COOKIE_NAME, '', 0);
    }
  } catch {
    // Ignore cookie issues.
  }
};

export const loadStoredAuthToken = () => {
  if (!isBrowser()) {
    return null;
  }

  const cookieMatch = document.cookie
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${TOKEN_COOKIE_NAME}=`));

  if (cookieMatch) {
    return decodeURIComponent(cookieMatch.split('=')[1] ?? '');
  }

  try {
    return (
      window.localStorage.getItem(TOKEN_COOKIE_NAME) ??
      window.sessionStorage.getItem(TOKEN_COOKIE_NAME)
    );
  } catch {
    return null;
  }
};

export const clearAuthToken = (options?: { preserveRemember?: boolean }) => {
  if (!isBrowser()) {
    return;
  }

  document.cookie = buildCookie(TOKEN_COOKIE_NAME, '', 0);

  try {
    window.localStorage.removeItem(TOKEN_COOKIE_NAME);
    window.sessionStorage.removeItem(TOKEN_COOKIE_NAME);
    if (!options?.preserveRemember) {
      window.localStorage.removeItem(`${TOKEN_COOKIE_NAME}:remember`);
    }
    window.localStorage.removeItem(TOKEN_EXPIRY_KEY);
    window.sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    window.localStorage.removeItem(TOKEN_USER_KEY);
    window.sessionStorage.removeItem(TOKEN_USER_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }

  try {
    document.cookie = buildCookie(TOKEN_USER_COOKIE_NAME, '', 0);
  } catch {
    // Ignore cookie cleanup failure.
  }
};

export const loadRememberPreference = () => {
  if (!isBrowser()) {
    return false;
  }

  try {
    return window.localStorage.getItem(`${TOKEN_COOKIE_NAME}:remember`) === '1';
  } catch {
    return false;
  }
};

export const loadStoredTokenExpiry = () => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const value =
      window.sessionStorage.getItem(TOKEN_EXPIRY_KEY) ??
      window.localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!value) {
      return null;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  } catch {
    return null;
  }
};

export const loadStoredUserProfile = (): AuthUser | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const getCookieValue = () => {
      const cookie = document.cookie
        .split(';')
        .map((entry) => entry.trim())
        .find((entry) => entry.startsWith(`${TOKEN_USER_COOKIE_NAME}=`));
      if (!cookie) {
        return null;
      }
      const value = cookie.split('=')[1] ?? '';
      return value ? decodeURIComponent(value) : null;
    };

    const cookieValue = getCookieValue();
    if (cookieValue) {
      return JSON.parse(cookieValue) as AuthUser;
    }

    const raw =
      window.sessionStorage.getItem(TOKEN_USER_KEY) ??
      window.localStorage.getItem(TOKEN_USER_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};
