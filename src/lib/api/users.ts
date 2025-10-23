'use client';

import { apiClient } from './client';

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export type CreateUserPayload = CreateUserRequest;

export const createUser = (payload: CreateUserPayload) =>
  apiClient.post<CreateUserResponse, CreateUserPayload>('/users', payload);
