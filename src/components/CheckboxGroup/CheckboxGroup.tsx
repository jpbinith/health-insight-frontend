type CheckboxOption = {
  id: string;
  label: string;
};

type CheckboxGroupProps = {
  legend: string;
  options: CheckboxOption[];
};

export function CheckboxGroup({ legend, options }: CheckboxGroupProps) {
  return (
    <fieldset className="c-form__section">
      <legend className="c-form__section-title">{legend}</legend>
      <div className="c-form__checkbox-list">
        {options.map((option) => (
          <label className="c-form__checkbox" htmlFor={option.id} key={option.id}>
            <input className="c-form__checkbox-input" id={option.id} name={option.id} type="checkbox" />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
