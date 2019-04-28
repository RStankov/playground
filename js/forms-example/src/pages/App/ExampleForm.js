import * as React from 'react';
import Debug from 'components/Debug';
import { capitalize } from 'lodash';

const FormContext = React.createContext([{}, function() {}]);

const LENGTH_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
];

export default function ExampleForm() {
  const state = React.useState({});

  return (
    <FormContext.Provider value={state}>
      <form onSubmit={onSubmit}>
        <Field name="title" />
        <Field name="description" input="textarea" />
        <Field name="email" input="email" />
        <Field name="length" input="select" options={LENGTH_OPTIONS} />
        <input type="submit" value="submit" />
        <Debug value={state[0]} />
      </form>
    </FormContext.Provider>
  );
}

function onSubmit(event) {
  event.preventDefault();
}

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
};

function Field({ name, label, input, ...inputProps }) {
  const [values, setValues] = React.useContext(FormContext);

  const Input = INPUTS[input];

  return (
    <label>
      {label || capitalize(name)}:
      <Input
        onChange={({ target }) => {
          setValues({ ...values, [name]: target.value });
        }}
        name={name}
        value={values[name] || ''}
        {...inputProps}
      />
    </label>
  );
}
