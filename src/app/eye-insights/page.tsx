'use client';

import { useMemo, useState } from 'react';

import { ImageUploader } from '../../components/ImageUploader/ImageUploader';
import { createIrisRecord } from 'web/lib/api/iris';
import { ApiError, ConfigurationError } from 'web/lib/api/client';

const healthOptions = [
  { value: 'none', label: 'None/healthy control' },
  { value: 'hypertension', label: 'Hypertension' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'thyroid', label: 'Thyroid condition' },
] as const;

export default function EyeInsightsPage() {
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherDiseases, setOtherDiseases] = useState<string[]>([]);
  const [selectedHealth, setSelectedHealth] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleOther = (checked: boolean) => {
    setOtherSelected(checked);
    setOtherDiseases(checked ? [''] : []);
  };

  const updateOtherDisease = (index: number, value: string) => {
    setOtherDiseases((prev) => prev.map((entry, idx) => (idx === index ? value : entry)));
  };

  const addOtherDisease = () => {
    setOtherDiseases((prev) => [...prev, '']);
  };

  const removeOtherDisease = (index: number) => {
    setOtherDiseases((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleHealthCondition = (value: string, checked: boolean) => {
    setSelectedHealth((prev) => {
      if (checked) {
        if (prev.includes(value)) {
          return prev;
        }
        if (value === 'none') {
          return ['none'];
        }
        return [...prev.filter((entry) => entry !== 'none'), value];
      }
      const next = prev.filter((entry) => entry !== value);
      if (value === 'none') {
        return next;
      }
      return next;
    });
  };

  const healthIssues = useMemo(() => {
    const otherEntries = otherDiseases
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
    return [...selectedHealth, ...otherEntries];
  }, [otherDiseases, selectedHealth]);

  const filesSelected = uploadedFiles.length > 0;

  const handleSubmit = async () => {
    if (!filesSelected) {
      setErrorMessage('Please add an iris image before saving your record.');
      setSuccessMessage(null);
      return;
    }

    if (!consentChecked) {
      setErrorMessage('You need to confirm consent before uploading.');
      setSuccessMessage(null);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFiles[0]);
      if (healthIssues.length > 0) {
        formData.append('healthIssues', JSON.stringify(healthIssues));
      }
      if (notes.trim()) {
        formData.append('note', notes.trim());
      }

      await createIrisRecord(formData);

      setSuccessMessage('Iris record uploaded successfully.');
      setSelectedHealth([]);
      setOtherSelected(false);
      setOtherDiseases([]);
      setNotes('');
      setConsentChecked(false);
      setUploadedFiles([]);
      setUploaderKey((prev) => prev + 1);
    } catch (error) {
      if (error instanceof ConfigurationError) {
        setErrorMessage('Iris upload service is not configured. Please contact support.');
        return;
      }

      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('We could not upload your iris record right now. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaveDisabled = !consentChecked || !filesSelected || isSubmitting;

  return (
    <section className="analysis-page eye-insights">
      <div className="analysis-page__inner">
        <header className="analysis-page__intro">
          <span className="analysis-page__badge analysis-page__badge--green">Eye Insights</span>
          <h1 className="analysis-page__title">Add Iris Image</h1>
          <p className="analysis-page__subtitle">
            Help us refine iris-based health insights. Upload clearly focused images and share optional health context to
            improve fairness and accuracy.
          </p>
        </header>

        <div className="analysis-card eye-insights__card">
          <ImageUploader
            key={uploaderKey}
            accept=".jpg,.jpeg,.png"
            title="Upload Image"
            prompt="Drag and drop or click to upload"
            helperText="Supports: JPG, JPEG, PNG"
            hideDropzoneOnSelection
            showPreviewImage
            onChange={setUploadedFiles}
            className="analysis-card__uploader analysis-card__uploader--eye"
          />

          <div className="eye-insights__form">
            <section className="eye-insights__group" aria-labelledby="health-heading">
              <h2 className="eye-insights__group-title" id="health-heading">
                Self-reported health
              </h2>
              <div className="eye-insights__checkboxes">
                {healthOptions.map((option) => (
                  <label className="eye-insights__checkbox" key={option.value}>
                    <input
                      className="eye-insights__checkbox-input"
                      type="checkbox"
                      name="health"
                      value={option.value}
                      checked={selectedHealth.includes(option.value)}
                      onChange={(event) => toggleHealthCondition(option.value, event.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
                <label className="eye-insights__checkbox">
                  <input
                    className="eye-insights__checkbox-input"
                    type="checkbox"
                    name="health"
                    value="other"
                    checked={otherSelected}
                    onChange={(event) => toggleOther(event.target.checked)}
                  />
                  <span>Other</span>
                </label>
              </div>
            </section>

            {otherSelected ? (
              <div className="eye-insights__other">
                <p className="eye-insights__other-title">List the conditions</p>
                <div className="eye-insights__other-list">
                  {otherDiseases.map((condition, index) => (
                    <div className="eye-insights__other-field" key={`other-condition-${index}`}>
                      <input
                        className="eye-insights__other-input"
                        type="text"
                        value={condition}
                        placeholder="e.g. Asthma"
                        onChange={(event) => updateOtherDisease(index, event.target.value)}
                      />
                      <button
                        type="button"
                        className="eye-insights__other-remove"
                        onClick={() => removeOtherDisease(index)}
                        aria-label="Remove condition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button className="eye-insights__other-add" type="button" onClick={addOtherDisease}>
                  Add another condition
                </button>
              </div>
            ) : null}

            <div className="eye-insights__notes">
              <label className="eye-insights__notes-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                className="eye-insights__textarea"
                id="notes"
                name="notes"
                placeholder="Add any additional information here"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            <div className="eye-insights__consent">
              <label className="eye-insights__consent-control">
                <input
                  className="eye-insights__consent-checkbox"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(event) => setConsentChecked(event.target.checked)}
                />
                <span className="eye-insights__consent-copy">
                  I confirm that I own these images and consent to their use for HealthSight eye insight research.
                </span>
              </label>
              <p className="eye-insights__consent-hint">Your files remain encrypted and may be deleted at any time.</p>
            </div>
          </div>

          <div className="eye-insights__actions">
            <div className="eye-insights__messages" aria-live="polite">
              {errorMessage ? <p className="eye-insights__message eye-insights__message--error">{errorMessage}</p> : null}
              {successMessage ? (
                <p className="eye-insights__message eye-insights__message--success">{successMessage}</p>
              ) : null}
            </div>
            <button
              className={`eye-insights__save${isSaveDisabled ? ' eye-insights__save--disabled' : ''}`}
              type="button"
              disabled={isSaveDisabled}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <p className="analysis-page__disclaimer">
          <strong>How we use your data:</strong> Iris images are encrypted, processed into non-identifying features, and can be
          removed at any time from your account.
        </p>
      </div>
    </section>
  );
}
