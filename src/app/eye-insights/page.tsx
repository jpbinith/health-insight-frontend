'use client';

import { useState } from 'react';
import { ImageUploader } from '../../components/ImageUploader/ImageUploader';

export default function EyeInsightsPage() {
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherDiseases, setOtherDiseases] = useState<string[]>([]);
  const [consentChecked, setConsentChecked] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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

  const filesSelected = uploadedFiles.length > 0;

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
            accept="image/*"
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
                <label className="eye-insights__checkbox">
                  <input className="eye-insights__checkbox-input" type="checkbox" name="health" value="none" />
                  <span>None/healthy control</span>
                </label>
                <label className="eye-insights__checkbox">
                  <input className="eye-insights__checkbox-input" type="checkbox" name="health" value="hypertension" />
                  <span>Hypertension</span>
                </label>
                <label className="eye-insights__checkbox">
                  <input className="eye-insights__checkbox-input" type="checkbox" name="health" value="diabetes" />
                  <span>Diabetes</span>
                </label>
                <label className="eye-insights__checkbox">
                  <input className="eye-insights__checkbox-input" type="checkbox" name="health" value="thyroid" />
                  <span>Thyroid condition</span>
                </label>
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
            <button
              className={`eye-insights__save${consentChecked && filesSelected ? '' : ' eye-insights__save--disabled'}`}
              type="button"
              disabled={!consentChecked || !filesSelected}
            >
              Save
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
