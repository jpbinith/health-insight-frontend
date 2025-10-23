'use client';

import { apiClient } from './client';

export interface AnalyseRequestForm {
  image: File;
}

export interface SkinAnalysisResult {
  id: string;
  title: string;
  label: 'Top Match' | `Prediction #${number}`;
  confidence: number;
  description: string;
  symptoms: string[];
  galleryImages: Array<{ src: string; alt: string | null }>;
  isTopMatch?: boolean;
}

export type AnalyseResponse = SkinAnalysisResult[];

export const analyseSkinImage = (formData: FormData) =>
  apiClient.postForm<AnalyseResponse>('/analyse', formData);
