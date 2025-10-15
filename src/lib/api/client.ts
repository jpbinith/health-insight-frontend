'use client';

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

const ensureBaseUrl = () => {
  if (!API_BASE_URL) {
    throw new ConfigurationError(
      'API base URL is missing. Set NEXT_PUBLIC_API_BASE_URL to enable backend calls.'
    );
  }

  return API_BASE_URL;
};

const buildUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${ensureBaseUrl()}${normalizedPath}`;
};

const parseResponseBody = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (isJson) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
};

async function request<TResponse>(
  path: string,
  init: RequestInit = {}
): Promise<TResponse> {
  const mergedHeaders = new Headers(init.headers);

  if (!mergedHeaders.has('Accept')) {
    mergedHeaders.set('Accept', 'application/json');
  }

  const hasBody = init.body !== undefined && init.body !== null;
  const isFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (hasBody && !mergedHeaders.has('Content-Type') && !isFormData) {
    mergedHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: mergedHeaders,
  });

  const body = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof (body as { message: unknown }).message === 'string'
        ? (body as { message: string }).message
        : response.statusText || 'Request failed';

    throw new ApiError(message, response.status, body);
  }

  return body as TResponse;
}

const jsonBody = (payload: unknown) => JSON.stringify(payload);

export const apiClient = {
  get: <TResponse>(path: string, init?: RequestInit) =>
    request<TResponse>(path, {
      ...init,
      method: 'GET',
    }),
  post: <TResponse, TPayload>(
    path: string,
    payload: TPayload,
    init?: Omit<RequestInit, 'body'>
  ) =>
    request<TResponse>(path, {
      ...init,
      method: 'POST',
      body: jsonBody(payload),
    }),
  postForm: <TResponse>(
    path: string,
    formData: FormData,
    init?: Omit<RequestInit, 'body'>
  ) =>
    request<TResponse>(path, {
      ...init,
      method: 'POST',
      body: formData,
    }),
  put: <TResponse, TPayload>(
    path: string,
    payload: TPayload,
    init?: Omit<RequestInit, 'body'>
  ) =>
    request<TResponse>(path, {
      ...init,
      method: 'PUT',
      body: jsonBody(payload),
    }),
  patch: <TResponse, TPayload>(
    path: string,
    payload: TPayload,
    init?: Omit<RequestInit, 'body'>
  ) =>
    request<TResponse>(path, {
      ...init,
      method: 'PATCH',
      body: jsonBody(payload),
    }),
  delete: <TResponse>(path: string, init?: RequestInit) =>
    request<TResponse>(path, {
      ...init,
      method: 'DELETE',
    }),
};

export type ApiClient = typeof apiClient;
