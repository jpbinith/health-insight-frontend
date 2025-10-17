import Image from 'next/image';
import { useId } from 'react';

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
                <div
                  className="skin-result-card__gallery-item"
                  role="listitem"
                  key={`${image.src}-${index}`}
                >
                  <div className="skin-result-card__gallery-media">
                    <Image
                      className="skin-result-card__gallery-image"
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 40vw, 180px"
                    />
                  </div>
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
    </article>
  );
}
