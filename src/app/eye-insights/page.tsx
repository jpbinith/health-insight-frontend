'use client';

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';

export default function EyeInsightsPage() {
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherDiseases, setOtherDiseases] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

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

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const list = Array.from(files);
    setSelectedFiles(list);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleFiles(event.dataTransfer?.files ?? null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  return (
    <section className="eye-insights">
      <div className="eye-insights__inner">
        <header className="eye-insights__header">
          <h1 className="eye-insights__title">Add Iris Image</h1>
        </header>

        <div
          className={`eye-insights__dropzone${dragActive ? ' eye-insights__dropzone--active' : ''}`}
          role="button"
          tabIndex={0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnter={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openFileDialog();
            }
          }}
        >
          <div className="eye-insights__dropzone-copy">
            <span className="eye-insights__dropzone-icon" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 16V7" />
                <path d="m8 11 4-4 4 4" />
                <path d="M20 16.58A5 5 0 0 0 18 7H17.26A8 8 0 1 0 4 15.25" />
                <path d="M16 16H8" />
              </svg>
            </span>
            <p className="eye-insights__dropzone-title">Upload Image</p>
            <p className="eye-insights__dropzone-hint">Drag and drop or click to upload</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="eye-insights__file-input"
            onChange={handleFileChange}
            tabIndex={-1}
          />
          {selectedFiles.length > 0 ? (
            <ul className="eye-insights__file-list">
              {selectedFiles.map((file, index) => (
                <li key={`${file.name}-${index}`} className="eye-insights__file-item">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="eye-insights__file-remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFile(index);
                    }}
                    aria-label={`Remove ${file.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <section aria-labelledby="health-heading" className="eye-insights__section">
          <h2 className="eye-insights__section-title" id="health-heading">
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
          <p className="eye-insights__consent-hint">
            Your files remain encrypted and may be deleted at any time.
          </p>
        </div>

        <div className="eye-insights__actions">
          <button
            className={`eye-insights__save${consentChecked ? '' : ' eye-insights__save--disabled'}`}
            type="button"
            disabled={!consentChecked}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
}
