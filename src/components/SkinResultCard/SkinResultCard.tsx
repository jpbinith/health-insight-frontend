import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

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
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const galleryViewportRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const galleryHasOverflow = galleryImages.length > 3;
  const activeImage = activeImageIndex !== null ? galleryImages[activeImageIndex] : null;
  const canLightboxGoPrev = activeImageIndex !== null && activeImageIndex > 0;
  const canLightboxGoNext = activeImageIndex !== null && activeImageIndex < galleryImages.length - 1;

  useEffect(() => {
    setActiveImageIndex((current) => {
      if (current === null) {
        return null;
      }

      if (galleryImages.length === 0) {
        return null;
      }

      return Math.min(current, galleryImages.length - 1);
    });
  }, [galleryImages.length]);

  const updateGalleryNavState = useCallback(() => {
    if (!galleryHasOverflow) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    const viewport = galleryViewportRef.current;
    if (!viewport) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = viewport;
    const epsilon = 1;
    setCanScrollPrev(scrollLeft > epsilon);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - epsilon);
  }, [galleryHasOverflow]);

  const goToNextImage = useCallback(() => {
    setActiveImageIndex((current) => {
      if (current === null) {
        return current;
      }

      const nextIndex = current + 1;
      if (nextIndex < galleryImages.length) {
        return nextIndex;
      }

      return current;
    });
  }, [galleryImages.length]);

  const goToPreviousImage = useCallback(() => {
    setActiveImageIndex((current) => {
      if (current === null) {
        return current;
      }

      const previousIndex = current - 1;
      if (previousIndex >= 0) {
        return previousIndex;
      }

      return current;
    });
  }, []);

  useEffect(() => {
    if (activeImageIndex === null) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageIndex(null);
        return;
      }

      if (event.key === 'ArrowRight' && canLightboxGoNext) {
        event.preventDefault();
        goToNextImage();
        return;
      }

      if (event.key === 'ArrowLeft' && canLightboxGoPrev) {
        event.preventDefault();
        goToPreviousImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, canLightboxGoNext, canLightboxGoPrev, goToNextImage, goToPreviousImage]);

  useEffect(() => {
    if (!isExpanded) {
      const viewport = galleryViewportRef.current;
      if (viewport) {
        viewport.scrollTo({ left: 0 });
      }
      updateGalleryNavState();
      return;
    }

    updateGalleryNavState();

    if (!galleryHasOverflow) {
      return undefined;
    }

    const viewport = galleryViewportRef.current;
    if (!viewport) {
      return undefined;
    }

    const handleScroll = () => updateGalleryNavState();
    const handleResize = () => updateGalleryNavState();

    viewport.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [galleryHasOverflow, galleryImages.length, isExpanded, updateGalleryNavState]);

  const scrollGallery = (direction: -1 | 1) => {
    const viewport = galleryViewportRef.current;
    if (!viewport) {
      return;
    }

    const scrollAmount = viewport.clientWidth;
    viewport.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(updateGalleryNavState);
    } else {
      updateGalleryNavState();
    }
  };

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
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
  const galleryViewportClassName = 'skin-result-card__gallery skin-result-card__gallery--scroll';
  const galleryItems = galleryImages.map((image, index) => (
    <div className="skin-result-card__gallery-item" role="listitem" key={`${image.src}-${index}`}>
      <button
        type="button"
        className="skin-result-card__gallery-trigger"
        onClick={() => openLightbox(index)}
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
  ));

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
            <div className={galleryViewportClassName}>
              {galleryHasOverflow ? (
                <button
                  type="button"
                  className="skin-result-card__gallery-nav skin-result-card__gallery-nav--prev"
                  onClick={() => scrollGallery(-1)}
                  aria-label="Scroll gallery backward"
                  disabled={!canScrollPrev}
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
                    <path d="m15 6-6 6 6 6" />
                  </svg>
                </button>
              ) : null}
              <div className="skin-result-card__gallery-viewport" ref={galleryViewportRef}>
                <div className="skin-result-card__gallery-track" role="list">
                  {galleryItems}
                </div>
              </div>
              {galleryHasOverflow ? (
                <button
                  type="button"
                  className="skin-result-card__gallery-nav skin-result-card__gallery-nav--next"
                  onClick={() => scrollGallery(1)}
                  aria-label="Scroll gallery forward"
                  disabled={!canScrollNext}
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
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </button>
              ) : null}
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
              <button
                type="button"
                className="skin-result-card__lightbox-close"
                onClick={closeLightbox}
                aria-label="Close full screen view"
              >
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
              {canLightboxGoPrev ? (
                <button
                  type="button"
                  className="skin-result-card__lightbox-nav skin-result-card__lightbox-nav--prev"
                  onClick={goToPreviousImage}
                  aria-label="View previous image"
                >
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
                    <path d="m15 6-6 6 6 6" />
                  </svg>
                </button>
              ) : null}
              {canLightboxGoNext ? (
                <button
                  type="button"
                  className="skin-result-card__lightbox-nav skin-result-card__lightbox-nav--next"
                  onClick={goToNextImage}
                  aria-label="View next image"
                >
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
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
