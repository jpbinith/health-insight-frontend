'use client';

import { apiClient } from './client';

export type GetRootResponse = string;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export type LoginPayload = LoginRequest;

export const login = (payload: LoginPayload) =>
  apiClient.post<LoginResponse, LoginPayload>('/auth/login', payload);

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export type ForgotPasswordPayload = ForgotPasswordRequest;

export const requestPasswordReset = (payload: ForgotPasswordPayload) =>
  apiClient.post<ForgotPasswordResponse, ForgotPasswordPayload>('/auth/forgot-password', payload);

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export type ResetPasswordPayload = ResetPasswordRequest;

export const resetPassword = (payload: ResetPasswordPayload) =>
  apiClient.post<ResetPasswordResponse, ResetPasswordPayload>('/auth/reset-password', payload);
