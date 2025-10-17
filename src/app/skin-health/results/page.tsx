'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { SkinResultCard } from '../../../components/SkinResultCard/SkinResultCard';

type SkinConditionResult = {
  id: string;
  title: string;
  label: string;
  confidence: number;
  description: string;
  symptoms: string[];
  galleryImages?: {
    src: string;
    alt: string;
  }[];
  isTopMatch?: boolean;
};

const uploadedImagePlaceholder = '/skin-placeholder.svg';

const mockSkinResults: SkinConditionResult[] = [
  {
    id: 'eczema',
    title: 'Eczema (Atopic Dermatitis)',
    label: 'Top Match',
    confidence: 92,
    description:
      'A chronic inflammatory condition that makes skin red, itchy, and dry. Flares can be triggered by stress, allergens, or irritants and often require ongoing management.',
    symptoms: [
      'Dry, cracked, or scaly patches of skin',
      'Itching (pruritus), especially severe at night',
      'Red to brownish-gray patches on the hands, feet, ankles, wrists, neck, and upper chest',
      'Small, raised bumps that may leak fluid when scratched',
    ],
    galleryImages: [
      { src: uploadedImagePlaceholder, alt: 'Eczema example presentation on cheek' },
      { src: uploadedImagePlaceholder, alt: 'Eczema example presentation on forehead' },
      { src: uploadedImagePlaceholder, alt: 'Eczema example presentation near jawline' },
      { src: uploadedImagePlaceholder, alt: 'Eczema example presentation near jawline' },
    ],
    isTopMatch: true,
  },
  {
    id: 'psoriasis',
    title: 'Psoriasis',
    label: 'Prediction #2',
    confidence: 78,
    description:
      'An autoimmune skin disorder that speeds up skin cell growth, leading to thick, silvery scales and itchy, dry patches. It is often cyclical, with flaring periods followed by remission.',
    symptoms: [
      'Raised, inflamed patches covered with silvery scales',
      'Dry, cracked skin that may bleed',
      'Soreness, burning, or itching around affected areas',
      'Thickened or pitted nails',
    ],
    galleryImages: [
      { src: uploadedImagePlaceholder, alt: 'Psoriasis example plaque on elbow' },
      { src: uploadedImagePlaceholder, alt: 'Psoriasis example presentation on knees' },
      { src: uploadedImagePlaceholder, alt: 'Psoriasis example affecting scalp' },
    ],
  },
  {
    id: 'rosacea',
    title: 'Rosacea',
    label: 'Prediction #3',
    confidence: 65,
    description:
      'A long-term inflammatory skin condition that causes redness and visible blood vessels on the central face. It can be triggered by temperature changes, spicy foods, alcohol, or stress.',
    symptoms: [
      'Persistent facial redness, often in the central face',
      'Small, pus-filled bumps resembling acne',
      'Visible facial blood vessels',
      'Facial burning or stinging sensations',
    ],
    galleryImages: [
      { src: uploadedImagePlaceholder, alt: 'Rosacea example central facial redness' },
      { src: uploadedImagePlaceholder, alt: 'Rosacea example with visible vessels' },
      { src: uploadedImagePlaceholder, alt: 'Rosacea example flare on cheeks' },
    ],
  },
];

export default function SkinHealthResultsPage() {
  const router = useRouter();
  const [expandedConditionId, setExpandedConditionId] = useState<string | null>(
    mockSkinResults[0]?.id ?? null,
  );
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);

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
          {mockSkinResults.map((condition) => (
            <SkinResultCard
              key={condition.id}
              rankLabel={condition.label}
              title={condition.title}
              confidence={condition.confidence}
              description={condition.description}
              symptoms={condition.symptoms}
              galleryImages={condition.galleryImages}
              isExpanded={expandedConditionId === condition.id}
              onToggle={() => handleToggle(condition.id)}
              isTopMatch={condition.isTopMatch}
            />
          ))}
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
              <path d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Z" />
              <path d="M12 7.5 16.5 12 12 16.5 7.5 12 12 7.5Z" />
              <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
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
