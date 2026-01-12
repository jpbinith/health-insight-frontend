'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ImageUploader } from '../../components/ImageUploader/ImageUploader';
import { analyseSkinImage } from 'web/lib/api/skinAnalysis';
import type { SkinAnalysisResult } from 'web/lib/api/skinAnalysis';

type SkinAnalysisGalleryImage = SkinAnalysisResult['galleryImages'][number];
type PredictionLabel = SkinAnalysisResult['label'];

type RawAnalysisResponse = {
  results?: SkinAnalysisResult[];
  predictions?: SkinAnalysisResult[];
};

const normalizeAnalysisResponse = (payload: RawAnalysisResponse | SkinAnalysisResult[]): SkinAnalysisResult[] => {
  const collected: SkinAnalysisResult[] = [];

  if (Array.isArray(payload)) {
    collected.push(...payload);
  } else {
    if (Array.isArray(payload.results)) {
      collected.push(...payload.results);
    } else if (Array.isArray(payload.predictions)) {
      collected.push(...payload.predictions);
    }
  }

  const buildLabel = (value: PredictionLabel | undefined, index: number): PredictionLabel => {
    if (value) {
      return value;
    }

    if (index === 0) {
      return 'Top Match';
    }

    return `Prediction #${index + 1}`;
  };

  return collected.map((item, index) => {
    const galleryImages = Array.isArray(item.galleryImages)
      ? item.galleryImages.reduce<SkinAnalysisGalleryImage[]>((accumulator, image) => {
          if (!image || typeof image !== 'object') {
            return accumulator;
          }

          const { src, alt = null } = image as SkinAnalysisGalleryImage & { alt?: string | null };

          if (typeof src !== 'string' || !src) {
            return accumulator;
          }

          accumulator.push({ src, alt });

          return accumulator;
        }, [])
      : [];

    return {
      id: item.id,
      label: buildLabel(item.label, index),
      title: item.title,
      confidence: item.confidence,
      description: item.description,
      symptoms: item.symptoms,
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
            accept=".jpg,.jpeg,.png"
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
