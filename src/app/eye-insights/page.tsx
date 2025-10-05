import { UploadArea } from '../../components/UploadArea/UploadArea';
import { CheckboxGroup } from '../../components/CheckboxGroup/CheckboxGroup';
import { Button } from '../../components/Button/Button';

const healthOptions = [
  { id: 'health-none', label: 'None/healthy control' },
  { id: 'health-hypertension', label: 'Hypertension' },
  { id: 'health-diabetes', label: 'Diabetes' },
  { id: 'health-thyroid', label: 'Thyroid condition' },
  { id: 'health-other', label: 'Other' },
];

export default function EyeInsightsPage() {
  return (
    <main>
      <section className="o-section">
        <div className="o-panel">
          <div className="o-panel__surface">
            <header className="o-panel__header">
              <h1 className="o-panel__title">Add Iris Image</h1>
              <p className="o-panel__subtitle">
                Upload an iris image and share optional health details to help improve research insights.
              </p>
            </header>

            <UploadArea
              title="Upload Image"
              description="Drag and drop or click to upload"
            />

            <form className="c-form" aria-label="Self reported health">
              <CheckboxGroup legend="Self-reported health" options={healthOptions} />

              <div className="c-form__section">
                <label className="c-form__notes-label" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  className="c-form__textarea"
                  id="notes"
                  name="notes"
                  placeholder="Add any additional information here"
                />
              </div>

              <div className="c-form__actions">
                <Button as="button" size="sm" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
