'use client';

import { apiClient } from './client';

export const analyseSkinImage = (formData: FormData) =>
  apiClient.postForm<unknown>('/analyse', formData);
