import Image from 'next/image';
import { useEffect, useId, useState } from 'react';

type GalleryImage = {
  src: string;
  alt: string;
};

type SkinResultCardProps = {
  rankLabel: string;
  title: string;
  confidence: number;
  description: string;
  symptoms: string[];
  galleryImages?: GalleryImage[];
  isExpanded: boolean;
  onToggle: () => void;
  isTopMatch?: boolean;
  className?: string;
};

export function SkinResultCard({
  rankLabel,
  title,
  confidence,
  description,
  symptoms,
  galleryImages = [],
  isExpanded,
  onToggle,
  isTopMatch = false,
  className,
}: SkinResultCardProps) {
  const detailsId = useId();
  const modalLabelId = useId();
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!activeImage) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  const openLightbox = (image: GalleryImage) => {
    setActiveImage(image);
  };

  const closeLightbox = () => {
    setActiveImage(null);
  };
  const cardClassName = [
    'skin-result-card',
    isExpanded ? 'skin-result-card--expanded' : '',
    isTopMatch ? 'skin-result-card--top' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const formattedConfidence = `${Math.round(confidence)}% Confidence`;

  return (
    <article className={cardClassName}>
      <button
        type="button"
        className="skin-result-card__summary"
        aria-expanded={isExpanded}
        aria-controls={detailsId}
        onClick={onToggle}
      >
        <div className="skin-result-card__info">
          <div className="skin-result-card__labels">
            <span className="skin-result-card__rank">{rankLabel}</span>
          </div>
          <h3 className="skin-result-card__title">{title}</h3>
        </div>
        <div className="skin-result-card__meta">
          <span className="skin-result-card__confidence">{formattedConfidence}</span>
          <span className="skin-result-card__indicator" aria-hidden="true">
            <svg
              className="skin-result-card__chevron"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
      </button>
      {isExpanded ? (
        <div className="skin-result-card__details" id={detailsId}>
          {galleryImages.length > 0 ? (
            <div className="skin-result-card__gallery" role="list">
              {galleryImages.map((image, index) => (
                <div className="skin-result-card__gallery-item" role="listitem" key={`${image.src}-${index}`}>
                  <button
                    type="button"
                    className="skin-result-card__gallery-trigger"
                    onClick={() => openLightbox(image)}
                    aria-label={`View ${image.alt} in full screen`}
                  >
                    <div className="skin-result-card__gallery-media">
                      <Image
                        className="skin-result-card__gallery-image"
                        src={image.src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 40vw, 180px"
                      />
                      <span className="skin-result-card__gallery-icon" aria-hidden="true">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 9V5a1 1 0 0 1 1-1h4" />
                          <path d="m5 5 4.5 4.5" />
                          <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
                          <path d="M19 19 14.5 14.5" />
                        </svg>
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <p className="skin-result-card__description">{description}</p>
          {symptoms.length > 0 ? (
            <section className="skin-result-card__symptoms" aria-label="Common symptoms">
              <h4 className="skin-result-card__section-title">Common Symptoms</h4>
              <ul>
                {symptoms.map((symptom) => (
                  <li key={symptom}>{symptom}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
      {activeImage ? (
        <div className="skin-result-card__lightbox" role="dialog" aria-modal="true" aria-labelledby={modalLabelId}>
          <div className="skin-result-card__lightbox-backdrop" aria-hidden="true" onClick={closeLightbox} />
          <div className="skin-result-card__lightbox-content">
            <div className="skin-result-card__lightbox-header">
              <h4 className="skin-result-card__lightbox-title" id={modalLabelId}>
                {activeImage.alt || title}
              </h4>
              <button type="button" className="skin-result-card__lightbox-close" onClick={closeLightbox}>
                <span className="visually-hidden">Close full screen view</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="skin-result-card__lightbox-frame">
              <Image
                src={activeImage.src}
                alt={activeImage.alt || title}
                fill
                sizes="(max-width: 768px) 95vw, 70vw"
                className="skin-result-card__lightbox-image"
              />
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
