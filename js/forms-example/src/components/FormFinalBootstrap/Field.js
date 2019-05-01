import * as React from 'react';
import { capitalize } from 'lodash';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import * as FinalForm from 'react-final-form';

function FieldRow({
  label,
  control: Control,
  meta,
  input,
  fields,
  ...inputProps
}) {
  const error = meta.error || meta.submitError;
  const Wrap = Control.noLabelWrap ? 'div' : 'label';
  return (
    <Wrap className="form-group d-block">
      <div className="form-label d-block">
        {label || capitalize(input ? input.name : fields.name)}:
        {error && <span className="text-danger float-right">{error}</span>}
      </div>
      {fields ? (
        <Control fields={fields} {...inputProps} />
      ) : (
        <Control {...input} {...inputProps} />
      )}
    </Wrap>
  );
}

export default function Field({ control, ...inputProps }) {
  control = typeof control === 'function' ? control : CONTROLS[control];

  const Field = control.isArray ? FieldArray : FinalForm.Field;
  return (
    <Field
      control={control}
      component={FieldRow}
      {...inputProps}
    />
  );
};

const CONTROLS = {
  undefined: props => <input type="text" className="form-control" {...props} />,
  text: props => <input type="text" className="form-control" {...props} />,
  email: props => <input type="email" className="form-control" {...props} />,
  textarea: props => <textarea className="form-control" {...props} />,
  select: ({ options, ...props }) => (
    <select className="form-control" {...props}>
      {options.map(({ label, value }, i) => (
        <option key={i} value={value}>
          {label || value}
        </option>
      ))}
    </select>
  ),
  radioGroup: ({
    value: selectedValue,
    options,
    name,
    id,
    onChange,
    ...props
  }) => (
    <ul className="pl-4">
      {options.map(({ label, value }, i) => (
        <li key={i}>
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="radio"
              name={name}
              value={value}
              checked={value === selectedValue}
              onChange={() => onChange(value)}
              {...props}
            />
            {label || value}
          </label>
        </li>
      ))}
    </ul>
  ),
};

CONTROLS.radioGroup.noLabelWrap = true;
