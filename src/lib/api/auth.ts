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
  apiClient.post<LoginResponse, LoginPayload>('/auth/login', payload);

export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordResponse = {
  message?: string;
};

export const requestPasswordReset = (payload: ForgotPasswordPayload) =>
  apiClient.post<ForgotPasswordResponse, ForgotPasswordPayload>('/auth/forgot-password', payload);

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type ResetPasswordResponse = {
  message?: string;
};

export const resetPassword = (payload: ResetPasswordPayload) =>
  apiClient.post<ResetPasswordResponse, ResetPasswordPayload>('/auth/reset-password', payload);
