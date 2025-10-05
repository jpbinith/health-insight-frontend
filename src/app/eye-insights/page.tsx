'use client';

import { useState } from 'react';

export default function EyeInsightsPage() {
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherDiseases, setOtherDiseases] = useState<string[]>([]);

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

  return (
    <section className="eye-insights">
      <div className="eye-insights__inner">
        <header className="eye-insights__header">
          <h1 className="eye-insights__title">Add Iris Image</h1>
        </header>

        <div className="eye-insights__dropzone" role="button" tabIndex={0}>
          <div className="eye-insights__dropzone-copy">
            <p className="eye-insights__dropzone-title">Upload Image</p>
            <p className="eye-insights__dropzone-hint">Drag and drop or click to upload</p>
          </div>
          <button className="eye-insights__browse" type="button">
            Browse Files
          </button>
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

        <div className="eye-insights__actions">
          <button className="eye-insights__save" type="button">
            Save
          </button>
        </div>
      </div>
    </section>
  );
}
