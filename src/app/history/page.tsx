import Image from 'next/image';

import { Button } from '../../components/Button/Button';

type HistoryEntry = {
  id: string;
  date: string;
  condition: string;
  confidence: number;
  summary: string;
  thumbnail: {
    src: string;
    alt: string;
    tone: 'peach' | 'sand' | 'rose';
  };
};

const historyEntries: HistoryEntry[] = [
  {
    id: 'eczema-2023-10-23',
    date: 'October 23, 2023',
    condition: 'Eczema',
    confidence: 92,
    summary: 'Primary Prediction: Eczema',
    thumbnail: {
      src: '/skin-placeholder.svg',
      alt: 'Skin analysis result showing eczema indicators',
      tone: 'peach',
    },
  },
  {
    id: 'rosacea-2023-09-15',
    date: 'September 15, 2023',
    condition: 'Rosacea',
    confidence: 85,
    summary: 'Primary Prediction: Rosacea',
    thumbnail: {
      src: '/skin-placeholder.svg',
      alt: 'Skin analysis result showing rosacea indicators',
      tone: 'sand',
    },
  },
  {
    id: 'psoriasis-2023-08-02',
    date: 'August 02, 2023',
    condition: 'Psoriasis',
    confidence: 78,
    summary: 'Primary Prediction: Psoriasis',
    thumbnail: {
      src: '/skin-placeholder.svg',
      alt: 'Skin analysis result showing psoriasis indicators',
      tone: 'rose',
    },
  },
];

const getConfidenceTone = (confidence: number) => {
  if (confidence >= 90) {
    return 'history-entry__confidence--strong';
  }
  if (confidence >= 80) {
    return 'history-entry__confidence--moderate';
  }
  return 'history-entry__confidence--low';
};

export default function HistoryPage() {
  return (
    <section className="history-page">
      <div className="history-page__inner">
        <header className="history-page__intro">
          <span className="history-page__eyebrow">Review your past skin analysis results.</span>
          <h1 className="history-page__title">Analysis History</h1>
        </header>

        <div className="history-page__list" role="list">
          {historyEntries.map((entry) => (
            <article className="history-entry" key={entry.id} role="listitem">
              <div className={`history-entry__media history-entry__media--${entry.thumbnail.tone}`}>
                <Image
                  src={entry.thumbnail.src}
                  alt={entry.thumbnail.alt}
                  fill
                  sizes="96px"
                  className="history-entry__image"
                />
              </div>
              <div className="history-entry__details">
                <span className="history-entry__date">{entry.date}</span>
                <p className="history-entry__summary">{entry.summary}</p>
                <span className={`history-entry__confidence ${getConfidenceTone(entry.confidence)}`}>
                  {entry.confidence}% Confidence
                </span>
              </div>
              <Button variant="primary" icon="arrow" className="history-entry__cta" href={`/skin-health/results/${entry.id}`}>
                View Full Result
              </Button>
            </article>
          ))}
        </div>

        <button type="button" className="history-page__load-more">
          Load More
        </button>
      </div>
    </section>
  );
}
