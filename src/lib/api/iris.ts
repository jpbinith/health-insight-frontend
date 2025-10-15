'use client';

import { apiClient } from './client';

export const createIrisRecord = (formData: FormData) =>
  apiClient.postForm<unknown>('/iris-records', formData);
