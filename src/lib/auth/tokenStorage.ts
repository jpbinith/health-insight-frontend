'use client';

const TOKEN_COOKIE_NAME = 'authToken';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 2; // 2 hours
const REMEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days

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

export const persistAuthToken = (token: string, options?: { remember?: boolean }) => {
  if (!isBrowser()) {
    return;
  }

  const maxAge = options?.remember ? REMEMBER_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  document.cookie = buildCookie(TOKEN_COOKIE_NAME, token, maxAge);
  persistRememberPreference(Boolean(options?.remember));

  try {
    if (options?.remember) {
      window.localStorage.setItem(TOKEN_COOKIE_NAME, token);
    } else {
      window.sessionStorage.setItem(TOKEN_COOKIE_NAME, token);
      window.localStorage.removeItem(TOKEN_COOKIE_NAME);
    }
  } catch {
    // Access to storage might be blocked; best effort only.
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

export const clearAuthToken = () => {
  if (!isBrowser()) {
    return;
  }

  document.cookie = buildCookie(TOKEN_COOKIE_NAME, '', 0);

  try {
    window.localStorage.removeItem(TOKEN_COOKIE_NAME);
    window.sessionStorage.removeItem(TOKEN_COOKIE_NAME);
    window.localStorage.removeItem(`${TOKEN_COOKIE_NAME}:remember`);
  } catch {
    // Ignore storage cleanup failures.
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
