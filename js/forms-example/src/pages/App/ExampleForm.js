import * as React from 'react';
import Debug from 'components/Debug';
import { capitalize } from 'lodash';

const FormContext = React.createContext([{}, function() {}]);

export default function ExampleForm() {
  const state = React.useState({});

  return (
    <FormContext.Provider value={state}>
      <form onSubmit={onSubmit}>
        <Field name="title" />
        <Field name="description" input="textarea" />
        <Field name="email" input="email" />
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
  textarea: 'textarea',
  text: props => <input type="text" {...props} />,
  email: props => <input type="email" {...props} />,
  undefined: props => <input type="text" {...props} />,
};

function Field({ name, label, input }) {
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
      />
    </label>
  );
}
