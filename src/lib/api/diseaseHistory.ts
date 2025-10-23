'use client';

import { apiClient } from './client';

export interface DiseaseEntryPayload {
  conditionId: string;
  confidence?: number;
  imageUrl?: string;
}

export interface CreateDiseaseHistoryRequestForm {
  image: File;
  diseases: DiseaseEntryPayload[];
  note?: string;
  occurredAt?: string;
}

export interface DiseaseHistoryResponse {
  id: string;
  userId: string;
  diseases: DiseaseEntryPayload[];
  note?: string;
  occurredAt: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const createDiseaseHistory = (formData: FormData) =>
  apiClient.postForm<DiseaseHistoryResponse>('/disease-history', formData);
