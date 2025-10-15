'use client';

import { apiClient } from './client';

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user?: {
    id?: string;
    fullName?: string;
    email?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export const login = (payload: LoginPayload) =>
  apiClient.post<LoginResponse>('/auth/login', payload);
