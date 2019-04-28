import * as React from 'react';
import Debug from 'components/Debug';

const FormContext = React.createContext([{}, function() {}]);

export default function ExampleForm() {
  const state = React.useState({});

  return (
    <FormContext.Provider value={state}>
      <form onSubmit={onSubmit}>
        <Field label="Title" name="title" />
        <input type="submit" value="submit" />
        <Debug value={state[0]} />
      </form>
    </FormContext.Provider>
  );
}

function onSubmit(event) {
  event.preventDefault();
}

function Field({ label, name }) {
  const [values, setValues] = React.useContext(FormContext);

  const onChange = ({ target }) => {
    setValues({ ...values, [name]: target.value });
  };

  return (
    <label>
      {label}:
      <input
        type="text"
        onChange={onChange}
        name={name}
        value={values[name] || ''}
      />
    </label>
  );
}
