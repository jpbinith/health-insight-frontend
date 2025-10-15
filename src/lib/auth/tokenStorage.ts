'use client';

const TOKEN_COOKIE_NAME = 'authToken';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 2; // 2 hours
const REMEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days

const isBrowser = () => typeof window !== 'undefined';

const buildCookie = (value: string, maxAgeSeconds: number) => {
  const secure = isBrowser() && window.location.protocol === 'https:' ? '; Secure' : '';
  return `${TOKEN_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
};

export const persistAuthToken = (token: string, options?: { remember?: boolean }) => {
  if (!isBrowser()) {
    return;
  }

  const maxAge = options?.remember ? REMEMBER_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  document.cookie = buildCookie(token, maxAge);

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

  document.cookie = `${TOKEN_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0`;

  try {
    window.localStorage.removeItem(TOKEN_COOKIE_NAME);
    window.sessionStorage.removeItem(TOKEN_COOKIE_NAME);
  } catch {
    // Ignore storage cleanup failures.
  }
};
