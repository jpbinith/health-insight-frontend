'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ImageUploader } from '../../components/ImageUploader/ImageUploader';

export default function SkinHealthPage() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const hasSelection = selectedFiles.length > 0;

  const handleStartAnalysis = () => {
    if (!hasSelection) {
      return;
    }
    if (typeof window !== 'undefined') {
      if (previewSrc) {
        sessionStorage.setItem('skin-health-upload-preview', previewSrc);
      } else {
        sessionStorage.removeItem('skin-health-upload-preview');
      }
    }
    router.push('/skin-health/results');
  };

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
            disabled={!hasSelection}
            onClick={handleStartAnalysis}
          >
            Start Analysis
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
