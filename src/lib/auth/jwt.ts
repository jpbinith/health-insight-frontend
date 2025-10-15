const decodeBase64Url = (segment: string) => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '==='.slice((base64.length + 3) % 4);

  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(padded);
  }

  return Buffer.from(padded, 'base64').toString('utf8');
};

export const getTokenExpiry = (token: string): number | null => {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = decodeBase64Url(parts[1]);
    const data = JSON.parse(payload) as { exp?: number };
    if (typeof data.exp === 'number') {
      return data.exp * 1000;
    }
  } catch {
    return null;
  }

  return null;
};
