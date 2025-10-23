'use client';

import { apiClient } from './client';

export interface CreateIrisRecordForm {
  image: File;
  healthIssues: string[];
  note?: string;
}

export interface CreateIrisRecordResponse {
  id: string;
  imageKey: string;
  healthIssues: string[];
  note?: string;
  createdAt: string;
}

export const createIrisRecord = (formData: FormData) =>
  apiClient.postForm<CreateIrisRecordResponse>('/iris-records', formData);
