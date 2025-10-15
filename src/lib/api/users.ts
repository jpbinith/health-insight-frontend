'use client';

import { apiClient } from './client';

export type CreateUserPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type CreateUserResponse = {
  id: string;
  fullName: string;
  email: string;
  createdAt?: string;
};

export const createUser = (payload: CreateUserPayload) =>
  apiClient.post<CreateUserResponse | null, CreateUserPayload>('/users', payload);
