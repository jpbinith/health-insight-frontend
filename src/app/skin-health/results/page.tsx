'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { SkinResultCard } from '../../../components/SkinResultCard/SkinResultCard';
import type { SkinAnalysisResult } from '../types';

const uploadedImagePlaceholder = '/skin-placeholder.svg';

export default function SkinHealthResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<SkinAnalysisResult[]>([]);
  const [expandedConditionId, setExpandedConditionId] = useState<string | null>(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = sessionStorage.getItem('skin-health-upload-preview');
    if (stored) {
      setUploadedImageSrc(stored);
    } else {
      setUploadedImageSrc(null);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedResults = sessionStorage.getItem('skin-health-analysis-results');
      if (storedResults) {
        const parsed = JSON.parse(storedResults) as SkinAnalysisResult[];
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((result, index) => ({
            ...result,
            isTopMatch: index === 0,
          }));
          setResults(normalized);
          setExpandedConditionId(normalized[0]?.id ?? null);
        } else {
          setResults([]);
        }
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Failed to load skin health results from session storage', error);
      setResults([]);
    } finally {
      setIsLoadingResults(false);
    }
  }, []);

  const handleToggle = (id: string) => {
    setExpandedConditionId((previous) => (previous === id ? null : id));
  };

  const handleAnalyzeAnother = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('skin-health-upload-preview');
    }
    router.push('/skin-health');
  };

  return (
    <section className="analysis-page skin-results">
      <div className="analysis-page__inner">
        <header className="analysis-page__intro">
          <span className="analysis-page__badge analysis-page__badge--blue">Analysis Complete</span>
          <h1 className="analysis-page__title">Your Skin Health Results</h1>
          <p className="analysis-page__subtitle">
            Our AI analyzed your image and highlighted the most probable skin conditions. Explore each match below to better
            understand what it may mean for you.
          </p>
        </header>

        <section className="skin-results__preview-card" aria-label="Uploaded image">
          <div className="skin-results__preview-frame">
            <div className="skin-results__preview-wrapper">
              <Image
                className="skin-results__preview-image"
                src={uploadedImageSrc ?? uploadedImagePlaceholder}
                alt="Uploaded skin image used for analysis"
                fill
                priority
                sizes="(max-width: 768px) 88vw, 640px"
                unoptimized={Boolean(uploadedImageSrc)}
              />
            </div>
          </div>
        </section>

        <section className="skin-results__list" aria-label="Predicted skin conditions">
          {!isLoadingResults && results.length === 0 ? (
            <div className="skin-results__empty">
              <h2>No analysis results found</h2>
              <p>
                It looks like there are no recent skin analysis results to display. Please upload a new image to start a
                fresh analysis.
              </p>
              <button type="button" className="skin-results__cta skin-results__cta--secondary" onClick={handleAnalyzeAnother}>
                Start New Analysis
              </button>
            </div>
          ) : (
            results.map((condition, index) => {
              const hasGalleryImages = Array.isArray(condition.galleryImages) && condition.galleryImages.length > 0;
              const galleryImages = hasGalleryImages
                ? condition.galleryImages?.map((image) => ({
                    src: image.src,
                    alt: image.alt ?? condition.title,
                  }))
                : [
                    {
                      src: uploadedImageSrc ?? uploadedImagePlaceholder,
                      alt: condition.title,
                    },
                  ];

              return (
                <SkinResultCard
                  key={`${condition.id}-${index}`}
                  rankLabel={condition.label}
                  title={condition.title}
                  confidence={condition.confidence}
                  description={condition.description ?? ''}
                  symptoms={condition.symptoms ?? []}
                  galleryImages={galleryImages}
                  isExpanded={expandedConditionId === condition.id}
                  onToggle={() => handleToggle(condition.id)}
                  isTopMatch={condition.isTopMatch}
                />
              );
            })
          )}
        </section>

        <div className="skin-results__actions">
          <button type="button" className="skin-results__cta skin-results__cta--primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 21h14a1 1 0 0 0 1-1V8.5L15.5 3H5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1Z" />
              <path d="M9 13h6" />
              <path d="M12 10v6" />
            </svg>
            Save Analysis
          </button>
          <button
            type="button"
            className="skin-results__cta skin-results__cta--secondary"
            onClick={handleAnalyzeAnother}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-9-9" />
              <path d="M21 3v9h-9" />
            </svg>
            Analyze Another Image
          </button>
        </div>

        <p className="analysis-page__disclaimer skin-results__disclaimer">
          <strong>Disclaimer:</strong> HealthSight provides informational insights and is not a substitute for professional
          medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider about any skin concerns or
          before making changes to your care plan.
        </p>
      </div>
    </section>
  );
}
