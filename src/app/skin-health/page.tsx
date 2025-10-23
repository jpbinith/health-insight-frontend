'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ImageUploader } from '../../components/ImageUploader/ImageUploader';
import { analyseSkinImage } from '../../lib/api/skinAnalysis';
import type { SkinAnalysisGalleryImage, SkinAnalysisResult } from './types';

type RawAnalysisResponse = {
  results?: unknown;
  predictions?: unknown;
  [key: string]: unknown;
};

const normalizeAnalysisResponse = (payload: unknown): SkinAnalysisResult[] => {
  const collected: unknown[] = [];

  if (Array.isArray(payload)) {
    collected.push(...payload);
  } else if (payload && typeof payload === 'object') {
    const data = payload as RawAnalysisResponse;
    if (Array.isArray(data.results)) {
      collected.push(...data.results);
    } else if (Array.isArray(data.predictions)) {
      collected.push(...data.predictions);
    }
  }

  return collected.map((item, index) => {
    if (!item || typeof item !== 'object') {
      return {
        id: `analysis-${index}`,
        label: `Prediction #${index + 1}`,
        title: `Prediction #${index + 1}`,
        confidence: 0,
        description: '',
        symptoms: [],
        galleryImages: [],
        isTopMatch: index === 0,
      };
    }

    const record = item as Record<string, unknown>;

    const confidenceCandidates: unknown[] = [
      record.confidence,
      record.confidenceScore,
      (record as Record<string, unknown>)['confidence_score'],
      record.score,
      record.probability,
    ];

    let confidence = 0;

    for (const candidate of confidenceCandidates) {
      if (candidate === undefined || candidate === null) {
        continue;
      }

      let numericValue: number | null = null;

      if (typeof candidate === 'number') {
        numericValue = candidate;
      } else if (typeof candidate === 'string') {
        const sanitized = candidate.replace(/%/g, '').trim();
        const parsed = Number.parseFloat(sanitized);
        if (!Number.isNaN(parsed)) {
          numericValue = parsed;
        }
      }

      if (numericValue !== null && Number.isFinite(numericValue)) {
        confidence =
          numericValue > 0 && numericValue < 1 ? numericValue * 100 : numericValue;
        break;
      }
    }

    const rawSymptoms = record.symptoms;
    const symptoms =
      Array.isArray(rawSymptoms) && rawSymptoms.every((value) => typeof value === 'string')
        ? (rawSymptoms as string[])
        : [];

    const rawImages =
      (Array.isArray(record.galleryImages) ? record.galleryImages : undefined) ??
      (Array.isArray(record.images) ? record.images : undefined);

    const galleryImages = Array.isArray(rawImages)
      ? rawImages.reduce<SkinAnalysisGalleryImage[]>((accumulator, image) => {
          if (!image || typeof image !== 'object') {
            return accumulator;
          }

          const details = image as Record<string, unknown>;
          const src = details.src ?? details.url;

          if (typeof src !== 'string' || !src) {
            return accumulator;
          }

          accumulator.push({
            src,
            alt: typeof details.alt === 'string' ? details.alt : null,
          });

          return accumulator;
        }, [])
      : [];

    const id =
      (typeof record.id === 'string' && record.id) ||
      (typeof record.conditionId === 'string' && record.conditionId) ||
      `analysis-${index}`;

    const title =
      (typeof record.title === 'string' && record.title) ||
      (typeof record.condition === 'string' && record.condition) ||
      `Prediction #${index + 1}`;

    const label =
      (typeof record.label === 'string' && record.label) ||
      (typeof record.rankLabel === 'string' && record.rankLabel) ||
      (index === 0 ? 'Top Match' : `Prediction #${index + 1}`);

    const description =
      (typeof record.description === 'string' && record.description) ||
      (typeof record.summary === 'string' && record.summary) ||
      '';

    return {
      id,
      label,
      title,
      confidence,
      description,
      symptoms,
      galleryImages,
      isTopMatch: index === 0,
    };
  });
};

export default function SkinHealthPage() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryFile = useMemo(() => selectedFiles[0] ?? null, [selectedFiles]);
  const hasSelection = selectedFiles.length > 0;

  const handleStartAnalysis = useCallback(async () => {
    if (!hasSelection) {
      return;
    }
    if (!primaryFile) {
      setError('Please select an image to analyze.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    if (typeof window !== 'undefined') {
      if (previewSrc) {
        sessionStorage.setItem('skin-health-upload-preview', previewSrc);
      } else {
        sessionStorage.removeItem('skin-health-upload-preview');
      }
    }

    try {
      const formData = new FormData();
      formData.append('image', primaryFile);

      const payload = await analyseSkinImage(formData);
      const normalizedResults = normalizeAnalysisResponse(payload);

      if (normalizedResults.length === 0) {
        throw new Error('No analysis results were returned. Please try another image.');
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('skin-health-analysis-results', JSON.stringify(normalizedResults));
      }

      router.push('/skin-health/results');
    } catch (apiError) {
      console.error(apiError);
      setError(
        apiError instanceof Error
          ? apiError.message
          : 'Something went wrong while analyzing your image. Please try again.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [hasSelection, previewSrc, primaryFile, router]);

  return (
    <section className="analysis-page skin-upload">
      <div className="analysis-page__inner">
        <header className="analysis-page__intro">
          <span className="analysis-page__badge analysis-page__badge--blue">Skin Health Analysis</span>
          <h1 className="analysis-page__title">Upload Your Skin Image</h1>
          <p className="analysis-page__subtitle">
            Get AI-powered insights into your skin. For best results, use a clear, well-lit photo.
          </p>
        </header>

        <div className="analysis-card">
          <ImageUploader
            accept="image/*"
            title="Upload Image"
            prompt="Drag & drop your image here, or click to upload"
            helperText="Supports: JPG, JPEG, PNG"
            hideDropzoneOnSelection
            showPreviewImage
            onChange={setSelectedFiles}
            onPreviewChange={setPreviewSrc}
            className="analysis-card__uploader analysis-card__uploader--skin"
          />

          <button
            type="button"
            className={`analysis-card__cta${hasSelection ? ' analysis-card__cta--enabled' : ''}`}
            disabled={!hasSelection || isAnalyzing}
            onClick={handleStartAnalysis}
          >
            {isAnalyzing ? 'Analyzing…' : 'Start Analysis'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
          {error ? <p className="analysis-card__error">{error}</p> : null}
        </div>

        <p className="analysis-page__disclaimer">
          <strong>Disclaimer:</strong> HealthSight provides informational insights and is not a substitute for professional
          medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any questions you may
          have regarding a medical condition.
        </p>
      </div>
    </section>
  );
}
