import * as React from 'react';
import { capitalize } from 'lodash';

const FormContext = React.createContext([{}, function() {}]);

export default function Form({ defaultValues, onSubmit, children }) {
  const state = React.useState(defaultValues || {});

  function onFormSubmit(event) {
    event.preventDefault();
    onSubmit && onSubmit(state[0]);
  }

  return (
    <FormContext.Provider value={state}>
      <form onSubmit={onFormSubmit}>{children}</form>
    </FormContext.Provider>
  );
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
  radioGroup: ({ value: selectedValue, options, name, id, ...props }) => (
    <ul>
      {options.map(({ label, value }, i) => (
        <li key={i}>
          <label>
            <input
              type="radio"
              name={name}
              value={value}
              checked={value === selectedValue}
              {...props}
            />
            {label || value}
          </label>
        </li>
      ))}
    </ul>
  ),
};

function Field({ name, label, input, ...inputProps }) {
  const [values, setValues] = React.useContext(FormContext);

  const Input = typeof input === 'function' ? input : INPUTS[input];

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

function WithValues({ children }) {
  const [values] = React.useContext(FormContext);

  return children(values);
}

Form.Field = Field;
Form.WithValues = WithValues;
