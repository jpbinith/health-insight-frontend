'use client';

import { apiClient } from './client';

export interface DiseaseEntryPayload {
  conditionId: string;
  confidence: number;
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
  diseases: Array<{
    conditionId: string;
    confidence: number;
    imageUrl: string;
  }>;
  note?: string;
  occurredAt: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const createDiseaseHistory = (formData: FormData) =>
  apiClient.postForm<DiseaseHistoryResponse>('/disease-history', formData);

type DiseaseHistoryListQuery = {
  page?: number;
  limit?: number;
};

export interface DiseaseHistoryListResponse {
  page: number;
  limit: number;
  total: number;
  data: Array<{
    historyId: string;
    diseases: Array<{
      conditionId: string;
      confidence: number;
      imageUrl: string;
    }>;
    imageUrl: string;
    occurredAt: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export const listDiseaseHistory = ({ page = 1, limit = 10 }: DiseaseHistoryListQuery = {}) =>
  apiClient.get<DiseaseHistoryListResponse>(
    `/disease-history?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
  );
