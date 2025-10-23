"use client";

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '../../components/Button/Button';
import { listDiseaseHistory } from 'web/lib/api/diseaseHistory';
import type { DiseaseHistoryListResponse } from 'web/lib/api/diseaseHistory';

type HistoryEntry = DiseaseHistoryListResponse['data'][number];

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
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [limit, total]);
  const pageNumbers = useMemo(() => {
    const siblings = 1;
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);
    for (let current = Math.max(1, page - siblings); current <= Math.min(totalPages, page + siblings); current += 1) {
      pages.add(current);
    }
    return Array.from(pages).sort((a, b) => a - b);
  }, [page, totalPages]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await listDiseaseHistory({ page, limit });
        if (!isSubscribed) {
          return;
        }
        setEntries(response.data);
        setTotal(response.total);
      } catch (fetchError) {
        if (isSubscribed) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'Unable to load history. Please try again.',
          );
          setEntries([]);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    void fetchHistory();

    return () => {
      isSubscribed = false;
    };
  }, [limit, page]);

  return (
    <section className="history-page">
      <div className="history-page__inner">
        <header className="history-page__intro">
          <span className="history-page__eyebrow">Review your past skin analysis results.</span>
          <h1 className="history-page__title">Analysis History</h1>
        </header>

        {error ? <p className="history-page__error">{error}</p> : null}

        <div className="history-page__list" role="list">
          {entries.map((entry) => (
            <article className="history-entry" key={entry.historyId} role="listitem">
              <div className="history-entry__media history-entry__media--peach">
                <Image
                  src={entry.imageUrl || '/skin-placeholder.svg'}
                  alt="Saved skin analysis"
                  fill
                  sizes="96px"
                  className="history-entry__image"
                />
              </div>
              <div className="history-entry__details">
                <span className="history-entry__date">
                  {new Date(entry.occurredAt || entry.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <p className="history-entry__summary">
                  {entry.diseases[0]?.conditionId ? `Primary Prediction: ${entry.diseases[0].conditionId}` : 'Analysis Snapshot'}
                </p>
                {entry.diseases.map((disease) => (
                  <span
                    key={`${entry.historyId}-${disease.conditionId}`}
                    className={`history-entry__confidence ${getConfidenceTone(disease.confidence)}`}
                  >
                    {disease.confidence}% Confidence · {disease.conditionId}
                  </span>
                ))}
              </div>
              <Button variant="primary" icon="arrow" className="history-entry__cta" href={`/skin-health/results/${entry.historyId}`}>
                View Full Result
              </Button>
            </article>
          ))}
          {!entries.length && !isLoading && !error ? (
            <p className="history-page__empty">No history records yet. Save an analysis to see it here.</p>
          ) : null}
        </div>

        <div className="history-page__footer">
          <div className="history-page__page-size">
            <label htmlFor="history-page-size">Rows per page</label>
            <select
              id="history-page-size"
              value={limit}
              disabled={isLoading}
              onChange={(event) => {
                setPage(1);
                setLimit(Number(event.target.value));
              }}
            >
              {[5, 10, 20, 30].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="history-page__pagination">
            <button
              type="button"
              className="history-page__page-button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </button>
            <div className="history-page__page-steps">
              {pageNumbers.map((pageNumber, index) => {
                const previousNumber = index > 0 ? pageNumbers[index - 1] : null;
                const needsEllipsis = previousNumber !== null && pageNumber - previousNumber > 1;
                return (
                  <span key={pageNumber}>
                    {needsEllipsis ? <span className="history-page__page-ellipsis">…</span> : null}
                    <button
                      type="button"
                      className={`history-page__page-number${
                        pageNumber === page ? ' history-page__page-number--active' : ''
                      }`}
                      onClick={() => setPage(pageNumber)}
                      disabled={pageNumber === page || isLoading}
                    >
                      {pageNumber}
                    </button>
                  </span>
                );
              })}
            </div>
            <button
              type="button"
              className="history-page__page-button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages || isLoading}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
