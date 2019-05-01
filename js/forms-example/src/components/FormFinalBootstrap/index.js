import * as React from 'react';
import { capitalize } from 'lodash';
import { Form as FinalForm } from 'react-final-form';
import { Field as FinalFormField } from 'react-final-form';
import { FormSpy } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';

const MUTATORS = { ...arrayMutators };

export default function Form({ defaultValues, onSubmit, children }) {
  return (
    <FinalForm
      onSubmit={onSubmit}
      initialValues={defaultValues || {}}
      mutators={MUTATORS}>
      {({ handleSubmit }: any) => (
        <form onSubmit={handleSubmit}>{children}</form>
      )}
    </FinalForm>
  );
}

function FieldRow({
  label,
  inputComponent: Input,
  meta,
  input,
  fields,
  ...inputProps
}) {
  const error = meta.error || meta.submitError;
  const Wrap = Input.noLabelWrap ? 'div' : 'label';
  return (
    <Wrap className="form-group d-block">
      <div className="form-label d-block">
        {label || capitalize(input ? input.name : fields.name)}:
        {error && <span class="text-danger float-right">{error}</span>}
      </div>
      {fields ? (
        <Input fields={fields} {...inputProps} />
      ) : (
        <Input {...input} {...inputProps} />
      )}
    </Wrap>
  );
}

Form.Field = ({ input, ...inputProps }) => {
  const inputComponent = typeof input === 'function' ? input : INPUTS[input];

  const Field = inputComponent.isArray ? FieldArray : FinalFormField;

  return (
    <Field
      inputComponent={inputComponent}
      component={FieldRow}
      {...inputProps}
    />
  );
};

Form.Input = ({ type, ...props }) => (
  <FinalFormField component="input" type={type || 'text'} {...props} />
);

Form.State = FormSpy;

Form.SubmitButton = () => (
  <FormSpy>
    {(form: any) => (
      <input
        className="btn btn-primary"
        type="submit"
        disabled={form.submitting}
        value={`Submit${form.submitting ? '...' : ''}`}
      />
    )}
  </FormSpy>
);

Form.Status = () => (
  <FormSpy>
    {(form: any) => (
      <React.Fragment>
        {form.submitSucceeded && <span className="ml-2 text-success">👌 Submitted</span>}
        {form.submitting && <span className="ml-2 text-muted">💾 Saving…</span>}
        {form.submitFailed && <span className="ml-2 text-danger">🙀 Oh-oh! There has been an error…</span>}
      </React.Fragment>
    )}
  </FormSpy>
);
const INPUTS = {
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
INPUTS.radioGroup.noLabelWrap = true;
