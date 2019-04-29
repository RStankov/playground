import * as React from 'react';
import { capitalize } from 'lodash';
import { Form as FinalForm } from 'react-final-form';
import { Field as FinalFormField } from 'react-final-form';
import { FormSpy } from 'react-final-form';

export default function Form({ defaultValues, onSubmit, children }) {
  return (
    <FinalForm onSubmit={onSubmit} initialValues={defaultValues || {}}>
      {({ handleSubmit }: any) => (
        <form onSubmit={handleSubmit}>{children}</form>
      )}
    </FinalForm>
  );
}

function FieldRow({ label, inputComponent, meta, input, ...inputProps }) {
  const error = meta.error || meta.submitError;

  const Input =
    typeof inputComponent === 'function'
      ? inputComponent
      : INPUTS[inputComponent];

  return (
    <label>
      {label || capitalize(input.name)}:{error && <mark>{error}</mark>}
      <div>
        <Input {...input} {...inputProps} />
      </div>
    </label>
  );
}

Form.Field = ({ input, ...inputProps }) => (
  <FinalFormField inputComponent={input} component={FieldRow} {...inputProps} />
);

Form.WithValues = FormSpy;

Form.SubmitButton = () => (
  <FormSpy>
    {(form: any) => (
      <input
        type="button"
        disabled={form.submitting}
        label={`Submit${form.submitting ? '...' : ''}`}
      />
    )}
  </FormSpy>
);

const INPUTS = {
  undefined: props => <input type="text" {...props} />,
  text: props => <input type="text" {...props} />,
  email: props => <input type="email" {...props} />,
  textarea: 'textarea',
  select: ({ options, ...props }) => (
    <select {...props}>
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
    <ul>
      {options.map(({ label, value }, i) => (
        <li key={i}>
          <label>
            <input
              type="radio"
              name={name}
              value={value}
              checked={value === selectedValue}
              onChange={e => onChange({ target: { value: e.target.value } })}
              {...props}
            />
            {label || value}
          </label>
        </li>
      ))}
    </ul>
  ),
};
